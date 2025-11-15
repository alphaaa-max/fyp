# ForeSight - Predictive Weather Insights using Advanced Data Analytics

A comprehensive weather forecasting application with AI-powered predictions, built as a Final Year Project.

## 📱 Project Overview

ForeSight is a mobile weather application that provides:
- Real-time weather data
- AI-powered predictive insights
- Location-based forecasts
- Weather alerts and notifications
- Health and safety recommendations
- Interactive data visualizations

## 🏗️ Architecture

This project follows a microservices architecture:

```
fyp/
├── server/              # Express.js + TypeScript backend
├── app/                 # React Native Expo mobile app
└── prediction-service/  # Python FastAPI prediction microservice
```

### Components

1. **Server** (`/server`)
   - Express.js REST API
   - PostgreSQL database with Prisma ORM
   - JWT authentication
   - OpenWeatherMap integration
   - Caching layer
   - Scheduled weather updates

2. **Mobile App** (`/app`)
   - React Native + Expo
   - Zustand state management
   - Weather-focused design system
   - Error boundaries
   - Push notifications
   - Offline support

3. **Prediction Service** (`/prediction-service`)
   - FastAPI microservice
   - Statistical ML models
   - Isolated and replaceable
   - Docker containerized

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- Python 3.11+
- PostgreSQL 14+
- npm or yarn
- Expo CLI

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd fyp
```

2. Setup Server:
```bash
cd server
npm install
cp .env.example .env
# Configure .env with your credentials
npm run prisma:migrate
npm run dev
```

3. Setup Mobile App:
```bash
cd app
npm install
cp .env.example .env
npm start
```

4. Setup Prediction Service:
```bash
cd prediction-service
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn src.main:app --reload
```

## 📚 Documentation

- [Server Documentation](./server/README.md)
- [Mobile App Documentation](./app/README.md)
- [Prediction Service Documentation](./prediction-service/README.md)
- [SRS Document](./docs/SRS.md)

## 🛠️ Tech Stack

### Backend
- Express.js
- TypeScript
- PostgreSQL
- Prisma ORM
- JWT
- Node-Cron

### Mobile
- React Native
- Expo
- TypeScript
- Zustand
- React Navigation
- Victory Native (Charts)

### Prediction Service
- Python 3.11
- FastAPI
- scikit-learn
- statsmodels
- NumPy/Pandas

## 👥 Team

- Purnoor Mehmood (Sp-22/BSCS/033/A)
- Humayun Zahid (Sp-22/BSCS/007/A)

**Supervised by:** [Teacher Name]

**Institution:** Lahore Garrison University

## 📄 License

This project is developed as part of the Final Year Project for BSCS program.

## 🙏 Acknowledgments

- OpenWeatherMap API for weather data
- Lahore Garrison University
- Project Supervisor
