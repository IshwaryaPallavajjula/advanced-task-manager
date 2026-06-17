import React, { useState, useEffect } from 'react';
import { Box, Typography, Alert } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import TaskForm from '../components/TaskForm';
import LoadingSpinner from '../components/LoadingSpinner';
import { taskService } from '../services/api';

const EditTask = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const [task, setTask] = useState(null);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [fetchError, setFetchError] = useState('');

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const { data } = await taskService.getTask(id);
        setTask(data.data.task);
      } catch (err) {
        setFetchError(err.response?.data?.message || 'Task not found');
      } finally {
        setFetchLoading(false);
      }
    };
    fetchTask();
  }, [id]);

  const handleSubmit = async (data) => {
    setSubmitLoading(true);
    try {
      await taskService.updateTask(id, data);
      enqueueSnackbar('Task updated successfully!', { variant: 'success' });
      navigate('/tasks');
    } catch (err) {
      enqueueSnackbar(err.response?.data?.message || 'Failed to update task', { variant: 'error' });
    } finally {
      setSubmitLoading(false);
    }
  };

  if (fetchLoading) return <LoadingSpinner message="Loading task..." />;
  if (fetchError) return <Alert severity="error">{fetchError}</Alert>;

  return (
    <Box>
      <Typography variant="h5" fontWeight={700} mb={3}>Edit Task</Typography>
      <TaskForm
        title="Update Task Details"
        initialValues={task}
        onSubmit={handleSubmit}
        loading={submitLoading}
      />
    </Box>
  );
};

export default EditTask;
