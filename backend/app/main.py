from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes import router

from app.database.database import engine, SessionLocal
from app.database.models import Base, User
from app.auth.security import hash_password

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


@app.on_event("startup")
def startup_event():
    print("======================================")
    print(" Employee Attrition Prediction API")
    print(" Server Started Successfully")
    print(" Swagger UI : http://127.0.0.1:8000/docs")
    print("======================================")
    
    # Auto-seed default HR user if database is empty of users
    db = SessionLocal()
    try:
        if db.query(User).count() == 0:
            default_user = User(
                name="HR Manager",
                email="admin@company.com",
                password=hash_password("admin123"),
                role="HR"
            )
            db.add(default_user)
            db.commit()
            print("Successfully seeded default HR user (admin@company.com / admin123)")
    except Exception as e:
        print(f"Error seeding database: {e}")
    finally:
        db.close()


@app.on_event("shutdown")
def shutdown_event():
    print("======================================")
    print(" Server Stopped Successfully")
    print("======================================")