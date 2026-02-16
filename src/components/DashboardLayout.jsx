import React from 'react';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import { Box } from '@mui/material';

const DashboardLayout = ({ children, role, title = "Dashboard" }) => {
    const [mobileOpen, setMobileOpen] = React.useState(false);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    return (
        <Box sx={{ display: 'flex' }}>
            <Sidebar 
                role={role} 
                mobileOpen={mobileOpen} 
                handleDrawerToggle={handleDrawerToggle} 
            />
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: { xs: 2, sm: 3 },
                    width: { sm: `calc(100% - 210px)` },
                    backgroundColor: 'background.default',
                    minHeight: '100vh',
                }}
            >
                <TopBar title={title} handleDrawerToggle={handleDrawerToggle} />
                {children}
            </Box>
        </Box>
    );
};

export default DashboardLayout;
