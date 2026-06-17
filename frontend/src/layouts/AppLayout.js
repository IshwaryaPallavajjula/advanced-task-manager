import React, { useState } from 'react';
import { Box, Toolbar } from '@mui/material';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar, { DRAWER_WIDTH } from '../components/Sidebar';

const AppLayout = ({ darkMode, onToggleDark }) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <Navbar
        onMenuClick={() => setMobileOpen(true)}
        darkMode={darkMode}
        onToggleDark={onToggleDark}
      />
      <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, sm: 3 },
          ml: { md: `${DRAWER_WIDTH}px` },
          width: { xs: '100%', md: `calc(100% - ${DRAWER_WIDTH}px)` },
          bgcolor: 'background.default',
          minHeight: '100vh',
        }}
      >
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
};

export default AppLayout;
