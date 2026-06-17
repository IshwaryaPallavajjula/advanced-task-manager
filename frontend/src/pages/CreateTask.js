import React, { useState } from 'react';
import { Box, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import TaskForm from '../components/TaskForm';
import { taskService } from '../services/api';

const CreateTask = () => {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (data) => {
    setLoading(true);
    try {
      await taskService.createTask(data);
      enqueueSnackbar('Task created successfully!', { variant: 'success' });
      navigate('/tasks');
    } catch (err) {
      enqueueSnackbar(err.response?.data?.message || 'Failed to create task', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Typography variant="h5" fontWeight={700} mb={3}>Create New Task</Typography>
      <TaskForm title="Task Details" onSubmit={handleSubmit} loading={loading} />
    </Box>
  );
};

export default CreateTask;
