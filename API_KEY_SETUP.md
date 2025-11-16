# OpenWeatherMap API Key Setup Guide

## 🎯 Your App is Working RIGHT NOW with Mock Data!

The ForeSight app is currently using **MOCK DATA** so you can test it immediately. To get **REAL weather data**, follow these steps to get a FREE API key from OpenWeatherMap.

---

## ⚡ Quick Steps to Get Your FREE API Key

### 1. Sign Up for OpenWeatherMap (2 minutes)

1. Go to: **https://openweathermap.org/appid**
2. Click **"Sign Up"** in the top right
3. Fill out the registration form:
   - Email address
   - Username
   - Password
4. **Check your email** and click the verification link

### 2. Get Your API Key

1. Log in to your OpenWeatherMap account
2. Click on your **username** → **"My API keys"**
3. You'll see a default API key already created
4. **Copy the API key** (it looks like: `a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6`)

### 3. Update Your Server Configuration

Open `server/.env` and replace the placeholder:

```bash
# BEFORE
OPENWEATHER_API_KEY=your-api-key-here

# AFTER (paste your actual key)
OPENWEATHER_API_KEY=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6
```

### 4. Restart Your Server

```bash
cd server
npm start
```

You should see:
```
✅ Server running on port 3000
```

**NOT:**
```
⚠️  OpenWeatherMap API key not configured - using MOCK DATA for development
```

---

## 🕐 Important: API Key Activation Time

⏰ **Your API key may take up to 2 hours to activate** after creation.

If you get errors immediately after setup:
- Wait 10-30 minutes
- Try again
- The mock data will continue working in the meantime

---

## ✨ What You Get with the FREE Plan

✅ **1,000 API calls per day** (plenty for development)
✅ **Current weather data** for any location
✅ **5-day forecast** with 3-hour intervals
✅ **No credit card required**

---

## 🔍 Verify It's Working

### When Using REAL Data:
Server logs will show:
```
[info]: Fetched current weather for London
[info]: Fetched forecast for London
```

### When Using MOCK Data:
Server logs will show:
```
[warn]: ⚠️  OpenWeatherMap API key not configured - using MOCK DATA
[info]: [MOCK DATA] Returning mock weather for London
```

---

## 🚨 Troubleshooting

### Error: "Invalid API key"
- **Solution**: Wait 10-30 minutes for activation
- Check you copied the entire key (no spaces)

### Error: "Failed to fetch weather data"
- **Solution**: Check your internet connection
- Verify the API key is correctly pasted in `.env`

### Still seeing "MOCK DATA" in logs?
- **Solution**: Restart the server after updating `.env`
- Make sure you edited `server/.env` (not `app/.env`)

---

## 🎨 Mock Data vs Real Data

| Feature | Mock Data | Real Data |
|---------|-----------|-----------|
| Temperature | Random (18-28°C) | Actual temperatures |
| Location Names | London, NYC, Tokyo, Paris, Sydney | All global locations |
| Forecasts | Random patterns | Real meteorological data |
| Updates | Random each request | Real-time updates |

---

## 📞 Need Help?

- **OpenWeatherMap FAQ**: https://openweathermap.org/faq
- **API Documentation**: https://openweathermap.org/api
- **Support**: https://openweathermap.org/api

---

## ✅ You're Done!

Your app will automatically switch from mock data to real data once the API key is configured and activated. No code changes needed!
