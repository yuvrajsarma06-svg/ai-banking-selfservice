# Setup Instructions

## Prerequisites

- Docker & Docker Compose (v1.29+)
- Git
- At least 8GB RAM
- Node.js 18+ (for local development)
- Python 3.11+ (for local AI/ML work)

## 1. Clone Repository

```bash
git clone <repository-url>
cd ai-banking-selfservice
```

## 2. Environment Setup

### Copy and Configure Environment Variables

```bash
cp .env.example .env
```

Edit `.env` file and set the following:

```bash
# Database
DB_USER=bankinguser
DB_PASSWORD=securepassword  # Change this!
DB_NAME=banking_ai_db

# Redis
REDIS_PASSWORD=redispass  # Change this!

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Azure Services (if using)
AZURE_OPENAI_KEY=your-key
AZURE_OPENAI_ENDPOINT=https://your-resource.openai.azure.com/
AZURE_SPEECH_KEY=your-key
AZURE_SPEECH_REGION=eastus

# Twilio (if using voice bot)
TWILIO_ACCOUNT_SID=your-sid
TWILIO_AUTH_TOKEN=your-token
TWILIO_PHONE_NUMBER=+1234567890

# Core Banking API
CORE_BANKING_API=http://your-core-banking-api.com
CORE_BANKING_KEY=your-api-key

# OAuth/OIDC
OAUTH_CLIENT_ID=your-client-id
OAUTH_CLIENT_SECRET=your-secret
OAUTH_AUTHORITY=https://your-oauth-provider.com
```

## 3. Build & Start Services

### Using Docker Compose (Recommended)

```bash
# Build all services
docker-compose build

# Start all services
docker-compose up -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f

# Stop all services
docker-compose down
```

### Service Endpoints

After startup, services are available at:

| Service | URL | Port |
|---------|-----|------|
| API Gateway | http://localhost:5000 | 5000 |
| Auth Service | http://localhost:5001 | 5001 |
| Conversation Engine | http://localhost:5002 | 5002 |
| Transaction Service | http://localhost:5003 | 5003 |
| Analytics Service | http://localhost:5004 | 5004 |
| Voice Bot | http://localhost:5005 | 5005 |
| Frontend (Kiosk) | http://localhost:3000 | 3000 |
| Prometheus | http://localhost:9090 | 9090 |
| Grafana | http://localhost:3001 | 3001 |
| Kibana | http://localhost:5601 | 5601 |
| PostgreSQL | localhost:5432 | 5432 |
| Redis | localhost:6379 | 6379 |
| RabbitMQ | http://localhost:15672 | 15672 |
| Elasticsearch | http://localhost:9200 | 9200 |

## 4. Database Setup

The database is automatically initialized when PostgreSQL starts via `init.sql`.

To manually run migrations:

```bash
docker-compose exec postgres psql -U bankinguser -d banking_ai_db -f /docker-entrypoint-initdb.d/init.sql
```

To access PostgreSQL directly:

```bash
docker-compose exec postgres psql -U bankinguser -d banking_ai_db
```

## 5. Frontend Setup (Local Development)

If developing the frontend locally:

```bash
cd frontend-kiosk
npm install
npm start
```

The kiosk UI will be available at http://localhost:3000

## 6. Backend Setup (Local Development)

For each backend service:

```bash
cd backend/api-gateway
npm install
npm run dev
```

## 7. Verify Installation

### Health Checks

```bash
# API Gateway
curl http://localhost:5000/health

# Auth Service
curl http://localhost:5001/health

# Conversation Engine
curl http://localhost:5002/health

# Transaction Service
curl http://localhost:5003/health

# Analytics Service
curl http://localhost:5004/health

# Voice Bot
curl http://localhost:5005/health
```

### Check Database

```bash
# Connect to database
docker-compose exec postgres psql -U bankinguser -d banking_ai_db

# List tables
\dt

# Count records
SELECT COUNT(*) FROM customers;
```

### Check Redis

```bash
# Connect to Redis
docker-compose exec redis redis-cli -a redispass

# Check key stats
INFO stats
```

## 8. Understanding the System

### Key Components

1. **API Gateway** (api-gateway)
   - Central entry point
   - Authentication routing
   - Rate limiting
   - Request logging

2. **Auth Service** (auth-service)
   - User authentication
   - Session management
   - Token generation
   - Biometric auth handler

3. **Conversation Engine** (conversation-engine)
   - NLU processing
   - LLM integration
   - Context management
   - Multi-language support

4. **Transaction Service** (transaction-service)
   - Banking operations
   - Core banking integration
   - Transaction processing
   - Compliance checks

5. **Analytics Service** (analytics-service)
   - Real-time metrics
   - Dashboard data
   - Event processing
   - Reporting

6. **Voice Bot** (voice-bot)
   - IVR handling
   - Voice processing
   - Call routing
   - Agent escalation

7. **Frontend** (frontend-kiosk)
   - Kiosk/tablet interface
   - Touch and voice interaction
   - Multi-language UI
   - Accessibility features

## 9. Testing the APIs

### Login and Get Token

```bash
curl -X POST http://localhost:5000/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "identity": "customer@example.com",
    "password": "secure_password"
  }'
```

### Start Conversation

```bash
curl -X POST http://localhost:5000/v1/conversations/start \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "channel": "kiosk",
    "language": "en"
  }'
```

### Send Message

```bash
curl -X POST http://localhost:5000/v1/conversations/{conversation_id}/messages \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "content": "I want to check my account balance"
  }'
```

## 10. Monitoring & Logs

### Access Grafana Dashboard

1. Open http://localhost:3001
2. Login with `admin` / password from `.env` (default: `admin`)
3. View pre-configured dashboards

### Access Kibana

1. Open http://localhost:5601
2. Select Elasticsearch indices
3. View logs and analytics

### View Docker Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f api-gateway

# Last 100 lines
docker-compose logs --tail=100 api-gateway
```

## 11. Development Workflow

### Creating a New Feature

1. Create feature branch: `git checkout -b feature/your-feature`
2. Make changes in appropriate service
3. Build: `docker-compose build <service>`
4. Test: `curl` or use Postman
5. Commit: `git commit -m "Add feature"`
6. Push: `git push origin feature/your-feature`
7. Create Pull Request

### Running Tests

```bash
# Backend services
docker-compose exec api-gateway npm test
docker-compose exec auth-service npm test
docker-compose exec conversation-engine npm test

# Frontend
docker-compose exec frontend-kiosk npm test
```

## 12. Troubleshooting

### Docker Issues

```bash
# Rebuild images
docker-compose build --no-cache

# Remove all containers
docker-compose down -v

# Check logs for specific service
docker-compose logs api-gateway --tail=50
```

### Database Connection Issues

```bash
# Verify PostgreSQL is running
docker-compose ps postgres

# Check PostgreSQL logs
docker-compose logs postgres

# Verify connection
docker-compose exec postgres pg_isready
```

### Port Already in Use

```bash
# Change port in docker-compose.yml or .env
# Or free the port:
# On Linux/Mac:
lsof -i :5000
kill -9 <PID>

# On Windows:
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

### Memory/Performance Issues

```bash
# Reduce resource usage in docker-compose.yml
# Or increase Docker resources
docker run --memory=4g --cpus=2
```

## 13. Security Checklist

Before production deployment:

- [ ] Change all default passwords
- [ ] Set strong JWT_SECRET
- [ ] Configure HTTPS/TLS
- [ ] Enable authentication for all services
- [ ] Set up proper firewall rules
- [ ] Enable rate limiting
- [ ] Configure monitoring and alerting
- [ ] Perform security scan
- [ ] Set up backup strategy
- [ ] Configure log retention

## 14. Next Steps

1. Review [ARCHITECTURE.md](ARCHITECTURE.md)  for system design
2. Check [API.md](API.md) for API documentation
3. Read [DEPLOYMENT.md](DEPLOYMENT.md) for production setup
4. Review [SECURITY.md](SECURITY.md) for security guidelines

## Support

For issues or questions:
- Check logs in `docker-compose logs`
- Review error messages carefully
- Check the monitoring dashboards
- Consult documentation
- Open an issue on GitHub
