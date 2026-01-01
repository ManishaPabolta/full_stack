import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { useTaskStore } from '../store/authStore';
import { taskService, authService } from '../services/authService';
import TaskForm from '../components/TaskForm';
import TaskCard from '../components/TaskCard';
import TaskFilters from '../components/TaskFilters';

const DashboardPage = () => {
  const user = useAuthStore((state) => state.user);
  const { tasks, setTasks } = useTaskStore();
  const [isLoading, setIsLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    priority: '',
  });

  useEffect(() => {
    fetchTasks();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [tasks, filters]);

  const fetchTasks = async () => {
    setIsLoading(true);
    try {
      const { tasks: fetchedTasks } = await taskService.getTasks();
      setTasks(fetchedTasks);
    } catch (error) {
      alert('Failed to load tasks');
    } finally {
      setIsLoading(false);
    }
  };

  const applyFilters = () => {
    let result = tasks;

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(
        (task) =>
          task.title.toLowerCase().includes(searchLower) ||
          (task.description && task.description.toLowerCase().includes(searchLower))
      );
    }

    if (filters.status) {
      result = result.filter((task) => task.status === filters.status);
    }

    if (filters.priority) {
      result = result.filter((task) => task.priority === filters.priority);
    }

    setFilteredTasks(result);
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleTaskAdded = () => {
    setShowForm(false);
    setEditingTask(null);
    fetchTasks();
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setShowForm(true);
  };

  const handleCancelEdit = () => {
    setEditingTask(null);
    setShowForm(false);
  };

  const taskStats = {
    total: tasks.length,
    completed: tasks.filter((t) => t.status === 'completed').length,
    inProgress: tasks.filter((t) => t.status === 'in-progress').length,
    todo: tasks.filter((t) => t.status === 'todo').length,
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome Section */}
      <div className="card mb-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Welcome, {user?.name}!
            </h1>
            <p className="text-gray-600">Manage your tasks and boost your productivity</p>
          </div>

          <button
            onClick={() => setShowForm(!showForm)}
            className="btn-primary"
          >
            {showForm ? 'Cancel' : '+ New Task'}
          </button>
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <div className="card">
          <p className="text-gray-600 text-sm">Total Tasks</p>
          <p className="text-3xl font-bold text-blue-600">{taskStats.total}</p>
        </div>
        <div className="card">
          <p className="text-gray-600 text-sm">In Progress</p>
          <p className="text-3xl font-bold text-yellow-600">{taskStats.inProgress}</p>
        </div>
        <div className="card">
          <p className="text-gray-600 text-sm">To Do</p>
          <p className="text-3xl font-bold text-gray-600">{taskStats.todo}</p>
        </div>
        <div className="card">
          <p className="text-gray-600 text-sm">Completed</p>
          <p className="text-3xl font-bold text-green-600">{taskStats.completed}</p>
        </div>
      </div>

      {/* Task Form */}
      {showForm && (
        <div className="mb-8">
          <TaskForm
            task={editingTask}
            onTaskAdded={handleTaskAdded}
            onCancel={handleCancelEdit}
          />
        </div>
      )}

      {/* Filters */}
      <TaskFilters onFilterChange={handleFilterChange} />

      {/* Tasks List */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Tasks</h2>

        {isLoading ? (
          <div className="card text-center py-8">
            <p className="text-gray-600">Loading tasks...</p>
          </div>
        ) : filteredTasks.length === 0 ? (
          <div className="card text-center py-8">
            <p className="text-gray-600">
              {tasks.length === 0
                ? 'No tasks yet. Create one to get started!'
                : 'No tasks match your filters.'}
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredTasks.map((task) => (
              <TaskCard
                key={task._id}
                task={task}
                onEdit={handleEditTask}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
