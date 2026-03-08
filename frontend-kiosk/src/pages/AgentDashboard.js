import React, { useState, useEffect } from 'react';
import '../styles/AgentDashboard.css';

function AgentDashboard() {
  const [agentId, setAgentId] = useState('');
  const [agentName, setAgentName] = useState('');
  const [activeChats, setActiveChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (activeChats.length > 0 && !selectedChat) {
      setSelectedChat(activeChats[0]);
    }
  }, [activeChats, selectedChat]);

  useEffect(() => {
    // Check if agent is logged in
    const storedAgentId = sessionStorage.getItem('agentId');
    const storedAgentName = sessionStorage.getItem('agentName');
    const isLoggedIn = sessionStorage.getItem('isAgentLoggedIn');

    if (!isLoggedIn || !storedAgentId) {
      window.location.hash = '#/agent-login';
      return;
    }

    setAgentId(storedAgentId);
    setAgentName(storedAgentName);

    // Simulate fetching active chats from server
    fetchActiveChats();

    // Poll for new chats every 1.5 seconds
    const interval = setInterval(fetchActiveChats, 1500);
    return () => clearInterval(interval);
  }, []);

  const fetchActiveChats = async () => {
    try {
      const storedAgentId = sessionStorage.getItem('agentId');
      const response = await fetch(`http://localhost:5002/agent/${storedAgentId}/chats`);
      const data = await response.json();

      if (data.success && data.chats) {
        // Parse dates from strings for consistency with existing UI
        const formattedChats = data.chats.map(chat => ({
          ...chat,
          timestamp: new Date(chat.timestamp),
          messages: chat.messages.map(m => ({
            ...m,
            time: new Date(m.time)
          }))
        }));

        setActiveChats(formattedChats);

        // If we have a selected chat, strictly update its reference so the view re-renders fresh messages
        setSelectedChat(prevSelected => {
          if (prevSelected) {
            const updatedMatchedChat = formattedChats.find(c => c.id === prevSelected.id);
            return updatedMatchedChat || prevSelected;
          }
          return null;
        });
      }
    } catch (error) {
      console.error('Error fetching chats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.clear();
    window.location.hash = '#/agent-login';
  };

  const handleSendReply = async (e) => {
    e.preventDefault();
    if (!replyText.trim() || !selectedChat) return;

    const messageText = replyText;
    setReplyText(''); // Optimistically clear input

    try {
      await fetch('http://localhost:5002/agent/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversationId: selectedChat.id,
          message: messageText,
          agentId: agentId
        })
      });

      // Fetch fresh chats to update UI immediately
      fetchActiveChats();
    } catch (error) {
      console.error('Error sending reply:', error);
      alert('Failed to send message. Please try again.');
    }
  };

  if (isLoading) {
    return (
      <div className="agent-dashboard">
        <div className="loading">Loading...</div>
      </div>
    );
  }

  return (
    <div className="agent-dashboard">
      <header className="agent-header">
        <div className="agent-info">
          <h1>👨‍💼 Agent Dashboard</h1>
          <span className="agent-name">Logged in as: {agentName} ({agentId})</span>
        </div>
        <button onClick={handleLogout} className="btn-logout">
          Logout
        </button>
      </header>

      <div className="agent-content">
        <div className="chat-list">
          <h2>Active Chats ({activeChats.length})</h2>
          <div className="chat-items">
            {activeChats.map(chat => (
              <div
                key={chat.id}
                className={`chat-item ${selectedChat?.id === chat.id ? 'active' : ''} ${chat.unread ? 'unread' : ''}`}
                onClick={() => setSelectedChat(chat)}
              >
                <div className="chat-item-header">
                  <span className="user-name">{chat.userName}</span>
                  <span className="chat-time">
                    {chat.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className="last-message">{chat.lastMessage}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="chat-view">
          {selectedChat ? (
            <>
              <div className="chat-view-header">
                <div className="user-info">
                  <h3>{selectedChat.userName}</h3>
                  <span className="user-id">{selectedChat.userId}</span>
                </div>
                <span className="conversation-id">ID: {selectedChat.id}</span>
              </div>

              <div className="messages-area">
                {selectedChat.messages.map((msg, index) => (
                  <div key={index} className={`message message-${msg.sender}`}>
                    <div className="message-bubble">
                      <span className="message-sender">
                        {msg.sender === 'user' ? selectedChat.userName : agentName}
                      </span>
                      <p>{msg.text}</p>
                      <span className="message-time">
                        {msg.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <form onSubmit={handleSendReply} className="reply-form">
                <input
                  type="text"
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Type your reply..."
                  className="reply-input"
                />
                <button type="submit" className="btn-reply" disabled={!replyText.trim()}>
                  Send Reply
                </button>
              </form>
            </>
          ) : (
            <div className="no-chat-selected">
              <p>Select a chat to start responding</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AgentDashboard;

