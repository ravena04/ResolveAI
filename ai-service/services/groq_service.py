from groq import Groq
from dotenv import load_dotenv
import os

load_dotenv()

client = Groq(
    api_key=os.getenv("GROQ_API_KEY")
)


def classify_ticket(
    description: str
):
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


def generate_rag_response(
    ticket_description: str,
    kb_context: str
):
    prompt = f"""
You are an expert IT support engineer.

Use the knowledge base information below to answer the user's issue.

Knowledge Base:

{kb_context}

User Ticket:

{ticket_description}

Provide:
1. Root cause
2. Troubleshooting steps
3. Recommended resolution

Keep the response practical and concise.
"""

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {
                "role": "user",
                "content": prompt
            }
        ],
        temperature=0.3
    )

    return response.choices[0].message.content