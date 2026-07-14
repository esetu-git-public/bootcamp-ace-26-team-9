from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes import router

from app.database.database import engine
from app.database.models import Base

# Create FastAPI App
app = FastAPI(
    title="Employee Attrition Prediction API",
    description="Backend API for Employee Attrition Prediction System",
    version="1.0.0"
)

# Create Database Tables
Base.metadata.create_all(bind=engine)

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change this in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include all routes
app.include_router(router)


@app.get("/health", tags=["Health"])
def health_check():
    import datetime
    from app.services.prediction_service import PredictionService
    model_loaded = False
    try:
        PredictionService.load_model()
        model_loaded = True
    except Exception:
        pass
    return {
        "status": "healthy",
        "model_loaded": model_loaded,
        "timestamp": datetime.datetime.utcnow().isoformat() + "Z"
    }



@app.on_event("startup")
def startup_event():
    print("======================================")
    print(" Employee Attrition Prediction API")
    print(" Server Started Successfully")
    print(" Swagger UI : http://127.0.0.1:8000/docs")
    print("======================================")


@app.on_event("shutdown")
def shutdown_event():
    print("======================================")
    print(" Server Stopped Successfully")
    print("======================================")