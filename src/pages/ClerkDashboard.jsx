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
    Tooltip
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SendIcon from '@mui/icons-material/Send';
import EditIcon from '@mui/icons-material/Edit';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';

const ClerkDashboard = () => {
    const [requests, setRequests] = useState([]);

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        const token = localStorage.getItem('token');
        try {
            const response = await fetch('http://localhost:3000/api/requests', {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                setRequests(data);
            }
        } catch (error) {
            console.error('Error fetching requests', error);
        }
    };

    const handleSubmit = async (id) => {
        if (!confirm('Are you sure you want to submit this request?')) return;
        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`http://localhost:3000/api/requests/${id}/submit`, {
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

    return (
        <DashboardLayout role="clerk" title="Dashboard">

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
                <Link to="/create-request" style={{ textDecoration: 'none' }}>
                    <Button
                        variant="contained"
                        size="large"
                        startIcon={<AddIcon />}
                        sx={{ borderRadius: 3, px: 3 }}
                    >
                        New Payment Request
                    </Button>
                </Link>
            </Box>

            <Paper sx={{ width: '100%', overflow: 'hidden', border: 'none', boxShadow: 'var(--shadow-sm)' }}>
                <TableContainer>
                    <Table sx={{ minWidth: 650 }}>
                        <TableHead>
                            <TableRow>
                                <TableCell>ID</TableCell>
                                <TableCell>Description (En)</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell>Date</TableCell>
                                <TableCell align="right">Actions</TableCell>
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
                                            variant="soft" // Note: 'soft' might require extra theme config, falling back to filled/outlined if not
                                            sx={{ fontWeight: 600 }}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="body2" color="text.secondary">
                                            {new Date(req.createdAt).toLocaleDateString()}
                                        </Typography>
                                    </TableCell>
                                    <TableCell align="right">
                                        <Stack direction="row" spacing={1} justifyContent="flex-end">
                                            {(req.status === 'DRAFT' || req.status === 'MINUTED') && (
                                                <Tooltip title="Submit Request">
                                                    <Button
                                                        variant="contained"
                                                        color="primary"
                                                        size="small"
                                                        onClick={() => handleSubmit(req.id)}
                                                        startIcon={<SendIcon />}
                                                    >
                                                        Submit
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
                                                            Edit
                                                        </Button>
                                                    </Tooltip>
                                                </Link>
                                            )}
                                        </Stack>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {requests.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={5} align="center" sx={{ py: 6 }}>
                                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, color: 'text.secondary' }}>
                                            <ReceiptLongIcon sx={{ fontSize: 48, color: 'grey.300' }} />
                                            <Typography>No requests yet. Create your first payment request!</Typography>
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>
        </DashboardLayout>
    );
};

export default ClerkDashboard;
