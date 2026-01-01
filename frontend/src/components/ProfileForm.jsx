import { useState } from 'react';
import api from '../services/api';

export default function ProfileForm({ user, onSuccess, onCancel }) {
  const [formData, setFormData] = useState({
    name: user.name || '',
    email: user.email || '',
    profile: {
      firstName: user.profile?.firstName || '',
      lastName: user.profile?.lastName || '',
      avatar: user.profile?.avatar || '',
      bio: user.profile?.bio || '',
      phone: user.profile?.phone || '',
      location: user.profile?.location || '',
    },
  });

  const [imagePreview, setImagePreview] = useState(user.profile?.avatar || null);
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('profile.')) {
      const profileField = name.replace('profile.', '');
      setFormData((prev) => ({
        ...prev,
        profile: { ...prev.profile, [profileField]: value },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size should not exceed 5MB');
        return;
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Please upload a valid image file');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setFormData((prev) => ({
          ...prev,
          profile: { ...prev.profile, avatar: reader.result },
        }));
        setImageFile(file);
        setError('');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');
      setSuccess('');

      // Validate name
      if (!formData.name.trim()) {
        setError('Name is required');
        setLoading(false);
        return;
      }

      // Validate email
      if (!formData.email.trim()) {
        setError('Email is required');
        setLoading(false);
        return;
      }

      // If a real file was selected, send multipart form data
      let response;
      if (imageFile) {
        const fd = new FormData();
        fd.append('name', formData.name);
        fd.append('email', formData.email);
        fd.append('phone', formData.profile.phone || '');
        fd.append('location', formData.profile.location || '');
        fd.append('bio', formData.profile.bio || '');
        fd.append('profile', JSON.stringify(formData.profile));
        fd.append('profilePhoto', imageFile);
        response = await api.put('/user/profile', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      } else {
        response = await api.put('/user/profile', formData);
      }
      setSuccess('Profile updated successfully!');
      setTimeout(() => {
        onSuccess(response.data.data.user);
      }, 1000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
      console.error('Error updating profile:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Edit Profile</h2>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
          <p className="text-green-600">{success}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Profile Picture Section */}
        <div className="border-b border-gray-200 pb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Profile Picture
          </h3>
          <div className="flex items-center gap-6">
            <div className="flex-shrink-0">
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-24 h-24 rounded-full object-cover"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                  <span className="text-3xl text-white font-bold">
                    {formData.name.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
            </div>
            <div className="flex-1">
              <label className="block">
                <span className="sr-only">Choose profile photo</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-lg file:border-0
                    file:text-sm file:font-semibold
                    file:bg-blue-50 file:text-blue-700
                    hover:file:bg-blue-100"
                />
              </label>
              <p className="text-sm text-gray-500 mt-2">
                PNG, JPG, GIF up to 5MB
              </p>
            </div>
          </div>
        </div>

        {/* Basic Information */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Basic Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>
        </div>

        {/* Additional Details */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Additional Details
          </h3>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  First Name
                </label>
                <input
                  type="text"
                  name="profile.firstName"
                  value={formData.profile.firstName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="John"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name
                </label>
                <input
                  type="text"
                  name="profile.lastName"
                  value={formData.profile.lastName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Doe"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                name="profile.phone"
                value={formData.profile.phone}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="+1 (555) 123-4567"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Location
              </label>
              <input
                type="text"
                name="profile.location"
                value={formData.profile.location}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="City, Country"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bio
              </label>
              <textarea
                name="profile.bio"
                value={formData.profile.bio}
                onChange={handleInputChange}
                rows="4"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Tell us about yourself..."
                maxLength="500"
              />
              <p className="text-sm text-gray-500 mt-1">
                {formData.profile.bio.length}/500 characters
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 pt-6 border-t border-gray-200">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="flex-1 px-4 py-2 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
        </div>

        {/* Change Password */}
        <div className="mt-6 bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">Change Password</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Old Password</label>
              <input
                type="password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                className="input-field"
                placeholder="Current password"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="input-field"
                placeholder="New password"
              />
            </div>
          </div>
          <div className="flex gap-4">
            <button
              onClick={async () => {
                try {
                  setError('');
                  setLoading(true);
                  if (!oldPassword || !newPassword) {
                    setError('Please fill both fields');
                    setLoading(false);
                    return;
                  }
                  const res = await import('../services/authService').then((m) => m.authService.changePassword({ oldPassword, newPassword }));
                  setSuccess(res.data?.message || 'Password changed');
                  setOldPassword('');
                  setNewPassword('');
                } catch (err) {
                  setError(err.response?.data?.message || 'Failed to change password');
                } finally {
                  setLoading(false);
                }
              }}
              className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700"
            >
              Change Password
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
