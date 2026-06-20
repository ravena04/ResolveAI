from langchain_chroma import Chroma
from langchain_community.embeddings import (
    SentenceTransformerEmbeddings
)

from services.groq_service import (
    generate_rag_response
)

embedding_function = (
    SentenceTransformerEmbeddings(
        model_name="all-MiniLM-L6-v2"
    )
)

vectorstore = Chroma(
    collection_name="knowledge_base",
    persist_directory="./chroma_db",
    embedding_function=embedding_function
)

retriever = vectorstore.as_retriever(
    search_kwargs={
        "k": 3
    }
)


def langchain_rag(
    query: str
):
    docs = retriever.invoke(
        query
    )

    context = "\n\n".join(
        [
            doc.page_content
            for doc in docs
        ]
    )

    answer = generate_rag_response(
        query,
        context
    )

    return {
        "query": query,
        "context": context,
        "answer": answer
    }