import React, { useState, useEffect } from 'react';
import useVoiceChat from '../hooks/useVoiceChat';
import '../styles/VoiceService.css';

function VoiceService({ email }) {
  const [callStatus, setCallStatus] = useState('ready');
  const [callId, setCallId] = useState(null);
  const [callDuration, setCallDuration] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [messages, setMessages] = useState([]);
  const [botReply, setBotReply] = useState('');
  const durationRef = React.useRef(null);

  const { input: transcript, setInput: setTranscript, listening, toggleMic, stopMic, startMic } = useVoiceChat(
    (text) => handleProcessSpeech(text),
    botReply
  );

  // Timer for call duration
  useEffect(() => {
    if (callStatus === 'active') {
      durationRef.current = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    } else {
      if (durationRef.current) {
        clearInterval(durationRef.current);
      }
    }

    return () => {
      if (durationRef.current) {
        clearInterval(durationRef.current);
      }
    };
  }, [callStatus]);

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartCall = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('http://localhost:5005/voice/call-start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: email,
          phoneNumber: '+1234567890' // Demo phone
        })
      });

      const data = await response.json();

      if (response.ok || data.success) {
        setCallId(data.callId || 'CALL' + Date.now());
        setCallStatus('active');
        setCallDuration(0);
        setMessages([{
          id: 1,
          type: 'system',
          text: 'Call connected. Speak clearly to interact with voice services.',
          timestamp: new Date()
        }]);
        startMic();
      } else {
        setError(data.error || 'Failed to start call');
      }
    } catch (err) {
      setError('Call initiation error: ' + err.message);
      // Still simulate call for demo
      setCallId('CALL' + Date.now());
      setCallStatus('active');
      setCallDuration(0);
      setMessages([{
        id: 1,
        type: 'system',
        text: 'Call connected. Speak clearly to interact with voice services.',
        timestamp: new Date()
      }]);
      startMic();
    } finally {
      setLoading(false);
    }
  };

  const handleProcessSpeech = async (spokenText) => {
    const textToProcess = typeof spokenText === 'string' ? spokenText : transcript;
    if (!textToProcess.trim()) return;

    try {
      setLoading(true);

      // Add user message
      const userMsg = {
        id: messages.length + 1,
        type: 'user',
        text: textToProcess,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, userMsg]);

      const response = await fetch('http://localhost:5005/process-speech', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          callId: callId,
          speechInput: textToProcess,
          userId: email
        })
      });

      const data = await response.json();

      const replyText = data.response || 'Processing your request...';

      // Add bot response
      const botMsg = {
        id: messages.length + 2,
        type: 'bot',
        text: replyText,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMsg]);
      setBotReply(replyText);

      setTranscript('');
    } catch (err) {
      console.error('Speech processing error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEndCall = async () => {
    try {
      setLoading(true);
      stopMic();

      await fetch('http://localhost:5005/voice/call-end', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          callId: callId,
          duration: callDuration,
          userId: email
        })
      });

      setCallStatus('ended');
      setMessages(prev => [...prev, {
        id: prev.length + 1,
        type: 'system',
        text: `Call ended. Duration: ${formatDuration(callDuration)}`,
        timestamp: new Date()
      }]);
    } catch (err) {
      console.error('Call end error:', err);
      setCallStatus('ended');
    } finally {
      setLoading(false);
    }
  };

  const handleNewCall = () => {
    setCallStatus('ready');
    setCallId(null);
    setCallDuration(0);
    setTranscript('');
    setBotReply('');
    setMessages([]);
    setError(null);
  };

  return (
    <div className="voice-service">
      <div className="voice-header">
        <h3>📞 Voice Support</h3>
        {error && <div className="error-message">{error}</div>}
      </div>

      {callStatus === 'ready' ? (
        <div className="voice-ready">
          <div className="voice-icon-large">📞</div>
          <h4>Ready to Connect</h4>
          <p>Click the button below to start a voice call with our support team</p>
          <button
            onClick={handleStartCall}
            disabled={loading}
            className="btn-start-call"
          >
            {loading ? 'Connecting...' : 'Start Voice Call'}
          </button>
        </div>
      ) : (
        <div className="voice-active">
          <div className="call-info">
            <div className="call-indicator">
              <div className="pulse-dot"></div>
              <span>Call Active</span>
            </div>
            <div className="call-details">
              <p><strong>Call ID:</strong> {callId}</p>
              <p><strong>Duration:</strong> <span className="duration">{formatDuration(callDuration)}</span></p>
            </div>
          </div>

          {callStatus === 'active' && (
            <div className="speech-input-area">
              <div className="transcript-display">
                <p className="transcript-label">What would you like to do?</p>
                <p className="transcript-text">{transcript || '(listening...)'}</p>
              </div>

              <div className="input-group">
                <input
                  type="text"
                  value={transcript}
                  readOnly
                  placeholder={listening ? "(Listening to you speak...)" : "Press microphone to speak"}
                  className="voice-input"
                  style={{ backgroundColor: '#f5f7fa', color: '#666' }}
                />
                <button
                  onClick={toggleMic}
                  disabled={loading}
                  className={`btn-send-speech ${listening ? 'listening' : ''}`}
                  title="Toggle Microphone"
                >
                  {listening ? '🛑' : '🎤'}
                </button>
              </div>
            </div>
          )}

          <div className="voice-messages">
            {messages.map(msg => (
              <div key={msg.id} className={`voice-message message-${msg.type}`}>
                <p>{msg.text}</p>
                <span className="msg-time">
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ))}
          </div>

          <div className="call-actions">
            {callStatus === 'active' && (
              <button
                onClick={handleEndCall}
                disabled={loading}
                className="btn-end-call"
              >
                End Call
              </button>
            )}
          </div>
        </div>
      )}

      {callStatus === 'ended' && (
        <div className="voice-ended">
          <div className="end-icon">✓</div>
          <h4>Call Ended</h4>
          <p>Call Duration: {formatDuration(callDuration)}</p>
          <p className="thank-you">Thank you for using our voice service</p>
          <button
            onClick={handleNewCall}
            className="btn-new-call"
          >
            Start New Call
          </button>
        </div>
      )}
    </div>
  );
}

export default VoiceService;
