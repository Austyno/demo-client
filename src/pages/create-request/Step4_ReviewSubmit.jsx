import React from 'react';
import { 
    Box, 
    Typography, 
    Paper, 
    Divider,
    Grid,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow
} from '@mui/material';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';

const Step4_ReviewSubmit = ({ formData, files }) => {
    return (
        <Box>
            <Typography variant="h6" gutterBottom>
                Review & Submit
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom sx={{ mb: 3 }}>
                Please review all details before submitting your payment request.
            </Typography>

            <Paper variant="outlined" sx={{ p: 3, mb: 3 }}>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom sx={{ color: 'primary.main' }}>
                    1. Payment Request Details
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Box 
                    sx={{ 
                        p: 2, 
                        bgcolor: 'background.default', 
                        borderRadius: 1, 
                        fontFamily: 'inherit',
                        '& ul, & ol': { pl: 3 } 
                    }}
                    dangerouslySetInnerHTML={{ __html: formData.paymentRequestBody }} 
                />
            </Paper>

            <Paper variant="outlined" sx={{ p: 3, mb: 3 }}>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom sx={{ color: 'primary.main' }}>
                    2. Payment Voucher Details
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Grid container spacing={2}>
                    <Grid item xs={6} md={3}>
                        <Typography variant="caption" color="text.secondary">Beneficiary</Typography>
                        <Typography variant="body2" fontWeight="medium">{formData.beneficiary}</Typography>
                    </Grid>
                    <Grid item xs={6} md={3}>
                        <Typography variant="caption" color="text.secondary">Total Amount</Typography>
                        <Typography variant="body2" fontWeight="bold">{formData.currency} {Number(formData.totalAmount).toLocaleString()}</Typography>
                    </Grid>
                    <Grid item xs={6} md={3}>
                        <Typography variant="caption" color="text.secondary">Date</Typography>
                        <Typography variant="body2" fontWeight="medium">{formData.requestDate}</Typography>
                    </Grid>
                     <Grid item xs={6} md={3}>
                        <Typography variant="caption" color="text.secondary">Bank Name</Typography>
                        <Typography variant="body2" fontWeight="medium">{formData.bankName}</Typography>
                    </Grid>
                    <Grid item xs={6} md={3}>
                        <Typography variant="caption" color="text.secondary">Account Number</Typography>
                        <Typography variant="body2" fontWeight="medium">{formData.accountNumber}</Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="caption" color="text.secondary">Amount in Words</Typography>
                        <Typography variant="body2" fontStyle="italic">{formData.amountInWords}</Typography>
                    </Grid>
                    
                    <Grid item xs={12}>
                        <Typography variant="subtitle2" fontWeight="bold" sx={{ mt: 2, mb: 1 }}>Items Detail // Détails des articles</Typography>
                        <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 0 }}>
                            <Table size="small">
                                <TableHead sx={{ bgcolor: '#fafafa' }}>
                                    <TableRow>
                                        <TableCell sx={{ fontWeight: 'bold' }}>Particulars</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold' }}>Amount</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold' }}>QuickBooks</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {formData.items.map((item, idx) => (
                                        <TableRow key={idx}>
                                            <TableCell>{item.particulars}</TableCell>
                                            <TableCell>{Number(item.amount).toLocaleString()}</TableCell>
                                            <TableCell>{item.quickBooksCode}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Grid>
                </Grid>
            </Paper>

            <Paper variant="outlined" sx={{ p: 3 }}>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom sx={{ color: 'primary.main' }}>
                    3. Supporting Documents
                </Typography>
                <Divider sx={{ mb: 2 }} />
                {files.length > 0 ? (
                    <List dense>
                        {files.map((file, index) => (
                            <ListItem key={index}>
                                <ListItemIcon>
                                    <InsertDriveFileIcon />
                                </ListItemIcon>
                                <ListItemText 
                                    primary={file.name} 
                                    secondary={`${(file.size / 1024).toFixed(1)} KB`} 
                                />
                            </ListItem>
                        ))}
                    </List>
                ) : (
                    <Typography variant="body2" color="text.secondary">No documents attached.</Typography>
                )}
            </Paper>

             <Box sx={{ mt: 3, textAlign: 'center' }}>
                <Typography variant="caption" color="text.secondary">
                    Prepared By: {formData.username || 'Current User'} | Date: {new Date().toLocaleDateString()}
                </Typography>
            </Box>
        </Box>
    );
};

export default Step4_ReviewSubmit;
