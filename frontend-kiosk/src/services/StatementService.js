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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Chip,
} from '@mui/material';
import {
  Description as StatementIcon,
  Print as PrintIcon,
  Download as DownloadIcon,
  TrendingUp as CreditIcon,
  TrendingDown as DebitIcon,
} from '@mui/icons-material';

function StatementService({ email }) {
  const [statement, setStatement] = useState(null);
  const [accountId, setAccountId] = useState('ACC001');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadStatement();
  }, [accountId]);

  const loadStatement = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:5003/accounts/${accountId}/statement`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await response.json();
      setStatement(data.statement || {
        transactions: [
          { id: 'TXN001', date: '2026-03-01', description: 'ATM Withdrawal', amount: -200, balance: 15750.50 },
          { id: 'TXN002', date: '2026-02-28', description: 'Salary Deposit', amount: 5000, balance: 15950.50 },
          { id: 'TXN003', date: '2026-02-27', description: 'Utility Bill', amount: -150, balance: 10950.50 }
        ],
        accountDetails: { balance: 15750.50, accountNumber: '****1234' }
      });
    } catch (err) {
      setError('Failed to load statement');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Card sx={{ maxWidth: 700, mx: 'auto' }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
          <StatementIcon color="primary" sx={{ fontSize: 32 }} />
          <Typography variant="h5" sx={{ fontWeight: 600 }}>Mini Statement</Typography>
        </Box>

        {error && <Typography color="error" sx={{ mb: 2 }}>{error}</Typography>}

        <FormControl fullWidth sx={{ mb: 3 }}>
          <InputLabel>Select Account</InputLabel>
          <Select value={accountId} onChange={(e) => setAccountId(e.target.value)} label="Select Account">
            <MenuItem value="ACC001">Savings - ****1234</MenuItem>
            <MenuItem value="ACC002">Checking - ****5678</MenuItem>
            <MenuItem value="ACC003">Money Market - ****9012</MenuItem>
          </Select>
        </FormControl>

        {statement && (
          <>
            <Paper sx={{ p: 2, mb: 3, bgcolor: 'primary.main', color: 'white' }}>
              <Grid container>
                <Grid item xs={6}>
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>Current Balance</Typography>
                  <Typography variant="h4" fontWeight={700}>${statement.accountDetails?.balance || 15750.50}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>Statement Period</Typography>
                  <Typography variant="h6">Last 30 Days</Typography>
                </Grid>
              </Grid>
            </Paper>

            <Typography variant="h6" sx={{ mb: 2 }}>Recent Transactions</Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600 }}>Date</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Description</TableCell>
                    <TableCell sx={{ fontWeight: 600 }} align="right">Amount</TableCell>
                    <TableCell sx={{ fontWeight: 600 }} align="right">Balance</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {statement.transactions && statement.transactions.map((txn, idx) => (
                    <TableRow key={idx} hover>
                      <TableCell>{txn.date}</TableCell>
                      <TableCell>{txn.description}</TableCell>
                      <TableCell align="right">
                        <Chip
                          icon={txn.amount > 0 ? <CreditIcon /> : <DebitIcon />}
                          label={`${txn.amount > 0 ? '+' : ''}$${Math.abs(txn.amount)}`}
                          color={txn.amount > 0 ? 'success' : 'error'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell align="right">${txn.balance}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
              <Button variant="outlined" startIcon={<PrintIcon />}>Print Statement</Button>
              <Button variant="outlined" startIcon={<DownloadIcon />}>Download PDF</Button>
            </Box>
          </>
        )}
      </CardContent>
    </Card>
  );
}

export default StatementService;

