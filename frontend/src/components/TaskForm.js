import React, { useState, useEffect } from 'react';
import {
  Box, TextField, MenuItem, Button, Grid, CircularProgress,
  Typography, Paper,
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';

const STATUSES = ['Pending', 'In Progress', 'Completed'];
const PRIORITIES = ['Low', 'Medium', 'High'];

const TaskForm = ({ initialValues = {}, onSubmit, loading, title }) => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '',
    description: '',
    status: 'Pending',
    priority: 'Medium',
    dueDate: '',
    ...initialValues,
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialValues && Object.keys(initialValues).length > 0) {
      setForm((prev) => ({
        ...prev,
        ...initialValues,
        dueDate: initialValues.dueDate
          ? new Date(initialValues.dueDate).toISOString().split('T')[0]
          : '',
      }));
    }
  }, [initialValues.title]); // eslint-disable-line

  const validate = () => {
    const newErrors = {};
    if (!form.title.trim()) newErrors.title = 'Title is required';
    if (!form.description.trim()) newErrors.description = 'Description is required';
    if (!form.status) newErrors.status = 'Status is required';
    if (!form.priority) newErrors.priority = 'Priority is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    const payload = {
      title: form.title.trim(),
      description: form.description.trim(),
      status: form.status,
      priority: form.priority,
      dueDate: form.dueDate || null,
    };
    onSubmit(payload);
  };

  return (
    <Paper sx={{ p: { xs: 2, sm: 4 }, maxWidth: 700, mx: 'auto' }}>
      <Typography variant="h5" fontWeight={700} mb={3}>
        {title}
      </Typography>

      <Box component="form" onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Task Title"
              name="title"
              value={form.title}
              onChange={handleChange}
              error={!!errors.title}
              helperText={errors.title}
              placeholder="Enter task title..."
              required
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Description"
              name="description"
              value={form.description}
              onChange={handleChange}
              error={!!errors.description}
              helperText={errors.description}
              placeholder="Describe the task in detail..."
              required
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              select
              label="Status"
              name="status"
              value={form.status}
              onChange={handleChange}
              error={!!errors.status}
              helperText={errors.status}
              required
            >
              {STATUSES.map((s) => (
                <MenuItem key={s} value={s}>{s}</MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              select
              label="Priority"
              name="priority"
              value={form.priority}
              onChange={handleChange}
              error={!!errors.priority}
              helperText={errors.priority}
              required
            >
              {PRIORITIES.map((p) => (
                <MenuItem key={p} value={p}>{p}</MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              type="date"
              label="Due Date"
              name="dueDate"
              value={form.dueDate}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
              inputProps={{ min: new Date().toISOString().split('T')[0] }}
            />
          </Grid>

          <Grid item xs={12}>
            <Box display="flex" gap={2} justifyContent="flex-end" mt={1}>
              <Button
                variant="outlined"
                startIcon={<ArrowBackIcon />}
                onClick={() => navigate(-1)}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                startIcon={loading ? <CircularProgress size={16} color="inherit" /> : <SaveIcon />}
                disabled={loading}
              >
                {loading ? 'Saving...' : 'Save Task'}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
};

export default TaskForm;
