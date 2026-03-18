import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  IconButton,
  Button,
  Paper,
  Avatar,
  CircularProgress,
  Chip,
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mic as MicIcon,
  MicOff as MicOffIcon,
  VolumeUp as VolumeUpIcon,
  VolumeOff as VolumeOffIcon,
  Send as SendIcon,
  SmartToy as BotIcon,
  Person as PersonIcon,
  SupportAgent as AgentIcon,
} from '@mui/icons-material';
import useVoiceChat from '../hooks/useVoiceChat';

function ChatService({ email }) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [conversationId, setConversationId] = useState(null);
  const [error, setError] = useState(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [agentConnected, setAgentConnected] = useState(false);
  const [waitingForAgent, setWaitingForAgent] = useState(false);
  const messagesEndRef = useRef(null);
  const [botReply, setBotReply] = useState('');
  const [input, setInput] = useState('');

  const { listening: isListening, toggleMic: toggleMicrophone } = useVoiceChat(
    (text) => handleSendMessageWithVoice(text),
    botReply
  );

  const speakText = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1;
      utterance.pitch = 1;
      utterance.volume = 1;
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  const toggleSpeak = (text) => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    } else {
      speakText(text);
    }
  };

  const getLocalResponse = (message) => {
    const msg = message.toLowerCase();
    if (msg.includes('hi') || msg.includes('hello') || msg.includes('hey')) {
      return `Hello! Welcome to our Banking AI Assistant! 

Available Services:
1. Transfers - Send money to any account
2. Account Balance - Check your account balance  
3. Mini Statement - View recent transactions
4. Bill Payments - Pay your bills online
5. Card Management - Block/reissue cards
6. Cheque Book - Request cheque book
7. Loan Services - Check eligibility & apply
8. Queue Token - Get branch queue token

How may I assist you today?`;
    }
    if (msg.includes('transfer') || msg.includes('send money')) {
      return `Money Transfer Service

You can transfer money through:
- UPI - Instant transfer up to 1 lakh
- NEFT - 24x7 transfer
- RTGS - For large amounts

To proceed, please tell me the amount and recipient's account.`;
    }
    if (msg.includes('balance')) {
      return `Account Balance Service

Your account details:
- Account Number: XXXXX1234
- Current Balance: $15,750.50`;
    }
    if (msg.includes('thank')) {
      return `You're welcome! Is there anything else I can help you with?`;
    }
    return `I can help you with transfers, balance, statements, bills, cards, loans, and more. What would you like to do?`;
  };

  const requestAgent = async () => {
    setWaitingForAgent(true);
    try {
      const response = await fetch('http://localhost:5002/escalate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ conversationId, userId: email, reason: 'User requested human agent' })
      });
      const data = await response.json();
      if (data.success) {
        setAgentConnected(true);
        setMessages(prev => [...prev, {
          id: prev.length + 1,
          sender: 'system',
          text: `Connected with ${data.agentName || 'an agent'}. They will assist you shortly.`,
          timestamp: new Date()
        }]);
      }
    } catch (err) {
      setMessages(prev => [...prev, {
        id: prev.length + 1,
        sender: 'bot',
        text: 'Sorry, could not connect to an agent. Please try again later.',
        timestamp: new Date()
      }]);
    }
    setWaitingForAgent(false);
  };

  useEffect(() => {
    const startConversation = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:5002/conversations/start', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: email })
        });
        const data = await response.json();
        setConversationId(data.conversationId);
        setMessages([{
          id: 1,
          sender: 'bot',
          text: data.response || getLocalResponse('hello'),
          timestamp: new Date()
        }]);
      } catch (err) {
        setConversationId('local_' + Date.now());
        setMessages([{
          id: 1,
          sender: 'bot',
          text: getLocalResponse('hello'),
          timestamp: new Date()
        }]);
      } finally {
        setLoading(false);
      }
    };
    startConversation();
  }, [email]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessageWithText = async (text) => {
    if (!text.trim()) return;
    const userMessage = { id: messages.length + 1, sender: 'user', text, timestamp: new Date() };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5002/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ conversationId, message: text, userId: email })
      });
      const data = await response.json();
      setMessages(prev => [...prev, { id: prev.length + 2, sender: 'bot', text: data.response || 'How else can I help?', timestamp: new Date() }]);
    } catch (err) {
      const localResponse = getLocalResponse(text);
      setMessages(prev => [...prev, { id: prev.length + 2, sender: 'bot', text: localResponse, timestamp: new Date() }]);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessageWithVoice = async (text) => {
    if (!text.trim()) return;
    const userMessage = { id: messages.length + 1, sender: 'user', text, timestamp: new Date() };
    setMessages(prev => [...prev, userMessage]);
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5005/v1/voice/process-speech', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ callId: conversationId || 'CALL' + Date.now(), audioData: text })
      });
      const data = await response.json();
      const botResponseText = data.response || 'I understood your voice message.';
      setMessages(prev => [...prev, { id: prev.length + 2, sender: 'bot', text: botResponseText, timestamp: new Date() }]);
      setBotReply(botResponseText);
    } catch (err) {
      const localResponse = getLocalResponse(text);
      setMessages(prev => [...prev, { id: prev.length + 2, sender: 'bot', text: localResponse, timestamp: new Date() }]);
      setBotReply(localResponse);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    await handleSendMessageWithText(input);
  };

  return (
    <Card sx={{ height: '70vh', display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ pb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar sx={{ bgcolor: 'primary.main' }}>
              <BotIcon />
            </Avatar>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>AI Support</Typography>
              {agentConnected && <Chip size="small" label="Agent Connected" color="success" icon={<AgentIcon />} />}
            </Box>
          </Box>
          {!agentConnected && !waitingForAgent && (
            <Button variant="outlined" size="small" onClick={requestAgent}>
              Connect to Agent
            </Button>
          )}
          {waitingForAgent && <Typography variant="body2" color="text.secondary">Connecting...</Typography>}
        </Box>
      </CardContent>

      <Box sx={{ flex: 1, overflow: 'auto', px: 2, py: 1 }}>
        {error && <Typography color="error" sx={{ mb: 2 }}>{error}</Typography>}
        {messages.map((msg) => (
          <Box key={msg.id} sx={{ 
            display: 'flex', 
            justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start',
            mb: 2 
          }}>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'flex-start', 
              gap: 1,
              maxWidth: '80%'
            }}>
              {msg.sender !== 'user' && (
                <Avatar sx={{ bgcolor: 'primary.light', width: 32, height: 32 }}>
                  <BotIcon sx={{ fontSize: 18 }} />
                </Avatar>
              )}
              <Paper sx={{ 
                p: 2, 
                bgcolor: msg.sender === 'user' ? 'primary.main' : 'grey.100',
                color: msg.sender === 'user' ? 'white' : 'text.primary',
                borderRadius: 2
              }}>
                <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>{msg.text}</Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
                  <Typography variant="caption" sx={{ opacity: 0.7 }}>
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </Typography>
                  {msg.sender === 'bot' && (
                    <IconButton size="small" onClick={() => toggleSpeak(msg.text)}>
                      {isSpeaking ? <VolumeOffIcon fontSize="small" /> : <VolumeUpIcon fontSize="small" />}
                    </IconButton>
                  )}
                </Box>
              </Paper>
              {msg.sender === 'user' && (
                <Avatar sx={{ bgcolor: 'secondary.main', width: 32, height: 32 }}>
                  <PersonIcon sx={{ fontSize: 18 }} />
                </Avatar>
              )}
            </Box>
          </Box>
        ))}
        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'flex-start', mb: 2 }}>
            <Avatar sx={{ bgcolor: 'primary.light', width: 32, height: 32 }}>
              <BotIcon sx={{ fontSize: 18 }} />
            </Avatar>
            <Paper sx={{ p: 2, bgcolor: 'grey.100', borderRadius: 2, ml: 1 }}>
              <CircularProgress size={20} />
            </Paper>
          </Box>
        )}
        <div ref={messagesEndRef} />
      </Box>

      <Box component="form" onSubmit={handleSendMessage} sx={{ 
        p: 2, 
        borderTop: 1, 
        borderColor: 'divider',
        display: 'flex',
        gap: 1,
        alignItems: 'center'
      }}>
        <IconButton
          onClick={toggleMicrophone}
          color={isListening ? 'error' : 'default'}
          disabled={loading || agentConnected}
        >
          {isListening ? <MicIcon /> : <MicOffIcon />}
        </IconButton>
        <TextField
          fullWidth
          size="small"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={isListening ? "Listening..." : agentConnected ? "Message the agent..." : "Type your message..."}
          disabled={loading || isListening || agentConnected}
        />
        <IconButton 
          type="submit" 
          color="primary"
          disabled={loading || isListening || !input.trim() || agentConnected}
        >
          <SendIcon />
        </IconButton>
      </Box>
    </Card>
  );
}

export default ChatService;

