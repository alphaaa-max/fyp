export interface CurrentWeather {
  location: string;
  latitude: number;
  longitude: number;
  temperature: number;
  feelsLike: number;
  tempMin: number;
  tempMax: number;
  pressure: number;
  humidity: number;
  visibility: number;
  windSpeed: number;
  windDeg: number;
  cloudiness: number;
  condition: string;
  description: string;
  icon: string;
  sunrise: number;
  sunset: number;
  timezone: number;
  timestamp: Date;
}

export interface ForecastItem {
  timestamp: Date;
  temperature: number;
  feelsLike: number;
  tempMin: number;
  tempMax: number;
  pressure: number;
  humidity: number;
  windSpeed: number;
  windDeg: number;
  cloudiness: number;
  condition: string;
  description: string;
  icon: string;
  pop: number; // Probability of precipitation
  rain?: number;
  snow?: number;
}

export interface WeatherForecast {
  location: string;
  latitude: number;
  longitude: number;
  forecasts: ForecastItem[];
}

export interface PredictionRequest {
  latitude: number;
  longitude: number;
  hours: number;
}

export interface PredictionResponse {
  predictions: {
    temperature: number[];
    humidity: number[];
    rainfall: number[];
  };
  confidence: number;
  modelVersion: string;
}

export interface WeatherAlert {
  id: string;
  type: 'severe' | 'warning' | 'advisory' | 'info';
  title: string;
  message: string;
  location: string;
  severity: number;
  startTime: Date;
  endTime?: Date;
  isActive: boolean;
}
