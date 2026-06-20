from services.langchain_service import (
    langchain_rag
)

result = langchain_rag(
    "VPN stopped working after Windows update"
)

print(result)