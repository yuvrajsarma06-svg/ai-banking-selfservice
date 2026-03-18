import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Alert,
  Avatar,
} from '@mui/material';
import {
  SupportAgent as AgentIcon,
} from '@mui/icons-material';

function AgentLogin() {
  const [agentId, setAgentId] = useState('');
  const [agentName, setAgentName] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    
    if (!agentId.trim() || !agentName.trim()) {
      setError('Please enter both Agent ID and Name');
      return;
    }

    sessionStorage.setItem('agentId', agentId);
    sessionStorage.setItem('agentName', agentName);
    sessionStorage.setItem('isAgentLoggedIn', 'true');

    window.location.hash = '#/agent-dashboard';
  };

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      bgcolor: 'background.default',
      p: 2
    }}>
      <Card sx={{ maxWidth: 400, width: '100%' }}>
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Avatar sx={{ bgcolor: 'secondary.main', width: 64, height: 64, m: '0 auto', mb: 2 }}>
              <AgentIcon sx={{ fontSize: 32 }} />
            </Avatar>
            <Typography variant="h5" fontWeight={600} gutterBottom>
              Agent Login
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Banking AI Customer Support
            </Typography>
          </Box>

          {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

          <form onSubmit={handleLogin}>
            <TextField
              fullWidth
              label="Agent ID"
              value={agentId}
              onChange={(e) => setAgentId(e.target.value)}
              placeholder="Enter your Agent ID (e.g., AGENT001)"
              required
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              label="Your Name"
              value={agentName}
              onChange={(e) => setAgentName(e.target.value)}
              placeholder="Enter your name"
              required
              sx={{ mb: 3 }}
            />

            <Button
              type="submit"
              variant="contained"
              fullWidth
              size="large"
            >
              Login to Dashboard
            </Button>
          </form>

          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Typography variant="caption" color="text.secondary" display="block">
              Demo IDs: AGENT001, AGENT002, AGENT003
            </Typography>
            <Typography variant="caption" color="text.secondary" display="block">
              Any name can be used for demo
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}

export default AgentLogin;

