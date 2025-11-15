# ForeSight Server

Express.js + TypeScript backend server for ForeSight weather application.

## Features

- JWT Authentication
- OpenWeatherMap API Integration
- PostgreSQL Database with Prisma ORM
- Weather Data Caching
- Scheduled Weather Updates
- RESTful API

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables:
```bash
cp .env.example .env
# Edit .env with your credentials
```

3. Setup database:
```bash
npm run prisma:migrate
npm run prisma:generate
```

4. Run development server:
```bash
npm run dev
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Weather
- `GET /api/weather/current/:lat/:lon` - Get current weather
- `GET /api/weather/forecast/:lat/:lon` - Get weather forecast
- `GET /api/weather/predictions/:lat/:lon` - Get AI predictions

### User
- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update user profile
- `POST /api/user/locations` - Save location
- `GET /api/user/locations` - Get saved locations

### Alerts
- `GET /api/alerts/:location` - Get weather alerts
