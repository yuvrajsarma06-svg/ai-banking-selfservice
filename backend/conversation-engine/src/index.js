const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5002;

app.use(cors());
app.use(express.json());

// Mock data
const conversations = new Map();
const agents = [
  { id: 'AGENT001', name: 'John Smith', status: 'available', specialization: 'loans' },
  { id: 'AGENT002', name: 'Sarah Johnson', status: 'available', specialization: 'accounts' },
  { id: 'AGENT003', name: 'Mike Williams', status: 'busy', specialization: 'general' }
];

const escalationQueue = [];
const tokenQueue = [];

// Banking services menu
const servicesMenu = `
📋 AVAILABLE SERVICES:

1. 💰 Transfers - Send money to any account
2. 📊 Account Balance - Check your account balance
3. 📋 Mini Statement - View recent transactions
4. 💳 Bill Payments - Pay your bills online
5. 🎫 Card Management - Block/reissue cards
6. 📄 Cheque Book - Request cheque book
7. 🏠 Loan Services - Check eligibility & apply
8. 🎟️ Queue Token - Get branch queue token
9. 💬 Chat with Agent - Talk to a human agent

Simply type the service name or number you'd like to use!`;

// Enhanced NLU Intent Detection with comprehensive banking knowledge
const detectIntent = (message) => {
  const msg = message.toLowerCase();

  // Transfer related
  if (msg.includes('transfer') || msg.includes('send money') || msg.includes('neft') || msg.includes('rtgs') || msg.includes('imap') || msg.includes('upi')) {
    return 'transfer';
  }

  // Account Balance
  if (msg.includes('balance') || msg.includes('account balance') || msg.includes('how much') || msg.includes('funds') || msg.includes('money in')) {
    return 'balance';
  }

  // Mini Statement / Transactions
  if (msg.includes('statement') || msg.includes('transaction') || msg.includes('history') || msg.includes('passbook') || msg.includes('recent') || msg.includes('last')) {
    return 'statement';
  }

  // Bill Payments
  if (msg.includes('bill') || msg.includes('payment') || msg.includes('pay') || msg.includes('electricity') || msg.includes('water') || msg.includes('gas')) {
    return 'bill_payment';
  }

  // Card Management
  if (msg.includes('card') || msg.includes('debit') || msg.includes('credit') || msg.includes('atm') || msg.includes('block') || msg.includes('reissue') || msg.includes('limit')) {
    return 'card';
  }

  // Cheque Book
  if (msg.includes('cheque') || msg.includes('check') || msg.includes('chek') || msg.includes('leaf')) {
    return 'cheque';
  }

  // Loans
  if (msg.includes('loan') || msg.includes('borrow') || msg.includes('credit') || msg.includes('mortgage') || msg.includes('personal loan') || msg.includes('home loan') || msg.includes('car loan') || msg.includes('education loan') || msg.includes('eligibility')) {
    return 'loan';
  }

  // Queue Token
  if (msg.includes('queue') || msg.includes('token') || msg.includes('appointment') || msg.includes('branch') || msg.includes('visit')) {
    return 'queue';
  }

  // Voice Call
  if (msg.includes('call') || msg.includes('phone') || msg.includes('voice') || msg.includes('speak to')) {
    return 'voice';
  }

  // Account Info
  if (msg.includes('account') || msg.includes('details') || msg.includes('profile') || msg.includes('kyc') || msg.includes('update')) {
    return 'account';
  }

  // Fraud/Security
  if (msg.includes('fraud') || msg.includes('suspicious') || msg.includes('scam') || msg.includes('unauthorized') || msg.includes('lost') || msg.includes('stolen') || msg.includes('secure') || msg.includes('password') || msg.includes('pin')) {
    return 'fraud';
  }

  // Greetings
  if (msg.includes('hello') || msg.includes('hi') || msg.includes('hey') || msg.includes('good morning') || msg.includes('good afternoon') || msg.includes('good evening') || msg.includes('start') || msg.includes('begin')) {
    return 'greeting';
  }

  // Thank you
  if (msg.includes('thank') || msg.includes('thanks') || msg.includes('appreciate')) {
    return 'thanks';
  }

  // Goodbye
  if (msg.includes('bye') || msg.includes('goodbye') || msg.includes('quit') || msg.includes('exit') || msg.includes('stop')) {
    return 'goodbye';
  }

  // Agent/Human help
  if (msg.includes('agent') || msg.includes('human') || msg.includes('representative') || msg.includes('executive') || msg.includes('manager') || msg.includes('supervisor')) {
    return 'escalate';
  }

  // Help
  if (msg.includes('help') || msg.includes('what can you do') || msg.includes('services')) {
    return 'help';
  }

  return 'general';
};

// Generate response based on intent
const generateResponse = (intent, message) => {
  switch (intent) {
    case 'greeting':
      return `Hello! Welcome to our Banking AI Assistant! 🏦

${servicesMenu}

How may I assist you today?`;

    case 'help':
      return `I can help you with the following services:

${servicesMenu}

Just tell me what you'd like to do!`;

    case 'transfer':
      return `💰 Money Transfer Service

You can transfer money through:
• UPI - Instant transfer up to ₹1 lakh
• NEFT - 24x7 transfer
• RTGS - For large amounts above ₹2 lakh
• IMPS - Immediate payment

To proceed, please tell me:
1. Amount you want to transfer
2. Recipient's account number or UPI ID

Would you like to continue?`;

    case 'balance':
      return `📊 Account Balance Service

Your linked account details:
• Account Number: XXXXX1234
• Current Balance: ₹15,750.50
• Available Balance: ₹15,750.50
• Last Transaction: Credit of ₹5,000 on ${new Date().toLocaleDateString()}

Would you like to see a mini statement or perform any other transaction?`;

    case 'statement':
      return `📋 Mini Statement - Last 5 Transactions:

1. 📥 Cr - UPI from VIRTUAL_ID - ₹5,000 (${new Date().toLocaleDateString()})
2. 📤 Dr - ATM Withdrawal - ₹10,000 (${new Date(Date.now() - 86400000).toLocaleDateString()})
3. 📥 Cr - Salary Credit - ₹75,000 (${new Date(Date.now() - 172800000).toLocaleDateString()})
4. 📤 Dr - Bill Payment (Electricity) - ₹1,500 (${new Date(Date.now() - 259200000).toLocaleDateString()})
5. 📥 Cr - Refund from Amazon - ₹2,500 (${new Date(Date.now() - 345600000).toLocaleDateString()})

Would you like more details or perform any other transaction?`;

    case 'bill_payment':
      return `💳 Bill Payment Service

You can pay:
1. 📱 Mobile Recharge - Prepaid/Postpaid
2. ⚡ Electricity Bill
3. 💧 Water Bill
4. 🔥 Gas Bill
5. 📺 DTH / Cable TV
6. 📞 Landline / Broadband
7. 🏥 Insurance Premium
8. 📝 Credit Card Bill

Which bill would you like to pay?`;

    case 'card':
      return `🎫 Card Management Service

Your Debit Card: XXXXX5678
• Card Type: Platinum Debit Card
• Valid Till: 12/27
• Daily Limit: ₹50,000

Available Actions:
1. Block Card - Temporarily block your card
2. Reissue Card - Get a new card
3. Set Limit - Change daily withdrawal limit
4. Enable/Disable - Toggle online transactions
5. PIN Services - Reset PIN

What would you like to do?`;

    case 'cheque':
      return `📄 Cheque Book Service

Your Current Cheque Book:
• Book Number: SBIN 2024 XXX
• Leaves Remaining: 20

You can request:
1. New Cheque Book - 20 leaves (Free)
2. New Cheque Book - 50 leaves (₹50)
3. Individual Cheque Leaves (₹3 per leaf)

Would you like to request a new cheque book?`;

    case 'loan':
      return `🏠 Loan Services

We offer the following loans:

1. 🏠 Home Loan - Starting 8.50% p.a.
   • Eligibility: ₹25,000 minimum income
   • Max Amount: ₹5 crore

2. 🚗 Car Loan - Starting 9.00% p.a.
   • New Car: Up to 85% on-road price
   • Used Car: Up to 70% value

3. 🎓 Education Loan - Starting 10.00% p.a.
   • For studies in India & abroad

4. 💰 Personal Loan - Starting 11.00% p.a.
   • No collateral required
   • Instant approval

5. 📱 Consumer Durable Loan - Starting 12.00% p.a.
   • For electronics, furniture, etc.

Which loan would you like to know more about?`;

    case 'queue':
      return `🎟️ Queue Token Service

Available Branches:
1. 🏦 Downtown Branch - Wait: 5 min, Tokens: 8
2. 🏦 Airport Branch - Wait: 12 min, Tokens: 15  
3. 🏦 Mall Branch - Wait: 3 min, Tokens: 4

Would you like to book a token for a branch? Just tell me which branch you want to visit!`;

    case 'voice':
      return `📞 Voice Call Service

I can connect you to our customer service team for voice assistance.

Available Options:
1. General Banking: 1800-XXX-XXXX (24/7)
2. Credit Card: 1800-XXX-XXXX (24/7)
3. Loans: Mon-Sat 9AM-6PM

Would you like me to connect you now? Or would you prefer to continue with me for quick assistance?`;

    case 'account':
      return `👤 Account Services

Your Profile:
• Name: Customer Name
• Account: XXXXX1234
• Account Type: Savings
• Branch: Main Branch
• IFSC: SBIN000XXXX

Available Updates:
1. Update Mobile Number
2. Update Email ID
3. Update Address (KYC)
4. Update Nominee Details
5. Set/Change Password

What would you like to do?`;

    case 'fraud':
      return `🔒 Security & Fraud Alert

Your Account Security Status: ✅ SECURE

Recent Alerts:
• Login from new device - Verified ✓
• UPI transaction - Verified ✓

🔴 Important: We NEVER ask for:
• OTP / PIN over phone
• Password / Card details
• Money for prize/ lottery

If you see suspicious activity, immediately:
1. Block your card: Use Card Management
2. Report fraud: Call 1800-XXX-XXXX

How can I help you further?`;

    case 'escalate':
      return `👤 Connecting to Human Agent...

I'm connecting you with a banking executive. Please wait...

In the meantime, could you tell me what specific issue you'd like to discuss? I'll make sure the agent is briefed about your query.`;

    case 'thanks':
      return `You're welcome! 😊

Is there anything else I can help you with today? Feel free to ask about any of our services!`;

    case 'goodbye':
      return `Thank you for using our Banking AI Assistant! 👋

Your session has been noted. Have a great day!

Visit us again for any banking needs. Goodbye!`;

    default:
      return `I understand you're asking about "${message}".

${servicesMenu}

Could you please clarify which service you'd like to use? Just type the name or number!`;
  }
};

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'conversation-engine' });
});

// Start conversation with enhanced greeting
app.post('/conversations/start', (req, res) => {
  const { userId } = req.body;
  const conversationId = 'CONV_' + Date.now();

  conversations.set(conversationId, {
    userId,
    startTime: new Date(),
    messages: [],
    intent: 'greeting',
    status: 'active'
  });

  res.json({
    success: true,
    conversationId,
    status: 'active',
    response: generateResponse('greeting', '')
  });
});

// Process message with enhanced NLU
app.post('/messages', (req, res) => {
  const { conversationId, message, userId } = req.body;
  const conv = conversations.get(conversationId);

  if (!conv) {
    return res.status(404).json({ success: false, message: 'Conversation not found' });
  }

  const isEscalated = escalationQueue.some(e => e.conversationId === conversationId);

  const intent = detectIntent(message);
  conv.intent = intent;
  conv.messages.push({ role: 'user', content: message, timestamp: new Date() });

  if (isEscalated) {
    // If escalated, DO NOT generate an automated bot response. Just save the user message.
    return res.json({
      success: true,
      conversationId,
      response: '', // Keep empty so UI doesn't awkwardly render text from the bot.
      intent
    });
  }

  const response = generateResponse(intent, message);

  conv.messages.push({ role: 'bot', content: response, timestamp: new Date() });

  res.json({
    success: true,
    conversationId,
    response,
    intent
  });
});

// Get chat history for a specific conversation
app.get('/conversations/:conversationId/messages', (req, res) => {
  const conv = conversations.get(req.params.conversationId);
  if (!conv) {
    return res.status(404).json({ success: false, message: 'Conversation not found' });
  }

  res.json({
    success: true,
    conversationId: req.params.conversationId,
    messages: conv.messages
  });
});

// Get escalated chats for agent dashboard
app.get('/agent/:agentId/chats', (req, res) => {
  // Map escalated conversations to the format expected by AgentDashboard
  const agentChats = escalationQueue.map(e => {
    const conv = conversations.get(e.conversationId);
    return {
      id: e.conversationId,
      userId: e.userId || conv?.userId || 'Customer',
      userName: e.userId || 'Customer', // Use email as name fallback
      lastMessage: conv?.messages?.length > 0 ? conv.messages[conv.messages.length - 1].content : 'No messages',
      timestamp: e.timestamp,
      unread: false,
      messages: conv?.messages?.map(m => ({
        sender: m.role === 'user' ? 'user' : (m.role === 'agent' ? 'agent' : 'bot'),
        text: m.content,
        time: m.timestamp
      })) || []
    };
  });

  res.json({
    success: true,
    chats: agentChats
  });
});

// Agent sending a message
app.post('/agent/messages', (req, res) => {
  const { conversationId, message, agentId } = req.body;
  const conv = conversations.get(conversationId);

  if (!conv) {
    return res.status(404).json({ success: false, message: 'Conversation not found' });
  }

  conv.messages.push({ role: 'agent', content: message, timestamp: new Date(), agentId });

  res.json({
    success: true,
    conversationId,
    message: 'Message sent successfully'
  });
});

// Loan eligibility check
app.post('/loan-eligibility', (req, res) => {
  const { userId, loanAmount, loanType } = req.body;

  const income = 75000;
  const creditScore = 750;
  const isEligible = creditScore > 600 && loanAmount <= income * 5;

  res.json({
    success: true,
    eligible: isEligible,
    creditScore,
    maxLoanAmount: income * 5,
    estimatedRate: isEligible ? '8.5%' : null,
    message: isEligible ? 'You are eligible for this loan!' : 'You do not meet the eligibility criteria.'
  });
});

// Loan application
app.post('/loan-apply', (req, res) => {
  const { userId, loanAmount, loanType, tenure } = req.body;

  res.json({
    success: true,
    applicationId: 'LOAN_' + Date.now(),
    status: 'submitted',
    amount: loanAmount,
    type: loanType,
    tenure: tenure,
    estimatedApprovalTime: '3-5 business days',
    message: 'Application submitted successfully!'
  });
});

// Get available agents
app.get('/agents/available', (req, res) => {
  const available = agents.filter(a => a.status === 'available');

  res.json({
    success: true,
    agents: available.map(a => ({
      id: a.id,
      name: a.name,
      specialization: a.specialization
    }))
  });
});

// Escalate to agent
app.post('/escalate', (req, res) => {
  const { conversationId, userId, reason } = req.body;

  // Find an agent with the fewest active chats, or simply assign to an available agent
  // For demo purposes, we will just assign it to any agent and NOT lock them as busy
  const targetAgent = agents[Math.floor(Math.random() * agents.length)];

  if (targetAgent) {
    // Check if it's already escalated
    if (!escalationQueue.some(e => e.conversationId === conversationId)) {
      escalationQueue.push({
        conversationId,
        userId,
        reason,
        assignedAgent: targetAgent.id,
        timestamp: new Date()
      });
    }

    res.json({
      success: true,
      agentId: targetAgent.id,
      agentName: targetAgent.name,
      message: `Connected with ${targetAgent.name}. They can now see your conversation history.`
    });
  } else {
    res.json({
      success: true,
      queued: true,
      queuePosition: escalationQueue.length + 1,
      estimatedWait: '5-10 minutes',
      message: 'All agents are busy. You are in the queue.'
    });
  }
});

// Get escalation status
app.get('/escalation/:conversationId', (req, res) => {
  const escalation = escalationQueue.find(e => e.conversationId === req.params.conversationId);

  if (!escalation) {
    return res.status(404).json({ success: false, message: 'No escalation found' });
  }

  res.json({
    success: true,
    conversationId: escalation.conversationId,
    agentId: escalation.assignedAgent,
    reason: escalation.reason,
    status: 'in_progress'
  });
});

// Request token/queue number for branch
app.post('/request-token', (req, res) => {
  const { userId, serviceType } = req.body;
  const tokenNumber = 'T' + String(tokenQueue.length + 1).padStart(3, '0');

  tokenQueue.push({
    token: tokenNumber,
    userId,
    serviceType,
    timestamp: new Date(),
    status: 'pending'
  });

  const position = tokenQueue.length;

  res.json({
    success: true,
    token: tokenNumber,
    queuePosition: position,
    averageWaitTime: position * 3 + ' minutes',
    branch: 'Downtown Branch',
    counter: Math.ceil(Math.random() * 5)
  });
});

// Get queue status
app.get('/queue/status', (req, res) => {
  const pendingTokens = tokenQueue.filter(t => t.status === 'pending').length;

  res.json({
    success: true,
    totalPending: pendingTokens,
    averageWaitTime: Math.ceil(pendingTokens * 3) + ' minutes',
    branches: [
      { name: 'Downtown Branch', waitTime: '5 minutes', tokens: 8 },
      { name: 'Airport Branch', waitTime: '12 minutes', tokens: 15 },
      { name: 'Mall Branch', waitTime: '3 minutes', tokens: 4 }
    ]
  });
});

// Get user preferences
app.get('/user/:userId/preferences', (req, res) => {
  res.json({
    success: true,
    preferences: {
      language: 'en',
      communicationChannel: 'voice',
      notificationPreference: 'email+'
    }
  });
});

app.listen(PORT, () => {
  console.log(`✅ Conversation Engine running on port ${PORT}`);
});

