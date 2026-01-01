import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import ProfileForm from '../components/ProfileForm';
import api from '../services/api';

export default function ProfilePage() {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

        const fetchProfile = async () => {
      try {
        setLoading(true);
        setError('');
            const response = await api.get('/user/profile');
        setProfile(response.data.data.user);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load profile');
        console.error('Error fetching profile:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [isAuthenticated, navigate]);

  const handleProfileUpdate = (updatedUser) => {
    setProfile(updatedUser);
    setIsEditing(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <p className="text-red-600 mb-4">{error || 'Failed to load profile'}</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="text-blue-600 hover:text-blue-800"
          >
            Go back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
            <div className="flex gap-2">
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  Edit Profile
                </button>
              )}
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              >
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {/* Profile Content */}
        {isEditing ? (
          <ProfileForm
            user={profile}
            onSuccess={handleProfileUpdate}
            onCancel={() => setIsEditing(false)}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Profile Picture Card */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="text-center">
                {/* Avatar */}
                <div className="mb-4 flex justify-center">
                  {profile.profile?.avatar ? (
                    <img
                      src={profile.profile.avatar}
                      alt={profile.name}
                      className="w-40 h-40 rounded-full object-cover border-4 border-blue-200 shadow-lg"
                    />
                  ) : (
                    <div className="w-40 h-40 rounded-full bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 flex items-center justify-center border-4 border-blue-200 shadow-lg hover:shadow-xl transition">
                      <div className="text-center">
                        <span className="text-6xl text-white font-bold">
                          {profile.name.charAt(0).toUpperCase()}
                        </span>
                        <p className="text-blue-100 text-sm mt-2">Profile</p>
                      </div>
                    </div>
                  )}
                </div>
                
                <h2 className="text-2xl font-bold text-gray-900">
                  {profile.name}
                </h2>
                <p className="text-gray-500 mt-1">{profile.email}</p>
                
                {/* Profile Status Badge */}
                <div className="mt-4 inline-block px-4 py-2 bg-green-100 rounded-full">
                  <p className="text-green-800 text-sm font-semibold">✓ Verified</p>
                </div>
              </div>
            </div>

            {/* Profile Details Card */}
            <div className="bg-white rounded-lg shadow-md p-6 md:col-span-2">
              <h3 className="text-xl font-bold text-gray-900 mb-6">
                📋 Profile Information
              </h3>
              <div className="space-y-4">
                {/* Name */}
                <div className="flex items-start gap-4 pb-4 border-b border-gray-200">
                  <span className="text-2xl">👤</span>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Full Name
                    </label>
                    <p className="text-gray-900 mt-1 font-semibold">{profile.name}</p>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start gap-4 pb-4 border-b border-gray-200">
                  <span className="text-2xl">📧</span>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Email Address
                    </label>
                    <p className="text-gray-900 mt-1">{profile.email}</p>
                  </div>
                </div>

                {/* Phone */}
                {profile.profile?.phone && (
                  <div className="flex items-start gap-4 pb-4 border-b border-gray-200">
                    <span className="text-2xl">📱</span>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Phone Number
                      </label>
                      <p className="text-gray-900 mt-1">{profile.profile.phone}</p>
                    </div>
                  </div>
                )}

                {/* Location */}
                {profile.profile?.location && (
                  <div className="flex items-start gap-4 pb-4 border-b border-gray-200">
                    <span className="text-2xl">📍</span>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Location
                      </label>
                      <p className="text-gray-900 mt-1">
                        {profile.profile.location}
                      </p>
                    </div>
                  </div>
                )}

                {/* Bio */}
                {profile.profile?.bio && (
                  <div className="flex items-start gap-4 pb-4 border-b border-gray-200">
                    <span className="text-2xl">✍️</span>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Bio
                      </label>
                      <p className="text-gray-900 mt-1">{profile.profile.bio}</p>
                    </div>
                  </div>
                )}

                {/* Account Created */}
                <div className="flex items-start gap-4 pt-2">
                  <span className="text-2xl">📅</span>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Member Since
                    </label>
                    <p className="text-gray-900 mt-1">
                      {new Date(profile.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
