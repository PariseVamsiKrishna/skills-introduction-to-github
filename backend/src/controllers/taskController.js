const Task = require('../models/Task');

const getTasks = async (req, res) => {
  const tasks = await Task.find({ owner: req.user.id }).sort({ createdAt: -1 });
  return res.json(tasks);
};

const createTask = async (req, res) => {
  const { title, description } = req.body;

  if (!title) {
    return res.status(400).json({ message: 'Title is required' });
  }

  const task = await Task.create({
    title,
    description: description || '',
    owner: req.user.id,
  });

  return res.status(201).json(task);
};

const updateTask = async (req, res) => {
  const { title, description, completed } = req.body;
  const updatePayload = {};

  if (typeof title === 'string') {
    if (!title.trim()) {
      return res.status(400).json({ message: 'Title cannot be empty' });
    }
    updatePayload.title = title;
  }

  if (typeof description === 'string') {
    updatePayload.description = description;
  }

  if (typeof completed === 'boolean') {
    updatePayload.completed = completed;
  }

  const task = await Task.findOneAndUpdate(
    { _id: req.params.id, owner: req.user.id },
    updatePayload,
    { new: true, runValidators: true }
  );

  if (!task) {
    return res.status(404).json({ message: 'Task not found' });
  }

  return res.json(task);
};

const deleteTask = async (req, res) => {
  const task = await Task.findOneAndDelete({ _id: req.params.id, owner: req.user.id });

  if (!task) {
    return res.status(404).json({ message: 'Task not found' });
  }

  return res.status(204).send();
};

module.exports = {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
};
