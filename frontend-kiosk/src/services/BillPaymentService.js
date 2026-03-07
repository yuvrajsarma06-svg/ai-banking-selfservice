import React, { useState } from 'react';
import '../styles/BillPaymentService.css';

function BillPaymentService({ email }) {
  const [billers] = useState([
    { id: 1, name: 'Electric Company', accountNumber: 'AC123456' },
    { id: 2, name: 'Water Board', accountNumber: 'WB789012' },
    { id: 3, name: 'Telecom Provider', accountNumber: 'TP345678' },
    { id: 4, name: 'Gas Corporation', accountNumber: 'GC901234' }
  ]);

  const [selectedBiller, setSelectedBiller] = useState('');
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('immediate');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);

  const handlePayBill = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5003/bill-pay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          accountId: 'ACC001',
          billerName: selectedBiller,
          amount: parseFloat(amount),
          paymentMethod
        })
      });

      const data = await response.json();
      
      if (data.success) {
        setSuccess({
          billId: data.billId,
          biller: selectedBiller,
          amount: amount,
          date: data.date
        });
        setSelectedBiller('');
        setAmount('');
      }
    } catch (err) {
      console.error('Payment error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bill-payment-service">
      <h3>💳 Bill Payment</h3>

      {!success ? (
        <form onSubmit={handlePayBill} className="bill-form">
          <div className="form-group">
            <label>Select Biller:</label>
            <select 
              value={selectedBiller}
              onChange={(e) => setSelectedBiller(e.target.value)}
              required
            >
              <option value="">Choose a biller</option>
              {billers.map(biller => (
                <option key={biller.id} value={biller.name}>
                  {biller.name} - {biller.accountNumber}
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
            />
          </div>

          <div className="form-group">
            <label>Payment Method:</label>
            <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
              <option value="immediate">Pay Now</option>
              <option value="scheduled">Schedule Payment</option>
              <option value="recurring">Set Recurring</option>
            </select>
          </div>

          <button type="submit" disabled={loading} className="btn-pay-bill">
            {loading ? 'Processing...' : 'Pay Bill'}
          </button>
        </form>
      ) : (
        <div className="payment-success">
          <div className="success-icon">✓</div>
          <h4>Payment Successful!</h4>
          <p>Bill ID: {success.billId}</p>
          <p>Amount: ${success.amount}</p>
          <p>Biller: {success.biller}</p>
          <button onClick={() => setSuccess(null)} className="btn-new-payment">
            Make Another Payment
          </button>
        </div>
      )}
    </div>
  );
}

export default BillPaymentService;
