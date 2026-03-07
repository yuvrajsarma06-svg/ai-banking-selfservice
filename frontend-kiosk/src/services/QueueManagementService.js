import React, { useState, useEffect } from 'react';
import '../styles/QueueManagementService.css';

function QueueManagementService({ email }) {
  const [token, setToken] = useState(null);
  const [serviceType, setServiceType] = useState('general');
  const [selectedBranch, setSelectedBranch] = useState('downtown');
  const [queueData, setQueueData] = useState(null);
  const [loading, setLoading] = useState(false);

  const branches = [
    { id: 'downtown', name: 'Downtown Branch', address: '123 Main St' },
    { id: 'airport', name: 'Airport Branch', address: '456 Aviation Ave' },
    { id: 'mall', name: 'Mall Branch', address: '789 Shopping Blvd' }
  ];

  const serviceTypes = [
    { id: 'accountOpening', name: 'Account Opening' },
    { id: 'loanApplication', name: 'Loan Application' },
    { id: 'cardIssue', name: 'Card Issue' },
    { id: 'general', name: 'General Service' }
  ];

  const requestToken = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5002/request-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: email,
          serviceType,
          branch: selectedBranch
        })
      });

      const data = await response.json();
      setToken(data);
    } catch (err) {
      console.error('Error requesting token');
    } finally {
      setLoading(false);
    }
  };

  const getQueueStatus = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5002/queue/status');
      const data = await response.json();
      setQueueData(data);
    } catch (err) {
      console.error('Error fetching queue status');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getQueueStatus();
  }, []);

  return (
    <div className="queue-management-service">
      <h3>🎫 Branch Queue Management</h3>

      {!token ? (
        <div className="token-request">
          <div className="form-section">
            <h4>Generate Queue Token</h4>
            
            <div className="form-group">
              <label>Service Type:</label>
              <select value={serviceType} onChange={(e) => setServiceType(e.target.value)}>
                {serviceTypes.map(type => (
                  <option key={type.id} value={type.id}>{type.name}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Select Branch:</label>
              <select value={selectedBranch} onChange={(e) => setSelectedBranch(e.target.value)}>
                {branches.map(branch => (
                  <option key={branch.id} value={branch.id}>{branch.name}</option>
                ))}
              </select>
            </div>

            <button onClick={requestToken} disabled={loading} className="btn-get-token">
              {loading ? 'Generating...' : 'Generate Token'}
            </button>
          </div>

          {queueData && (
            <div className="queue-status">
              <h4>Current Queue Status</h4>
              <div className="status-grid">
                {queueData.branches.map(branch => (
                  <div key={branch.name} className="branch-status">
                    <h5>{branch.name}</h5>
                    <p className="wait-time">{branch.waitTime} wait</p>
                    <p className="queue-count">{branch.tokens} in queue</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="token-display">
          <div className="token-card">
            <div className="token-number">{token.token}</div>
            <p className="token-text">Your Queue Token</p>
          </div>

          <div className="token-details">
            <p><strong>Service:</strong> {serviceTypes.find(t => t.id === serviceType)?.name}</p>
            <p><strong>Branch:</strong> {branches.find(b => b.id === selectedBranch)?.name}</p>
            <p><strong>Queue Position:</strong> {token.queuePosition}</p>
            <p><strong>Estimated Wait Time:</strong> {token.estimatedWaitTime}</p>
            <p><strong>Counter:</strong> {token.counter}</p>
          </div>

          <div className="instructions">
            <p>📌 Keep this token safe. You can track your position in real-time.</p>
            <p>📱 You'll receive an SMS when you're next in queue.</p>
          </div>

          <button onClick={() => setToken(null)} className="btn-new-token">
            Get Another Token
          </button>
        </div>
      )}
    </div>
  );
}

export default QueueManagementService;
