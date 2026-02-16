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
import SearchIcon from '@mui/icons-material/Search';
import TextField from '@mui/material/TextField';
import VoucherLayout from '../components/VoucherLayout';
import LoadingSpinner from '../components/LoadingSpinner';
import AuditTrailModal from '../components/AuditTrailModal';
import HistoryIcon from '@mui/icons-material/History';
import { API_URL } from '../config';
import { useAuth } from '../context/AuthContext';

const RejectedRequests = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [openModal, setOpenModal] = useState(false);
    const [historyModalOpen, setHistoryModalOpen] = useState(false);
    const [search, setSearch] = useState('');
    const { user } = useAuth();
    
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const handleView = (request) => {
        setSelectedRequest(request);
        setOpenModal(true);
    };

    const handleViewHistory = (req) => {
        setSelectedRequest(req);
        setHistoryModalOpen(true);
    };

    const handleViewDocuments = (request) => {
        if (request.documents && request.documents.length > 0) {
            request.documents.forEach(doc => {
                window.open(`${API_URL}/${doc.filePath}`, '_blank');
            });
        }
    };

    const handleCloseModal = () => {
        setOpenModal(false);
        setSelectedRequest(null);
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchRequests();
        }, 500);
        return () => clearTimeout(timer);
    }, [search]);

    useEffect(() => {
        const interval = setInterval(() => {
            fetchRequests(true);
        }, 60000); // 1 minute

        return () => clearInterval(interval);
    }, []);

    const fetchRequests = async (silent = false) => {
        if (!silent) setLoading(true);
        const token = localStorage.getItem('token');
        const endpoint = (user?.role === 'MANAGER' || user?.role === 'ED')
            ? `${API_URL}/api/requests/subordinates`
            : `${API_URL}/api/requests`;
            
        const url = new URL(endpoint);
        url.searchParams.append('status', 'REJECTED,REJECTED_MANAGER,REJECTED_ED');
        if (search) url.searchParams.append('search', search);

        try {
            const response = await fetch(url.toString(), {
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
            <Box sx={{ mb: 3, maxWidth: 400 }}>
                <TextField
                    fullWidth
                    placeholder="Search by reference number..."
                    size="small"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    InputProps={{
                        startAdornment: (
                            <Box sx={{ mr: 1, color: 'text.secondary', display: 'flex' }}>
                                <SearchIcon fontSize="small" />
                            </Box>
                        ),
                    }}
                    sx={{ bgcolor: 'white', borderRadius: 2 }}
                />
            </Box>
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
                                    <Typography variant="subtitle2" color="primary" fontWeight="bold">#{req.referenceNumber || req.id}</Typography>
                                    <Chip 
                                        label={req.status.startsWith('REJECTED') ? req.status : 'REJECTED'} 
                                        color="error" 
                                        size="small" 
                                    />
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                    <Avatar sx={{ width: 20, height: 20, fontSize: '0.675rem', bgcolor: 'grey.300' }}>
                                        {req.user.username.charAt(0).toUpperCase()}
                                    </Avatar>
                                    <Typography variant="body2" fontWeight="medium">{req.user.username}</Typography>
                                </Box>
                                <Typography variant="body1" sx={{ mb: 1, fontWeight: 500 }}>
                                    {req.voucher?.beneficiary || 'N/A'}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                    Requester: {req.user.username}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                    Manager: {req.manager?.username || 'N/A'}
                                </Typography>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Chip
                                        icon={<AttachFileIcon sx={{ fontSize: '1rem !important' }} />}
                                        label={`${req.documents.length} files`}
                                        size="small"
                                        variant="outlined"
                                        onClick={(e) => { e.stopPropagation(); handleViewDocuments(req); }}
                                        sx={{ cursor: 'pointer', '&:hover': { bgcolor: 'rgba(0,0,0,0.04)' } }}
                                    />
                                    <Button
                                        size="small"
                                        variant="outlined"
                                        color="secondary"
                                        onClick={() => handleViewHistory(req)}
                                        startIcon={<HistoryIcon />}
                                    >
                                        History
                                    </Button>
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
                                    <TableCell>Requester</TableCell>
                                    <TableCell>Manager</TableCell>
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
                                            <Typography variant="subtitle2" color="primary">#{req.referenceNumber || req.id}</Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <Avatar sx={{ width: 24, height: 24, fontSize: '0.75rem', bgcolor: 'grey.300' }}>
                                                    {req.user.username.charAt(0).toUpperCase()}
                                                </Avatar>
                                                <Typography variant="body2">{req.user.username}</Typography>
                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2">{req.manager?.username || 'N/A'}</Typography>
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
                                                onClick={(e) => { e.stopPropagation(); handleViewDocuments(req); }}
                                                sx={{ cursor: 'pointer', '&:hover': { bgcolor: 'rgba(0,0,0,0.04)' } }}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Chip 
                                                label={req.status.startsWith('REJECTED') ? req.status : 'REJECTED'} 
                                                color="error" 
                                                size="small" 
                                            />
                                        </TableCell>
                                        <TableCell align="right">
                                            <Tooltip title="View History">
                                                <IconButton
                                                    size="small"
                                                    onClick={() => handleViewHistory(req)}
                                                    sx={{ color: 'secondary.main', mr: 1 }}
                                                >
                                                    <HistoryIcon />
                                                </IconButton>
                                            </Tooltip>
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
                <DialogContent sx={{ p: 3, bgcolor: '#f3f4f6' }}>
                    <Stack spacing={3}>
                        {selectedRequest && selectedRequest.letter && (
                            <Paper sx={{ p: 4, borderRadius: 1, boxShadow: 'var(--shadow-sm)' }}>
                                <Typography variant="h6" gutterBottom sx={{ borderBottom: '2px solid', borderColor: 'divider', pb: 1, mb: 3, fontWeight: 'bold' }}>
                                    REQUEST LETTER
                                </Typography>
                                <Box 
                                    className="rich-text-content"
                                    dangerouslySetInnerHTML={{ __html: selectedRequest.letter.content }} 
                                    sx={{ 
                                        '& ul, & ol': { pl: 3 },
                                        '& p': { mb: 1 },
                                        wordBreak: 'break-word',
                                        overflowWrap: 'break-word',
                                        '& img': { maxWidth: '100%', height: 'auto' }
                                    }}
                                />
                            </Paper>
                        )}
                        <Paper sx={{ borderRadius: 1, boxShadow: 'var(--shadow-sm)', overflow: 'hidden' }}>
                            <VoucherLayout request={selectedRequest} />
                        </Paper>
                    </Stack>
                </DialogContent>
                <DialogActions sx={{ p: 2, bgcolor: 'white' }}>
                    <Button onClick={handleCloseModal}>Close</Button>
                </DialogActions>
            </Dialog>

            <AuditTrailModal 
                open={historyModalOpen}
                onClose={() => setHistoryModalOpen(false)}
                history={selectedRequest?.history}
                referenceNumber={selectedRequest?.referenceNumber}
            />
        </DashboardLayout>
    );
};

export default RejectedRequests;
