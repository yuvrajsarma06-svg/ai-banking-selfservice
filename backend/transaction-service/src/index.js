const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5003;

app.use(cors());
app.use(express.json());

// Mock data
const mockAccounts = [
  { id: 'ACC001', number: '****1234', type: 'Savings', balance: 15750.50, currency: 'USD', status: 'Active' },
  { id: 'ACC002', number: '****5678', type: 'Checking', balance: 5234.75, currency: 'USD', status: 'Active' },
  { id: 'ACC003', number: '****9012', type: 'Money Market', balance: 25000.00, currency: 'USD', status: 'Active' }
];

const mockCards = [
  { id: 'CARD001', number: '****1234', type: 'Debit', status: 'Active', expiry: '12/26' },
  { id: 'CARD002', number: '****5678', type: 'Credit', status: 'Active', expiry: '08/27' }
];

const mockTransactions = [
  { id: 'TXN001', date: '2026-03-01', description: 'ATM Withdrawal', amount: -200, balance: 15750.50 },
  { id: 'TXN002', date: '2026-02-28', description: 'Salary Deposit', amount: 5000, balance: 15950.50 },
  { id: 'TXN003', date: '2026-02-27', description: 'Utility Bill Payment', amount: -150, balance: 10950.50 },
  { id: 'TXN004', date: '2026-02-26', description: 'Grocery Store', amount: -85.30, balance: 11100.80 }
];

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'transaction-service' });
});

// Get accounts with enhanced details
app.get('/accounts', (req, res) => {
  res.json({
    success: true,
    accounts: mockAccounts
  });
});

// Get mini statement
app.get('/accounts/:accountId/statement', (req, res) => {
  res.json({
    success: true,
    statement: {
      accountId: req.params.accountId,
      transactions: mockTransactions,
      accountDetails: mockAccounts[0]
    }
  });
});

// Get transaction history
app.get('/transactions/:accountId', (req, res) => {
  res.json({
    success: true,
    transactions: mockTransactions.map((t, idx) => ({
      ...t,
      id: `TXN${String(idx + 1).padStart(3, '0')}`,
      type: t.amount > 0 ? 'credit' : 'debit'
    }))
  });
});

// Get cards
app.get('/cards', (req, res) => {
  res.json({
    success: true,
    cards: mockCards
  });
});

// Block card
app.post('/cards/:cardId/block', (req, res) => {
  res.json({
    success: true,
    message: 'Card blocked successfully',
    cardId: req.params.cardId,
    status: 'Blocked'
  });
});

// Reissue card
app.post('/cards/:cardId/reissue', (req, res) => {
  res.json({
    success: true,
    message: 'New card will be delivered in 7-10 business days',
    cardId: req.params.cardId,
    deliveryAddress: '123 Main St, City, State ZIP'
  });
});

// Request cheque book
app.post('/cheque-book/request', (req, res) => {
  res.json({
    success: true,
    message: 'Cheque book request submitted',
    requestId: 'CHQ' + Date.now(),
    accountId: req.body.accountId,
    leaves: req.body.leaves || 50,
    estimatedDelivery: '5-7 business days'
  });
});

// Get cheque book requests
app.get('/cheque-book/requests', (req, res) => {
  res.json({
    success: true,
    requests: [
      { requestId: 'CHQ001', date: '2026-02-20', leaves: 50, status: 'Delivered' },
      { requestId: 'CHQ002', date: '2026-03-01', leaves: 50, status: 'In Transit' }
    ]
  });
});

// Transfer money
app.post('/transfer', (req, res) => {
  const { fromAccountId, toAccountId, amount, userId } = req.body;
  res.json({
    success: true,
    status: 'pending',
    transactionId: 'TXN' + Date.now(),
    from: fromAccountId,
    to: toAccountId,
    amount: amount,
    timestamp: new Date().toISOString()
  });
});

// Confirm transfer with OTP
app.post('/confirm-transfer', (req, res) => {
  res.json({
    success: true,
    status: 'completed',
    message: 'Transfer completed successfully',
    transactionId: req.body.transactionId
  });
});

// Bill payment
app.post('/bill-pay', (req, res) => {
  const { billerName, amount, accountId } = req.body;
  res.json({
    success: true,
    message: 'Bill payment successful',
    billId: 'BILL' + Date.now(),
    biller: billerName,
    amount: amount,
    date: new Date().toDateString()
  });
});

// Get fraud alerts
app.get('/fraud-alerts', (req, res) => {
  res.json({
    success: true,
    alerts: [
      { id: 'FRAUD001', date: '2026-02-28', description: 'Suspicious login from new device', status: 'Resolved' },
      { id: 'FRAUD002', date: '2026-03-01', description: 'Unusual spending pattern detected', status: 'Monitoring' }
    ]
  });
});

// Get financial recommendations
app.get('/recommendations', (req, res) => {
  res.json({
    success: true,
    recommendations: [
      { id: 'REC001', title: 'Open a Savings Account', description: 'Earn up to 6% interest annually', type: 'savings' },
      { id: 'REC002', title: 'Apply for Personal Loan', description: 'Quick approval in 5 minutes', type: 'loan' },
      { id: 'REC003', title: 'Upgrade to Premium Card', description: 'Get cashback on all purchases', type: 'card' }
    ]
  });
});

app.listen(PORT, () => {
  console.log(`✅ Transaction Service running on port ${PORT}`);
});
