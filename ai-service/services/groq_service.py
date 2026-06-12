from groq import Groq
from dotenv import load_dotenv
import os

load_dotenv()

client = Groq(
    api_key=os.getenv("GROQ_API_KEY")
)
def classify_ticket(description: str):

    prompt = f"""
You are an expert IT helpdesk classifier.

Analyze this ticket:

{description}

Return ONLY JSON.

Example:
{{
    "category": "Network",
    "priority": "High"
}}

Valid categories:
Network
Hardware
Software
Access
Other

Valid priorities:
Low
Medium
High
Critical
"""

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {
                "role": "user",
                "content": prompt
            }
        ],
        temperature=0
    )

    return response.choices[0].message.content