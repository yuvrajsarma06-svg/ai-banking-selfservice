# System Architecture & Design

## Overview

The AI Banking Self-Service Platform is built on a microservices architecture designed for scalability, resilience, and maintainability. The system handles concurrent requests from multiple touchpoints (kio sks, mobile, voice) while maintaining security and data consistency.

## Core Components

### 1. API Gateway
**Responsibility**: Request routing, authentication, rate limiting, request/response transformation

**Technology**: Kong or AWS API Gateway
- Validates JWT tokens
- Enforces rate limiting (100 req/min per user)
- Logs all requests for audit
- Adds correlation IDs
- Handles CORS

### 2. Conversation Engine (Core)
**Responsibility**: Natural language understanding and dialogue management

**Components**:
- **NLU Module**: Intent and entity extraction
  - Input: User messages in multiple languages
  - Output: Intent, entities, confidence scores
  - Tech: Rasa NLU / Azure Language Understanding
  
- **LLM Service**: Generative responses
  - Tech: Azure OpenAI GPT-4 / Claude
  - Implements Retrieval-Augmented Generation (RAG)
  - Context window: 8K tokens
  
- **Dialogue Manager**: Context and flow management
  - Maintains conversation state
  - Tracks user intent history
  - Manages dialogue turns
  
- **Knowledge Base**: FAQ and help content
  - Indexed in Elasticsearch
  - Updated via admin panel
  - Supports 15+ languages

**Workflow**:
```
User Input → Translator → NLU → Intent Match → 
Context Retrieval → LLM Generation → Response → TTS → User
```

### 3. Authentication Service
**Responsibility**: Secure user identification and authorization

**Authentication Methods**:
- **Username/Password**: Standard login flow
- **Biometric**: Fingerprint, facial recognition
- **OTP**: One-time password for transactions
- **OAuth 2.0**: Third-party integration

**Token Management**:
- JWT for session tokens (15 min expiry)
- Refresh tokens (7 day expiry)
- Redis store for token blacklist

**Authorization**:
- Role-based access control (RBAC)
- Resource-based access control (RBAC)
- Fine-grained permissions

### 4. Transaction Service
**Responsibility**: Banking operations execution

**Transaction Types**:
- Account balance inquiry
- Statement generation
- Fund transfer (P2P, Bill payment)
- Card management
- Loan application
- Complaint registration

**Safety Mechanisms**:
- Dual authorization for high-value transfers
- Transaction limits based on customer profile
- Fraud detection (pattern analysis)
- Audit trail for all transactions

**Integration**: Direct connection to Core Banking System (Temenos, FISC, etc.)

### 5. Voice Bot Orchestration
**Responsibility**: IVR and voice interaction management

**Components**:
- **Speech-to-Text**: Converts voice to text
  - Tech: Azure Speech-to-Text / Google Cloud Speech-to-Text
  - Language detection
  - Noise filtering
  
- **Speech Synthesis**: Text-to-speech conversion
  - Multiple voice options per language
  - Natural prosody
  - Speed/pitch customization
  
- **Telephony Interface**: PSTN/VoIP integration
  - Tech: Twilio / Asterisk / PJSIP
  - Handles call routing
  - Conference management
  - Call recording (with compliance)

**IVR Flow**:
```
Incoming Call → Auth Verification → Language Selection → 
Voice NLU → Intent Processing → Voice Bot Dialog → 
[Complex? → Escalate to Agent] or [Resolved]
```

### 6. Agent Portal & Escalation
**Responsibility**: Human agent interface and case management

**Features**:
- Real-time queue management
- Full conversation context display
- One-click call transfer
- Internal notes & case documentation
- Knowledge base search
- Performance metrics

### 7. Analytics & Monitoring
**Responsibility**: Real-time insights and system health

**Metrics Tracked**:
- Conversation metrics (duration, turns, satisfaction)
- Transaction success rates
- System performance (latency, throughput)
- Agent performance (AHT, resolution rate)
- User demographics and patterns

**Dashboards**:
- Executive dashboard
- Operations dashboard
- Agent performance dashboard
- Customer analytics

## Data Flow

### Happy Path: Account Balance Query
```
1. Customer touches "Account Balance" on kiosk
2. Biometric authentication
3. Conversation Engine: Identifies intent "balance_inquiry"
4. Transaction Service: Retrieves account balance from Core Banking
5. Response generated in customer's language
6. Displayed/spoken to customer
```

### Complex Path: Fund Transfer with Escalation
```
1. Customer: "I want to transfer $50,000 to another account"
2. NLU detects: intent=transfer, amount=50000 (HIGH VALUE)
3. Transaction Service triggers dual auth requirement
4. System: "This is a high-value transfer. Please confirm with your agent."
5. Escalate to human agent
6. Agent verifies identity, approves transfer
7. Transaction executed
8. Confirmation sent via SMS/email
```

## Database Schema (Key Tables)

```sql
-- Customers
CREATE TABLE customers (
  id UUID PRIMARY KEY,
  name VARCHAR(255),
  email VARCHAR(255) UNIQUE,
  phone VARCHAR(20),
  language_preference VARCHAR(10),
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);

-- Sessions
CREATE TABLE sessions (
  id UUID PRIMARY KEY,
  customer_id UUID REFERENCES customers(id),
  auth_method VARCHAR(50),
  authenticated_at TIMESTAMP,
  expires_at TIMESTAMP,
  ip_address INET,
  device_info JSONB
);

-- Conversations
CREATE TABLE conversations (
  id UUID PRIMARY KEY,
  session_id UUID REFERENCES sessions(id),
  customer_id UUID REFERENCES customers(id),
  channel VARCHAR(50), -- 'kiosk', 'mobile', 'voice'
  language VARCHAR(10),
  started_at TIMESTAMP,
  ended_at TIMESTAMP,
  status VARCHAR(50), -- 'active', 'closed', 'escalated'
  primary_intent VARCHAR(100),
  escalated_to_agent_id UUID
);

-- Messages
CREATE TABLE messages (
  id UUID PRIMARY KEY,
  conversation_id UUID REFERENCES conversations(id),
  sender_type VARCHAR(50), -- 'user', 'bot', 'agent'
  content TEXT,
  intent VARCHAR(100),
  entities JSONB,
  confidence DECIMAL(3,2),
  created_at TIMESTAMP
);

-- Transactions
CREATE TABLE transactions (
  id UUID PRIMARY KEY,
  customer_id UUID REFERENCES customers(id),
  type VARCHAR(50),
  amount DECIMAL(15,2),
  from_account VARCHAR(20),
  to_account VARCHAR(20),
  status VARCHAR(50),
  initiated_by VARCHAR(50), -- 'bot', 'agent', 'customer'
  core_banking_ref VARCHAR(100) UNIQUE,
  created_at TIMESTAMP,
  completed_at TIMESTAMP
);

-- Audit Logs
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY,
  customer_id UUID REFERENCES customers(id),
  action VARCHAR(255),
  resource_type VARCHAR(100),
  resource_id VARCHAR(100),
  changes JSONB,
  ip_address INET,
  user_agent TEXT,
  timestamp TIMESTAMP,
  INDEX idx_customer_timestamp (customer_id, timestamp)
);
```

## Security Architecture

### Authentication Flow
```
[User] → [API Gateway] → [Auth Service]
              ↓
         JWT Validation
              ↓
    [Authorization Check]
              ↓
    [Route to Service]
```

### Data Protection
- **Encryption at Rest**: AES-256 for databases
- **Encryption in Transit**: TLS 1.3 for all connections
- **Field-Level Encryption**: SSN, Card numbers
- **Tokenization**: Card data tokenized via PCI-compliant gateway

### Audit & Compliance
- All data access logged
- Geographic data residency (can be configured)
- GDPR-compliant data deletion
- Regular security audits
- Penetration testing quarterly

## Scalability Considerations

### Horizontal Scaling
- Microservices deployed on Kubernetes
- Auto-scaling based on:
  - Conversation Engine: CPU usage
  - Voice Bot: Concurrent calls
  - Transaction Service: Queue depth
  - API Gateway: Request rate

### Caching Strategy
```
User Session → Redis (5 min TTL)
Knowledge Base → Redis (24 hour TTL)
User Preferences → Redis (1 hour TTL)
Frequently Accessed Accounts → Redis
```

### Load Balancing
- Round-robin for API Gateway
- Least-connections for Transaction Service
- Geographic distribution (CDN for static assets)

## Disaster Recovery

### RPO (Recovery Point Objective): 15 minutes
### RTO (Recovery Time Objective): 30 minutes

**Measures**:
- Multi-region replication
- Transaction log backups (continuous)
- Point-in-time recovery capability
- Automated failover
- Regular DR drills

## Monitoring & Observability

### Logging
- **Centralized Logging**: ELK Stack
- **Log Retention**: 90 days for all logs
- **Sensitive Data**: Masked in logs (PAN, SSN)

### Metrics
- **Collection**: Prometheus
- **Visualization**: Grafana
- **Alerting**: AlertManager

### Tracing
- **Distributed Tracing**: Jaeger/Zipkin
- **Correlation IDs**: Across all services
- **Latency Analysis**: SLA monitoring

### Health Checks
- Service liveness checks (every 10s)
- Readiness checks before routing
- Database connectivity checks
- External API availability checks
