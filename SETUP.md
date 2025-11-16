# 🚀 ForeSight - Complete Setup Guide

## Prerequisites

- Node.js 18+ installed
- Python 3.11+ installed
- MongoDB Atlas account (create free at https://www.mongodb.com/cloud/atlas)
- OpenWeatherMap API key (get free at https://openweathermap.org/api)
- Expo Go app on your phone (iOS/Android)

---

## ⚙️ 1. Server Setup (Backend)

### Step 1: Navigate to server directory
```bash
cd server
```

### Step 2: Install dependencies
```bash
npm install
```

### Step 3: Configure environment variables

**You need to edit the `.env` file I created:**

```bash
# Open .env file and update these values:

# 1. MONGODB_URI - Get from MongoDB Atlas:
#    - Go to https://cloud.mongodb.com
#    - Create a free cluster
#    - Click "Connect" → "Connect your application"
#    - Copy the connection string
#    - Replace <password> with your database password
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/foresight?retryWrites=true&w=majority

# 2. OPENWEATHER_API_KEY - Get from OpenWeatherMap:
#    - Go to https://openweathermap.org/api
#    - Sign up for free
#    - Go to API Keys section
#    - Copy your API key
OPENWEATHER_API_KEY=your-actual-api-key-here

# 3. JWT_SECRET is already set, but change it for production:
JWT_SECRET=foresight-super-secret-jwt-key-change-in-production-2024
```

### Step 4: Start the server
```bash
npm run dev
```

You should see:
```
✅ MongoDB connected successfully
🚀 Server running on port 3000
📝 Environment: development
🔗 API Base: http://localhost:3000/api
✅ Scheduler started with 3 tasks
```

**Server is now running on http://localhost:3000** ✅

---

## 🤖 2. Prediction Service Setup (Python)

### Step 1: Navigate to prediction-service directory
```bash
cd prediction-service
```

### Step 2: Create virtual environment
```bash
python -m venv venv

# Activate it:
# On macOS/Linux:
source venv/bin/activate

# On Windows:
venv\Scripts\activate
```

### Step 3: Install dependencies
```bash
pip install -r requirements.txt
```

### Step 4: Start the prediction service
```bash
uvicorn src.main:app --reload
```

You should see:
```
🚀 Prediction Service starting up...
📊 Statistical models loaded
✅ Service ready to accept requests
```

**Prediction service is now running on http://localhost:8000** ✅

**View API docs at: http://localhost:8000/docs** 📚

---

## 📱 3. Mobile App Setup (React Native Expo)

### Step 1: Navigate to app directory
```bash
cd app
```

### Step 2: Install dependencies
```bash
npm install
```

### Step 3: Fix macOS file watcher limit (if on Mac)

**Option A: Permanent fix (recommended)**
```bash
# Add to your ~/.zshrc or ~/.bash_profile:
echo "ulimit -n 65536" >> ~/.zshrc
source ~/.zshrc
```

**Option B: Use the provided script**
```bash
npm run start:mac
```

**Option C: Run command before starting**
```bash
ulimit -n 65536
npm start
```

### Step 4: Start Expo
```bash
npm start
```

You should see a QR code in the terminal.

### Step 5: Open on your phone
1. Install **Expo Go** app from App Store or Google Play
2. Scan the QR code with:
   - **iOS**: Camera app
   - **Android**: Expo Go app

**App is now running!** 📱

---

## 🔍 Troubleshooting

### Server Issues

**Error: "Invalid environment variables"**
- Make sure you created `.env` file in `server/` directory
- Check that all required variables are set (especially MONGODB_URI and OPENWEATHER_API_KEY)

**Error: "MongoDB connection failed"**
- Check your MongoDB Atlas connection string
- Make sure your IP is whitelisted in MongoDB Atlas (Network Access)
- Verify your database password is correct

**Error: "OpenWeatherMap API error"**
- Verify your API key is correct
- Make sure the API key is activated (may take a few minutes after creation)

### App Issues

**Error: "EMFILE: too many open files"**
- Run `ulimit -n 65536` before starting
- Or use `npm run start:mac`
- Or add to your shell profile permanently

**Error: "Module not found"**
- Run `npm install` again
- Clear cache: `npx expo start -c`

**App won't load on phone**
- Make sure phone and computer are on the same WiFi network
- Try using tunnel: `npx expo start --tunnel`

### Prediction Service Issues

**Error: "ModuleNotFoundError"**
- Make sure virtual environment is activated: `source venv/bin/activate`
- Reinstall dependencies: `pip install -r requirements.txt`

---

## 📋 Quick Start Checklist

- [ ] MongoDB Atlas cluster created and connection string copied
- [ ] OpenWeatherMap API key obtained
- [ ] Server `.env` file configured with MongoDB URI and API key
- [ ] Server running on http://localhost:3000
- [ ] Prediction service running on http://localhost:8000
- [ ] Mobile app dependencies installed
- [ ] File watcher limit increased (macOS only)
- [ ] Expo running and QR code visible
- [ ] Expo Go app installed on phone
- [ ] App loaded successfully on phone

---

## 🎯 What's Next?

Once everything is running:

1. **Test the API**: Visit http://localhost:3000/health
2. **View prediction docs**: Visit http://localhost:8000/docs
3. **Use the mobile app**: Register a user and explore features!

---

## 📞 Need Help?

- **MongoDB Atlas**: https://docs.atlas.mongodb.com/
- **OpenWeatherMap**: https://openweathermap.org/faq
- **Expo**: https://docs.expo.dev/
- **Server API**: Check `server/README.md`

---

**Happy coding! 🚀**
