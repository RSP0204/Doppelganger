import os
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.prompts import PromptTemplate
from langchain.chains import LLMChain
from backend.prompts import PROMPT_TEMPLATES
from dotenv import load_dotenv

load_dotenv()  # Load environment variables from .env file

def get_llm_chain(role: str) -> LLMChain:
    """Initializes and returns a LangChain LLMChain for the given role."""
    if role not in PROMPT_TEMPLATES:
        raise ValueError(f"Role '{role}' is not supported.")

    # Make sure to set your GOOGLE_API_KEY as an environment variable
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise ValueError("GEMINI_API_KEY not found in .env file or environment variables.")

    llm = ChatGoogleGenerativeAI(model="gemini-pro", google_api_key=api_key)

    prompt_template = PromptTemplate(
        template=PROMPT_TEMPLATES[role],
        input_variables=["transcript_chunk"],
    )

    return LLMChain(llm=llm, prompt=prompt_template)

def generate_dialogue(role: str, transcript_chunk: str) -> str:
    """Generates dialogue suggestions for a given role and transcript chunk."""
    llm_chain = get_llm_chain(role)
    response = llm_chain.run(transcript_chunk=transcript_chunk)
    return response
