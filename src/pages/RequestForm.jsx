import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
    CircularProgress, 
    Box, 
    Typography, 
    TextField, 
    Button, 
    Paper, 
    Grid, 
    Divider, 
    useTheme, 
    useMediaQuery,
    Stack
} from '@mui/material';
import DashboardLayout from '../components/DashboardLayout';
import { useTranslation } from 'react-i18next';

import { API_URL } from '../config';

const RequestForm = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { t } = useTranslation();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const [formData, setFormData] = useState({
        beneficiary: '',
        bankName: '',
        accountNumber: '',
        referenceNumber: 'Online-1546', 
        requestDate: new Date().toISOString().split('T')[0],
        amount: 101500.00,
        currency: 'USD',
        amountInWords: 'One hundred and one thousand five hundred USD',
        descriptionEn: 'Payment of the invoice (attached) for booking flights...',
        descriptionFr: 'Paiement de la facture (ci-jointe) pour la réservation des vols...',
        accountName: 'ISDAO expenses - Institutional Development',
        fundingSourceCode: '12003 - Baring Foundation - FCDO',
        quickBooksCode: '5020002'
    });
    const [files, setFiles] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        setFiles(Array.from(e.target.files));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!formData.descriptionEn || !formData.descriptionFr) {
            setError('Please provide both English and French descriptions.');
            return;
        }
        if (files.length === 0) {
            setError('Please attach at least one document.');
            return;
        }

        setLoading(true);
        const data = new FormData();
        Object.keys(formData).forEach(key => {
            data.append(key, formData[key]);
        });
        files.forEach(file => {
            data.append('documents', file);
        });

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/api/requests`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: data
            });

            if (response.ok) {
                navigate('/clerk-dashboard');
            } else {
                const resData = await response.json();
                setError(resData.message || 'Failed to create request');
            }
        } catch (err) {
            console.error(err);
            setError('Server error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <DashboardLayout role="clerk" title={t('nav.new_request')}>
            <Paper sx={{ 
                maxWidth: '900px', 
                margin: '0 auto', 
                p: { xs: 2, sm: 4 }, 
                boxShadow: 'var(--shadow-md)',
                borderRadius: 2
            }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                    <Typography variant="h4" fontWeight="bold" sx={{ letterSpacing: 2 }}>ISDAO</Typography>
                    <Typography variant="subtitle2" color="text.secondary">PV AVIENTI</Typography>
                </Box>

                <Box sx={{ textAlign: 'center', mb: 4 }}>
                    <Typography variant="h6" fontWeight="bold">Bon de paiement // Payment Voucher</Typography>
                </Box>

                <Grid container spacing={2} sx={{ mb: 4 }}>
                    <Grid item xs={12} md={6}>
                        <TextField fullWidth size="small" label="Bank name" name="bankName" value={formData.bankName} onChange={handleChange} disabled={loading} variant="standard" />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField fullWidth size="small" label="Reference number" name="referenceNumber" value={formData.referenceNumber} onChange={handleChange} disabled={loading} variant="standard" />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField fullWidth size="small" label="Account number" name="accountNumber" value={formData.accountNumber} onChange={handleChange} disabled={loading} variant="standard" />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField fullWidth size="small" label="Date" type="date" name="requestDate" value={formData.requestDate} onChange={handleChange} disabled={loading} variant="standard" InputLabelProps={{ shrink: true }} />
                    </Grid>
                </Grid>

                <Box sx={{ mb: 4 }}>
                    <TextField fullWidth label="PAYEE (BENEFICAIRE)" name="beneficiary" value={formData.beneficiary} onChange={handleChange} disabled={loading} variant="standard" sx={{ fontWeight: 'bold' }} />
                </Box>

                <Box sx={{ p: 2, border: '1px solid #e0e0e0', borderRadius: 1, mb: 4, bgcolor: '#f9fafb' }}>
                    <Typography variant="subtitle2" fontWeight="bold" gutterBottom>AMOUNT IN USD: $ {formData.amount.toLocaleString()}</Typography>
                    <TextField fullWidth multiline rows={2} placeholder="Amount in words" name="amountInWords" value={formData.amountInWords} onChange={handleChange} disabled={loading} variant="standard" />
                </Box>

                <Box sx={{ mb: 4 }}>
                    <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 2, bgcolor: '#f3f4f6', p: 1, textAlign: 'center' }}>
                        Détail du paiement // Particulars of payment
                    </Typography>
                    <Stack spacing={3}>
                        <Box>
                            <Typography variant="caption" color="text.secondary">Description (FR & EN)</Typography>
                            <Stack spacing={1} sx={{ mt: 1 }}>
                                <TextField fullWidth multiline rows={2} placeholder="French Description" name="descriptionFr" value={formData.descriptionFr} onChange={handleChange} disabled={loading} size="small" />
                                <TextField fullWidth multiline rows={2} placeholder="English Description" name="descriptionEn" value={formData.descriptionEn} onChange={handleChange} disabled={loading} size="small" />
                            </Stack>
                        </Box>
                        
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={6}>
                                <TextField fullWidth label="Amount" type="number" name="amount" value={formData.amount} onChange={handleChange} disabled={loading} size="small" />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField fullWidth label="QuickBooks Code" name="quickBooksCode" value={formData.quickBooksCode} onChange={handleChange} disabled={loading} size="small" />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField fullWidth multiline rows={2} label="Account name" name="accountName" value={formData.accountName} onChange={handleChange} disabled={loading} size="small" />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField fullWidth multiline rows={2} label="Funding source code" name="fundingSourceCode" value={formData.fundingSourceCode} onChange={handleChange} disabled={loading} size="small" />
                            </Grid>
                        </Grid>
                    </Stack>
                </Box>

                <Box sx={{ mb: 4 }}>
                    <Typography variant="subtitle2" fontWeight="bold" gutterBottom>Supporting Documents:</Typography>
                    <input
                        type="file"
                        multiple
                        onChange={handleFileChange}
                        style={{ border: '1px solid #ccc', padding: '0.5rem', width: '100%', borderRadius: '4px' }}
                        disabled={loading}
                    />
                </Box>

                {error && <Typography color="error" sx={{ mb: 2 }}>{error}</Typography>}

                <Divider sx={{ mb: 4 }} />

                <Grid container spacing={2} sx={{ mb: 4 }}>
                    <Grid item xs={12} sm={6}>
                        <Typography variant="body2"><strong>Prepared By:</strong> {user?.username} ({user?.role})</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6} sx={{ textAlign: { sm: 'right' } }}>
                        <Typography variant="body2"><strong>Date:</strong> {new Date().toLocaleDateString()}</Typography>
                    </Grid>
                </Grid>

                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', flexDirection: { xs: 'column', sm: 'row' } }}>
                    <Button variant="outlined" color="inherit" onClick={() => navigate('/clerk-dashboard')} disabled={loading} fullWidth={isMobile}>Cancel</Button>
                    <Button variant="contained" color="primary" onClick={handleSubmit} disabled={loading} fullWidth={isMobile} startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}>
                        Submit Request
                    </Button>
                </Box>
            </Paper>
        </DashboardLayout>
    );
};

export default RequestForm;
