from groq import Groq
from dotenv import load_dotenv
import os

load_dotenv()

client = Groq(
    api_key=os.getenv("GROQ_API_KEY")
)

def generate_solution(description: str):

    prompt = f"""
You are an expert IT support engineer.

A user submitted this issue:

{description}

Provide:
1. A short troubleshooting solution (3-5 steps).
2. A confidence score between 0 and 100.

Return ONLY valid JSON.

Example:

{{
  "suggestion": "Restart the VPN service, recreate the VPN profile, reboot the machine, and test connectivity.",
  "confidence": 92
}}
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