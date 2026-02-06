import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
    AppBar,
    Toolbar,
    Typography,
    IconButton,
    Badge,
    Button,
    Box
} from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import MenuIcon from '@mui/icons-material/Menu';
import NotificationsMenu from './NotificationsMenu';
import LanguageSwitcher from './LanguageSwitcher';
import { useTranslation } from 'react-i18next';

const TopBar = ({ title, handleDrawerToggle }) => {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const { t } = useTranslation();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <AppBar
            position="static"
            color="transparent"
            elevation={0}
            sx={{ mb: 4, pt: { xs: 1, sm: 2 } }}
        >
            <Toolbar sx={{ px: { xs: 1, sm: 2 } }}>
                <IconButton
                    color="inherit"
                    aria-label="open drawer"
                    edge="start"
                    onClick={handleDrawerToggle}
                    sx={{ mr: 2, display: { sm: 'none' } }}
                >
                    <MenuIcon />
                </IconButton>
                <Typography variant="h5" component="div" sx={{ flexGrow: 1, fontWeight: 'bold', fontSize: { xs: '1.2rem', sm: '1.5rem' } }}>
                    {title}
                </Typography>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <LanguageSwitcher />
                    <NotificationsMenu />

                    <Button
                        variant="outlined"
                        color="error"
                        startIcon={<LogoutIcon />}
                        onClick={handleLogout}
                        sx={{
                            borderRadius: '8px',
                            borderWidth: '1px',
                            '&:hover': { borderWidth: '1px' }
                        }}
                    >
                        {t('common.logout')}
                    </Button>
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default TopBar;
