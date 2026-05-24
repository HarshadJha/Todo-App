const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const { protect } = require('../middleware/auth');

// All task routes are protected
router.use(protect);

// ─────────────────────────────────────────────
// @route   GET /api/tasks
// @desc    Get all tasks for logged-in user
// @access  Protected
// Supports query params: status, priority, search, sortBy, sortOrder
// ─────────────────────────────────────────────
router.get('/', async (req, res) => {
  try {
    const { status, priority, search, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;

    // Build filter object
    const filter = { userId: req.user._id, isDeleted: false };

    if (status && ['Pending', 'In-Progress', 'Completed'].includes(status)) {
      filter.status = status;
    }
    if (priority && ['Low', 'Medium', 'High'].includes(priority)) {
      filter.priority = priority;
    }
    if (search && search.trim()) {
      filter.$or = [
        { title: { $regex: search.trim(), $options: 'i' } },
        { description: { $regex: search.trim(), $options: 'i' } },
      ];
    }

    // Build sort object
    const validSortFields = ['createdAt', 'dueDate', 'priority', 'title', 'status'];
    const sortField = validSortFields.includes(sortBy) ? sortBy : 'createdAt';
    const sortDir = sortOrder === 'asc' ? 1 : -1;

    // Priority sort needs custom ordering
    let tasks;
    if (sortField === 'priority') {
      tasks = await Task.find(filter).lean();
      const priorityOrder = { High: 0, Medium: 1, Low: 2 };
      tasks.sort((a, b) => {
        const diff = priorityOrder[a.priority] - priorityOrder[b.priority];
        return sortDir === 1 ? diff : -diff;
      });
    } else {
      tasks = await Task.find(filter).sort({ [sortField]: sortDir }).lean();
    }

    // Summary counts (always based on all user tasks, not filtered)
    const allTasks = await Task.find({ userId: req.user._id, isDeleted: false }).lean();
    const summary = {
      total: allTasks.length,
      completed: allTasks.filter((t) => t.status === 'Completed').length,
      pending: allTasks.filter((t) => t.status === 'Pending').length,
      inProgress: allTasks.filter((t) => t.status === 'In-Progress').length,
    };

    res.status(200).json({ success: true, tasks, summary });
  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// ─────────────────────────────────────────────
// @route   POST /api/tasks
// @desc    Create a new task
// @access  Protected
// ─────────────────────────────────────────────
router.post('/', async (req, res) => {
  try {
    const { title, description, dueDate, priority, status } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ success: false, message: 'Task title is required.' });
    }

    const task = await Task.create({
      userId: req.user._id,
      title: title.trim(),
      description: description ? description.trim() : '',
      dueDate: dueDate || null,
      priority: priority || 'Medium',
      status: status || 'Pending',
    });

    res.status(201).json({ success: true, message: 'Task created successfully!', task });
  } catch (error) {
    console.error('Create task error:', error);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// ─────────────────────────────────────────────
// @route   PUT /api/tasks/:id
// @desc    Update a task by ID
// @access  Protected
// ─────────────────────────────────────────────
router.put('/:id', async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, userId: req.user._id, isDeleted: false });

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found.' });
    }

    const { title, description, dueDate, priority, status } = req.body;

    if (title !== undefined) task.title = title.trim();
    if (description !== undefined) task.description = description.trim();
    if (dueDate !== undefined) task.dueDate = dueDate || null;
    if (priority !== undefined) task.priority = priority;
    if (status !== undefined) task.status = status;

    await task.save();

    res.status(200).json({ success: true, message: 'Task updated successfully!', task });
  } catch (error) {
    console.error('Update task error:', error);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// ─────────────────────────────────────────────
// @route   DELETE /api/tasks/:id
// @desc    Soft-delete a task by ID
// @access  Protected
// ─────────────────────────────────────────────
router.delete('/:id', async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, userId: req.user._id, isDeleted: false });

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found.' });
    }

    // Soft delete
    task.isDeleted = true;
    await task.save();

    res.status(200).json({ success: true, message: 'Task deleted successfully.' });
  } catch (error) {
    console.error('Delete task error:', error);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

module.exports = router;