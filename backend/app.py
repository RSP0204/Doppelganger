import os
import tempfile
import uuid
import json
from fastapi import FastAPI, HTTPException, File, UploadFile, Form, BackgroundTasks, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from passlib.context import CryptContext
from backend.chunker import chunk_transcript
from backend.agent import generate_dialogue, process_with_llm
from backend.transcriber import transcribe_audio
from backend.document_processing import read_docx
from google.cloud import speech

# Path to your service-account key
os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = "service-account.json"

# To run this app, use the following command in your terminal:
# uvicorn backend.app:app

app = FastAPI()

# CORS Middleware
origins = [
    "http://localhost",
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Password Hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# User data file
USER_DATA_FILE = os.path.join(os.path.dirname(__file__), "userdata.json")

class User(BaseModel):
    email: str
    password: str

class UserInDB(User):
    hashed_password: str

def get_user(email: str):
    if not os.path.exists(USER_DATA_FILE):
        return None
    with open(USER_DATA_FILE, "r") as f:
        users = json.load(f)
    for user in users:
        if user["email"] == email:
            return user
    return None

@app.post("/api/signup")
async def signup(user: User):
    if get_user(user.email):
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_password = pwd_context.hash(user.password)
    user_in_db = UserInDB(email=user.email, password=user.password, hashed_password=hashed_password)
    
    users = []
    if os.path.exists(USER_DATA_FILE):
        with open(USER_DATA_FILE, "r") as f:
            users = json.load(f)
            
    users.append(user_in_db.dict())
    
    with open(USER_DATA_FILE, "w") as f:
        json.dump(users, f, indent=4)
        
    return {"message": "User created successfully"}

@app.post("/api/login")
async def login(user: User):
    db_user = get_user(user.email)
    if not db_user or not pwd_context.verify(user.password, db_user["hashed_password"]):
        raise HTTPException(status_code=400, detail="Incorrect email or password")
    
    return {"message": "Login successful"}

class TranscriptRequest(BaseModel):
    transcript: str
    role: str

# In-memory storage for task status and results
tasks = {}

def run_processing(task_id: str, temp_doc_file_path: str, role: str):
    """Wrapper function to run the processing and store the result."""
    try:
        print("[Backend] Attempting to read .docx file...")
        document_text = read_docx(temp_doc_file_path)
        print(f"[Backend] .docx file read. Text length: {len(document_text)} characters.")
        
        result = process_with_llm(transcribed_text=document_text, role=role)
        tasks[task_id] = {"status": "completed", "result": {"generated_dialogues": result}}
    except Exception as e:
        tasks[task_id] = {"status": "failed", "error": str(e)}
    finally:
        # Clean up the temporary file
        if os.path.exists(temp_doc_file_path):
            os.remove(temp_doc_file_path)

@app.post("/process-transcript")
async def process_transcript(request: TranscriptRequest):
    """
    This endpoint receives a transcript and a role, processes the transcript in chunks,
    and returns a list of AI-generated questions and statements for each chunk.
    """
    print(f"[Backend] Received request to process transcript. Role: '{request.role}', Transcript length: {len(request.transcript)} characters.")

    if not request.transcript:
        print("[Backend] Error: Transcript cannot be empty.")
        raise HTTPException(status_code=400, detail="Transcript cannot be empty.")

    if not request.role:
        print("[Backend] Error: Role cannot be empty.")
        raise HTTPException(status_code=400, detail="Role cannot be empty.")

    try:
        # 1. Chunk the transcript
        print("[Backend] Chunking transcript...")
        chunks = chunk_transcript(request.transcript)
        print(f"[Backend] Transcript chunked into {len(chunks)} chunks.")

        # 2. Process each chunk and generate dialogue
        generated_dialogues = []
        for i, chunk in enumerate(chunks):
            print(f"[Backend] Generating dialogue for chunk {i+1}/{len(chunks)}...")
            dialogue_json = generate_dialogue(role=request.role, transcript_chunk=chunk)
            generated_dialogues.append(dialogue_json)
            print(f"[Backend] Generated dialogue for chunk {i+1}: {dialogue_json}")

        print("[Backend] All dialogues generated successfully. Returning response.")
        return {"generated_dialogues": generated_dialogues}

    except ValueError as e:
        print(f"[Backend] ValueError during processing: {e}")
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        print(f"[Backend] Unexpected error during processing: {e}")
        # Catch-all for any other unexpected errors
        raise HTTPException(status_code=500, detail=f"An unexpected error occurred: {str(e)}")

@app.post("/process-audio")
async def process_audio(file: UploadFile = File(...), role: str = Form(...)):
    print(f"[Backend] Received audio file: {file.filename}, Role: '{role}'")
    """
    This endpoint receives an audio file, transcribes it, processes the transcript in chunks,
    and returns a list of AI-generated questions and statements for each chunk.
    """
    if not file:
        print("[Backend] Error: File cannot be empty.")
        raise HTTPException(status_code=400, detail="File cannot be empty.")
    if not role:
        print("[Backend] Error: Role cannot be empty.")
        raise HTTPException(status_code=400, detail="Role cannot be empty.")

    try:
        # Create a temporary file to store the uploaded audio
        with tempfile.NamedTemporaryFile(delete=False, suffix=os.path.splitext(file.filename)[1]) as temp_audio_file:
            content = await file.read()
            temp_audio_file.write(content)
            temp_audio_file_path = temp_audio_file.name

        print("[Backend] Attempting to transcribe audio...")
        transcript = transcribe_audio(temp_audio_file_path)
        print(f"[Backend] Audio transcribed. Transcript length: {len(transcript)} characters.")

    except Exception as e:
        print(f"[Backend] Error during audio transcription: {e}")
        raise HTTPException(status_code=500, detail=f"Audio transcription failed: {str(e)}")
    finally:
        # Clean up the temporary file
        if 'temp_audio_file_path' in locals() and os.path.exists(temp_audio_file_path):
            os.remove(temp_audio_file_path)

    try:
        print("[Backend] Attempting to process transcript with LLM...")
        generated_dialogues = process_with_llm(transcribed_text=transcript, role=role)
        print("[Backend] LLM processing complete.")
        return {"generated_dialogues": generated_dialogues}
    except Exception as e:
        print(f"[Backend] Error during LLM processing: {e}")
        raise HTTPException(status_code=500, detail=f"LLM processing failed: {str(e)}")

@app.post("/process-document")
async def process_document(background_tasks: BackgroundTasks, file: UploadFile = File(...), role: str = Form(...)):
    print(f"[Backend] Received document: {file.filename}, Role: '{role}'")
    """
    This endpoint receives a .docx file, extracts the text, processes it in the background,
    and returns a task ID.
    """
    if not file:
        print("[Backend] Error: File cannot be empty.")
        raise HTTPException(status_code=400, detail="File cannot be empty.")
    if not role:
        print("[Backend] Error: Role cannot be empty.")
        raise HTTPException(status_code=400, detail="Role cannot be empty.")

    # Check for allowed file extension
    if not file.filename.endswith(".docx"):
        raise HTTPException(status_code=400, detail="Invalid file type. Only .docx files are accepted.")

    try:
        # Create a temporary file to store the uploaded document
        with tempfile.NamedTemporaryFile(delete=False, suffix=".docx") as temp_doc_file:
            content = await file.read()
            temp_doc_file.write(content)
            temp_doc_file_path = temp_doc_file.name

    except Exception as e:
        print(f"[Backend] Error during .docx processing: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to process .docx file: {str(e)}")

    task_id = str(uuid.uuid4())
    tasks[task_id] = {"status": "processing"}
    background_tasks.add_task(run_processing, task_id, temp_doc_file_path, role)
    
    return {"message": "Processing started", "task_id": task_id}

@app.get("/status/{task_id}")
async def get_status(task_id: str):
    """
    This endpoint returns the status and result of a background task.
    """
    task = tasks.get(task_id)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    return task

@app.websocket("/ws/live-std-questions")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    
    # Default values, will be updated by the client
    conversation_context = ""
    word_chunk_count = 90

    # Receive settings from the client
    try:
        settings_data = await websocket.receive_json()
        if settings_data.get("type") == "settings":
            conversation_context = settings_data.get("conversationContext", "")
            word_chunk_count = settings_data.get("wordChunkCount", 90)
    except Exception as e:
        print(f"Error receiving settings: {e}")
        await websocket.close()
        return

    # Speech-to-Text setup
    client = speech.SpeechClient()
    config = speech.RecognitionConfig(
        encoding=speech.RecognitionConfig.AudioEncoding.LINEAR16,
        sample_rate_hertz=16000,
        language_code="en-US",
        enable_automatic_punctuation=True,
    )
    
    streaming_config = speech.StreamingRecognitionConfig(config=config, interim_results=True)
    
    async def audio_generator(ws: WebSocket):
        while True:
            try:
                data = await ws.receive_bytes()
                yield speech.StreamingRecognizeRequest(audio_content=data)
            except WebSocketDisconnect:
                break

    requests = audio_generator(websocket)
    responses = client.streaming_recognize(streaming_config, requests)
    
    transcript_buffer = ""
    
    try:
        for response in responses:
            if not response.results:
                continue

            result = response.results[0]
            if not result.alternatives:
                continue

            transcript = result.alternatives[0].transcript
            
            if result.is_final:
                transcript_buffer += transcript + " "
                
                await websocket.send_json({"type": "final_transcript", "data": transcript_buffer})

                if len(transcript_buffer.split()) >= word_chunk_count:
                    # Generate questions
                    dialogue = generate_dialogue(role="interviewer", transcript_chunk=transcript_buffer, context=conversation_context)
                    questions = [item for item in dialogue if item.startswith("Q:")]

                    await websocket.send_json({"type": "questions", "data": questions})
                    
                    # Reset buffer
                    transcript_buffer = ""
            else:
                await websocket.send_json({"type": "interim_transcript", "data": transcript})

    except Exception as e:
        print(f"Error in WebSocket: {e}")
    finally:
        await websocket.close()


@app.post("/api/transcribe-context")
async def transcribe_context(file: UploadFile = File(...)):
    """
    This endpoint receives a small audio file for the context, transcribes it,
    and returns the transcript.
    """
    try:
        with tempfile.NamedTemporaryFile(delete=False, suffix=".webm") as temp_audio_file:
            content = await file.read()
            temp_audio_file.write(content)
            temp_audio_file_path = temp_audio_file.name

        transcript = transcribe_audio(temp_audio_file_path)
        return {"transcript": transcript}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Audio transcription failed: {str(e)}")
    finally:
        if 'temp_audio_file_path' in locals() and os.path.exists(temp_audio_file_path):
            os.remove(temp_audio_file_path)


@app.get("/")
async def root():
    return {"message": "Welcome to the Doppelgänger AI Transcript Analyzer API"}
