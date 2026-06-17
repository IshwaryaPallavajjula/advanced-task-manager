import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';

const LoadingSpinner = ({ message = 'Loading...' }) => (
  <Box
    display="flex"
    flexDirection="column"
    alignItems="center"
    justifyContent="center"
    minHeight={200}
    gap={2}
  >
    <CircularProgress color="primary" />
    <Typography color="text.secondary" variant="body2">{message}</Typography>
  </Box>
);

export default LoadingSpinner;
