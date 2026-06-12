from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI
from routes.ai_routes import router

app = FastAPI(
    title="ResolveAI Service"
)

app.include_router(router)

@app.get("/")
def home():
    return {
        "message": "ResolveAI AI Service Running"
    }