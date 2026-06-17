import React, { useState } from 'react';
import {
  Card, CardContent, CardActions, Typography, Box, IconButton,
  Tooltip, Divider, Skeleton,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { format, isPast, isToday } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import StatusBadge from './StatusBadge';
import PriorityBadge from './PriorityBadge';
import ConfirmDialog from './ConfirmDialog';
import { taskService } from '../services/api';
import { useSnackbar } from 'notistack';

const TaskCard = ({ task, onDeleted }) => {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await taskService.deleteTask(task._id);
      enqueueSnackbar('Task deleted successfully', { variant: 'success' });
      onDeleted(task._id);
    } catch (err) {
      enqueueSnackbar(err.response?.data?.message || 'Failed to delete task', { variant: 'error' });
    } finally {
      setDeleting(false);
      setConfirmOpen(false);
    }
  };

  const isDueSoon = task.dueDate
    ? isPast(new Date(task.dueDate)) && task.status !== 'Completed'
    : false;
  const isDueToday = task.dueDate ? isToday(new Date(task.dueDate)) : false;

  return (
    <>
      <Card
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          transition: 'transform 0.15s ease, box-shadow 0.15s ease',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
          },
          borderLeft: isDueSoon ? '3px solid #DC2626' : 'none',
        }}
      >
        <CardContent sx={{ flexGrow: 1, pb: 1 }}>
          <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1.5}>
            <Typography
              variant="h6"
              sx={{
                fontSize: '1rem',
                fontWeight: 700,
                lineHeight: 1.3,
                overflow: 'hidden',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                flex: 1,
                mr: 1,
              }}
            >
              {task.title}
            </Typography>
          </Box>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mb: 2,
              overflow: 'hidden',
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
            }}
          >
            {task.description}
          </Typography>

          <Box display="flex" gap={1} flexWrap="wrap" mb={2}>
            <StatusBadge status={task.status} />
            <PriorityBadge priority={task.priority} />
          </Box>

          <Divider sx={{ mb: 1.5 }} />

          <Box display="flex" flexDirection="column" gap={0.5}>
            {task.dueDate && (
              <Box display="flex" alignItems="center" gap={0.5}>
                <CalendarTodayIcon
                  sx={{
                    fontSize: 14,
                    color: isDueSoon ? 'error.main' : isDueToday ? 'warning.main' : 'text.secondary',
                  }}
                />
                <Typography
                  variant="caption"
                  color={isDueSoon ? 'error.main' : isDueToday ? 'warning.main' : 'text.secondary'}
                  fontWeight={isDueSoon || isDueToday ? 700 : 400}
                >
                  Due: {format(new Date(task.dueDate), 'MMM d, yyyy')}
                  {isDueSoon && ' • Overdue'}
                  {isDueToday && !isDueSoon && ' • Today'}
                </Typography>
              </Box>
            )}
            <Box display="flex" alignItems="center" gap={0.5}>
              <AccessTimeIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
              <Typography variant="caption" color="text.secondary">
                Created {format(new Date(task.createdAt), 'MMM d, yyyy')}
              </Typography>
            </Box>
          </Box>
        </CardContent>

        <CardActions sx={{ px: 2, pb: 2, justifyContent: 'flex-end' }}>
          <Tooltip title="Edit task">
            <IconButton
              size="small"
              onClick={() => navigate(`/tasks/edit/${task._id}`)}
              color="primary"
              sx={{ bgcolor: 'primary.50', '&:hover': { bgcolor: 'primary.100' } }}
            >
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete task">
            <IconButton
              size="small"
              onClick={() => setConfirmOpen(true)}
              color="error"
              sx={{ bgcolor: 'error.50', '&:hover': { bgcolor: 'error.100' } }}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </CardActions>
      </Card>

      <ConfirmDialog
        open={confirmOpen}
        title="Delete Task"
        message={`Are you sure you want to delete "${task.title}"? This cannot be undone.`}
        onConfirm={handleDelete}
        onCancel={() => setConfirmOpen(false)}
        loading={deleting}
      />
    </>
  );
};

export const TaskCardSkeleton = () => (
  <Card>
    <CardContent>
      <Skeleton variant="text" height={32} width="80%" />
      <Skeleton variant="text" height={20} sx={{ mt: 1 }} />
      <Skeleton variant="text" height={20} width="60%" />
      <Box display="flex" gap={1} mt={2}>
        <Skeleton variant="rounded" width={80} height={24} />
        <Skeleton variant="rounded" width={70} height={24} />
      </Box>
      <Skeleton variant="text" height={20} sx={{ mt: 2 }} />
    </CardContent>
    <CardActions sx={{ px: 2, pb: 2, justifyContent: 'flex-end' }}>
      <Skeleton variant="circular" width={32} height={32} />
      <Skeleton variant="circular" width={32} height={32} />
    </CardActions>
  </Card>
);

export default TaskCard;
