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
    Button,
    Typography,
    Avatar,
    Box,
    Chip,
    Stack,
    Tooltip,
    Dialog,
    DialogContent,
    DialogActions,
    IconButton,
    Card,
    CardContent,
    useTheme,
    useMediaQuery
} from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import ReplyIcon from '@mui/icons-material/Reply';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import AssignmentIcon from '@mui/icons-material/Assignment';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VoucherLayout from '../components/VoucherLayout';
import LoadingSpinner from '../components/LoadingSpinner';

import { API_URL } from '../config';

const PendingRequests = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [openModal, setOpenModal] = useState(false);
    
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
    }, []);

    const fetchRequests = async () => {
        setLoading(true);
        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`${API_URL}/api/requests/subordinates?status=PENDING`, {
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

    const handleAction = async (id, action) => {
        let comment = '';
        if (action === 'REJECT') {
            comment = prompt('Please provide a reason for rejection:');
            if (!comment) return;
        } else if (action === 'MINUTE') {
            comment = prompt('Please provide comments for minuting back:');
            if (!comment) return;
        } else if (action === 'APPROVE') {
            if (!confirm('Are you sure you want to approve this request?')) return;
        }

        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`${API_URL}/api/requests/${id}/process`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ action, comment })
            });

            if (response.ok) {
                fetchRequests();
            } else {
                const data = await response.json();
                alert(`Failed: ${data.message}`);
            }
        } catch (error) {
            console.error(error);
            alert('Server error');
        }
    };

    const ActionButtons = ({ req, isCard = false }) => (
        <Stack direction={isCard ? "column" : "row"} spacing={1} justifyContent={isCard ? "stretch" : "flex-end"}>
            <Tooltip title="View Details">
                <Button
                    size="small"
                    variant="outlined"
                    onClick={() => handleView(req)}
                    startIcon={<VisibilityIcon />}
                    fullWidth={isCard}
                >
                    View
                </Button>
            </Tooltip>
            {isCard ? (
                <Stack direction="row" spacing={1}>
                    <Button
                        variant="contained"
                        color="success"
                        size="small"
                        onClick={() => handleAction(req.id, 'APPROVE')}
                        startIcon={<CheckIcon />}
                        sx={{ flex: 1 }}
                    >
                        Approve
                    </Button>
                    <Button
                        variant="contained"
                        color="warning"
                        size="small"
                        onClick={() => handleAction(req.id, 'MINUTE')}
                        startIcon={<ReplyIcon />}
                        sx={{ flex: 1 }}
                    >
                        Minute
                    </Button>
                    <Button
                        variant="contained"
                        color="error"
                        size="small"
                        onClick={() => handleAction(req.id, 'REJECT')}
                        startIcon={<CloseIcon />}
                        sx={{ flex: 1 }}
                    >
                        Reject
                    </Button>
                </Stack>
            ) : (
                <>
                    <Tooltip title="Approve">
                        <Button
                            variant="contained"
                            color="success"
                            size="small"
                            onClick={() => handleAction(req.id, 'APPROVE')}
                            startIcon={<CheckIcon />}
                            sx={{ bgcolor: 'rgba(16, 185, 129, 0.1)', color: 'success.main', boxShadow: 'none', '&:hover': { bgcolor: 'rgba(16, 185, 129, 0.2)', boxShadow: 'none' } }}
                        >
                            Approve
                        </Button>
                    </Tooltip>
                    <Tooltip title="Minute Back">
                        <Button
                            variant="contained"
                            color="warning"
                            size="small"
                            onClick={() => handleAction(req.id, 'MINUTE')}
                            startIcon={<ReplyIcon />}
                            sx={{ bgcolor: 'rgba(245, 158, 11, 0.1)', color: 'warning.main', boxShadow: 'none', '&:hover': { bgcolor: 'rgba(245, 158, 11, 0.2)', boxShadow: 'none' } }}
                        >
                            Minute
                        </Button>
                    </Tooltip>
                    <Tooltip title="Reject">
                        <Button
                            variant="contained"
                            color="error"
                            size="small"
                            onClick={() => handleAction(req.id, 'REJECT')}
                            startIcon={<CloseIcon />}
                            sx={{ bgcolor: 'rgba(239, 68, 68, 0.1)', color: 'error.main', boxShadow: 'none', '&:hover': { bgcolor: 'rgba(239, 68, 68, 0.2)', boxShadow: 'none' } }}
                        >
                            Reject
                        </Button>
                    </Tooltip>
                </>
            )}
        </Stack>
    );

    return (
        <DashboardLayout role="manager" title="Pending Requests">
            {loading ? (
                <LoadingSpinner />
            ) : requests.length === 0 ? (
                <Paper sx={{ p: 6, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, color: 'text.secondary', border: 'none', boxShadow: 'var(--shadow-sm)' }}>
                    <AssignmentIcon sx={{ fontSize: 48, color: 'grey.300' }} />
                    <Typography>No pending requests found.</Typography>
                </Paper>
            ) : isMobile ? (
                <Stack spacing={2}>
                    {requests.map(req => (
                        <Card key={req.id} sx={{ borderRadius: 2, boxShadow: 'var(--shadow-sm)' }}>
                            <CardContent>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                    <Typography variant="subtitle2" color="primary" fontWeight="bold">#{req.id}</Typography>
                                    <Chip
                                        icon={<AttachFileIcon sx={{ fontSize: '1rem !important' }} />}
                                        label={`${req.documents.length} files`}
                                        size="small"
                                        variant="outlined"
                                    />
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
                                <ActionButtons req={req} isCard />
                            </CardContent>
                        </Card>
                    ))}
                </Stack>
            ) : (
                <Paper sx={{ width: '100%', overflow: 'hidden', border: 'none', boxShadow: 'var(--shadow-sm)' }}>
                    <TableContainer>
                        <Table sx={{ minWidth: 650 }} aria-label="pending requests table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>ID</TableCell>
                                    <TableCell>From</TableCell>
                                    <TableCell>Description (En)</TableCell>
                                    <TableCell>Documents</TableCell>
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
                                            <Chip
                                                icon={<AttachFileIcon />}
                                                label={`${req.documents.length} files`}
                                                size="small"
                                                variant="outlined"
                                            />
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
                    {selectedRequest && (
                        <>
                            <Button
                                variant="contained"
                                color="error"
                                onClick={() => {
                                    handleCloseModal();
                                    handleAction(selectedRequest.id, 'REJECT');
                                }}
                            >
                                Reject
                            </Button>
                            <Button
                                variant="contained"
                                color="warning"
                                onClick={() => {
                                    handleCloseModal();
                                    handleAction(selectedRequest.id, 'MINUTE');
                                }}
                            >
                                Minute
                            </Button>
                            <Button
                                variant="contained"
                                color="success"
                                onClick={() => {
                                    handleCloseModal();
                                    handleAction(selectedRequest.id, 'APPROVE');
                                }}
                            >
                                Approve
                            </Button>
                        </>
                    )}
                </DialogActions>
            </Dialog>
        </DashboardLayout >
    );
};

export default PendingRequests;
