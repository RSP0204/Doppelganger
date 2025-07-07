import os
# Commented out Gemini imports
# from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.prompts import PromptTemplate
from langchain.chains import LLMChain
from backend.prompts import PROMPT_TEMPLATES
from dotenv import load_dotenv
from backend.model_strategy import GeminiStrategy, MistralStrategy, AIModelStrategy

load_dotenv()  # Load environment variables from .env file

# --- Strategy Pattern Implementation ---
# Configure which AI model strategy to use
# To switch models, simply change the class assigned to CURRENT_MODEL_STRATEGY
CURRENT_MODEL_STRATEGY: AIModelStrategy = MistralStrategy()
# CURRENT_MODEL_STRATEGY: AIModelStrategy = GeminiStrategy() # Uncomment to switch back to Gemini

def get_llm_chain(role: str) -> LLMChain:
    """Initializes and returns a LangChain LLMChain for the given role using the selected strategy."""
    print(f"[Agent] Using strategy: {CURRENT_MODEL_STRATEGY.__class__.__name__}")
    return CURRENT_MODEL_STRATEGY.get_llm_chain(role)

def generate_dialogue(role: str, transcript_chunk: str) -> str:
    """Generates dialogue suggestions for a given role and transcript chunk."""
    print(f"[Agent] Generating dialogue for role: {role} with chunk (first 50 chars): {transcript_chunk[:50]}...")
    llm_chain = get_llm_chain(role)
    response = llm_chain.run(transcript_chunk=transcript_chunk)
    print(f"[Agent] Dialogue generation complete. Response (first 50 chars): {response[:50]}...")
    return response