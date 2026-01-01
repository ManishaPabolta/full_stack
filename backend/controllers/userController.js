import fs from 'fs';
import path from 'path';
import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import { sendResponse } from '../utils/helpers.js';

// GET /api/user/profile
export const getProfile = async (req, res) => {
  try {
    const userDoc = await User.findById(req.user.id).select('-password -refreshTokens');
    if (!userDoc) return sendResponse(res, 404, false, 'User not found');

    const user = userDoc.toObject();
    // normalize profile shape for frontend compatibility
    user.profile = user.profile || {};
    if (user.profilePhoto) user.profile.avatar = user.profile.avatar || user.profilePhoto;
    if (user.phone) user.profile.phone = user.profile.phone || user.phone;
    if (user.location) user.profile.location = user.profile.location || user.location;
    if (user.bio) user.profile.bio = user.profile.bio || user.bio;

    sendResponse(res, 200, true, 'Profile fetched successfully', { user });
  } catch (error) {
    console.error('Get profile error:', error);
    sendResponse(res, 500, false, 'Server error while fetching profile');
  }
};

// PUT /api/user/profile
// Accepts multipart/form-data with optional file 'profilePhoto' OR JSON body with profile fields and base64 avatar
export const updateProfile = async (req, res) => {
  try {
    const updates = {};

    const { name, email, phone, gender, location, bio } = req.body;

    if (email) {
      const exists = await User.findOne({ email, _id: { $ne: req.user.id } });
      if (exists) return sendResponse(res, 400, false, 'Email already in use');
      updates.email = email;
    }
    if (name) updates.name = name;
    if (phone) updates.phone = phone;
    if (gender) updates.gender = gender;
    if (location) updates.location = location;
    if (bio) updates.bio = bio;

    // Handle uploaded file
    if (req.file) {
      updates.profilePhoto = `/uploads/${req.file.filename}`;
    }

    // Handle base64 avatar in req.body.profile.avatar
    if (!req.file && req.body.profile) {
      try {
        const parsed = typeof req.body.profile === 'string' ? JSON.parse(req.body.profile) : req.body.profile;
        if (parsed.avatar && typeof parsed.avatar === 'string' && parsed.avatar.startsWith('data:')) {
          const matches = parsed.avatar.match(/^data:(image\/\w+);base64,(.+)$/);
          if (matches) {
            const ext = matches[1].split('/')[1];
            const buffer = Buffer.from(matches[2], 'base64');
            const uploadsDir = path.join(process.cwd(), 'uploads');
            if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir);
            const filename = `profile_${Date.now()}.${ext}`;
            fs.writeFileSync(path.join(uploadsDir, filename), buffer);
            updates.profilePhoto = `/uploads/${filename}`;
          }
        }
      } catch (e) {
        // ignore parse errors
      }
    }

    const userDoc = await User.findByIdAndUpdate(req.user.id, updates, { new: true, runValidators: true }).select('-password -refreshTokens');
    if (!userDoc) return sendResponse(res, 404, false, 'User not found');
    const user = userDoc.toObject();
    user.profile = user.profile || {};
    if (user.profilePhoto) user.profile.avatar = user.profile.avatar || user.profilePhoto;
    if (user.phone) user.profile.phone = user.profile.phone || user.phone;
    if (user.location) user.profile.location = user.profile.location || user.location;
    if (user.bio) user.profile.bio = user.profile.bio || user.bio;
    sendResponse(res, 200, true, 'Profile updated successfully', { user });
  } catch (error) {
    console.error('Update profile error:', error);
    sendResponse(res, 500, false, 'Server error while updating profile');
  }
};

// PUT /api/user/change-password
export const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword) return sendResponse(res, 400, false, 'Please provide old and new passwords');

    const user = await User.findById(req.user.id).select('+password');
    if (!user) return sendResponse(res, 404, false, 'User not found');

    const isMatch = await user.matchPassword(oldPassword);
    if (!isMatch) return sendResponse(res, 401, false, 'Old password is incorrect');

    user.password = newPassword;
    await user.save();

    sendResponse(res, 200, true, 'Password changed successfully');
  } catch (error) {
    console.error('Change password error:', error);
    sendResponse(res, 500, false, 'Server error while changing password');
  }
};
