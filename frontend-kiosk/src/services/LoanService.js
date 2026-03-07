import React, { useState } from 'react';
import '../styles/LoanService.css';

function LoanService({ email }) {
  const [loanType, setLoanType] = useState('personal');
  const [loanAmount, setLoanAmount] = useState('');
  const [tenure, setTenure] = useState('24');
  const [currentStep, setCurrentStep] = useState('type'); // type, eligibility, apply, confirmation
  const [eligibilityResult, setEligibilityResult] = useState(null);
  const [applicationResult, setApplicationResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const loanTypes = [
    { id: 'personal', name: 'Personal Loan', image: '👤', minAmount: 5000, maxAmount: 500000 },
    { id: 'home', name: 'Home Loan', image: '🏠', minAmount: 100000, maxAmount: 5000000 },
    { id: 'auto', name: 'Auto Loan', image: '🚗', minAmount: 50000, maxAmount: 2000000 },
    { id: 'education', name: 'Education Loan', image: '🎓', minAmount: 25000, maxAmount: 1000000 }
  ];

  const checkEligibility = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5002/loan-eligibility', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: email,
          loanAmount: parseFloat(loanAmount),
          loanType
        })
      });

      const data = await response.json();
      setEligibilityResult(data);
      setCurrentStep(data.eligible ? 'apply' : 'eligibility');
    } catch (err) {
      console.error('Error checking eligibility');
    } finally {
      setLoading(false);
    }
  };

  const applyForLoan = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5002/loan-apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: email,
          loanAmount: parseFloat(loanAmount),
          loanType,
          tenure: parseInt(tenure)
        })
      });

      const data = await response.json();
      setApplicationResult(data);
      setCurrentStep('confirmation');
    } catch (err) {
      console.error('Error applying for loan');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="loan-service">
      <h3>💰 Loan Services</h3>

      {currentStep === 'type' && (
        <div className="loan-selection">
          <p className="step-intro">Select the type of loan you're interested in:</p>
          <div className="loan-types-grid">
            {loanTypes.map(type => (
              <div 
                key={type.id}
                className={`loan-type-card ${loanType === type.id ? 'selected' : ''}`}
                onClick={() => setLoanType(type.id)}
              >
                <div className="loan-image">{type.image}</div>
                <h4>{type.name}</h4>
                <p>Up to ₹{(type.maxAmount / 100000).toFixed(0)}L</p>
              </div>
            ))}
          </div>

          <div className="loan-amount-section">
            <label>Loan Amount:</label>
            <input
              type="number"
              value={loanAmount}
              onChange={(e) => setLoanAmount(e.target.value)}
              placeholder="Enter desired amount"
              min="0"
            />
          </div>

          <button 
            onClick={checkEligibility}
            disabled={!loanAmount || loading}
            className="btn-check-eligibility"
          >
            {loading ? 'Checking...' : 'Check Eligibility'}
          </button>
        </div>
      )}

      {currentStep === 'eligibility' && eligibilityResult && (
        <div className="eligibility-result">
          <div className={`result-icon ${eligibilityResult.eligible ? 'approved' : 'rejected'}`}>
            {eligibilityResult.eligible ? '✓' : '✗'}
          </div>
          <h4>{eligibilityResult.message}</h4>
          
          <div className="eligibility-details">
            <p><strong>Credit Score:</strong> {eligibilityResult.creditScore}</p>
            <p><strong>Max Eligible Amount:</strong> ₹{eligibilityResult.maxLoanAmount}</p>
            {eligibilityResult.eligible && (
              <p><strong>Estimated Interest Rate:</strong> {eligibilityResult.estimatedRate}</p>
            )}
          </div>

          <button 
            onClick={() => {
              if (eligibilityResult.eligible) {
                setCurrentStep('apply');
              } else {
                setCurrentStep('type');
              }
            }}
            className="btn-next"
          >
            {eligibilityResult.eligible ? 'Continue to Application' : 'Try Another Amount'}
          </button>
        </div>
      )}

      {currentStep === 'apply' && (
        <div className="loan-application">
          <h4>Complete Your Application</h4>
          
          <div className="app-details">
            <p><strong>Loan Type:</strong> {loanTypes.find(t => t.id === loanType)?.name}</p>
            <p><strong>Amount Requested:</strong> ₹{parseFloat(loanAmount).toLocaleString()}</p>
          </div>

          <div className="form-group">
            <label>Tenure (months):</label>
            <select value={tenure} onChange={(e) => setTenure(e.target.value)}>
              <option value="12">12 months</option>
              <option value="24">24 months</option>
              <option value="36">36 months</option>
              <option value="48">48 months</option>
              <option value="60">60 months</option>
            </select>
          </div>

          <div className="emi-preview">
            <h5>Estimated Monthly Payment (EMI)</h5>
            <p className="emi-amount">
              ₹{Math.floor(parseFloat(loanAmount) / parseInt(tenure) * 1.1).toLocaleString()}/month
            </p>
          </div>

          <button 
            onClick={applyForLoan}
            disabled={loading}
            className="btn-submit-application"
          >
            {loading ? 'Submitting...' : 'Submit Application'}
          </button>
          <button 
            onClick={() => setCurrentStep('type')}
            className="btn-back-loan"
          >
            ← Back
          </button>
        </div>
      )}

      {currentStep === 'confirmation' && applicationResult && (
        <div className="application-confirmation">
          <div className="confirmation-icon">✓</div>
          <h4>Application Submitted Successfully!</h4>
          
          <div className="confirmation-details">
            <p><strong>Application ID:</strong> {applicationResult.applicationId}</p>
            <p><strong>Status:</strong> {applicationResult.status}</p>
            <p><strong>Loan Amount:</strong> ₹{parseFloat(loanAmount).toLocaleString()}</p>
            <p><strong>Estimated Approval Time:</strong> {applicationResult.estimatedApprovalTime}</p>
          </div>

          <p className="info-message">
            We will review your application and send you an update within the estimated timeframe.
          </p>

          <button 
            onClick={() => {
              setCurrentStep('type');
              setLoanAmount('');
              setApplicationResult(null);
            }}
            className="btn-new-application"
          >
            Apply for Another Loan
          </button>
        </div>
      )}
    </div>
  );
}

export default LoanService;
