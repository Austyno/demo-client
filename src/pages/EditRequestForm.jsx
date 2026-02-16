import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
    CircularProgress, 
    Box, 
    Typography, 
    TextField, 
    Button, 
    Paper, 
    Stack, 
    Alert, 
    List, 
    ListItem, 
    ListItemText,
    useTheme,
    useMediaQuery
} from '@mui/material';
import LoadingSpinner from '../components/LoadingSpinner';
import DashboardLayout from '../components/DashboardLayout';

import { API_URL } from '../config';

const EditRequestForm = () => {
    const { id } = useParams();
    const [descriptionEn, setDescriptionEn] = useState('');
    const [descriptionFr, setDescriptionFr] = useState('');
    const [referenceNumber, setReferenceNumber] = useState('');
    const [existingDocuments, setExistingDocuments] = useState([]);
    const [files, setFiles] = useState([]);
    const [error, setError] = useState('');
    const [comments, setComments] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    useEffect(() => {
        fetchRequest();
    }, [id]);

    const fetchRequest = async () => {
        setIsLoading(true);
        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`${API_URL}/api/requests/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                setDescriptionEn(data.descriptionEn);
                setDescriptionFr(data.descriptionFr);
                setReferenceNumber(data.referenceNumber);
                setExistingDocuments(data.documents);
                if (data.history) {
                    const minuteComments = data.history.filter(h => h.action === 'MINUTE' || h.action === 'REJECT').map(h => h.comment);
                    setComments(minuteComments);
                }
            } else {
                setError('Failed to load request');
            }
        } catch (err) {
            console.error(err);
            setError('Error loading request');
        } finally {
            setIsLoading(false);
        }
    };

    const handleFileChange = (e) => {
        setFiles(Array.from(e.target.files));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        const formData = new FormData();
        formData.append('descriptionEn', descriptionEn);
        formData.append('descriptionFr', descriptionFr);
        files.forEach(file => {
            formData.append('documents', file);
        });

        setIsSubmitting(true);

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/api/requests/${id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });

            if (response.ok) {
                navigate('/clerk-dashboard');
            } else {
                const data = await response.json();
                setError(data.message || 'Failed to update request');
            }
        } catch (err) {
            console.error(err);
            setError('Server error');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return <LoadingSpinner />;
    }

    return (
        <DashboardLayout role="clerk" title={`Edit Payment Request #${referenceNumber || id}`}>
            <Paper sx={{ maxWidth: '600px', margin: '0 auto', p: { xs: 2, sm: 4 }, borderRadius: 2, boxShadow: 'var(--shadow-md)' }}>
                <Typography variant="h5" fontWeight="bold" gutterBottom>
                    Edit Payment Request #{referenceNumber || id}
                </Typography>
                
                {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

                {comments.length > 0 && (
                    <Box sx={{ p: 2, bgcolor: 'warning.light', color: 'warning.contrastText', borderRadius: 2, mb: 3, border: '1px solid', borderColor: 'warning.main' }}>
                        <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                            Manager Comments:
                        </Typography>
                        <List size="small" sx={{ p: 0 }}>
                            {comments.map((c, i) => (
                                <ListItem key={i} sx={{ px: 0, py: 0.5 }}>
                                    <ListItemText primary={c} primaryTypographyProps={{ variant: 'body2' }} />
                                </ListItem>
                            ))}
                        </List>
                    </Box>
                )}

                <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    <TextField
                        fullWidth
                        multiline
                        rows={3}
                        label="Description (English)"
                        value={descriptionEn}
                        onChange={(e) => setDescriptionEn(e.target.value)}
                        required
                        variant="outlined"
                    />
                    <TextField
                        fullWidth
                        multiline
                        rows={3}
                        label="Description (French)"
                        value={descriptionFr}
                        onChange={(e) => setDescriptionFr(e.target.value)}
                        required
                        variant="outlined"
                    />
                    <Box>
                        <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                            New Supporting Documents (Optional)
                        </Typography>
                        <input
                            type="file"
                            multiple
                            onChange={handleFileChange}
                            style={{ border: '1px solid #ccc', padding: '0.5rem', width: '100%', borderRadius: '4px' }}
                        />
                        <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 1 }}>
                            Uploading new files will append to existing ones.
                        </Typography>
                        
                        {existingDocuments.length > 0 && (
                            <Box sx={{ mt: 2 }}>
                                <Typography variant="subtitle2" fontWeight="bold">Existing files:</Typography>
                                <List size="small">
                                    {existingDocuments.map(doc => (
                                        <ListItem key={doc.id} sx={{ px: 0, py: 0 }}>
                                            <ListItemText primary={doc.originalName} primaryTypographyProps={{ variant: 'body2' }} />
                                        </ListItem>
                                    ))}
                                </List>
                            </Box>
                        )}
                    </Box>

                    <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', flexDirection: { xs: 'column', sm: 'row' } }}>
                        <Button variant="outlined" color="inherit" onClick={() => navigate('/clerk-dashboard')} disabled={isSubmitting} fullWidth={isMobile}>
                            Cancel
                        </Button>
                        <Button type="submit" variant="contained" color="primary" disabled={isSubmitting} fullWidth={isMobile} startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : null}>
                            Update Request
                        </Button>
                    </Box>
                </Box>
            </Paper>
        </DashboardLayout>
    );
};

export default EditRequestForm;
