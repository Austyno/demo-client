import React from 'react';
import DashboardLayout from '../components/DashboardLayout';
import AnalyticsWidgets from '../components/AnalyticsWidgets';
import { Typography } from '@mui/material';

const EDDashboard = () => {
    return (
        <DashboardLayout role="ed" title="ED Dashboard">
            <Typography variant="h4" sx={{ mb: 4, fontWeight: 'bold', textTransform: 'uppercase' }}>
                EXECUTIVE DIRECTOR DASHBOARD
            </Typography>
            <AnalyticsWidgets />
            {/* 
                Requests are in separate pages:
                - /pending-ed-requests
            */}
        </DashboardLayout>
    );
};

export default EDDashboard;
