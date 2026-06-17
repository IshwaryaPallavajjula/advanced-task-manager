import React from 'react';
import { Chip } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import RemoveIcon from '@mui/icons-material/Remove';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

const PRIORITY_CONFIG = {
  Low: { color: 'default', icon: <KeyboardArrowDownIcon sx={{ fontSize: 14 }} /> },
  Medium: { color: 'warning', icon: <RemoveIcon sx={{ fontSize: 14 }} /> },
  High: { color: 'error', icon: <KeyboardArrowUpIcon sx={{ fontSize: 14 }} /> },
};

const PriorityBadge = ({ priority, size = 'small' }) => {
  const config = PRIORITY_CONFIG[priority] || { color: 'default', icon: null };
  return (
    <Chip
      label={priority}
      color={config.color}
      size={size}
      icon={config.icon}
      variant="outlined"
      sx={{ fontWeight: 600 }}
    />
  );
};

export default PriorityBadge;
