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
import SearchIcon from '@mui/icons-material/Search';
import TextField from '@mui/material/TextField';
import VoucherLayout from '../components/VoucherLayout';
import LoadingSpinner from '../components/LoadingSpinner';
import AuditTrailModal from '../components/AuditTrailModal';
import HistoryIcon from '@mui/icons-material/History';

import { API_URL } from '../config';

const PendingEDRequests = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [openModal, setOpenModal] = useState(false);
    const [historyModalOpen, setHistoryModalOpen] = useState(false);
    const [search, setSearch] = useState('');
    
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
            fetchRequests();
        }, 60000); // 1 minute

        return () => clearInterval(interval);
    }, []);

    const fetchRequests = async () => {
        setLoading(true);
        const token = localStorage.getItem('token');
        try {
            const url = new URL(`${API_URL}/api/requests/ed-tasks`);
            if (search) url.searchParams.append('search', search);

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

    const handleAction = async (id, action) => {
        let comment = '';
        if (action === 'REJECT') {
            comment = prompt('Please provide a reason for final rejection:');
            if (!comment) return;
        } else if (action === 'RETURN') {
            comment = prompt('Please provide comments for returning to manager:');
            if (!comment) return;
        } else if (action === 'APPROVE') {
            if (!confirm('Are you sure you want to give final approval to this request?')) return;
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
            <Tooltip title="View History">
                <Button
                    size="small"
                    variant="outlined"
                    color="secondary"
                    onClick={() => handleViewHistory(req)}
                    sx={{ 
                        bgcolor: 'rgba(156, 39, 176, 0.1)', 
                        color: 'secondary.main', 
                        boxShadow: 'none', 
                        '&:hover': { bgcolor: 'rgba(156, 39, 176, 0.2)', boxShadow: 'none' } 
                    }}
                    startIcon={<HistoryIcon />}
                    fullWidth={isCard}
                >
                    History
                </Button>
            </Tooltip>
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
                        onClick={() => handleAction(req.id, 'RETURN')}
                        startIcon={<ReplyIcon />}
                        sx={{ flex: 1 }}
                    >
                        Return
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
                    <Tooltip title="Final Approve">
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
                    <Tooltip title="Return to Manager">
                        <Button
                            variant="contained"
                            color="warning"
                            size="small"
                            onClick={() => handleAction(req.id, 'RETURN')}
                            startIcon={<ReplyIcon />}
                            sx={{ bgcolor: 'rgba(245, 158, 11, 0.1)', color: 'warning.main', boxShadow: 'none', '&:hover': { bgcolor: 'rgba(245, 158, 11, 0.2)', boxShadow: 'none' } }}
                        >
                            Return
                        </Button>
                    </Tooltip>
                    <Tooltip title="Final Reject">
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
        <DashboardLayout role="ed" title="Awaiting ED Approval">
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
                    <Typography>No requests awaiting your approval.</Typography>
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
                                        label={`${req.documents?.length || 0} files`}
                                        size="small"
                                        variant="outlined"
                                        onClick={(e) => { e.stopPropagation(); handleViewDocuments(req); }}
                                        sx={{ cursor: 'pointer', '&:hover': { bgcolor: 'rgba(0,0,0,0.04)' } }}
                                    />
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                    <Avatar sx={{ width: 20, height: 20, fontSize: '0.675rem', bgcolor: 'grey.300' }}>
                                        {req.user?.username.charAt(0).toUpperCase()}
                                    </Avatar>
                                    <Typography variant="body2" fontWeight="medium">{req.user?.username}</Typography>
                                </Box>
                                <Box sx={{ mt: 1, mb: 1 }}>
                                    <Typography variant="caption" color="text.secondary">Manager: {req.manager?.username}</Typography>
                                </Box>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                    {req.voucher?.descriptionEn || req.descriptionEn}
                                </Typography>
                                <ActionButtons req={req} isCard />
                            </CardContent>
                        </Card>
                    ))}
                </Stack>
            ) : (
                <Paper sx={{ width: '100%', overflow: 'hidden', border: 'none', boxShadow: 'var(--shadow-sm)' }}>
                    <TableContainer>
                        <Table sx={{ minWidth: 650 }} aria-label="pending ed requests table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>ID</TableCell>
                                    <TableCell>Requester</TableCell>
                                    <TableCell>Manager</TableCell>
                                    <TableCell>Description (En)</TableCell>
                                    <TableCell>Documents</TableCell>
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
                                                    {req.user?.username.charAt(0).toUpperCase()}
                                                </Avatar>
                                                <Typography variant="body2">{req.user?.username}</Typography>
                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2">{req.manager?.username}</Typography>
                                        </TableCell>
                                        <TableCell sx={{ maxWidth: 300 }}>
                                            <Typography variant="body2" noWrap>{req.voucher?.descriptionEn || req.descriptionEn}</Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                icon={<AttachFileIcon />}
                                                label={`${req.documents?.length || 0} files`}
                                                size="small"
                                                variant="outlined"
                                                onClick={(e) => { e.stopPropagation(); handleViewDocuments(req); }}
                                                sx={{ cursor: 'pointer', '&:hover': { bgcolor: 'rgba(0,0,0,0.04)' } }}
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
                    {selectedRequest && (
                        <Box sx={{ display: 'flex', gap: 1 }}>
                            {selectedRequest.letter?.pdfFilePath && (
                                <Button
                                    variant="outlined"
                                    color="primary"
                                    size="small"
                                    href={`${API_URL}/${selectedRequest.letter.pdfFilePath}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    View PDF
                                </Button>
                            )}
                            <Button
                                variant="contained"
                                color="success"
                                size="small"
                                onClick={() => { handleCloseModal(); handleAction(selectedRequest.id, 'APPROVE'); }}
                            >
                                Final Approve
                            </Button>
                            <Button
                                variant="contained"
                                color="warning"
                                size="small"
                                onClick={() => { handleCloseModal(); handleAction(selectedRequest.id, 'RETURN'); }}
                            >
                                Return to Manager
                            </Button>
                            <Button
                                variant="contained"
                                color="error"
                                size="small"
                                onClick={() => { handleCloseModal(); handleAction(selectedRequest.id, 'REJECT'); }}
                            >
                                Final Reject
                            </Button>
                        </Box>
                    )}
                </DialogActions>
            </Dialog>

            <AuditTrailModal 
                open={historyModalOpen}
                onClose={() => setHistoryModalOpen(false)}
                history={selectedRequest?.history}
                referenceNumber={selectedRequest?.referenceNumber}
            />
        </DashboardLayout >
    );
};

export default PendingEDRequests;
