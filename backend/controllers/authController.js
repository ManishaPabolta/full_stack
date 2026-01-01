import fs from 'fs';
import path from 'path';
import User from '../models/User.js';
import { generateAccessToken, generateRefreshToken, sendResponse } from '../utils/helpers.js';

export const signup = async (req, res) => {
  try {
    const { name, email, password, phone, gender, location, bio, profile } = req.body;
    // profile may contain avatar base64

    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return sendResponse(res, 400, false, 'User already exists with that email');
    }

    // Create new user
    user = new User({
      name,
      email,
      password,
      phone,
      gender,
      location,
      bio,
    });

    // If profile.avatar is a data URL, save it to uploads
    if (profile && profile.avatar && typeof profile.avatar === 'string' && profile.avatar.startsWith('data:')) {
      const matches = profile.avatar.match(/^data:(image\/\w+);base64,(.+)$/);
      if (matches) {
        const ext = matches[1].split('/')[1];
        const data = matches[2];
        const buffer = Buffer.from(data, 'base64');
        const uploadsDir = path.join(process.cwd(), 'uploads');
        if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir);
        const filename = `profile_${Date.now()}.${ext}`;
        const filepath = path.join(uploadsDir, filename);
        fs.writeFileSync(filepath, buffer);
        user.profilePhoto = `/uploads/${filename}`;
      }
    }

    await user.save();

    // Generate tokens
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    // Save refresh token
    user.refreshTokens = user.refreshTokens || [];
    user.refreshTokens.push(refreshToken);
    await user.save();

    // Return response without password
    const userObj = user.toObject ? user.toObject() : user;
    const userResponse = {
      _id: userObj._id,
      name: userObj.name,
      email: userObj.email,
      phone: userObj.phone,
      gender: userObj.gender,
      location: userObj.location,
      bio: userObj.bio,
      profilePhoto: userObj.profilePhoto,
      profile: userObj.profile || {},
    };

    sendResponse(res, 201, true, 'User registered successfully', {
      user: userResponse,
      accessToken,
      refreshToken,
    });
  } catch (error) {
    console.error('Signup error:', error);
    sendResponse(res, 500, false, 'Server error during signup');
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate email & password
    if (!email || !password) {
      return sendResponse(res, 400, false, 'Please provide an email and password');
    }

    // Check for user
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return sendResponse(res, 401, false, 'Invalid email or password');
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return sendResponse(res, 401, false, 'Invalid email or password');
    }

    // Generate access + refresh tokens
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    user.refreshTokens = user.refreshTokens || [];
    user.refreshTokens.push(refreshToken);
    await user.save();

    // Return response
    const userObj = user.toObject ? user.toObject() : user;
    const userResponse = {
      _id: userObj._id,
      name: userObj.name,
      email: userObj.email,
      phone: userObj.phone,
      gender: userObj.gender,
      location: userObj.location,
      bio: userObj.bio,
      profilePhoto: userObj.profilePhoto,
      profile: userObj.profile || {},
    };

    sendResponse(res, 200, true, 'Login successful', {
      user: userResponse,
      accessToken,
      refreshToken,
    });
  } catch (error) {
    console.error('Login error:', error);
    sendResponse(res, 500, false, 'Server error during login');
  }
};

export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return sendResponse(res, 404, false, 'User not found');
    }

    sendResponse(res, 200, true, 'Profile fetched successfully', { user });
  } catch (error) {
    console.error('Get profile error:', error);
    sendResponse(res, 500, false, 'Server error while fetching profile');
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { name, email, profile } = req.body;

    // Check if email is already in use
    if (email) {
      const existingUser = await User.findOne({ email, _id: { $ne: req.user.id } });
      if (existingUser) {
        return sendResponse(res, 400, false, 'Email already in use');
      }
    }

    const updateData = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (profile) updateData.profile = profile;

    const user = await User.findByIdAndUpdate(req.user.id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!user) {
      return sendResponse(res, 404, false, 'User not found');
    }

    sendResponse(res, 200, true, 'Profile updated successfully', { user });
  } catch (error) {
    console.error('Update profile error:', error);
    sendResponse(res, 500, false, 'Server error while updating profile');
  }
};

export const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) return sendResponse(res, 400, false, 'Refresh token required');

    // Verify token
    try {
      const decoded = await new Promise((resolve, reject) => {
        const jwt = require('jsonwebtoken');
        jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET, (err, decoded) => {
          if (err) return reject(err);
          resolve(decoded);
        });
      });

      const user = await User.findById(decoded.id);
      if (!user) return sendResponse(res, 404, false, 'User not found');

      // Ensure refresh token is stored
      if (!user.refreshTokens || !user.refreshTokens.includes(refreshToken)) {
        return sendResponse(res, 401, false, 'Invalid refresh token');
      }

      const accessToken = generateAccessToken(user._id);
      sendResponse(res, 200, true, 'Token refreshed', { accessToken });
    } catch (err) {
      return sendResponse(res, 401, false, 'Invalid refresh token');
    }
  } catch (error) {
    console.error('Refresh token error:', error);
    sendResponse(res, 500, false, 'Server error during token refresh');
  }
};

export const logout = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) return sendResponse(res, 400, false, 'Refresh token required');

    try {
      const jwt = require('jsonwebtoken');
      const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET);
      const user = await User.findById(decoded.id);
      if (user && user.refreshTokens) {
        user.refreshTokens = user.refreshTokens.filter((t) => t !== refreshToken);
        await user.save();
      }
    } catch (e) {
      // ignore
    }

    // clear client side tokens handled on frontend
    sendResponse(res, 200, true, 'Logged out');
  } catch (error) {
    console.error('Logout error:', error);
    sendResponse(res, 500, false, 'Server error during logout');
  }
};
