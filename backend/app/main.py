from fastapi import FastAPI
from database.db import Base, engine
from models.user import User
from api import user, auth, cloud, dashboard, prediction, threats, reports
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import uvicorn

app = FastAPI(
    title="AI for Secure Cloud Computing API",
    description="Backend API for AI-powered Secure Cloud Computing Platform",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

app.include_router(user.router)
app.include_router(auth.router)
app.include_router(cloud.router)
app.include_router(dashboard.router)
app.include_router(prediction.router)
app.include_router(threats.router)
app.include_router(reports.router)

# CORS Configuration
origins = [
    "http://localhost:5173",  # Vite Frontend
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/", tags=["Root"])
async def root():
    return {
        "message": "AI for Secure Cloud Computing Backend Running",
        "version": "1.0.0",
        "status": "healthy",
    }


@app.get("/health", tags=["Health"])
async def health_check():
    return {
        "status": "UP",
        "backend": "FastAPI",
        "ai_engine": "Ready",
        "database": "Not Connected",
        "ml_models": "Not Loaded",
    }


@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    return JSONResponse(
        status_code=500,
        content={
            "message": "Internal Server Error",
            "detail": str(exc),
        },
    )


if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
    )