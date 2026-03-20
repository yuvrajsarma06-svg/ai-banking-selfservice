import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Volume1, Volume2, Bot, User, Send, ServerCrash } from 'lucide-react';
import useVoiceChat from '../hooks/useVoiceChat';
import { io } from 'socket.io-client';
import '../styles/ChatService.css';

function ChatService({ email }) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [conversationId, setConversationId] = useState(null);
  const [error, setError] = useState(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [agentConnected, setAgentConnected] = useState(false);
  const [waitingForAgent, setWaitingForAgent] = useState(false);
  const messagesEndRef = useRef(null);
  const [botReply, setBotReply] = useState('');
  const [socket, setSocket] = useState(null);

  const { input, setInput, listening: isListening, toggleMic: toggleMicrophone } = useVoiceChat(
    (text) => handleSendMessageWithVoice(text),
    botReply
  );

  // Text to speech function
  const speakText = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1;
      utterance.pitch = 1;
      utterance.volume = 1;

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      window.speechSynthesis.speak(utterance);
    }
  };


  // Toggle text-to-speech for bot messages
  const toggleSpeak = (text) => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    } else {
      speakText(text);
    }
  };

  // Request agent connection
  const requestAgent = async () => {
    setWaitingForAgent(true);
    try {
      const response = await fetch('http://localhost:5002/escalate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversationId,
          userId: email,
          reason: 'User requested human agent'
        })
      });
      const data = await response.json();

      if (data.success) {
        if (data.queued) {
          setMessages(prev => [...prev, {
            id: prev.length + 1,
            sender: 'bot',
            text: `All agents are currently busy. Your position in queue: ${data.queuePosition}. Estimated wait time: ${data.estimatedWait}. We'll connect you shortly.`,
            timestamp: new Date()
          }]);
        }
        // If connected immediately, the 'agent_joined' socket event will handle the UI update
      }
    } catch (err) {
      setMessages(prev => [...prev, {
        id: prev.length + 1,
        sender: 'bot',
        text: 'Sorry, could not connect to an agent. Please try again later.',
        timestamp: new Date()
      }]);
    }
    setWaitingForAgent(false);
  };

  // Local fallback responses when backend is unavailable
  const getLocalResponse = (message) => {
    const msg = message.toLowerCase();

    // Greetings
    if (msg.includes('hi') || msg.includes('hello') || msg.includes('hey') || msg.includes('start') || msg.includes('begin')) {
      return `Hello! Welcome to our Banking AI Assistant! 🏦

📋 AVAILABLE SERVICES:

1. 💰 Transfers - Send money to any account
2. 📊 Account Balance - Check your account balance  
3. 📋 Mini Statement - View recent transactions
4. 💳 Bill Payments - Pay your bills online
5. 🎫 Card Management - Block/reissue cards
6. 📄 Cheque Book - Request cheque book
7. 🏠 Loan Services - Check eligibility & apply
8. 🎟️ Queue Token - Get branch queue token
9. 💬 Chat with Agent - Talk to a human agent

How may I assist you today?`;
    }

    // Transfer related
    if (msg.includes('transfer') || msg.includes('send money') || msg.includes('neft') || msg.includes('rtgs') || msg.includes('upi')) {
      return `💰 Money Transfer Service

You can transfer money through:
• UPI - Instant transfer up to ₹1 lakh
• NEFT - 24x7 transfer
• RTGS - For large amounts above ₹2 lakh

To proceed, please tell me:
1. Amount you want to transfer
2. Recipient's account number or UPI ID`;
    }

    // Account Balance
    if (msg.includes('balance') || msg.includes('account balance') || msg.includes('how much')) {
      return `📊 Account Balance Service

Your linked account details:
• Account Number: XXXXX1234
• Current Balance: ₹15,750.50
• Available Balance: ₹15,750.50`;
    }

    // Statement
    if (msg.includes('statement') || msg.includes('transaction') || msg.includes('history')) {
      return `📋 Mini Statement - Last 5 Transactions:

1. 📥 Cr - UPI from VIRTUAL_ID - ₹5,000
2. 📤 Dr - ATM Withdrawal - ₹10,000
3. 📥 Cr - Salary Credit - ₹75,000
4. 📤 Dr - Bill Payment - ₹1,500
5. 📥 Cr - Refund - ₹2,500`;
    }

    // Bill Payments
    if (msg.includes('bill') || msg.includes('payment')) {
      return `💳 Bill Payment Service

You can pay:
1. 📱 Mobile Recharge
2. ⚡ Electricity Bill
3. 💧 Water Bill
4. 🔥 Gas Bill
5. 📺 DTH / Cable TV

Which bill would you like to pay?`;
    }

    // Card
    if (msg.includes('card') || msg.includes('debit') || msg.includes('block')) {
      return `🎫 Card Management Service

Your Debit Card: XXXXX5678
• Card Type: Platinum Debit Card
• Valid Till: 12/27

Available Actions:
1. Block Card
2. Reissue Card
3. Set Limit
4. PIN Services`;
    }

    // Loan
    if (msg.includes('loan') || msg.includes('eligibility')) {
      return `🏠 Loan Services

We offer:
1. 🏠 Home Loan - Starting 8.50% p.a.
2. 🚗 Car Loan - Starting 9.00% p.a.
3. 🎓 Education Loan - Starting 10.00% p.a.
4. 💰 Personal Loan - Starting 11.00% p.a.

Which loan would you like to know more about?`;
    }

    // Help
    if (msg.includes('help') || msg.includes('what can you do')) {
      return `I can help you with:

💰 Transfers - Send money
📊 Balance - Check account balance
📋 Statement - View transactions
💳 Bills - Pay bills
🎫 Cards - Manage debit/credit cards
📄 Cheque - Request cheque book
🏠 Loans - Check eligibility
🎟️ Queue - Get branch token

Just tell me what you'd like to do!`;
    }

    // Thank you
    if (msg.includes('thank')) {
      return `You're welcome! 😊

Is there anything else I can help you with today?`;
    }

    // Goodbye
    if (msg.includes('bye') || msg.includes('goodbye') || msg.includes('quit')) {
      return `Thank you for using our Banking AI Assistant! 👋

Have a great day! Goodbye!`;
    }

    // Default fallback
    return `I understand you're asking about "${message}". 

I can help you with:
• Money Transfers
• Account Balance
• Bill Payments
• Card Management
• Loan Services
• And more!

Could you please clarify which service you'd like to use?`;
  };

  // Initialize conversation on mount
  useEffect(() => {
    const startConversation = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:5002/conversations/start', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: email })
        });
        const data = await response.json();
        setConversationId(data.conversationId);

        // Add welcome message with services menu
        setMessages([{
          id: 1,
          sender: 'bot',
          text: data.response || `Hello! Welcome to our Banking AI Assistant! 🏦

📋 AVAILABLE SERVICES:

1. 💰 Transfers - Send money to any account
2. 📊 Account Balance - Check your account balance  
3. 📋 Mini Statement - View recent transactions
4. 💳 Bill Payments - Pay your bills online
5. 🎫 Card Management - Block/reissue cards
6. 📄 Cheque Book - Request cheque book
7. 🏠 Loan Services - Check eligibility & apply
8. 🎟️ Queue Token - Get branch queue token
9. 💬 Chat with Agent - Talk to a human agent

How may I assist you today?`,
          timestamp: new Date()
        }]);
      } catch (err) {
        // Use local fallback when backend is unavailable
        console.log('Backend unavailable, using local response:', err.message);
        setConversationId('local_' + Date.now());
        setMessages([{
          id: 1,
          sender: 'bot',
          text: getLocalResponse('hello'),
          timestamp: new Date()
        }]);
      } finally {
        setLoading(false);
      }
    };

    startConversation();

    // Initialize socket
    const newSocket = io('http://localhost:5002');
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [email]);

  // Listen for socket events
  useEffect(() => {
    if (!socket || !conversationId || conversationId.startsWith('local_')) return;

    socket.emit('join_conversation', conversationId);

    const handleNewMessage = (msg) => {
      setMessages(prev => {
        const senderMap = { 'bot': 'bot', 'user': 'user', 'agent': 'agent' };
        const mappedSender = senderMap[msg.role] || 'bot';

        // Simple deduplication since locally added messages and HTTP responses might duplicate with broadcast
        const recentMessages = prev.slice(-5);
        if (recentMessages.some(m => m.text === msg.content && m.sender === mappedSender)) {
          return prev;
        }

        // If it's an agent message, make sure agentConnected is true
        if (mappedSender === 'agent') setAgentConnected(true);

        return [...prev, {
          id: prev.length + 1,
          sender: mappedSender,
          text: msg.content,
          timestamp: new Date(msg.timestamp)
        }];
      });
    };

    const handleAgentJoined = (data) => {
      setAgentConnected(true);
      setMessages(prev => {
        const joinText = `✅ Connected with ${data.agentName}. They will assist you shortly.`;
        if (prev.some(m => m.text === joinText)) return prev;
        return [...prev, {
          id: prev.length + 1,
          sender: 'system',
          text: joinText,
          timestamp: new Date()
        }];
      });
    };

    socket.on('new_message', handleNewMessage);
    socket.on('agent_joined', handleAgentJoined);

    return () => {
      socket.off('new_message', handleNewMessage);
      socket.off('agent_joined', handleAgentJoined);
    };
  }, [socket, conversationId]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle message send with text
  const handleSendMessageWithText = async (text) => {
    if (!text.trim()) return;

    // Add user message
    const userMessage = {
      id: messages.length + 1,
      sender: 'user',
      text: text,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5002/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversationId,
          message: text,
          userId: email
        })
      });

      const data = await response.json();

      // Add bot response ONLY if there is one (prevents bot from talking during agent chat)
      if (data.response) {
        setMessages(prev => {
          const lastMsg = prev[prev.length - 1];
          if (lastMsg && lastMsg.sender === 'bot' && lastMsg.text === data.response) return prev;
          return [
            ...prev,
            { id: prev.length + 1, sender: 'bot', text: data.response, timestamp: new Date() }
          ];
        });
      }
    } catch (err) {
      // Use local fallback response when backend is unavailable
      console.log('Backend unavailable, using local response:', err.message);
      const localResponse = getLocalResponse(text);
      if (localResponse) {
        setMessages(prev => {
          const lastMsg = prev[prev.length - 1];
          if (lastMsg && lastMsg.sender === 'bot' && lastMsg.text === localResponse) return prev;
          return [
            ...prev,
            { id: prev.length + 1, sender: 'bot', text: localResponse, timestamp: new Date() }
          ];
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessageWithVoice = async (text) => {
    if (!text.trim()) return;

    // If agent is connected, treat voice just like a regular text message directly to the agent.
    if (agentConnected) {
      await handleSendMessageWithText(text);
      return;
    }

    const userMessage = {
      id: messages.length + 1,
      sender: 'user',
      text: text,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5005/v1/voice/process-speech', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          callId: conversationId || 'CALL' + Date.now(),
          audioData: text
        })
      });

      const data = await response.json();

      const botResponseText = data.response || 'I understood your voice message.';
      setMessages(prev => {
        const lastMsg = prev[prev.length - 1];
        if (lastMsg && lastMsg.sender === 'bot' && lastMsg.text === botResponseText) return prev;
        return [...prev, {
          id: prev.length + 1,
          sender: 'bot',
          text: botResponseText,
          timestamp: new Date()
        }];
      });
      window.speechSynthesis.cancel();
      setBotReply(botResponseText);
    } catch (err) {
      console.log('Voice backend unavailable, using local response:', err.message);
      const localResponse = getLocalResponse(text);
      setMessages(prev => {
        const lastMsg = prev[prev.length - 1];
        if (lastMsg && lastMsg.sender === 'bot' && lastMsg.text === localResponse) return prev;
        return [...prev, {
          id: prev.length + 1,
          sender: 'bot',
          text: localResponse,
          timestamp: new Date()
        }];
      });
      window.speechSynthesis.cancel();
      setBotReply(localResponse);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    await handleSendMessageWithText(input);
  };

  return (
    <div className={`chat-service ${agentConnected ? 'agent-connected' : ''}`}>
      <div className="chat-header">
        <h3><Bot size={24} /> AI Support</h3>
        {!agentConnected && !waitingForAgent && (
          <button
            className="btn-agent"
            onClick={requestAgent}
            disabled={waitingForAgent}
          >
            Connect to Agent
          </button>
        )}
        {waitingForAgent && <span className="waiting-text">Connecting to agent...</span>}
      </div>

      <div className="messages-container">
        {error && <div className="error-message">{error}</div>}
        {messages.map((msg) => (
          <div key={msg.id} className={`message message-${msg.sender}`}>
            <div className="message-content">
              <p style={{ whiteSpace: 'pre-wrap' }}>{msg.text}</p>
              <div className="message-actions">
                <span className="message-time">
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
                {msg.sender === 'bot' && (
                  <button
                    className="btn-speak"
                    onClick={() => toggleSpeak(msg.text)}
                    title={isSpeaking ? 'Stop' : 'Listen'}
                  >
                    {isSpeaking ? <Volume2 size={16} /> : <Volume1 size={16} />}
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
        {loading && (
          <div className="message message-bot">
            <div className="message-content">
              <p className="typing-indicator">
                <span></span><span></span><span></span>
              </p>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSendMessage} className="chat-form">
        <button
          type="button"
          onClick={toggleMicrophone}
          className={`btn-mic ${isListening ? 'listening' : ''}`}
          title={isListening ? 'Listening...' : 'Click to speak'}
          disabled={loading}
        >
          {isListening ? <Mic size={20} /> : <MicOff size={20} />}
        </button>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={isListening ? "Listening..." : agentConnected ? "Message the agent..." : "Type your message..."}
          disabled={loading || isListening}
          className="chat-input"
        />
        <button type="submit" disabled={loading || isListening || !input.trim()} className="btn-send">
          <Send size={18} />
        </button>
      </form>
    </div>
  );
}

export default ChatService;

