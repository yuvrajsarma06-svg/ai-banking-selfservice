import React, { useState, useEffect } from 'react';
import '../styles/StatementService.css';

function StatementService({ email }) {
  const [statement, setStatement] = useState(null);
  const [accountId, setAccountId] = useState('ACC001');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadStatement();
  }, [accountId]);

  const loadStatement = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:5003/accounts/${accountId}/statement`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });

      const data = await response.json();
      setStatement(data.statement || {
        transactions: [
          { id: 'TXN001', date: '2026-03-01', description: 'ATM Withdrawal', amount: -200, balance: 15750.50 },
          { id: 'TXN002', date: '2026-02-28', description: 'Salary Deposit', amount: 5000, balance: 15950.50 },
          { id: 'TXN003', date: '2026-02-27', description: 'Utility Bill', amount: -150, balance: 10950.50 }
        ],
        accountDetails: { balance: 15750.50, accountNumber: '****1234' }
      });
    } catch (err) {
      setError('Failed to load statement');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="statement-loading">Loading statement...</div>;

  return (
    <div className="statement-service">
      <h3>📄 Mini Statement</h3>
      {error && <div className="error-message">{error}</div>}

      <div className="statement-content">
        <div className="account-selector">
          <label>Select Account:</label>
          <select value={accountId} onChange={(e) => setAccountId(e.target.value)}>
            <option value="ACC001">Savings - ****1234</option>
            <option value="ACC002">Checking - ****5678</option>
            <option value="ACC003">Money Market - ****9012</option>
          </select>
        </div>

        {statement && (
          <>
            <div className="statement-summary">
              <div className="summary-item">
                <span>Current Balance:</span>
                <span className="amount">${statement.accountDetails?.balance || 15750.50}</span>
              </div>
              <div className="summary-item">
                <span>Statement Period:</span>
                <span>Last 30 Days</span>
              </div>
            </div>

            <div className="transactions-list">
              <h4>Recent Transactions</h4>
              {statement.transactions && statement.transactions.map((txn, idx) => (
                <div key={idx} className="transaction-row">
                  <div className="txn-left">
                    <div className="txn-desc">{txn.description}</div>
                    <div className="txn-date">{txn.date}</div>
                  </div>
                  <div className={`txn-amount ${txn.amount > 0 ? 'credit' : 'debit'}`}>
                    {txn.amount > 0 ? '+' : ''} ${Math.abs(txn.amount)}
                  </div>
                </div>
              ))}
            </div>

            <button className="btn-print">🖨️ Print Statement</button>
            <button className="btn-download">⬇️ Download PDF</button>
          </>
        )}
      </div>
    </div>
  );
}

export default StatementService;
