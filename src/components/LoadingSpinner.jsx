import React from 'react';
import { Box, CircularProgress } from '@mui/material';

const LoadingSpinner = ({ size = 40, color = 'primary' }) => {
    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                width: '100%',
                height: '100%',
                minHeight: '200px', // Ensure it takes up some space
            }}
        >
            <CircularProgress size={size} color={color} />
        </Box>
    );
};

export default LoadingSpinner;
