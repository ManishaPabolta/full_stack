import { create } from 'zustand';

export const useAuthStore = create((set) => ({
  user: JSON.parse(localStorage.getItem('user')) || null,
  token: localStorage.getItem('token') || null,
  isLoading: false,
  error: null,

  setUser: (user) => {
    set({ user });
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  },
  
  setToken: (token) => {
    set({ token });
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  },
  
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),

  login: async (user, token) => {
    set({ user, token, error: null });
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    }
    if (token) {
      localStorage.setItem('token', token);
    }
  },

  logout: () => {
    set({ user: null, token: null, error: null });
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  },
}));

export const useTaskStore = create((set) => ({
  tasks: [],
  isLoading: false,
  error: null,

  setTasks: (tasks) => set({ tasks }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),

  addTask: (task) => set((state) => ({ tasks: [task, ...state.tasks] })),

  updateTask: (id, updatedTask) =>
    set((state) => ({
      tasks: state.tasks.map((task) => (task._id === id ? updatedTask : task)),
    })),

  deleteTask: (id) =>
    set((state) => ({
      tasks: state.tasks.filter((task) => task._id !== id),
    })),
}));
