import os
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.prompts import PromptTemplate
from langchain.chains import LLMChain
from backend.prompts import PROMPT_TEMPLATES
from dotenv import load_dotenv

load_dotenv()  # Load environment variables from .env file

def get_llm_chain(role: str) -> LLMChain:
    """Initializes and returns a LangChain LLMChain for the given role."""
    print(f"[Agent] Initializing LLMChain for role: {role}")
    if role not in PROMPT_TEMPLATES:
        print(f"[Agent] Error: Role '{role}' is not supported.")
        raise ValueError(f"Role '{role}' is not supported.")

    # Make sure to set your GOOGLE_API_KEY as an environment variable
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        print("[Agent] Error: GEMINI_API_KEY not found.")
        raise ValueError("GEMINI_API_KEY not found in .env file or environment variables.")

    llm = ChatGoogleGenerativeAI(model="gemini-1.5-pro-latest", google_api_key=api_key)
    print("[Agent] ChatGoogleGenerativeAI model initialized.")

    prompt_template = PromptTemplate(
        template=PROMPT_TEMPLATES[role],
        input_variables=["transcript_chunk"],
    )
    print("[Agent] PromptTemplate created.")

    return LLMChain(llm=llm, prompt=prompt_template)

def generate_dialogue(role: str, transcript_chunk: str) -> str:
    """Generates dialogue suggestions for a given role and transcript chunk."""
    print(f"[Agent] Generating dialogue for role: {role} with chunk (first 50 chars): {transcript_chunk[:50]}...")
    llm_chain = get_llm_chain(role)
    response = llm_chain.run(transcript_chunk=transcript_chunk)
    print(f"[Agent] Dialogue generation complete. Response (first 50 chars): {response[:50]}...")
    return response
