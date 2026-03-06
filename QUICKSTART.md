# Quick Start Guide

## 🚀 Start the Platform in 5 Minutes

### Prerequisites
- Docker & Docker Compose installed
- Git
- Terminal/Command Prompt

### Step 1: Clone and Setup
```bash
git clone <repository-url>
cd ai-banking-selfservice

# Copy environment file
cp .env.example .env
```

### Step 2: Start All Services
```bash
# Build and start all containers
docker-compose up -d

# Verify all services are running
docker-compose ps
```

**Services Status:**
- ✅ All services should show "healthy" or "running"
- ⏳ Wait 30-60 seconds for health checks to complete

### Step 3: Access the Platform

**Frontend (Kiosk UI)**
- URL: http://localhost:3000
- Purpose: Test kiosk/tablet interface

**API Gateway**
- URL: http://localhost:5000
- Purpose: REST API endpoint

**Monitoring Dashboards**
- Grafana: http://localhost:3001 (Admin/Admin)
- Kibana: http://localhost:5601
- Prometheus: http://localhost:9090

**Admin Tools**
- RabbitMQ: http://localhost:15672 (guest/guest)
- PostgreSQL: localhost:5432
- Redis: localhost:6379

### Step 4: Test the API

**Get Authentication Token:**
```bash
curl -X POST http://localhost:5000/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "identity": "customer@example.com",
    "password": "password"
  }'
```

**Response Example:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "...",
  "expiresIn": 900,
  "tokenType": "Bearer"
}
```

**Start a Conversation:**
```bash
TOKEN="<access_token_from_above>"

curl -X POST http://localhost:5000/v1/conversations/start \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "channel": "kiosk",
    "language": "en"
  }'
```

**Send a Message:**
```bash
CONVERSATION_ID="<id_from_conversation_start>"

curl -X POST http://localhost:5000/v1/conversations/$CONVERSATION_ID/messages \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "content": "I want to check my account balance"
  }'
```

### Step 5: View Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f api-gateway
docker-compose logs -f conversation-engine
docker-compose logs -f transaction-service

# Last 50 lines
docker-compose logs --tail=50 api-gateway
```

## Common Issues

### Services not starting

```bash
# Check logs
docker-compose logs

# Restart services
docker-compose restart

# Full rebuild
docker-compose down -v
docker-compose up -d --build
```

### Port already in use

```bash
# Change port in docker-compose.yml
# Or kill the process using the port

# On Linux/Mac
lsof -i :5000
kill -9 <PID>

# On Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

### Database not initialized

```bash
# Manually initialize database
docker-compose exec postgres psql -U bankinguser -d banking_ai_db \
  -f /docker-entrypoint-initdb.d/init.sql
```

## Next Steps

1. **Explore API Documentation**: [API.md](docs/API.md)
2. **Understand Architecture**: [ARCHITECTURE.md](docs/ARCHITECTURE.md)
3. **Full Setup Guide**: [SETUP.md](docs/SETUP.md)
4. **Security Guide**: [SECURITY.md](docs/SECURITY.md)
5. **Deployment Guide**: [DEPLOYMENT.md](docs/DEPLOYMENT.md)

## Development Workflow

### Backend Development

```bash
# Make changes in backend/api-gateway/src

# Rebuild container
docker-compose build api-gateway

# Restart service
docker-compose restart api-gateway

# View logs
docker-compose logs -f api-gateway
```

### Frontend Development

```bash
# Option 1: Develop in Docker (live reload)
docker-compose up -d
# Edit frontend-kiosk/src files and changes auto-reload at http://localhost:3000

# Option 2: Local development
cd frontend-kiosk
npm install
npm start
```

### Testing

```bash
# Run all tests
npm run test:all

# Run specific service tests
docker-compose exec api-gateway npm test

# Test with coverage
docker-compose exec api-gateway npm test -- --coverage
```

## Architecture Overview

```
┌─────────────────────────────────────────────┐
│         Frontend (React App)                │
│     http://localhost:3000                   │
└────────────────────┬────────────────────────┘
                     │
     ┌───────────────▼──────────────┐
     │    API Gateway (Kong)         │
     │    http://localhost:5000      │
     └───────────────┬──────────────┘
                     │
    ┌────────────────┼────────────────┐
    │                │                │
┌───▼────┐  ┌────────▼────┐  ┌───────▼─────┐
│  Auth   │  │ Conversation│  │ Transaction │
│ Service │  │   Engine    │  │  Service    │
│ :5001   │  │   :5002     │  │   :5003     │
└────┬────┘  └────┬────────┘  └─────┬───────┘
     │            │                 │
     └────┬───────┴────┬────────────┘
          │            │
      ┌───▼──┐    ┌────▼──┐
      │  DB  │    │ Redis │
      └──────┘    └───────┘
```

## Monitoring

### Check Service Health

```bash
# All services
for port in 5000 5001 5002 5003 5004 5005; do
  echo "Checking port $port..."
  curl -s http://localhost:$port/health | jq .
done
```

### View Real-time Metrics
- Grafana: http://localhost:3001
- Prometheus: http://localhost:9090

### View Logs
- Kibana: http://localhost:5601

## Performance Tips

1. **Allocate sufficient Docker memory**
   ```bash
   # Mac/Windows: Docker Desktop > Preferences > Resources
   # Linux: Docker daemon settings
   ```

2. **Use connection pooling** (configured in .env)

3. **Enable caching** (Redis configured)

## Getting Help

- **Documentation**: Read [docs/](docs/) folder
- **Issues**: Check GitHub Issues
- **Discussions**: Use GitHub Discussions
- **Email**: support@banking-ai.com

## What's Next?

- Review [Backend Services Architecture](docs/ARCHITECTURE.md#core-components)
- Explore [API Endpoints](docs/API.md)
- Check [Contributing Guide](docs/CONTRIBUTING.md)
- Understand [Security Measures](docs/SECURITY.md)

---

**Happy coding! 🎉**
