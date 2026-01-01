import Task from '../models/Task.js';
import { sendResponse } from '../utils/helpers.js';

export const createTask = async (req, res) => {
  try {
    const { title, description, priority, status, dueDate } = req.body;

    const task = new Task({
      title,
      description,
      priority: priority || 'medium',
      status: status || 'todo',
      dueDate,
      userId: req.user.id,
    });

    await task.save();

    sendResponse(res, 201, true, 'Task created successfully', { task });
  } catch (error) {
    console.error('Create task error:', error);
    sendResponse(res, 500, false, 'Server error while creating task');
  }
};

export const getTasks = async (req, res) => {
  try {
    const { status, priority, search, sort = '-createdAt' } = req.query;

    // Build filter
    const filter = { userId: req.user.id };

    if (status) {
      filter.status = status;
    }

    if (priority) {
      filter.priority = priority;
    }

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const tasks = await Task.find(filter).sort(sort);

    sendResponse(res, 200, true, 'Tasks fetched successfully', {
      count: tasks.length,
      tasks,
    });
  } catch (error) {
    console.error('Get tasks error:', error);
    sendResponse(res, 500, false, 'Server error while fetching tasks');
  }
};

export const getTaskById = async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!task) {
      return sendResponse(res, 404, false, 'Task not found');
    }

    sendResponse(res, 200, true, 'Task fetched successfully', { task });
  } catch (error) {
    console.error('Get task by id error:', error);
    sendResponse(res, 500, false, 'Server error while fetching task');
  }
};

export const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, priority, status, dueDate } = req.body;

    // Verify task belongs to user
    let task = await Task.findOne({ _id: id, userId: req.user.id });

    if (!task) {
      return sendResponse(res, 404, false, 'Task not found');
    }

    // Update only provided fields
    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (priority !== undefined) task.priority = priority;
    if (status !== undefined) task.status = status;
    if (dueDate !== undefined) task.dueDate = dueDate;

    await task.save();

    sendResponse(res, 200, true, 'Task updated successfully', { task });
  } catch (error) {
    console.error('Update task error:', error);
    sendResponse(res, 500, false, 'Server error while updating task');
  }
};

export const deleteTask = async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!task) {
      return sendResponse(res, 404, false, 'Task not found');
    }

    sendResponse(res, 200, true, 'Task deleted successfully', { deletedId: task._id });
  } catch (error) {
    console.error('Delete task error:', error);
    sendResponse(res, 500, false, 'Server error while deleting task');
  }
};
