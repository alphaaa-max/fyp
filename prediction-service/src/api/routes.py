"""
API routes for prediction service
"""
from fastapi import APIRouter, HTTPException
from .schemas import (
    PredictionRequest,
    PredictionResponse,
    TrendRequest,
    TrendResponse,
    HealthResponse,
)
from ..models.temperature_model import (
    TemperaturePredictor,
    RainfallPredictor,
    TrendAnalyzer,
)

router = APIRouter()

# Initialize predictors
temp_predictor = TemperaturePredictor()
rain_predictor = RainfallPredictor()
trend_analyzer = TrendAnalyzer()


@router.post("/predict/temperature", response_model=PredictionResponse)
async def predict_temperature(request: PredictionRequest):
    """
    Predict temperature for the specified number of hours

    - **historical_data**: List of historical temperature values
    - **location**: Location identifier
    - **forecast_hours**: Number of hours to predict (1-168)
    """
    try:
        result = temp_predictor.predict(request.historical_data, request.forecast_hours)

        return PredictionResponse(
            predictions=result['predictions'],
            confidence=result['confidence'],
            model_version=f"v1.0_{result['model']}",
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")


@router.post("/predict/rainfall", response_model=PredictionResponse)
async def predict_rainfall(request: PredictionRequest):
    """
    Predict rainfall for the specified number of hours

    - **historical_data**: List of historical rainfall values
    - **location**: Location identifier
    - **forecast_hours**: Number of hours to predict (1-168)
    """
    try:
        result = rain_predictor.predict(request.historical_data, request.forecast_hours)

        return PredictionResponse(
            predictions=result['predictions'],
            confidence=result['confidence'],
            model_version=f"v1.0_{result['model']}",
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")


@router.post("/predict/trends", response_model=TrendResponse)
async def analyze_trends(request: TrendRequest):
    """
    Analyze trends in historical weather data

    - **historical_data**: List of historical data points (minimum 3)
    """
    try:
        result = trend_analyzer.analyze(request.historical_data)

        return TrendResponse(
            trend=result['trend'],
            slope=result['slope'],
            confidence=result['confidence'],
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")


@router.get("/health", response_model=HealthResponse)
async def health_check():
    """
    Health check endpoint

    Returns the status of the prediction service
    """
    return HealthResponse(status="healthy", service="prediction")
