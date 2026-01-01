import api from './api';

export const authService = {
  signup: async (data) => {
    const response = await api.post('/auth/signup', data);
    const { accessToken, refreshToken, user } = response.data.data;
    localStorage.setItem('token', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('user', JSON.stringify(user));
    return response;
  },

  login: async (data) => {
    const response = await api.post('/auth/login', data);
    const { accessToken, refreshToken, user } = response.data.data;
    localStorage.setItem('token', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('user', JSON.stringify(user));
    return response;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getProfile: async () => {
    const response = await api.get('/user/profile');
    return response.data.data;
  },

  updateProfile: async (data) => {
    // If data contains profilePhoto as File, send multipart
    let response;
    if (data instanceof FormData) {
      response = await api.put('/user/profile', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    } else {
      response = await api.put('/user/profile', data);
    }
    const { user } = response.data.data;
    localStorage.setItem('user', JSON.stringify(user));
    return response.data.data;
  },

  changePassword: async (payload) => {
    const response = await api.put('/user/change-password', payload);
    return response.data;
  },
};

export const taskService = {
  createTask: async (data) => {
    const response = await api.post('/tasks', data);
    return response.data.data.task;
  },

  getTasks: async (params = {}) => {
    const response = await api.get('/tasks', { params });
    return response.data.data;
  },

  getTaskById: async (id) => {
    const response = await api.get(`/tasks/${id}`);
    return response.data.data.task;
  },

  updateTask: async (id, data) => {
    const response = await api.put(`/tasks/${id}`, data);
    return response.data.data.task;
  },

  deleteTask: async (id) => {
    const response = await api.delete(`/tasks/${id}`);
    return response.data;
  },
};
