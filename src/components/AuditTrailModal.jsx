import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Typography,
    Box,
    IconButton,
    Chip
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import HistoryIcon from '@mui/icons-material/History';
import { useTranslation } from 'react-i18next';

const AuditTrailModal = ({ open, onClose, history, referenceNumber }) => {
    const { t } = useTranslation();

    const getActionColor = (action) => {
        switch (action) {
            case 'CREATED': return 'primary';
            case 'SUBMITTED': return 'info';
            case 'APPROVED': return 'success';
            case 'REJECTED':
            case 'REJECTED_MANAGER':
            case 'REJECTED_ED': return 'error';
            case 'RETURNED_MANAGER':
            case 'RETURNED_ED': return 'warning';
            case 'EDITED': return 'secondary';
            default: return 'default';
        }
    };

    return (
        <Dialog 
            open={open} 
            onClose={onClose} 
            maxWidth="md" 
            fullWidth
            PaperProps={{
                sx: { borderRadius: 3 }
            }}
        >
            <DialogTitle sx={{ m: 0, p: 2, display: 'flex', alignItems: 'center', gap: 1, borderBottom: '1px solid #eee' }}>
                <HistoryIcon color="primary" />
                <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
                    Audit Trail & Comments {referenceNumber ? `- #${referenceNumber}` : ''}
                </Typography>
                <IconButton onClick={onClose} size="small">
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent sx={{ p: 0 }}>
                {(!history || history.length === 0) ? (
                    <Box sx={{ p: 4, textAlign: 'center' }}>
                        <Typography color="text.secondary">No history available for this request.</Typography>
                    </Box>
                ) : (
                    <TableContainer component={Box}>
                        <Table stickyHeader>
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={{ fontWeight: 'bold', bgcolor: '#f8fafc' }}>Date & Time</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', bgcolor: '#f8fafc' }}>Action</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', bgcolor: '#f8fafc' }}>Actor</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', bgcolor: '#f8fafc' }}>Comments</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {history.map((item, index) => (
                                    <TableRow key={index} hover>
                                        <TableCell sx={{ whiteSpace: 'nowrap' }}>
                                            {new Date(item.timestamp).toLocaleString()}
                                        </TableCell>
                                        <TableCell>
                                            <Chip 
                                                label={item.action} 
                                                size="small" 
                                                color={getActionColor(item.action)}
                                                variant="outlined"
                                                sx={{ fontWeight: 'bold' }}
                                            />
                                        </TableCell>
                                        <TableCell sx={{ fontWeight: 500 }}>
                                            {item.actor?.username || 'System'}
                                        </TableCell>
                                        <TableCell sx={{ color: 'text.secondary', minWidth: '200px' }}>
                                            {item.comment || <Typography variant="caption" sx={{ fontStyle: 'italic', color: '#ccc' }}>No comments</Typography>}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}
            </DialogContent>
            <DialogActions sx={{ p: 2, borderTop: '1px solid #eee' }}>
                <Button onClick={onClose} variant="contained" color="inherit" sx={{ bgcolor: 'grey.100', borderRadius: 2 }}>
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default AuditTrailModal;
