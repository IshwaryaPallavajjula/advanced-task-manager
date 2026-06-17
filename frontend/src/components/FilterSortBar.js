import React from 'react';
import { Box, TextField, MenuItem } from '@mui/material';
import SearchBar from './SearchBar';

const FILTER_OPTIONS = [
  { value: '', label: 'All Statuses' },
  { value: 'Pending', label: 'Pending' },
  { value: 'In Progress', label: 'In Progress' },
  { value: 'Completed', label: 'Completed' },
];

const PRIORITY_OPTIONS = [
  { value: '', label: 'All Priorities' },
  { value: 'High', label: 'High Priority' },
  { value: 'Medium', label: 'Medium Priority' },
  { value: 'Low', label: 'Low Priority' },
];

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'oldest', label: 'Oldest First' },
  { value: 'dueDate', label: 'Due Date' },
  { value: 'priority', label: 'Priority' },
  { value: 'status', label: 'Status' },
];

const FilterSortBar = ({ params, onParamsChange }) => {
  return (
    <Box
      display="flex"
      flexWrap="wrap"
      gap={2}
      alignItems="center"
    >
      <SearchBar
        value={params.search || ''}
        onChange={(val) => onParamsChange({ search: val })}
      />

      <TextField
        select
        size="small"
        label="Status"
        value={params.status || ''}
        onChange={(e) => onParamsChange({ status: e.target.value })}
        sx={{ minWidth: 150 }}
      >
        {FILTER_OPTIONS.map((opt) => (
          <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
        ))}
      </TextField>

      <TextField
        select
        size="small"
        label="Priority"
        value={params.priority || ''}
        onChange={(e) => onParamsChange({ priority: e.target.value })}
        sx={{ minWidth: 160 }}
      >
        {PRIORITY_OPTIONS.map((opt) => (
          <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
        ))}
      </TextField>

      <TextField
        select
        size="small"
        label="Sort By"
        value={params.sort || 'newest'}
        onChange={(e) => onParamsChange({ sort: e.target.value })}
        sx={{ minWidth: 150 }}
      >
        {SORT_OPTIONS.map((opt) => (
          <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
        ))}
      </TextField>
    </Box>
  );
};

export default FilterSortBar;
