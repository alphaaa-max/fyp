# ForeSight Prediction Service

Isolated microservice for weather predictions using statistical models.

## Features

- Temperature prediction using Exponential Smoothing
- Rainfall prediction using Linear Regression
- Trend analysis using moving averages
- RESTful API with FastAPI
- Docker containerization
- Easy to replace with other ML services (ChatGPT, etc.)

## Tech Stack

- Python 3.11
- FastAPI
- NumPy, Pandas
- scikit-learn
- statsmodels

## Setup

1. Create virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Run development server:
```bash
uvicorn src.main:app --reload
```

## Docker

Build and run with Docker:
```bash
docker build -t foresight-prediction .
docker run -p 8000:8000 foresight-prediction
```

## API Endpoints

- `POST /api/predict/temperature` - Predict temperature
- `POST /api/predict/rainfall` - Predict rainfall
- `POST /api/predict/trends` - Analyze trends
- `GET /api/health` - Health check

## Replacing with Other Services

To replace this service with ChatGPT or another ML service:

1. Update the main server's `prediction.service.ts`
2. Point to the new service URL
3. No changes needed in the mobile app

The isolation ensures easy swapping of prediction backends!
