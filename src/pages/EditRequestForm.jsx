import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { CircularProgress } from '@mui/material';
import LoadingSpinner from '../components/LoadingSpinner';
import DashboardLayout from '../components/DashboardLayout';

import { API_URL } from '../config';

const EditRequestForm = () => {
    const { id } = useParams();
    const [descriptionEn, setDescriptionEn] = useState('');
    const [descriptionFr, setDescriptionFr] = useState('');
    const [existingDocuments, setExistingDocuments] = useState([]);
    const [files, setFiles] = useState([]);
    const [error, setError] = useState('');
    const [comments, setComments] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        fetchRequest();
    }, [id]);

    const fetchRequest = async () => {
        setIsLoading(true);
        const token = localStorage.getItem('token');
        try {
            // Re-using getMyRequests logic but typically we want a getSingleRequest endpoint
            // For simplicity, we'll fetch all and find, OR implement getOne.
            // Let's implement a simple getOne in backend or just use the list for now if lazy.
            // Better to fetch specific request. I'll rely on a new endpoint or filter.
            // Let's assume we add GET /api/requests/:id
            const response = await fetch(`${API_URL}/api/requests/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                setDescriptionEn(data.descriptionEn);
                setDescriptionFr(data.descriptionFr);
                setExistingDocuments(data.documents);
                // Also show history/comments if available
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
        <DashboardLayout role="clerk" title={`Edit Payment Request #${id}`}>
            <div className="login-container" style={{ maxWidth: '600px', margin: '0 auto' }}>
                <h2>Edit Payment Request #{id}</h2>
                {error && <p className="error">{error}</p>}

                {comments.length > 0 && (
                    <div style={{ backgroundColor: '#fff7ed', padding: '1rem', marginBottom: '1rem', borderRadius: '4px', border: '1px solid #fed7aa' }}>
                        <h4 style={{ margin: '0 0 0.5rem 0', color: '#c2410c' }}>Manager Comments:</h4>
                        <ul style={{ margin: 0, paddingLeft: '1.5rem' }}>
                            {comments.map((c, i) => <li key={i}>{c}</li>)}
                        </ul>
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div>
                        <label>Description (English):</label>
                        <textarea
                            value={descriptionEn}
                            onChange={(e) => setDescriptionEn(e.target.value)}
                            style={{ width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '4px' }}
                            rows="3"
                            required
                        />
                    </div>
                    <div>
                        <label>Description (French):</label>
                        <textarea
                            value={descriptionFr}
                            onChange={(e) => setDescriptionFr(e.target.value)}
                            style={{ width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '4px' }}
                            rows="3"
                            required
                        />
                    </div>
                    <div>
                        <label>New Supporting Documents (Optional):</label>
                        <input
                            type="file"
                            multiple
                            onChange={handleFileChange}
                            style={{ border: 'none', padding: '0' }}
                        />
                        <small style={{ color: '#6b7280' }}>Uploading new files will append to existing ones.</small>
                        {existingDocuments.length > 0 && (
                            <div style={{ marginTop: '0.5rem' }}>
                                <strong>Existing files:</strong>
                                <ul style={{ margin: '0.25rem 0 0 1rem', fontSize: '0.875rem' }}>
                                    {existingDocuments.map(doc => (
                                        <li key={doc.id}>{doc.originalName}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <button type="button" onClick={() => navigate('/clerk-dashboard')} style={{ backgroundColor: '#9ca3af' }} disabled={isSubmitting}>Cancel</button>
                        <button type="submit" disabled={isSubmitting} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            {isSubmitting ? <CircularProgress size={16} color="inherit" /> : 'Update Request'}
                        </button>
                    </div>
                </form>
            </div>
        </DashboardLayout>
    );
};

export default EditRequestForm;
