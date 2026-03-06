/**
 * Authentication Service Entry Point
 */

import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 5001;

// In-memory store for OTPs (for demo purposes)
// In production, use Redis or database
const otpStore: Map<string, { otp: string; expiresAt: number }> = new Map();

// Middleware
app.use(express.json());

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'healthy',
    service: 'auth-service',
    timestamp: new Date().toISOString()
  });
});

// Auth endpoints
app.post('/v1/auth/login', (req: Request, res: Response) => {
  const { email, password } = req.body;
  console.log(`[Auth] Login attempt for: ${email}`);

  // For demo: accept any email/password
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Email and password are required'
    });
  }

  res.status(200).json({
    message: 'Login successful',
    accessToken: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`,
    refreshToken: `refresh_token_${uuidv4()}`,
    expiresIn: 900,
    tokenType: 'Bearer'
  });
});

// Request OTP endpoint
app.post('/request-otp', (req: Request, res: Response) => {
  const { email } = req.body;
  
  if (!email) {
    return res.status(400).json({
      success: false,
      message: 'Email is required'
    });
  }

  // Generate a 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  
  // Store OTP with 5-minute expiration
  const expiresAt = Date.now() + 5 * 60 * 1000;
  otpStore.set(email, { otp, expiresAt });
  
  console.log(`[Auth] OTP generated for ${email}: ${otp}`);
  
  // In production, send OTP via email/SMS
  // For demo, we log it and return success
  res.status(200).json({
    success: true,
    message: 'OTP sent to your email',
    // Debug: include OTP in response for demo purposes
    debugOtp: otp
  });
});

// Verify OTP endpoint
app.post('/verify-otp', (req: Request, res: Response) => {
  const { email, otp } = req.body;
  
  if (!email || !otp) {
    return res.status(400).json({
      success: false,
      message: 'Email and OTP are required'
    });
  }

  // Check if OTP exists for this email
  const storedData = otpStore.get(email);
  
  if (!storedData) {
    return res.status(400).json({
      success: false,
      message: 'No OTP requested for this email. Please request OTP first.'
    });
  }

  // Check if OTP is expired
  if (Date.now() > storedData.expiresAt) {
    otpStore.delete(email);
    return res.status(400).json({
      success: false,
      message: 'OTP has expired. Please request a new OTP.'
    });
  }

  // Verify OTP matches
  if (storedData.otp === otp) {
    // OTP is valid - clear it after successful verification
    otpStore.delete(email);
    
    // Generate session token
    const sessionToken = `session_${uuidv4()}`;
    const role = email.toLowerCase().includes('admin') ? 'admin' : 'customer';
    
    return res.status(200).json({
      success: true,
      message: 'OTP verified successfully',
      token: sessionToken,
      role: role
    });
  } else {
    return res.status(400).json({
      success: false,
      message: 'Invalid OTP. Please try again.'
    });
  }
});

// Biometric auth endpoint (simplified for demo)
app.post('/biometric-auth', (req: Request, res: Response) => {
  const { email, sessionToken } = req.body;
  
  if (!email || !sessionToken) {
    return res.status(400).json({
      success: false,
      message: 'Email and session token are required'
    });
  }

  // For demo, just accept any biometric auth request
  res.status(200).json({
    success: true,
    message: 'Biometric authentication successful'
  });
});

// Face verification endpoint for biometric authentication
app.post('/face-verify', (req: Request, res: Response) => {
  const { email, faceDescriptor, image } = req.body;
  
  if (!email || !faceDescriptor) {
    return res.status(400).json({
      success: false,
      message: 'Email and face descriptor are required'
    });
  }

  console.log(`[Auth] Face verification request for: ${email}`);
  console.log(`[Auth] Face descriptor length: ${faceDescriptor.length}`);
  
  // In production, this would:
  // 1. Store the face descriptor in a database associated with the user
  // 2. Compare new face descriptor with stored descriptor using face-api.js
  // 3. Return match result with confidence score
  
  // For demo, we accept any face verification request
  // Store face data in memory for demo purposes
  faceStore.set(email, {
    faceDescriptor,
    image: image || null,
    createdAt: Date.now()
  });

  console.log(`[Auth] Face data stored for: ${email}`);
  
  res.status(200).json({
    success: true,
    message: 'Face verification successful',
    verified: true
  });
});

// Get stored face data (for testing/demo purposes)
app.get('/face-data/:email', (req: Request, res: Response) => {
  const { email } = req.params;
  
  const data = faceStore.get(email);
  
  if (!data) {
    return res.status(404).json({
      success: false,
      message: 'No face data found for this user'
    });
  }
  
  res.status(200).json({
    success: true,
    data: {
      hasFaceData: true,
      createdAt: data.createdAt
    }
  });
});

// In-memory store for face data (for demo purposes)
const faceStore: Map<string, { faceDescriptor: number[]; image: string | null; createdAt: number }> = new Map();

app.post('/v1/auth/logout', (req: Request, res: Response) => {
  // TODO: Implement logout
  res.status(200).json({
    message: 'Logged out successfully'
  });
});

// Metrics
app.get('/metrics', (req: Request, res: Response) => {
  res.status(200).set('Content-Type', 'text/plain').send('# Auth Service Metrics\n');
});

// Start server
app.listen(port, () => {
  console.log(`🔐 Auth Service running on port ${port}`);
});

export default app;

