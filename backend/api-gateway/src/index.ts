/**
 * API Gateway Entry Point
 * Main routing and middleware configuration
 */

import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 5000;

// ==================== Middleware ====================

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Request logging middleware
app.use((req: Request, res: Response, next) => {
  req.id = uuidv4();
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path} - Request ID: ${req.id}`);
  next();
});

// Rate limiting
const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
  message: 'Too many requests from this IP, please try again later.',
  skip: (req) => {
    // Skip rate limit for health checks
    return req.path === '/health';
  }
});
app.use(limiter);

// ==================== Routes ====================

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: '1.0.0'
  });
});

// Info endpoint
app.get('/info', (req: Request, res: Response) => {
  res.status(200).json({
    name: 'Banking AI API Gateway',
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString()
  });
});

// API version 1 routes (placeholder)
app.get('/v1', (req: Request, res: Response) => {
  res.status(200).json({
    message: 'Banking AI API v1',
    endpoints: {
      auth: '/v1/auth',
      conversations: '/v1/conversations',
      transactions: '/v1/transactions',
      accounts: '/v1/accounts',
      analytics: '/v1/analytics'
    }
  });
});

import { createProxyMiddleware } from 'http-proxy-middleware';

// ... (existing code)

// Proxy middleware for auth service
const authProxy = createProxyMiddleware({
  target: 'http://localhost:5001',
  changeOrigin: true,
  pathRewrite: { '^/v1': '' },
});

// ... (existing code)

// API version 1 routes (placeholder)
app.use('/v1/auth', authProxy);

// ... (existing code)

// Conversations endpoints
app.post('/v1/conversations/start', (req: Request, res: Response) => {
  res.status(201).json({
    conversationId: uuidv4(),
    message: 'Conversation started - Implementation in conversation-engine',
    requestId: req.id
  });
});

// Transactions endpoints
app.get('/v1/accounts', (req: Request, res: Response) => {
  res.status(200).json({
    message: 'Account endpoints - Implementation in transaction-service',
    requestId: req.id
  });
});

// Analytics endpoints
app.get('/v1/analytics/dashboard', (req: Request, res: Response) => {
  res.status(200).json({
    message: 'Analytics endpoints - Implementation in analytics-service',
    requestId: req.id
  });
});

// Metrics endpoint for Prometheus
app.get('/metrics', (req: Request, res: Response) => {
  res.status(200).set('Content-Type', 'text/plain').send(
    '# TODO: Implement Prometheus metrics\n' +
    'banking_requests_total 0\n' +
    'banking_response_duration_seconds 0\n'
  );
});

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    error: {
      code: 'NOT_FOUND',
      message: `Endpoint not found: ${req.method} ${req.path}`,
      requestId: req.id
    }
  });
});

// Error handler
app.use((err: any, req: Request, res: Response, next: express.NextFunction) => {
  console.error(`[Error] Request ID: ${req.id}`, err);
  res.status(err.status || 500).json({
    error: {
      code: err.code || 'INTERNAL_SERVER_ERROR',
      message: err.message || 'Internal server error',
      requestId: req.id
    }
  });
});

// ==================== Server Start ====================

app.listen(port, () => {
  console.log(`\n========================================`);
  console.log(`🚀 API Gateway is running on port ${port}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`Health Check: http://localhost:${port}/health`);
  console.log(`Info: http://localhost:${port}/info`);
  console.log(`========================================\n`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT signal received: closing HTTP server');
  process.exit(0);
});

export default app;
