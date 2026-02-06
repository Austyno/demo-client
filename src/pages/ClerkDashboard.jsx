import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Button,
    Typography,
    Box,
    Chip,
    Stack,
    Tooltip,
    Card,
    CardContent,
    useTheme,
    useMediaQuery
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SendIcon from '@mui/icons-material/Send';
import EditIcon from '@mui/icons-material/Edit';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import LoadingSpinner from '../components/LoadingSpinner';
import { useTranslation } from 'react-i18next';

import { API_URL } from '../config';

const ClerkDashboard = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const { t } = useTranslation();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    useEffect(() => {
        fetchRequests();
        const interval = setInterval(() => {
            fetchRequests();
        }, 60000); // 1 minute

        return () => clearInterval(interval);
    }, []);

    const fetchRequests = async () => {
        const token = localStorage.getItem('token');
        setLoading(true);
        try {
            const response = await fetch(`${API_URL}/api/requests`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                setRequests(data);
            }
        } catch (error) {
            console.error('Error fetching requests', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (id) => {
        if (!confirm('Are you sure you want to submit this request?')) return;
        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`${API_URL}/api/requests/${id}/submit`, {
                method: 'PUT',
                headers: { Authorization: `Bearer ${token}` }
            });
            if (response.ok) {
                fetchRequests(); // Refresh list
            } else {
                alert('Failed to submit request');
            }
        } catch (error) {
            console.error(error);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'APPROVED': return 'success';
            case 'REJECTED': return 'error';
            case 'PENDING': return 'warning';
            default: return 'default';
        }
    };

    const ActionButtons = ({ req }) => (
        <Stack direction="row" spacing={1} justifyContent={isMobile ? "center" : "flex-end"}>
            {(req.status === 'DRAFT' || req.status === 'MINUTED') && (
                <Tooltip title="Submit Request">
                    <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        onClick={() => handleSubmit(req.id)}
                        startIcon={<SendIcon />}
                    >
                        {t('common.submit')}
                    </Button>
                </Tooltip>
            )}
            {req.status === 'MINUTED' && (
                <Link to={`/edit-request/${req.id}`} style={{ textDecoration: 'none' }}>
                    <Tooltip title="Edit Request">
                        <Button
                            variant="contained"
                            color="warning"
                            size="small"
                            startIcon={<EditIcon />}
                        >
                            {t('requests.edit')}
                        </Button>
                    </Tooltip>
                </Link>
            )}
        </Stack>
    );

    return (
        <DashboardLayout role="clerk" title={t('nav.dashboard')}>

            <Box sx={{ display: 'flex', justifyContent: isMobile ? 'center' : 'flex-end', mb: 3 }}>
                <Link to="/create-request" style={{ textDecoration: 'none', width: isMobile ? '100%' : 'auto' }}>
                    <Button
                        variant="contained"
                        size="large"
                        startIcon={<AddIcon />}
                        fullWidth={isMobile}
                        sx={{ borderRadius: 3, px: 3 }}
                    >
                        {t('nav.new_request')}
                    </Button>
                </Link>
            </Box>

            {loading ? (
                <LoadingSpinner />
            ) : requests.length === 0 ? (
                <Paper sx={{ p: 6, textAlign: 'center', boxShadow: 'var(--shadow-sm)', borderRadius: 2 }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, color: 'text.secondary' }}>
                        <ReceiptLongIcon sx={{ fontSize: 48, color: 'grey.300' }} />
                        <Typography>No requests yet. Create your first payment request!</Typography>
                    </Box>
                </Paper>
            ) : isMobile ? (
                <Stack spacing={2}>
                    {requests.map(req => (
                        <Card key={req.id} sx={{ borderRadius: 3, boxShadow: 'var(--shadow-sm)' }}>
                            <CardContent>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                                    <Typography variant="subtitle2" color="primary" fontWeight="bold">
                                        #{req.id}
                                    </Typography>
                                    <Chip
                                        label={req.status}
                                        color={getStatusColor(req.status)}
                                        size="small"
                                        sx={{ fontWeight: 600 }}
                                    />
                                </Box>
                                <Typography variant="body1" sx={{ mb: 2, fontWeight: 500 }}>
                                    {req.descriptionEn}
                                </Typography>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                    <Typography variant="caption" color="text.secondary">
                                        {new Date(req.createdAt).toLocaleDateString()}
                                    </Typography>
                                </Box>
                                <ActionButtons req={req} />
                            </CardContent>
                        </Card>
                    ))}
                </Stack>
            ) : (
                <Paper sx={{ width: '100%', overflow: 'hidden', border: 'none', boxShadow: 'var(--shadow-sm)', borderRadius: 2 }}>
                    <TableContainer>
                        <Table sx={{ minWidth: 650 }}>
                            <TableHead>
                                <TableRow>
                                    <TableCell>ID</TableCell>
                                    <TableCell>{t('requests.description')}</TableCell>
                                    <TableCell>{t('requests.status')}</TableCell>
                                    <TableCell>{t('requests.created_at')}</TableCell>
                                    <TableCell align="right">{t('common.actions')}</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {requests.map(req => (
                                    <TableRow key={req.id} hover>
                                        <TableCell>
                                            <Typography variant="subtitle2" color="primary">#{req.id}</Typography>
                                        </TableCell>
                                        <TableCell sx={{ maxWidth: 300 }}>
                                            <Typography variant="body2" noWrap>{req.descriptionEn}</Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                label={req.status}
                                                color={getStatusColor(req.status)}
                                                size="small"
                                                sx={{ fontWeight: 600 }}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2" color="text.secondary">
                                                {new Date(req.createdAt).toLocaleDateString()}
                                            </Typography>
                                        </TableCell>
                                        <TableCell align="right">
                                            <ActionButtons req={req} />
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Paper>
            )}
        </DashboardLayout>
    );
};

export default ClerkDashboard;
