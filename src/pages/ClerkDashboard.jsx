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
    useMediaQuery,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    IconButton,
    TextField
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SendIcon from '@mui/icons-material/Send';
import EditIcon from '@mui/icons-material/Edit';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import LoadingSpinner from '../components/LoadingSpinner';
import VoucherLayout from '../components/VoucherLayout';
import AuditTrailModal from '../components/AuditTrailModal';
import { useTranslation } from 'react-i18next';
import HistoryIcon from '@mui/icons-material/History';

import { API_URL } from '../config';

const ClerkDashboard = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [openModal, setOpenModal] = useState(false);
    const [reasonModalOpen, setReasonModalOpen] = useState(false);
    const [historyModalOpen, setHistoryModalOpen] = useState(false);
    const [currentReason, setCurrentReason] = useState('');
    const [search, setSearch] = useState('');
    
    const { t } = useTranslation();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchRequests();
        }, 500); // Debounce search

        return () => clearTimeout(timer);
    }, [search]);

    useEffect(() => {
        const interval = setInterval(() => {
            fetchRequests();
        }, 60000); // 1 minute

        return () => clearInterval(interval);
    }, []);

    const fetchRequests = async () => {
        const token = localStorage.getItem('token');
        setLoading(true);
        try {
            const url = new URL(`${API_URL}/api/requests`);
            if (search) url.searchParams.append('search', search);
            
            const response = await fetch(url.toString(), {
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

    const handleViewDetails = (req) => {
        setSelectedRequest(req);
        setOpenModal(true);
    };

    const handleViewHistory = (req) => {
        setSelectedRequest(req);
        setHistoryModalOpen(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
        setSelectedRequest(null);
    };

    const handleViewReason = (req) => {
        // Find the latest RETURNED action in history
        const returnAction = [...(req.history || [])]
            .reverse()
            .find(h => h.action === 'RETURNED_MANAGER' || h.action === 'RETURNED_ED');
        
        setCurrentReason(returnAction?.comment || 'No reason provided.');
        setReasonModalOpen(true);
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'APPROVED': return 'success';
            case 'REJECTED': 
            case 'REJECTED_MANAGER':
            case 'REJECTED_ED': return 'error';
            case 'PENDING_MANAGER': return 'info';
            case 'PENDING_ED': return 'warning';
            case 'RETURNED_MANAGER':
            case 'RETURNED_ED': return 'secondary';
            default: return 'default';
        }
    };

    const getStatusLabel = (status) => {
        switch (status) {
            case 'APPROVED': return 'Approved';
            case 'PENDING_MANAGER': return 'Awaiting Manager';
            case 'PENDING_ED': return 'Awaiting ED Approval';
            case 'RETURNED_MANAGER': return 'Returned by Manager';
            case 'RETURNED_ED': return 'Returned to Manager';
            case 'REJECTED_MANAGER': return 'Rejected by Manager';
            case 'REJECTED_ED': return 'Rejected by ED';
            default: return status;
        }
    };

const ActionButtons = ({ req, onView, onReason, onHistory, onSubmit, isMobile, t }) => (
    <Stack direction="row" spacing={1} justifyContent={isMobile ? "center" : "flex-end"}>
        <Tooltip title="View History">
            <Button
                variant="outlined"
                color="secondary"
                size="small"
                onClick={() => onHistory(req)}
                startIcon={<HistoryIcon />}
            >
                History
            </Button>
        </Tooltip>
        <Tooltip title="View Details">
            <Button
                variant="outlined"
                color="primary"
                size="small"
                onClick={() => onView(req)}
                startIcon={<VisibilityIcon />}
            >
                View
            </Button>
        </Tooltip>
        {(req.status === 'RETURNED_MANAGER' || req.status === 'RETURNED_ED') && (
            <Tooltip title="View Return Reason">
                <Button
                    variant="outlined"
                    color="info"
                    size="small"
                    onClick={() => onReason(req)}
                    startIcon={<InfoOutlinedIcon />}
                >
                    Reason
                </Button>
            </Tooltip>
        )}
        {(req.status === 'DRAFT' || req.status === 'RETURNED_MANAGER') && (
            <Tooltip title="Submit Request">
                <Button
                    variant="contained"
                    color="success"
                    size="small"
                    onClick={() => onSubmit(req.id)}
                    startIcon={<SendIcon />}
                >
                    {t('common.submit')}
                </Button>
            </Tooltip>
        )}
        {(req.status === 'DRAFT' || req.status === 'RETURNED_MANAGER') && (
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
            <Typography variant="h4" sx={{ mb: 4, fontWeight: 'bold', textTransform: 'uppercase' }}>
                CLERK DASHBOARD
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', justifyContent: 'space-between', alignItems: 'center', mb: 4, gap: 2 }}>
                <Box sx={{ width: isMobile ? '100%' : '350px' }}>
                    <TextField
                        fullWidth
                        placeholder="Search by reference number..."
                        variant="outlined"
                        size="small"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        sx={{ bgcolor: 'white', borderRadius: 2 }}
                        InputProps={{
                            startAdornment: (
                                <Box sx={{ mr: 1, color: 'text.secondary', display: 'flex' }}>
                                    <SearchIcon fontSize="small" />
                                </Box>
                            ),
                        }}
                    />
                </Box>
                <Link to="/create-request" style={{ textDecoration: 'none', width: isMobile ? '100%' : 'auto' }}>
                    <Button
                        variant="contained"
                        size="large"
                        startIcon={<AddIcon />}
                        fullWidth={isMobile}
                        sx={{ borderRadius: 3, px: 3, height: '40px' }}
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
                                        #{req.referenceNumber}
                                    </Typography>
                                    <Chip
                                        label={getStatusLabel(req.status)}
                                        color={getStatusColor(req.status)}
                                        size="small"
                                        sx={{ fontWeight: 600 }}
                                    />
                                </Box>
                                <Typography variant="body1" sx={{ mb: 1, fontWeight: 500 }}>
                                    {req.voucher?.beneficiary || 'N/A'}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                    {req.voucher?.totalAmount?.toLocaleString()} {req.voucher?.currency}
                                </Typography>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                    <Typography variant="caption" color="text.secondary">
                                        {new Date(req.createdAt).toLocaleDateString()}
                                    </Typography>
                                </Box>
                                <ActionButtons 
                                    req={req} 
                                    onView={handleViewDetails} 
                                    onReason={handleViewReason} 
                                    onHistory={handleViewHistory}
                                    onSubmit={handleSubmit} 
                                    isMobile={isMobile} 
                                    t={t} 
                                />
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
                                    <TableCell>Ref #</TableCell>
                                    <TableCell>Payee</TableCell>
                                    <TableCell>Amount</TableCell>
                                    <TableCell>{t('requests.status')}</TableCell>
                                    <TableCell>{t('requests.created_at')}</TableCell>
                                    <TableCell align="right">{t('common.actions')}</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {requests.map(req => (
                                    <TableRow key={req.id} hover>
                                        <TableCell>
                                            <Typography variant="subtitle2" color="primary">{req.referenceNumber}</Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2" fontWeight="medium">{req.voucher?.beneficiary || 'N/A'}</Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2">{req.voucher?.totalAmount?.toLocaleString()} {req.voucher?.currency}</Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                label={getStatusLabel(req.status)}
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
                                            <ActionButtons 
                                                req={req} 
                                                onView={handleViewDetails} 
                                                onReason={handleViewReason} 
                                                onHistory={handleViewHistory}
                                                onSubmit={handleSubmit} 
                                                isMobile={isMobile} 
                                                t={t} 
                                            />
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
                <DialogTitle sx={{ m: 0, p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h6">Request Details - {selectedRequest?.referenceNumber}</Typography>
                    <IconButton onClick={handleCloseModal}>
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent dividers sx={{ p: 4, bgcolor: '#f3f4f6' }}>
                    {selectedRequest?.letter?.content && (
                        <Paper sx={{ p: 4, mb: 4, border: '1px solid #e5e7eb', borderRadius: 2 }}>
                            <Typography variant="h6" gutterBottom sx={{ borderBottom: '2px solid #3b82f6', pb: 1, mb: 3 }}>
                                Payment Request Letter
                            </Typography>
                            <Box 
                                className="rich-text-content"
                                dangerouslySetInnerHTML={{ __html: selectedRequest.letter.content }} 
                                sx={{ 
                                    '& p': { mb: 2 },
                                    '& ul, & ol': { pl: 3, mb: 2 },
                                    wordBreak: 'break-word',
                                    overflowWrap: 'break-word',
                                    '& img': { maxWidth: '100%', height: 'auto' }
                                }}
                            />
                        </Paper>
                    )}
                    
                    <Paper sx={{ p: 0, overflow: 'hidden', border: '1px solid #e5e7eb', borderRadius: 2 }}>
                        <VoucherLayout request={selectedRequest} />
                    </Paper>
                </DialogContent>
                <DialogActions sx={{ px: 3, py: 2 }}>
                    {selectedRequest?.letter?.pdfFilePath && (
                        <Button 
                            variant="outlined"
                            href={`${API_URL}/${selectedRequest.letter.pdfFilePath}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            color="primary"
                        >
                            View Signed PDF
                        </Button>
                    )}
                    <Button onClick={handleCloseModal} variant="contained" color="inherit" sx={{ bgcolor: 'grey.200' }}>
                        Close
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Return Reason Modal */}
            <Dialog 
                open={reasonModalOpen} 
                onClose={() => setReasonModalOpen(false)}
                PaperProps={{ sx: { borderRadius: 1, p: 1 } }}
            >
                <DialogTitle sx={{ fontWeight: 'bold', pb: 1 }}>
                    Return Reason
                </DialogTitle>
                <DialogContent>
                    <Typography variant="body1" sx={{ mt: 1 }}>
                        {currentReason}
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setReasonModalOpen(false)} variant="contained" sx={{ borderRadius: 2 }}>
                        Close
                    </Button>
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

export default ClerkDashboard;
