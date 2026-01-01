import React, { useState } from 'react';

const TaskFilters = ({ onFilterChange }) => {
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    priority: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    const newFilters = {
      ...filters,
      [name]: value,
    };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleReset = () => {
    const emptyFilters = {
      search: '',
      status: '',
      priority: '',
    };
    setFilters(emptyFilters);
    onFilterChange(emptyFilters);
  };

  return (
    <div className="card mb-6">
      <h3 className="text-lg font-bold mb-4">Filters</h3>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label className="block text-gray-700 font-medium mb-2">Search</label>
          <input
            type="text"
            name="search"
            value={filters.search}
            onChange={handleChange}
            placeholder="Search tasks..."
            className="input-field"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-2">Status</label>
          <select
            name="status"
            value={filters.status}
            onChange={handleChange}
            className="input-field"
          >
            <option value="">All Statuses</option>
            <option value="todo">To Do</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-2">Priority</label>
          <select
            name="priority"
            value={filters.priority}
            onChange={handleChange}
            className="input-field"
          >
            <option value="">All Priorities</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        <div className="flex items-end">
          <button
            onClick={handleReset}
            className="btn-secondary w-full"
          >
            Reset Filters
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskFilters;
