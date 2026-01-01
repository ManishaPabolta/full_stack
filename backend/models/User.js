import mongoose from 'mongoose';
import bcryptjs from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a name'],
      trim: true,
      maxlength: [50, 'Name cannot be more than 50 characters'],
    },
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      unique: true,
      lowercase: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email',
      ],
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false,
    },
    phone: {
      type: String,
      trim: true,
    },
    gender: {
      type: String,
      enum: ['male', 'female', 'other', ''],
      default: '',
    },
    location: {
      type: String,
      trim: true,
    },
    bio: {
      type: String,
      maxlength: [1000, 'Bio cannot be more than 1000 characters'],
    },
    profilePhoto: {
      type: String,
      default: null,
    },
    refreshTokens: [String],
    profile: {
      firstName: {
        type: String,
        trim: true,
        maxlength: [30, 'First name cannot be more than 30 characters'],
      },
      lastName: {
        type: String,
        trim: true,
        maxlength: [30, 'Last name cannot be more than 30 characters'],
      },
      avatar: {
        type: String,
        default: null,
      },
      bio: {
        type: String,
        maxlength: [500, 'Bio cannot be more than 500 characters'],
      },
      phone: {
        type: String,
        match: [
          /^[\d\s\-\+\(\)]+$/,
          'Please provide a valid phone number',
        ],
      },
      location: {
        type: String,
        maxlength: [100, 'Location cannot be more than 100 characters'],
      },
    },
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcryptjs.genSalt(10);
    this.password = await bcryptjs.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare passwords
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcryptjs.compare(enteredPassword, this.password);
};

export default mongoose.model('User', userSchema);
