import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a name'],
    },
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      select: false, // Don't return password by default
    },
    username: {
      type: String,
      unique: true,
      sparse: true, // Allows null values
    },
    image: {
      type: String,
      default: null,
    },
    bio: {
      type: String,
      default: '',
    },
    location: {
      type: String,
      default: '',
    },
    website: {
      type: String,
      default: '',
    },
    coverImage: {
      type: String,
      default: null,
    },
    followers: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    }],
    following: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    }],
    emailVerified: {
      type: Date,
      default: null,
    },
    provider: {
      type: String,
      enum: ['credentials', 'google', 'github'],
      default: 'credentials',
    },
    providerId: {
      type: String,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt
  }
);

// Generate username from email if not provided
UserSchema.pre('save', function () {
  if (!this.username && this.email) {
    this.username = this.email.split('@')[0] + Math.random().toString(36).substring(2, 6);
  }
});

export default mongoose.models.User || mongoose.model('User', UserSchema);
