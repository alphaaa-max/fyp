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
  timestamp: string;
}

export interface ForecastItem {
  timestamp: string;
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

export interface WeatherPrediction {
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
  isRead: boolean;
  isActive: boolean;
  startTime: string;
  endTime?: string;
  createdAt: string;
}
