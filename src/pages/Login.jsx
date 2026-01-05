import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../config';
import {
    Container,
    Card,
    CardContent,
    Typography,
    TextField,
    Button,
    Box,
    Alert,
    CircularProgress
} from '@mui/material';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const response = await fetch(`${API_URL}/api/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });

            if (response.ok) {
                const data = await response.json();
                login(data.user, data.token);
                if (data.user.role === 'CLERK') navigate('/clerk-dashboard');
                else if (data.user.role === 'MANAGER') navigate('/manager-dashboard');
                else navigate('/');
            } else {
                setError('Invalid credentials');
            }
        } catch (err) {
            setError('Server error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="sm" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
            <Card sx={{ width: '100%', maxWidth: 400, p: 2 }}>
                <CardContent>
                    <Typography variant="h4" component="h2" align="center" gutterBottom fontWeight="bold" color="primary">
                        ISDAO APP
                    </Typography>
                    <Typography variant="h4" component="h2" align="center" gutterBottom fontWeight="bold" color="primary">
                        Welcome Back
                    </Typography>
                    <Typography variant="body2" align="center" color="text.secondary" sx={{ mb: 4 }}>
                        Sign in to access your dashboard
                    </Typography>

                    {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

                    <Box component="form" onSubmit={handleSubmit} noValidate>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="username"
                            label="Username"
                            name="username"
                            autoComplete="username"
                            autoFocus
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            disabled={loading}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            disabled={loading}
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            size="large"
                            sx={{ mt: 3, mb: 2, borderRadius: 2 }}
                            disabled={loading}
                        >
                            {loading ? <CircularProgress size={24} color="inherit" /> : 'Login'}
                        </Button>
                    </Box>
                </CardContent>
            </Card>
        </Container>
    );
};

export default Login;
