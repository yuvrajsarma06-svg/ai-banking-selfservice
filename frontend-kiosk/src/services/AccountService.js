import React, { useState, useEffect } from 'react';
import '../styles/AccountService.css';

function AccountService({ email }) {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalBalance, setTotalBalance] = useState(0);

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
        
        if (accountsList.length > 0) {
          setAccounts(accountsList);
          const total = accountsList.reduce((sum, acc) => sum + (acc.balance || 0), 0);
          setTotalBalance(total);
        } else {
          // Demo data
          const demoAccounts = [
            {
              id: 'ACC001',
              accountNumber: '****1234',
              accountType: 'Checking',
              balance: 5234.50,
              currency: 'USD',
              status: 'Active'
            },
            {
              id: 'ACC002',
              accountNumber: '****5678',
              accountType: 'Savings',
              balance: 15750.00,
              currency: 'USD',
              status: 'Active'
            },
            {
              id: 'ACC003',
              accountNumber: '****9012',
              accountType: 'Money Market',
              balance: 25000.00,
              currency: 'USD',
              status: 'Active'
            }
          ];
          setAccounts(demoAccounts);
          setTotalBalance(demoAccounts.reduce((sum, acc) => sum + acc.balance, 0));
        }
      } catch (err) {
        setError('Failed to load accounts: ' + err.message);
        // Set demo data on error
        const demoAccounts = [
          {
            id: 'ACC001',
            accountNumber: '****1234',
            accountType: 'Checking',
            balance: 5234.50,
            currency: 'USD',
            status: 'Active'
          },
          {
            id: 'ACC002',
            accountNumber: '****5678',
            accountType: 'Savings',
            balance: 15750.00,
            currency: 'USD',
            status: 'Active'
          },
          {
            id: 'ACC003',
            accountNumber: '****9012',
            accountType: 'Money Market',
            balance: 25000.00,
            currency: 'USD',
            status: 'Active'
          }
        ];
        setAccounts(demoAccounts);
        setTotalBalance(demoAccounts.reduce((sum, acc) => sum + acc.balance, 0));
      } finally {
        setLoading(false);
      }
    };

    loadAccounts();
  }, []);

  if (loading) {
    return (
      <div className="account-service">
        <div className="account-header">
          <h3>📊 My Accounts</h3>
        </div>
        <div className="loading">Loading your accounts...</div>
      </div>
    );
  }

  return (
    <div className="account-service">
      <div className="account-header">
        <h3>📊 My Accounts</h3>
        {error && <div className="error-message">{error}</div>}
      </div>

      <div className="account-summary">
        <div className="summary-card">
          <h4>Total Balance</h4>
          <p className="balance-total">
            ${totalBalance.toFixed(2)}
          </p>
          <p className="summary-email">Account: {email}</p>
        </div>
      </div>

      <div className="accounts-list">
        <h4 className="accounts-title">Your Accounts</h4>
        {accounts.length === 0 ? (
          <div className="no-accounts">No accounts found</div>
        ) : (
          accounts.map((account) => (
            <div key={account.id} className="account-card">
              <div className="account-card-header">
                <div>
                  <h5>{account.accountType || 'Account'}</h5>
                  <p className="account-number">{account.accountNumber || account.id}</p>
                </div>
                <div className="account-status">
                  <span className={`status ${account.status ? account.status.toLowerCase() : 'active'}`}>
                    {account.status || 'Active'}
                  </span>
                </div>
              </div>

              <div className="account-details">
                <div className="detail-row">
                  <span className="detail-label">Balance:</span>
                  <span className="detail-value">${(account.balance || 0).toFixed(2)}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Currency:</span>
                  <span className="detail-value">{account.currency || 'USD'}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Account ID:</span>
                  <span className="detail-value">{account.id}</span>
                </div>
              </div>

              <div className="account-actions">
                <button className="btn-view-details">View Details</button>
                <button className="btn-transactions">Recent Transactions</button>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="account-footer">
        <p>💡 Tip: Click on an account to see more details and transaction history</p>
      </div>
    </div>
  );
}

export default AccountService;
