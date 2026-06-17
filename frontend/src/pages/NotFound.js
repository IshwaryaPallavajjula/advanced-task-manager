import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="80vh"
      textAlign="center"
      gap={2}
    >
      <Typography
        variant="h1"
        fontWeight={800}
        sx={{ fontSize: { xs: '6rem', sm: '9rem' }, color: 'primary.main', lineHeight: 1 }}
      >
        404
      </Typography>
      <Typography variant="h5" fontWeight={700}>Page not found</Typography>
      <Typography variant="body1" color="text.secondary" maxWidth={400}>
        The page you're looking for doesn't exist or has been moved.
      </Typography>
      <Button
        variant="contained"
        size="large"
        startIcon={<HomeIcon />}
        onClick={() => navigate('/dashboard')}
        sx={{ mt: 1 }}
      >
        Back to Dashboard
      </Button>
    </Box>
  );
};

export default NotFound;
