/**
 * Shared TypeScript Models and Interfaces
 * Used across all services in the Banking AI Platform
 */

// ==================== User & Authentication ====================

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: UserRole;
  languagePreference: string;
  timezone: string;
  kycVerified: boolean;
  status: 'active' | 'inactive' | 'suspended' | 'deleted';
  createdAt: Date;
  updatedAt: Date;
}

export type UserRole = 'CUSTOMER' | 'AGENT' | 'ADMIN' | 'AUDITOR';

export interface AuthenticationRequest {
  identity: string; // Email or username
  password: string;
  mfaMethod?: 'otp' | 'biometric' | 'none';
  deviceInfo?: DeviceInfo;
}

export interface AuthenticationResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  tokenType: string;
  user: User;
}

export interface JWTPayload {
  sub: string; // Subject (user ID)
  iat: number; // Issued at
  exp: number; // Expiration
  aud: string; // Audience
  scopes: string[];
  role: UserRole;
}

export interface Session {
  id: string;
  customerId: string;
  authMethod: 'password' | 'biometric' | 'otp' | 'oauth';
  authenticatedAt: Date;
  expiresAt: Date;
  ipAddress: string;
  userAgent: string;
  deviceInfo?: DeviceInfo;
}

export interface DeviceInfo {
  deviceType: 'kiosk' | 'tablet' | 'phone' | 'desktop';
  os: 'iOS' | 'Android' | 'Windows' | 'MacOS' | 'Linux';
  osVersion: string;
  appVersion: string;
  deviceId?: string;
}

// ==================== Conversations ====================

export interface Conversation {
  id: string;
  sessionId: string;
  customerId: string;
  channel: 'kiosk' | 'mobile' | 'voice';
  language: string;
  startedAt: Date;
  endedAt?: Date;
  durationSeconds?: number;
  status: 'active' | 'closed' | 'escalated';
  primaryIntent?: string;
  escalatedToAgentId?: string;
  conversationData: Record<string, any>;
  satisfactionRating?: number;
}

export interface Message {
  id: string;
  conversationId: string;
  senderType: 'user' | 'bot' | 'agent';
  senderId?: string;
  content: string;
  messageType: 'text' | 'audio' | 'image' | 'file';
  intent?: string;
  entities?: Record<string, any>;
  confidence?: number;
  sentiment?: Sentiment;
  sentimentScore?: number;
  metadata?: Record<string, any>;
  createdAt: Date;
}

export type Sentiment = 'positive' | 'neutral' | 'negative';

export interface ConversationStartRequest {
  channel: 'kiosk' | 'mobile' | 'voice';
  language: string;
  deviceInfo?: DeviceInfo;
  context?: Record<string, any>;
}

export interface ConversationStartResponse {
  conversationId: string;
  sessionId: string;
  greetingMessage: string;
  suggestedIntents: string[];
  language: string;
  timestamp: Date;
}

export interface MessageRequest {
  content: string;
  messageType: 'text' | 'audio';
  audioUrl?: string;
  context?: Record<string, any>;
}

export interface MessageResponse {
  messageId: string;
  conversationId: string;
  userMessage: Message;
  botResponse: Message;
  sentimentAnalysis: {
    sentiment: Sentiment;
    score: number;
  };
  timestamp: Date;
}

// ==================== Transactions ====================

export interface Account {
  id: string;
  customerId: string;
  accountNumber: string;
  accountType: 'checking' | 'savings' | 'credit' | 'investment';
  currency: string;
  balance: number;
  availableBalance: number;
  status: 'active' | 'inactive' | 'suspended';
  createdAt: Date;
  updatedAt: Date;
}

export interface Transaction {
  id: string;
  customerId: string;
  conversationId?: string;
  type: 'transfer' | 'payment' | 'inquiry' | 'application' | 'withdrawal' | 'deposit';
  amount: number;
  currency: string;
  fromAccount: string;
  toAccount: string;
  toAccountHolderName?: string;
  description?: string;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
  initiatedBy: 'bot' | 'agent' | 'customer';
  authorizedBy?: string;
  authorizationTimestamp?: Date;
  coreBankingRef?: string;
  fee?: number;
  metadata?: Record<string, any>;
  createdAt: Date;
  completedAt?: Date;
  updatedAt: Date;
}

export interface TransferRequest {
  fromAccount: string;
  toAccount: string;
  amount: number;
  currency: string;
  description?: string;
  transactionType: 'p2p' | 'bill_payment' | 'international';
  executionDate?: Date;
  requireOtp?: boolean;
}

export interface TransactionConfirmRequest {
  otp?: string;
  confirmationMethod: 'otp' | 'biometric';
}

// ==================== Analytics ====================

export interface AnalyticsEvent {
  id: string;
  eventType: string;
  customerId?: string;
  conversationId?: string;
  transactionId?: string;
  channel: 'kiosk' | 'mobile' | 'voice';
  properties: Record<string, any>;
  timestamp: Date;
}

export interface DashboardMetrics {
  period: 'today' | 'week' | 'month' | 'year';
  channels: {
    kiosk: ChannelMetrics;
    mobile: ChannelMetrics;
    voice: ChannelMetrics;
  };
  overallMetrics: OverallMetrics;
}

export interface ChannelMetrics {
  users: number;
  conversations: number;
  avgDuration: number;
  satisfactionScore: number;
  transactions: number;
  transactionValue: number;
}

export interface OverallMetrics {
  totalUsers: number;
  totalConversations: number;
  avgSatisfaction: number;
  resolutionRate: number;
  escalationRate: number;
  totalTransactions: number;
  totalTransactionValue: number;
}

// ==================== Escalation ====================

export interface Escalation {
  id: string;
  conversationId: string;
  customerId: string;
  reason: string;
  skill: 'vip_support' | 'loan_specialist' | 'complaint_handling' | 'general';
  priority: 'standard' | 'high' | 'emergency';
  assignedAgentId?: string;
  assignedAgentName?: string;
  queueWaitTimeSeconds?: number;
  resolvedAt?: Date;
  resolutionNotes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface EscalationRequest {
  reason: string;
  skill: string;
  waitPriority: 'standard' | 'high' | 'emergency';
  preserveContext: boolean;
}

// ==================== Agent ====================

export interface Agent {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
  skills: string[];
  languagePreferences: string[];
  status: 'online' | 'offline' | 'away' | 'busy';
  availabilityStatus: 'available' | 'unavailable';
  maxConcurrentConversations: number;
  conversationCount: number;
  averageHandlingTime?: number;
  createdAt: Date;
  updatedAt: Date;
}

// ==================== Knowledge Base ====================

export interface KnowledgeBaseArticle {
  id: string;
  category: string;
  title: string;
  content: string;
  keywords: string[];
  language: string;
  intentMapping: string[];
  useCount: number;
  lastUsedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// ==================== API Responses ====================

export interface ApiResponse<T> {
  data?: T;
  error?: ApiError;
  pagination?: PaginationInfo;
  timestamp: Date;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, any>;
  requestId?: string;
}

export interface PaginationInfo {
  limit: number;
  offset: number;
  total: number;
  hasMore: boolean;
}

// ==================== Audit ====================

export interface AuditLog {
  id: string;
  customerId?: string;
  action: string;
  resourceType: string;
  resourceId: string;
  changes: Record<string, any>;
  ipAddress: string;
  userAgent: string;
  userId?: string;
  status: 'success' | 'failure';
  errorMessage?: string;
  timestamp: Date;
}

// ==================== Webhook ====================

export interface WebhookEvent {
  id: string;
  eventType: string;
  timestamp: Date;
  data: Record<string, any>;
  retryCount: number;
}

export interface WebhookRegistration {
  id: string;
  url: string;
  events: string[];
  secret: string;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// ==================== Error Types ====================

export class BankingError extends Error {
  constructor(
    public code: string,
    message: string,
    public statusCode: number = 500,
    public details?: Record<string, any>
  ) {
    super(message);
    this.name = 'BankingError';
  }
}

export class AuthenticationError extends BankingError {
  constructor(message: string, public details?: Record<string, any>) {
    super('AUTH_ERROR', message, 401, details);
    this.name = 'AuthenticationError';
  }
}

export class AuthorizationError extends BankingError {
  constructor(message: string) {
    super('AUTHORIZATION_ERROR', message, 403);
    this.name = 'AuthorizationError';
  }
}

export class ValidationError extends BankingError {
  constructor(message: string, public details?: Record<string, any>) {
    super('VALIDATION_ERROR', message, 400, details);
    this.name = 'ValidationError';
  }
}

export class NotFoundError extends BankingError {
  constructor(resource: string, id: string) {
    super('NOT_FOUND', `${resource} not found: ${id}`, 404);
    this.name = 'NotFoundError';
  }
}

export class ConflictError extends BankingError {
  constructor(message: string) {
    super('CONFLICT', message, 409);
    this.name = 'ConflictError';
  }
}
