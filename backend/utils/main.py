from fastapi import FastAPI
from api.routes import router

app = FastAPI(
    title="Employee Attrition Prediction API",
    description="Backend API for predicting employee attrition using Machine Learning",
    version="1.0.0",
)

# Include all API routes
app.include_router(router)

# Startup Event
@app.on_event("startup")
async def startup_event():
    print("✅ Employee Attrition Prediction API Started Successfully!")

# Shutdown Event
@app.on_event("shutdown")
async def shutdown_event():
    print("🛑 Employee Attrition Prediction API Stopped!")