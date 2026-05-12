/**
 * Material UI Theme Configuration
 * Modern dark theme with vibrant accent colors
 */

import { createTheme, alpha } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#7C3AED',
      light: '#A78BFA',
      dark: '#5B21B6',
      contrastText: '#FFFFFF'
    },
    secondary: {
      main: '#06B6D4',
      light: '#67E8F9',
      dark: '#0891B2',
      contrastText: '#FFFFFF'
    },
    background: {
      default: '#0B0F1A',
      paper: '#111827'
    },
    surface: {
      main: '#1E293B',
      light: '#334155'
    },
    text: {
      primary: '#F1F5F9',
      secondary: '#94A3B8',
      disabled: '#475569'
    },
    error: {
      main: '#EF4444',
      light: '#FCA5A5'
    },
    warning: {
      main: '#F59E0B',
      light: '#FCD34D'
    },
    success: {
      main: '#10B981',
      light: '#6EE7B7'
    },
    info: {
      main: '#3B82F6',
      light: '#93C5FD'
    },
    divider: 'rgba(148, 163, 184, 0.12)'
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 800,
      fontSize: '2.5rem',
      lineHeight: 1.2,
      letterSpacing: '-0.02em'
    },
    h2: {
      fontWeight: 700,
      fontSize: '2rem',
      lineHeight: 1.3,
      letterSpacing: '-0.01em'
    },
    h3: {
      fontWeight: 700,
      fontSize: '1.5rem',
      lineHeight: 1.4
    },
    h4: {
      fontWeight: 600,
      fontSize: '1.25rem',
      lineHeight: 1.4
    },
    h5: {
      fontWeight: 600,
      fontSize: '1.1rem',
      lineHeight: 1.5
    },
    h6: {
      fontWeight: 600,
      fontSize: '1rem',
      lineHeight: 1.5
    },
    subtitle1: {
      fontSize: '1rem',
      fontWeight: 500,
      color: '#94A3B8'
    },
    body1: {
      fontSize: '0.95rem',
      lineHeight: 1.7
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.6,
      color: '#94A3B8'
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
      fontSize: '0.875rem'
    }
  },
  shape: {
    borderRadius: 12
  },
  shadows: [
    'none',
    '0 1px 3px rgba(0,0,0,0.3)',
    '0 4px 6px rgba(0,0,0,0.3)',
    '0 6px 12px rgba(0,0,0,0.3)',
    '0 8px 16px rgba(0,0,0,0.3)',
    '0 10px 24px rgba(0,0,0,0.3)',
    '0 12px 28px rgba(0,0,0,0.3)',
    '0 14px 32px rgba(0,0,0,0.3)',
    '0 16px 36px rgba(0,0,0,0.3)',
    '0 18px 40px rgba(0,0,0,0.3)',
    '0 20px 44px rgba(0,0,0,0.3)',
    '0 22px 48px rgba(0,0,0,0.3)',
    '0 24px 52px rgba(0,0,0,0.3)',
    '0 26px 56px rgba(0,0,0,0.3)',
    '0 28px 60px rgba(0,0,0,0.3)',
    '0 30px 64px rgba(0,0,0,0.3)',
    '0 32px 68px rgba(0,0,0,0.3)',
    '0 34px 72px rgba(0,0,0,0.3)',
    '0 36px 76px rgba(0,0,0,0.3)',
    '0 38px 80px rgba(0,0,0,0.3)',
    '0 40px 84px rgba(0,0,0,0.3)',
    '0 42px 88px rgba(0,0,0,0.3)',
    '0 44px 92px rgba(0,0,0,0.3)',
    '0 46px 96px rgba(0,0,0,0.3)',
    '0 48px 100px rgba(0,0,0,0.3)'
  ],
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          scrollbarColor: '#334155 #0B0F1A',
          '&::-webkit-scrollbar': {
            width: 8
          },
          '&::-webkit-scrollbar-track': {
            background: '#0B0F1A'
          },
          '&::-webkit-scrollbar-thumb': {
            background: '#334155',
            borderRadius: 4
          },
          '&::-webkit-scrollbar-thumb:hover': {
            background: '#475569'
          }
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          padding: '10px 24px',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'translateY(-1px)',
            boxShadow: '0 4px 20px rgba(124, 58, 237, 0.3)'
          }
        },
        contained: {
          background: 'linear-gradient(135deg, #7C3AED 0%, #6D28D9 100%)',
          '&:hover': {
            background: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)'
          }
        },
        outlined: {
          borderColor: 'rgba(124, 58, 237, 0.5)',
          '&:hover': {
            borderColor: '#7C3AED',
            backgroundColor: 'rgba(124, 58, 237, 0.08)'
          }
        }
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(135deg, rgba(17, 24, 39, 0.9) 0%, rgba(30, 41, 59, 0.6) 100%)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(148, 163, 184, 0.08)',
          borderRadius: 16,
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            border: '1px solid rgba(124, 58, 237, 0.3)',
            transform: 'translateY(-4px)',
            boxShadow: '0 20px 40px rgba(0,0,0,0.3)'
          }
        }
      }
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 10,
            backgroundColor: 'rgba(30, 41, 59, 0.5)',
            '& fieldset': {
              borderColor: 'rgba(148, 163, 184, 0.15)'
            },
            '&:hover fieldset': {
              borderColor: 'rgba(124, 58, 237, 0.5)'
            },
            '&.Mui-focused fieldset': {
              borderColor: '#7C3AED'
            }
          }
        }
      }
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none'
        }
      }
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 500
        }
      }
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          background: 'linear-gradient(135deg, #111827 0%, #1E293B 100%)',
          border: '1px solid rgba(148, 163, 184, 0.1)',
          borderRadius: 16
        }
      }
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          background: '#111827',
          borderRight: '1px solid rgba(148, 163, 184, 0.08)'
        }
      }
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: 'rgba(11, 15, 26, 0.8)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(148, 163, 184, 0.08)',
          boxShadow: 'none'
        }
      }
    }
  }
});

export default theme;
