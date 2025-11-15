# ForeSight Mobile App

React Native Expo application for ForeSight weather forecasting.

## Features

- Real-time weather data
- AI-powered predictions
- Location-based forecasts
- Weather alerts & notifications
- Interactive charts and visualizations
- Health & safety recommendations
- Beautiful weather-themed UI

## Tech Stack

- React Native + Expo
- TypeScript
- Zustand (State Management)
- React Navigation
- Victory Native (Charts)
- Expo Notifications

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure environment:
```bash
cp .env.example .env
# Edit .env with your API URL
```

3. Start development server:
```bash
npm start
```

4. Run on device:
```bash
# iOS
npm run ios

# Android
npm run android
```

## Design System

The app follows a weather-focused design system with:
- Dynamic gradient backgrounds based on weather conditions
- Glassmorphism UI elements
- Temperature-based color coding
- Smooth animations and transitions
- Accessibility-first approach

## Project Structure

```
src/
├── components/     # Reusable UI components
├── screens/        # App screens
├── navigation/     # Navigation configuration
├── store/          # Zustand state management
├── services/       # API services
├── theme/          # Design system
├── utils/          # Helper functions
└── types/          # TypeScript types
```
