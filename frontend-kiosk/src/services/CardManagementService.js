import React, { useState, useEffect } from 'react';
import '../styles/CardManagementService.css';

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
      console.error('Error loading cards');
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
        setAction(null);
      }
    } catch (err) {
      console.error('Error blocking card');
    }
  };

  const handleReissueCard = async (cardId) => {
    try {
      const response = await fetch(`http://localhost:5003/cards/${cardId}/reissue`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });

      const data = await response.json();
      if (data.success) {
        setAction({
          type: 'reissued',
          message: data.message,
          deliveryAddress: data.deliveryAddress
        });
      }
    } catch (err) {
      console.error('Error reissuing card');
    }
  };

  if (loading) return <div className="card-loading">Loading cards...</div>;

  return (
    <div className="card-management-service">
      <h3>💳 Card Management</h3>

      {!selectedCard ? (
        <div className="cards-list">
          {cards.map(card => (
            <div key={card.id} className="card-item">
              <div className="card-icon">💳</div>
              <div className="card-info">
                <div className="card-number">{card.number}</div>
                <div className="card-type">{card.type} Card</div>
                <div className="card-expiry">Expires: {card.expiry}</div>
              </div>
              <div className="card-status">
                <span className={`status-badge ${card.status.toLowerCase()}`}>
                  {card.status}
                </span>
              </div>
              <button onClick={() => setSelectedCard(card)} className="btn-manage">
                Manage →
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="card-details">
          <button onClick={() => setSelectedCard(null)} className="btn-back-card">
            ← Back to Cards
          </button>

          <div className="selected-card">
            <h4>{selectedCard.type} Card - {selectedCard.number}</h4>
            <p>Status: <strong>{selectedCard.status}</strong></p>
            <p>Expires: {selectedCard.expiry}</p>
          </div>

          {!action ? (
            <div className="card-actions">
              <button 
                onClick={() => handleBlockCard(selectedCard.id)}
                className="btn-block-card"
              >
                🔒 Block Card
              </button>
              <button 
                onClick={() => handleReissueCard(selectedCard.id)}
                className="btn-reissue-card"
              >
                🔄 Reissue Card
              </button>
              <button className="btn-set-limit">
                💰 Set Spending Limit
              </button>
            </div>
          ) : (
            <div className="action-result">
              <div className="success-checkmark">✓</div>
              <p className="result-message">{action.message}</p>
              {action.deliveryAddress && (
                <p className="delivery-info">Delivery: {action.deliveryAddress}</p>
              )}
              <button onClick={() => setAction(null)} className="btn-done">
                Done
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default CardManagementService;
