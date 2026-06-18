from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI
from routes.ai_routes import router
from routes.rag_routes import router as ragRouter

app = FastAPI(
    title="ResolveAI Service"
)

app.include_router(router)
app.include_router(ragRouter)

@app.get("/")
def home():
    return {
        "message": "ResolveAI AI Service Running"
    }