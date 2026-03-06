-- Initialize Banking AI Database
-- This script creates all necessary tables and indexes

-- ==================== Customers ====================
CREATE TABLE IF NOT EXISTS customers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(20),
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    date_of_birth DATE,
    language_preference VARCHAR(10) DEFAULT 'en',
    timezone VARCHAR(50) DEFAULT 'UTC',
    kyc_verified BOOLEAN DEFAULT false,
    kyc_verification_date TIMESTAMP,
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_customer_email ON customers(email);
CREATE INDEX IF NOT EXISTS idx_customer_status ON customers(status);

-- ==================== Accounts ====================
CREATE TABLE IF NOT EXISTS accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    account_number VARCHAR(20) NOT NULL UNIQUE,
    account_type VARCHAR(50),
    currency VARCHAR(3) DEFAULT 'USD',
    balance DECIMAL(15, 2) DEFAULT 0.00,
    available_balance DECIMAL(15, 2) DEFAULT 0.00,
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_account_customer_id ON accounts(customer_id);
CREATE INDEX IF NOT EXISTS idx_account_number ON accounts(account_number);
CREATE INDEX IF NOT EXISTS idx_account_status ON accounts(status);

-- ==================== Sessions ====================
CREATE TABLE IF NOT EXISTS sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    auth_method VARCHAR(50),
    authenticated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP,
    ip_address INET,
    user_agent TEXT,
    device_info JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_session_customer_id ON sessions(customer_id);
CREATE INDEX IF NOT EXISTS idx_session_expires_at ON sessions(expires_at);

-- ==================== Conversations ====================
CREATE TABLE IF NOT EXISTS conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID REFERENCES sessions(id) ON DELETE SET NULL,
    customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
    channel VARCHAR(50),
    language VARCHAR(10) DEFAULT 'en',
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ended_at TIMESTAMP,
    duration_seconds INT,
    status VARCHAR(50) DEFAULT 'active',
    primary_intent VARCHAR(100),
    escalated_to_agent_id UUID,
    conversation_data JSONB,
    satisfaction_rating DECIMAL(2, 1),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_conversation_customer_id ON conversations(customer_id);
CREATE INDEX IF NOT EXISTS idx_conversation_status ON conversations(status);
CREATE INDEX IF NOT EXISTS idx_conversation_started_at ON conversations(started_at);

-- ==================== Messages ====================
CREATE TABLE IF NOT EXISTS messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
    sender_type VARCHAR(50),
    sender_id VARCHAR(100),
    content TEXT NOT NULL,
    message_type VARCHAR(50) DEFAULT 'text',
    intent VARCHAR(100),
    entities JSONB,
    confidence DECIMAL(3, 2),
    sentiment VARCHAR(50),
    sentiment_score DECIMAL(3, 2),
    metadata JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_message_conversation_id ON messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_message_created_at ON messages(created_at);

-- ==================== Transactions ====================
CREATE TABLE IF NOT EXISTS transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
    conversation_id UUID REFERENCES conversations(id) ON DELETE SET NULL,
    type VARCHAR(50),
    amount DECIMAL(15, 2),
    currency VARCHAR(3) DEFAULT 'USD',
    from_account VARCHAR(20),
    to_account VARCHAR(20),
    to_account_holder_name VARCHAR(255),
    description TEXT,
    status VARCHAR(50),
    initiated_by VARCHAR(50),
    authorized_by VARCHAR(100),
    authorization_timestamp TIMESTAMP,
    core_banking_ref VARCHAR(100) UNIQUE,
    fee DECIMAL(10, 2) DEFAULT 0.00,
    metadata JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_transaction_customer_id ON transactions(customer_id);
CREATE INDEX IF NOT EXISTS idx_transaction_status ON transactions(status);
CREATE INDEX IF NOT EXISTS idx_transaction_created_at ON transactions(created_at);
CREATE INDEX IF NOT EXISTS idx_transaction_core_banking_ref ON transactions(core_banking_ref);

-- ==================== Audit Logs ====================
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
    action VARCHAR(255) NOT NULL,
    resource_type VARCHAR(100),
    resource_id VARCHAR(100),
    changes JSONB,
    ip_address INET,
    user_agent TEXT,
    user_id VARCHAR(100),
    status VARCHAR(50),
    error_message TEXT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_audit_customer_id ON audit_logs(customer_id);
CREATE INDEX IF NOT EXISTS idx_audit_action ON audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_timestamp ON audit_logs(timestamp);

-- ==================== Escalations ====================
CREATE TABLE IF NOT EXISTS escalations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
    customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
    reason VARCHAR(255),
    skill VARCHAR(100),
    priority VARCHAR(50),
    assigned_agent_id UUID,
    assigned_agent_name VARCHAR(255),
    queue_wait_time_seconds INT,
    resolved_at TIMESTAMP,
    resolution_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_escalation_conversation_id ON escalations(conversation_id);
CREATE INDEX IF NOT EXISTS idx_escalation_customer_id ON escalations(customer_id);

-- ==================== Agents ====================
CREATE TABLE IF NOT EXISTS agents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(20),
    role VARCHAR(50),
    skills TEXT[],
    language_preferences VARCHAR(10)[],
    status VARCHAR(50) DEFAULT 'available',
    availability_status VARCHAR(50) DEFAULT 'available',
    max_concurrent_conversations INT DEFAULT 3,
    conversation_count INT DEFAULT 0,
    average_handling_time INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_agent_email ON agents(email);
CREATE INDEX IF NOT EXISTS idx_agent_status ON agents(status);

-- ==================== Knowledge Base ====================
CREATE TABLE IF NOT EXISTS knowledge_base (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category VARCHAR(100),
    title VARCHAR(255) NOT NULL,
    content TEXT,
    keywords VARCHAR(255)[],
    language VARCHAR(10) DEFAULT 'en',
    intent_mapping VARCHAR(100)[],
    use_count INT DEFAULT 0,
    last_used_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_kb_category ON knowledge_base(category);
CREATE INDEX IF NOT EXISTS idx_kb_language ON knowledge_base(language);

-- ==================== Analytics Events ====================
CREATE TABLE IF NOT EXISTS analytics_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_type VARCHAR(100),
    customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
    conversation_id UUID REFERENCES conversations(id) ON DELETE SET NULL,
    transaction_id UUID REFERENCES transactions(id) ON DELETE SET NULL,
    channel VARCHAR(50),
    properties JSONB,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_analytics_event_type ON analytics_events(event_type);
CREATE INDEX IF NOT EXISTS idx_analytics_customer_id ON analytics_events(customer_id);
CREATE INDEX IF NOT EXISTS idx_analytics_timestamp ON analytics_events(timestamp);

-- ==================== Create Views for Reporting ====================

-- Conversation Summary View
CREATE OR REPLACE VIEW conversation_summary AS
SELECT 
    c.id,
    c.customer_id,
    c.channel,
    c.language,
    c.started_at,
    c.ended_at,
    EXTRACT(EPOCH FROM (c.ended_at - c.started_at))/60 as duration_minutes,
    c.status,
    c.primary_intent,
    COUNT(m.id) as message_count,
    c.satisfaction_rating,
    c.escalated_to_agent_id
FROM conversations c
LEFT JOIN messages m ON c.id = m.conversation_id
GROUP BY c.id, c.customer_id, c.channel, c.language, c.started_at, c.ended_at, 
         c.status, c.primary_intent, c.satisfaction_rating, c.escalated_to_agent_id;

-- Daily Analytics View
CREATE OR REPLACE VIEW daily_analytics AS
SELECT 
    DATE(c.started_at) as date,
    c.channel,
    COUNT(DISTINCT c.id) as total_conversations,
    COUNT(DISTINCT c.customer_id) as unique_customers,
    AVG(EXTRACT(EPOCH FROM (c.ended_at - c.started_at))/60) as avg_duration_minutes,
    AVG(c.satisfaction_rating) as avg_satisfaction,
    SUM(CASE WHEN c.status = 'escalated' THEN 1 ELSE 0 END) as escalation_count,
    SUM(COALESCE((SELECT SUM(amount) FROM transactions t WHERE t.conversation_id = c.id), 0)) as total_transaction_value
FROM conversations c
WHERE c.ended_at IS NOT NULL
GROUP BY DATE(c.started_at), c.channel;

-- Create Indexes for Performance
CREATE INDEX idx_conversations_customer_created ON conversations(customer_id, created_at DESC);
CREATE INDEX idx_messages_conversation_created ON messages(conversation_id, created_at DESC);
CREATE INDEX idx_transactions_customer_created ON transactions(customer_id, created_at DESC);
CREATE INDEX idx_audit_logs_timestamp_action ON audit_logs(timestamp DESC, action);

-- ==================== Partitioning (Optional for large scale) ====================
-- Uncomment to enable partitioning on messages table
-- ALTER TABLE messages PARTITION BY RANGE (YEAR(created_at)) (
--     PARTITION p2024 VALUES LESS THAN (2025),
--     PARTITION p2025 VALUES LESS THAN (2026),
--     PARTITION p_max VALUES LESS THAN MAXVALUE
-- );

-- ==================== Grants (Update as needed) ====================
-- GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO bankinguser;
-- GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO bankinguser;
