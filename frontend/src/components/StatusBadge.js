import React from 'react';
import { Chip } from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const STATUS_CONFIG = {
  Pending: { color: 'warning', icon: <AccessTimeIcon sx={{ fontSize: 14 }} /> },
  'In Progress': { color: 'info', icon: <AutorenewIcon sx={{ fontSize: 14 }} /> },
  Completed: { color: 'success', icon: <CheckCircleIcon sx={{ fontSize: 14 }} /> },
};

const StatusBadge = ({ status, size = 'small' }) => {
  const config = STATUS_CONFIG[status] || { color: 'default', icon: null };
  return (
    <Chip
      label={status}
      color={config.color}
      size={size}
      icon={config.icon}
      sx={{ fontWeight: 600 }}
    />
  );
};

export default StatusBadge;
