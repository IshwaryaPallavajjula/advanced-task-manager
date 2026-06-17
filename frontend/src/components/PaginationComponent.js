import React from 'react';
import { Box, Button, Typography, IconButton, useTheme } from '@mui/material';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

const PaginationComponent = ({ pagination, onPageChange }) => {
  const theme = useTheme();
  if (!pagination || pagination.totalPages <= 1) return null;

  const { page, totalPages, total, limit } = pagination;
  const start = (page - 1) * limit + 1;
  const end = Math.min(page * limit, total);

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      flexWrap="wrap"
      gap={2}
      mt={3}
    >
      <Typography variant="body2" color="text.secondary">
        Showing {start}–{end} of {total} tasks
      </Typography>

      <Box display="flex" alignItems="center" gap={1}>
        <IconButton
          onClick={() => onPageChange(page - 1)}
          disabled={!pagination.hasPrevPage}
          size="small"
          sx={{
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: 2,
          }}
        >
          <NavigateBeforeIcon />
        </IconButton>

        <Typography variant="body2" sx={{ px: 1, fontWeight: 600 }}>
          Page {page} of {totalPages}
        </Typography>

        <IconButton
          onClick={() => onPageChange(page + 1)}
          disabled={!pagination.hasNextPage}
          size="small"
          sx={{
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: 2,
          }}
        >
          <NavigateNextIcon />
        </IconButton>
      </Box>
    </Box>
  );
};

export default PaginationComponent;
