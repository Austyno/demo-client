import React from 'react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { Box, Typography, Paper, Alert } from '@mui/material';

const Step1_PaymentRequest = ({ value, onChange, error }) => {
    const modules = {
        toolbar: [
            [{ 'header': [1, 2, false] }],
            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
            [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
            ['link'],
            ['clean']
        ],
    };

    const formats = [
        'header',
        'bold', 'italic', 'underline', 'strike', 'blockquote',
        'list', 'bullet', 'indent',
        'link'
    ];

    return (
        <Box>
            <Typography variant="h6" gutterBottom>
                Payment Request Details
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
               Please provide the full details of your payment request below.
            </Typography>
            
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

            <Paper variant="outlined" sx={{ 
                '& .ql-container': { 
                    minHeight: '200px',
                    fontSize: '1rem',
                    fontFamily: 'inherit'
                },
                '& .ql-editor': {
                    minHeight: '200px'
                }
            }}>
                <ReactQuill 
                    theme="snow"
                    value={value}
                    onChange={onChange}
                    modules={modules}
                    formats={formats}
                    placeholder="Write your payment request here..."
                />
            </Paper>
        </Box>
    );
};

export default Step1_PaymentRequest;
