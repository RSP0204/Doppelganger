import os
import tempfile
from fastapi import FastAPI, HTTPException, File, UploadFile, Form
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
        print(traceback.format_exc())
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
        # Create a temporary file to store the uploaded audio.
        # The file is read in chunks to avoid memory issues with large files.
        with tempfile.NamedTemporaryFile(delete=False, suffix=os.path.splitext(file.filename)[1]) as temp_audio_file:
            while content := await file.read(1024 * 1024):  # Read in 1MB chunks
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

@app.get("/")
async def root():
    return {"message": "Welcome to the Doppelgänger AI Transcript Analyzer API"}
