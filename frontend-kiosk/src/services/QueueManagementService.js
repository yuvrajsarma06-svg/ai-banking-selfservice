import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Paper,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  Divider,
  Alert,
} from '@mui/material';
import {
  ConfirmationNumber as QueueIcon,
  LocationOn as LocationIcon,
  AccessTime as TimeIcon,
} from '@mui/icons-material';

function QueueManagementService({ email }) {
  const [token, setToken] = useState(null);
  const [serviceType, setServiceType] = useState('general');
  const [selectedBranch, setSelectedBranch] = useState('downtown');
  const [queueData, setQueueData] = useState(null);
  const [loading, setLoading] = useState(false);

  const branches = [
    { id: 'downtown', name: 'Downtown Branch', address: '123 Main St' },
    { id: 'airport', name: 'Airport Branch', address: '456 Aviation Ave' },
    { id: 'mall', name: 'Mall Branch', address: '789 Shopping Blvd' }
  ];

  const serviceTypes = [
    { id: 'accountOpening', name: 'Account Opening' },
    { id: 'loanApplication', name: 'Loan Application' },
    { id: 'cardIssue', name: 'Card Issue' },
    { id: 'general', name: 'General Service' }
  ];

  const requestToken = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5002/request-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: email, serviceType, branch: selectedBranch })
      });
      const data = await response.json();
      setToken(data.token ? data : { token: 'TKN' + Math.floor(Math.random() * 100), queuePosition: 5, estimatedWaitTime: '15 min', counter: 3 });
    } catch (err) {
      setToken({ token: 'TKN' + Math.floor(Math.random() * 100), queuePosition: 5, estimatedWaitTime: '15 min', counter: 3 });
    } finally {
      setLoading(false);
    }
  };

  const getQueueStatus = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5002/queue/status');
      const data = await response.json();
      setQueueData(data);
    } catch (err) {
      setQueueData({ branches: branches.map(b => ({ name: b.name, waitTime: '10-15 min', tokens: 5 })) });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { getQueueStatus(); }, []);

  return (
    <Card sx={{ maxWidth: 500, mx: 'auto' }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
          <QueueIcon color="primary" sx={{ fontSize: 32 }} />
          <Typography variant="h5" sx={{ fontWeight: 600 }}>Branch Queue</Typography>
        </Box>

        {!token ? (
          <Box>
            <Typography variant="h6" sx={{ mb: 2 }}>Generate Queue Token</Typography>
            
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Service Type</InputLabel>
              <Select value={serviceType} onChange={(e) => setServiceType(e.target.value)} label="Service Type">
                {serviceTypes.map(type => (
                  <MenuItem key={type.id} value={type.id}>{type.name}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel>Select Branch</InputLabel>
              <Select value={selectedBranch} onChange={(e) => setSelectedBranch(e.target.value)} label="Select Branch">
                {branches.map(branch => (
                  <MenuItem key={branch.id} value={branch.id}>{branch.name}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <Button variant="contained" fullWidth size="large" onClick={requestToken} disabled={loading} sx={{ mb: 3 }}>
              {loading ? 'Generating...' : 'Generate Token'}
            </Button>

            {queueData && (
              <Paper sx={{ p: 2 }}>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>Current Queue Status</Typography>
                <Grid container spacing={2}>
                  {queueData.branches?.map((branch, idx) => (
                    <Grid item xs={4} key={idx}>
                      <Typography variant="body2" fontWeight={600}>{branch.name}</Typography>
                      <Chip label={branch.waitTime} size="small" color="warning" sx={{ mt: 0.5 }} />
                      <Typography variant="caption" display="block" color="text.secondary">{branch.tokens} in queue</Typography>
                    </Grid>
                  ))}
                </Grid>
              </Paper>
            )}
          </Box>
        ) : (
          <Box sx={{ textAlign: 'center' }}>
            <Paper sx={{ p: 4, mb: 3, bgcolor: 'primary.main', color: 'white' }}>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>Your Queue Token</Typography>
              <Typography variant="h1" fontWeight={700} sx={{ my: 2 }}>{token.token}</Typography>
            </Paper>

            <Paper sx={{ p: 2, mb: 3, textAlign: 'left' }}>
              <Typography variant="body1"><strong>Service:</strong> {serviceTypes.find(t => t.id === serviceType)?.name}</Typography>
              <Typography variant="body1"><strong>Branch:</strong> {branches.find(b => b.id === selectedBranch)?.name}</Typography>
              <Divider sx={{ my: 1 }} />
              <Grid container>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">Queue Position</Typography>
                  <Typography variant="h5" fontWeight={600}>{token.queuePosition}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">Est. Wait Time</Typography>
                  <Typography variant="h5" fontWeight={600}>{token.estimatedWaitTime}</Typography>
                </Grid>
              </Grid>
            </Paper>

            <Alert severity="info" sx={{ mb: 3 }}>
              Keep this token safe. You'll receive an SMS when you're next in queue.
            </Alert>

            <Button variant="outlined" fullWidth onClick={() => setToken(null)}>
              Get Another Token
            </Button>
          </Box>
        )}
      </CardContent>
    </Card>
  );
}

export default QueueManagementService;

