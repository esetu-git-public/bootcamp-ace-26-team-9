from fastapi import APIRouter

from api.auth_routes import router as auth_router
from api.dataset_routes import router as dataset_router
from api.training_routes import router as training_router
from api.prediction_routes import router as prediction_router
from api.history_routes import router as history_router
from api.employee_routes import router as employee_router
from api.dashboard_routes import router as dashboard_router
from api.report_routes import router as report_router
from api.session_routes import router as session_router

router = APIRouter()

router.include_router(auth_router)
router.include_router(dataset_router)
router.include_router(training_router)
router.include_router(prediction_router)
router.include_router(history_router)
router.include_router(employee_router)
router.include_router(dashboard_router)
router.include_router(report_router)
router.include_router(session_router)
