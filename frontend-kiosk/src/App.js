import React, { useState, useEffect, useMemo } from 'react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import {
  Box,
  Container,
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  TextField,
  Grid,
  Paper,
  Alert,
  CircularProgress,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
  AppBar,
  Toolbar,
  Avatar,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Fade,
  Zoom,
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Chat as ChatIcon,
  AccountBalance as TransferIcon,
  AccountCircle as AccountIcon,
  Phone as VoiceIcon,
  Description as StatementIcon,
  Payment as BillIcon,
  CreditCard as CardIcon,
  MenuBook as ChequeIcon,
  Home as LoanIcon,
  QueuePlayNext as QueueIcon,
  AdminPanelSettings as AdminIcon,
  ArrowBack as ArrowBackIcon,
  Send as SendIcon,
  AttachMoney as MoneyIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Security as SecurityIcon,
} from '@mui/icons-material';

import { getTheme } from './theme';
import Layout from './components/Layout';
import DashboardWidgets, { StatsCards, ActivityFeed } from './components/DashboardWidgets';
import ChatService from './services/ChatService';
import TransferService from './services/TransferService';
import AccountService from './services/AccountService';
import VoiceService from './services/VoiceService';
import StatementService from './services/StatementService';
import BillPaymentService from './services/BillPaymentService';
import CardManagementService from './services/CardManagementService';
import ChequeBookService from './services/ChequeBookService';
import LoanService from './services/LoanService';
import QueueManagementService from './services/QueueManagementService';
import AccessibilitySettings from './pages/AccessibilitySettings';
import AdminDashboard from './pages/AdminDashboard';
import AgentLogin from './pages/AgentLogin';
import AgentDashboard from './pages/AgentDashboard';
import FaceAuth from './components/FaceAuth';

// Service card configurations
const serviceCards = [
  { id: 'chat', title: 'chat', desc: 'chatDesc', icon: <ChatIcon sx={{ fontSize: 40 }} /> },
  { id: 'transfer', title: 'transfer', desc: 'transferDesc', icon: <TransferIcon sx={{ fontSize: 40 }} /> },
  { id: 'account', title: 'account', desc: 'accountDesc', icon: <AccountIcon sx={{ fontSize: 40 }} /> },
  { id: 'voice', title: 'voice', desc: 'voiceDesc', icon: <VoiceIcon sx={{ fontSize: 40 }} /> },
  { id: 'statement', title: 'statement', desc: 'statementDesc', icon: <StatementIcon sx={{ fontSize: 40 }} /> },
  { id: 'bill-pay', title: 'bill', desc: 'billDesc', icon: <BillIcon sx={{ fontSize: 40 }} /> },
  { id: 'card', title: 'card', desc: 'cardDesc', icon: <CardIcon sx={{ fontSize: 40 }} /> },
  { id: 'cheque', title: 'cheque', desc: 'chequeDesc', icon: <ChequeIcon sx={{ fontSize: 40 }} /> },
  { id: 'loan', title: 'loan', desc: 'loanDesc', icon: <LoanIcon sx={{ fontSize: 40 }} /> },
  { id: 'queue', title: 'queue', desc: 'queueDesc', icon: <QueueIcon sx={{ fontSize: 40 }} /> },
];

// Animation variants
const pageVariants = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.95 },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.4,
    },
  }),
};

function App() {
  // Dark/Light mode state
  const [darkMode, setDarkMode] = useState(false);
  
  // Get theme based on darkMode
  const theme = useMemo(() => getTheme(darkMode), [darkMode]);

  // Simple hash-based routing
  const [currentRoute, setCurrentRoute] = useState(window.location.hash.replace('#/', '') || '');
  
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#/', '') || '';
      setCurrentRoute(hash);
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);
  
  // Authentication states
  const [authStep, setAuthStep] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [userRole, setUserRole] = useState('customer');
  const [sessionToken, setSessionToken] = useState(null);
  const [sessionExpiry, setSessionExpiry] = useState(null);
  
  // User profile data
  const [userProfile, setUserProfile] = useState({
    capturedFace: null,
    customerId: 'CUS' + Math.random().toString(36).substr(2, 8).toUpperCase(),
    accountNumber: '5' + Math.floor(1000000000 + Math.random() * 9000000000),
    accountType: 'Savings',
    balance: 15750.50,
    branch: 'Main Branch'
  });

  // UI states
  const [currentService, setCurrentService] = useState(null);
  const [showAccessibility, setShowAccessibility] = useState(false);
  const [language, setLanguage] = useState('en');

  // Accessibility states
  const [accessibility, setAccessibility] = useState({
    largeText: false,
    highContrast: false,
    simplifiedUI: false,
    voiceGuidance: false,
    fontSize: 'normal'
  });

  // Session timeout effect
  useEffect(() => {
    if (sessionExpiry) {
      const checkTimeout = setInterval(() => {
        const now = new Date().getTime();
        if (now > sessionExpiry) {
          handleLogout('Session expired. Please login again.');
          clearInterval(checkTimeout);
        }
      }, 60000);
      return () => clearInterval(checkTimeout);
    }
  }, [sessionExpiry]);

  const translations = {
    en: {
      title: 'Banking AI Self-Service Platform',
      welcome: 'Welcome to the future of banking',
      login: 'Login',
      email: 'Email',
      password: 'Password',
      enterEmail: 'Enter your email',
      enterPassword: 'Enter your password',
      loginBtn: 'Login',
      demo: 'Demo: Use any email/password',
      otp: 'OTP Verification',
      enterOtp: 'Enter 6-digit OTP sent to your email',
      verifyOtp: 'Verify OTP',
      biometric: 'Biometric Authentication',
      authenticate: 'Authenticate',
      logout: 'Logout',
      backServices: '← Back to Services',
      selectService: 'Select a service below or click on any card',
      chat: 'Chat Support',
      chatDesc: 'Talk to our AI assistant',
      transfer: 'Transfers',
      transferDesc: 'Send money instantly',
      account: 'Account Info',
      accountDesc: 'Check your balance',
      voice: 'Voice Call',
      voiceDesc: 'Call our support team',
      statement: 'Statements',
      statementDesc: 'Mini statements & history',
      bill: 'Bill Payments',
      billDesc: 'Pay bills online',
      card: 'Card Management',
      cardDesc: 'Block, reissue cards',
      cheque: 'Cheque Book',
      chequeDesc: 'Request cheque books',
      loan: 'Loan Services',
      loanDesc: 'Check eligibility & apply',
      queue: 'Queue System',
      queueDesc: 'Get branch token',
      admin: 'Admin Dashboard',
      adminDesc: 'View analytics & reports',
    },
    hi: {
      title: 'बैंकिंग AI सेल्फ-सर्विस प्लेटफॉर्म',
      welcome: 'बैंकिंग के भविष्य में आपका स्वागत है',
      login: 'लॉगिन',
      email: 'ईमेल',
      password: 'पासवर्ड',
      enterEmail: 'अपना ईमेल दर्ज करें',
      enterPassword: 'अपना पासवर्ड दर्ज करें',
      loginBtn: 'लॉगिन करें',
      demo: 'डेमो: कोई भी ईमेल/पासवर्ड दर्ज करें',
      otp: 'OTP सत्यापन',
      enterOtp: 'अपने ईमेल पर भेजा गया 6-अंकीय OTP दर्ज करें',
      verifyOtp: 'OTP सत्यापित करें',
      biometric: 'बायोमेट्रिक प्रमाणीकरण',
      authenticate: 'प्रमाणीकरण',
      logout: 'लॉगआउट',
      backServices: '← सेवाओं पर वापस जाएं',
      selectService: 'नीचे कोई सेवा चुनें या कोई कार्ड क्लिक करें',
      chat: 'चैट सहायता',
      chatDesc: 'हमारे AI सहायक से बात करें',
      transfer: 'हस्तांतरण',
      transferDesc: 'तुरंत पैसा भेजें',
      account: 'खाता जानकारी',
      accountDesc: 'अपना शेष जांचें',
      voice: 'वॉइस कॉल',
      voiceDesc: 'हमारी सहायता टीम को कॉल करें',
      statement: 'विवरण',
      statementDesc: 'मिनी स्टेटमेंट और इतिहास',
      bill: 'बिल भुगतान',
      billDesc: 'ऑनलाइन बिल भुगतान करें',
      card: 'कार्ड प्रबंधन',
      cardDesc: 'कार्ड ब्लॉक करें या पुनः जारी करें',
      cheque: 'चेक बुक',
      chequeDesc: 'चेक बुक का अनुरोध करें',
      loan: 'ऋण सेवाएं',
      loanDesc: 'पात्रता जांचें और आवेदन करें',
      queue: 'कतार प्रणाली',
      queueDesc: 'शाखा टोकन प्राप्त करें',
      admin: 'प्रशासक डैशबोर्ड',
      adminDesc: 'विश्लेषण और रिपोर्ट देखें',
    }
  };

  const t = translations[language];

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/auth/request-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      
      let data;
      try {
        const text = await response.text();
        data = JSON.parse(text);
      } catch (jsonError) {
        console.log('Backend not available, using demo mode');
        const demoOtp = '123456';
        alert(`Demo Mode: Your OTP is ${demoOtp}`);
        console.log(`[Demo] OTP for ${email}: ${demoOtp}`);
        setAuthStep('otp');
        return;
      }
      
      if (data.success || response.ok) {
        if (data.debugOtp) {
          alert(`Demo Mode: Your OTP is ${data.debugOtp}\n(Also check console for logged OTP)`);
          console.log(`[Demo] OTP for ${email}: ${data.debugOtp}`);
        }
        setAuthStep('otp');
      } else {
        alert(data.message || 'Invalid email');
      }
    } catch (error) {
      console.log('Network error, using demo mode:', error.message);
      const demoOtp = '123456';
      alert(`Demo Mode: Your OTP is ${demoOtp}`);
      console.log(`[Demo] OTP for ${email}: ${demoOtp}`);
      setAuthStep('otp');
    }
  };

  const handleOtpVerify = async (e) => {
    e.preventDefault();
    if (otp === '123456' || otp.length === 6) {
      setSessionToken('demo-session-' + Date.now());
      setSessionExpiry(new Date().getTime() + 30 * 60 * 1000);
      setUserRole('customer');
      setAuthStep('biometric');
      return;
    }
    
    try {
      const response = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp })
      });
      
      let data;
      try {
        const text = await response.text();
        data = JSON.parse(text);
      } catch (jsonError) {
        setSessionToken('demo-session-' + Date.now());
        setSessionExpiry(new Date().getTime() + 30 * 60 * 1000);
        setUserRole('customer');
        setAuthStep('biometric');
        return;
      }
      
      if (data.success || response.ok) {
        setSessionToken(data.token || 'session-' + Date.now());
        setSessionExpiry(new Date().getTime() + 30 * 60 * 1000);
        setUserRole(data.role || 'customer');
        setAuthStep('biometric');
      } else {
        alert(data.message || 'Invalid OTP');
      }
    } catch (error) {
      setSessionToken('demo-session-' + Date.now());
      setSessionExpiry(new Date().getTime() + 30 * 60 * 1000);
      setUserRole('customer');
      setAuthStep('biometric');
    }
  };

  const handleBiometric = async (e) => {
    e.preventDefault();
    setAuthStep('authenticated');
    setCurrentService(null);
  };

  const handleLogout = (message = null) => {
    setAuthStep('login');
    setEmail('');
    setPassword('');
    setOtp('');
    setCurrentService(null);
    setSessionToken(null);
    setSessionExpiry(null);
    if (message) alert(message);
  };

  const isLoggedIn = authStep === 'authenticated';

  // Render based on route
  const renderContent = () => {
    switch (currentRoute) {
      case 'agent-login':
        return <AgentLogin />;
      case 'agent-dashboard':
        const isAgentLoggedIn = sessionStorage.getItem('isAgentLoggedIn');
        if (!isAgentLoggedIn) {
          window.location.hash = '#/agent-login';
          return <AgentLogin />;
        }
        return <AgentDashboard />;
      default:
        return renderCustomerApp();
    }
  };

  const renderServiceCard = (service, index) => (
    <Grid item xs={12} sm={6} md={4} key={service.id}>
      <motion.div
        custom={index}
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        whileHover={{ scale: 1.03, y: -5 }}
        whileTap={{ scale: 0.98 }}
      >
        <Card
          sx={{
            height: '100%',
            cursor: 'pointer',
            bgcolor: 'background.paper',
            border: '1px solid',
            borderColor: 'divider',
            boxShadow: 2,
            transition: 'all 0.3s ease-in-out',
            '&:hover': {
              borderColor: 'primary.main',
              boxShadow: 6,
            },
          }}
          onClick={() => setCurrentService(service.id)}
        >
          <CardContent sx={{ textAlign: 'center', py: 4 }}>
            <motion.div
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <Box sx={{ color: 'primary.main', mb: 2 }}>
                {service.icon}
              </Box>
            </motion.div>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
              {t[service.title]}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {t[service.desc]}
            </Typography>
          </CardContent>
        </Card>
      </motion.div>
    </Grid>
  );

  const renderCustomerApp = () => (
    <>
      {/* Login Step */}
      {authStep === 'login' && (
        <Container maxWidth="sm" sx={{ mt: 8 }}>
          <motion.div
            initial="initial"
            animate="animate"
            variants={pageVariants}
          >
            <Paper 
              elevation={4} 
              sx={{ 
                p: 5, 
                borderRadius: 4,
                background: theme.palette.mode === 'dark' 
                  ? 'linear-gradient(180deg, #111d32 0%, #0a1628 100%)'
                  : 'linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)',
              }}>
              <Box sx={{ textAlign: 'center', mb: 4 }}>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
                >
                  <Avatar 
                    sx={{ 
                      bgcolor: 'primary.main', 
                      width: 80, 
                      height: 80, 
                      m: '0 auto', 
                      mb: 2,
                      boxShadow: '0 8px 24px rgba(30, 58, 95, 0.3)',
                    }}
                  >
                    <SecurityIcon sx={{ fontSize: 40 }} />
                  </Avatar>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>
                    {t.login}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {t.welcome}
                  </Typography>
                </motion.div>
              </Box>
              
              <motion.form
                onSubmit={handleLogin}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <TextField
                  fullWidth
                  label={t.email}
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t.enterEmail}
                  required
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label={t.password}
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t.enterPassword}
                  required
                  sx={{ mb: 3 }}
                />
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  size="large"
                  sx={{ mb: 2 }}
                >
                  {t.loginBtn}
                </Button>
              </motion.form>
              
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <Alert severity="info" sx={{ mb: 3 }}>
                  {t.demo}
                </Alert>
              </motion.div>
              
              <Divider sx={{ my: 2 }} />
              
              <Box sx={{ textAlign: 'center' }}>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    variant="outlined"
                    startIcon={<AdminIcon />}
                    href="#/agent-login"
                    fullWidth
                  >
                    Agent Login
                  </Button>
                </motion.div>
              </Box>
            </Paper>
          </motion.div>
        </Container>
      )}

      {/* OTP Step */}
      {authStep === 'otp' && (
        <Container maxWidth="sm" sx={{ mt: 8 }}>
          <motion.div
            initial="initial"
            animate="animate"
            variants={pageVariants}
          >
            <Paper 
              elevation={4} 
              sx={{ 
                p: 5, 
                borderRadius: 4,
                background: theme.palette.mode === 'dark' 
                  ? 'linear-gradient(180deg, #111d32 0%, #0a1628 100%)'
                  : 'linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)',
              }}
            >
              <Box sx={{ textAlign: 'center', mb: 4 }}>
                <Avatar 
                  sx={{ 
                    bgcolor: 'secondary.main', 
                    width: 80, 
                    height: 80, 
                    m: '0 auto', 
                    mb: 2,
                    boxShadow: '0 8px 24px rgba(0, 200, 83, 0.3)',
                  }}
                >
                  <SecurityIcon sx={{ fontSize: 40 }} />
                </Avatar>
                <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>
                  {t.otp}
                </Typography>
              </Box>
              
              <form onSubmit={handleOtpVerify}>
                <TextField
                  fullWidth
                  label={t.enterOtp}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  placeholder="000000"
                  inputProps={{ maxLength: 6 }}
                  required
                  sx={{ mb: 3 }}
                />
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  size="large"
                  color="secondary"
                >
                  {t.verifyOtp}
                </Button>
              </form>
            </Paper>
          </motion.div>
        </Container>
      )}

      {/* Biometric Step */}
      {authStep === 'biometric' && (
        <Container maxWidth="sm" sx={{ mt: 8 }}>
          <motion.div
            initial="initial"
            animate="animate"
            variants={pageVariants}
          >
            <Paper 
              elevation={4} 
              sx={{ 
                p: 5, 
                borderRadius: 4,
                background: theme.palette.mode === 'dark' 
                  ? 'linear-gradient(180deg, #111d32 0%, #0a1628 100%)'
                  : 'linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)',
              }}
            >
              <Box sx={{ textAlign: 'center', mb: 4 }}>
                <Avatar 
                  sx={{ 
                    bgcolor: 'success.main', 
                    width: 80, 
                    height: 80, 
                    m: '0 auto', 
                    mb: 2,
                    boxShadow: '0 8px 24px rgba(0, 200, 83, 0.3)',
                  }}
                >
                  <SecurityIcon sx={{ fontSize: 40 }} />
                </Avatar>
                <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>
                  {t.biometric}
                </Typography>
              </Box>
              
              <FaceAuth onSuccess={() => {
                setAuthStep('authenticated');
                setCurrentService(null);
              }} />
            </Paper>
          </motion.div>
        </Container>
      )}

      {/* Authenticated - Dashboard View */}
      {isLoggedIn && (
        <>
          {currentService === 'admin' && userRole === 'admin' ? (
            <Box>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <Button
                  startIcon={<ArrowBackIcon />}
                  onClick={() => setCurrentService(null)}
                  sx={{ mb: 3 }}
                >
                  {t.backServices}
                </Button>
              </motion.div>
              <AdminDashboard />
            </Box>
          ) : currentService ? (
            <Box>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <Button
                  startIcon={<ArrowBackIcon />}
                  onClick={() => setCurrentService(null)}
                  sx={{ mb: 3 }}
                >
                  {t.backServices}
                </Button>
              </motion.div>
              
              {currentService === 'chat' && <ChatService email={email} />}
              {currentService === 'transfer' && <TransferService email={email} />}
              {currentService === 'account' && <AccountService email={email} />}
              {currentService === 'voice' && <VoiceService email={email} />}
              {currentService === 'statement' && <StatementService email={email} />}
              {currentService === 'bill-pay' && <BillPaymentService email={email} />}
              {currentService === 'card' && <CardManagementService email={email} />}
              {currentService === 'cheque' && <ChequeBookService email={email} />}
              {currentService === 'loan' && <LoanService email={email} />}
              {currentService === 'queue' && <QueueManagementService email={email} />}
            </Box>
          ) : (
            <Box sx={{ maxWidth: 1400, margin: '0 auto' }}>
              {/* NEW: Dashboard Widgets Section */}
              <DashboardWidgets 
                email={email} 
                balance={userProfile.balance}
                onServiceClick={(serviceId) => setCurrentService(serviceId)}
              />
              
              {/* EXISTING: Services Section */}
              <Box sx={{ mt: 3 }}>
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, mb: 1 }}>
                    Our Services
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                    {t.selectService}
                  </Typography>
                </motion.div>
              </Box>
              
              <Grid container spacing={2}>
                {serviceCards.map((service, index) => renderServiceCard(service, index))}
              </Grid>
              
              {userRole === 'admin' && (
                <Box sx={{ mt: 4 }}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
                      Administration
                    </Typography>
                  </motion.div>
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6} md={4}>
                      <motion.div
                        variants={cardVariants}
                        initial="hidden"
                        animate="visible"
                        custom={0}
                        whileHover={{ scale: 1.03, y: -5 }}
                      >
                        <Card
                          sx={{
                            cursor: 'pointer',
                            bgcolor: 'background.paper',
                            border: '1px solid',
                            borderColor: 'divider',
                            '&:hover': { borderColor: 'secondary.main', boxShadow: 6 },
                          }}
                          onClick={() => setCurrentService('admin')}
                        >
                          <CardContent sx={{ textAlign: 'center', py: 4 }}>
                            <Box sx={{ color: 'secondary.main', mb: 2 }}>
                              <AdminIcon sx={{ fontSize: 40 }} />
                            </Box>
                            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                              {t.admin}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {t.adminDesc}
                            </Typography>
                          </CardContent>
                        </Card>
                      </motion.div>
                    </Grid>
                  </Grid>
                </Box>
              )}
            </Box>
          )}
        </>
      )}

      {showAccessibility && (
        <AccessibilitySettings 
          accessibility={accessibility}
          setAccessibility={setAccessibility}
          onClose={() => setShowAccessibility(false)}
        />
      )}
    </>
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {isLoggedIn ? (
        <Layout
          currentService={currentService}
          setCurrentService={setCurrentService}
          userRole={userRole}
          email={email}
          onLogout={() => handleLogout()}
          showAccessibility={showAccessibility}
          setShowAccessibility={setShowAccessibility}
          language={language}
          setLanguage={setLanguage}
          t={t}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
        >
          {renderContent()}
        </Layout>
      ) : (
        renderContent()
      )}
    </ThemeProvider>
  );
}

export default App;

