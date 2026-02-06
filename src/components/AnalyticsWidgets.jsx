import React, { useState, useEffect } from 'react';
import {
    Grid,
    Card,
    CardContent,
    Typography,
    Box,
    Select,
    MenuItem,
    FormControl
} from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import LoadingSpinner from './LoadingSpinner';

const AnalyticsWidgets = () => {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = () => {
            setLoading(true);
            setTimeout(() => setLoading(false), 500);
        };

        loadData();
        const interval = setInterval(loadData, 60000); // 1 minute

        return () => clearInterval(interval);
    }, []);

    if (loading) {
        return <LoadingSpinner />;
    }

    return (
        <Grid container spacing={3} sx={{ mb: 4 }}>
            {/* Stats Cards */}
            <Grid size={{ xs: 12, md: 4, lg: 3 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    <Card>
                        <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Box>
                                <Typography variant="body2" color="text.secondary" gutterBottom>
                                    Requests Approved
                                </Typography>
                                <Typography variant="h4" color="primary.main" fontWeight="bold">
                                    24
                                </Typography>
                            </Box>
                            <Box sx={{
                                bgcolor: 'rgba(37, 99, 235, 0.1)',
                                color: 'primary.main',
                                width: 48, height: 48,
                                borderRadius: 3,
                                display: 'flex', alignItems: 'center', justifyContent: 'center'
                            }}>
                                <CheckCircleOutlineIcon />
                            </Box>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Box>
                                <Typography variant="body2" color="text.secondary" gutterBottom>
                                    Requests Rejected
                                </Typography>
                                <Typography variant="h4" color="error.main" fontWeight="bold">
                                    5
                                </Typography>
                            </Box>
                            <Box sx={{
                                bgcolor: 'rgba(239, 68, 68, 0.1)',
                                color: 'error.main',
                                width: 48, height: 48,
                                borderRadius: 3,
                                display: 'flex', alignItems: 'center', justifyContent: 'center'
                            }}>
                                <CancelOutlinedIcon />
                            </Box>
                        </CardContent>
                    </Card>
                </Box>
            </Grid>

            {/* Mock Graph */}
            <Grid size={{ xs: 12, md: 8, lg: 9 }}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                            <Typography variant="h6">Overall Analytics</Typography>
                            <FormControl size="small">
                                <Select defaultValue="week" sx={{ borderRadius: 2 }}>
                                    <MenuItem value="week">This Week</MenuItem>
                                    <MenuItem value="month">This Month</MenuItem>
                                </Select>
                            </FormControl>
                        </Box>

                        <Box sx={{
                            flex: 1,
                            display: 'flex',
                            alignItems: 'flex-end',
                            justifyContent: 'space-between',
                            gap: 1,
                            pb: 1
                        }}>
                            {/* Mock bars */}
                            {[40, 70, 45, 90, 60, 80, 50].map((h, i) => (
                                <Box key={i} sx={{
                                    width: '100%',
                                    height: `${h}%`,
                                    bgcolor: i === 3 ? 'primary.main' : 'grey.200',
                                    borderRadius: 1,
                                    transition: 'height 0.3s'
                                }} />
                            ))}
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', typography: 'caption', color: 'text.secondary' }}>
                            <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
                        </Box>
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    );
};

export default AnalyticsWidgets;
