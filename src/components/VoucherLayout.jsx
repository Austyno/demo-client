import React from 'react';

const VoucherLayout = ({ request }) => {
    if (!request) return null;

    // Helper to format currency
    const formatCurrency = (amount, currency) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: currency || 'USD' }).format(amount);
    };

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
        whiteSpace: 'pre-wrap' // Preserve newlines
    };

    return (
        <div style={{ maxWidth: '900px', margin: '0 auto', padding: '2rem', backgroundColor: 'white', fontSize: '14px', fontFamily: 'Arial, sans-serif' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
                <div>
                    <h1 style={{ fontSize: '24px', fontWeight: 'bold', letterSpacing: '2px', color: '#1f2937' }}>ISDAO</h1>
                </div>
                <div style={{ textAlign: 'right' }}>
                    <p style={{ margin: 0 }}>PV {request.beneficiary || 'AVIENTI'}</p>
                </div>
            </div>

            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '0.5rem' }}>Bon de paiement // Payment Voucher</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '0.5rem', justifyContent: 'center', textAlign: 'left', maxWidth: '500px', margin: '0 auto' }}>
                    <strong>Nom de la banque // Bank name:</strong>
                    <span style={inputStyle}>{request.bankName}</span>

                    <strong>Numéro de référence // Reference number:</strong>
                    <span style={inputStyle}>{request.referenceNumber || 'N/A'}</span>

                    <strong>Numéro de compte // Account number:</strong>
                    <span style={inputStyle}>{request.accountNumber}</span>

                    <strong>Date // Date:</strong>
                    <span style={inputStyle}>{request.requestDate ? new Date(request.requestDate).toLocaleDateString() : new Date(request.createdAt).toLocaleDateString()}</span>
                </div>
            </div>

            <div style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flex: 1 }}>
                    <strong>BENEFICAIRE // PAYEE:</strong>
                    <span style={{ ...inputStyle, fontWeight: 'bold' }}>{request.beneficiary}</span>
                </div>
            </div>

            <div style={{ marginBottom: '1rem', border: '1px solid #000', padding: '0.5rem' }}>
                <div style={{ display: 'flex', gap: '1rem', marginBottom: '0.5rem' }}>
                    <strong>MONTANT EN USD : {formatCurrency(request.amount, request.currency)} // AMOUNT IN USD : {formatCurrency(request.amount, request.currency)}</strong>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <span style={{ ...inputStyle, width: '100%', fontStyle: 'italic' }}>{request.amountInWords}</span>
                </div>
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '2rem', border: '1px solid black' }}>
                <thead>
                    <tr style={{ backgroundColor: '#f3f4f6' }}>
                        <th style={thStyle}>Détail du paiement // Particulars of payment</th>
                        <th style={thStyle}>Montant (Devise) // Amount ({request.currency || 'USD'})</th>
                        <th style={thStyle}>Nom du compte // Account name</th>
                        <th style={thStyle}>Code de la source de financement // Funding source code</th>
                        <th style={thStyle}>Code QuickBooks</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td style={tdStyle}>
                            <div style={{ marginBottom: '0.5rem' }}>{request.descriptionFr}</div>
                            <div>{request.descriptionEn}</div>
                        </td>
                        <td style={tdStyle}>
                            <div style={{ textAlign: 'right' }}>{request.amount?.toLocaleString()}</div>
                        </td>
                        <td style={tdStyle}>
                            {request.accountName}
                        </td>
                        <td style={tdStyle}>
                            {request.fundingSourceCode}
                        </td>
                        <td style={tdStyle}>
                            {request.quickBooksCode}
                        </td>
                    </tr>
                    <tr>
                        <td style={{ ...tdStyle, fontWeight: 'bold' }}>TOTAL // TOTAL</td>
                        <td style={{ ...tdStyle, fontWeight: 'bold', textAlign: 'right', textDecoration: 'underline' }}>{request.amount?.toLocaleString()}</td>
                        <td style={tdStyle}></td>
                        <td style={tdStyle}></td>
                        <td style={tdStyle}></td>
                    </tr>
                </tbody>
            </table>

            <div style={{ marginBottom: '2rem' }}>
                <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '0.5rem' }}>Supporting Documents:</label>
                {request.documents && request.documents.length > 0 ? (
                    <ul style={{ listStyleType: 'disc', paddingLeft: '1.5rem' }}>
                        {request.documents.map((doc, index) => (
                            <li key={index}>
                                <a href={`http://localhost:3000/${doc.filePath}`} target="_blank" rel="noopener noreferrer" style={{ color: '#2563eb', textDecoration: 'underline' }}>
                                    {doc.originalName}
                                </a>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <span style={{ color: '#6b7280' }}>No documents attached.</span>
                )}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginTop: '3rem' }}>
                <div>
                    <p><strong>Préparé par // Prepared By:</strong> <span style={{ marginLeft: '1rem' }}>{request.user?.username || 'Unknown'}</span></p>
                </div>
                <div style={{ textAlign: 'right' }}>
                    <p><strong>Date:</strong> {new Date(request.createdAt).toLocaleDateString()}</p>
                </div>
            </div>

            {/* Approval Signatures Placeholder */}
            <div style={{ marginTop: '3rem', borderTop: '1px solid #ccc', paddingTop: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '2rem' }}>
                    <div>
                        <p style={{ fontWeight: 'bold' }}>Vérifié par // Checked by:</p>
                        {/* Logic to show manager name if approved/checked */}
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
