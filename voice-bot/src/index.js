const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5005;

app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'voice-bot' });
});

// Incoming call
app.post('/voice/call-start', (req, res) => {
  res.json({
    callId: '789-abc',
    status: 'connected',
    message: 'Welcome to Banking Services'
  });
});

// Process speech
app.post('/voice/process-speech', (req, res) => {
  res.json({
    understood: true,
    response: 'Please say your account number',
    intent: 'account_inquiry'
  });
});

// Escalate to agent
app.post('/voice/escalate', (req, res) => {
  res.json({
    status: 'escalated',
    agent: 'John Smith',
    message: 'Connecting you to an agent'
  });
});

// End call
app.post('/voice/call-end', (req, res) => {
  res.json({
    status: 'completed',
    duration: 450,
    transcript: 'Call completed successfully'
  });
});

app.listen(PORT, () => {
  console.log(`✅ Voice Bot running on port ${PORT}`);
});
