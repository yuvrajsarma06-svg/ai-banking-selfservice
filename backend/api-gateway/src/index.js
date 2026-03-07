const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});
app.use('/v1/', limiter);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'api-gateway' });
});

// Info endpoint
app.get('/info', (req, res) => {
  res.json({
    status: 'ok',
    service: 'api-gateway',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// API Gateway route
app.get('/v1/status', (req, res) => {
  res.json({ status: 'running', service: 'api-gateway' });
});

// Proxy middleware for auth service (routes /v1/auth/* to auth service on port 5001)
const authProxy = createProxyMiddleware({
  target: 'http://localhost:5001',
  changeOrigin: true,
  pathRewrite: { '^/v1': '' },
});

// Auth routes - proxy to auth service
app.use('/v1/auth', authProxy);

// Default route
app.get('/', (req, res) => {
  res.json({ message: 'Banking API Gateway', version: '1.0.0' });
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ API Gateway running on port ${PORT}`);
});
