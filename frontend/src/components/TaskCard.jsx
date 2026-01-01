import React from 'react';
import { taskService } from '../services/authService';
import { useTaskStore } from '../store/authStore';

const TaskCard = ({ task, onEdit }) => {
  const { deleteTask } = useTaskStore();
  const [isDeleting, setIsDeleting] = React.useState(false);

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this task?')) {
      return;
    }

    setIsDeleting(true);
    try {
      await taskService.deleteTask(task._id);
      deleteTask(task._id);
    } catch (error) {
      alert('Failed to delete task');
    } finally {
      setIsDeleting(false);
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'text-green-600';
      case 'in-progress':
        return 'text-blue-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="card border border-gray-200">
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <h3 className="text-lg font-bold text-gray-900">{task.title}</h3>
          {task.description && (
            <p className="text-gray-600 text-sm mt-1">{task.description}</p>
          )}
        </div>

        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
          {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
        </span>
      </div>

      <div className="flex items-center justify-between text-sm">
        <div className="flex gap-3">
          <span className={`font-medium ${getStatusColor(task.status)}`}>
            {task.status === 'in-progress' ? 'In Progress' : task.status.charAt(0).toUpperCase() + task.status.slice(1)}
          </span>

          {task.dueDate && (
            <span className="text-gray-600">
              Due: {new Date(task.dueDate).toLocaleDateString()}
            </span>
          )}
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => onEdit(task)}
            className="btn-secondary btn-small"
          >
            Edit
          </button>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="btn-danger btn-small disabled:opacity-50"
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
