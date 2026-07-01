from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import uvicorn
from threading import Thread
import time

from database.db import Base, engine, SessionLocal
from services.simulator import run_simulation
from models.user import User
from models.server import Server
from models.resource import CloudResource
from models.attack import Attack
from models.prediction import Prediction

from api import (
    user,
    auth,
    cloud,
    dashboard,
    prediction,
    threats,
    reports,
    server,
    resource,
    ml_prediction
)

# Create database tables
Base.metadata.create_all(bind=engine)

def background_worker():
    while True:
        try:
            db = SessionLocal()
            # your logic here
            db.close()
        except Exception as e:
            print("Worker error:", e)

        time.sleep(5)  # every 5 seconds
# Create FastAPI application
app = FastAPI(
    title="AI for Secure Cloud Computing API",
    description="Backend API for AI-powered Secure Cloud Computing Platform",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# Register routers
app.include_router(user.router)
app.include_router(auth.router)
app.include_router(cloud.router)
app.include_router(dashboard.router)
app.include_router(prediction.router)
app.include_router(threats.router)
app.include_router(reports.router)
app.include_router(server.router)
app.include_router(resource.router)
app.include_router(ml_prediction.router)

# CORS Configuration
origins = [
    "http://localhost:5173",
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
        "database": "Connected",
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
@app.on_event("startup")
def start_simulator():
    thread = Thread(target=background_worker, daemon=True)
    thread.start()


if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
    )