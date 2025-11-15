"""
Pydantic schemas for API request/response validation
"""
from pydantic import BaseModel, Field
from typing import List


class PredictionRequest(BaseModel):
    """Request schema for prediction endpoints"""

    historical_data: List[float] = Field(
        ..., description="List of historical data points", min_items=1, max_items=1000
    )
    location: str = Field(..., description="Location identifier", max_length=100)
    forecast_hours: int = Field(
        default=24, description="Number of hours to forecast", ge=1, le=168
    )


class PredictionResponse(BaseModel):
    """Response schema for prediction endpoints"""

    predictions: List[float] = Field(..., description="Predicted values")
    confidence: float = Field(..., description="Confidence score (0-1)", ge=0, le=1)
    model_version: str = Field(..., description="Model version used")


class TrendRequest(BaseModel):
    """Request schema for trend analysis"""

    historical_data: List[float] = Field(
        ..., description="List of historical data points", min_items=3, max_items=1000
    )


class TrendResponse(BaseModel):
    """Response schema for trend analysis"""

    trend: str = Field(..., description="Trend direction (increasing/decreasing/stable)")
    slope: float = Field(..., description="Trend slope")
    confidence: float = Field(..., description="Confidence score (0-1)", ge=0, le=1)


class HealthResponse(BaseModel):
    """Response schema for health check"""

    status: str = Field(..., description="Service status")
    service: str = Field(default="prediction", description="Service name")
