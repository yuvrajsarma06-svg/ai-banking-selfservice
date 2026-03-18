import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Alert,
  CircularProgress,
  Paper,
  Chip,
  IconButton,
  TextField,
} from '@mui/material';
import {
  Phone as PhoneIcon,
  PhoneDisabled as PhoneDisabledIcon,
  Mic as MicIcon,
  MicOff as MicOffIcon,
  CallEnd as CallEndIcon,
} from '@mui/icons-material';
import useVoiceChat from '../hooks/useVoiceChat';

function VoiceService({ email }) {
  const [callStatus, setCallStatus] = useState('ready');
  const [callId, setCallId] = useState(null);
  const [callDuration, setCallDuration] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [messages, setMessages] = useState([]);
  const [botReply, setBotReply] = useState('');
  const durationRef = useRef(null);

  const { input: transcript, setInput: setTranscript, listening, toggleMic, stopMic, startMic } = useVoiceChat(
    (text) => handleProcessSpeech(text),
    botReply
  );

  useEffect(() => {
    if (callStatus === 'active') {
      durationRef.current = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    } else {
      if (durationRef.current) {
        clearInterval(durationRef.current);
      }
    }
    return () => {
      if (durationRef.current) {
        clearInterval(durationRef.current);
      }
    };
  }, [callStatus]);

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartCall = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('http://localhost:5005/voice/call-start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: email, phoneNumber: '+1234567890' })
      });
      const data = await response.json();
      if (response.ok || data.success) {
        setCallId(data.callId || 'CALL' + Date.now());
        setCallStatus('active');
        setCallDuration(0);
        setMessages([{
          id: 1,
          type: 'system',
          text: 'Call connected. Speak clearly to interact with voice services.',
          timestamp: new Date()
        }]);
        startMic();
      } else {
        setError(data.error || 'Failed to start call');
      }
    } catch (err) {
      setCallId('CALL' + Date.now());
      setCallStatus('active');
      setCallDuration(0);
      setMessages([{
        id: 1,
        type: 'system',
        text: 'Call connected. Speak clearly to interact with voice services.',
        timestamp: new Date()
      }]);
      startMic();
    } finally {
      setLoading(false);
    }
  };

  const handleProcessSpeech = async (spokenText) => {
    const textToProcess = typeof spokenText === 'string' ? spokenText : transcript;
    if (!textToProcess.trim()) return;
    setLoading(true);
    const userMsg = { id: messages.length + 1, type: 'user', text: textToProcess, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    try {
      const response = await fetch('http://localhost:5005/process-speech', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ callId, speechInput: textToProcess, userId: email })
      });
      const data = await response.json();
      const replyText = data.response || 'Processing your request...';
      setMessages(prev => [...prev, { id: prev.length + 2, type: 'bot', text: replyText, timestamp: new Date() }]);
      setBotReply(replyText);
      setTranscript('');
    } catch (err) {
      setMessages(prev => [...prev, { id: prev.length + 2, type: 'bot', text: 'Processing your request...', timestamp: new Date() }]);
    } finally {
      setLoading(false);
    }
  };

  const handleEndCall = async () => {
    setLoading(true);
    stopMic();
    try {
      await fetch('http://localhost:5005/voice/call-end', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ callId, duration: callDuration, userId: email })
      });
    } catch (err) {}
    setCallStatus('ended');
    setMessages(prev => [...prev, {
      id: prev.length + 1,
      type: 'system',
      text: `Call ended. Duration: ${formatDuration(callDuration)}`,
      timestamp: new Date()
    }]);
    setLoading(false);
  };

  const handleNewCall = () => {
    setCallStatus('ready');
    setCallId(null);
    setCallDuration(0);
    setTranscript('');
    setBotReply('');
    setMessages([]);
    setError(null);
  };

  return (
    <Card sx={{ maxWidth: 600, mx: 'auto' }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
          <PhoneIcon color="primary" sx={{ fontSize: 32 }} />
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            Voice Support
          </Typography>
        </Box>

        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

        {callStatus === 'ready' && (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Box sx={{ bgcolor: 'primary.light', borderRadius: '50%', p: 3, display: 'inline-flex', mb: 3 }}>
              <PhoneIcon sx={{ fontSize: 64, color: 'white' }} />
            </Box>
            <Typography variant="h6" gutterBottom>Ready to Connect</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Click the button below to start a voice call with our support team
            </Typography>
            <Button
              variant="contained"
              size="large"
              startIcon={<PhoneIcon />}
              onClick={handleStartCall}
              disabled={loading}
            >
              {loading ? 'Connecting...' : 'Start Voice Call'}
            </Button>
          </Box>
        )}

        {callStatus === 'active' && (
          <Box>
            <Paper sx={{ p: 2, mb: 3, bgcolor: 'success.main', color: 'white' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: 'white', animation: 'pulse 1s infinite' }} />
                  <Typography variant="body1" fontWeight={600}>Call Active</Typography>
                </Box>
                <Chip label={formatDuration(callDuration)} size="small" sx={{ bgcolor: 'white', color: 'success.main' }} />
              </Box>
              <Typography variant="body2" sx={{ mt: 1, opacity: 0.8 }}>Call ID: {callId}</Typography>
            </Paper>

            <Paper sx={{ p: 2, mb: 3, bgcolor: 'grey.100' }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>Speak now:</Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <TextField
                  fullWidth
                  size="small"
                  value={transcript}
                  placeholder={listening ? "Listening..." : "Press microphone to speak"}
                  InputProps={{ readOnly: true }}
                />
                <IconButton
                  color={listening ? 'error' : 'primary'}
                  onClick={toggleMic}
                  disabled={loading}
                  sx={{ bgcolor: listening ? 'error.main' : 'primary.main', color: 'white', '&:hover': { bgcolor: listening ? 'error.dark' : 'primary.dark' } }}
                >
                  {listening ? <MicOffIcon /> : <MicIcon />}
                </IconButton>
              </Box>
            </Paper>

            <Box sx={{ maxHeight: 200, overflow: 'auto', mb: 3 }}>
              {messages.map((msg) => (
                <Paper key={msg.id} sx={{ p: 1.5, mb: 1, bgcolor: msg.type === 'system' ? 'info.light' : msg.type === 'user' ? 'primary.light' : 'grey.200' }}>
                  <Typography variant="body2">{msg.text}</Typography>
                  <Typography variant="caption" color="text.secondary">{msg.timestamp.toLocaleTimeString()}</Typography>
                </Paper>
              ))}
            </Box>

            <Button
              variant="contained"
              color="error"
              fullWidth
              startIcon={<CallEndIcon />}
              onClick={handleEndCall}
              disabled={loading}
            >
              End Call
            </Button>
          </Box>
        )}

        {callStatus === 'ended' && (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Box sx={{ bgcolor: 'success.main', borderRadius: '50%', p: 3, display: 'inline-flex', mb: 3 }}>
              <PhoneDisabledIcon sx={{ fontSize: 64, color: 'white' }} />
            </Box>
            <Typography variant="h5" gutterBottom>Call Ended</Typography>
            <Typography variant="body1" sx={{ mb: 1 }}>Duration: {formatDuration(callDuration)}</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Thank you for using our voice service
            </Typography>
            <Button variant="outlined" onClick={handleNewCall}>
              Start New Call
            </Button>
          </Box>
        )}
      </CardContent>
    </Card>
  );
}

export default VoiceService;

