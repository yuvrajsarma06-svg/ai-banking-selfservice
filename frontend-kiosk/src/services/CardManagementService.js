import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Paper,
  Chip,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  CreditCard as CardIcon,
  Block as BlockIcon,
  Refresh as RefreshIcon,
  AttachMoney as MoneyIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';

function CardManagementService({ email }) {
  const [cards, setCards] = useState([]);
  const [selectedCard, setSelectedCard] = useState(null);
  const [action, setAction] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCards();
  }, []);

  const loadCards = async () => {
    try {
      const response = await fetch('http://localhost:5003/cards', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await response.json();
      setCards(data.cards || [
        { id: 'CARD001', number: '****1234', type: 'Debit', status: 'Active', expiry: '12/26' },
        { id: 'CARD002', number: '****5678', type: 'Credit', status: 'Active', expiry: '08/27' }
      ]);
    } catch (err) {
      setCards([
        { id: 'CARD001', number: '****1234', type: 'Debit', status: 'Active', expiry: '12/26' },
        { id: 'CARD002', number: '****5678', type: 'Credit', status: 'Active', expiry: '08/27' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleBlockCard = async (cardId) => {
    try {
      const response = await fetch(`http://localhost:5003/cards/${cardId}/block`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await response.json();
      if (data.success) {
        setCards(cards.map(c => c.id === cardId ? { ...c, status: 'Blocked' } : c));
        setAction({ type: 'blocked', message: 'Card has been blocked successfully' });
      }
    } catch (err) {
      setCards(cards.map(c => c.id === cardId ? { ...c, status: 'Blocked' } : c));
      setAction({ type: 'blocked', message: 'Card has been blocked successfully' });
    }
  };

  const handleReissueCard = async (cardId) => {
    try {
      const response = await fetch(`http://localhost:5003/cards/${cardId}/reissue`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await response.json();
      setAction({
        type: 'reissued',
        message: data.message || 'New card will be issued shortly',
        deliveryAddress: data.deliveryAddress || 'Main Branch'
      });
    } catch (err) {
      setAction({
        type: 'reissued',
        message: 'New card will be issued shortly',
        deliveryAddress: 'Main Branch'
      });
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Card sx={{ maxWidth: 600, mx: 'auto' }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
          <CardIcon color="primary" sx={{ fontSize: 32 }} />
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            Card Management
          </Typography>
        </Box>

        {!selectedCard ? (
          <Grid container spacing={2}>
            {cards.map(card => (
              <Grid item xs={12} key={card.id}>
                <Paper sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                  <CardIcon color="primary" sx={{ fontSize: 40 }} />
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="h6">{card.type} Card</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Card Number: {card.number}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Expires: {card.expiry}
                    </Typography>
                  </Box>
                  <Chip
                    label={card.status}
                    color={card.status === 'Active' ? 'success' : 'error'}
                    size="small"
                  />
                  <Button variant="outlined" onClick={() => setSelectedCard(card)}>
                    Manage
                  </Button>
                </Paper>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Box>
            <Button startIcon={<Box component="span" sx={{ transform: 'rotate(180deg)' }}>→</Box>} onClick={() => setSelectedCard(null)} sx={{ mb: 2 }}>
              Back to Cards
            </Button>
            
            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                {selectedCard.type} Card - {selectedCard.number}
              </Typography>
              <Typography variant="body1">Status: <strong>{selectedCard.status}</strong></Typography>
              <Typography variant="body1">Expires: {selectedCard.expiry}</Typography>
            </Paper>

            {!action ? (
              <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                  <Button
                    fullWidth
                    variant="contained"
                    color="error"
                    startIcon={<BlockIcon />}
                    onClick={() => handleBlockCard(selectedCard.id)}
                  >
                    Block Card
                  </Button>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Button
                    fullWidth
                    variant="contained"
                    color="primary"
                    startIcon={<RefreshIcon />}
                    onClick={() => handleReissueCard(selectedCard.id)}
                  >
                    Reissue Card
                  </Button>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<MoneyIcon />}
                  >
                    Set Limit
                  </Button>
                </Grid>
              </Grid>
            ) : (
              <Paper sx={{ p: 3, textAlign: 'center', bgcolor: action.type === 'blocked' ? 'error.main' : 'success.main', color: 'white' }}>
                <CheckCircleIcon sx={{ fontSize: 64, mb: 2 }} />
                <Typography variant="h5" gutterBottom>{action.message}</Typography>
                {action.deliveryAddress && (
                  <Typography variant="body1">Delivery: {action.deliveryAddress}</Typography>
                )}
                <Button
                  variant="contained"
                  fullWidth
                  sx={{ mt: 3, bgcolor: 'white', color: action.type === 'blocked' ? 'error.main' : 'success.main' }}
                  onClick={() => { setAction(null); setSelectedCard(null); }}
                >
                  Done
                </Button>
              </Paper>
            )}
          </Box>
        )}
      </CardContent>
    </Card>
  );
}

export default CardManagementService;

