# 🚀 Beginner's Guide - How to Run the Banking Platform

This guide is for complete beginners. Don't worry if you don't understand all the technical terms - just follow the steps!

---

## 📋 Step 1: Check What You Need (Prerequisites)

Before you start, make sure you have these installed on your computer:

### Windows Installation Check:

**Docker** - This is a tool that helps run all the applications
- Download from: https://www.docker.com/products/docker-desktop
- Install it (it's like installing a normal program, just click next)
- After install, **restart your computer**
- To check if installed: Open Command Prompt and type:
  ```
  docker --version
  ```
  You should see a version number like: `Docker version 24.0.0`

**Git** - This helps you get the code
- Download from: https://git-scm.com/download/win
- Install it (again, just click next through everything)

**Command Prompt or PowerShell** - You already have this on Windows!
- Press `Windows Key + R`
- Type `cmd` or `powershell`
- Press Enter

---

## 🎯 Step 2: Get the Project on Your Computer

### Open Command Prompt/PowerShell and run:

```
cd c:\hack1\ai-banking-selfservice
```

This means: "Go to the banking project folder"

If this doesn't work, make sure the folder exists at that location!

---

## ⚙️ Step 3: Set Up the Settings File

The project needs a settings file with secrets and passwords. Let's create it:

### On Windows PowerShell, run:

```
copy .env.example .env
```

Or if using Command Prompt (cmd):

```
copy .env.example .env
```

**What this does:** It copies the example settings file and creates a new one called `.env` that the system will use.

---

## 🚀 Step 4: Start Everything (The Big One!)

### Run this command:

```
docker-compose up -d
```

**What this does:** 
- The word "docker-compose" means "start all these programs together"
- The "-d" means "run in the background" (so you can keep using your command window)

**What you'll see:**
- Lots of text scrolling
- It will say things like "Creating network...", "Starting postgres...", "Starting redis..."
- This takes about 30-60 seconds the first time
- When done, you'll get a command prompt back

---

## ✅ Step 5: Check Everything is Running

### Run this command to see what's running:

```
docker-compose ps
```

**You should see a list like this:**

```
NAME                    STATUS
postgres                Up 2 minutes
redis                   Up 2 minutes
api-gateway             Up 2 minutes
auth-service            Up 2 minutes
frontend-kiosk          Up 2 minutes
(and more services...)
```

**Important:** All should say "Up" - if any say "Exited", something went wrong.

---

## 💻 Step 6: Use the Application!

Now the fun part - you can actually USE it!

### Open Your Web Browser

1. **Open Chrome, Firefox, or Edge**
2. **Go to:** `http://localhost:3000`
3. **You should see:** The banking platform login screen!

### Try These URLs:

| What You Want | URL | What You'll See |
|---|---|---|
| **Main App** | `http://localhost:3000` | Login screen (the main interface) |
| **System Dashboard** | `http://localhost:3001` | Monitoring dashboard (shows if everything is healthy) |
| **Database Admin** | `http://localhost:5050` | Database management tool |

---

## 🧪 Step 7: Test If It Actually Works

Let's verify the system is responding to requests.

### Open Command Prompt and run:

```
curl http://localhost:5000/info
```

**You should see:**
```json
{"status":"ok","service":"api-gateway","version":"1.0.0"}
```

If you see this - **Congratulations! The platform is working!** 🎉

---

## 📝 Step 8: Try the Mini Test

### In Command Prompt, run this to test the API:

```
curl -X POST http://localhost:5001/login -H "Content-Type: application/json" -d "{\"email\":\"john@example.com\",\"password\":\"password123\"}"
```

**You should see a response** with a "token" or someone confirming you logged in.

---

## 🛑 Step 9: When You're Done - Stop Everything

When you want to stop the platform (close all the running programs):

### Run:

```
docker-compose down
```

**What this does:** Shuts down all 14 services safely.

If you want to also delete all the data:

```
docker-compose down -v
```

The "-v" means "also remove the data" (like resetting to factory settings).

---

## 🆘 Troubleshooting - Common Issues for Beginners

### **Problem: "Command 'docker' not recognized"**
- **Solution:** Docker isn't installed or installed incorrectly. Go back to Step 1 and install it again. **Restart your computer after installing!**

### **Problem: "Cannot connect to Docker daemon"**
- **Solution:** Docker needs to be running. 
  - On Windows, open "Docker Desktop" from your Start menu
  - Wait for it to fully load (look for the Docker whale icon)
  - Try the command again

### **Problem: "Port 3000 is already in use"**
- **Solution:** Something else is using port 3000.
  - Stop the banking platform: `docker-compose down`
  - Close other programs that might use port 3000
  - Start again: `docker-compose up -d`

### **Problem: "Cannot find file '.env.example'"**
- **Solution:** Make sure you're in the right folder. Type:
  ```
  cd c:\hack1\ai-banking-selfservice
  dir
  ```
  You should see `.env.example` in the list

### **Problem: Some services say "Exited" in step 5**
- **Solution:** Check the logs to see what went wrong:
  ```
  docker-compose logs
  ```
  Or for a specific service:
  ```
  docker-compose logs api-gateway
  ```

---

## 📚 What's Actually Running?

When you run `docker-compose up`, here's what you get:

| Service | What It Does | Port |
|---------|-------------|------|
| **frontend-kiosk** | The app you see in browser | 3000 |
| **api-gateway** | The main system that talks to everything | 5000 |
| **auth-service** | Handles login/passwords | 5001 |
| **conversation-engine** | Handles chat/conversations | 5002 |
| **transaction-service** | Handles money transfers | 5003 |
| **analytics-service** | Shows statistics/reports | 5004 |
| **voice-bot** | Handles phone calls | 5005 |
| **postgres** | Database (stores all data) | 5432 |
| **redis** | Fast memory storage | 6379 |
| **rabbitmq** | Message queue system | 5672 |
| **elasticsearch** | Search & logs system | 9200 |
| **grafana** | Monitoring dashboard | 3001 |

---

## ✨ Next Steps After It's Running

Once you have it running:

1. **Explore the frontend** at `http://localhost:3000`
2. **Check the dashboard** at `http://localhost:3001` 
3. **Read more docs** in the `docs/` folder
4. **Start coding** - modify the files in each service!

---

## 🎓 Real Examples to Try

Once it's running, here are some things you can actually try:

### **Example 1: Check if the API is alive**
```
curl http://localhost:5000/health
```

### **Example 2: See system info**
```
curl http://localhost:5000/info
```

### **Example 3: Get analytics data**
```
curl http://localhost:5004/analytics/dashboard
```

---

## 💬 Need Help?

If something doesn't work:

1. **Check the troubleshooting section above** ☝️
2. **Check the logs:**
   ```
   docker-compose logs
   ```
3. **Look in the `docs/` folder** - there are more detailed guides

---

## ✅ You Did It!

If you can see the application at `http://localhost:3000` and the dashboard at `http://localhost:3001`, you've successfully set up a complete banking platform! 

**You're awesome!** 🚀

The hard part is done. Now you can start learning and coding!
