import React from 'react';
import {
  Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText,
  Toolbar, Box, Typography, Divider,
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ListAltIcon from '@mui/icons-material/ListAlt';
import AddTaskIcon from '@mui/icons-material/AddTask';
import PersonIcon from '@mui/icons-material/Person';
import { useNavigate, useLocation } from 'react-router-dom';

const DRAWER_WIDTH = 240;

const NAV_ITEMS = [
  { label: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
  { label: 'All Tasks', icon: <ListAltIcon />, path: '/tasks' },
  { label: 'Create Task', icon: <AddTaskIcon />, path: '/tasks/create' },
  { label: 'Profile', icon: <PersonIcon />, path: '/profile' },
];

const SidebarContent = ({ onClose }) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const handleNav = (path) => {
    navigate(path);
    if (onClose) onClose();
  };

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Toolbar />
      <Box sx={{ px: 2, py: 2 }}>
        <Typography variant="overline" color="text.secondary" fontWeight={700} letterSpacing={1.2}>
          Navigation
        </Typography>
      </Box>
      <List sx={{ px: 1, flexGrow: 1 }}>
        {NAV_ITEMS.map(({ label, icon, path }) => {
          const active = pathname === path || (path !== '/dashboard' && pathname.startsWith(path));
          return (
            <ListItem key={path} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                onClick={() => handleNav(path)}
                selected={active}
                sx={{
                  borderRadius: 2,
                  '&.Mui-selected': {
                    bgcolor: 'primary.main',
                    color: 'white',
                    '& .MuiListItemIcon-root': { color: 'white' },
                    '&:hover': { bgcolor: 'primary.dark' },
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: 40 }}>{icon}</ListItemIcon>
                <ListItemText
                  primary={label}
                  primaryTypographyProps={{ fontWeight: active ? 700 : 500, fontSize: '0.9rem' }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
      <Divider />
      <Box sx={{ px: 2, py: 2 }}>
        <Typography variant="caption" color="text.secondary">
          © 2025 Advanced Task Manager
        </Typography>
      </Box>
    </Box>
  );
};

const Sidebar = ({ mobileOpen, onClose }) => (
  <>
    {/* Mobile drawer */}
    <Drawer
      variant="temporary"
      open={mobileOpen}
      onClose={onClose}
      ModalProps={{ keepMounted: true }}
      sx={{
        display: { xs: 'block', md: 'none' },
        '& .MuiDrawer-paper': { width: DRAWER_WIDTH, boxSizing: 'border-box' },
      }}
    >
      <SidebarContent onClose={onClose} />
    </Drawer>

    {/* Desktop drawer */}
    <Drawer
      variant="permanent"
      sx={{
        display: { xs: 'none', md: 'block' },
        '& .MuiDrawer-paper': {
          width: DRAWER_WIDTH,
          boxSizing: 'border-box',
          borderRight: '1px solid',
          borderColor: 'divider',
        },
      }}
    >
      <SidebarContent />
    </Drawer>
  </>
);

export { DRAWER_WIDTH };
export default Sidebar;
