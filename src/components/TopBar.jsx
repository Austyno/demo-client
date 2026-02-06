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
import NotificationsMenu from './NotificationsMenu';
import LanguageSwitcher from './LanguageSwitcher';
import { useTranslation } from 'react-i18next';

const TopBar = ({ title }) => {
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
            sx={{ mb: 4, pt: 2 }}
        >
            <Toolbar>
                <Typography variant="h5" component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
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
