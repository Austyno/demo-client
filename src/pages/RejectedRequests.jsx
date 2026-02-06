import React, { useEffect, useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Typography,
    Avatar,
    Box,
    Chip,
    Dialog,
    DialogContent,
    DialogActions,
    Button,
    IconButton,
    Tooltip,
    Stack,
    Card,
    CardContent,
    useTheme,
    useMediaQuery
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import AssignmentIcon from '@mui/icons-material/Assignment';
import VoucherLayout from '../components/VoucherLayout';
import LoadingSpinner from '../components/LoadingSpinner';
import { API_URL } from '../config';
import { useAuth } from '../context/AuthContext';

const RejectedRequests = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [openModal, setOpenModal] = useState(false);
    const { user } = useAuth();
    
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const handleView = (request) => {
        setSelectedRequest(request);
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
        setSelectedRequest(null);
    };

    useEffect(() => {
        fetchRequests();
        const interval = setInterval(() => {
            fetchRequests();
        }, 60000); // 1 minute

        return () => clearInterval(interval);
    }, []);

    const fetchRequests = async () => {
        setLoading(true);
        const token = localStorage.getItem('token');
        const endpoint = user?.role === 'MANAGER' 
            ? `${API_URL}/api/requests/subordinates?status=REJECTED`
            : `${API_URL}/api/requests?status=REJECTED`;
            
        try {
            const response = await fetch(endpoint, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                setRequests(data);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <DashboardLayout role={user?.role?.toLowerCase()} title="Rejected Requests">
            {loading ? (
                <LoadingSpinner />
            ) : requests.length === 0 ? (
                <Paper sx={{ p: 6, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, color: 'text.secondary', border: 'none', boxShadow: 'var(--shadow-sm)' }}>
                    <AssignmentIcon sx={{ fontSize: 48, color: 'grey.300' }} />
                    <Typography>No rejected requests found.</Typography>
                </Paper>
            ) : isMobile ? (
                <Stack spacing={2}>
                    {requests.map(req => (
                        <Card key={req.id} sx={{ borderRadius: 2, boxShadow: 'var(--shadow-sm)' }}>
                            <CardContent>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                    <Typography variant="subtitle2" color="primary" fontWeight="bold">#{req.id}</Typography>
                                    <Chip label="REJECTED" color="error" size="small" />
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                    <Avatar sx={{ width: 20, height: 20, fontSize: '0.675rem', bgcolor: 'grey.300' }}>
                                        {req.user.username.charAt(0).toUpperCase()}
                                    </Avatar>
                                    <Typography variant="body2" fontWeight="medium">{req.user.username}</Typography>
                                </Box>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                    {req.descriptionEn}
                                </Typography>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Chip
                                        icon={<AttachFileIcon sx={{ fontSize: '1rem !important' }} />}
                                        label={`${req.documents.length} files`}
                                        size="small"
                                        variant="outlined"
                                    />
                                    <Button
                                        size="small"
                                        variant="outlined"
                                        onClick={() => handleView(req)}
                                        startIcon={<VisibilityIcon />}
                                    >
                                        View Details
                                    </Button>
                                </Box>
                            </CardContent>
                        </Card>
                    ))}
                </Stack>
            ) : (
                <Paper sx={{ width: '100%', overflow: 'hidden', border: 'none', boxShadow: 'var(--shadow-sm)' }}>
                    <TableContainer>
                        <Table sx={{ minWidth: 650 }}>
                            <TableHead>
                                <TableRow>
                                    <TableCell>ID</TableCell>
                                    <TableCell>From</TableCell>
                                    <TableCell>Description</TableCell>
                                    <TableCell>Date</TableCell>
                                    <TableCell>Documents</TableCell>
                                    <TableCell>Status</TableCell>
                                    <TableCell align="right">Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {requests.map(req => (
                                    <TableRow key={req.id} hover>
                                        <TableCell>
                                            <Typography variant="subtitle2" color="primary">#{req.id}</Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <Avatar sx={{ width: 24, height: 24, fontSize: '0.75rem', bgcolor: 'grey.300' }}>
                                                    {req.user.username.charAt(0).toUpperCase()}
                                                </Avatar>
                                                <Typography variant="body2">{req.user.username}</Typography>
                                            </Box>
                                        </TableCell>
                                        <TableCell sx={{ maxWidth: 300 }}>
                                            <Typography variant="body2" noWrap>{req.descriptionEn}</Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2" color="text.secondary">
                                                {new Date(req.createdAt).toLocaleDateString()}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                icon={<AttachFileIcon />}
                                                label={`${req.documents.length} files`}
                                                size="small"
                                                variant="outlined"
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Chip label="REJECTED" color="error" size="small" />
                                        </TableCell>
                                        <TableCell align="right">
                                            <Tooltip title="View Details">
                                                <IconButton
                                                    size="small"
                                                    onClick={() => handleView(req)}
                                                    sx={{ color: 'primary.main' }}
                                                >
                                                    <VisibilityIcon />
                                                </IconButton>
                                            </Tooltip>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Paper>
            )}

            <Dialog
                open={openModal}
                onClose={handleCloseModal}
                maxWidth="md"
                fullWidth
            >
                <DialogContent sx={{ p: 0, bgcolor: '#f3f4f6' }}>
                    <VoucherLayout request={selectedRequest} />
                </DialogContent>
                <DialogActions sx={{ p: 2, bgcolor: 'white' }}>
                    <Button onClick={handleCloseModal}>Close</Button>
                </DialogActions>
            </Dialog>
        </DashboardLayout>
    );
};

export default RejectedRequests;
