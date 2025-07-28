import docx

def read_docx(file_path: str) -> str:
    """
    Reads the text from a .docx file.
    """
    try:
        doc = docx.Document(file_path)
        full_text = []
        for para in doc.paragraphs:
            full_text.append(para.text)
        return '\n'.join(full_text)
    except Exception as e:
        print(f"[Backend] Error reading .docx file: {e}")
        raise
