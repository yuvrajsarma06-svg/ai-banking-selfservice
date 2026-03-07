const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5001;

// Enable CORS with explicit configuration
app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Session storage (in-memory, use Redis in production)
const sessions = new Map();
const otpStore = new Map();
const failedAttempts = new Map();

// Generate OTP
const generateOTP = () => Math.floor(100000 + Math.random() * 900000);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'auth-service' });
});

// Request OTP handler
const handleRequestOtp = (req, res) => {
  const { email, method } = req.body;

  if (!email) {
    return res.status(400).json({ success: false, message: 'Email is required' });
  }

  const otp = generateOTP();
  const expiresAt = Date.now() + 300000; // 5 minutes

  otpStore.set(email, { otp: otp.toString(), expiresAt, attempts: 0 });

  console.log(`[Auth] OTP generated for ${email}: ${otp}`);

  res.json({
    success: true,
    message: `OTP sent via ${method || 'SMS'}`,
    otpId: 'OTP' + Date.now(),
    expiresIn: 300,
    // Include OTP in response for demo purposes
    debugOtp: otp.toString()
  });
};

// Request OTP - both routes (direct and with /auth prefix)
app.post('/request-otp', handleRequestOtp);
app.post('/auth/request-otp', handleRequestOtp);

// Verify OTP handler
const handleVerifyOtp = (req, res) => {
  const { email, otp } = req.body;
  const storedOtp = otpStore.get(email);

  if (!storedOtp) {
    return res.status(400).json({ success: false, message: 'OTP not found or expired' });
  }

  if (storedOtp.expiresAt < Date.now()) {
    otpStore.delete(email);
    return res.status(400).json({ success: false, message: 'OTP expired' });
  }

  if (storedOtp.otp === otp.toString()) {
    otpStore.delete(email);
    failedAttempts.delete(email);

    // Generate session token
    const sessionId = 'SESSION_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    const role = email.includes('admin') ? 'admin' : 'customer';

    return res.json({
      success: true,
      verified: true,
      token: sessionId,
      role: role
    });
  }

  storedOtp.attempts = (storedOtp.attempts || 0) + 1;
  if (storedOtp.attempts >= 3) {
    otpStore.delete(email);
    return res.status(400).json({ success: false, message: 'Too many attempts. Please request a new OTP' });
  }

  res.status(400).json({ success: false, message: 'Invalid OTP' });
};

// Verify OTP - both routes
app.post('/verify-otp', handleVerifyOtp);
app.post('/auth/verify-otp', handleVerifyOtp);

// Login endpoint
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  // Check for account lockout
  const attempts = failedAttempts.get(email) || 0;
  if (attempts >= 5) {
    return res.status(401).json({ success: false, message: 'Account locked. Try again later.' });
  }

  // Mock authentication
  if (email && password) {
    const sessionId = 'SESSION_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    const expiresAt = Date.now() + 1800000; // 30 minutes

    const sessionData = {
      email,
      userId: 'USER_' + Date.now(),
      loginTime: new Date(),
      expiresAt,
      role: email.includes('admin') ? 'admin' : 'customer'
    };

    sessions.set(sessionId, sessionData);
    failedAttempts.delete(email);

    res.json({
      success: true,
      token: sessionId,
      user: { email, id: sessionData.userId, role: sessionData.role },
      expiresIn: 1800
    });
  } else {
    failedAttempts.set(email, attempts + 1);
    res.status(401).json({ success: false, message: 'Invalid credentials' });
  }
});

// Validate session
app.post('/validate-session', (req, res) => {
  const { token } = req.body;
  const session = sessions.get(token);

  if (!session) {
    return res.status(401).json({ success: false, message: 'Invalid token' });
  }

  if (session.expiresAt < Date.now()) {
    sessions.delete(token);
    return res.status(401).json({ success: false, message: 'Session expired' });
  }

  res.json({ success: true, valid: true, user: session });
});

// Biometric authentication handler
const handleBiometricAuth = (req, res) => {
  const { email, biometricData, type } = req.body;

  // Mock biometric verification (in production, use actual biometric APIs)
  const isMatched = Math.random() > 0.1; // 90% success rate

  if (isMatched) {
    const sessionId = 'SESSION_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    const expiresAt = Date.now() + 1800000;

    sessions.set(sessionId, {
      email,
      userId: 'USER_' + Date.now(),
      loginTime: new Date(),
      expiresAt,
      authMethod: type
    });

    res.json({
      success: true,
      message: `${type || 'Biometric'} authentication successful`,
      token: sessionId,
      expiresIn: 1800
    });
  } else {
    res.status(401).json({ success: false, message: 'Biometric authentication failed' });
  }
};

// Biometric auth - both routes
app.post('/biometric-auth', handleBiometricAuth);
app.post('/auth/biometric-auth', handleBiometricAuth);

// Face recognition
app.post('/face-recognition', (req, res) => {
  const { email, faceData } = req.body;

  // Mock face recognition (in production, use AWS Rekognition, Azure Face API, etc.)
  const confidence = Math.floor(Math.random() * 30 + 70); // 70-99% confidence

  if (confidence > 85) {
    const sessionId = 'SESSION_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    sessions.set(sessionId, {
      email,
      userId: 'USER_' + Date.now(),
      loginTime: new Date(),
      expiresAt: Date.now() + 1800000
    });

    res.json({
      success: true,
      message: 'Face recognition successful',
      confidence,
      token: sessionId
    });
  } else {
    res.status(401).json({ success: false, message: 'Face recognition failed', confidence });
  }
});

// Logout endpoint
app.post('/logout', (req, res) => {
  const { token } = req.body;
  if (token) {
    sessions.delete(token);
  }
  res.json({ success: true, message: 'Logged out successfully' });
});

// Refresh session
app.post('/refresh-session', (req, res) => {
  const { token } = req.body;
  const session = sessions.get(token);

  if (!session) {
    return res.status(401).json({ success: false, message: 'Invalid token' });
  }

  session.expiresAt = Date.now() + 1800000; // Extend by 30 minutes

  res.json({
    success: true,
    message: 'Session refreshed',
    expiresIn: 1800
  });
});

// Get session info
app.get('/session/:token', (req, res) => {
  const session = sessions.get(req.params.token);

  if (!session) {
    return res.status(401).json({ success: false, message: 'Invalid token' });
  }

  const remainingTime = Math.max(0, session.expiresAt - Date.now());

  res.json({
    success: true,
    session: {
      email: session.email,
      userId: session.userId,
      loginTime: session.loginTime,
      expiresAt: session.expiresAt,
      remainingTime
    }
  });
});

app.listen(PORT, () => {
  console.log(`✅ Auth Service running on port ${PORT}`);
});
