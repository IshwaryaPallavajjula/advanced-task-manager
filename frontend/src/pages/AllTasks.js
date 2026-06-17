import React from 'react';
import {
  Box, Grid, Typography, Button, Alert, Card, CardContent,
} from '@mui/material';
import AddTaskIcon from '@mui/icons-material/AddTask';
import AssignmentIcon from '@mui/icons-material/Assignment';
import { useNavigate } from 'react-router-dom';
import useTasks from '../hooks/useTasks';
import TaskCard, { TaskCardSkeleton } from '../components/TaskCard';
import FilterSortBar from '../components/FilterSortBar';
import PaginationComponent from '../components/PaginationComponent';

const AllTasks = () => {
  const navigate = useNavigate();
  const { tasks, pagination, loading, error, params, updateParams, setPage, refetch } = useTasks();

  const handleTaskDeleted = () => refetch();

  return (
    <Box>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={3} flexWrap="wrap" gap={2}>
        <Box>
          <Typography variant="h5" fontWeight={700}>All Tasks</Typography>
          {!loading && pagination.total !== undefined && (
            <Typography variant="body2" color="text.secondary" mt={0.5}>
              {pagination.total} task{pagination.total !== 1 ? 's' : ''} total
            </Typography>
          )}
        </Box>
        <Button
          variant="contained"
          startIcon={<AddTaskIcon />}
          onClick={() => navigate('/tasks/create')}
        >
          New Task
        </Button>
      </Box>

      {/* Filters */}
      <Box mb={3}>
        <FilterSortBar params={params} onParamsChange={updateParams} />
      </Box>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      {/* Task Grid */}
      <Grid container spacing={2}>
        {loading ? (
          Array.from({ length: params.limit || 10 }).map((_, i) => (
            <Grid item xs={12} sm={6} lg={4} key={i}>
              <TaskCardSkeleton />
            </Grid>
          ))
        ) : tasks.length === 0 ? (
          <Grid item xs={12}>
            <Card>
              <CardContent sx={{ textAlign: 'center', py: 6 }}>
                <AssignmentIcon sx={{ fontSize: 56, color: 'action.disabled', mb: 2 }} />
                <Typography variant="h6" color="text.secondary">
                  {params.search || params.status || params.priority
                    ? 'No tasks match your filters'
                    : 'No tasks yet'}
                </Typography>
                <Typography variant="body2" color="text.secondary" mb={3}>
                  {params.search || params.status || params.priority
                    ? 'Try adjusting your search or filters'
                    : 'Create your first task to get started'}
                </Typography>
                {!params.search && !params.status && !params.priority && (
                  <Button variant="contained" startIcon={<AddTaskIcon />} onClick={() => navigate('/tasks/create')}>
                    Create Task
                  </Button>
                )}
              </CardContent>
            </Card>
          </Grid>
        ) : (
          tasks.map((task) => (
            <Grid item xs={12} sm={6} lg={4} key={task._id}>
              <TaskCard task={task} onDeleted={handleTaskDeleted} />
            </Grid>
          ))
        )}
      </Grid>

      {/* Pagination */}
      <PaginationComponent pagination={pagination} onPageChange={setPage} />
    </Box>
  );
};

export default AllTasks;
