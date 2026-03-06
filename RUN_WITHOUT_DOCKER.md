# 🚀 Run Banking Platform WITHOUT Docker (Easy Way!)

Your system can't handle Docker? **No problem!** Run everything directly on your computer - it's actually faster and simpler!

---

## 📋 What You Need to Install (One time only)

### 1. **Node.js** (for all services)
   - Download: https://nodejs.org/ (LTS version)
   - Install it (just click next)
   - Check it worked:
     ```
     node --version
     npm --version
     ```
   You should see version numbers.

### 2. **PostgreSQL** (The Database)
   - Download: https://www.postgresql.org/download/windows/
   - Install it
   - **Remember the password you set!**
   - Check it worked: Open "SQL Shell" from Start menu

### 3. **Redis** (Fast Cache - Optional but recommended)
   - Download: https://github.com/microsoftarchive/redis/releases
   - Download `MSOpenTech/redis` latest release
   - Extract and run `redis-server.exe`
   - **Keep it running in background**

---

## 🎯 Step-by-Step Setup

### **Step 1: Create Database**

Open **SQL Shell** (from Start menu):

```sql
CREATE DATABASE banking_ai_db;
```

Then press Ctrl+D to exit.

---

### **Step 2: Initialize Database Tables**

Open Command Prompt and run:

```
cd c:\hack1\ai-banking-selfservice
```

Then run the SQL file:

```
psql -U postgres -d banking_ai_db -f infrastructure/db/init.sql
```

When it asks for password, enter the PostgreSQL password you set during installation.

---

### **Step 3: Create .env File**

You already have this, but check it exists:

```
cd c:\hack1\ai-banking-selfservice
dir .env
```

Should show the file. If not, copy it:

```
copy .env.example .env
```

---

### **Step 4: Install All Dependencies (Easy!)**

Run this ONE command:

```powershell
npm run install-all
```

This installs everything for all services at once.

**Wait 2-3 minutes** for it to finish.

---

### **Step 5: Start Everything (Most Important!)**

Now the fun part - start all services at once:

```powershell
npm start
```

**This will start:**
- ✅ API Gateway (Port 5000)
- ✅ Auth Service (Port 5001)
- ✅ Conversation Engine (Port 5002)
- ✅ Transaction Service (Port 5003)
- ✅ Analytics Service (Port 5004)
- ✅ Agent Dashboard (Port 5006)
- ✅ Voice Bot (Port 5005)
- ✅ Frontend (Port 3000)

You'll see **lots of text** - that's normal! All services starting up.

---

## 💻 Access Your App

Open your browser and go to:

### **Main Application**
```
http://localhost:3000
```

You should see the login screen! 🎉

### **API Gateway (Test it works)**
```
http://localhost:5000/health
```

Should show:
```json
{"status":"ok","service":"api-gateway"}
```

---

## 📝 What To Do If It Doesn't Work

### **Problem: "npm: The term 'npm' is not recognized"**
- Solution: Node.js didn't install properly
- Fix: Restart your computer, then try again

### **Problem: "Port 5000 is already in use"**
- Solution: Something else is using that port
- Fix: Run this:
  ```powershell
  netstat -ano | findstr :5000
  ```
  Then close whatever is using it

### **Problem: "Cannot connect to PostgreSQL"**
- Solution: PostgreSQL not running
- Fix: Open pgAdmin from Start menu and start the server

### **Problem: "npm ERR!"**
- Solution: Dependencies didn't install
- Fix: Run:
  ```powershell
  npm run install-all
  ```

---

## 🛑 Stop Everything

When you want to stop all services:

### **In PowerShell (where services are running):**
Press `Ctrl + C` three times

This stops all services gracefully.

---

## 📊 Service Ports (What's Running Where)

| Service | Port | URL |
|---------|------|-----|
| Frontend (Kiosk) | 3000 | http://localhost:3000 |
| API Gateway | 5000 | http://localhost:5000 |
| Auth Service | 5001 | http://localhost:5001 |
| Conversation Engine | 5002 | http://localhost:5002 |
| Transaction Service | 5003 | http://localhost:5003 |
| Analytics Service | 5004 | http://localhost:5004 |
| Agent Dashboard     | 5006 | http://localhost:5006 |
| Voice Bot | 5005 | http://localhost:5005 |
| PostgreSQL Database | 5432 | localhost:5432 |
| Redis Cache | 6379 | localhost:6379 |

---

## 🚀 Quick Test Commands

Once everything is running, open a **NEW Command Prompt** and try:

### **Test API Gateway is alive:**
```
curl http://localhost:5000/health
```

### **Test Auth Service:**
```
curl http://localhost:5001/health
```

### **Test everything:**
```
curl http://localhost:5000/info
```

If you see JSON responses - **It works!** 🎉

---

## 💡 Pro Tips

1. **Keep Redis running** - Open `redis-server.exe` before starting the app
2. **Keep PostgreSQL running** - It starts automatically on Windows
3. **Open multiple terminals** - One for each service if you want to see logs separately
4. **Check logs** - Look at the terminal output to see what's happening
5. **Restart is simple** - Just press Ctrl+C and run `npm start` again

---

## 📚 File Structure

Your services are here:

```
backend/
  ├── api-gateway/          ← Main entry point (5000)
  ├── auth-service/         ← Login/authentication (5001)
  ├── conversation-engine/  ← Chat/NLU (5002)
  ├── transaction-service/  ← Money transfers (5003)
  ├── analytics-service/    ← Reports & dashboards (5004)
  ├── agent-dashboard/      ← Human assistance (5006)
  └── ...

voice-bot/                  ← Phone bot (5005)

frontend-kiosk/             ← Web app (3000)

shared/
  └── models/               ← Shared types
```

---

## ✨ Next Steps

1. ✅ Install Node.js
2. ✅ Install PostgreSQL
3. ✅ Install Redis
4. ✅ Run `npm run install-all`
5. ✅ Run `npm start`
6. ✅ Go to http://localhost:3000
7. 🎉 **You're done!**

---

## 🎓 Learn More

- **Backend code**: `backend/*/src/index.ts`
- **Frontend code**: `frontend-kiosk/src/App.tsx`
- **Database schema**: `infrastructure/db/init.sql`
- **API endpoints**: `docs/API.md`

---

## 💬 Stuck?

1. **Check logs** - Look at the Command Prompt output
2. **Check ports** - Make sure ports 5000-5005 aren't used
3. **Check ports** - Make sure ports 5000-5006 aren't used
4. **Restart services** - Press Ctrl+C and try again

**That's it!** You're running a full banking platform without Docker! 🚀
