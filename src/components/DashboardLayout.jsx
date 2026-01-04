import React from 'react';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import { Box } from '@mui/material';

const DashboardLayout = ({ children, role, title = "Dashboard" }) => {
    return (
        <Box sx={{ display: 'flex' }}>
            <Sidebar role={role} />
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: 3,
                    width: { sm: `calc(100% - 240px)` },
                    backgroundColor: 'background.default',
                    minHeight: '100vh',
                }}
            >
                <TopBar title={title} />
                {children}
            </Box>
        </Box>
    );
};

export default DashboardLayout;
