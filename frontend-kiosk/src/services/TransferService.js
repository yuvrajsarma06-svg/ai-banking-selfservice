import React, { useState, useEffect } from 'react';
import '../styles/TransferService.css';

function TransferService({ email }) {
  const [accounts, setAccounts] = useState([]);
  const [fromAccount, setFromAccount] = useState('');
  const [toAccount, setToAccount] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [transferResult, setTransferResult] = useState(null);

  // Load accounts on mount
  useEffect(() => {
    const loadAccounts = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:5003/accounts', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
        });
        const data = await response.json();
        const accountsList = Array.isArray(data) ? data : (data.accounts || []);
        setAccounts(accountsList.length > 0 ? accountsList : [
          { id: 'ACC001', accountNumber: '****1234', balance: 5000, currency: 'USD' },
          { id: 'ACC002', accountNumber: '****5678', balance: 3000, currency: 'USD' }
        ]);
      } catch (err) {
        setError('Failed to load accounts: ' + err.message);
        // Set default accounts for demo
        setAccounts([
          { id: 'ACC001', accountNumber: '****1234', balance: 5000, currency: 'USD' },
          { id: 'ACC002', accountNumber: '****5678', balance: 3000, currency: 'USD' }
        ]);
      } finally {
        setLoading(false);
      }
    };

    loadAccounts();
  }, []);

  const handleTransfer = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setTransferResult(null);

    if (!fromAccount || !toAccount || !amount) {
      setError('Please fill in all fields');
      return;
    }

    if (fromAccount === toAccount) {
      setError('From and To accounts cannot be the same');
      return;
    }

    if (parseFloat(amount) <= 0) {
      setError('Amount must be greater than 0');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch('http://localhost:5003/transfer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fromAccountId: fromAccount,
          toAccountId: toAccount,
          amount: parseFloat(amount),
          userId: email
        })
      });

      const data = await response.json();
      
      if (response.ok || data.success) {
        setTransferResult({
          transactionId: data.transactionId || 'TXN' + Date.now(),
          status: 'Completed',
          amount: amount,
          timestamp: new Date()
        });
        setSuccess('Transfer completed successfully!');
        setFromAccount('');
        setToAccount('');
        setAmount('');
      } else {
        setError(data.error || 'Transfer failed');
      }
    } catch (err) {
      setError('Transfer error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="transfer-service">
      <div className="transfer-header">
        <h3>💰 Money Transfer</h3>
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}
      </div>

      {!transferResult ? (
        <form onSubmit={handleTransfer} className="transfer-form">
          <div className="form-group">
            <label>From Account:</label>
            <select 
              value={fromAccount} 
              onChange={(e) => setFromAccount(e.target.value)}
              required
              disabled={loading}
            >
              <option value="">Select source account</option>
              {accounts.map((acc) => (
                <option key={acc.id} value={acc.id}>
                  {acc.accountNumber} - Balance: ${acc.balance} {acc.currency}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>To Account:</label>
            <select 
              value={toAccount} 
              onChange={(e) => setToAccount(e.target.value)}
              required
              disabled={loading}
            >
              <option value="">Select destination account</option>
              {accounts.map((acc) => (
                <option key={acc.id} value={acc.id}>
                  {acc.accountNumber} - Balance: ${acc.balance} {acc.currency}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Amount:</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
              step="0.01"
              min="0"
              required
              disabled={loading}
              className="amount-input"
            />
          </div>

          <button type="submit" disabled={loading} className="btn-transfer">
            {loading ? 'Processing...' : 'Transfer Money'}
          </button>
        </form>
      ) : (
        <div className="transfer-result">
          <div className="success-icon">✓</div>
          <h4>Transfer Successful!</h4>
          <div className="result-details">
            <p><strong>Transaction ID:</strong> {transferResult.transactionId}</p>
            <p><strong>Amount:</strong> ${transferResult.amount}</p>
            <p><strong>Status:</strong> {transferResult.status}</p>
            <p><strong>Time:</strong> {transferResult.timestamp.toLocaleString()}</p>
          </div>
          <button 
            onClick={() => {
              setTransferResult(null);
              setSuccess(null);
            }} 
            className="btn-new-transfer"
          >
            Make Another Transfer
          </button>
        </div>
      )}
    </div>
  );
}

export default TransferService;
