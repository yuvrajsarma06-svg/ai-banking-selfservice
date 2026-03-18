import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Paper,
  TextField,
  Avatar,
  Chip,
  AppBar,
  Toolbar,
  IconButton,
  CircularProgress,
  Divider,
  Grid,
  Badge,
  Tooltip,
  LinearProgress,
  alpha,
  useTheme,
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import {
  SupportAgent as AgentIcon,
  Send as SendIcon,
  Logout as LogoutIcon,
  Circle as CircleIcon,
  Dashboard as DashboardIcon,
  Analytics as AnalyticsIcon,
  People as PeopleIcon,
  TrendingUp as TrendingUpIcon,
  Message as MessageIcon,
  Phone as PhoneIcon,
  AccessTime as TimeIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  MoreVert as MoreVertIcon,
  Search as SearchIcon,
  Notifications as NotificationsIcon,
  Settings as SettingsIcon,
  AccountBalanceWallet as WalletIcon,
  CreditCard as CreditCardIcon,
  Receipt as ReceiptIcon,
} from '@mui/icons-material';

// Animation variants
const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

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
  visible: { opacity: 1, y: 0 },
};

// Glassmorphism card component
const GlassCard = ({ children, sx = {}, onClick, ...props }) => (
  <motion.div
    whileHover={{ scale: 1.02, y: -4 }}
    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
  >
    <Paper
      onClick={onClick}
      sx={{
        background: (theme) => alpha(theme.palette.background.paper, 0.7),
        backdropFilter: 'blur(10px)',
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 3,
        boxShadow: (theme) => theme.shadows[3],
        cursor: onClick ? 'pointer' : 'default',
        overflow: 'hidden',
        ...sx,
      }}
      {...props}
    >
      {children}
    </Paper>
  </motion.div>
);

// Stats Card Component
const StatsCard = ({ title, value, subtitle, icon, color = 'primary', trend }) => {
  const theme = useTheme();
  return (
    <motion.div
      variants={itemVariants}
      whileHover={{ scale: 1.03 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
    >
      <GlassCard sx={{ height: '100%' }}>
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1, fontWeight: 500 }}>
                {title}
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
                {value}
              </Typography>
              {subtitle && (
                <Typography variant="caption" color="text.secondary">
                  {subtitle}
                </Typography>
              )}
              {trend && (
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                  <TrendingUpIcon sx={{ fontSize: 16, color: trend > 0 ? 'success.main' : 'error.main', mr: 0.5 }} />
                  <Typography variant="caption" sx={{ color: trend > 0 ? 'success.main' : 'error.main', fontWeight: 600 }}>
                    {trend > 0 ? '+' : ''}{trend}%
                  </Typography>
                </Box>
              )}
            </Box>
            <Box
              sx={{
                width: 56,
                height: 56,
                borderRadius: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: `linear-gradient(135deg, ${theme.palette[color].main}22 0%, ${theme.palette[color].light}44 100%)`,
                color: `${color}.main`,
              }}
            >
              {icon}
            </Box>
          </Box>
        </CardContent>
      </GlassCard>
    </motion.div>
  );
};

// Quick Action Button
const QuickActionButton = ({ icon, label, onClick, color = 'primary' }) => (
  <motion.div
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
  >
    <Button
      variant="outlined"
      onClick={onClick}
      sx={{
        borderRadius: 2,
        py: 1.5,
        px: 2,
        display: 'flex',
        flexDirection: 'column',
        gap: 0.5,
        borderColor: 'divider',
        '&:hover': {
          borderColor: `${color}.main`,
          backgroundColor: (theme) => alpha(theme.palette[color].main, 0.08),
        },
      }}
    >
      {React.cloneElement(icon, { sx: { fontSize: 24 } })}
      <Typography variant="caption" sx={{ fontWeight: 500 }}>{label}</Typography>
    </Button>
  </motion.div>
);

function AgentDashboard() {
  const [agentId, setAgentId] = useState('');
  const [agentName, setAgentName] = useState('');
  const [activeChats, setActiveChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const theme = useTheme();

  // Mock statistics
  const stats = {
    activeChats: 12,
    resolvedToday: 28,
    avgResponseTime: '2.5m',
    satisfaction: 4.8,
  };

  useEffect(() => {
    const storedAgentId = sessionStorage.getItem('agentId');
    const storedAgentName = sessionStorage.getItem('agentName');
    const isLoggedIn = sessionStorage.getItem('isAgentLoggedIn');

    if (!isLoggedIn || !storedAgentId) {
      window.location.hash = '#/agent-login';
      return;
    }

    setAgentId(storedAgentId);
    setAgentName(storedAgentName);
    fetchActiveChats();
    
    const interval = setInterval(fetchActiveChats, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchActiveChats = async () => {
    const mockChats = [
      {
        id: 'CONV_001',
        userId: 'user1@example.com',
        userName: 'John Doe',
        lastMessage: 'I want to check my account balance',
        timestamp: new Date(),
        unread: true,
        priority: 'high',
        status: 'pending',
        messages: [
          { sender: 'user', text: 'Hello, I need help', time: new Date(Date.now() - 60000) },
          { sender: 'bot', text: 'How can I assist you today?', time: new Date(Date.now() - 50000) },
          { sender: 'user', text: 'I want to check my account balance', time: new Date(Date.now() - 10000) }
        ]
      },
      {
        id: 'CONV_002',
        userId: 'user2@example.com',
        userName: 'Jane Smith',
        lastMessage: 'How do I apply for a home loan?',
        timestamp: new Date(Date.now() - 300000),
        unread: true,
        priority: 'medium',
        status: 'in_progress',
        messages: [
          { sender: 'user', text: 'Hi, I am interested in home loans', time: new Date(Date.now() - 400000) },
          { sender: 'bot', text: 'I can help with that.', time: new Date(Date.now() - 350000) },
          { sender: 'user', text: 'How do I apply for a home loan?', time: new Date(Date.now() - 300000) }
        ]
      },
      {
        id: 'CONV_003',
        userId: 'user3@example.com',
        userName: 'Mike Johnson',
        lastMessage: 'My card is not working',
        timestamp: new Date(Date.now() - 600000),
        unread: false,
        priority: 'urgent',
        status: 'pending',
        messages: [
          { sender: 'user', text: 'My ATM card is not working', time: new Date(Date.now() - 700000) },
          { sender: 'bot', text: 'Let me help you.', time: new Date(Date.now() - 650000) },
          { sender: 'user', text: 'It shows declined', time: new Date(Date.now() - 620000) },
          { sender: 'user', text: 'My card is not working', time: new Date(Date.now() - 600000) }
        ]
      },
      {
        id: 'CONV_004',
        userId: 'user4@example.com',
        userName: 'Sarah Wilson',
        lastMessage: 'Need to transfer money',
        timestamp: new Date(Date.now() - 900000),
        unread: false,
        priority: 'low',
        status: 'resolved',
        messages: [
          { sender: 'user', text: 'Can I transfer funds?', time: new Date(Date.now() - 950000) },
          { sender: 'agent', text: 'Yes, I can help you with that.', time: new Date(Date.now() - 900000) },
          { sender: 'user', text: 'Thank you!', time: new Date(Date.now() - 890000) }
        ]
      },
      {
        id: 'CONV_005',
        userId: 'user5@example.com',
        userName: 'David Lee',
        lastMessage: 'Question about statements',
        timestamp: new Date(Date.now() - 1200000),
        unread: true,
        priority: 'medium',
        status: 'pending',
        messages: [
          { sender: 'user', text: 'How do I get my statement?', time: new Date(Date.now() - 1200000) }
        ]
      }
    ];
    
    setActiveChats(mockChats);
    if (mockChats.length > 0 && !selectedChat) {
      setSelectedChat(mockChats[0]);
    }
    setIsLoading(false);
  };

  const handleLogout = () => {
    sessionStorage.clear();
    window.location.hash = '#/agent-login';
  };

  const handleSendReply = (e) => {
    e.preventDefault();
    if (!replyText.trim() || !selectedChat) return;

    const newMessage = {
      sender: 'agent',
      text: replyText,
      time: new Date()
    };

    const updatedChats = activeChats.map(chat => {
      if (chat.id === selectedChat.id) {
        return {
          ...chat,
          messages: [...chat.messages, newMessage],
          lastMessage: replyText,
          timestamp: new Date(),
          status: 'in_progress'
        };
      }
      return chat;
    });

    setActiveChats(updatedChats);
    setSelectedChat(updatedChats.find(c => c.id === selectedChat.id));
    setReplyText('');
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent': return 'error';
      case 'high': return 'warning';
      case 'medium': return 'info';
      default: return 'success';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'warning';
      case 'in_progress': return 'info';
      case 'resolved': return 'success';
      default: return 'default';
    }
  };

  const filteredChats = activeChats.filter(chat =>
    chat.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    chat.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const unreadCount = activeChats.filter(c => c.unread).length;
  const pendingCount = activeChats.filter(c => c.status === 'pending').length;

  if (isLoading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh',
        background: (theme) => theme.palette.background.default,
      }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <CircularProgress size={60} thickness={4} />
        </motion.div>
      </Box>
    );
  }

  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
    >
      <Box sx={{ 
        minHeight: '100vh', 
        background: (theme) => theme.palette.background.default,
      }}>
        {/* Modern App Bar */}
        <AppBar 
          position="static" 
          sx={{ 
            background: (theme) => theme.palette.gradient.primary,
            backdropFilter: 'blur(10px)',
          }}
        >
          <Toolbar sx={{ py: 1 }}>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'rgba(255,255,255,0.2)',
                  }}
                >
                  <AgentIcon sx={{ color: 'white' }} />
                </Box>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: 'white', lineHeight: 1.2 }}>
                    Agent Dashboard
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                    Banking AI Support Center
                  </Typography>
                </Box>
              </Box>
            </motion.div>

            <Box sx={{ flexGrow: 1 }} />

            {/* Stats in header */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Box sx={{ display: 'flex', gap: 3, mr: 3 }}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: 'white' }}>{stats.activeChats}</Typography>
                  <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)' }}>Active</Typography>
                </Box>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: '#69f0ae' }}>{stats.resolvedToday}</Typography>
                  <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)' }}>Resolved</Typography>
                </Box>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: 'white' }}>{stats.avgResponseTime}</Typography>
                  <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)' }}>Avg Response</Typography>
                </Box>
              </Box>
            </motion.div>

            {/* User info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{ textAlign: 'right' }}>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: 'white' }}>
                    {agentName}
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                    ID: {agentId}
                  </Typography>
                </Box>
                <Avatar 
                  sx={{ 
                    bgcolor: 'secondary.main', 
                    width: 42, 
                    height: 42,
                    border: '2px solid rgba(255,255,255,0.3)',
                  }}
                >
                  {agentName[0]}
                </Avatar>
                <Button 
                  color="inherit" 
                  startIcon={<LogoutIcon />}
                  onClick={handleLogout}
                  sx={{ 
                    color: 'white',
                    border: '1px solid rgba(255,255,255,0.3)',
                    borderRadius: 2,
                    '&:hover': {
                      bgcolor: 'rgba(255,255,255,0.1)',
                      borderColor: 'rgba(255,255,255,0.5)',
                    }
                  }}
                >
                  Logout
                </Button>
              </Box>
            </motion.div>
          </Toolbar>
        </AppBar>

        {/* Main Content */}
        <Box sx={{ display: 'flex', height: 'calc(100vh - 73px)' }}>
          {/* Chat List Sidebar */}
          <Box 
            sx={{ 
              width: 380, 
              borderRight: 1, 
              borderColor: 'divider', 
              bgcolor: 'background.paper',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {/* Search and filters */}
            <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Search conversations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  InputProps={{
                    startAdornment: <SearchIcon sx={{ color: 'text.secondary', mr: 1 }} />,
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      bgcolor: 'background.default',
                    },
                  }}
                />
              </motion.div>
              
              <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                <Chip 
                  label={`${unreadCount} Unread`} 
                  color="primary" 
                  size="small" 
                  variant="outlined"
                />
                <Chip 
                  label={`${pendingCount} Pending`} 
                  color="warning" 
                  size="small" 
                  variant="outlined"
                />
              </Box>
            </Box>

            {/* Chat List */}
            <Box sx={{ flex: 1, overflow: 'auto', p: 1 }}>
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {filteredChats.map((chat, index) => (
                  <motion.div
                    key={chat.id}
                    variants={itemVariants}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                  >
                    <ListItem disablePadding sx={{ mb: 1 }}>
                      <ListItemButton
                        selected={selectedChat?.id === chat.id}
                        onClick={() => setSelectedChat(chat)}
                        sx={{
                          borderRadius: 2,
                          border: '1px solid',
                          borderColor: selectedChat?.id === chat.id ? 'primary.main' : 'transparent',
                          bgcolor: selectedChat?.id === chat.id ? 'primary.main' + '15' : 'transparent',
                          '&.Mui-selected': {
                            bgcolor: 'primary.main' + '15',
                            '&:hover': {
                              bgcolor: 'primary.main' + '25',
                            },
                          },
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', gap: 1.5 }}>
                          <Badge
                            overlap="circular"
                            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                            badgeContent={
                              <Box 
                                sx={{ 
                                  width: 12, 
                                  height: 12, 
                                  borderRadius: '50%', 
                                  bgcolor: chat.unread ? 'primary.main' : 'success.main',
                                  border: '2px solid white'
                                }} 
                              />
                            }
                          >
                            <Avatar 
                              sx={{ 
                                bgcolor: chat.unread ? 'primary.main' : 'grey.400',
                                width: 48,
                                height: 48,
                              }}
                            >
                              {chat.userName[0]}
                            </Avatar>
                          </Badge>
                          <Box sx={{ flex: 1, minWidth: 0 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <Typography 
                                variant="body2" 
                                sx={{ fontWeight: chat.unread ? 700 : 500 }}
                              >
                                {chat.userName}
                              </Typography>
                              <Chip 
                                label={chat.priority} 
                                color={getPriorityColor(chat.priority)} 
                                size="small"
                                sx={{ height: 20, fontSize: '0.65rem' }}
                              />
                            </Box>
                            <Typography 
                              variant="caption" 
                              color="text.secondary"
                              sx={{ 
                                display: 'block',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                              }}
                            >
                              {chat.lastMessage}
                            </Typography>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 0.5 }}>
                              <Typography variant="caption" color="text.secondary">
                                {chat.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </Typography>
                              <Chip 
                                label={chat.status.replace('_', ' ')} 
                                color={getStatusColor(chat.status)} 
                                size="small"
                                sx={{ height: 18, fontSize: '0.6rem', textTransform: 'capitalize' }}
                              />
                            </Box>
                          </Box>
                        </Box>
                      </ListItemButton>
                    </ListItem>
                  </motion.div>
                ))}
              </motion.div>
            </Box>
          </Box>

          {/* Chat Area */}
          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', bgcolor: 'background.default' }}>
            {selectedChat ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                {/* Chat Header */}
                <Paper sx={{ p: 2, borderRadius: 0, borderBottom: 1, borderColor: 'divider' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar 
                        sx={{ 
                          bgcolor: 'primary.main',
                          width: 48,
                          height: 48,
                        }}
                      >
                        {selectedChat.userName[0]}
                      </Avatar>
                      <Box>
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                          {selectedChat.userName}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {selectedChat.userId} • {selectedChat.id}
                        </Typography>
                      </Box>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Tooltip title="Mark as resolved">
                        <IconButton color="success">
                          <CheckCircleIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Escalate">
                        <IconButton color="warning">
                          <WarningIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="More options">
                        <IconButton>
                          <MoreVertIcon />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Box>
                </Paper>

                {/* Messages */}
                <Box sx={{ flex: 1, overflow: 'auto', p: 3, bgcolor: 'background.default' }}>
                  <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    {selectedChat.messages.map((msg, index) => (
                      <motion.div
                        key={index}
                        variants={itemVariants}
                      >
                        <Box sx={{ 
                          display: 'flex', 
                          justifyContent: msg.sender === 'agent' ? 'flex-end' : 'flex-start',
                          mb: 2 
                        }}>
                          <Box
                            sx={{
                              maxWidth: '70%',
                              display: 'flex',
                              flexDirection: msg.sender === 'agent' ? 'row-reverse' : 'row',
                              gap: 1,
                            }}
                          >
                            <Avatar 
                              sx={{ 
                                width: 32, 
                                height: 32,
                                bgcolor: msg.sender === 'agent' ? 'secondary.main' : msg.sender === 'user' ? 'primary.main' : 'warning.main',
                                fontSize: '0.875rem',
                              }}
                            >
                              {msg.sender === 'user' ? selectedChat.userName[0] : msg.sender === 'agent' ? agentName[0] : 'AI'}
                            </Avatar>
                            <Paper
                              sx={{ 
                                p: 2, 
                                borderRadius: 3,
                                borderTopLeftRadius: msg.sender === 'user' ? 3 : 16,
                                borderTopRightRadius: msg.sender === 'agent' ? 3 : 16,
                                bgcolor: msg.sender === 'agent' 
                                  ? 'primary.main' 
                                  : msg.sender === 'user' 
                                    ? 'background.paper' 
                                    : 'warning.light',
                                color: msg.sender === 'agent' ? 'white' : 'text.primary',
                                boxShadow: 2,
                              }}
                            >
                              <Typography variant="body2" fontWeight={600} sx={{ mb: 0.5, opacity: 0.8 }}>
                                {msg.sender === 'user' ? selectedChat.userName : msg.sender === 'agent' ? agentName : 'AI Assistant'}
                              </Typography>
                              <Typography variant="body1">{msg.text}</Typography>
                              <Typography 
                                variant="caption" 
                                sx={{ 
                                  display: 'block', 
                                  mt: 1, 
                                  opacity: 0.7,
                                  textAlign: msg.sender === 'agent' ? 'right' : 'left',
                                }}
                              >
                                {msg.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </Typography>
                            </Paper>
                          </Box>
                        </Box>
                      </motion.div>
                    ))}
                  </motion.div>
                </Box>

                {/* Quick Actions */}
                <Box sx={{ px: 3, py: 1, borderTop: 1, borderColor: 'divider', bgcolor: 'background.paper' }}>
                  <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                    <QuickActionButton 
                      icon={<WalletIcon />} 
                      label="Check Balance" 
                      color="primary"
                    />
                    <QuickActionButton 
                      icon={<CreditCardIcon />} 
                      label="Card Issues" 
                      color="warning"
                    />
                    <QuickActionButton 
                      icon={<ReceiptIcon />} 
                      label="Statements" 
                      color="info"
                    />
                    <QuickActionButton 
                      icon={<PhoneIcon />} 
                      label="Call Back" 
                      color="success"
                    />
                  </Box>
                </Box>

                {/* Message Input */}
                <Paper 
                  component="form" 
                  onSubmit={handleSendReply} 
                  sx={{ 
                    p: 2, 
                    borderRadius: 0, 
                    borderTop: 1, 
                    borderColor: 'divider',
                    display: 'flex', 
                    gap: 2,
                    alignItems: 'center',
                  }}
                >
                  <TextField
                    fullWidth
                    size="small"
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Type your reply..."
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                      },
                    }}
                  />
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Button 
                      type="submit" 
                      variant="contained" 
                      disabled={!replyText.trim()}
                      sx={{ 
                        minWidth: 50,
                        borderRadius: 2,
                        px: 2,
                      }}
                    >
                      <SendIcon />
                    </Button>
                  </motion.div>
                </Paper>
              </motion.div>
            ) : (
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                height: '100%',
                flexDirection: 'column',
                gap: 2,
              }}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <MessageIcon sx={{ fontSize: 80, color: 'text.secondary', opacity: 0.3 }} />
                </motion.div>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <Typography color="text.secondary" variant="h6">
                    Select a chat to start responding
                  </Typography>
                </motion.div>
              </Box>
            )}
          </Box>
        </Box>
      </Box>
    </motion.div>
  );
}

export default AgentDashboard;

