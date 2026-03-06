# Security Guide

## Security Architecture

This document outlines the security measures implemented in the AI Banking Self-Service Platform.

## 1. Authentication & Authorization

### 1.1 Multi-Factor Authentication (MFA)

**Supported Methods:**
- Password + OTP (SMS/Email)
- Biometric (Fingerprint, Face Recognition)
- OAuth 2.0 / OpenID Connect
- Hardware Security Keys (FIDO2)

**Implementation:**
```typescript
// Pseudo-code for MFA flow
const authenticateUser = async (identity: string, mfaMethod: string) => {
  // Step 1: Verify credentials
  const user = await verifyCredentials(identity, password);
  
  // Step 2: Send MFA challenge
  if (mfaMethod === 'otp') {
    await sendOTP(user.email);
  } else if (mfaMethod === 'biometric') {
    await initiateBiometricChallenge();
  }
  
  // Step 3: Verify MFA response
  const mfaToken = await verifyMFAResponse(otp);
  
  // Step 4: Generate session token
  return generateJWT(user, mfaToken);
};
```

### 1.2 Role-Based Access Control (RBAC)

**Roles:**
- `CUSTOMER` - End user with limited permissions
- `AGENT` - Contact center agent
- `ADMIN` - System administrator
- `AUDITOR` - Read-only audit access

**Permission Examples:**
```
CUSTOMER:
  - View own account
  - Execute transactions (within limits)
  - View own transactions

AGENT:
  - View assigned conversations
  - Escalate to supervisor
  - Update transaction status

ADMIN:
  - Manage users
  - Configure system
  - Access audit logs
```

### 1.3 OAuth 2.0 Integration

**Supported Providers:**
- Azure AD / Microsoft Entra
- Okta
- Auth0
- Custom OAuth 2.0 servers

**Flow:**
```
User → Bank OAuth Provider → ID Token + Access Token
         ↓
     API Gateway validates token
         ↓
     Access to resources granted
```

## 2. Data Protection

### 2.1 Encryption at Rest

**Database Encryption:**
```sql
-- PostgreSQL with pgcrypto extension
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE accounts (
  id UUID PRIMARY KEY,
  account_number VARCHAR(20),
  encrypted_data BYTEA,
  encryption_key_id UUID
);

-- Encrypt sensitive data
INSERT INTO accounts 
VALUES (gen_random_uuid(), '12345678', 
        pgp_sym_encrypt('sensitive_data', 'encryption_key'), 
        key_id);
```

**Field-Level Encryption:**
- SSN: AES-256 encrypted
- Card Numbers: Tokenized via PCI gateway
- Passwords: Bcrypt with salt (work factor: 12)
- API Keys: Encrypted in database

### 2.2 Encryption in Transit

**TLS Configuration:**
- Minimum: TLS 1.2
- Recommended: TLS 1.3
- Cipher Suites: Only strong ciphers (no RC4, DES, MD5)

**HSTS Header:**
```
Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
```

### 2.3 Key Management

**Secrets Storage:**
- Development: `.env` file (ignored from git)
- Staging/Prod: Cloud Key Vaults
  - Azure: Azure Key Vault
  - AWS: AWS Secrets Manager
  - GCP: Google Cloud KMS

**Key Rotation:**
```bash
# Automatic rotation every 90 days
az keyvault key rotate \
  --vault-name banking-ai-keyvault \
  --name encryption-key
```

## 3. API Security

### 3.1 Authentication

**All API calls require JWT token:**
```bash
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Token Structure:**
```json
{
  "header": {
    "alg": "HS256",
    "typ": "JWT"
  },
  "payload": {
    "sub": "customer-123",
    "iat": 1614749400,
    "exp": 1614753000,
    "aud": "banking-ai-api",
    "scopes": ["read:accounts", "write:transactions"]
  },
  "signature": "..."
}
```

### 3.2 Rate Limiting

**Per User:**
- 100 requests/minute for API calls
- 30 login attempts/hour
- 5 OTP attempts/5 minutes

**Implementation:**
```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 100,
  message: 'Too many requests',
  keyGenerator: (req) => req.user.id,
  skip: (req) => req.user.role === 'ADMIN'
});

app.use('/api/', limiter);
```

### 3.3 CORS Configuration

```javascript
const cors = require('cors');

app.use(cors({
  origin: ['https://banking-ai.com', 'https://app.banking-ai.com'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  maxAge: 600
}));
```

### 3.4 Input Validation & Sanitization

**Validation Example:**
```typescript
import { body, validationResult } from 'express-validator';

app.post('/api/transactions/transfer', 
  body('to_account').isBankAccountNumber(),
  body('amount').isFloat({ min: 0.01, max: 999999.99 }),
  body('description').trim().isLength({ max: 255 }),
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    // Process transfer
  }
);
```

## 4. Transaction Security

### 4.1 High-Value Transaction Protection

**Transaction Limits:**
```
Standard Customer: $5,000/day
Verified Customer: $50,000/day
VIP Customer: Up to $500,000/day (with manager approval)
```

**Dual Authorization for Large Amounts:**
```
Amount > $50,000
  ├─ Customer Authorization (OTP)
  ├─ Bank Agent Approval
  └─ Compliance Check
```

### 4.2 Fraud Detection

**Pattern Analysis:**
```python
from sklearn.ensemble import IsolationForest

def detect_fraud(transaction):
    features = [
        transaction['amount'],
        time.hour,
        is_new_payee,
        distance_from_home,
        historical_pattern_deviation
    ]
    
    model = load_trained_model()
    anomaly_score = model.predict([features])
    
    if anomaly_score > threshold:
        trigger_manual_review(transaction)
```

**Real-time Monitoring:**
- Amount spike detection
- Unusual frequency
- New geolocation
- Device change

## 5. Audit & Logging

### 5.1 Comprehensive Audit Logs

**Logged Events:**
- Authentication (success, failure, method)
- Data access (user, resource, timestamp)
- Transactions (all operations)
- Configuration changes
- Exception handling

**Audit Log Structure:**
```sql
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY,
  timestamp TIMESTAMP NOT NULL,
  user_id VARCHAR(100),
  action VARCHAR(255) NOT NULL,
  resource_type VARCHAR(100),
  resource_id VARCHAR(100),
  changes JSONB,
  ip_address INET,
  user_agent TEXT,
  status VARCHAR(50),
  error_message TEXT
);

CREATE INDEX idx_audit_timestamp_user 
  ON audit_logs(timestamp DESC, user_id);
```

### 5.2 Log Security

**Requirements:**
- Immutable logs (append-only)
- Tamper detection
- Encrypted transmission
- Retention: 7 years minimum for regulated events

**Implementation:**
```javascript
// Hash-chained logging for tamper detection
const auditLog = {
  id: generateId(),
  timestamp: Date.now(),
  event: eventData,
  previous_hash: lastLogHash,
  hash: null // Calculate below
};

auditLog.hash = crypto
  .createHash('sha256')
  .update(JSON.stringify(auditLog))
  .digest('hex');
```

## 6. PCI DSS & Compliance

### 6.1 Payment Security

**PCI DSS Requirements Implemented:**
1. ✅ Secure firewall configuration
2. ✅ No default security credentials
3. ✅ Protect stored data
4. ✅ Data encryption in transit
5. ✅ Malware protection
6. ✅ Secure system development
7. ✅ Restrict access to data
8. ✅ Identification/authentication
9. ✅ Physical access control
10. ✅ Monitor network
11. ✅ Security testing
12. ✅ Information security policy

**Card Data Handling:**
```
        ┌─────────────────────────┐
        │   User Enters Card      │
        └────────┬────────────────┘
                 │
        ┌────────▼────────────────┐
        │   Client-side Encrypt   │ (No server sees card)
        │   (TLS + JS)            │
        └────────┬────────────────┘
                 │
        ┌────────▼────────────────┐
        │  PCI-Compliant Gateway  │
        │  (Stripe/Square)        │
        └────────┬────────────────┘
                 │
        ┌────────▼────────────────┐
        │   Return Token Only     │
        │   (Store in DB)         │
        └─────────────────────────┘
```

### 6.2 Data Residency

**Compliance Options:**
- GDPR: Data stored in EU
- CCPA: Data processed per request
- HIPAA: Encrypted with compliance
- SOC 2 Type II: Regular audits

## 7. Network Security

### 7.1 Firewall Rules

**Ingress Rules:**
```
Port    Service              Source
80      HTTP (redirect)      0.0.0.0/0
443     HTTPS (API)          0.0.0.0/0
3000    Frontend             CDN IPs
5672    RabbitMQ             Internal only
6379    Redis                Internal only
5432    PostgreSQL           Internal only
```

### 7.2 API Gateway Protection

```nginx
# Rate limiting
limit_req_zone $binary_remote_addr zone=api_limit:10m rate=100r/m;

# Web Application Firewall (WAF)
location / {
    limit_req zone=api_limit burst=20;
    
    # Block suspicious patterns
    if ($request_uri ~ "(?:union|select|insert|delete|script|javascript)") {
        return 403;
    }
}
```

## 8. Vulnerability Management

### 8.1 Dependency Scanning

```bash
# Scan for vulnerabilities
npm audit --production

# Check Docker images
docker scan api-gateway:latest

# OWASP Dependency Check
./dependency-check.sh
```

### 8.2 Penetration Testing

**Annual Security Assessment:**
- External penetration testing
- Code review by security experts
- Threat modeling
- Vulnerability disclosure program

### 8.3 Bug Bounty Program

- HackerOne integration
- Coordinated disclosure
- Security researcher rewards

## 9. Incident Response

### 9.1 Incident Classification

| Severity | Impact | Response Time |
|----------|--------|----------------|
| Critical | Service down, data breach | 15 minutes |
| High | Degraded service, auth issue | 1 hour |
| Medium | Single feature down | 4 hours |
| Low | Minor issue | 24 hours |

### 9.2 Response Procedure

```
Detection
    ↓
Verification
    ↓
Escalation
    ↓
Containment
    ↓
Investigation
    ↓
Recovery
    ↓
Post-mortem
```

### 9.3 Communication

- Incident timeline
- User notification (within 1 hour for data incidents)
- Regulatory reporting (if required)
- Post-incident review

## 10. Security Checklist

- [ ] All endpoints require authentication
- [ ] Sensitive data encrypted at rest
- [ ] TLS 1.2+ enforced
- [ ] Rate limiting configured
- [ ] Input validation enabled
- [ ] SQL injection prevention (parameterized queries)
- [ ] XSS protection headers set
- [ ] CSRF tokens implemented
- [ ] Audit logging enabled
- [ ] Secrets not in source code
- [ ] Dependencies updated
- [ ] Security headers configured
- [ ] Monitoring/alerting active
- [ ] Backup tested
- [ ] Disaster recovery plan documented

## Additional Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [PCI DSS Requirements](https://www.pcisecuritystandards.org/)
- [NIST Cybersecurity Framework](https://www.nist.gov/cyberframework)
- [CWE/SANS Top 25](https://cwe.mitre.org/top25/)
