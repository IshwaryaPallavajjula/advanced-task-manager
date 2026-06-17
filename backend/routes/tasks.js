const express = require('express');
const router = express.Router();
const {
  getTasks,
  getTaskStats,
  getTask,
  createTask,
  updateTask,
  deleteTask,
} = require('../controllers/taskController');
const { protect } = require('../middleware/auth');
const { createTaskValidation, updateTaskValidation } = require('../validators/taskValidator');

// All task routes are protected
router.use(protect);

router.get('/stats', getTaskStats);
router.route('/').get(getTasks).post(createTaskValidation, createTask);
router.route('/:id').get(getTask).put(updateTaskValidation, updateTask).delete(deleteTask);

module.exports = router;
