import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/authService';
import { useAuthStore } from '../store/authStore';

const SignupForm = () => {
  const navigate = useNavigate();
  const setUser = useAuthStore((state) => state.setUser);
  const setToken = useAuthStore((state) => state.setToken);
  const loginStore = useAuthStore((state) => state.login);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    profile: {
      firstName: '',
      lastName: '',
      phone: '',
      location: '',
      bio: '',
    },
  });

  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name.startsWith('profile.')) {
      const profileField = name.replace('profile.', '');
      setFormData((prev) => ({
        ...prev,
        profile: {
          ...prev.profile,
          [profileField]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);

    try {
      const { confirmPassword, ...signupData } = formData;
      const response = await authService.signup(signupData);
      const { accessToken, refreshToken, user } = response.data.data || {};

      await loginStore(user, accessToken);

      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="card w-full max-w-md">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-900">Sign Up</h2>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="input-field"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="input-field"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="input-field"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-2">
              Confirm Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="input-field"
              required
            />
          </div>

          {/* Profile Details Section */}
          <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h3 className="font-semibold text-gray-900 mb-4">Profile Details (Optional)</h3>
            
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <label className="block text-gray-700 font-medium mb-1 text-sm">
                  First Name
                </label>
                <input
                  type="text"
                  name="profile.firstName"
                  value={formData.profile.firstName}
                  onChange={handleChange}
                  className="input-field text-sm"
                  placeholder="John"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-1 text-sm">
                  Last Name
                </label>
                <input
                  type="text"
                  name="profile.lastName"
                  value={formData.profile.lastName}
                  onChange={handleChange}
                  className="input-field text-sm"
                  placeholder="Doe"
                />
              </div>
            </div>

            <div className="mb-3">
              <label className="block text-gray-700 font-medium mb-1 text-sm">
                Phone Number
              </label>
              <input
                type="tel"
                name="profile.phone"
                value={formData.profile.phone}
                onChange={handleChange}
                className="input-field text-sm"
                placeholder="+1 (555) 123-4567"
              />
            </div>

            <div className="mb-3">
              <label className="block text-gray-700 font-medium mb-1 text-sm">
                Location
              </label>
              <input
                type="text"
                name="profile.location"
                value={formData.profile.location}
                onChange={handleChange}
                className="input-field text-sm"
                placeholder="City, Country"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1 text-sm">
                Bio
              </label>
              <textarea
                name="profile.bio"
                value={formData.profile.bio}
                onChange={handleChange}
                className="input-field text-sm"
                rows="2"
                placeholder="Tell us about yourself..."
                maxLength="200"
              />
              <p className="text-xs text-gray-500 mt-1">
                {formData.profile.bio.length}/200 characters
              </p>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary w-full disabled:opacity-50"
          >
            {isLoading ? 'Creating account...' : 'Sign Up'}
          </button>
        </form>

        <p className="text-center mt-4 text-gray-700">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-600 hover:underline font-medium">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignupForm;
