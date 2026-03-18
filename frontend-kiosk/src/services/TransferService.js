import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert,
  CircularProgress,
  Grid,
  Paper,
  Divider,
} from '@mui/material';
import {
  AccountBalance as TransferIcon,
  CheckCircle as CheckCircleIcon,
  Send as SendIcon,
} from '@mui/icons-material';

function TransferService({ email }) {
  const [accounts, setAccounts] = useState([]);
  const [fromAccount, setFromAccount] = useState('');
  const [toAccount, setToAccount] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [transferResult, setTransferResult] = useState(null);

  useEffect(() => {
    const loadAccounts = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:5003/accounts', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
        });
        const data = await response.json();
        const accountsList = Array.isArray(data) ? data : (data.accounts || []);
        setAccounts(accountsList.length > 0 ? accountsList : [
          { id: 'ACC001', accountNumber: '****1234', balance: 5000, currency: 'USD' },
          { id: 'ACC002', accountNumber: '****5678', balance: 3000, currency: 'USD' }
        ]);
      } catch (err) {
        setAccounts([
          { id: 'ACC001', accountNumber: '****1234', balance: 5000, currency: 'USD' },
          { id: 'ACC002', accountNumber: '****5678', balance: 3000, currency: 'USD' }
        ]);
      } finally {
        setLoading(false);
      }
    };

    loadAccounts();
  }, []);

  const handleTransfer = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setTransferResult(null);

    if (!fromAccount || !toAccount || !amount) {
      setError('Please fill in all fields');
      return;
    }

    if (fromAccount === toAccount) {
      setError('From and To accounts cannot be the same');
      return;
    }

    if (parseFloat(amount) <= 0) {
      setError('Amount must be greater than 0');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch('http://localhost:5003/transfer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fromAccountId: fromAccount,
          toAccountId: toAccount,
          amount: parseFloat(amount),
          userId: email
        })
      });

      const data = await response.json();
      
      if (response.ok || data.success) {
        setTransferResult({
          transactionId: data.transactionId || 'TXN' + Date.now(),
          status: 'Completed',
          amount: amount,
          timestamp: new Date()
        });
        setSuccess('Transfer completed successfully!');
        setFromAccount('');
        setToAccount('');
        setAmount('');
      } else {
        setError(data.error || 'Transfer failed');
      }
    } catch (err) {
      setError('Transfer error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card sx={{ maxWidth: 600, mx: 'auto' }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
          <TransferIcon color="primary" sx={{ fontSize: 32 }} />
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            Money Transfer
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}
        
        {success && (
          <Alert severity="success" sx={{ mb: 3 }}>
            {success}
          </Alert>
        )}

        {!transferResult ? (
          <form onSubmit={handleTransfer}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <FormControl fullWidth required>
                  <InputLabel>From Account</InputLabel>
                  <Select
                    value={fromAccount}
                    onChange={(e) => setFromAccount(e.target.value)}
                    label="From Account"
                    disabled={loading}
                  >
                    <MenuItem value="">Select source account</MenuItem>
                    {accounts.map((acc) => (
                      <MenuItem key={acc.id} value={acc.id}>
                        {acc.accountNumber} - Balance: ${acc.balance} {acc.currency}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <FormControl fullWidth required>
                  <InputLabel>To Account</InputLabel>
                  <Select
                    value={toAccount}
                    onChange={(e) => setToAccount(e.target.value)}
                    label="To Account"
                    disabled={loading}
                  >
                    <MenuItem value="">Select destination account</MenuItem>
                    {accounts.map((acc) => (
                      <MenuItem key={acc.id} value={acc.id}>
                        {acc.accountNumber} - Balance: ${acc.balance} {acc.currency}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Amount"
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Enter amount"
                  InputProps={{ inputProps: { step: 0.01, min: 0 } }}
                  disabled={loading}
                />
              </Grid>

              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  fullWidth
                  startIcon={<SendIcon />}
                  disabled={loading}
                >
                  {loading ? 'Processing...' : 'Transfer Money'}
                </Button>
              </Grid>
            </Grid>
          </form>
        ) : (
          <Paper sx={{ p: 3, textAlign: 'center', bgcolor: 'success.main', color: 'white' }}>
            <CheckCircleIcon sx={{ fontSize: 64, mb: 2 }} />
            <Typography variant="h5" gutterBottom>
              Transfer Successful!
            </Typography>
            <Divider sx={{ my: 2, borderColor: 'rgba(255,255,255,0.3)' }} />
            <Box sx={{ textAlign: 'left' }}>
              <Typography variant="body1">
                <strong>Transaction ID:</strong> {transferResult.transactionId}
              </Typography>
              <Typography variant="body1">
                <strong>Amount:</strong> ${transferResult.amount}
              </Typography>
              <Typography variant="body1">
                <strong>Status:</strong> {transferResult.status}
              </Typography>
              <Typography variant="body1">
                <strong>Time:</strong> {transferResult.timestamp.toLocaleString()}
              </Typography>
            </Box>
            <Button
              variant="contained"
              size="large"
              fullWidth
              sx={{ mt: 3, bgcolor: 'white', color: 'success.main' }}
              onClick={() => {
                setTransferResult(null);
                setSuccess(null);
              }}
            >
              Make Another Transfer
            </Button>
          </Paper>
        )}
      </CardContent>
    </Card>
  );
}

export default TransferService;

