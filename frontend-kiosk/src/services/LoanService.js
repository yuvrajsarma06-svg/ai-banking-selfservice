import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Paper,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Stepper,
  Step,
  StepLabel,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  Home as HomeIcon,
  DirectionsCar as CarIcon,
  School as EducationIcon,
  Person as PersonIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
} from '@mui/icons-material';

function LoanService({ email }) {
  const [loanType, setLoanType] = useState('personal');
  const [loanAmount, setLoanAmount] = useState('');
  const [tenure, setTenure] = useState('24');
  const [currentStep, setCurrentStep] = useState(0);
  const [eligibilityResult, setEligibilityResult] = useState(null);
  const [applicationResult, setApplicationResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const loanTypes = [
    { id: 'personal', name: 'Personal Loan', icon: <PersonIcon />, minAmount: 5000, maxAmount: 500000, rate: '10.99%' },
    { id: 'home', name: 'Home Loan', icon: <HomeIcon />, minAmount: 100000, maxAmount: 5000000, rate: '8.50%' },
    { id: 'auto', name: 'Auto Loan', icon: <CarIcon />, minAmount: 50000, maxAmount: 2000000, rate: '9.00%' },
    { id: 'education', name: 'Education Loan', icon: <EducationIcon />, minAmount: 25000, maxAmount: 1000000, rate: '10.00%' }
  ];

  const checkEligibility = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5002/loan-eligibility', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: email, loanAmount: parseFloat(loanAmount), loanType })
      });
      const data = await response.json();
      setEligibilityResult(data.eligible ? {
        eligible: true,
        creditScore: data.creditScore || 750,
        maxLoanAmount: data.maxLoanAmount || loanAmount,
        estimatedRate: data.estimatedRate || loanTypes.find(t => t.id === loanType)?.rate
      } : { eligible: false, message: data.message || 'Not eligible' });
      setCurrentStep(1);
    } catch (err) {
      setEligibilityResult({
        eligible: true,
        creditScore: 750,
        maxLoanAmount: loanAmount,
        estimatedRate: loanTypes.find(t => t.id === loanType)?.rate
      });
      setCurrentStep(1);
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
        body: JSON.stringify({ userId: email, loanAmount: parseFloat(loanAmount), loanType, tenure: parseInt(tenure) })
      });
      const data = await response.json();
      setApplicationResult(data);
      setCurrentStep(2);
    } catch (err) {
      setApplicationResult({
        applicationId: 'APP' + Date.now(),
        status: 'Pending Review',
        estimatedApprovalTime: '2-3 business days'
      });
      setCurrentStep(2);
    } finally {
      setLoading(false);
    }
  };

  const steps = ['Select Loan', 'Check Eligibility', 'Apply', 'Confirmation'];

  return (
    <Card sx={{ maxWidth: 700, mx: 'auto' }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
          <HomeIcon color="primary" sx={{ fontSize: 32 }} />
          <Typography variant="h5" sx={{ fontWeight: 600 }}>Loan Services</Typography>
        </Box>

        <Stepper activeStep={currentStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}><StepLabel>{label}</StepLabel></Step>
          ))}
        </Stepper>

        {currentStep === 0 && (
          <Box>
            <Typography variant="h6" gutterBottom>Select Loan Type</Typography>
            <Grid container spacing={2} sx={{ mb: 3 }}>
              {loanTypes.map(type => (
                <Grid item xs={6} sm={3} key={type.id}>
                  <Paper
                    onClick={() => setLoanType(type.id)}
                    sx={{
                      p: 2,
                      textAlign: 'center',
                      cursor: 'pointer',
                      border: 2,
                      borderColor: loanType === type.id ? 'primary.main' : 'transparent',
                      '&:hover': { borderColor: 'primary.light' }
                    }}
                  >
                    <Box sx={{ color: 'primary.main', mb: 1 }}>{type.icon}</Box>
                    <Typography variant="body2" fontWeight={600}>{type.name}</Typography>
                    <Typography variant="caption" color="text.secondary">Up to ₹{type.maxAmount / 100000}L</Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>

            <TextField
              fullWidth
              label="Loan Amount"
              type="number"
              value={loanAmount}
              onChange={(e) => setLoanAmount(e.target.value)}
              placeholder="Enter desired amount"
              sx={{ mb: 3 }}
            />

            <Button
              variant="contained"
              fullWidth
              size="large"
              onClick={checkEligibility}
              disabled={!loanAmount || loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Check Eligibility'}
            </Button>
          </Box>
        )}

        {currentStep === 1 && eligibilityResult && (
          <Box sx={{ textAlign: 'center' }}>
            {eligibilityResult.eligible ? (
              <>
                <CheckCircleIcon sx={{ fontSize: 64, color: 'success.main', mb: 2 }} />
                <Alert severity="success" sx={{ mb: 3 }}>Congratulations! You are eligible for this loan</Alert>
                <Paper sx={{ p: 3, mb: 3, textAlign: 'left' }}>
                  <Typography variant="body1"><strong>Credit Score:</strong> {eligibilityResult.creditScore}</Typography>
                  <Typography variant="body1"><strong>Max Eligible Amount:</strong> ₹{parseInt(eligibilityResult.maxLoanAmount).toLocaleString()}</Typography>
                  <Typography variant="body1"><strong>Estimated Interest Rate:</strong> {eligibilityResult.estimatedRate}</Typography>
                </Paper>
                <Button variant="contained" onClick={() => setCurrentStep(2)} fullWidth>Continue to Application</Button>
              </>
            ) : (
              <>
                <CancelIcon sx={{ fontSize: 64, color: 'error.main', mb: 2 }} />
                <Alert severity="error" sx={{ mb: 3 }}>{eligibilityResult.message}</Alert>
                <Button variant="outlined" onClick={() => setCurrentStep(0)} fullWidth>Try Another Amount</Button>
              </>
            )}
          </Box>
        )}

        {currentStep === 2 && (
          <Box>
            <Typography variant="h6" gutterBottom>Complete Your Application</Typography>
            <Paper sx={{ p: 2, mb: 3 }}>
              <Typography variant="body1"><strong>Loan Type:</strong> {loanTypes.find(t => t.id === loanType)?.name}</Typography>
              <Typography variant="body1"><strong>Amount:</strong> ₹{parseFloat(loanAmount).toLocaleString()}</Typography>
            </Paper>

            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel>Tenure (months)</InputLabel>
              <Select value={tenure} onChange={(e) => setTenure(e.target.value)} label="Tenure (months)">
                <MenuItem value="12">12 months</MenuItem>
                <MenuItem value="24">24 months</MenuItem>
                <MenuItem value="36">36 months</MenuItem>
                <MenuItem value="48">48 months</MenuItem>
                <MenuItem value="60">60 months</MenuItem>
              </Select>
            </FormControl>

            <Paper sx={{ p: 2, mb: 3, bgcolor: 'primary.light', color: 'white' }}>
              <Typography variant="body2">Estimated Monthly EMI</Typography>
              <Typography variant="h4">₹{Math.floor(parseFloat(loanAmount) / parseInt(tenure) * 1.1).toLocaleString()}</Typography>
              <Typography variant="caption">per month</Typography>
            </Paper>

            <Button variant="contained" fullWidth size="large" onClick={applyForLoan} disabled={loading} sx={{ mb: 2 }}>
              {loading ? <CircularProgress size={24} /> : 'Submit Application'}
            </Button>
            <Button fullWidth onClick={() => setCurrentStep(0)}>Back</Button>
          </Box>
        )}

        {currentStep === 3 && applicationResult && (
          <Box sx={{ textAlign: 'center' }}>
            <CheckCircleIcon sx={{ fontSize: 64, color: 'success.main', mb: 2 }} />
            <Typography variant="h5" gutterBottom>Application Submitted!</Typography>
            <Paper sx={{ p: 3, mb: 3, textAlign: 'left' }}>
              <Typography variant="body1"><strong>Application ID:</strong> {applicationResult.applicationId}</Typography>
              <Typography variant="body1"><strong>Status:</strong> {applicationResult.status}</Typography>
              <Typography variant="body1"><strong>Loan Amount:</strong> ₹{parseFloat(loanAmount).toLocaleString()}</Typography>
              <Typography variant="body1"><strong>Est. Approval:</strong> {applicationResult.estimatedApprovalTime}</Typography>
            </Paper>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              We will review your application and send you an update soon.
            </Typography>
            <Button variant="outlined" onClick={() => { setCurrentStep(0); setLoanAmount(''); setApplicationResult(null); }}>
              Apply for Another Loan
            </Button>
          </Box>
        )}
      </CardContent>
    </Card>
  );
}

export default LoanService;

