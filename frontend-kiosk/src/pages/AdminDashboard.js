import React from 'react';
import '../styles/AdminDashboard.css';

function AdminDashboard() {
  const [metrics, setMetrics] = React.useState(null);
  const [agents, setAgents] = React.useState(null);
  const [realtime, setRealtime] = React.useState(null);
  const [selectedTab, setSelectedTab] = React.useState('overview');

  React.useEffect(() => {
    loadDashboardData();
    const interval = setInterval(loadDashboardData, 30000); // Refresh every 30s
    return () => clearInterval(interval);
  }, []);

  const loadDashboardData = async () => {
    try {
      const dashResponse = await fetch('http://localhost:5004/analytics/dashboard');
      const agentResponse = await fetch('http://localhost:5004/analytics/agents');
      const realtimeResponse = await fetch('http://localhost:5004/analytics/realtime');

      setMetrics(await dashResponse.json());
      setAgents(await agentResponse.json());
      setRealtime(await realtimeResponse.json());
    } catch (err) {
      console.error('Error loading dashboard:', err);
    }
  };

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h1>📊 Banking Platform Admin Dashboard</h1>
        <div className="header-info">
          <span className="last-updated">Last updated: {new Date().toLocaleTimeString()}</span>
        </div>
      </div>

      <div className="dashboard-tabs">
        <button 
          className={`tab ${selectedTab === 'overview' ? 'active' : ''}`}
          onClick={() => setSelectedTab('overview')}
        >
          Overview
        </button>
        <button 
          className={`tab ${selectedTab === 'transaction' ? 'active' : ''}`}
          onClick={() => setSelectedTab('transaction')}
        >
          Transactions
        </button>
        <button 
          className={`tab ${selectedTab === 'agents' ? 'active' : ''}`}
          onClick={() => setSelectedTab('agents')}
        >
          Agents
        </button>
        <button 
          className={`tab ${selectedTab === 'security' ? 'active' : ''}`}
          onClick={() => setSelectedTab('security')}
        >
          Security
        </button>
      </div>

      {selectedTab === 'overview' && metrics && (
        <div className="dashboard-section">
          <div className="kpi-grid">
            <div className="kpi-card">
              <h3>Total Users</h3>
              <div className="kpi-value">{metrics.summary?.totalUsers}</div>
              <p className="kpi-subtitle">Active: {metrics.summary?.activeUsers}</p>
            </div>
            <div className="kpi-card">
              <h3>Transactions</h3>
              <div className="kpi-value">{metrics.summary?.totalTransactions}</div>
              <p className="kpi-subtitle">Volume: ${(metrics.summary?.totalVolume / 1000000).toFixed(1)}M</p>
            </div>
            <div className="kpi-card">
              <h3>Uptime</h3>
              <div className="kpi-value">{metrics.summary?.systemUptime}%</div>
              <p className="kpi-subtitle">System Health</p>
            </div>
            <div className="kpi-card">
              <h3>Satisfaction</h3>
              <div className="kpi-value">{metrics.summary?.customerSatisfaction}/5</div>
              <p className="kpi-subtitle">⭐ Rating</p>
            </div>
          </div>

          <div className="charts-container">
            <div className="chart-box">
              <h3>Channel Breakdown</h3>
              <div className="channel-list">
                {metrics.channelBreakdown && Object.entries(metrics.channelBreakdown).map(([channel, data]) => (
                  <div key={channel} className="channel-item">
                    <span>{channel.toUpperCase()}</span>
                    <div className="progress-bar">
                      <div className="progress" style={{width: data.utilization + '%'}}></div>
                    </div>
                    <span>{data.utilization}% - {data.conversations} conversations</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="chart-box">
              <h3>Peak Hours</h3>
              {metrics.peakHours && Object.entries(metrics.peakHours).map(([period, data]) => (
                <p key={period}><strong>{period}:</strong> {data.start} - {data.end} ({data.traffic})</p>
              ))}
            </div>
          </div>
        </div>
      )}

      {selectedTab === 'transaction' && metrics && (
        <div className="dashboard-section">
          <div className="transaction-metrics">
            <div className="metric-box">
              <h3>Fund Transfers</h3>
              <p className="metric-value">{metrics.transactionMetrics?.transfers.count}</p>
              <p className="metric-detail">Volume: ${(metrics.transactionMetrics?.transfers.volume / 1000).toFixed(0)}K</p>
              <p className="metric-detail">Success Rate: {metrics.serviceMetrics?.fundTransfers.successRate}%</p>
            </div>
            <div className="metric-box">
              <h3>Bill Payments</h3>
              <p className="metric-value">{metrics.transactionMetrics?.billPayments.count}</p>
              <p className="metric-detail">Volume: ${(metrics.transactionMetrics?.billPayments.volume / 1000).toFixed(0)}K</p>
              <p className="metric-detail">Success Rate: {metrics.serviceMetrics?.billPayments.successRate}%</p>
            </div>
            <div className="metric-box">
              <h3>Card Operations</h3>
              <p className="metric-value">{metrics.transactionMetrics?.cardOperations.count}</p>
              <p className="metric-detail">Block/Reissue requests</p>
            </div>
            <div className="metric-box">
              <h3>Loan Applications</h3>
              <p className="metric-value">{metrics.transactionMetrics?.chequebookRequests.count}</p>
              <p className="metric-detail">In progress</p>
            </div>
          </div>
        </div>
      )}

      {selectedTab === 'agents' && agents && (
        <div className="dashboard-section">
          <div className="agents-table">
            <table>
              <thead>
                <tr>
                  <th>Agent Name</th>
                  <th>Status</th>
                  <th>Calls Handled</th>
                  <th>Avg Duration</th>
                  <th>Satisfaction</th>
                  <th>Resolution Rate</th>
                </tr>
              </thead>
              <tbody>
                {agents.agents?.map(agent => (
                  <tr key={agent.id}>
                    <td>{agent.name}</td>
                    <td><span className={`status ${agent.status}`}>{agent.status}</span></td>
                    <td>{agent.callsHandled}</td>
                    <td>{agent.avgCallDuration.toFixed(1)}m</td>
                    <td>⭐ {agent.satisfactionScore}</td>
                    <td>{agent.resolutionRate}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="team-stats">
            <p><strong>Total Agents:</strong> {agents.teamStats?.totalAgents}</p>
            <p><strong>Active:</strong> {agents.teamStats?.activeAgents}</p>
            <p><strong>Avg Satisfaction:</strong> {agents.teamStats?.avgSatisfaction}/5</p>
          </div>
        </div>
      )}

      {selectedTab === 'security' && (
        <div className="dashboard-section">
          <div className="security-alert">Security & Compliance Status</div>
          <div className="security-grid">
            <div className="security-item warning">
              <h4>Fraud Alerts</h4>
              <p className="security-number">23</p>
              <p className="security-desc">This month</p>
            </div>
            <div className="security-item success">
              <h4>Blocked Transactions</h4>
              <p className="security-number">8</p>
              <p className="security-desc">Fraud prevented</p>
            </div>
            <div className="security-item success">
              <h4>Data Breaches</h4>
              <p className="security-number">0</p>
              <p className="security-desc">System secure</p>
            </div>
            <div className="security-item success">
              <h4>Compliance Score</h4>
              <p className="security-number">98.5%</p>
              <p className="security-desc">Excellent</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
