import React, { useState } from 'react';
import {
  Box, Card, CardContent, TextField, Button, Typography,
  Link, InputAdornment, IconButton, Alert, CircularProgress,
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useSnackbar } from 'notistack';

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const { enqueueSnackbar } = useSnackbar();

  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [apiError, setApiError] = useState('');

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Name is required';
    else if (form.name.trim().length < 2) e.name = 'Name must be at least 2 characters';
    if (!form.email.trim()) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email';
    if (!form.password) e.password = 'Password is required';
    else if (form.password.length < 6) e.password = 'Password must be at least 6 characters';
    if (!form.confirmPassword) e.confirmPassword = 'Please confirm your password';
    else if (form.password !== form.confirmPassword) e.confirmPassword = 'Passwords do not match';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = (e) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
    if (errors[e.target.name]) setErrors((p) => ({ ...p, [e.target.name]: '' }));
    setApiError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await register({ name: form.name.trim(), email: form.email.trim(), password: form.password });
      enqueueSnackbar('Account created! Welcome aboard.', { variant: 'success' });
      navigate('/dashboard');
    } catch (err) {
      setApiError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      minHeight="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      sx={{ bgcolor: 'background.default', p: 2 }}
    >
      <Card sx={{ width: '100%', maxWidth: 440 }}>
        <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
          <Box display="flex" flexDirection="column" alignItems="center" mb={3}>
            <Box
              sx={{
                width: 56,
                height: 56,
                borderRadius: 3,
                bgcolor: 'primary.main',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: 1.5,
              }}
            >
              <Typography variant="h6" fontWeight={800} color="white">ATM</Typography>
            </Box>
            <Typography variant="h5" fontWeight={700}>Create account</Typography>
            <Typography variant="body2" color="text.secondary" mt={0.5}>
              Start managing tasks today
            </Typography>
          </Box>

          {apiError && <Alert severity="error" sx={{ mb: 2 }}>{apiError}</Alert>}

          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              fullWidth label="Full Name" name="name"
              value={form.name} onChange={handleChange}
              error={!!errors.name} helperText={errors.name}
              sx={{ mb: 2 }} autoFocus
            />
            <TextField
              fullWidth label="Email" name="email" type="email"
              value={form.email} onChange={handleChange}
              error={!!errors.email} helperText={errors.email}
              sx={{ mb: 2 }} autoComplete="email"
            />
            <TextField
              fullWidth label="Password" name="password"
              type={showPassword ? 'text' : 'password'}
              value={form.password} onChange={handleChange}
              error={!!errors.password} helperText={errors.password}
              sx={{ mb: 2 }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword((p) => !p)} edge="end">
                      {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              fullWidth label="Confirm Password" name="confirmPassword"
              type={showPassword ? 'text' : 'password'}
              value={form.confirmPassword} onChange={handleChange}
              error={!!errors.confirmPassword} helperText={errors.confirmPassword}
              sx={{ mb: 3 }}
            />

            <Button
              type="submit" fullWidth variant="contained" size="large"
              disabled={loading}
              startIcon={loading ? <CircularProgress size={18} color="inherit" /> : <PersonAddIcon />}
              sx={{ mb: 2 }}
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </Button>

            <Typography variant="body2" textAlign="center" color="text.secondary">
              Already have an account?{' '}
              <Link component={RouterLink} to="/login" fontWeight={600}>Sign in</Link>
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Register;
