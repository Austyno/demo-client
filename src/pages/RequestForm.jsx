import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { CircularProgress } from '@mui/material';
import DashboardLayout from '../components/DashboardLayout';
import { useTranslation } from 'react-i18next';

import { API_URL } from '../config';

const RequestForm = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { t } = useTranslation();
    const [formData, setFormData] = useState({
        beneficiary: '',
        bankName: '',
        accountNumber: '',
        referenceNumber: 'Online-1546', // Default or auto-gen?
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
            <div style={{ maxWidth: '900px', margin: '0 auto', padding: '2rem', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', fontSize: '14px', fontFamily: 'Arial, sans-serif' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
                    <div>
                        <h1 style={{ fontSize: '24px', fontWeight: 'bold', letterSpacing: '2px', color: '#1f2937' }}>ISDAO</h1>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                        <p style={{ margin: 0 }}>PV AVIENTI</p>
                    </div>
                </div>

                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <h2 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '0.5rem' }}>Bon de paiement // Payment Voucher</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '0.5rem', justifyContent: 'center', textAlign: 'left', maxWidth: '400px', margin: '0 auto' }}>
                        <strong>Nom de la banque // Bank name:</strong>
                        <input type="text" name="bankName" value={formData.bankName} onChange={handleChange} style={inputStyle} disabled={loading} />

                        <strong>Numéro de référence // Reference number:</strong>
                        <input type="text" name="referenceNumber" value={formData.referenceNumber} onChange={handleChange} style={inputStyle} disabled={loading} />

                        <strong>Numéro de compte // Account number:</strong>
                        <input type="text" name="accountNumber" value={formData.accountNumber} onChange={handleChange} style={inputStyle} disabled={loading} />

                        <strong>Date // Date:</strong>
                        <input type="date" name="requestDate" value={formData.requestDate} onChange={handleChange} style={inputStyle} disabled={loading} />
                    </div>
                </div>

                <div style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flex: 1 }}>
                        <strong>BENEFICAIRE // PAYEE:</strong>
                        <input type="text" name="beneficiary" value={formData.beneficiary} onChange={handleChange} style={{ ...inputStyle, fontWeight: 'bold' }} disabled={loading} />
                    </div>
                </div>

                <div style={{ marginBottom: '1rem', border: '1px solid #000', padding: '0.5rem' }}>
                    <div style={{ display: 'flex', gap: '1rem', marginBottom: '0.5rem' }}>
                        <strong>MONTANT EN USD : {formData.amount.toLocaleString()} $ // AMOUNT IN USD : $ {formData.amount.toLocaleString()}</strong>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                        <input type="text" name="amountInWords" value={formData.amountInWords} onChange={handleChange} style={{ ...inputStyle, width: '100%', fontStyle: 'italic' }} placeholder="Amount in words" disabled={loading} />
                    </div>
                </div>

                <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '2rem', border: '1px solid black' }}>
                    <thead>
                        <tr style={{ backgroundColor: '#f3f4f6' }}>
                            <th style={thStyle}>Détail du paiement // Particulars of payment</th>
                            <th style={thStyle}>Montant (Devise) // Amount ({formData.currency})</th>
                            <th style={thStyle}>Nom du compte // Account name</th>
                            <th style={thStyle}>Code de la source de financement // Funding source code</th>
                            <th style={thStyle}>Code QuickBooks</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td style={tdStyle}>
                                <textarea
                                    name="descriptionFr"
                                    value={formData.descriptionFr}
                                    onChange={handleChange}
                                    placeholder="French Description"
                                    style={{ ...inputStyle, width: '100%', minHeight: '60px', marginBottom: '0.5rem' }}
                                    disabled={loading}
                                />
                                <textarea
                                    name="descriptionEn"
                                    value={formData.descriptionEn}
                                    onChange={handleChange}
                                    placeholder="English Description"
                                    style={{ ...inputStyle, width: '100%', minHeight: '60px' }}
                                    disabled={loading}
                                />
                            </td>
                            <td style={tdStyle}>
                                <input type="number" name="amount" value={formData.amount} onChange={handleChange} style={{ ...inputStyle, width: '100%', textAlign: 'right' }} disabled={loading} />
                            </td>
                            <td style={tdStyle}>
                                <textarea
                                    name="accountName"
                                    value={formData.accountName}
                                    onChange={handleChange}
                                    style={{ ...inputStyle, width: '100%', minHeight: '100px' }}
                                    disabled={loading}
                                />
                            </td>
                            <td style={tdStyle}>
                                <textarea
                                    name="fundingSourceCode"
                                    value={formData.fundingSourceCode}
                                    onChange={handleChange}
                                    style={{ ...inputStyle, width: '100%', minHeight: '100px' }}
                                    disabled={loading}
                                />
                            </td>
                            <td style={tdStyle}>
                                <input type="text" name="quickBooksCode" value={formData.quickBooksCode} onChange={handleChange} style={{ ...inputStyle, width: '100%' }} disabled={loading} />
                            </td>
                        </tr>
                        <tr>
                            <td style={{ ...tdStyle, fontWeight: 'bold' }}>TOTAL // TOTAL</td>
                            <td style={{ ...tdStyle, fontWeight: 'bold', textAlign: 'right', textDecoration: 'underline' }}>{formData.amount.toLocaleString()}</td>
                            <td style={tdStyle}></td>
                            <td style={tdStyle}></td>
                            <td style={tdStyle}></td>
                        </tr>
                    </tbody>
                </table>

                <div style={{ marginBottom: '2rem' }}>
                    <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '0.5rem' }}>Supporting Documents:</label>
                    <input
                        type="file"
                        multiple
                        onChange={handleFileChange}
                        style={{ border: '1px solid #ccc', padding: '0.5rem', width: '100%' }}
                        disabled={loading}
                    />
                    <small style={{ color: '#6b7280' }}>Select one or more files.</small>
                </div>

                {error && <p style={{ color: 'red', marginBottom: '1rem' }}>{error}</p>}

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginTop: '3rem' }}>
                    <div>
                        <p><strong>Préparé par // Prepared By:</strong> <span style={{ marginLeft: '1rem' }}>{user?.username || 'Unknown'} ({user?.role || 'User'})</span></p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                        <p><strong>Date:</strong> {new Date().toLocaleDateString()}</p>
                    </div>
                </div>

                <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                    <button type="button" onClick={() => navigate('/clerk-dashboard')} style={{ padding: '0.5rem 1rem', backgroundColor: '#9ca3af', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }} disabled={loading}>Cancel</button>
                    <button type="button" onClick={handleSubmit} style={{ padding: '0.5rem 1rem', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }} disabled={loading}>
                        {loading ? <CircularProgress size={20} color="inherit" /> : 'Submit Request'}
                    </button>
                </div>
            </div>
        </DashboardLayout>
    );
};

const inputStyle = {
    border: 'none',
    borderBottom: '1px dotted #9ca3af',
    padding: '0.25rem',
    backgroundColor: 'transparent',
    outline: 'none',
    fontFamily: 'inherit',
    fontSize: 'inherit'
};

const thStyle = {
    border: '1px solid black',
    padding: '0.5rem',
    textAlign: 'center',
    fontSize: '12px',
    fontWeight: 'bold',
    verticalAlign: 'middle'
};

const tdStyle = {
    border: '1px solid black',
    padding: '0.5rem',
    verticalAlign: 'top'
};

export default RequestForm;
