from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes import router

# Database
from app.database.database import engine
from app.database.models import Base

# Create FastAPI App
app = FastAPI(
    title="Employee Attrition Prediction API",
    description="Backend API for Employee Attrition Prediction System",
    version="1.0.0"
)

# Create Database Tables Automatically
Base.metadata.create_all(bind=engine)

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],      # Change to frontend URL in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include All Routes
app.include_router(router)


# Root API
@app.get("/", tags=["General"])
def root():
    return {
        "message": "Employee Attrition Prediction API",
        "status": "Running"
    }


# Health Check API
@app.get("/health", tags=["General"])
def health():
    return {
        "status": "Healthy"
    }


# Startup Event
@app.on_event("startup")
def startup_event():
    print("======================================")
    print(" Employee Attrition Prediction API ")
    print(" Server Started Successfully")
    print(" Swagger UI : http://127.0.0.1:8000/docs")
    print("======================================")


# Shutdown Event
@app.on_event("shutdown")
def shutdown_event():
    print("======================================")
    print(" Server Stopped Successfully")
    print("======================================")