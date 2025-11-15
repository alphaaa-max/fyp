"""
Temperature prediction model using statistical methods
"""
import numpy as np
from typing import List, Dict, Any
from sklearn.linear_model import LinearRegression
from statsmodels.tsa.holtwinters import ExponentialSmoothing
import warnings

warnings.filterwarnings('ignore')


class TemperaturePredictor:
    """Predicts temperature using exponential smoothing and linear regression"""

    def __init__(self):
        self.model = None

    def predict(self, historical_data: List[float], hours_ahead: int = 24) -> Dict[str, Any]:
        """
        Predict temperature for the next N hours

        Args:
            historical_data: List of historical temperature values
            hours_ahead: Number of hours to predict

        Returns:
            Dict containing predictions, confidence, and model info
        """
        if len(historical_data) < 3:
            # Not enough data, use simple average
            return self._fallback_prediction(historical_data, hours_ahead)

        try:
            # Use exponential smoothing for short-term forecasts
            if len(historical_data) >= 24:
                return self._exponential_smoothing_prediction(historical_data, hours_ahead)
            else:
                return self._linear_regression_prediction(historical_data, hours_ahead)
        except Exception as e:
            print(f"Prediction error: {e}")
            return self._fallback_prediction(historical_data, hours_ahead)

    def _exponential_smoothing_prediction(
        self, data: List[float], hours: int
    ) -> Dict[str, Any]:
        """Use exponential smoothing for prediction"""
        try:
            # Simple exponential smoothing (no seasonality for short data)
            model = ExponentialSmoothing(
                data, seasonal_periods=None, trend='add', seasonal=None
            )
            fitted = model.fit()
            forecast = fitted.forecast(steps=hours)

            # Calculate confidence based on data variance
            variance = np.var(data)
            confidence = max(0.6, min(0.95, 1 - (variance / 100)))

            return {
                'predictions': forecast.tolist(),
                'confidence': float(confidence),
                'model': 'exponential_smoothing',
            }
        except Exception as e:
            print(f"Exponential smoothing failed: {e}")
            return self._linear_regression_prediction(data, hours)

    def _linear_regression_prediction(
        self, data: List[float], hours: int
    ) -> Dict[str, Any]:
        """Use linear regression for trend prediction"""
        X = np.array(range(len(data))).reshape(-1, 1)
        y = np.array(data)

        model = LinearRegression()
        model.fit(X, y)

        # Predict future values
        future_X = np.array(range(len(data), len(data) + hours)).reshape(-1, 1)
        predictions = model.predict(future_X)

        # Calculate R² score as confidence
        confidence = max(0.5, min(0.9, model.score(X, y)))

        return {
            'predictions': predictions.tolist(),
            'confidence': float(confidence),
            'model': 'linear_regression',
        }

    def _fallback_prediction(self, data: List[float], hours: int) -> Dict[str, Any]:
        """Fallback to simple average when other methods fail"""
        avg = np.mean(data)
        # Add small random variation
        predictions = [
            avg + np.random.normal(0, 0.5) for _ in range(hours)
        ]

        return {
            'predictions': predictions,
            'confidence': 0.5,
            'model': 'fallback_average',
        }


class RainfallPredictor:
    """Predicts rainfall using moving averages"""

    def predict(self, historical_data: List[float], hours_ahead: int = 24) -> Dict[str, Any]:
        """
        Predict rainfall for the next N hours

        Args:
            historical_data: List of historical rainfall values
            hours_ahead: Number of hours to predict

        Returns:
            Dict containing predictions, confidence, and model info
        """
        if len(historical_data) < 3:
            return {
                'predictions': [0.0] * hours_ahead,
                'confidence': 0.4,
                'model': 'fallback',
            }

        # Calculate moving average
        window_size = min(6, len(historical_data))
        moving_avg = np.convolve(
            historical_data, np.ones(window_size) / window_size, mode='valid'
        )

        # Use last moving average value for prediction
        if len(moving_avg) > 0:
            predicted_value = float(moving_avg[-1])
        else:
            predicted_value = float(np.mean(historical_data))

        # Add small random variation
        predictions = [
            max(0, predicted_value + np.random.normal(0, 0.1))
            for _ in range(hours_ahead)
        ]

        # Calculate confidence based on data stability
        std_dev = np.std(historical_data)
        confidence = max(0.5, min(0.85, 1 - (std_dev / 10)))

        return {
            'predictions': predictions,
            'confidence': float(confidence),
            'model': 'moving_average',
        }


class TrendAnalyzer:
    """Analyzes weather trends"""

    def analyze(self, historical_data: List[float]) -> Dict[str, Any]:
        """
        Analyze trends in weather data

        Args:
            historical_data: List of historical values

        Returns:
            Dict containing trend analysis
        """
        if len(historical_data) < 3:
            return {
                'trend': 'stable',
                'slope': 0.0,
                'confidence': 0.5,
            }

        # Calculate linear trend
        X = np.array(range(len(historical_data))).reshape(-1, 1)
        y = np.array(historical_data)

        model = LinearRegression()
        model.fit(X, y)

        slope = float(model.coef_[0])

        # Determine trend direction
        if slope > 0.5:
            trend = 'increasing'
        elif slope < -0.5:
            trend = 'decreasing'
        else:
            trend = 'stable'

        confidence = float(max(0.5, min(0.95, model.score(X, y))))

        return {
            'trend': trend,
            'slope': slope,
            'confidence': confidence,
        }
