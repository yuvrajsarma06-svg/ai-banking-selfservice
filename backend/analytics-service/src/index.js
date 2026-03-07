const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5004;

app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'analytics-service' });
});

// Comprehensive dashboard metrics
app.get('/analytics/dashboard', (req, res) => {
  res.json({
    success: true,
    summary: {
      totalUsers: 1245,
      activeUsers: 234,
      totalTransactions: 5678,
      totalVolume: 2450000,
      avgSessionDuration: 8.5,
      systemUptime: 99.98,
      customerSatisfaction: 4.6
    },
    channelBreakdown: {
      kiosk: { users: 245, conversations: 512, duration: 8.5, utilization: 78 },
      mobile: { users: 189, conversations: 423, duration: 6.2, utilization: 65 },
      voice: { users: 87, conversations: 156, duration: 12.3, utilization: 45 },
      whatsapp: { users: 45, conversations: 89, duration: 4.5, utilization: 32 }
    },
    transactionMetrics: {
      transfers: { count: 1250, volume: 450000, avgAmount: 360 },
      billPayments: { count: 890, volume: 125000, avgAmount: 140 },
      cardOperations: { count: 456, volume: 0, avgAmount: 0 },
      chequebookRequests: { count: 234, volume: 0, avgAmount: 0 }
    },
    serviceMetrics: {
      fundTransfers: { successRate: 99.2, avgTime: 2.3 },
      billPayments: { successRate: 98.5, avgTime: 1.8 },
      balanceInquiry: { successRate: 100, avgTime: 0.5 },
      loanApplication: { successRate: 87.5, avgTime: 45 }
    },
    peakHours: {
      morning: { start: '9 AM', end: '12 PM', traffic: 'High' },
      afternoon: { start: '12 PM', end: '3 PM', traffic: 'Medium' },
      evening: { start: '3 PM', end: '6 PM', traffic: 'High' }
    },
    timestamp: new Date().toISOString()
  });
});

// Agent performance metrics
app.get('/analytics/agents', (req, res) => {
  res.json({
    success: true,
    agents: [
      {
        id: 'AGENT001',
        name: 'John Smith',
        callsHandled: 125,
        avgCallDuration: 8.5,
        satisfactionScore: 4.8,
        resolutionRate: 96.5,
        status: 'active'
      },
      {
        id: 'AGENT002',
        name: 'Sarah Johnson',
        callsHandled: 118,
        avgCallDuration: 7.2,
        satisfactionScore: 4.6,
        resolutionRate: 94.2,
        status: 'active'
      },
      {
        id: 'AGENT003',
        name: 'Mike Williams',
        callsHandled: 95,
        avgCallDuration: 12.3,
        satisfactionScore: 4.4,
        resolutionRate: 91.5,
        status: 'offline'
      }
    ],
    teamStats: {
      totalAgents: 12,
      activeAgents: 10,
      avgSatisfaction: 4.6,
      avgResolutionRate: 94.1
    }
  });
});

// Real-time performance
app.get('/analytics/realtime', (req, res) => {
  res.json({
    success: true,
    realtime: {
      onlineUsers: 234,
      activeConversations: 45,
      pendingEscalations: 3,
      avgWaitTime: 2.5,
      systemLoad: 45,
      databaseLatency: 12,
      apiResponseTime: 85
    },
    alerts: [
      { severity: 'warning', message: 'High transaction volume detected' },
      { severity: 'info', message: 'System maintenance scheduled for March 5' }
    ]
  });
});

// Daily/weekly/monthly trends
app.get('/analytics/trends', (req, res) => {
  const generateTrendData = (days) => {
    const data = [];
    for (let i = 0; i < days; i++) {
      data.push({
        date: new Date(Date.now() - (days - i) * 86400000).toISOString().split('T')[0],
        users: Math.floor(Math.random() * 500 + 200),
        transactions: Math.floor(Math.random() * 1000 + 500),
        volume: Math.floor(Math.random() * 500000 + 250000)
      });
    }
    return data;
  };
  
  res.json({
    success: true,
    daily: generateTrendData(30),
    weekly: generateTrendData(12),
    monthly: generateTrendData(12)
  });
});

// Error and issue tracking
app.get('/analytics/errors', (req, res) => {
  res.json({
    success: true,
    errors: [
      {
        id: 'ERR001',
        type: 'TransactionFailed',
        count: 12,
        lastOccurrence: '2026-03-01 14:30:00',
        service: 'transaction-service',
        severity: 'medium'
      },
      {
        id: 'ERR002',
        type: 'AuthTimeout',
        count: 5,
        lastOccurrence: '2026-03-01 15:15:00',
        service: 'auth-service',
        severity: 'low'
      }
    ],
    errorRate: 0.15,
    systemHealth: 'Good'
  });
});

// User engagement and behavior
app.get('/analytics/engagement', (req, res) => {
  res.json({
    success: true,
    engagement: {
      newUsers: 45,
      returningUsers: 189,
      churnRate: 2.5,
      avgSessionsPerUser: 3.2,
      avgSessionValue: 285,
      topServices: [
        { service: 'Balance Inquiry', usage: 1250, revenue: 0 },
        { service: 'Fund Transfer', usage: 890, revenue: 4450 },
        { service: 'Bill Payment', usage: 545, revenue: 2725 }
      ]
    },
    customerSegmentation: {
      premium: 234,
      standard: 567,
      basic: 444
    }
  });
});

// Fraud and security metrics
app.get('/analytics/security', (req, res) => {
  res.json({
    success: true,
    security: {
      fraudAttempts: 23,
      blockedTransactions: 8,
      flaggedAccounts: 5,
      securityAlerts: 12,
      encryptionStatus: 'Active',
      complianceScore: 98.5,
      dataBreaches: 0
    },
    recentAlerts: [
      { id: 'SEC001', type: 'UnusualActivity', account: 'ACC001', timestamp: '2026-03-01 14:30:00' },
      { id: 'SEC002', type: 'MultipleFailedLogins', account: 'ACC002', timestamp: '2026-03-01 15:45:00' }
    ]
  });
});

// Device and location analytics
app.get('/analytics/devices', (req, res) => {
  res.json({
    success: true,
    devices: {
      mobile: { percentage: 45, count: 560 },
      desktop: { percentage: 35, count: 435 },
      tablet: { percentage: 12, count: 149 },
      kiosk: { percentage: 8, count: 101 }
    },
    locations: [
      { branch: 'Downtown', transactions: 456, avgValue: 285 },
      { branch: 'Airport', transactions: 234, avgValue: 450 },
      { branch: 'Mall', transactions: 178, avgValue: 320 }
    ]
  });
});

// Queue management analytics
app.get('/analytics/queue', (req, res) => {
  res.json({
    success: true,
    queue: {
      totalQueued: 45,
      avgWaitTime: 8.5,
      maxWaitTime: 25,
      servedToday: 234,
      servicesByType: {
        accountOpening: 45,
        loanApplication: 67,
        cardIssue: 34,
        general: 88
      },
      branches: [
        { branch: 'Downtown', queued: 12, avgWait: 5 },
        { branch: 'Airport', queued: 18, avgWait: 12 },
        { branch: 'Mall', queued: 15, avgWait: 7 }
      ]
    }
  });
});

// Record event
app.post('/events', (req, res) => {
  const { eventType, userId, data } = req.body;
  
  res.json({
    success: true,
    message: 'Event recorded',
    eventId: 'EVT_' + Date.now(),
    eventType,
    timestamp: new Date().toISOString()
  });
});

// Export report
app.post('/reports/export', (req, res) => {
  const { reportType, format } = req.body;
  
  res.json({
    success: true,
    reportId: 'RPT_' + Date.now(),
    reportType,
    format,
    downloadUrl: '/reports/download/' + Date.now(),
    generatedAt: new Date().toISOString()
  });
});

app.listen(PORT, () => {
  console.log(`✅ Analytics Service running on port ${PORT}`);
});
