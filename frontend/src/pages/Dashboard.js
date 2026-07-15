import React, { useState, useEffect } from 'react';
import {
  Box, Grid, Card, CardContent, Typography,
  Skeleton, Alert, Button,
} from '@mui/material';
import AssignmentIcon from '@mui/icons-material/Assignment';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AddTaskIcon from '@mui/icons-material/AddTask';
import ListAltIcon from '@mui/icons-material/ListAlt';
import { useNavigate } from 'react-router-dom';
import { taskService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import TaskCard, { TaskCardSkeleton } from '../components/TaskCard';

const StatCard = ({ title, value, icon, color, loading }) => (
  <Card>
    <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
      <Box
        sx={{
          width: 56,
          height: 56,
          borderRadius: 3,
          bgcolor: `${color}.50`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        {React.cloneElement(icon, { sx: { color: `${color}.main`, fontSize: 28 } })}
      </Box>
      <Box>
        <Typography variant="body2" color="text.secondary" fontWeight={500}>
          {title}
        </Typography>
        {loading ? (
          <Skeleton width={48} height={40} />
        ) : (
          <Typography variant="h4" fontWeight={700}>{value ?? 0}</Typography>
        )}
      </Box>
    </CardContent>
  </Card>
);

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [recentTasks, setRecentTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const [statsRes, tasksRes] = await Promise.all([
          taskService.getStats(),
          taskService.getTasks({ limit: 6, sort: 'newest' }),
        ]);
        setStats(statsRes.data.data);
        setRecentTasks(tasksRes.data.data.tasks);
      } catch {
        setError('Failed to load dashboard data.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleTaskDeleted = (id) => {
    setRecentTasks((prev) => prev.filter((t) => t._id !== id));
    setStats((prev) => prev && { ...prev, total: prev.total - 1 });
  };

  const completionRate = stats?.total
    ? Math.round((stats.completed / stats.total) * 100)
    : 0;

  return (
    <Box>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={3} flexWrap="wrap" gap={2}>
        <Box>
          <Typography variant="h5" fontWeight={700}>
            Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 18 ? 'afternoon' : 'evening'}, {user?.name?.split(' ')[0]} 👋
          </Typography>
          <Typography variant="body2" color="text.secondary" mt={0.5}>
            Here's your productivity overview
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddTaskIcon />}
          onClick={() => navigate('/tasks/create')}
        >
          New Task
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      {/* Stats Cards */}
      <Grid container spacing={2} mb={4}>
        {[
          { title: 'Total Tasks', value: stats?.total, icon: <AssignmentIcon />, color: 'primary' },
          { title: 'Pending', value: stats?.pending, icon: <AccessTimeIcon />, color: 'warning' },
          { title: 'In Progress', value: stats?.inProgress, icon: <AutorenewIcon />, color: 'info' },
          { title: 'Completed', value: stats?.completed, icon: <CheckCircleIcon />, color: 'success' },
        ].map((s) => (
          <Grid item xs={12} sm={6} lg={3} key={s.title}>
            <StatCard {...s} loading={loading} />
          </Grid>
        ))}
      </Grid>

      {/* Progress Bar */}
      {!loading && stats?.total > 0 && (
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Box display="flex" justifyContent="space-between" mb={1}>
              <Typography variant="subtitle1" fontWeight={600}>Overall Progress</Typography>
              <Typography variant="subtitle1" fontWeight={700} color="success.main">
                {completionRate}%
              </Typography>
            </Box>
            <Box
              sx={{
                height: 10,
                borderRadius: 5,
                bgcolor: 'action.hover',
                overflow: 'hidden',
              }}
            >
              <Box
                sx={{
                  height: '100%',
                  width: `${completionRate}%`,
                  bgcolor: 'success.main',
                  borderRadius: 5,
                  transition: 'width 0.6s ease',
                }}
              />
            </Box>
            <Typography variant="caption" color="text.secondary" mt={0.5} display="block">
              {stats.completed} of {stats.total} tasks completed
            </Typography>
          </CardContent>
        </Card>
      )}

      {/* Recent Tasks */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6" fontWeight={700}>Recent Tasks</Typography>
        <Button
          variant="text"
          startIcon={<ListAltIcon />}
          onClick={() => navigate('/tasks')}
        >
          View all
        </Button>
      </Box>

      <Grid container spacing={2}>
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <Grid item xs={12} sm={6} lg={4} key={i}>
              <TaskCardSkeleton />
            </Grid>
          ))
        ) : recentTasks.length === 0 ? (
          <Grid item xs={12}>
            <Card>
              <CardContent sx={{ textAlign: 'center', py: 6 }}>
                <AssignmentIcon sx={{ fontSize: 56, color: 'action.disabled', mb: 2 }} />
                <Typography variant="h6" color="text.secondary">No tasks yet</Typography>
                <Typography variant="body2" color="text.secondary" mb={3}>
                  Create your first task to get started
                </Typography>
                <Button variant="contained" startIcon={<AddTaskIcon />} onClick={() => navigate('/tasks/create')}>
                  Create Task
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ) : (
          recentTasks.map((task) => (
            <Grid item xs={12} sm={6} lg={4} key={task._id}>
              <TaskCard task={task} onDeleted={handleTaskDeleted} />
            </Grid>
          ))
        )}
      </Grid>
    </Box>
  );
};

export default Dashboard;
