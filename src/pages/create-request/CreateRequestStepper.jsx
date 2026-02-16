import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
    Box, 
    Button, 
    Stepper, 
    Step, 
    StepLabel, 
    Paper,
    Typography,
    CircularProgress
} from '@mui/material';
import DashboardLayout from '../../components/DashboardLayout';
import { useTranslation } from 'react-i18next';
import { API_URL } from '../../config';

import Step1_PaymentRequest from './Step1_PaymentRequest';
import Step2_PaymentVoucher from './Step2_PaymentVoucher';
import Step3_SupportingDocuments from './Step3_SupportingDocuments';
import Step4_ReviewSubmit from './Step4_ReviewSubmit';

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import SendIcon from '@mui/icons-material/Send';

const steps = ['Payment Request', 'Payment Voucher', 'Supporting Documents', 'Review & Submit'];

const CreateRequestStepper = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { t } = useTranslation();
    const [activeStep, setActiveStep] = useState(() => {
        const saved = localStorage.getItem('stepper_active_step');
        return saved ? parseInt(saved, 10) : 0;
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState(() => {
        const saved = localStorage.getItem('stepper_form_data');
        if (saved) {
            try {
                return JSON.parse(saved);
            } catch (e) {
                console.error("Error parsing saved form data", e);
            }
        }
        return {
            paymentRequestBody: '',
            beneficiary: '',
            bankName: '',
            accountNumber: '',
            requestDate: new Date().toISOString().split('T')[0],
            amount: '',
            currency: 'USD',
            amountInWords: '',
            descriptionEn: '',
            descriptionFr: '',
            accountName: '',
            fundingSourceCode: '',
            quickBooksCode: '',
            items: [{ particulars: '', amount: '', accountName: '', fundingSourceCode: '', quickBooksCode: '' }],
            totalAmount: 0
        };
    });
    const [files, setFiles] = useState([]);

    // Persist state to localStorage
    React.useEffect(() => {
        localStorage.setItem('stepper_active_step', activeStep.toString());
        localStorage.setItem('stepper_form_data', JSON.stringify(formData));
    }, [activeStep, formData]);

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (error) setError('');
    };

    const handleRichTextChange = (value) => {
        setFormData(prev => ({ ...prev, paymentRequestBody: value }));
        if (error) setError('');
    };

    const handleItemsChange = (newItems) => {
        const total = newItems.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);
        setFormData(prev => ({ ...prev, items: newItems, totalAmount: total, amount: total }));
        if (error) setError('');
    };

    const handleNext = () => {
        setError('');
        // Validation logic per step
        if (activeStep === 0) {
            // Check if rich text is empty (stripping HTML tags)
            const textContent = formData.paymentRequestBody.replace(/<[^>]*>/g, '').trim();
            if (!textContent) {
                setError('Please write your payment request details.');
                return;
            }
        }
        if (activeStep === 1) {
            if (!formData.bankName) {
                setError('Please select a bank.');
                return;
            }
            if (!formData.accountNumber) {
                setError('Please select an account number.');
                return;
            }
            if (!formData.beneficiary) {
                setError('Please provide a beneficiary name.');
                return;
            }
            if (!formData.amountInWords) {
                setError('Please provide the amount in words.');
                return;
            }
            
            // Validate items
            if (formData.items.length === 0) {
                setError('Please add at least one item to the voucher.');
                return;
            }

            const invalidItem = formData.items.find(item => !item.particulars?.trim() || !item.amount || parseFloat(item.amount) <= 0);
            if (invalidItem) {
                setError('All items must have particulars and a positive amount.');
                return;
            }

            if (formData.totalAmount <= 0) {
                setError('Total amount must be greater than zero.');
                return;
            }
        }
        if (activeStep === 2) {
            if (files.length === 0) {
                setError('Please attach at least one supporting document.');
                return;
            }
        }

        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setError('');
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleSubmit = async () => {
        setLoading(true);
        setError('');

        const data = new FormData();
        Object.keys(formData).forEach(key => {
            if (key === 'items') {
                data.append(key, JSON.stringify(formData[key]));
            } else {
                data.append(key, formData[key]);
            }
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
                // Clear persistence on success
                localStorage.removeItem('stepper_active_step');
                localStorage.removeItem('stepper_form_data');
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

    const getStepContent = (step) => {
        switch (step) {
            case 0:
                return <Step1_PaymentRequest 
                            value={formData.paymentRequestBody} 
                            onChange={handleRichTextChange} 
                            error={error}
                       />;
            case 1:
                return <Step2_PaymentVoucher 
                            formData={formData} 
                            handleChange={handleFormChange}
                            handleItemsChange={handleItemsChange}
                       />;
            case 2:
                return <Step3_SupportingDocuments 
                            files={files} 
                            setFiles={setFiles} 
                            error={error}
                       />;
            case 3:
                return <Step4_ReviewSubmit 
                            formData={{...formData, username: user?.username}} 
                            files={files} 
                       />;
            default:
                return 'Unknown step';
        }
    };

    return (
        <DashboardLayout role="clerk" title={t('nav.new_request')}>
            <Paper sx={{ 
                maxWidth: '1000px', 
                margin: '0 auto', 
                p: { xs: 2, sm: 4 }, 
                boxShadow: 'var(--shadow-md)',
                borderRadius: 2
            }}>
                <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
                    {steps.map((label) => (
                        <Step key={label}>
                            <StepLabel>{label}</StepLabel>
                        </Step>
                    ))}
                </Stepper>

                <Box sx={{ minHeight: '400px' }}>
                    {getStepContent(activeStep)}
                </Box>
                
                {error && (
                     <Typography color="error" sx={{ mt: 2, textAlign: 'center', fontWeight: 'bold' }}>{error}</Typography>
                )}

                <Box sx={{ display: 'flex', flexDirection: 'row', pt: 4, borderTop: '1px solid #f0f0f0', mt: 4 }}>
                    <Button
                        color="inherit"
                        disabled={activeStep === 0 || loading}
                        onClick={handleBack}
                        startIcon={<ArrowBackIcon />}
                        sx={{ mr: 1 }}
                    >
                        Back
                    </Button>
                    <Box sx={{ flex: '1 1 auto' }} />
                    {activeStep === steps.length - 1 ? (
                        <Button 
                            variant="contained" 
                            onClick={handleSubmit} 
                            disabled={loading}
                            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SendIcon />}
                        >
                            {loading ? 'Submitting...' : 'Submit Request'}
                        </Button>
                    ) : (
                        <Button variant="contained" onClick={handleNext} endIcon={<ArrowForwardIcon />}>
                            Next
                        </Button>
                    )}
                </Box>
            </Paper>
        </DashboardLayout>
    );
};

export default CreateRequestStepper;
