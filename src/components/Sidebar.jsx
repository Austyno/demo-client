import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
    Drawer,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Typography,
    Box,
    Avatar,
    Badge
} from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { API_URL } from '../config';
import DashboardIcon from '@mui/icons-material/Dashboard';
import FolderIcon from '@mui/icons-material/Folder';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import SubscriptionsIcon from '@mui/icons-material/Subscriptions';
import ActivityIcon from '@mui/icons-material/ShowChart';
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange';
import SettingsIcon from '@mui/icons-material/Settings';
import AddIcon from '@mui/icons-material/Add';
import PersonIcon from '@mui/icons-material/Person';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import MessageIcon from '@mui/icons-material/Message';
import { useTranslation } from 'react-i18next';

const drawerWidth = 240;

const Sidebar = ({ role, mobileOpen, handleDrawerToggle }) => {
    const location = useLocation();
    const [pendingCount, setPendingCount] = useState(0);
    const { t } = useTranslation();

    useEffect(() => {
        if (role === 'manager') {
            fetchPendingCount();
            const interval = setInterval(fetchPendingCount, 30000);
            return () => clearInterval(interval);
        }
    }, [role]);

    const fetchPendingCount = async () => {
        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`${API_URL}/api/requests/subordinates?status=PENDING`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                setPendingCount(data.length);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const menuItems = role === 'manager' ? [
        { path: '/manager-dashboard', label: t('nav.dashboard'), icon: <DashboardIcon /> },
        {
            path: '/pending-requests',
            label: t('nav.pending'),
            icon: (
                <Badge badgeContent={pendingCount} color="error" sx={{ '& .MuiBadge-badge': { right: -3, top: 3 } }}>
                    <PendingActionsIcon />
                </Badge>
            )
        },
        { path: '/approved-requests', label: t('nav.approved'), icon: <CheckCircleOutlineIcon /> },
        { path: '/rejected-requests', label: t('nav.rejected'), icon: <CancelOutlinedIcon /> },
        { path: '#', label: t('common.messages'), icon: <MessageIcon /> },
        { path: '#', label: t('common.activity'), icon: <ActivityIcon /> },
    ] : [
        { path: '/clerk-dashboard', label: t('nav.dashboard'), icon: <DashboardIcon /> },
        { path: '/create-request', label: t('nav.new_request'), icon: <AddIcon /> },
        { path: '/approved-requests', label: t('nav.approved'), icon: <CheckCircleOutlineIcon /> },
        { path: '/rejected-requests', label: t('nav.rejected'), icon: <CancelOutlinedIcon /> },
        { path: '#', label: t('common.profile'), icon: <PersonIcon /> },
    ];

    const drawerContent = (
        <>
            <Box sx={{ p: 3, textAlign: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ color: 'white', mb: 3 }}>
                    Finance App
                </Typography>

                <Avatar
                    sx={{
                        width: 80,
                        height: 80,
                        margin: '0 auto 16px',
                        bgcolor: 'rgba(255,255,255,0.1)'
                    }}
                >
                    <PersonIcon sx={{ fontSize: 40 }} />
                </Avatar>

                <Typography variant="subtitle1" sx={{ color: 'white', fontWeight: 600 }}>
                    Hello {role === 'manager' ? 'Manager' : 'User'}
                </Typography>
                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                    Check Your Last Transaction!
                </Typography>
            </Box>

            <List sx={{ px: 2 }}>
                {menuItems.map((item, index) => {
                    const isActive = location.pathname === item.path;

                    return (
                        <ListItem key={index} disablePadding sx={{ mb: 1 }}>
                            <ListItemButton
                                component={NavLink}
                                to={item.path}
                                onClick={mobileOpen ? handleDrawerToggle : undefined}
                                sx={{
                                    borderRadius: '12px',
                                    backgroundColor: isActive ? 'white' : 'transparent',
                                    color: isActive ? 'secondary.main' : 'white',
                                    '&:hover': {
                                        backgroundColor: isActive ? 'white' : 'rgba(255,255,255,0.1)',
                                    },
                                }}
                            >
                                <ListItemIcon sx={{
                                    minWidth: 40,
                                    color: isActive ? 'secondary.main' : 'white'
                                }}>
                                    {item.icon}
                                </ListItemIcon>
                                <ListItemText
                                    primary={item.label}
                                    primaryTypographyProps={{
                                        fontWeight: isActive ? 600 : 400,
                                        fontSize: '0.9rem'
                                    }}
                                />
                            </ListItemButton>
                        </ListItem>
                    );
                })}
            </List>
        </>
    );

    return (
        <Box
            component="nav"
            sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
            aria-label="mailbox folders"
        >
            <Drawer
                variant="temporary"
                open={mobileOpen}
                onClose={handleDrawerToggle}
                ModalProps={{
                    keepMounted: true, // Better open performance on mobile.
                }}
                sx={{
                    display: { xs: 'block', sm: 'none' },
                    '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                }}
            >
                {drawerContent}
            </Drawer>
            <Drawer
                variant="permanent"
                sx={{
                    display: { xs: 'none', sm: 'block' },
                    '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, border: 'none' },
                }}
                open
            >
                {drawerContent}
            </Drawer>
        </Box>
    );
};

export default Sidebar;
