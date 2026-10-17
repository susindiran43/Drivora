"""
Drivora FastAPI Application Entrypoint
Provides CORS configuration, centralized exception handlers, API routers, and health routes.
"""
import logging
import os
from fastapi import FastAPI, HTTPException, Request, status
from fastapi.encoders import jsonable_encoder
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, JSONResponse

from app.config import settings
from app.routers import cars, health, rentals

# Configure logger
logger = logging.getLogger("drivora")
logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(name)s: %(message)s")

# Resolve modern HTTP_422 constant while preserving backward compatibility
HTTP_422 = getattr(status, "HTTP_422_UNPROCESSABLE_CONTENT", status.HTTP_422_UNPROCESSABLE_ENTITY)

app = FastAPI(
    title=settings.PROJECT_NAME,
    description=settings.DESCRIPTION,
    version=settings.VERSION,
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json",
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    """
    Formats request validation errors into a clean, human-readable summary.
    """
    errors = []
    for err in exc.errors():
        loc = " -> ".join(str(l) for l in err.get("loc", []))
        msg = str(err.get("msg", "Invalid input"))
        errors.append(f"{loc}: {msg}")
    return JSONResponse(
        status_code=HTTP_422,
        content={"detail": "; ".join(errors), "errors": jsonable_encoder(exc.errors())},
    )


@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    """
    Ensures standard structured JSON output for all HTTP exceptions.
    """
    return JSONResponse(
        status_code=exc.status_code,
        content={"detail": exc.detail},
        headers=exc.headers,
    )


@app.exception_handler(Exception)
async def general_exception_handler(request: Request, exc: Exception):
    """
    Catches unexpected internal exceptions and returns a safe error payload without leaking stack traces.
    """
    logger.error("Unhandled server exception on %s %s: %s", request.method, request.url.path, str(exc), exc_info=True)
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={"detail": "An internal server error occurred. Please contact the concierge if this persists."},
    )


# Mount routers
app.include_router(health.router)
app.include_router(cars.router)
app.include_router(rentals.router)


@app.get("/", summary="Root index")
def root():
    return {
        "brand": "Drivora",
        "tagline": "Drive. Rent. Explore.",
        "status": "operational",
        "docs": "/docs",
        "openapi": "/openapi.json",
    }


@app.get("/logo", summary="Brand logo asset")
def get_logo():
    logo_path = os.path.abspath(
        os.path.join(os.path.dirname(__file__), "..", "..", "assets", "drivora-logo.jpg")
    )
    if os.path.exists(logo_path):
        return FileResponse(logo_path, media_type="image/jpeg")
    return JSONResponse(status_code=status.HTTP_404_NOT_FOUND, content={"detail": "Logo asset not found"})
