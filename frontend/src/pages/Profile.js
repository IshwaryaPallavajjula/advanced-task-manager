import React, { useState } from 'react';
import {
  Box, Card, CardContent, TextField, Button, Typography,
  Avatar, Divider, Alert, CircularProgress, Grid,
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/api';
import { useSnackbar } from 'notistack';
import { format } from 'date-fns';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const { enqueueSnackbar } = useSnackbar();

  const [name, setName] = useState(user?.name || '');
  const [nameError, setNameError] = useState('');
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : 'U';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) { setNameError('Name is required'); return; }
    if (name.trim().length < 2) { setNameError('Name must be at least 2 characters'); return; }

    setLoading(true);
    setApiError('');
    try {
      const { data } = await authService.updateProfile({ name: name.trim() });
      updateUser(data.data.user);
      enqueueSnackbar('Profile updated successfully!', { variant: 'success' });
    } catch (err) {
      setApiError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box maxWidth={600} mx="auto">
      <Typography variant="h5" fontWeight={700} mb={3}>Profile</Typography>

      <Card>
        <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
          {/* Avatar section */}
          <Box display="flex" alignItems="center" gap={3} mb={3}>
            <Avatar
              sx={{
                width: 72,
                height: 72,
                bgcolor: 'primary.main',
                fontSize: 24,
                fontWeight: 700,
              }}
            >
              {initials}
            </Avatar>
            <Box>
              <Typography variant="h6" fontWeight={700}>{user?.name}</Typography>
              <Typography variant="body2" color="text.secondary">{user?.email}</Typography>
              {user?.createdAt && (
                <Typography variant="caption" color="text.secondary">
                  Member since {format(new Date(user.createdAt), 'MMMM yyyy')}
                </Typography>
              )}
            </Box>
          </Box>

          <Divider sx={{ mb: 3 }} />

          {apiError && <Alert severity="error" sx={{ mb: 2 }}>{apiError}</Alert>}

          <Box component="form" onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Full Name"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (nameError) setNameError('');
                  }}
                  error={!!nameError}
                  helperText={nameError}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Email Address"
                  value={user?.email || ''}
                  disabled
                  helperText="Email cannot be changed"
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={loading}
                  startIcon={loading ? <CircularProgress size={16} color="inherit" /> : <SaveIcon />}
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </Button>
              </Grid>
            </Grid>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Profile;
