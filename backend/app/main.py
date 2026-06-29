from fastapi import FastAPI
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


@app.get("/dashboard", tags=["Dashboard"])
async def dashboard():
    return {
        "active_servers": 12,
        "threats_detected": 28,
        "high_risk_alerts": 4,
        "cpu_usage": 54,
        "memory_usage": 68,
        "prediction_accuracy": 98.4,
    }


@app.get("/cloud", tags=["Cloud"])
async def cloud_status():
    return {
        "provider": "Demo Cloud",
        "instances": 12,
        "running": 11,
        "stopped": 1,
    }


@app.get("/threats", tags=["Threat Detection"])
async def threats():
    return {
        "threats": [
            {
                "id": 1,
                "type": "Brute Force",
                "severity": "High",
                "status": "Blocked",
            },
            {
                "id": 2,
                "type": "Port Scan",
                "severity": "Medium",
                "status": "Monitoring",
            },
        ]
    }


@app.get("/prediction", tags=["AI Prediction"])
async def prediction():
    return {
        "risk_score": 0.13,
        "prediction": "Safe",
        "confidence": "98.4%",
    }


@app.get("/reports", tags=["Reports"])
async def reports():
    return {
        "generated_reports": 25,
        "latest_report": "Weekly Security Report",
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