import React, { useState } from 'react';
import '../styles/ChequeBookService.css';

function ChequeBookService({ email }) {
  const [requests, setRequests] = useState([]);
  const [formVisible, setFormVisible] = useState(false);
  const [accountId, setAccountId] = useState('ACC001');
  const [leaves, setLeaves] = useState(50);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);

  const handleRequestChequeBook = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5003/cheque-book/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accountId, leaves })
      });

      const data = await response.json();
      
      if (data.success) {
        setSuccess(data);
        setFormVisible(false);
        setTimeout(() => setSuccess(null), 5000);
      }
    } catch (err) {
      console.error('Error requesting cheque book');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="cheque-book-service">
      <h3>📓 Cheque Book Request</h3>

      {success && (
        <div className="success-alert">
          <p>✓ {success.message}</p>
          <p>Request ID: {success.requestId}</p>
          <p>Estimated Delivery: {success.estimatedDelivery}</p>
        </div>
      )}

      {!formVisible ? (
        <div className="cheque-book-container">
          <button onClick={() => setFormVisible(true)} className="btn-request-cheque">
            📝 Request New Cheque Book
          </button>

          <div className="previous-requests">
            <h4>Previous Requests</h4>
            <div className="request-list">
              <div className="request-item">
                <p>Request ID: CHQ001</p>
                <p>Date: 2026-02-20 | Status: <span className="status delivered">Delivered</span></p>
              </div>
              <div className="request-item">
                <p>Request ID: CHQ002</p>
                <p>Date: 2026-03-01 | Status: <span className="status transit">In Transit</span></p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <form onSubmit={handleRequestChequeBook} className="cheque-form">
          <div className="form-group">
            <label>Account:</label>
            <select value={accountId} onChange={(e) => setAccountId(e.target.value)}>
              <option value="ACC001">Savings - ****1234</option>
              <option value="ACC002">Checking - ****5678</option>
            </select>
          </div>

          <div className="form-group">
            <label>Number of Leaves:</label>
            <select value={leaves} onChange={(e) => setLeaves(parseInt(e.target.value))}>
              <option value={25}>25 Leaves</option>
              <option value={50}>50 Leaves</option>
              <option value={100}>100 Leaves</option>
            </select>
          </div>

          <p className="info-text">Cheque book will be delivered to your registered address within 5-7 business days.</p>

          <button type="submit" disabled={loading} className="btn-submit-request">
            {loading ? 'Submitting...' : 'Submit Request'}
          </button>
          <button type="button" onClick={() => setFormVisible(false)} className="btn-cancel">
            Cancel
          </button>
        </form>
      )}
    </div>
  );
}

export default ChequeBookService;
