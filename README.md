# ForeSight - Predictive Weather Insights using Advanced Data Analytics

A comprehensive weather forecasting application with AI-powered predictions, built as a Final Year Project.

## 📱 Project Overview

ForeSight is a full-stack weather application that provides:
- ✅ **Real-time weather data** from OpenWeatherMap API
- ✅ **AI-powered predictive insights** using statistical models
- ✅ **Location-based forecasts** with saved locations
- ✅ **Weather alerts and notifications** based on severity
- ✅ **Health and safety recommendations**
- ✅ **Interactive data visualizations** with charts
- ✅ **Beautiful weather-themed UI** with dynamic gradients

## 🏗️ Architecture

This project follows a **microservices architecture**:

```
fyp/
├── server/              # Express.js + TypeScript backend ✅
├── app/                 # React Native Expo mobile app ✅
└── prediction-service/  # Python FastAPI prediction microservice ✅
```

### Components Status

1. **Server** (`/server`) - ✅ **COMPLETE**
   - Express.js REST API with TypeScript
   - PostgreSQL database with Prisma ORM
   - JWT authentication with bcrypt
   - OpenWeatherMap API integration
   - Redis-like caching layer
   - Scheduled weather updates (every 30 minutes)
   - Weather alert generation system
   - Comprehensive error handling

2. **Prediction Service** (`/prediction-service`) - ✅ **COMPLETE**
   - FastAPI microservice
   - Exponential smoothing for temperature predictions
   - Linear regression for trend analysis
   - Moving average for rainfall predictions
   - Easily replaceable with ChatGPT or other ML services
   - Docker containerized

3. **Mobile App** (`/app`) - ⚠️ **FOUNDATION COMPLETE**
   - ✅ React Native + Expo setup
   - ✅ Zustand state management
   - ✅ Weather-focused design system
   - ✅ Error boundaries
   - ✅ API service layer with Axios interceptors
   - ✅ Utility functions (formatters, validators, location)
   - ✅ Common UI components (Button, Input)
   - 🔄 Authentication screens (Login, Register) - TODO
   - 🔄 Main screens (Home, Forecast, Locations, Settings) - TODO
   - 🔄 Weather components (CurrentWeatherCard, ForecastCard, Charts) - TODO
   - 🔄 Navigation setup - TODO

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- Python 3.11+
- PostgreSQL 14+
- npm or yarn
- Expo CLI

### 1. Setup Server

```bash
cd server
npm install
cp .env.example .env
# Edit .env with your credentials:
# - DATABASE_URL (PostgreSQL connection string)
# - JWT_SECRET (random secret key)
# - OPENWEATHER_API_KEY (from openweathermap.org)

# Run database migrations
npm run prisma:migrate
npm run prisma:generate

# Start development server
npm run dev
```

Server will run on `http://localhost:3000`

### 2. Setup Prediction Service

```bash
cd prediction-service
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt

# Start service
uvicorn src.main:app --reload
```

Prediction service will run on `http://localhost:8000`

### 3. Setup Mobile App

```bash
cd app
npm install
cp .env.example .env
# Edit .env with your server URL

# Start Expo
npm start

# Then press 'a' for Android or 'i' for iOS
```

## 📚 API Documentation

### Server Endpoints

**Authentication:**
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

**Weather:**
- `GET /api/weather/current/:lat/:lon` - Get current weather
- `GET /api/weather/forecast/:lat/:lon` - Get forecast
- `GET /api/weather/predictions/:lat/:lon` - Get AI predictions
- `GET /api/weather/history/:lat/:lon` - Get forecast history
- `GET /api/weather/health` - Check service health

**User:**
- `PUT /api/user/profile` - Update profile
- `GET /api/user/locations` - Get saved locations
- `POST /api/user/locations` - Add location
- `PUT /api/user/locations/:id` - Update location
- `DELETE /api/user/locations/:id` - Delete location

**Alerts:**
- `GET /api/alerts` - Get user alerts
- `PUT /api/alerts/:id/read` - Mark alert as read

### Prediction Service Endpoints

- `POST /api/predict/temperature` - Predict temperature
- `POST /api/predict/rainfall` - Predict rainfall
- `POST /api/predict/trends` - Analyze trends
- `GET /api/health` - Health check

**Interactive Documentation:**
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## 🛠️ Tech Stack

### Backend
- **Express.js** - Web framework
- **TypeScript** - Type safety
- **PostgreSQL** - Database
- **Prisma ORM** - Database ORM
- **JWT** - Authentication
- **Zod** - Validation
- **Node-Cron** - Scheduled tasks
- **Winston** - Logging
- **Axios** - HTTP client

### Prediction Service
- **Python 3.11** - Runtime
- **FastAPI** - Web framework
- **scikit-learn** - Machine learning
- **statsmodels** - Statistical models
- **NumPy/Pandas** - Data processing
- **Pydantic** - Validation

### Mobile
- **React Native** - Mobile framework
- **Expo** - Development platform
- **TypeScript** - Type safety
- **Zustand** - State management
- **Axios** - HTTP client
- **React Navigation** - Navigation
- **date-fns** - Date formatting

## 🎨 Design System

The mobile app follows a **weather-focused design system**:

- **Dynamic gradient backgrounds** based on weather conditions
- **Temperature-based color coding**
- **Glassmorphism UI** elements
- **Smooth animations** with Reanimated
- **Accessibility-first** approach

## 📊 Features Implemented

### Backend (Server)
- [x] User authentication (JWT)
- [x] Password hashing (bcrypt)
- [x] Weather data fetching (OpenWeatherMap)
- [x] Intelligent caching (30-minute TTL)
- [x] Weather forecast (5-day, 3-hour)
- [x] AI predictions integration
- [x] Weather alert generation
- [x] Scheduled updates (every 30 minutes)
- [x] Location management
- [x] Forecast history tracking
- [x] API request logging
- [x] Error handling & validation
- [x] Graceful shutdown

### Prediction Service
- [x] Temperature prediction (Exponential Smoothing)
- [x] Rainfall prediction (Moving Average)
- [x] Trend analysis (Linear Regression)
- [x] Confidence scoring
- [x] Fallback predictions
- [x] Health check endpoint
- [x] Docker containerization
- [x] API documentation

### Mobile App
- [x] Project structure
- [x] Design system (colors, typography, spacing)
- [x] Error boundaries
- [x] Zustand stores (auth, weather, location, alerts)
- [x] API service layer
- [x] Axios interceptors
- [x] Utility functions
- [x] Common components (Button, Input)
- [ ] Authentication screens (Login, Register)
- [ ] Main screens (Home, Forecast, Locations, Settings)
- [ ] Weather components (Cards, Charts)
- [ ] Navigation
- [ ] Push notifications

## 🔄 Git Workflow

The project follows a **feature-by-feature commit strategy**:

1. ✅ Initial project structure
2. ✅ Server setup (Express + TypeScript)
3. ✅ Database schema (Prisma)
4. ✅ Authentication system (JWT)
5. ✅ Weather API integration
6. ✅ Prediction service (FastAPI)
7. ✅ App foundation (Design system + Stores)
8. ✅ API service layer
9. ✅ Utilities and components
10. 🔄 Screens and navigation (TODO)

Each commit is self-contained and builds upon the previous one.

## 👥 Team

- **Purnoor Mehmood** (Sp-22/BSCS/033/A) - purnoormehmood519@g
- **Humayun Zahid** (Sp-22/BSCS/007/A) - humayunzahid54@gmail.com

**Supervised by:** [Teacher Name]

**Institution:** Lahore Garrison University, Department of Computer Science

## 📄 License

This project is developed as part of the Final Year Project for BSCS program at Lahore Garrison University.

## 🙏 Acknowledgments

- OpenWeatherMap for providing weather data API
- Lahore Garrison University for academic support
- Project supervisor for guidance

## 📞 Support

For issues or questions:
- Create an issue in the GitHub repository
- Contact team members via email

---

**Note:** This is an educational project developed for academic purposes.
