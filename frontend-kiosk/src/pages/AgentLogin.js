import React, { useState } from 'react';
import '../styles/AgentLogin.css';

function AgentLogin() {
  const [agentId, setAgentId] = useState('');
  const [agentName, setAgentName] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    
    if (!agentId.trim() || !agentName.trim()) {
      setError('Please enter both Agent ID and Name');
      return;
    }

    // Store agent info in sessionStorage
    sessionStorage.setItem('agentId', agentId);
    sessionStorage.setItem('agentName', agentName);
    sessionStorage.setItem('isAgentLoggedIn', 'true');

    // Redirect to agent dashboard
    window.location.hash = '#/agent-dashboard';
  };

  return (
    <div className="agent-login-container">
      <div className="agent-login-box">
        <div className="agent-login-header">
          <h1>👨‍💼 Agent Login</h1>
          <p>Banking AI Customer Support</p>
        </div>

        <form onSubmit={handleLogin} className="agent-login-form">
          <div className="form-group">
            <label>Agent ID</label>
            <input
              type="text"
              value={agentId}
              onChange={(e) => setAgentId(e.target.value)}
              placeholder="Enter your Agent ID (e.g., AGENT001)"
              required
            />
          </div>

          <div className="form-group">
            <label>Your Name</label>
            <input
              type="text"
              value={agentName}
              onChange={(e) => setAgentName(e.target.value)}
              placeholder="Enter your name"
              required
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="btn-login">
            Login to Dashboard
          </button>
        </form>

        <div className="agent-login-footer">
          <p>Demo IDs: AGENT001, AGENT002, AGENT003</p>
          <p>Any name can be used for demo</p>
        </div>
      </div>
    </div>
  );
}

export default AgentLogin;

