import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        primary: {
            main: '#7b1fa2', // ISDAO Purple
            light: '#ae52d4',
            dark: '#4a0072',
            contrastText: '#ffffff',
        },
        secondary: {
            main: '#ed6c02', // ISDAO Orange
            light: '#ff9d3f',
            dark: '#b53d00',
            contrastText: '#ffffff',
        },
        background: {
            default: '#f3f4f6',
            paper: '#ffffff',
            dark: '#212121', // ISDAO Dark Background
        },
        text: {
            primary: '#111827',
            secondary: '#6b7280',
        },
        success: {
            main: '#10b981',
        },
        error: {
            main: '#ef4444',
        },
        warning: {
            main: '#f59e0b',
        },
    },
    typography: {
        fontFamily: '"Outfit", "Inter", sans-serif',
        h1: { fontWeight: 700 },
        h2: { fontWeight: 700 },
        h3: { fontWeight: 700 },
        h4: { fontWeight: 600 },
        h5: { fontWeight: 600 },
        h6: { fontWeight: 600 },
        button: { textTransform: 'none', fontWeight: 600 },
    },
    shape: {
        borderRadius: 12,
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 8,
                    boxShadow: 'none',
                    '&:hover': {
                        boxShadow: 'none',
                    },
                },
                containedPrimary: {
                    '&:hover': {
                        backgroundColor: '#4a0072',
                    },
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: 16,
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                    backgroundImage: 'none', // Remove default paper gradient if any
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    backgroundImage: 'none',
                },
                rounded: {
                    borderRadius: 16,
                },
            },
        },
        MuiDrawer: {
            styleOverrides: {
                paper: {
                    color: '#ffffff',
                    borderRadius: 0,
                    borderRight: 'none',
                },
            },
        },
        MuiTableCell: {
            styleOverrides: {
                head: {
                    fontWeight: 600,
                    color: '#6b7280',
                    textTransform: 'uppercase',
                    fontSize: '0.75rem',
                    letterSpacing: '0.05em',
                },
                body: {
                    fontSize: '0.875rem',
                },
            },
        },
    },
});

export default theme;
