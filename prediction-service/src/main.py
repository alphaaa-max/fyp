"""
ForeSight Prediction Service - FastAPI Application

This is an isolated microservice for weather predictions using statistical models.
It can be easily replaced with ChatGPT API or other ML services.
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .api.routes import router
import logging

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)

logger = logging.getLogger(__name__)

# Create FastAPI app
app = FastAPI(
    title="ForeSight Prediction Service",
    description="Statistical weather prediction microservice for ForeSight application",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure appropriately for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routes
app.include_router(router, prefix="/api")


@app.on_event("startup")
async def startup_event():
    """Run on application startup"""
    logger.info("🚀 Prediction Service starting up...")
    logger.info("📊 Statistical models loaded")
    logger.info("✅ Service ready to accept requests")


@app.on_event("shutdown")
async def shutdown_event():
    """Run on application shutdown"""
    logger.info("Prediction Service shutting down...")


@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "service": "ForeSight Prediction Service",
        "version": "1.0.0",
        "status": "healthy",
        "endpoints": {
            "docs": "/docs",
            "health": "/api/health",
            "temperature": "/api/predict/temperature",
            "rainfall": "/api/predict/rainfall",
            "trends": "/api/predict/trends",
        },
    }


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info",
    )
