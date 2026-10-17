import os
from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, FileResponse
from fastapi.exceptions import RequestValidationError
from app.routers import cars, rentals, health
from app.config import settings

app = FastAPI(
    title="Drivora API",
    description="Drivora — Premium Car Rental Platform API. Drive. Rent. Explore.",
    version=settings.VERSION,
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json",
)

# Explicit CORS configuration for local frontend development origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

from fastapi.encoders import jsonable_encoder

# Custom exception handler for clean error responses
@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    errors = []
    for err in exc.errors():
        loc = " -> ".join(str(l) for l in err.get("loc", []))
        msg = str(err.get("msg", "Invalid input"))
        errors.append(f"{loc}: {msg}")
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={"detail": "; ".join(errors), "errors": jsonable_encoder(exc.errors())},
    )


# Include API routers
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
    return JSONResponse(status_code=404, content={"detail": "Logo asset not found"})
