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
    if not request.transcript:
        raise HTTPException(status_code=400, detail="Transcript cannot be empty.")

    if not request.role:
        raise HTTPException(status_code=400, detail="Role cannot be empty.")

    try:
        # 1. Chunk the transcript
        chunks = chunk_transcript(request.transcript)

        # 2. Process each chunk and generate dialogue
        generated_dialogues = []
        for chunk in chunks:
            dialogue = generate_dialogue(role=request.role, transcript_chunk=chunk)
            generated_dialogues.append(dialogue)

        return {"generated_dialogues": generated_dialogues}

    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        # Catch-all for any other unexpected errors
        raise HTTPException(status_code=500, detail=f"An unexpected error occurred: {str(e)}")

@app.get("/")
async def root():
    return {"message": "Welcome to the Doppelgänger AI Transcript Analyzer API"}
