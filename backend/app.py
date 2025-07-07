from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from backend.chunker import chunk_transcript
from backend.agent import generate_dialogue

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
    print(f"[Backend] Received request to process transcript for role: {request.role}")

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
            dialogue = generate_dialogue(role=request.role, transcript_chunk=chunk)
            generated_dialogues.append(dialogue)
            print(f"[Backend] Generated dialogue for chunk {i+1}: {dialogue[:50]}...") # Log first 50 chars

        print("[Backend] All dialogues generated successfully. Returning response.")
        return {"generated_dialogues": generated_dialogues}

    except ValueError as e:
        print(f"[Backend] ValueError during processing: {e}")
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        print(f"[Backend] Unexpected error during processing: {e}")
        # Catch-all for any other unexpected errors
        raise HTTPException(status_code=500, detail=f"An unexpected error occurred: {str(e)}")

@app.get("/")
async def root():
    return {"message": "Welcome to the Doppelgänger AI Transcript Analyzer API"}
