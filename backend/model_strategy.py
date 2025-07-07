from abc import ABC, abstractmethod
import os
from langchain.prompts import PromptTemplate
from langchain.chains import LLMChain
from backend.prompts import PROMPT_TEMPLATES

from langchain_google_genai import ChatGoogleGenerativeAI

# Mistral AI import
from langchain_mistralai import ChatMistralAI

class AIModelStrategy(ABC):
    @abstractmethod
    def get_llm_chain(self, role: str) -> LLMChain:
        pass

class GeminiStrategy(AIModelStrategy):
    def get_llm_chain(self, role: str) -> LLMChain:
        print(f"[GeminiStrategy] Initializing LLMChain for role: {role}")
        if role not in PROMPT_TEMPLATES:
            raise ValueError(f"Role '{role}' is not supported.")

        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key:
            raise ValueError("GEMINI_API_KEY not found in .env file or environment variables.")
        print(f"[DEBUG] Using Gemini API Key (last 5 chars): *****{api_key[-5:]}")

        llm = ChatGoogleGenerativeAI(model="gemini-1.5-pro-latest", google_api_key=api_key)
        print("[GeminiStrategy] ChatGoogleGenerativeAI model initialized.")

        prompt_template = PromptTemplate(
            template=PROMPT_TEMPLATES[role],
            input_variables=["transcript_chunk"],
        )
        print("[GeminiStrategy] PromptTemplate created.")

        return LLMChain(llm=llm, prompt=prompt_template)

class MistralStrategy(AIModelStrategy):
    def get_llm_chain(self, role: str) -> LLMChain:
        print(f"[MistralStrategy] Initializing LLMChain for role: {role}")
        if role not in PROMPT_TEMPLATES:
            raise ValueError(f"Role '{role}' is not supported.")

        api_key = os.getenv("MISTRAL_API_KEY")
        if not api_key:
            raise ValueError("MISTRAL_API_KEY not found in .env file or environment variables. Mistral AI requires an API key for hosted models.")

        # Using the specified Mistral model
        llm = ChatMistralAI(model="mistralai/mistral-small-3.2", mistral_api_key=api_key)
        print("[MistralStrategy] ChatMistralAI model initialized with mistralai/mistral-small-3.2.")

        prompt_template = PromptTemplate(
            template=PROMPT_TEMPLATES[role],
            input_variables=["transcript_chunk"],
        )
        print("[MistralStrategy] PromptTemplate created.")

        return LLMChain(llm=llm, prompt=prompt_template)
