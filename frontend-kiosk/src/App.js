import React, { useState, useEffect } from 'react';
import './App.css';
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
import './styles/AccessibilitySettings.css';
import './styles/AdminDashboard.css';
import './styles/LoanService.css';
import './styles/QueueManagementService.css';

function App() {
  // Simple hash-based routing
  const [currentRoute, setCurrentRoute] = useState(window.location.hash.replace('#/', '') || '');
  
  // Listen for hash changes
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#/', '') || '';
      setCurrentRoute(hash);
    };
    
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);
  
  // Authentication states
  const [authStep, setAuthStep] = useState('login'); // login, otp, biometric, authenticated
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [userRole, setUserRole] = useState('customer');
  const [sessionToken, setSessionToken] = useState(null);
  const [sessionExpiry, setSessionExpiry] = useState(null);
  
  // User profile data (captured during authentication)
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
      }, 60000); // Check every minute
      return () => clearInterval(checkTimeout);
    }
  }, [sessionExpiry]);

  const translations = {
    en: {
      title: '🏦 Banking AI Self-Service Platform',
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
      adminDesc: 'View analytics & reports'
    },
    hi: {
      title: '🏦 बैंकिंग AI सेल्फ-सर्विस प्लेटफॉर्म',
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
      adminDesc: 'विश्लेषण और रिपोर्ट देखें'
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
        // Read response text first
        const text = await response.text();
        // Try to parse as JSON
        data = JSON.parse(text);
      } catch (jsonError) {
        // Handle non-JSON responses - use demo mode
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
      // Network error - use demo mode
      console.log('Network error, using demo mode:', error.message);
      const demoOtp = '123456';
      alert(`Demo Mode: Your OTP is ${demoOtp}`);
      console.log(`[Demo] OTP for ${email}: ${demoOtp}`);
      setAuthStep('otp');
    }
  };

  const handleOtpVerify = async (e) => {
    e.preventDefault();
    // Demo mode: accept any 6-digit OTP
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
        // Read response text first
        const text = await response.text();
        // Try to parse as JSON
        data = JSON.parse(text);
      } catch (jsonError) {
        // Handle non-JSON responses - use demo mode
        console.log('Backend not available, using demo mode');
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
      // Network error - use demo mode
      console.log('Network error, using demo mode');
      setSessionToken('demo-session-' + Date.now());
      setSessionExpiry(new Date().getTime() + 30 * 60 * 1000);
      setUserRole('customer');
      setAuthStep('biometric');
    }
  };

  const handleBiometric = async (e) => {
    e.preventDefault();
    // Demo mode - always succeed when backend is not available
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

  const appClassName = `App ${accessibility.largeText ? 'accessibility-large-text' : ''} ${accessibility.highContrast ? 'accessibility-high-contrast' : ''} ${accessibility.simplifiedUI ? 'accessibility-simplify-ui' : ''}`;

  const fontSizeStyle = {
    fontSize: accessibility.fontSize === 'large' ? '18px' : accessibility.fontSize === 'xl' ? '20px' : '16px'
  };

  // Render based on route
  const renderContent = () => {
    switch (currentRoute) {
      case 'agent-login':
        return <AgentLogin />;
      case 'agent-dashboard':
        // Check if agent is logged in
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

  const renderCustomerApp = () => (
    <>
      <main className="App-main">
        {authStep === 'login' && (
          <div className="login-container">
            <h2>{t.login}</h2>
            <form onSubmit={handleLogin}>
              <div className="form-group">
                <label>{t.email}:</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t.enterEmail}
                  required
                />
              </div>
              <div className="form-group">
                <label>{t.password}:</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t.enterPassword}
                  required
                />
              </div>
              <button type="submit" className="btn-primary">{t.loginBtn}</button>
            </form>
            <p className="demo-note">{t.demo}</p>
            <div className="agent-link-container">
              <a href="#/agent-login" className="agent-link">👨‍💼 Agent Login</a>
            </div>
          </div>
        )}

        {authStep === 'otp' && (
          <div className="login-container">
            <h2>{t.otp}</h2>
            <form onSubmit={handleOtpVerify}>
              <div className="form-group">
                <label>{t.enterOtp}</label>
                <input
                  type="text"
                  maxLength="6"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  placeholder="000000"
                  required
                />
              </div>
              <button type="submit" className="btn-primary">{t.verifyOtp}</button>
            </form>
          </div>
        )}

{authStep === 'biometric' && (
          <div className="login-container">
            <h2>{t.biometric}</h2>
            <FaceAuth onSuccess={() => {
              setAuthStep('authenticated');
              setCurrentService(null);
            }} />
          </div>
        )}

        {isLoggedIn && (
          <div className="dashboard-container">
            <div className="dashboard-header">
              <div>
                <h2>Welcome, {email}!</h2>
                <p style={{ color: '#999', fontSize: '13px', margin: '5px 0 0 0' }}>
                  Role: {userRole === 'admin' ? 'Administrator' : 'Customer'} | Session expires in 30 min
                </p>
              </div>
              <button onClick={() => handleLogout()} className="btn-logout">{t.logout}</button>
            </div>

            {currentService === 'admin' && userRole === 'admin' ? (
              <div className="service-detail">
                <button 
                  onClick={() => setCurrentService(null)} 
                  className="btn-back"
                >
                  {t.backServices}
                </button>
                <AdminDashboard />
              </div>
            ) : currentService ? (
              <div className="service-detail">
                <button 
                  onClick={() => setCurrentService(null)} 
                  className="btn-back"
                >
                  {t.backServices}
                </button>
                
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
              </div>
            ) : (
              <div className="services-view">
                <p className="services-subtitle">{t.selectService}</p>
                <div className="services-grid">
                  <div className="service-card clickable" onClick={() => setCurrentService('chat')}>
                    <div className="service-icon">💬</div>
                    <h3>{t.chat}</h3>
                    <p>{t.chatDesc}</p>
                  </div>
                  <div className="service-card clickable" onClick={() => setCurrentService('transfer')}>
                    <div className="service-icon">💰</div>
                    <h3>{t.transfer}</h3>
                    <p>{t.transferDesc}</p>
                  </div>
                  <div className="service-card clickable" onClick={() => setCurrentService('account')}>
                    <div className="service-icon">📊</div>
                    <h3>{t.account}</h3>
                    <p>{t.accountDesc}</p>
                  </div>
                  <div className="service-card clickable" onClick={() => setCurrentService('voice')}>
                    <div className="service-icon">📞</div>
                    <h3>{t.voice}</h3>
                    <p>{t.voiceDesc}</p>
                  </div>
                  <div className="service-card clickable" onClick={() => setCurrentService('statement')}>
                    <div className="service-icon">📋</div>
                    <h3>{t.statement}</h3>
                    <p>{t.statementDesc}</p>
                  </div>
                  <div className="service-card clickable" onClick={() => setCurrentService('bill-pay')}>
                    <div className="service-icon">💳</div>
                    <h3>{t.bill}</h3>
                    <p>{t.billDesc}</p>
                  </div>
                  <div className="service-card clickable" onClick={() => setCurrentService('card')}>
                    <div className="service-icon">🎫</div>
                    <h3>{t.card}</h3>
                    <p>{t.cardDesc}</p>
                  </div>
                  <div className="service-card clickable" onClick={() => setCurrentService('cheque')}>
                    <div className="service-icon">📄</div>
                    <h3>{t.cheque}</h3>
                    <p>{t.chequeDesc}</p>
                  </div>
                  <div className="service-card clickable" onClick={() => setCurrentService('loan')}>
                    <div className="service-icon">🏠</div>
                    <h3>{t.loan}</h3>
                    <p>{t.loanDesc}</p>
                  </div>
                  <div className="service-card clickable" onClick={() => setCurrentService('queue')}>
                    <div className="service-icon">🎟️</div>
                    <h3>{t.queue}</h3>
                    <p>{t.queueDesc}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {showAccessibility && (
        <AccessibilitySettings 
          accessibility={accessibility}
          setAccessibility={setAccessibility}
          onClose={() => setShowAccessibility(false)}
        />
      )}

      <footer className="App-footer">
        <p>APIs: Gateway (5000) | Auth (5001) | Chat (5002) | Transactions (5003) | Analytics (5004) | Voice (5005)</p>
      </footer>
    </>
  );

  return (
    <div className={appClassName} style={fontSizeStyle}>
      <header className="App-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
          <div>
            <h1>{t.title}</h1>
            <p>{t.welcome}</p>
          </div>
          {isLoggedIn && (
            <div style={{ display: 'flex', gap: '10px' }}>
              <select 
                value={language} 
                onChange={(e) => setLanguage(e.target.value)}
                style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ddd', cursor: 'pointer' }}
              >
                <option value="en">English</option>
                <option value="hi">हिंदी</option>
              </select>
              <button 
                onClick={() => setShowAccessibility(true)}
                style={{ padding: '8px 16px', background: '#667eea', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: '600' }}
              >
                ♿ {t.biometric}
              </button>
              {userRole === 'admin' && (
                <button 
                  onClick={() => setCurrentService('admin')}
                  style={{ padding: '8px 16px', background: '#764ba2', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: '600' }}
                >
                  📊 Admin
                </button>
              )}
            </div>
          )}
        </div>
      </header>

      {renderContent()}
    </div>
  );
}

export default App;

