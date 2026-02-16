import React from 'react';
import { API_URL } from '../config';

const VoucherLayout = ({ request }) => {
    if (!request) return null;

    // Normalize data: support either direct request object or request.voucher
    const d = request.voucher || request;
    const items = d.items && d.items.length > 0 ? d.items : [];
    const totalAmount = d.totalAmount || d.amount || 0;

    const inputStyle = {
        border: 'none',
        borderBottom: '1px dotted #9ca3af',
        padding: '0.25rem',
        backgroundColor: 'transparent',
        outline: 'none',
        fontFamily: 'inherit',
        fontSize: 'inherit',
        width: '100%',
        color: '#000'
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
        verticalAlign: 'top',
        whiteSpace: 'pre-wrap'
    };

    return (
        <div style={{ maxWidth: '900px', margin: '0 auto', padding: '2rem', backgroundColor: 'white', fontSize: '14px', fontFamily: 'Arial, sans-serif' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
                <div>
                    <h1 style={{ fontSize: '24px', fontWeight: 'bold', letterSpacing: '2px', color: '#1f2937' }}>ISDAO</h1>
                </div>
                <div style={{ textAlign: 'right' }}>
                    <p style={{ margin: 0 }}>PV {d.beneficiary || 'AVIENTI'}</p>
                </div>
            </div>

            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '0.5rem' }}>Bon de paiement // Payment Voucher</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '1rem', justifyContent: 'center', textAlign: 'left', maxWidth: '600px', margin: '0 auto' }}>
                    <strong>Nom de la banque // Bank name:</strong>
                    <span style={inputStyle}>{d.bankName}</span>

                    <strong>Numéro de référence // Reference number:</strong>
                    <span style={inputStyle}>{request.referenceNumber || d.referenceNumber || 'N/A'}</span>

                    <strong>Numéro de compte // Account number:</strong>
                    <span style={inputStyle}>{d.accountNumber}</span>

                    <strong>Date // Date:</strong>
                    <span style={inputStyle}>{d.date ? new Date(d.date).toLocaleDateString() : (request.createdAt ? new Date(request.createdAt).toLocaleDateString() : 'N/A')}</span>
                </div>
            </div>

            <div style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <strong>BENEFICAIRE // PAYEE:</strong>
                <span style={{ ...inputStyle, fontWeight: 'bold', flex: 1 }}>{d.beneficiary}</span>
            </div>

            <div style={{ marginBottom: '1.5rem', border: '1px solid #000', padding: '1rem' }}>
                <div style={{ marginBottom: '0.5rem' }}>
                    <strong>MONTANT EN {d.currency || 'USD'} : {Number(totalAmount).toLocaleString()} // AMOUNT IN {d.currency || 'USD'} : {Number(totalAmount).toLocaleString()}</strong>
                </div>
                <div style={{ fontStyle: 'italic', borderTop: '1px dotted #ccc', paddingTop: '0.5rem' }}>
                    {d.amountInWords}
                </div>
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '2rem', border: '1px solid black' }}>
                <thead>
                    <tr style={{ backgroundColor: '#f3f4f6' }}>
                        <th style={thStyle}>Détail du paiement // Particulars of payment</th>
                        <th style={thStyle}>Montant ({d.currency || 'USD'})</th>
                        <th style={thStyle}>Nom du compte // Account name</th>
                        <th style={thStyle}>Code source // Source Code</th>
                        <th style={thStyle}>Code QuickBooks</th>
                    </tr>
                </thead>
                <tbody>
                    {items.length > 0 ? items.map((item, index) => (
                        <tr key={index}>
                            <td style={tdStyle}>{item.particulars}</td>
                            <td style={{ ...tdStyle, textAlign: 'right' }}>{Number(item.amount || 0).toLocaleString()}</td>
                            <td style={tdStyle}>{item.accountName}</td>
                            <td style={tdStyle}>{item.fundingSourceCode}</td>
                            <td style={tdStyle}>{item.quickBooksCode}</td>
                        </tr>
                    )) : (
                        <tr>
                            <td style={tdStyle}>
                                <div>{d.descriptionFr}</div>
                                <div style={{ marginTop: '0.25rem' }}>{d.descriptionEn}</div>
                            </td>
                            <td style={{ ...tdStyle, textAlign: 'right' }}>{Number(d.amount || 0).toLocaleString()}</td>
                            <td style={tdStyle}>{d.accountName}</td>
                            <td style={tdStyle}>{d.fundingSourceCode}</td>
                            <td style={tdStyle}>{d.quickBooksCode}</td>
                        </tr>
                    )}
                    <tr style={{ backgroundColor: '#f9fafb' }}>
                        <td style={{ ...tdStyle, fontWeight: 'bold', textAlign: 'right' }}>TOTAL // TOTAL</td>
                        <td style={{ ...tdStyle, fontWeight: 'bold', textAlign: 'right', textDecoration: 'underline' }}>{Number(totalAmount).toLocaleString()}</td>
                        <td colSpan="3" style={tdStyle}></td>
                    </tr>
                </tbody>
            </table>

            <div style={{ marginBottom: '2rem' }}>
                <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '0.5rem' }}>Supporting Documents:</label>
                {request.documents && request.documents.length > 0 ? (
                    <ul style={{ listStyleType: 'disc', paddingLeft: '1.5rem' }}>
                        {request.documents.map((doc, index) => (
                            <li key={index}>
                                <a href={`${API_URL}/${doc.filePath}`} target="_blank" rel="noopener noreferrer" style={{ color: '#2563eb', textDecoration: 'underline' }}>
                                    {doc.fileName || doc.originalName || 'Document'}
                                </a>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <span style={{ color: '#6b7280' }}>No documents attached.</span>
                )}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginTop: '3rem', borderTop: '1px solid #ccc', paddingTop: '1rem' }}>
                <div>
                    <p><strong>Préparé par // Prepared By:</strong> <span style={{ marginLeft: '1rem' }}>{request.user?.username || 'Unknown'}</span></p>
                </div>
                <div style={{ textAlign: 'right' }}>
                    <p><strong>Date:</strong> {request.createdAt ? new Date(request.createdAt).toLocaleDateString() : 'N/A'}</p>
                </div>
            </div>



            {/* Approval Signatures Placeholder */}
            <div style={{ marginTop: '3rem', borderTop: '1px solid #ccc', paddingTop: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '2rem' }}>
                    <div>
                        <p style={{ fontWeight: 'bold' }}>Vérifié par // Checked by:</p>
                    </div>
                    <div>
                        <p style={{ fontWeight: 'bold' }}>Signataire autorisée // Authorised signatory:</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VoucherLayout;
