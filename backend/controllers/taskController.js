const mongoose = require('mongoose');
const Task = require('../models/Task');

const VALID_SORT_FIELDS = {
  newest: { createdAt: -1 },
  oldest: { createdAt: 1 },
  dueDate: { dueDate: 1 },
  priority: { priority: -1 },
  status: { status: 1 },
};

/**
 * @route   GET /api/tasks
 * @desc    Get all tasks for logged-in user with filtering, sorting, pagination, search
 * @access  Private
 */
const getTasks = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      priority,
      search,
      sort = 'newest',
    } = req.query;

    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(50, Math.max(1, parseInt(limit)));
    const skip = (pageNum - 1) * limitNum;

    // Build filter query
    const query = { userId: req.user._id };

    if (status && ['Pending', 'In Progress', 'Completed'].includes(status)) {
      query.status = status;
    }

    if (priority && ['Low', 'Medium', 'High'].includes(priority)) {
      query.priority = priority;
    }

    if (search && search.trim()) {
      query.$or = [
        { title: { $regex: search.trim(), $options: 'i' } },
        { description: { $regex: search.trim(), $options: 'i' } },
      ];
    }

    const sortOption = VALID_SORT_FIELDS[sort] || VALID_SORT_FIELDS.newest;

    const [tasks, total] = await Promise.all([
      Task.find(query).sort(sortOption).skip(skip).limit(limitNum).lean(),
      Task.countDocuments(query),
    ]);

    const totalPages = Math.ceil(total / limitNum);

    res.json({
      success: true,
      data: {
        tasks,
        pagination: {
          total,
          page: pageNum,
          limit: limitNum,
          totalPages,
          hasNextPage: pageNum < totalPages,
          hasPrevPage: pageNum > 1,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/tasks/stats
 * @desc    Get task statistics for dashboard
 * @access  Private
 */
const getTaskStats = async (req, res, next) => {
  try {
    const stats = await Task.aggregate([
      { $match: { userId: req.user._id } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);

    const result = {
      total: 0,
      pending: 0,
      inProgress: 0,
      completed: 0,
    };

    stats.forEach(({ _id, count }) => {
      result.total += count;
      if (_id === 'Pending') result.pending = count;
      if (_id === 'In Progress') result.inProgress = count;
      if (_id === 'Completed') result.completed = count;
    });

    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/tasks/:id
 * @desc    Get single task
 * @access  Private
 */
const getTask = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, message: 'Invalid task ID' });
    }

    const task = await Task.findOne({ _id: req.params.id, userId: req.user._id });
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    res.json({ success: true, data: { task } });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   POST /api/tasks
 * @desc    Create a new task
 * @access  Private
 */
const createTask = async (req, res, next) => {
  try {
    const { title, description, status, priority, dueDate } = req.body;

    const task = await Task.create({
      title,
      description,
      status,
      priority,
      dueDate: dueDate || null,
      userId: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: 'Task created successfully',
      data: { task },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   PUT /api/tasks/:id
 * @desc    Update a task
 * @access  Private
 */
const updateTask = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, message: 'Invalid task ID' });
    }

    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    res.json({
      success: true,
      message: 'Task updated successfully',
      data: { task },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   DELETE /api/tasks/:id
 * @desc    Delete a task
 * @access  Private
 */
const deleteTask = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, message: 'Invalid task ID' });
    }

    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    res.json({ success: true, message: 'Task deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = { getTasks, getTaskStats, getTask, createTask, updateTask, deleteTask };
