import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { authService } from '../services/authService';

const Header = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    authService.logout();
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-white shadow">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold text-blue-600">
            TaskApp
          </Link>

          {user ? (
            <div className="flex items-center gap-4">
              <Link to="/dashboard" className="btn-secondary">
                Dashboard
              </Link>

              <Link to="/profile" className="flex items-center">
                {user.profile?.avatar || user.profilePhoto ? (
                  <img
                    src={user.profile?.avatar || user.profilePhoto}
                    alt={user.name}
                    className="w-10 h-10 rounded-full object-cover border-2 border-blue-100"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold">
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                )}
              </Link>
            </div>
          ) : (
            <div className="flex gap-4">
              <Link to="/login" className="btn-secondary">
                Login
              </Link>
              <Link to="/signup" className="btn-primary">
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;
