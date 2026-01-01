import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

const HomePage = () => {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);

  React.useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
      <div className="text-center">
        <h1 className="text-5xl font-bold text-gray-900 mb-4">Welcome to TaskApp</h1>
        <p className="text-xl text-gray-700 mb-8">
          Manage your tasks efficiently with our simple and powerful task management app
        </p>

        <div className="flex gap-4 justify-center">
          <button
            onClick={() => navigate('/login')}
            className="btn-primary text-lg px-8 py-3"
          >
            Login
          </button>
          <button
            onClick={() => navigate('/signup')}
            className="bg-green-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors text-lg"
          >
            Get Started
          </button>
        </div>

        <div className="mt-16 grid grid-cols-3 gap-8 max-w-3xl">
          <div className="card">
            <div className="text-4xl mb-2">📝</div>
            <h3 className="text-lg font-bold">Create Tasks</h3>
            <p className="text-gray-600 text-sm mt-2">
              Create tasks with priorities and due dates
            </p>
          </div>

          <div className="card">
            <div className="text-4xl mb-2">🔍</div>
            <h3 className="text-lg font-bold">Track Progress</h3>
            <p className="text-gray-600 text-sm mt-2">
              Monitor your tasks and stay organized
            </p>
          </div>

          <div className="card">
            <div className="text-4xl mb-2">✅</div>
            <h3 className="text-lg font-bold">Get Things Done</h3>
            <p className="text-gray-600 text-sm mt-2">
              Complete your goals and celebrate wins
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
