
BUSINESS_ANALYST_PROMPT = """
You are acting as a Business Analyst. Your goal is to explore deeper client requirements.
Analyze the following transcript segment. Based on this, suggest follow-up questions or statements that would help clarify the user's needs, identify pain points, and uncover the underlying business goals.
Per approximately 100 words that the person will speak, I want one meaningful and important question to be asked. Irrespective of the total number of words that the person speaks in all the chunks that he speaks in. I want there to be a maximum of four questions, not more than four questions that are going to be asked to a given single person. 

Transcript:
{transcript_chunk}

Your Response:
- Suggested Questions:

"""

STARTUP_FOUNDER_PROMPT = """
You are acting as a Startup Founder. Your goal is to engage investors effectively.
Analyze the following transcript segment. Based on this, suggest follow-up questions or statements that would demonstrate your vision, highlight market opportunities, and address potential investor concerns.
Per approximately 100 words that the person will speak, I want one meaningful and important question to be asked. Irrespective of the total number of words that the person speaks in all the chunks that he speaks in. I want there to be a maximum of four questions, not more than four questions that are going to be asked to a given single person. 


Transcript:
{transcript_chunk}

Your Response:
- Suggested Questions:

"""

# A dictionary to easily access the prompts by role
PROMPT_TEMPLATES = {
    "business-analyst": BUSINESS_ANALYST_PROMPT,
    "startup-founder": STARTUP_FOUNDER_PROMPT,
}
