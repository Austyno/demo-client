import React, { useState, useEffect } from 'react';
import {
    Menu,
    MenuItem,
    IconButton,
    Badge,
    Typography,
    Box,
    Divider,
    List,
    ListItem,
    ListItemText,
    ListItemAvatar,
    Avatar,
    Button
} from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import MessageIcon from '@mui/icons-material/Message';
import { useSocket } from '../context/SocketContext';
import { API_URL } from '../config';

const NotificationsMenu = () => {
    const { unreadCount } = useSocket();
    const [anchorEl, setAnchorEl] = useState(null);
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleClick = async (event) => {
        setAnchorEl(event.currentTarget);
        fetchMessages();
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const fetchMessages = async () => {
        setLoading(true);
        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`${API_URL}/api/messages`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                setMessages(data.slice(0, 5)); // Show last 5
            }
        } catch (error) {
            console.error('Error fetching messages', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const handleRefresh = () => {
            if (anchorEl) fetchMessages();
        };
        window.addEventListener('messageArchived', handleRefresh);
        return () => window.removeEventListener('messageArchived', handleRefresh);
    }, [anchorEl]);

    const handleOpenMessage = (message) => {
        window.dispatchEvent(new CustomEvent('openChat', { detail: message }));
        handleClose();
    };

    return (
        <>
            <IconButton size="large" color="inherit" onClick={handleClick}>
                <Badge badgeContent={unreadCount} color="error">
                    <NotificationsIcon sx={{ color: 'text.secondary' }} />
                </Badge>
            </IconButton>

            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                PaperProps={{
                    sx: { width: 320, maxHeight: 400, mt: 1.5 }
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
                <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="subtitle1" fontWeight="bold">Notifications</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Button 
                            size="small" 
                            variant="outlined" 
                            onClick={() => {
                                window.dispatchEvent(new CustomEvent('openChat', { detail: { compose: true } }));
                                handleClose();
                            }}
                        >
                            Compose
                        </Button>
                        {unreadCount > 0 && (
                            <Typography variant="caption" color="primary">{unreadCount} new</Typography>
                        )}
                    </Box>
                </Box>
                <Divider />
                
                <List sx={{ py: 0 }}>
                    {messages.length > 0 ? (
                        messages.map((msg) => (
                            <MenuItem 
                                key={msg._id} 
                                onClick={() => handleOpenMessage(msg)}
                                sx={{ 
                                    py: 1.5,
                                    backgroundColor: msg.isRead ? 'transparent' : 'action.hover'
                                }}
                            >
                                <ListItemAvatar>
                                    <Avatar sx={{ bgcolor: 'primary.main', width: 32, height: 32 }}>
                                        {msg.sender.username[0].toUpperCase()}
                                    </Avatar>
                                </ListItemAvatar>
                                <ListItemText
                                    primary={msg.title}
                                    secondary={
                                        <>
                                            <Typography variant="caption" display="block" color="text.primary">
                                                From: {msg.sender.username}
                                            </Typography>
                                            <Typography variant="caption" noWrap display="block">
                                                {msg.content}
                                            </Typography>
                                        </>
                                    }
                                />
                            </MenuItem>
                        ))
                    ) : (
                        <Box sx={{ p: 3, textAlign: 'center' }}>
                            <MessageIcon sx={{ fontSize: 40, color: 'grey.300', mb: 1 }} />
                            <Typography variant="body2" color="text.secondary">
                                No recent messages
                            </Typography>
                        </Box>
                    )}
                </List>
            </Menu>
        </>
    );
};

export default NotificationsMenu;
