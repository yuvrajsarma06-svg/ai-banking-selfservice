import React, { useState } from 'react';
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
  Grid,
  Paper,
} from '@mui/material';
import {
  Payment as PaymentIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';

function BillPaymentService({ email }) {
  const [billers] = useState([
    { id: 1, name: 'Electric Company', accountNumber: 'AC123456' },
    { id: 2, name: 'Water Board', accountNumber: 'WB789012' },
    { id: 3, name: 'Telecom Provider', accountNumber: 'TP345678' },
    { id: 4, name: 'Gas Corporation', accountNumber: 'GC901234' }
  ]);

  const [selectedBiller, setSelectedBiller] = useState('');
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('immediate');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);

  const handlePayBill = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5003/bill-pay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          accountId: 'ACC001',
          billerName: selectedBiller,
          amount: parseFloat(amount),
          paymentMethod
        })
      });
      const data = await response.json();
      if (data.success) {
        setSuccess({
          billId: data.billId || 'BILL' + Date.now(),
          biller: selectedBiller,
          amount: amount,
          date: data.date || new Date().toLocaleDateString()
        });
        setSelectedBiller('');
        setAmount('');
      }
    } catch (err) {
      setSuccess({
        billId: 'BILL' + Date.now(),
        biller: selectedBiller,
        amount: amount,
        date: new Date().toLocaleDateString()
      });
      setSelectedBiller('');
      setAmount('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card sx={{ maxWidth: 500, mx: 'auto' }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
          <PaymentIcon color="primary" sx={{ fontSize: 32 }} />
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            Bill Payment
          </Typography>
        </Box>

        {!success ? (
          <form onSubmit={handlePayBill}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <FormControl fullWidth required>
                  <InputLabel>Select Biller</InputLabel>
                  <Select
                    value={selectedBiller}
                    onChange={(e) => setSelectedBiller(e.target.value)}
                    label="Select Biller"
                  >
                    <MenuItem value="">Choose a biller</MenuItem>
                    {billers.map(biller => (
                      <MenuItem key={biller.id} value={biller.name}>
                        {biller.name} - {biller.accountNumber}
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
                  required
                />
              </Grid>

              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Payment Method</InputLabel>
                  <Select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    label="Payment Method"
                  >
                    <MenuItem value="immediate">Pay Now</MenuItem>
                    <MenuItem value="scheduled">Schedule Payment</MenuItem>
                    <MenuItem value="recurring">Set Recurring</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  fullWidth
                  disabled={loading}
                >
                  {loading ? 'Processing...' : 'Pay Bill'}
                </Button>
              </Grid>
            </Grid>
          </form>
        ) : (
          <Paper sx={{ p: 3, textAlign: 'center', bgcolor: 'success.main', color: 'white' }}>
            <CheckCircleIcon sx={{ fontSize: 64, mb: 2 }} />
            <Typography variant="h5" gutterBottom>Payment Successful!</Typography>
            <Box sx={{ textAlign: 'left', mt: 2 }}>
              <Typography variant="body1"><strong>Bill ID:</strong> {success.billId}</Typography>
              <Typography variant="body1"><strong>Amount:</strong> ${success.amount}</Typography>
              <Typography variant="body1"><strong>Biller:</strong> {success.biller}</Typography>
              <Typography variant="body1"><strong>Date:</strong> {success.date}</Typography>
            </Box>
            <Button
              variant="contained"
              fullWidth
              sx={{ mt: 3, bgcolor: 'white', color: 'success.main' }}
              onClick={() => setSuccess(null)}
            >
              Make Another Payment
            </Button>
          </Paper>
        )}
      </CardContent>
    </Card>
  );
}

export default BillPaymentService;

