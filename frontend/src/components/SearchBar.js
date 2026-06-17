import React, { useState, useEffect } from 'react';
import { TextField, InputAdornment, IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';

const SearchBar = ({ value, onChange, placeholder = 'Search tasks...' }) => {
  const [localValue, setLocalValue] = useState(value || '');

  useEffect(() => {
    setLocalValue(value || '');
  }, [value]);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      onChange(localValue);
    }, 400);
    return () => clearTimeout(timer);
  }, [localValue]); // eslint-disable-line

  return (
    <TextField
      size="small"
      placeholder={placeholder}
      value={localValue}
      onChange={(e) => setLocalValue(e.target.value)}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon fontSize="small" color="action" />
          </InputAdornment>
        ),
        endAdornment: localValue ? (
          <InputAdornment position="end">
            <IconButton size="small" onClick={() => { setLocalValue(''); onChange(''); }}>
              <ClearIcon fontSize="small" />
            </IconButton>
          </InputAdornment>
        ) : null,
      }}
      sx={{ minWidth: 240 }}
    />
  );
};

export default SearchBar;
