import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from api.routes import router

from database.database import engine
from database.models import Base

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


@app.get("/", tags=["Health Check"])
def root_health_check():
    return {
        "status": "ok",
        "message": "Employee Attrition Prediction API is running",
        "version": "1.0.0"
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