from langchain.text_splitter import RecursiveCharacterTextSplitter

def chunk_transcript(transcript: str, chunk_size: int = 1000, chunk_overlap: int = 200):
    """Chunks the transcript into smaller, overlapping segments."""
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=chunk_size,
        chunk_overlap=chunk_overlap,
        length_function=len,
    )
    chunks = text_splitter.split_text(transcript)
    return chunks
