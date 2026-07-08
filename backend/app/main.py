from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import uvicorn
from threading import Thread
import time

from app.database.db import Base, engine, SessionLocal
from app.services.simulator import run_simulation
from app.api import (
    user,
    auth,
    cloud,
    dashboard,
    prediction,
    threats,
    reports,
    server,
    resource,
    notifications,
    ml_prediction
)

# Create database tables
Base.metadata.create_all(bind=engine)

def background_worker():
    while True:
        try:
            db = SessionLocal()
            print("Running background simulation...")
            run_simulation(db)
            db.close()
        except Exception as e:
            print(f"An error occurred in the background worker: {e}")
        time.sleep(60)  # Run simulation every 60 seconds
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
app.include_router(notifications.router)
# CORS Configuration

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
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
async def startup_event():
    thread = Thread(target=background_worker, daemon=True)
    thread.start()

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
    )