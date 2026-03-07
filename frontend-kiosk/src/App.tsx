import React, { useState } from 'react';
import {
  Box,
  Container,
  CssBaseline,
  AppBar,
  Toolbar,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  TextField,
  Paper,
  ThemeProvider,
  createTheme,
} from '@mui/material';
import { ThemeProvider as EmotionThemeProvider } from '@emotion/react';

// Material-UI Theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

interface Message {
  id: string;
  sender: 'user' | 'bot';
  content: string;
  timestamp: Date;
}

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      sender: 'user',
      content: inputValue,
      timestamp: new Date(),
    };
    setMessages([...messages, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      // TODO: Send to conversation engine API
      // const response = await fetch('/api/v1/conversations/messages', {
      //   method: 'POST',
      //   body: JSON.stringify({ content: inputValue })
      // });

      // Simulate bot response
      setTimeout(() => {
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          sender: 'bot',
          content: 'I understand. How can I help you with your banking needs?',
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, botMessage]);
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error sending message:', error);
      setIsLoading(false);
    }
  };

  return (
    <EmotionThemeProvider theme={theme}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        
        {/* Header */}
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6">
              🏦 Banking AI Self-Service
            </Typography>
          </Toolbar>
        </AppBar>

        {/* Main Content */}
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Grid container spacing={3}>
            {/* Sidebar - Menu */}
            <Grid item xs={12} md={3}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Services
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Button variant="outlined" fullWidth>
                      💰 Check Balance
                    </Button>
                    <Button variant="outlined" fullWidth>
                      💸 Transfer Money
                    </Button>
                    <Button variant="outlined" fullWidth>
                      💳 Card Management
                    </Button>
                    <Button variant="outlined" fullWidth>
                      📊 View Statements
                    </Button>
                    <Button variant="outlined" fullWidth>
                      🎗️ Apply for Loan
                    </Button>
                    <Button variant="outlined" fullWidth>
                      ⚠️ Report Issue
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Main Chat Area */}
            <Grid item xs={12} md={9}>
              <Card sx={{ height: '70vh', display: 'flex', flexDirection: 'column' }}>
                {/* Chat Messages */}
                <Box
                  sx={{
                    flex: 1,
                    overflowY: 'auto',
                    p: 2,
                    backgroundColor: '#f5f5f5',
                  }}
                >
                  {messages.length === 0 ? (
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: '100%',
                      }}
                    >
                      <Typography color="textSecondary">
                        Start a conversation with our AI assistant
                      </Typography>
                    </Box>
                  ) : (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      {messages.map((message) => (
                        <Box
                          key={message.id}
                          sx={{
                            display: 'flex',
                            justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start',
                          }}
                        >
                          <Paper
                            sx={{
                              p: 1.5,
                              maxWidth: '70%',
                              backgroundColor: message.sender === 'user' ? '#1976d2' : '#fff',
                              color: message.sender === 'user' ? '#fff' : '#000',
                            }}
                          >
                            <Typography variant="body2">
                              {message.content}
                            </Typography>
                          </Paper>
                        </Box>
                      ))}
                      {isLoading && (
                        <Box sx={{ display: 'flex', justifyContent: 'flex-start' }}>
                          <Typography variant="body2" color="textSecondary">
                            Bot is typing...
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  )}
                </Box>

                {/* Input Area */}
                <Box sx={{ p: 2, borderTop: '1px solid #ddd' }}>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <TextField
                      fullWidth
                      placeholder="Type your message..."
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') handleSendMessage();
                      }}
                      disabled={isLoading}
                      size="small"
                    />
                    <Button
                      variant="contained"
                      onClick={handleSendMessage}
                      disabled={!inputValue.trim() || isLoading}
                    >
                      Send
                    </Button>
                    <Button>🎤</Button>
                  </Box>
                </Box>
              </Card>
            </Grid>
          </Grid>
        </Container>

        {/* Footer */}
        <Box
          sx={{
            backgroundColor: '#f5f5f5',
            py: 2,
            mt: 4,
            textAlign: 'center',
          }}
        >
          <Typography variant="body2" color="textSecondary">
            © 2024 Banking AI. Secure • Accessible • Multilingual
          </Typography>
        </Box>
      </ThemeProvider>
    </EmotionThemeProvider>
  );
};

export default App;
