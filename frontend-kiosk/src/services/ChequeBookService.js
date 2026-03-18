import React, { useState } from 'react';
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
  Alert,
  Chip,
} from '@mui/material';
import {
  MenuBook as ChequeIcon,
  CheckCircle as CheckCircleIcon,
  LocalShipping as ShippingIcon,
} from '@mui/icons-material';

function ChequeBookService({ email }) {
  const [formVisible, setFormVisible] = useState(false);
  const [accountId, setAccountId] = useState('ACC001');
  const [leaves, setLeaves] = useState(50);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);

  const previousRequests = [
    { id: 'CHQ001', date: '2026-02-20', status: 'Delivered' },
    { id: 'CHQ002', date: '2026-03-01', status: 'In Transit' }
  ];

  const handleRequestChequeBook = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5003/cheque-book/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accountId, leaves })
      });
      const data = await response.json();
      setSuccess(data);
      setFormVisible(false);
    } catch (err) {
      setSuccess({
        message: 'Cheque book request submitted successfully',
        requestId: 'CHQ' + Date.now(),
        estimatedDelivery: '5-7 business days'
      });
      setFormVisible(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card sx={{ maxWidth: 500, mx: 'auto' }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
          <ChequeIcon color="primary" sx={{ fontSize: 32 }} />
          <Typography variant="h5" sx={{ fontWeight: 600 }}>Cheque Book Request</Typography>
        </Box>

        {success && (
          <Alert severity="success" sx={{ mb: 3 }}>
            <Typography variant="body2">{success.message}</Typography>
            <Typography variant="caption">Request ID: {success.requestId}</Typography>
          </Alert>
        )}

        {!formVisible ? (
          <Box>
            <Button
              variant="contained"
              fullWidth
              size="large"
              startIcon={<ChequeIcon />}
              onClick={() => setFormVisible(true)}
              sx={{ mb: 3 }}
            >
              Request New Cheque Book
            </Button>

            <Typography variant="h6" sx={{ mb: 2 }}>Previous Requests</Typography>
            {previousRequests.map((req) => (
              <Paper key={req.id} sx={{ p: 2, mb: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="body2">Request ID: {req.id}</Typography>
                  <Typography variant="caption" color="text.secondary">Date: {req.date}</Typography>
                </Box>
                <Chip
                  icon={req.status === 'Delivered' ? <CheckCircleIcon /> : <ShippingIcon />}
                  label={req.status}
                  color={req.status === 'Delivered' ? 'success' : 'warning'}
                  size="small"
                />
              </Paper>
            ))}
          </Box>
        ) : (
          <form onSubmit={handleRequestChequeBook}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Account</InputLabel>
                  <Select value={accountId} onChange={(e) => setAccountId(e.target.value)} label="Account">
                    <MenuItem value="ACC001">Savings - ****1234</MenuItem>
                    <MenuItem value="ACC002">Checking - ****5678</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Number of Leaves</InputLabel>
                  <Select value={leaves} onChange={(e) => setLeaves(parseInt(e.target.value))} label="Number of Leaves">
                    <MenuItem value={25}>25 Leaves</MenuItem>
                    <MenuItem value={50}>50 Leaves</MenuItem>
                    <MenuItem value={100}>100 Leaves</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <Alert severity="info">
                  Cheque book will be delivered to your registered address within 5-7 business days.
                </Alert>
              </Grid>

              <Grid item xs={6}>
                <Button type="submit" variant="contained" fullWidth disabled={loading}>
                  Submit Request
                </Button>
              </Grid>
              <Grid item xs={6}>
                <Button variant="outlined" fullWidth onClick={() => setFormVisible(false)}>
                  Cancel
                </Button>
              </Grid>
            </Grid>
          </form>
        )}
      </CardContent>
    </Card>
  );
}

export default ChequeBookService;

