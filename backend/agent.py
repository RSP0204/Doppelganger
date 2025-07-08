import os
import json
import re
from backend.prompts import PROMPT_TEMPLATES
from dotenv import load_dotenv
from backend.model_strategy import GeminiStrategy, MistralStrategy, AIModelStrategy
from langchain_core.runnables import Runnable

from langchain_core.runnables import Runnable

load_dotenv()  # Load environment variables from .env file
print(f"[Agent] GEMINI_API_KEY: {os.getenv('GEMINI_API_KEY')}")

# --- Strategy Pattern Implementation ---
# Configure which AI model strategy to use
# To switch models, simply change the class assigned to CURRENT_MODEL_STRATEGY
# CURRENT_MODEL_STRATEGY: AIModelStrategy = MistralStrategy()
CURRENT_MODEL_STRATEGY: AIModelStrategy = GeminiStrategy() # Uncomment to switch back to Gemini

def get_llm_chain(role: str) -> Runnable:
    """Initializes and returns a LangChain Runnable for the given role using the selected strategy."""
    print(f"[Agent] Using strategy: {CURRENT_MODEL_STRATEGY.__class__.__name__}")
    return CURRENT_MODEL_STRATEGY.get_llm_chain(role)

def generate_dialogue(role: str, transcript_chunk: str) -> dict:
    """Generates dialogue suggestions for a given role and transcript chunk."""
    print(f"[Agent] Generating dialogue for role: {role} with chunk (first 50 chars): {transcript_chunk[:50]}...")
    llm_chain = get_llm_chain(role)
    response = llm_chain.invoke({'transcript_chunk': transcript_chunk})
    print(f"[Agent] Dialogue generation complete. Full response: {response}")
    try:
        # Extract JSON string from markdown code block
        json_match = re.search(r'```json\n(.*?)```', response.content, re.DOTALL)
        if json_match:
            json_string = json_match.group(1).strip()
            return json.loads(json_string)
        else:
            raise ValueError("No JSON markdown block found in LLM response.")
    except (json.JSONDecodeError, ValueError) as e:
        print(f"[Agent] Error decoding JSON from LLM response: {e}")
        print(f"[Agent] Raw LLM response content: {response.content}")
        return {"error": "Invalid JSON response from LLM", "details": str(e), "raw_response": response.content}