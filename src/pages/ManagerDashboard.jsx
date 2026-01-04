import React from 'react';
import DashboardLayout from '../components/DashboardLayout';
import AnalyticsWidgets from '../components/AnalyticsWidgets';
import { Typography } from '@mui/material';

const ManagerDashboard = () => {
    return (
        <DashboardLayout role="manager" title="Dashboard">
            <Typography variant="h5" sx={{ mb: 4, fontWeight: 'bold' }}>
                Overview
            </Typography>
            <AnalyticsWidgets />
            {/* 
                Requests are now in separate pages:
                - /pending-requests
                - /approved-requests
                - /rejected-requests
            */}
        </DashboardLayout>
    );
};

export default ManagerDashboard;
