import React, { useState } from 'react';
import { taskService } from '../services/authService';
import { useTaskStore } from '../store/authStore';

const TaskForm = ({ task = null, onTaskAdded, onCancel }) => {
  const [formData, setFormData] = useState(
    task || {
      title: '',
      description: '',
      priority: 'medium',
      status: 'todo',
      dueDate: '',
    }
  );

  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { addTask, updateTask } = useTaskStore();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (task) {
        const updatedTask = await taskService.updateTask(task._id, formData);
        updateTask(task._id, updatedTask);
      } else {
        const newTask = await taskService.createTask(formData);
        addTask(newTask);
      }

      onTaskAdded?.();
      setFormData({
        title: '',
        description: '',
        priority: 'medium',
        status: 'todo',
        dueDate: '',
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save task');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card">
      <h3 className="text-xl font-bold mb-4">
        {task ? 'Edit Task' : 'Create New Task'}
      </h3>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-2">Title *</label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          className="input-field"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-2">Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="input-field resize-none"
          rows="4"
        />
      </div>

      <div className="grid grid-cols-3 gap-4 mb-4">
        <div>
          <label className="block text-gray-700 font-medium mb-2">Priority</label>
          <select
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            className="input-field"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-2">Status</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="input-field"
          >
            <option value="todo">To Do</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-2">Due Date</label>
          <input
            type="date"
            name="dueDate"
            value={formData.dueDate}
            onChange={handleChange}
            className="input-field"
          />
        </div>
      </div>

      <div className="flex gap-2">
        <button type="submit" disabled={isLoading} className="btn-primary disabled:opacity-50">
          {isLoading ? 'Saving...' : task ? 'Update Task' : 'Create Task'}
        </button>
        {task && (
          <button type="button" onClick={onCancel} className="btn-secondary">
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default TaskForm;
