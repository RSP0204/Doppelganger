import os
import json
import re
from backend.prompts import PROMPT_TEMPLATES
from dotenv import load_dotenv
from backend.model_strategy import GeminiStrategy, MistralStrategy, AIModelStrategy
from langchain_core.runnables import Runnable
from backend.chunker import chunk_transcript

from langchain_core.runnables import Runnable

load_dotenv()  # Load environment variables from .env file
print(f"[Agent] GEMINI_API_KEY: {os.getenv('GEMINI_API_KEY')}")

# --- Strategy Pattern Implementation ---
# Configure which AI model strategy to use
# To switch models, simply change the class assigned to CURRENT_MODEL_STRATEGY
# CURRENT_MODEL_STRATEGY: AIModelStrategy = MistralStrategy()
CURRENT_MODEL_STRATEGY: AIModelStrategy = GeminiStrategy() # Uncomment to switch back to Gemini

def get_llm_chain(role: str, context: str = None) -> Runnable:
    """Initializes and returns a LangChain Runnable for the given role using the selected strategy."""
    print(f"[Agent] Using strategy: {CURRENT_MODEL_STRATEGY.__class__.__name__}")
    return CURRENT_MODEL_STRATEGY.get_llm_chain(role, context)

def generate_dialogue(role: str, transcript_chunk: str, context: str = None) -> dict:
    """Generates dialogue suggestions for a given role and transcript chunk."""
    print(f"[Agent] Generating dialogue for role: {role} with chunk (first 50 chars): {transcript_chunk[:50]}...")
    llm_chain = get_llm_chain(role, context)
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

def process_with_llm(transcribed_text: str, role: str) -> list[dict]:
    """Processes transcribed text with the LLM to generate dialogue for each chunk."""
    print(f"[Agent] Processing with LLM for role: {role} with text (first 50 chars): {transcribed_text[:50]}...")
    
    # 1. Chunk the transcript
    print("[Agent] Chunking transcript...")
    chunks = chunk_transcript(transcribed_text)
    print(f"[Agent] Transcript chunked into {len(chunks)} chunks.")

    # 2. Process each chunk and generate dialogue, ensuring no duplicate or nested questions
    generated_dialogues = []
    seen_questions = set()  # Keep track of questions we've already added

    for i, chunk in enumerate(chunks):
        print(f"[Agent] Generating dialogue for chunk {i+1}/{len(chunks)}...")
        dialogue_json = generate_dialogue(role=role, transcript_chunk=chunk)
        
        if "suggested_questions" in dialogue_json:
            unique_questions = []
            for question in dialogue_json["suggested_questions"]:
                question_text = ""
                # Handle both string and object-based questions
                if isinstance(question, dict) and "question" in question:
                    question_text = question["question"]
                elif isinstance(question, str):
                    question_text = question

                if question_text and question_text not in seen_questions:
                    unique_questions.append(question_text)
                    seen_questions.add(question_text)
            
            if unique_questions:  # Only add if there are new, unique questions
                dialogue_json["suggested_questions"] = unique_questions
                generated_dialogues.append(dialogue_json)
        else:
            # Handle cases where there's an error or no questions
            generated_dialogues.append(dialogue_json)

        print(f"[Agent] Generated dialogue for chunk {i+1}: {dialogue_json}")

    print("[Agent] All dialogues generated successfully.")
    return generated_dialogues