import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Avatar,
  IconButton,
  InputAdornment,
  Grid,
  Paper,
  Select,
  MenuItem,
  FormControl,
  useTheme,
} from '@mui/material';
import { motion } from 'framer-motion';
import {
  Search as SearchIcon,
  Notifications as NotificationsIcon,
  CreditCard as CreditCardIcon,
  Visibility as VisibilityIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Send as SendIcon,
  SwapHoriz as SwapIcon,
  AttachMoney as MoneyIcon,
  ShoppingCart as ShoppingIcon,
  Restaurant as RestaurantIcon,
  LocalGasStation as GasIcon,
  PlayCircleFilled as EntertainmentIcon,
  ArrowUpward as ArrowUpIcon,
  ArrowDownward as ArrowDownIcon,
  AccountBalance,
  SmartToy as BotIcon,
  Person as PersonIcon,
  Security as SecurityIcon,
  Warning as WarningIcon,
  LocalOffer as OfferIcon,
  Group as QueueIcon,
  Chat as ChatSupportIcon,
  Phone as VoiceCallIcon,
  Description as StatementIcon,
  Payment as BillPaymentIcon,
  Drafts as DraftsIcon,
} from '@mui/icons-material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import '../styles/DashboardLayout.css';

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
};

// Mock data for transactions
const mockTransactions = [
  { id: 1, merchant: 'Amazon', amount: -125.50, time: '2 min ago', type: 'shopping', icon: <ShoppingIcon /> },
  { id: 2, merchant: 'Salary Deposit', amount: 4500.00, time: '1 hour ago', type: 'income', icon: <AccountBalance /> },
  { id: 3, merchant: 'Starbucks', amount: -8.75, time: '3 hours ago', type: 'food', icon: <RestaurantIcon /> },
  { id: 4, merchant: 'Uber', amount: -24.99, time: '5 hours ago', type: 'transport', icon: <TrendingUpIcon /> },
  { id: 5, merchant: 'Netflix', amount: -15.99, time: 'Yesterday', type: 'entertainment', icon: <EntertainmentIcon /> },
  { id: 6, merchant: 'Shell Gas', amount: -45.00, time: 'Yesterday', type: 'gas', icon: <GasIcon /> },
];

// Mock data for chart
const chartData = [
  { name: 'Jan', transactions: 1200 },
  { name: 'Feb', transactions: 1900 },
  { name: 'Mar', transactions: 1500 },
  { name: 'Apr', transactions: 2400 },
  { name: 'May', transactions: 2100 },
  { name: 'Jun', transactions: 3200 },
  { name: 'Jul', transactions: 2800 },
  { name: 'Aug', transactions: 3500 },
  { name: 'Sep', transactions: 2900 },
  { name: 'Oct', transactions: 3800 },
  { name: 'Nov', transactions: 4200 },
  { name: 'Dec', transactions: 4800 },
];

// Mock contacts for quick transfer
const mockContacts = [
  { id: 1, name: 'John D.', avatar: 'J' },
  { id: 2, name: 'Sarah M.', avatar: 'S' },
  { id: 3, name: 'Mike R.', avatar: 'M' },
  { id: 4, name: 'Emma L.', avatar: 'E' },
];

// ============ STATISTICS CARDS WIDGET ============
export const StatsCards = () => {
  const stats = [
    { title: 'Balance', value: '$15,750', icon: <MoneyIcon />, color: '#6366F1', trend: '+2.5%' },
    { title: 'Transactions Today', value: '23', icon: <SwapIcon />, color: '#8B5CF6', trend: '+12%' },
    { title: 'AI Requests', value: '12', icon: <BotIcon />, color: '#22C55E', trend: '+8%' },
    { title: 'Active Services', value: '6', icon: <CreditCardIcon />, color: '#F59E0B', trend: '0%' },
  ];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <Grid container spacing={2} sx={{ mb: 2 }}>
        {stats.map((stat, index) => (
          <Grid item xs={6} md={3} key={stat.title}>
            <motion.div
              variants={itemVariants}
              custom={index}
              whileHover={{ scale: 1.03, y: -4 }}
            >
              <Paper
                sx={{
                  p: 2,
                  borderRadius: 3,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  height: '100%',
                  background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
                  boxShadow: '0 4px 20px rgba(30, 58, 95, 0.08)',
                  border: '1px solid rgba(30, 58, 95, 0.04)',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                  '&:hover': {
                    boxShadow: `0 8px 30px ${stat.color}20`,
                    borderColor: `${stat.color}30`,
                  },
                }}
              >
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: `linear-gradient(135deg, ${stat.color}15 0%, ${stat.color}08 100%)`,
                    color: stat.color,
                  }}
                >
                  {stat.icon}
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                    {stat.title}
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 700, color: 'text.primary' }}>
                    {stat.value}
                  </Typography>
                </Box>
              </Paper>
            </motion.div>
          </Grid>
        ))}
      </Grid>
    </motion.div>
  );
};

// ============ ACTIVITY FEED WIDGET ============
export const ActivityFeed = () => {
  const activities = [
    { id: 1, text: 'User logged in', time: '2 min ago', type: 'login', icon: <PersonIcon /> },
    { id: 2, text: 'Transfer completed', time: '15 min ago', type: 'transfer', icon: <SendIcon /> },
    { id: 3, text: 'AI chat started', time: '30 min ago', type: 'chat', icon: <BotIcon /> },
    { id: 4, text: 'Card blocked', time: '1 hour ago', type: 'card', icon: <CreditCardIcon /> },
  ];

  return (
    <motion.div
      variants={itemVariants}
      initial="hidden"
      animate="visible"
    >
      <Card sx={{ height: '100%', borderRadius: 4, boxShadow: '0 8px 32px rgba(0,0,0,0.08)' }}>
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Recent Activity
            </Typography>
            <Button size="small" sx={{ color: 'primary.main' }}>
              View All
            </Button>
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {activities.map((activity, index) => (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    p: 1.5,
                    borderRadius: 2,
                    backgroundColor: 'background.default',
                    transition: 'all 0.2s ease',
                    cursor: 'pointer',
                    '&:hover': {
                      backgroundColor: 'action.hover',
                      transform: 'translateX(4px)',
                    },
                  }}
                >
                  <Box
                    sx={{
                      width: 36,
                      height: 36,
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: 'primary.main',
                      color: 'white',
                    }}
                  >
                    {activity.icon}
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {activity.text}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {activity.time}
                    </Typography>
                  </Box>
                </Box>
              </motion.div>
            ))}
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );
};

// ============ BALANCE CARD WIDGET ============
export const BalanceCard = ({ balance = 15750.50 }) => {
  const [showNumber, setShowNumber] = useState(false);
  
  return (
    <motion.div
      variants={itemVariants}
      initial="hidden"
      animate="visible"
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.3 }}
    >
      <Paper
        className="balance-card"
        sx={{
          borderRadius: 4,
          overflow: 'hidden',
          position: 'relative',
          background: 'linear-gradient(135deg, #6366f1, #8b5cf6, #ec4899)',
          color: 'white',
          p: 3,
          minHeight: 190,
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.08)',
        }}
      >
        {/* Background Pattern */}
        <Box
          sx={{
            position: 'absolute',
            top: -50,
            right: -50,
            width: 200,
            height: 200,
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.1)',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: -30,
            left: -30,
            width: 150,
            height: 150,
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.05)',
          }}
        />

        <Box sx={{ position: 'relative', zIndex: 1, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          {/* Top Row */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Box>
              <Typography variant="body2" sx={{ opacity: 0.8, mb: 0.5 }}>
                Current Balance
              </Typography>
              <Typography variant="h3" sx={{ fontWeight: 700, letterSpacing: 1 }}>
                ${balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </Typography>
            </Box>
            <CreditCardIcon sx={{ fontSize: 40, opacity: 0.8 }} />
          </Box>

          {/* Card Number */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 2 }}>
            <Typography variant="h6" sx={{ fontFamily: 'monospace', letterSpacing: 2 }}>
              {showNumber ? '4532 1098 7654 3210' : '•••• •••• •••• 3210'}
            </Typography>
            <IconButton
              size="small"
              onClick={() => setShowNumber(!showNumber)}
              sx={{ color: 'white', opacity: 0.7 }}
            >
              <VisibilityIcon fontSize="small" />
            </IconButton>
          </Box>

          {/* Bottom Row */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
            <Box>
              <Typography variant="caption" sx={{ opacity: 0.7 }}>
                Card Holder
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 600 }}>
                JOHN DOE
              </Typography>
            </Box>
            <Box>
              <Typography variant="caption" sx={{ opacity: 0.7 }}>
                Expires
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 600 }}>
                12/28
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Box
                sx={{
                  width: 40,
                  height: 25,
                  borderRadius: 1,
                  background: 'linear-gradient(135deg, #FF5F00 0%, #D4AF37 100%)',
                  mr: 0.5,
                }}
              />
              <Box
                sx={{
                  width: 40,
                  height: 25,
                  borderRadius: 1,
                  background: 'linear-gradient(135deg, #1A1F71 0%, #00579F 100%)',
                  ml: -1,
                }}
              />
            </Box>
          </Box>
        </Box>
      </Paper>
    </motion.div>
  );
};

// ============ TRANSACTIONS WIDGET ============
export const TransactionsWidget = () => {
  const theme = useTheme();
  
  return (
    <motion.div
      variants={itemVariants}
      initial="hidden"
      animate="visible"
    >
      <Card sx={{ height: '100%', borderRadius: 4, boxShadow: '0 8px 32px rgba(0,0,0,0.08)' }}>
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Recent Transactions
            </Typography>
            <Button size="small" sx={{ color: 'primary.main' }}>
              View All
            </Button>
          </Box>

          <Box sx={{ maxHeight: 320, overflow: 'auto' }}>
            {mockTransactions.map((transaction, index) => (
              <motion.div
                key={transaction.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    py: 1.5,
                    borderBottom: index < mockTransactions.length - 1 ? '1px solid' : 'none',
                    borderColor: 'divider',
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box
                      sx={{
                        width: 44,
                        height: 44,
                        borderRadius: '50%',
                        bgcolor: transaction.amount > 0 ? 'success.light' : 'action.hover',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: transaction.amount > 0 ? 'success.dark' : 'text.secondary',
                      }}
                    >
                      {transaction.icon}
                    </Box>
                    <Box>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {transaction.merchant}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {transaction.time}
                      </Typography>
                    </Box>
                  </Box>
                  <Typography
                    variant="body1"
                    sx={{
                      fontWeight: 600,
                      color: transaction.amount > 0 ? 'success.main' : 'error.main',
                    }}
                  >
                    {transaction.amount > 0 ? '+' : ''}
                    ${transaction.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </Typography>
                </Box>
              </motion.div>
            ))}
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );
};

// ============ QUICK TRANSFER WIDGET ============
export const QuickTransferWidget = () => {
  const [amount, setAmount] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  
  return (
    <motion.div
      variants={itemVariants}
      initial="hidden"
      animate="visible"
    >
      <Card sx={{ height: '100%', borderRadius: 4, boxShadow: '0 8px 32px rgba(0,0,0,0.08)' }}>
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
            <SendIcon sx={{ color: 'primary.main' }} />
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Quick Transfer
            </Typography>
          </Box>

          <TextField
            fullWidth
            label="Card Number"
            placeholder="Enter card number"
            value={cardNumber}
            onChange={(e) => setCardNumber(e.target.value)}
            sx={{ mb: 2 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <CreditCardIcon color="action" />
                </InputAdornment>
              ),
            }}
          />

          <TextField
            fullWidth
            label="Amount"
            type="number"
            placeholder="Enter amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            sx={{ mb: 3 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <MoneyIcon color="action" />
                </InputAdornment>
              ),
            }}
          />

          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              fullWidth
              variant="contained"
              startIcon={<SendIcon />}
              sx={{
                py: 1.5,
                background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
                boxShadow: '0 8px 24px rgba(99, 102, 241, 0.3)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #8B5CF6 0%, #6366F1 100%)',
                },
              }}
            >
              Send Money
            </Button>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

// ============ CURRENCY CONVERSION WIDGET ============
export const CurrencyConversionWidget = () => {
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('EUR');
  const [amount, setAmount] = useState('100');
  
  const exchangeRate = 0.85; // Mock rate
  
  return (
    <motion.div
      variants={itemVariants}
      initial="hidden"
      animate="visible"
    >
      <Card sx={{ height: '100%', borderRadius: 4, boxShadow: '0 8px 32px rgba(0,0,0,0.08)' }}>
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
            <SwapIcon sx={{ color: 'primary.main' }} />
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Currency Exchange
            </Typography>
          </Box>

          <TextField
            fullWidth
            label="Amount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            sx={{ mb: 2 }}
          />

          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <FormControl fullWidth>
              <InputAdornment position="start">From</InputAdornment>
              <Select
                value={fromCurrency}
                onChange={(e) => setFromCurrency(e.target.value)}
                sx={{ borderRadius: 2 }}
              >
                <MenuItem value="USD">🇺🇸 USD</MenuItem>
                <MenuItem value="EUR">🇪🇺 EUR</MenuItem>
                <MenuItem value="GBP">🇬🇧 GBP</MenuItem>
                <MenuItem value="JPY">🇯🇵 JPY</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputAdornment position="start">To</InputAdornment>
              <Select
                value={toCurrency}
                onChange={(e) => setToCurrency(e.target.value)}
                sx={{ borderRadius: 2 }}
              >
                <MenuItem value="USD">🇺🇸 USD</MenuItem>
                <MenuItem value="EUR">🇪🇺 EUR</MenuItem>
                <MenuItem value="GBP">🇬🇧 GBP</MenuItem>
                <MenuItem value="JPY">🇯🇵 JPY</MenuItem>
              </Select>
            </FormControl>
          </Box>

          <Box
            sx={{
              p: 2,
              borderRadius: 2,
              bgcolor: 'primary.main',
              color: 'white',
              textAlign: 'center',
            }}
          >
            <Typography variant="body2" sx={{ opacity: 0.8 }}>
              1 {fromCurrency} = {exchangeRate} {toCurrency}
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 700, mt: 0.5 }}>
              {amount} {fromCurrency} = {(parseFloat(amount) * exchangeRate).toFixed(2)} {toCurrency}
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );
};

// ============ ANALYTICS CHART WIDGET ============
export const AnalyticsChart = () => {
  const theme = useTheme();
  
  return (
    <motion.div
      variants={itemVariants}
      initial="hidden"
      animate="visible"
    >
      <Card sx={{ height: '100%', borderRadius: 4, boxShadow: '0 8px 32px rgba(0,0,0,0.08)' }}>
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Monthly Transactions
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Account activity over time
              </Typography>
            </Box>
            <Box sx={{ textAlign: 'right' }}>
              <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main' }}>
                $33,500
              </Typography>
              <Typography variant="body2" sx={{ color: 'success.main', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <TrendingUpIcon fontSize="small" />
                +12.5%
              </Typography>
            </Box>
          </Box>

          <Box sx={{ height: 250, mt: 2 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorTransactions" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366F1" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.06)" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fill: '#64748b' }}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fill: '#64748b' }}
                  tickFormatter={(value) => `$${value / 1000}k`}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: 12,
                    border: 'none',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                    backgroundColor: 'white',
                  }}
                  formatter={(value) => [`$${value.toLocaleString()}`, 'Transactions']}
                />
                <Area
                  type="monotone"
                  dataKey="transactions"
                  stroke="#6366F1"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorTransactions)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );
};

// ============ QUICK TRANSFER CONTACTS WIDGET ============
export const QuickTransferContacts = () => {
  return (
    <motion.div
      variants={itemVariants}
      initial="hidden"
      animate="visible"
    >
      <Card sx={{ height: '100%', borderRadius: 4, boxShadow: '0 8px 32px rgba(0,0,0,0.08)' }}>
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Quick Transfer
            </Typography>
            <Button size="small" sx={{ color: 'primary.main' }}>
              See All
            </Button>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'space-around', mb: 3 }}>
            {mockContacts.map((contact) => (
              <motion.div
                key={contact.id}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Box sx={{ textAlign: 'center', cursor: 'pointer' }}>
                  <Avatar
                    sx={{
                      width: 56,
                      height: 56,
                      bgcolor: 'primary.main',
                      mb: 1,
                      boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)',
                    }}
                  >
                    {contact.avatar}
                  </Avatar>
                  <Typography variant="caption" sx={{ fontWeight: 500 }}>
                    {contact.name}
                  </Typography>
                </Box>
              </motion.div>
            ))}
          </Box>

          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              fullWidth
              variant="contained"
              startIcon={<SendIcon />}
              sx={{
                py: 1.5,
                background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
                boxShadow: '0 8px 24px rgba(99, 102, 241, 0.3)',
              }}
            >
              Send Money
            </Button>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

// ============ FINANCE OVERVIEW DONUT CHART WIDGET ============
const FINANCE_DATA = [
  { name: 'Balance', value: 15750, color: '#6366F1' },
  { name: 'Expenses', value: 4250, color: '#EC4899' },
  { name: 'Loans', value: 8500, color: '#F59E0B' },
  { name: 'Savings', value: 5000, color: '#22C55E' },
];

export const FinanceOverviewChart = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const total = FINANCE_DATA.reduce((acc, item) => acc + item.value, 0);
  const activeData = FINANCE_DATA[activeIndex];

  return (
    <motion.div
      variants={itemVariants}
      initial="hidden"
      animate="visible"
    >
      <Card sx={{ height: '100%', borderRadius: 4, boxShadow: '0 8px 32px rgba(0,0,0,0.08)' }}>
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Finance Overview
            </Typography>
          </Box>

          <Box sx={{ position: 'relative', height: 220 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={FINANCE_DATA}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  onMouseEnter={(_, index) => setActiveIndex(index)}
                  animationBegin={0}
                  animationDuration={1000}
                >
                  {FINANCE_DATA.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.color}
                      style={{ filter: activeIndex === index ? 'brightness(1.1)' : 'none' }}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    borderRadius: 12,
                    border: 'none',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                    backgroundColor: 'white',
                  }}
                  formatter={(value) => [`$${value.toLocaleString()}`, '']}
                />
              </PieChart>
            </ResponsiveContainer>
            {/* Center Text */}
            <Box
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                textAlign: 'center',
              }}
            >
              <Typography variant="h4" sx={{ fontWeight: 700, color: activeData.color }}>
                {Math.round((activeData.value / total) * 100)}%
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {activeData.name}
              </Typography>
            </Box>
          </Box>

          {/* Legend */}
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap', mt: 1 }}>
            {FINANCE_DATA.map((item, index) => (
              <motion.div
                key={item.name}
                whileHover={{ scale: 1.05 }}
                onMouseEnter={() => setActiveIndex(index)}
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.5,
                    px: 1.5,
                    py: 0.5,
                    borderRadius: 2,
                    cursor: 'pointer',
                    bgcolor: activeIndex === index ? `${item.color}15` : 'transparent',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      bgcolor: item.color,
                    }}
                  />
                  <Typography variant="caption" sx={{ fontWeight: 500 }}>
                    {item.name}
                  </Typography>
                </Box>
              </motion.div>
            ))}
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );
};

// ============ AI INSIGHTS PANEL WIDGET ============
export const AIInsightsPanel = () => {
  const insights = [
    { id: 1, title: 'AI Chat Activity', value: '24 chats today', icon: <BotIcon />, color: '#6366F1', bgColor: '#EEF2FF' },
    { id: 2, title: 'Security Alerts', value: '2 new alerts', icon: <SecurityIcon />, color: '#F59E0B', bgColor: '#FEF3C7' },
    { id: 3, title: 'Loan Suggestions', value: '3 offers available', icon: <OfferIcon />, color: '#22C55E', bgColor: '#DCFCE7' },
    { id: 4, title: 'Queue Updates', value: '5 min avg wait', icon: <QueueIcon />, color: '#EC4899', bgColor: '#FCE7F3' },
  ];

  return (
    <motion.div
      variants={itemVariants}
      initial="hidden"
      animate="visible"
    >
      <Card sx={{ height: '100%', borderRadius: 4, boxShadow: '0 8px 32px rgba(0,0,0,0.08)' }}>
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
            <BotIcon sx={{ color: 'primary.main' }} />
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              AI Insights
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {insights.map((insight, index) => (
              <motion.div
                key={insight.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    p: 2,
                    borderRadius: 3,
                    bgcolor: insight.bgColor,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      transform: 'translateX(4px)',
                    },
                  }}
                >
                  <Box
                    sx={{
                      width: 44,
                      height: 44,
                      borderRadius: 2,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      bgcolor: 'white',
                      color: insight.color,
                    }}
                  >
                    {insight.icon}
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {insight.title}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {insight.value}
                    </Typography>
                  </Box>
                </Box>
              </motion.div>
            ))}
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );
};

// ============ CHAT SUPPORT PANEL WIDGET ============
export const ChatSupportPanel = ({ onServiceClick }) => {
  const services = [
    { id: 'transfer', title: 'Transfers', icon: <SendIcon />, gradient: 'linear-gradient(135deg, #6366F1, #8B5CF6)' },
    { id: 'voice', title: 'Voice Call', icon: <VoiceCallIcon />, gradient: 'linear-gradient(135deg, #22C55E, #4ADE80)' },
    { id: 'statement', title: 'Statements', icon: <StatementIcon />, gradient: 'linear-gradient(135deg, #3B82F6, #60A5FA)' },
    { id: 'bill-pay', title: 'Bill Payments', icon: <BillPaymentIcon />, gradient: 'linear-gradient(135deg, #F59E0B, #FBBF24)' },
  ];

  return (
    <motion.div
      variants={itemVariants}
      initial="hidden"
      animate="visible"
    >
      <Card sx={{ height: '100%', borderRadius: 4, boxShadow: '0 8px 32px rgba(0,0,0,0.08)' }}>
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
            <ChatSupportIcon sx={{ color: 'primary.main' }} />
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Quick Services
            </Typography>
          </Box>

          <Grid container spacing={2}>
            {services.map((service, index) => (
              <Grid item xs={6} key={service.id}>
                <motion.div
                  whileHover={{ scale: 1.05, y: -4 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Paper
                    onClick={() => onServiceClick && onServiceClick(service.id)}
                    sx={{
                      p: 2,
                      borderRadius: 3,
                      cursor: 'pointer',
                      background: service.gradient,
                      color: 'white',
                      textAlign: 'center',
                      boxShadow: '0 4px 14px rgba(0,0,0,0.15)',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        boxShadow: '0 8px 24px rgba(0,0,0,0.25)',
                      },
                    }}
                  >
                    <Box sx={{ mb: 1 }}>
                      {service.icon}
                    </Box>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {service.title}
                    </Typography>
                  </Paper>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>
    </motion.div>
  );
};

// ============ MAIN DASHBOARD WIDGETS CONTAINER ============
const DashboardWidgets = ({ email, balance, onServiceClick }) => {
  return (
    <Box className="dashboard-main-container">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Statistics Cards Row */}
        <StatsCards />
        
        {/* Dashboard Grid - 12 Column Layout */}
        <Box className="dashboard-grid">
          {/* ROW 1: Balance Card, Recent Transactions, Finance Overview */}
          <Box className="dashboard-col-4">
            <BalanceCard balance={balance} />
          </Box>
          <Box className="dashboard-col-4">
            <TransactionsWidget />
          </Box>
          <Box className="dashboard-col-4">
            <FinanceOverviewChart />
          </Box>

          {/* ROW 2: Transactions List, Monthly Transactions, AI Insights */}
          <Box className="dashboard-col-4">
            <Card className="dashboard-card row-height-320">
              <CardContent sx={{ p: '20px' }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                  Transactions List
                </Typography>
                <Box sx={{ maxHeight: 180, overflow: 'auto' }}>
                  {mockTransactions.slice(0, 4).map((transaction, index) => (
                    <Box
                      key={transaction.id}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        py: 1,
                        borderBottom: index < 3 ? '1px solid' : 'none',
                        borderColor: 'divider',
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Box
                          sx={{
                            width: 36,
                            height: 36,
                            borderRadius: '50%',
                            bgcolor: transaction.amount > 0 ? 'success.light' : 'action.hover',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: transaction.amount > 0 ? 'success.dark' : 'text.secondary',
                          }}
                        >
                          {transaction.icon}
                        </Box>
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {transaction.merchant}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {transaction.time}
                          </Typography>
                        </Box>
                      </Box>
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 600,
                          color: transaction.amount > 0 ? 'success.main' : 'error.main',
                        }}
                      >
                        {transaction.amount > 0 ? '+' : ''}
                        ${transaction.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Box>
          <Box className="dashboard-col-4">
            <Card className="dashboard-card row-height-320">
              <CardContent sx={{ p: '20px' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      Monthly Transactions
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Account activity
                    </Typography>
                  </Box>
                  <Typography variant="h5" sx={{ fontWeight: 700, color: 'primary.main' }}>
                    $33,500
                  </Typography>
                </Box>
                <Box sx={{ height: 160 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorTrans" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#6366F1" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.06)" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} tickFormatter={(v) => `$${v/1000}k`} />
                      <Tooltip
                        contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                        formatter={(value) => [`$${value}`, 'Transactions']}
                      />
                      <Area type="monotone" dataKey="transactions" stroke="#6366F1" strokeWidth={2} fillOpacity={1} fill="url(#colorTrans)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </Box>
              </CardContent>
            </Card>
          </Box>
          <Box className="dashboard-col-4">
            <Card className="dashboard-card dashboard-card-260">
              <CardContent sx={{ p: '20px' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <BotIcon sx={{ color: 'primary.main' }} />
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    AI Insights
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                  {[
                    { title: 'AI Chat Activity', value: '24 chats today', icon: <BotIcon />, color: '#6366F1', bg: '#EEF2FF' },
                    { title: 'Security Alerts', value: '2 new alerts', icon: <SecurityIcon />, color: '#F59E0B', bg: '#FEF3C7' },
                    { title: 'Loan Suggestions', value: '3 offers available', icon: <OfferIcon />, color: '#22C55E', bg: '#DCFCE7' },
                  ].map((insight, idx) => (
                    <Box
                      key={idx}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1.5,
                        p: 1.5,
                        borderRadius: 2,
                        bgcolor: insight.bg,
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        '&:hover': { transform: 'translateX(4px)' },
                      }}
                    >
                      <Box
                        sx={{
                          width: 36,
                          height: 36,
                          borderRadius: 1.5,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          bgcolor: 'white',
                          color: insight.color,
                        }}
                      >
                        {insight.icon}
                      </Box>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {insight.title}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {insight.value}
                        </Typography>
                      </Box>
                    </Box>
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Box>

          {/* ROW 3: Quick Transfer, Chat Support Services, Recent Activity */}
          <Box className="dashboard-col-4">
            <Card className="dashboard-card row-height-240">
              <CardContent sx={{ p: '20px' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <SendIcon sx={{ color: 'primary.main' }} />
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Quick Transfer
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-around', mb: 2 }}>
                  {mockContacts.map((contact) => (
                    <Box key={contact.id} sx={{ textAlign: 'center', cursor: 'pointer' }}>
                      <Box className="quick-transfer-avatar">
                        {contact.avatar}
                      </Box>
                      <Typography variant="caption" sx={{ fontWeight: 500 }}>
                        {contact.name}
                      </Typography>
                    </Box>
                  ))}
                </Box>
                <Box sx={{ display: 'flex', gap: 1.5 }}>
                  <Button
                    fullWidth
                    className="quick-transfer-send-btn"
                    startIcon={<SendIcon />}
                  >
                    Send Money
                  </Button>
                  <Button
                    fullWidth
                    className="quick-transfer-draft-btn"
                    startIcon={<DraftsIcon />}
                  >
                    Save
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Box>
          <Box className="dashboard-col-4">
            <Card className="dashboard-card row-height-240">
              <CardContent sx={{ p: '20px' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <ChatSupportIcon sx={{ color: 'primary.main' }} />
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Service Shortcuts
                  </Typography>
                </Box>
                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5 }}>
                  <Button className="service-shortcut-btn transfer" startIcon={<SendIcon />}>
                    Transfers
                  </Button>
                  <Button className="service-shortcut-btn voice" startIcon={<VoiceCallIcon />}>
                    Voice Call
                  </Button>
                  <Button className="service-shortcut-btn statement" startIcon={<StatementIcon />}>
                    Statements
                  </Button>
                  <Button className="service-shortcut-btn bill-pay" startIcon={<BillPaymentIcon />}>
                    Bill Payments
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Box>
          <Box className="dashboard-col-4">
            <Card className="dashboard-card dashboard-card-210">
              <CardContent sx={{ p: '20px' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Recent Activity
                  </Typography>
                  <Button size="small" sx={{ color: 'primary.main' }}>
                    View All
                  </Button>
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                  {[
                    { text: 'User logged in', time: '2 min ago', icon: <PersonIcon /> },
                    { text: 'Transfer completed', time: '15 min ago', icon: <SendIcon /> },
                    { text: 'AI chat started', time: '30 min ago', icon: <BotIcon /> },
                  ].map((activity, idx) => (
                    <Box
                      key={idx}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1.5,
                        p: 1,
                        borderRadius: 1.5,
                        bgcolor: 'background.default',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        '&:hover': { bgcolor: 'action.hover', transform: 'translateX(4px)' },
                      }}
                    >
                      <Box
                        sx={{
                          width: 32,
                          height: 32,
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          bgcolor: 'primary.main',
                          color: 'white',
                        }}
                      >
                        {activity.icon}
                      </Box>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {activity.text}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {activity.time}
                        </Typography>
                      </Box>
                    </Box>
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Box>
        </Box>
      </motion.div>
    </Box>
  );
};

export default DashboardWidgets;

