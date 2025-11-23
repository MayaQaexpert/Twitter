import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: function() {
      return !this.provider; // Password required only for email auth
    },
  },
  username: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true,
  },
  image: {
    type: String,
    default: null,
  },
  bio: {
    type: String,
    default: '',
    maxlength: 160,
  },
  location: {
    type: String,
    default: '',
  },
  website: {
    type: String,
    default: '',
  },
  provider: {
    type: String,
    enum: ['email', 'google', 'github'],
    default: 'email',
  },
  followers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  following: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update the updatedAt timestamp before saving
UserSchema.pre('save', function() {
  this.updatedAt = Date.now();
  
  // Generate username if not provided
  if (!this.username && this.email) {
    this.username = this.email.split('@')[0].toLowerCase();
  }
});

export default mongoose.models.User || mongoose.model('User', UserSchema);
