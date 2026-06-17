import { useState, useEffect, useCallback } from 'react';
import { taskService } from '../services/api';

const useTasks = (initialParams = {}) => {
  const [tasks, setTasks] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [params, setParams] = useState({ page: 1, limit: 10, ...initialParams });

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await taskService.getTasks(params);
      setTasks(data.data.tasks);
      setPagination(data.data.pagination);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const updateParams = (newParams) => {
    setParams((prev) => ({ ...prev, ...newParams, page: 1 }));
  };

  const setPage = (page) => {
    setParams((prev) => ({ ...prev, page }));
  };

  return { tasks, pagination, loading, error, params, updateParams, setPage, refetch: fetchTasks };
};

export default useTasks;
