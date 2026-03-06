# API Documentation

## Base URL
```
Production: https://api.bankingai.com/v1
Staging: https://staging-api.bankingai.com/v1
Development: http://localhost:5000/v1
```

## Authentication

All endpoints require Bearer token authentication (except `/auth/*` endpoints).

```bash
Authorization: Bearer <JWT_TOKEN>
```

### Get Auth Token

**Endpoint**: `POST /auth/login`

**Request**:
```json
{
  "identity": "customer@example.com",
  "password": "secure_password",
  "mfa_method": "otp" | "biometric"
}
```

**Response** (200 OK):
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIs...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIs...",
  "expires_in": 900,
  "token_type": "Bearer",
  "user": {
    "id": "cust-123",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

---

## Conversation API

### Start Conversation

**Endpoint**: `POST /conversations/start`

**Request**:
```json
{
  "channel": "kiosk" | "mobile" | "voice",
  "language": "en" | "es" | "fr" | "zh" | ...,
  "device_info": {
    "device_type": "kiosk" | "tablet" | "phone",
    "os": "iOS" | "Android" | "Windows"
  },
  "context": {
    "preferred_account": "ACC-12345",
    "previous_session_id": "sess-789"
  }
}
```

**Response** (201 Created):
```json
{
  "conversation_id": "conv-abc123",
  "session_id": "sess-xyz789",
  "greeting_message": "Hello! How can I help you today?",
  "suggested_intents": [
    "balance_inquiry",
    "fund_transfer",
    "card_management",
    "complaint"
  ],
  "language": "en",
  "timestamp": "2024-03-02T10:30:00Z"
}
```

---

### Send Message

**Endpoint**: `POST /conversations/{conversation_id}/messages`

**Request**:
```json
{
  "content": "I want to transfer 500 to my savings account",
  "message_type": "text" | "audio",
  "audio_url": "https://...",
  "context": {
    "previous_intent": "balance_inquiry"
  }
}
```

**Response** (200 OK):
```json
{
  "message_id": "msg-123",
  "conversation_id": "conv-abc123",
  "user_message": {
    "content": "I want to transfer 500 to my savings account",
    "intent": "fund_transfer",
    "entities": {
      "amount": 500,
      "target_account_type": "savings"
    },
    "confidence": 0.96
  },
  "bot_response": {
    "content": "I'll help you transfer $500 to your savings account. Let me verify the details.",
    "action": "require_confirmation",
    "audio_url": "https://...",
    "next_step": "confirm_transfer"
  },
  "sentiment_analysis": {
    "sentiment": "neutral",
    "score": 0.0
  },
  "timestamp": "2024-03-02T10:31:15Z"
}
```

---

### Get Conversation History

**Endpoint**: `GET /conversations/{conversation_id}`

**Query Parameters**:
- `limit=50` - Number of messages (default: 50, max: 500)
- `offset=0` - Pagination offset
- `from_date=2024-03-01` - Filter messages from date (ISO 8601)
- `intent_filter=fund_transfer` - Filter by intent

**Response** (200 OK):
```json
{
  "conversation_id": "conv-abc123",
  "customer_id": "cust-123",
  "channel": "kiosk",
  "language": "en",
  "started_at": "2024-03-02T10:30:00Z",
  "ended_at": "2024-03-02T10:45:00Z",
  "status": "closed",
  "messages": [
    {
      "id": "msg-1",
      "sender": "customer",
      "content": "I want to check my balance",
      "intent": "balance_inquiry",
      "timestamp": "2024-03-02T10:30:15Z"
    },
    {
      "id": "msg-2",
      "sender": "bot",
      "content": "Your current balance is $5,000.",
      "timestamp": "2024-03-02T10:30:30Z"
    }
  ],
  "satisfaction_rating": 4.5,
  "resolution_status": "resolved"
}
```

---

### Escalate to Agent

**Endpoint**: `POST /conversations/{conversation_id}/escalate`

**Request**:
```json
{
  "reason": "Customer requesting human assistance",
  "skill": "vip_support" | "loan_specialist" | "complaint_handling",
  "wait_priority": "standard" | "high" | "emergency",
  "preserve_context": true
}
```

**Response** (200 OK):
```json
{
  "escalation_id": "esc-123",
  "conversation_id": "conv-abc123",
  "assigned_agent": {
    "id": "agent-456",
    "name": "Sarah Johnson",
    "skill": "vip_support"
  },
  "estimated_wait_time": 120,
  "context_transferred": true,
  "timestamp": "2024-03-02T10:32:00Z"
}
```

---

## Transaction API

### Get Accounts

**Endpoint**: `GET /accounts`

**Response** (200 OK):
```json
{
  "accounts": [
    {
      "id": "ACC-12345",
      "account_number": "****5678",
      "type": "checking",
      "currency": "USD",
      "balance": 5000.00,
      "available_balance": 4800.00,
      "status": "active",
      "last_transaction": "2024-03-02T09:15:00Z"
    },
    {
      "id": "ACC-12346",
      "account_number": "****9012",
      "type": "savings",
      "currency": "USD",
      "balance": 25000.00,
      "available_balance": 25000.00,
      "status": "active",
      "last_transaction": "2024-02-28T14:20:00Z"
    }
  ]
}
```

---

### Fund Transfer

**Endpoint**: `POST /transactions/transfer`

**Request**:
```json
{
  "from_account": "ACC-12345",
  "to_account": "ACC-98765",
  "amount": 500.00,
  "currency": "USD",
  "description": "Rent payment",
  "transaction_type": "p2p" | "bill_payment" | "international",
  "execution_date": "2024-03-02",
  "require_otp": true
}
```

**Response** (201 Created):
```json
{
  "transaction_id": "txn-123",
  "from_account": "ACC-12345",
  "to_account": "ACC-98765",
  "amount": 500.00,
  "currency": "USD",
  "status": "pending_otp",
  "reference_number": "REF-2024030200123",
  "estimated_completion": "2024-03-03T10:00:00Z",
  "otp_required": true,
  "otp_delivery_method": "sms",
  "message": "OTP sent to your registered mobile number",
  "timestamp": "2024-03-02T10:35:00Z"
}
```

---

### Confirm Transaction with OTP

**Endpoint**: `POST /transactions/{transaction_id}/confirm`

**Request**:
```json
{
  "otp": "123456",
  "confirmation_method": "otp" | "biometric"
}
```

**Response** (200 OK):
```json
{
  "transaction_id": "txn-123",
  "status": "completed",
  "reference_number": "REF-2024030200123",
  "amount": 500.00,
  "from_account": "ACC-12345",
  "to_account": "ACC-98765",
  "completed_at": "2024-03-02T10:36:00Z",
  "confirmation_reference": "CONF-123456789"
}
```

---

### Get Account Statement

**Endpoint**: `GET /accounts/{account_id}/statement`

**Query Parameters**:
- `from_date=2024-02-02` (ISO 8601)
- `to_date=2024-03-02` (ISO 8601)
- `format=pdf | csv | json` (default: json)

**Response** (200 OK):
```json
{
  "account_id": "ACC-12345",
  "statement_period": {
    "from": "2024-02-02",
    "to": "2024-03-02"
  },
  "opening_balance": 4500.00,
  "closing_balance": 5000.00,
  "transactions": [
    {
      "date": "2024-03-02",
      "description": "Transfer to Savings",
      "amount": 500.00,
      "balance_after": 5000.00,
      "reference": "REF-123"
    }
  ],
  "summary": {
    "total_deposits": 2000.00,
    "total_withdrawals": 1500.00,
    "transaction_count": 15
  }
}
```

---

## Analytics API

### Get Dashboard Metrics

**Endpoint**: `GET /analytics/dashboard`

**Query Parameters**:
- `period=today | week | month | year`
- `channel=kiosk | mobile | voice | all`

**Response** (200 OK):
```json
{
  "period": "month",
  "channels": {
    "kiosk": {
      "users": 1250,
      "conversations": 2100,
      "avg_duration": 245,
      "satisfaction_score": 4.3,
      "transactions": 850,
      "transaction_value": 245000
    },
    "mobile": {
      "users": 3200,
      "conversations": 5400,
      "avg_duration": 180,
      "satisfaction_score": 4.5,
      "transactions": 2300,
      "transaction_value": 680000
    },
    "voice": {
      "users": 800,
      "conversations": 920,
      "avg_call_duration": 420,
      "satisfaction_score": 4.1,
      "transactions": 280,
      "transaction_value": 145000
    }
  },
  "overall_metrics": {
    "total_users": 5250,
    "total_conversations": 8420,
    "avg_satisfaction": 4.3,
    "resolution_rate": 0.87,
    "escalation_rate": 0.13,
    "total_transactions": 3430,
    "total_transaction_value": 1070000
  }
}
```

---

## Error Responses

### Standard Error Format

```json
{
  "error": {
    "code": "AUTH_INVALID_TOKEN",
    "message": "Invalid or expired token",
    "details": {
      "reason": "Token expired",
      "expired_at": "2024-03-02T10:30:00Z"
    },
    "timestamp": "2024-03-02T10:35:00Z",
    "request_id": "req-abc123"
  }
}
```

### Common Error Codes

| Code | Status | Description |
|------|--------|-------------|
| `AUTH_INVALID_TOKEN` | 401 | Token is invalid or expired |
| `AUTH_REQUIRED` | 401 | Authentication required |
| `FORBIDDEN` | 403 | Access denied |
| `NOT_FOUND` | 404 | Resource not found |
| `VALIDATION_ERROR` | 400 | Request validation failed |
| `RATE_LIMIT_EXCEEDED` | 429 | Too many requests |
| `INTERNAL_SERVER_ERROR` | 500 | Server error |
| `SERVICE_UNAVAILABLE` | 503 | Service temporarily unavailable |

---

## Rate Limiting

- **Per User**: 100 requests/minute
- **Per Client**: 1000 requests/minute
- **Response Headers**:
  - `X-RateLimit-Limit: 100`
  - `X-RateLimit-Remaining: 45`
  - `X-RateLimit-Reset: 1614749400`

---

## Pagination

All list endpoints support pagination:

```
GET /endpoint?limit=20&offset=0
```

Response includes:
```json
{
  "data": [...],
  "pagination": {
    "limit": 20,
    "offset": 0,
    "total": 5250,
    "has_more": true
  }
}
```

---

## Webhooks

The platform supports webhooks for real-time events:

**Events**:
- `conversation.started`
- `conversation.ended`
- `message.received`
- `transaction.completed`
- `escalation.created`
- `agent.assignment`

**Example Webhook Registration**:
```bash
POST /webhooks
Content-Type: application/json

{
  "url": "https://yourbank.com/webhooks/banking-ai",
  "events": ["transaction.completed", "escalation.created"],
  "secret": "webhook_secret_key"
}
```
