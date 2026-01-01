import { useAuthStore } from '../store/authStore';

export const useAuth = () => {
  const store = useAuthStore();
  return {
    ...store,
    // provide a boolean `isAuthenticated` so components can destructure it
    isAuthenticated: !!store.token,
  };
};

export const isAuthenticated = () => {
  return !!localStorage.getItem('token');
};
