import React from 'react';
import { Outlet } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Box } from '@mui/material';
import NotificationPanel from '../components/NotificationPanel';

const DashboardLayout: React.FC = () => {
  return (
    <Box sx={{ display: 'flex' }}>
      {/* This is a simplified layout. A real app would have a sidebar, etc. */}
      <AppBar
        position="fixed"
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <Toolbar>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            AI for Secure Cloud Computing
          </Typography>
          
          <NotificationPanel />

        </Toolbar>
      </AppBar>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: '100%',
        }}
      >
        <Toolbar /> {/* Spacer for the AppBar */}
        <Outlet />
      </Box>
    </Box>
  );
};

export default DashboardLayout;