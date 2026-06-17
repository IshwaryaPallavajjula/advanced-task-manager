import React from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogContentText,
  DialogActions, Button, CircularProgress,
} from '@mui/material';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

const ConfirmDialog = ({
  open,
  title = 'Confirm Action',
  message = 'Are you sure?',
  onConfirm,
  onCancel,
  loading = false,
  confirmText = 'Delete',
  confirmColor = 'error',
}) => (
  <Dialog open={open} onClose={onCancel} maxWidth="xs" fullWidth>
    <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <WarningAmberIcon color="warning" />
      {title}
    </DialogTitle>
    <DialogContent>
      <DialogContentText>{message}</DialogContentText>
    </DialogContent>
    <DialogActions sx={{ px: 3, pb: 2 }}>
      <Button onClick={onCancel} disabled={loading} variant="outlined">
        Cancel
      </Button>
      <Button
        onClick={onConfirm}
        color={confirmColor}
        variant="contained"
        disabled={loading}
        startIcon={loading && <CircularProgress size={16} color="inherit" />}
      >
        {loading ? 'Deleting...' : confirmText}
      </Button>
    </DialogActions>
  </Dialog>
);

export default ConfirmDialog;
