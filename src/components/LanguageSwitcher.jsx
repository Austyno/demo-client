import React from 'react';
import { useTranslation } from 'react-i18next';
import {
    IconButton,
    Menu,
    MenuItem,
    Typography,
    Box,
    Avatar
} from '@mui/material';
import LanguageIcon from '@mui/icons-material/Language';
import { useAuth } from '../context/AuthContext';
import { API_URL } from '../config';

const LanguageSwitcher = () => {
    const { i18n } = useTranslation();
    const [anchorEl, setAnchorEl] = React.useState(null);
    const { user, login } = useAuth();

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const changeLanguage = async (lng) => {
        i18n.changeLanguage(lng);
        localStorage.setItem('i18nextLng', lng);
        handleClose();

        if (user) {
            const token = localStorage.getItem('token');
            try {
                const response = await fetch(`${API_URL}/api/auth/update-language`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ language: lng }),
                });

                if (response.ok) {
                    const data = await response.json();
                    // Update user context with new language
                    login({ ...user, language: data.language }, token);
                }
            } catch (err) {
                console.error('Failed to update language on server', err);
            }
        }
    };

    const currentLanguage = i18n.language || 'en';

    return (
        <Box>
            <IconButton
                onClick={handleClick}
                size="large"
                sx={{
                    color: 'inherit',
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    '&:hover': { backgroundColor: 'rgba(255,255,255,0.2)' }
                }}
            >
                <LanguageIcon />
                <Typography variant="body2" sx={{ ml: 1, fontWeight: 'bold', textTransform: 'uppercase' }}>
                    {currentLanguage.split('-')[0]}
                </Typography>
            </IconButton>
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                PaperProps={{
                    sx: {
                        mt: 1.5,
                        '& .MuiMenuItem-root': {
                            px: 2,
                            py: 1,
                        },
                    },
                }}
            >
                <MenuItem onClick={() => changeLanguage('en')} selected={currentLanguage.startsWith('en')}>
                    <Avatar src="https://flagcdn.com/w20/gb.png" sx={{ width: 20, height: 15, borderRadius: 0, mr: 1 }} />
                    English
                </MenuItem>
                <MenuItem onClick={() => changeLanguage('fr')} selected={currentLanguage.startsWith('fr')}>
                    <Avatar src="https://flagcdn.com/w20/fr.png" sx={{ width: 20, height: 15, borderRadius: 0, mr: 1 }} />
                    Français
                </MenuItem>
            </Menu>
        </Box>
    );
};

export default LanguageSwitcher;
