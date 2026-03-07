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
    
    // Poll for new chats every 5 seconds
    const interval = setInterval(fetchActiveChats, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchActiveChats = async () => {
    try {
      // In real app, this would fetch from backend
      // For demo, we'll create mock data if empty
      const mockChats = [
        {
          id: 'CONV_001',
          userId: 'user1@example.com',
          userName: 'John Doe',
          lastMessage: 'I want to check my account balance',
          timestamp: new Date(),
          unread: true,
          messages: [
            { sender: 'user', text: 'Hello, I need help', time: new Date(Date.now() - 60000) },
            { sender: 'bot', text: 'How can I assist you today?', time: new Date(Date.now() - 50000) },
            { sender: 'user', text: 'I want to check my account balance', time: new Date(Date.now() - 10000) }
          ]
        },
        {
          id: 'CONV_002',
          userId: 'user2@example.com',
          userName: 'Jane Smith',
          lastMessage: 'How do I apply for a home loan?',
          timestamp: new Date(Date.now() - 300000),
          unread: true,
          messages: [
            { sender: 'user', text: 'Hi, I\'m interested in home loans', time: new Date(Date.now() - 400000) },
            { sender: 'bot', text: 'I can help with that. What type of home loan are you looking for?', time: new Date(Date.now() - 350000) },
            { sender: 'user', text: 'How do I apply for a home loan?', time: new Date(Date.now() - 300000) }
          ]
        },
        {
          id: 'CONV_003',
          userId: 'user3@example.com',
          userName: 'Mike Johnson',
          lastMessage: 'My card is not working',
          timestamp: new Date(Date.now() - 600000),
          unread: false,
          messages: [
            { sender: 'user', text: 'My ATM card is not working', time: new Date(Date.now() - 700000) },
            { sender: 'bot', text: 'I\'m sorry to hear that. Let me help you with card issues.', time: new Date(Date.now() - 650000) },
            { sender: 'user', text: 'It shows declined every time I try to use it', time: new Date(Date.now() - 620000) },
            { sender: 'bot', text: 'Let me check your card status. Please hold on.', time: new Date(Date.now() - 610000) },
            { sender: 'user', text: 'My card is not working', time: new Date(Date.now() - 600000) }
          ]
        }
      ];
      
      setActiveChats(mockChats);
      if (mockChats.length > 0 && !selectedChat) {
        setSelectedChat(mockChats[0]);
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

  const handleSendReply = (e) => {
    e.preventDefault();
    if (!replyText.trim() || !selectedChat) return;

    const newMessage = {
      sender: 'agent',
      text: replyText,
      time: new Date()
    };

    // Update the selected chat with the new message
    const updatedChats = activeChats.map(chat => {
      if (chat.id === selectedChat.id) {
        return {
          ...chat,
          messages: [...chat.messages, newMessage],
          lastMessage: replyText,
          timestamp: new Date()
        };
      }
      return chat;
    });

    setActiveChats(updatedChats);
    setSelectedChat(updatedChats.find(c => c.id === selectedChat.id));
    setReplyText('');
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

