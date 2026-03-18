import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Alert,
  CircularProgress,
  Grid,
  Paper,
  Chip,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import {
  AccountCircle as AccountIcon,
  CheckCircle as CheckCircleIcon,
  AttachMoney as MoneyIcon,
  CreditCard as CardIcon,
} from '@mui/icons-material';

function AccountService({ email }) {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalBalance, setTotalBalance] = useState(0);

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
        
        if (accountsList.length > 0) {
          setAccounts(accountsList);
          const total = accountsList.reduce((sum, acc) => sum + (acc.balance || 0), 0);
          setTotalBalance(total);
        } else {
          const demoAccounts = [
            {
              id: 'ACC001',
              accountNumber: '****1234',
              accountType: 'Checking',
              balance: 5234.50,
              currency: 'USD',
              status: 'Active'
            },
            {
              id: 'ACC002',
              accountNumber: '****5678',
              accountType: 'Savings',
              balance: 15750.00,
              currency: 'USD',
              status: 'Active'
            },
            {
              id: 'ACC003',
              accountNumber: '****9012',
              accountType: 'Money Market',
              balance: 25000.00,
              currency: 'USD',
              status: 'Active'
            }
          ];
          setAccounts(demoAccounts);
          setTotalBalance(demoAccounts.reduce((sum, acc) => sum + acc.balance, 0));
        }
      } catch (err) {
        setError('Failed to load accounts: ' + err.message);
        const demoAccounts = [
          {
            id: 'ACC001',
            accountNumber: '****1234',
            accountType: 'Checking',
            balance: 5234.50,
            currency: 'USD',
            status: 'Active'
          },
          {
            id: 'ACC002',
            accountNumber: '****5678',
            accountType: 'Savings',
            balance: 15750.00,
            currency: 'USD',
            status: 'Active'
          },
          {
            id: 'ACC003',
            accountNumber: '****9012',
            accountType: 'Money Market',
            balance: 25000.00,
            currency: 'USD',
            status: 'Active'
          }
        ];
        setAccounts(demoAccounts);
        setTotalBalance(demoAccounts.reduce((sum, acc) => sum + acc.balance, 0));
      } finally {
        setLoading(false);
      }
    };

    loadAccounts();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <Card sx={{ bgcolor: 'primary.main', color: 'white' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <MoneyIcon sx={{ fontSize: 40 }} />
                <Box>
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>
                    Total Balance
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    ${totalBalance.toFixed(2)}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <AccountIcon color="primary" sx={{ fontSize: 40 }} />
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Accounts
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    {accounts.length}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <CardIcon color="secondary" sx={{ fontSize: 40 }} />
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Email
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {email}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Accounts Table */}
      <Card>
        <CardContent>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
            Your Accounts
          </Typography>
          
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600 }}>Account Type</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Account Number</TableCell>
                  <TableCell sx={{ fontWeight: 600 }} align="right">Balance</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Currency</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {accounts.map((account) => (
                  <TableRow key={account.id} hover>
                    <TableCell>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {account.accountType || 'Account'}
                      </Typography>
                    </TableCell>
                    <TableCell>{account.accountNumber || account.id}</TableCell>
                    <TableCell align="right">
                      <Typography variant="body1" sx={{ fontWeight: 600, color: 'success.main' }}>
                        ${(account.balance || 0).toFixed(2)}
                      </Typography>
                    </TableCell>
                    <TableCell>{account.currency || 'USD'}</TableCell>
                    <TableCell>
                      <Chip
                        label={account.status || 'Active'}
                        color="success"
                        size="small"
                        icon={<CheckCircleIcon />}
                      />
                    </TableCell>
                    <TableCell>
                      <Button size="small" variant="outlined">
                        View Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      <Paper sx={{ p: 2, mt: 3, bgcolor: 'info.main', color: 'white' }}>
        <Typography variant="body2">
          💡 Tip: Click on an account to see more details and transaction history
        </Typography>
      </Paper>
    </Box>
  );
}

export default AccountService;

