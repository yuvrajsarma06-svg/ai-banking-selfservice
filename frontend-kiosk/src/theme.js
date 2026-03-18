import { createTheme } from '@mui/material/styles';



// Light Theme - Modern Fintech
const lightTheme = createTheme({
  palette: {
    mode: 'light',
  primary: {
      main: '#a18cd1',
      light: '#c9d6ff',
      dark: '#9bb0e0',
      contrastText: '#1a1a2e',
    },
    secondary: {
      main: '#9F8BFF',
      light: '#B794FF',
      dark: '#8B7BFF',
    },
    success: {
      main: '#22c55e',
      light: '#4ade80',
      dark: '#16a34a',
    },
    warning: {
      main: '#f59e0b',
      light: '#fbbf24',
      dark: '#d97706',
    },
    error: {
      main: '#ef4444',
      light: '#f87171',
      dark: '#dc2626',
    },
    info: {
      main: '#3b82f6',
      light: '#60a5fa',
      dark: '#2563eb',
    },
    background: {
      default: 'linear-gradient(135deg, #6A5CFF 0%, #8B7BFF 25%, #B794FF 50%, #FF9BD2 75%)',
      paper: 'rgba(255,255,255,0.15)',
    },
  text: {
      primary: '#1a1a2e',
      secondary: '#6b7280',
    },
    divider: 'rgba(255,255,255,0.25)',
    gradient: {
      primary: 'linear-gradient(135deg, #6A5CFF 0%, #8B7BFF 25%, #B794FF 50%, #FF9BD2 75%)',
      secondary: 'linear-gradient(135deg, #8B7BFF 0%, #B794FF 50%, #FF9BD2 100%)',
      card: 'rgba(255,255,255,0.15)',
      accent: 'linear-gradient(135deg, #FF9BD2 0%, #FFB6E6 100%)',
      sidebar: 'linear-gradient(180deg, #6A5CFF 0%, #8B7BFF 50%, #B794FF 100%)',
      balance: 'linear-gradient(135deg, #7B6CFF 0%, #FF9BD2 100%)',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
      letterSpacing: '-0.02em',
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
      letterSpacing: '-0.01em',
    },
    h3: {
      fontSize: '1.5rem',
      fontWeight: 600,
    },
    h4: {
      fontSize: '1.25rem',
      fontWeight: 600,
    },
    h5: {
      fontSize: '1.1rem',
      fontWeight: 600,
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 600,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.5,
    },
    caption: {
      fontSize: '0.75rem',
    },
    button: {
      fontWeight: 600,
      textTransform: 'none',
    },
  },
  shape: {
    borderRadius: 16,
  },
  shadows: [
    'none',
    '0 2px 4px rgba(30, 58, 95, 0.04)',
    '0 4px 8px rgba(30, 58, 95, 0.06)',
    '0 6px 12px rgba(30, 58, 95, 0.08)',
    '0 8px 16px rgba(30, 58, 95, 0.1)',
    '0 12px 24px rgba(30, 58, 95, 0.12)',
    '0 16px 32px rgba(30, 58, 95, 0.14)',
    '0 20px 40px rgba(30, 58, 95, 0.16)',
    '0 24px 48px rgba(30, 58, 95, 0.18)',
    '0 2px 4px rgba(30, 58, 95, 0.04)',
    '0 2px 4px rgba(30, 58, 95, 0.04)',
    '0 2px 4px rgba(30, 58, 95, 0.04)',
    '0 2px 4px rgba(30, 58, 95, 0.04)',
    '0 2px 4px rgba(30, 58, 95, 0.04)',
    '0 2px 4px rgba(30, 58, 95, 0.04)',
    '0 2px 4px rgba(30, 58, 95, 0.04)',
    '0 2px 4px rgba(30, 58, 95, 0.04)',
    '0 2px 4px rgba(30, 58, 95, 0.04)',
    '0 2px 4px rgba(30, 58, 95, 0.04)',
    '0 2px 4px rgba(30, 58, 95, 0.04)',
    '0 2px 4px rgba(30, 58, 95, 0.04)',
    '0 2px 4px rgba(30, 58, 95, 0.04)',
    '0 2px 4px rgba(30, 58, 95, 0.04)',
    '0 2px 4px rgba(30, 58, 95, 0.04)',
  ],
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          scrollbarColor: '#1e3a8a #f8fafc',
          '&::-webkit-scrollbar, & *::-webkit-scrollbar': {
            width: 8,
            height: 8,
          },
          '&::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb': {
            borderRadius: 8,
            backgroundColor: '#1e3a8a',
            opacity: 0.3,
          },
          '&::-webkit-scrollbar-track, & *::-webkit-scrollbar-track': {
            backgroundColor: '#f8fafc',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          padding: '12px 24px',
          fontWeight: 600,
          boxShadow: '0 2px 8px rgba(30, 58, 95, 0.15)',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            boxShadow: '0 4px 16px rgba(30, 58, 95, 0.25)',
            transform: 'translateY(-2px)',
          },
          '&:active': {
            transform: 'scale(0.97)',
          },
        },
        contained: {
          background: 'linear-gradient(135deg, #7B6CFF 0%, #9F8BFF 100%)',
          '&:hover': {
            background: 'linear-gradient(135deg, #9F8BFF 0%, #7B6CFF 100%)',
            boxShadow: '0 8px 32px rgba(123, 108, 255, 0.4)',
          },
        },
        containedSecondary: {
          background: 'linear-gradient(135deg, #FF9BD2 0%, #B794FF 100%)',
          '&:hover': {
            background: 'linear-gradient(135deg, #B794FF 0%, #FF9BD2 100%)',
            boxShadow: '0 8px 32px rgba(255, 155, 210, 0.4)',
          },
        },
        outlined: {
          borderWidth: 2,
          '&:hover': {
            borderWidth: 2,
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          background: 'rgba(255,255,255,0.15)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.25)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
            transform: 'translateY(-4px)',
            borderColor: 'rgba(255,255,255,0.4)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          background: 'rgba(255,255,255,0.15)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.25)',
        },
        elevation1: {
          boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
        },
        elevation2: {
          boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
        },
        elevation3: {
          boxShadow: '0 12px 40px rgba(0,0,0,0.16)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 12,
            transition: 'all 0.2s ease-in-out',
            '&:hover': {
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: '#2563eb',
              },
            },
            '&.Mui-focused': {
              boxShadow: '0 0 0 3px rgba(37, 99, 235, 0.15)',
            },
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 20px rgba(30, 58, 95, 0.08)',
          borderBottom: '1px solid rgba(30, 58, 95, 0.06)',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          borderRight: 'none',
          boxShadow: '4px 0 24px rgba(30, 58, 95, 0.1)',
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          margin: '4px 8px',
          padding: '12px 16px',
          transition: 'all 0.2s ease-in-out',
          '&.Mui-selected': {
            background: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)',
            color: '#ffffff',
            boxShadow: '0 4px 14px rgba(30, 58, 95, 0.4)',
            '& .MuiListItemIcon-root': {
              color: '#ffffff',
            },
            '&:hover': {
              background: 'linear-gradient(135deg, #2563eb 0%, #1e3a8a 100%)',
              boxShadow: '0 6px 20px rgba(30, 58, 95, 0.5)',
            },
          },
          '&:hover': {
            backgroundColor: 'rgba(30, 58, 95, 0.06)',
            transform: 'translateX(4px)',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 600,
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          fontWeight: 600,
          backgroundColor: 'rgba(30, 58, 95, 0.04)',
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          fontWeight: 600,
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            backgroundColor: 'rgba(30, 58, 95, 0.08)',
          },
          '&:active': {
            transform: 'scale(0.95)',
          },
        },
      },
    },
    MuiSwitch: {
      styleOverrides: {
        root: {
          width: 52,
          height: 32,
          padding: 0,
        },
        switchBase: {
          padding: 2,
          '&.Mui-checked': {
            transform: 'translateX(20px)',
            '& + .MuiSwitch-track': {
              background: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)',
              opacity: 1,
            },
          },
        },
        thumb: {
          width: 28,
          height: 28,
        },
        track: {
          borderRadius: 16,
          background: 'linear-gradient(135deg, #94a3b8 0%, #64748b 100%)',
          opacity: 1,
        },
      },
    },
  },
});

// Dark Theme - Modern Fintech
const darkTheme = createTheme({
  ...lightTheme,
  palette: {
    mode: 'dark',
    primary: {
      main: '#3b82f6',
      light: '#60a5fa',
      dark: '#2563eb',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#60a5fa',
      light: '#93c5fd',
      dark: '#3b82f6',
    },
    success: {
      main: '#4ade80',
      light: '#86efac',
      dark: '#22c55e',
    },
    warning: {
      main: '#fbbf24',
      light: '#fcd34d',
      dark: '#f59e0b',
    },
    error: {
      main: '#f87171',
      light: '#fca5a5',
      dark: '#ef4444',
    },
    info: {
      main: '#60a5fa',
      light: '#93c5fd',
      dark: '#3b82f6',
    },
    background: {
      default: '#0f172a',
      paper: '#1e293b',
    },
    text: {
      primary: '#f1f5f9',
      secondary: '#94a3b8',
    },
    divider: 'rgba(255, 255, 255, 0.08)',
    gradient: {
      primary: 'linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%)',
      secondary: 'linear-gradient(135deg, #60a5fa 0%, #93c5fd 100%)',
      card: 'linear-gradient(180deg, #1e293b 0%, #0f172a 100%)',
      accent: 'linear-gradient(135deg, #4ade80 0%, #86efac 100%)',
      sidebar: 'linear-gradient(180deg, #1e293b 0%, #0f172a 100%)',
      balance: 'linear-gradient(135deg, #818cf8 0%, #a78bfa 50%, #c4b5fd 100%)',
    },
  },
});

export const getTheme = (mode) => (mode === 'dark' ? darkTheme : lightTheme);

export default lightTheme;

