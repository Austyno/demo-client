import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Typography,
    Box,
    Avatar,
    Divider,
    IconButton,
    Autocomplete,
    CircularProgress
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SendIcon from '@mui/icons-material/Send';
import ArchiveIcon from '@mui/icons-material/Archive';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import { API_URL } from '../config';

const ChatModal = () => {
    const { user } = useAuth();
    const { decrementUnread } = useSocket();
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState(null);
    const [reply, setReply] = useState('');
    const [title, setTitle] = useState('');
    const [recipient, setRecipient] = useState(null);
    const [options, setOptions] = useState([]);
    const [searchLoading, setSearchLoading] = useState(false);
    const [loading, setLoading] = useState(false);
    const [isCompose, setIsCompose] = useState(false);

    useEffect(() => {
        const handleOpenChat = (event) => {
            if (event.detail.compose) {
                setIsCompose(true);
                setMessage(null);
                setRecipient(null);
                setTitle('');
                setReply('');
            } else {
                setIsCompose(false);
                setMessage(event.detail);
                setRecipient(event.detail.sender);
                setTitle(`Re: ${event.detail.title}`);
                setReply('');
                if (!event.detail.isRead && event.detail.recipient._id === user.id) {
                    markAsRead(event.detail._id);
                }
            }
            setOpen(true);
        };
        window.addEventListener('openChat', handleOpenChat);
        return () => window.removeEventListener('openChat', handleOpenChat);
    }, [user]);

    const fetchUsers = async (query) => {
        if (!query) return;
        setSearchLoading(true);
        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`${API_URL}/api/auth/search-users?q=${query}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                setOptions(data);
            }
        } catch (error) {
            console.error('Error searching users', error);
        } finally {
            setSearchLoading(false);
        }
    };

    const markAsRead = async (id) => {
        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`${API_URL}/api/messages/${id}/read`, {
                method: 'PUT',
                headers: { Authorization: `Bearer ${token}` }
            });
            if (response.ok) {
                decrementUnread();
            }
        } catch (error) {
            console.error('Error marking as read', error);
        }
    };

    const handleSend = async () => {
        if (!reply.trim() || !recipient || (isCompose && !title.trim())) return;
        setLoading(true);
        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`${API_URL}/api/messages`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    recipientId: recipient._id,
                    title: title,
                    content: reply
                })
            });
            if (response.ok) {
                setReply('');
                setTitle('');
                setRecipient(null);
                setOpen(false);
            }
        } catch (error) {
            console.error('Error sending message', error);
        } finally {
            setLoading(false);
        }
    };

    const handleArchive = async () => {
        if (!message) return;
        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`${API_URL}/api/messages/${message._id}/archive`, {
                method: 'PUT',
                headers: { Authorization: `Bearer ${token}` }
            });
            if (response.ok) {
                if (!message.isRead && message.recipient._id === user.id) {
                    decrementUnread();
                }
                setOpen(false);
                toast.success('Message archived');
                // Optional: trigger refresh of notification list
                window.dispatchEvent(new CustomEvent('messageArchived'));
            }
        } catch (error) {
            console.error('Error archiving message', error);
        }
    };

    return (
        <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
            <DialogTitle>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h6">{isCompose ? 'New Message' : message?.title}</Typography>
                    <Box>
                        {!isCompose && (
                            <IconButton onClick={handleArchive} title="Archive Message">
                                <ArchiveIcon color="action" />
                            </IconButton>
                        )}
                        <IconButton onClick={() => setOpen(false)}>
                            <CloseIcon />
                        </IconButton>
                    </Box>
                </Box>
            </DialogTitle>
            <DialogContent dividers>
                {isCompose ? (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 2 }}>
                        <Autocomplete
                            options={options}
                            getOptionLabel={(option) => option.username}
                            loading={searchLoading}
                            onInputChange={(e, value) => fetchUsers(value)}
                            onChange={(e, value) => setRecipient(value)}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="To"
                                    variant="outlined"
                                    fullWidth
                                    InputProps={{
                                        ...params.InputProps,
                                        endAdornment: (
                                            <React.Fragment>
                                                {searchLoading ? <CircularProgress color="inherit" size={20} /> : null}
                                                {params.InputProps.endAdornment}
                                            </React.Fragment>
                                        ),
                                    }}
                                />
                            )}
                        />
                        <TextField
                            label="Title"
                            variant="outlined"
                            fullWidth
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </Box>
                ) : (
                    <>
                        <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Avatar sx={{ width: 32, height: 32 }}>{message?.sender.username[0].toUpperCase()}</Avatar>
                            <Box>
                                <Typography variant="subtitle2">{message?.sender.username}</Typography>
                                <Typography variant="caption" color="text.secondary">
                                    {message && new Date(message.createdAt).toLocaleString()}
                                </Typography>
                            </Box>
                        </Box>
                        <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', mb: 3 }}>
                            {message?.content}
                        </Typography>
                        <Divider sx={{ my: 2 }} />
                    </>
                )}

                <Box sx={{ mt: 2 }}>
                    <TextField
                        fullWidth
                        multiline
                        rows={3}
                        placeholder={isCompose ? "Type your message..." : "Type your reply..."}
                        value={reply}
                        onChange={(e) => setReply(e.target.value)}
                        variant="outlined"
                    />
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => setOpen(false)}>Cancel</Button>
                <Button
                    onClick={handleSend}
                    variant="contained"
                    endIcon={<SendIcon />}
                    disabled={loading || !reply.trim() || !recipient || (isCompose && !title.trim())}
                >
                    {isCompose ? 'Send Message' : 'Send Reply'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ChatModal;
