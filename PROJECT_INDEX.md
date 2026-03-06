# Project Index & Directory Structure

## 📁 Complete File Structure

```
ai-banking-selfservice/
│
├── 📄 README.md                          # Main project documentation
├── 📄 QUICKSTART.md                      # Quick start guide (5 minutes)
├── 📄 package.json                       # Root package configuration
├── 📄 tsconfig.json                      # TypeScript configuration
├── 📄 .gitignore                         # Git ignore rules
├── 📄 .env.example                       # Environment variables template
├── 📄 docker-compose.yml                 # Docker Compose orchestration
│
├── 📂 backend/                           # All backend microservices
│   ├── 📂 api-gateway/                   # API Gateway service
│   │   ├── package.json                  # Dependencies
│   │   ├── Dockerfile                    # Container configuration
│   │   ├── tsconfig.json
│   │   └── src/
│   │       ├── index.ts                  # Entry point
│   │       ├── middleware/               # Express middleware
│   │       ├── routes/                   # API routes
│   │       ├── services/                 # Business logic
│   │       └── utils/                    # Utilities
│   │
│   ├── 📂 auth-service/                  # Authentication service
│   │   ├── package.json
│   │   ├── Dockerfile
│   │   └── src/
│   │       ├── controllers/              # Request handlers
│   │       ├── models/                   # Data models
│   │       ├── services/                 # Auth logic
│   │       └── middleware/               # Auth middleware
│   │
│   ├── 📂 conversation-engine/           # Conversation AI
│   │   ├── package.json
│   │   ├── Dockerfile
│   │   └── src/
│   │       ├── nlu/                      # NLU processing
│   │       ├── llm/                      # LLM integration
│   │       ├── dialogue/                 # Dialogue management
│   │       ├── knowledge-base/           # KB operations
│   │       └── translation/              # Multi-language
│   │
│   ├── 📂 transaction-service/           # Transaction processing
│   │   ├── package.json
│   │   ├── Dockerfile
│   │   └── src/
│   │       ├── handlers/                 # Transaction handlers
│   │       ├── validators/               # Input validation
│   │       ├── processors/               # Processing logic
│   │       ├── fraud-detection/          # Fraud check
│   │       └── core-banking/             # CB integration
│   │
│   └── 📂 analytics-service/             # Analytics & reporting
│       ├── package.json
│       ├── Dockerfile
│       └── src/
│           ├── collectors/               # Metrics collection
│           ├── processors/               # Data processing
│           ├── dashboards/               # Dashboard data
│           └── reports/                  # Report generation
│
├── 📂 voice-bot/                         # Voice/IVR bot service
│   ├── package.json
│   ├── Dockerfile
│   └── src/
│       ├── voice-engine/                 # Voice processing
│       ├── dialogs/                      # Dialog flows
│       ├── intents/                      # Intent handling
│       ├── escalation/                   # Agent escalation
│       └── sip-handler/                  # SIP protocol
│
├── 📂 frontend-kiosk/                    # React kiosk UI
│   ├── package.json
│   ├── Dockerfile
│   ├── nginx.conf                        # NGINX configuration
│   └── src/
│       ├── components/                   # React components
│       │   ├── Header/
│       │   ├── ChatWindow/
│       │   ├── VoiceButton/
│       │   ├── TransactionForm/
│       │   └── ...
│       ├── pages/                        # Page components
│       │   ├── Home/
│       │   ├── Login/
│       │   ├── Accounts/
│       │   ├── Transfer/
│       │   └── ...
│       ├── services/                     # API clients
│       ├── hooks/                        # Custom React hooks
│       ├── context/                      # React Context
│       ├── redux/                        # Redux store
│       │   ├── slices/
│       │   └── store.ts
│       ├── utils/                        # Utilities
│       ├── styles/                       # CSS/Styling
│       ├── i18n/                         # Internationalization
│       └── App.tsx
│
├── 📂 shared/                            # Shared code & types
│   ├── 📂 models/
│   │   ├── types.ts                      # TypeScript interfaces & types
│   │   ├── constants.ts                  # Shared constants
│   │   └── errors.ts                     # Error definitions
│   └── 📂 utils/
│       ├── logger.ts                     # Logging utility
│       ├── encryption.ts                 # Encryption helpers
│       └── validators.ts                 # Common validators
│
├── 📂 infrastructure/                    # Infrastructure & deployment
│   ├── 📂 db/
│   │   ├── init.sql                      # PostgreSQL initialization
│   │   ├── migrations/                   # Database migrations
│   │   └── seeds/                        # Test data
│   │
│   ├── 📂 kubernetes/                    # K8s manifests
│   │   ├── api-gateway-deployment.yaml
│   │   ├── auth-service-deployment.yaml
│   │   ├── conversation-engine-deployment.yaml
│   │   ├── transaction-service-deployment.yaml
│   │   ├── analytics-service-deployment.yaml
│   │   ├── voice-bot-deployment.yaml
│   │   ├── postgres-statefulset.yaml
│   │   ├── redis-statefulset.yaml
│   │   ├── elasticsearch-statefulset.yaml
│   │   ├── ingress.yaml
│   │   ├── configmap.yaml
│   │   └── secrets.yaml
│   │
│   ├── 📂 terraform/                     # Terraform IaC
│   │   ├── main.tf
│   │   ├── variables.tf
│   │   ├── outputs.tf
│   │   ├── vpc.tf
│   │   ├── kubernetes.tf
│   │   ├── databases.tf
│   │   └── terraform.tfvars.example
│   │
│   ├── 📂 monitoring/
│   │   ├── prometheus.yml                # Prometheus configuration
│   │   ├── alert_rules.yml               # Alert rules
│   │   └── 📂 grafana/
│   │       ├── datasources/
│   │       └── dashboards/
│   │
│   └── 📂 scripts/
│       ├── deploy.sh                     # Deployment script
│       ├── backup.sh                     # Backup script
│       ├── restore.sh                    # Restore script
│       └── health-check.sh               # Health check script
│
├── 📂 docs/                              # Documentation
│   ├── 📄 ARCHITECTURE.md               # System architecture & design
│   ├── 📄 API.md                        # API documentation
│   ├── 📄 SETUP.md                      # Setup & installation guide
│   ├── 📄 DEPLOYMENT.md                 # Deployment guide
│   ├── 📄 SECURITY.md                   # Security guidelines
│   ├── 📄 CONTRIBUTING.md               # Contributing guide
│   ├── 📄 TROUBLESHOOTING.md            # Troubleshooting guide
│   └── 📂 diagrams/                     # Architecture diagrams
│       ├── system-architecture.png
│       ├── data-flow.png
│       └── deployment-topology.png
└── 📂 .github/                           # GitHub configuration
    ├── 📂 workflows/
    │   ├── ci.yml                        # CI/CD pipeline
    │   ├── deploy.yml                    # Deployment workflow
    │   └── security-scan.yml             # Security scanning
    └── 📂 ISSUE_TEMPLATE/
        ├── BUG_REPORT.md
        ├── FEATURE_REQUEST.md
        └── SECURITY_ISSUE.md
```

## 📋 Key Components Summary

### Backend Services

| Service | Port | Purpose | Tech |
|---------|------|---------|------|
| API Gateway | 5000 | Request routing & auth | Express.js + Kong |
| Auth Service | 5001 | Authentication | Node.js + PostgreSQL |
| Conversation Engine | 5002 | AI/NLU | Node.js + Azure OpenAI |
| Transaction Service | 5003 | Banking operations | Node.js + PostgreSQL |
| Analytics Service | 5004 | Metrics & reporting | Node.js + Elasticsearch |
| Voice Bot | 5005 | IVR & voice interaction | Node.js + Twilio |

### Infrastructure

| Component | Port | Purpose | Stack |
|-----------|------|---------|-------|
| Frontend (Kiosk) | 3000 | UI for kiosks/tablets | React + Material-UI |
| PostgreSQL | 5432 | Primary database | PostgreSQL 15 |
| Redis | 6379 | Caching & sessions | Redis 7 |
| Elasticsearch | 9200 | Log & search indexing | Elasticsearch 8.6 |
| RabbitMQ | 5672 | Message queue | RabbitMQ 3.12 |
| Prometheus | 9090 | Metrics collection | Prometheus |
| Grafana | 3001 | Metrics visualization | Grafana |
| Kibana | 5601 | Log visualization | Kibana 8.6 |

## 🚀 Quick Start Commands

```bash
# Clone & setup
git clone <repo> && cd ai-banking-selfservice
cp .env.example .env

# Start all services
docker-compose up -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f

# Run tests
npm run test:all

# Build for production
npm run build:all
```

## 📚 Documentation Quick Links

| Document | Purpose |
|----------|---------|
| [README.md](README.md) | Project overview |
| [QUICKSTART.md](QUICKSTART.md) | 5-minute quick start |
| [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) | System design & architecture |
| [docs/API.md](docs/API.md) | REST API documentation |
| [docs/SETUP.md](docs/SETUP.md) | Installation & setup guide |
| [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) | Production deployment guide |
| [docs/SECURITY.md](docs/SECURITY.md) | Security implementation |
| [docs/CONTRIBUTING.md](docs/CONTRIBUTING.md) | Contribution guidelines |

## 🔧 Development Workflow

### 1. Fork & Clone
```bash
git clone https://github.com/YOUR_USERNAME/ai-banking-selfservice.git
```

### 2. Create Feature Branch
```bash
git checkout -b feature/your-feature
```

### 3. Make Changes
- Edit code in appropriate service
- Follow code style guide
- Add tests for new code
- Update documentation

### 4. Commit & Push
```bash
git commit -m "feat(service): description"
git push origin feature/your-feature
```

### 5. Create Pull Request
- Fill PR template
- Link related issues
- Ensure all checks pass

## 🔐 Security Features

- ✅ Multi-factor authentication (MFA)
- ✅ OAuth 2.0 / OpenID Connect
- ✅ End-to-end encryption (TLS 1.3)
- ✅ Field-level encryption (AES-256)
- ✅ Role-based access control (RBAC)
- ✅ Comprehensive audit logging
- ✅ Rate limiting & DDoS protection
- ✅ PCI DSS compliance ready
- ✅ SOC 2 audit-ready
- ✅ Regular security assessments

## 📊 Monitoring & Observability

### Metrics Available
- Conversation metrics (count, duration, satisfaction)
- Transaction metrics (success rate, volume, value)
- System metrics (CPU, memory, latency)
- API metrics (requests, errors, response time)
- Agent metrics (AHT, resolution rate)

### Dashboards
- Executive Dashboard (KPIs)
- Operations Dashboard (real-time metrics)
- Agent Dashboard (performance)
- Customer Analytics Dashboard

### Logging
- Centralized ELK Stack
- 90-day retention
- Full-text search capability
- Tamper detection for audit logs

## 🧪 Testing Strategy

### Test Coverage
- Unit tests: 80%+ coverage
- Integration tests: All services
- E2E tests: Critical workflows
- Performance tests: Load testing

### Testing Commands
```bash
npm run test:all           # All tests
npm run test:backend       # Backend only
npm run test:frontend      # Frontend only
npm run lint:all          # Code quality
npm run format:all        # Code formatting
```

## 🚢 Deployment Options

- **Kubernetes**: Full K8s manifests included
- **Docker Compose**: Local & small deployments
- **Azure Container Instances**: Serverless containers
- **AWS ECS/Fargate**: AWS deployment
- **GCP Cloud Run**: GCP deployment
- **Managed Services**: PostgreSQL, Redis, Elasticsearch options

## 📈 Performance Targets

- **API Response Time**: < 200ms (p99)
- **Availability**: 99.9% uptime (4.5 hrs/month downtime)
- **Throughput**: 1000 req/sec per service
- **Conversation Bot**: 50 concurrent conversations
- **Voice Bot**: 100 concurrent calls
- **Database**: 10,000 TPS

## 🔄 CI/CD Pipeline

- **Triggers**: Git push, PR, manual
- **Stages**: Build → Test → Lint → Security Scan → Deploy
- **Code Quality**: SonarQube analysis
- **Security**: OWASP scanning, dependency check
- **Performance**: Load testing
- **Deployment**: Blue-green strategy

## 📞 Support & Community

- **Issues**: GitHub Issues
- **Discussions**: GitHub Discussions
- **Documentation**: Full wiki
- **Email**: support@banking-ai.com
- **Security**: security@banking-ai.com

## 📝 License

Proprietary - All Rights Reserved

---

**Last Updated**: March 2, 2026
**Version**: 1.0.0
**Status**: Production Ready ✅
