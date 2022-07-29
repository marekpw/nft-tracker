import { createTheme } from '@mui/material';
import { breakpoints } from './breakpoints';

export const darkTheme = createTheme(breakpoints, {
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        }
      }
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          color: '#aeaeae',
          backgroundColor: '#1f1f1f'
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none'
        },
        sizeSmall: {
          padding: '6px 16px'
        },
        sizeMedium: {
          padding: '8px 20px'
        },
        sizeLarge: {
          padding: '11px 24px'
        },
        textSizeSmall: {
          padding: '7px 12px'
        },
        textSizeMedium: {
          padding: '9px 16px'
        },
        textSizeLarge: {
          padding: '12px 16px'
        }
      }
    },
    MuiButtonBase: {
      defaultProps: {
        disableRipple: true
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        }
      }
    },
    MuiCardHeader: {
      defaultProps: {
        titleTypographyProps: {
          variant: 'h6'
        },
        subheaderTypographyProps: {
          variant: 'body2'
        }
      }
    },
    MuiCssBaseline: {
      styleOverrides: {
        '*': {
          boxSizing: 'border-box',
          margin: 0,
          padding: 0
        },
        html: {
          colorScheme: 'dark',
          width: '100%',
          height: '100%',
        },
        body: {
          width: '100%',
          height: '100%',
        },
      }
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          borderRight: 0,
        }
      }
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          // something is breaking the color of icon buttons in dark mode...
          color: '#aeaeae',
          '&:hover': {
            backgroundColor: '#363636',
          }
        }
      }
    },
    MuiPaper: {
      styleOverrides: {
        outlined: {
          borderColor: '#828DF8',
          backgroundColor: '#1F1F2E',
          color: '#a7a3f1',
        }
      }
    }
  },
  palette: {
    mode: 'dark',
    neutral: {
      100: '#191919',
      200: '#E5E7EB',
      300: '#D1D5DB',
      400: '#9CA3AF',
      500: '#6B7280',
      600: '#4B5563',
      700: '#374151',
      800: '#1F2937',
      900: '#0a0e16'
    },
    background: {
      default: '#1f1f1f',
      paper: '#292929'
    },
    divider: '#d0d0d0',
    primary: {
      main: '#a7a3f1',
      light: '#908cdb',
      dark: '#c7c5f3',
      contrastText: '#1e1e2a'
    },
    secondary: {
      main: '#10B981',
      light: '#3FC79A',
      dark: '#0B815A',
      contrastText: '#FFFFFF'
    },
    success: {
      main: '#14B8A6',
      light: '#43C6B7',
      dark: '#0E8074',
      contrastText: '#FFFFFF'
    },
    info: {
      main: '#2196F3',
      light: '#64B6F7',
      dark: '#0B79D0',
      contrastText: '#FFFFFF'
    },
    warning: {
      main: '#FFB020',
      light: '#FFBF4C',
      dark: '#B27B16',
      contrastText: '#FFFFFF'
    },
    error: {
      main: '#D14343',
      light: '#DA6868',
      dark: '#922E2E',
      contrastText: '#FFFFFF'
    },
    text: {
      primary: '#aeaeae',
      secondary: '#b0b9c6',
      disabled: 'rgba(55, 65, 81, 0.48)'
    }
  } as any,
  shape: {
    borderRadius: 8
  },
  typography: {
    button: {
      fontWeight: 600
    },
    body1: {
      fontSize: '1rem',
      fontWeight: 400,
      lineHeight: 1.5
    },
    body2: {
      fontSize: '0.875rem',
      fontWeight: 400,
      lineHeight: 1.57
    },
    subtitle1: {
      fontSize: '1rem',
      fontWeight: 500,
      lineHeight: 1.75
    },
    subtitle2: {
      fontSize: '0.875rem',
      fontWeight: 500,
      lineHeight: 1.57
    },
    overline: {
      fontSize: '0.75rem',
      fontWeight: 600,
      letterSpacing: '0.5px',
      lineHeight: 2.5,
      textTransform: 'uppercase'
    },
    caption: {
      fontSize: '0.75rem',
      fontWeight: 400,
      lineHeight: 1.66
    },
    h1: {
      fontWeight: 700,
      fontSize: '3.5rem',
      lineHeight: 1.375
    },
    h2: {
      fontWeight: 700,
      fontSize: '3rem',
      lineHeight: 1.375
    },
    h3: {
      fontWeight: 700,
      fontSize: '2.25rem',
      lineHeight: 1.375
    },
    h4: {
      fontWeight: 700,
      fontSize: '2rem',
      lineHeight: 1.375,
      [breakpoints.breakpoints.down('sm')]: {
        fontSize: '1.125rem'
      }
    },
    h5: {
      fontWeight: 600,
      fontSize: '1.5rem',
      lineHeight: 1.375
    },
    h6: {
      fontWeight: 600,
      fontSize: '1.125rem',
      lineHeight: 1.375
    }
  }
});