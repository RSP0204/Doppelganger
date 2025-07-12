import os
from fastapi import FastAPI, HTTPException, File, UploadFile
from pydantic import BaseModel
from backend.chunker import chunk_transcript
from backend.agent import generate_dialogue, process_with_llm
from backend.transcriber import transcribe_audio

# Path to your service-account key
os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = "service-account.json"

# To run this app, use the following command in your terminal:
# uvicorn backend.app:app --reload

app = FastAPI()

class TranscriptRequest(BaseModel):
    transcript: str
    role: str

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
async def process_audio(file: UploadFile = File(...), role: str = ""):
    """
    This endpoint receives an audio file, transcribes it, processes the transcript in chunks,
    and returns a list of AI-generated questions and statements for each chunk.
    """
    if not file:
        raise HTTPException(status_code=400, detail="File cannot be empty.")
    if not role:
        raise HTTPException(status_code=400, detail="Role cannot be empty.")

    try:
        # 1. Transcribe the audio file
        transcript = transcribe_audio(file.file)

        # 2. Process the entire transcript with LLM to get three questions
        generated_questions = process_with_llm(transcribed_text=transcript, role=role)

        return {"generated_questions": generated_questions}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An unexpected error occurred: {str(e)}")

@app.get("/")
async def root():
    return {"message": "Welcome to the Doppelgänger AI Transcript Analyzer API"}
