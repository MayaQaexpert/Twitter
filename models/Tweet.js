import mongoose from 'mongoose';

const TweetSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  body: {
    type: String,
    required: [true, 'Tweet content is required'],
    maxlength: 280,
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  retweets: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  bookmarks: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  replies: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tweet',
  }],
  isReply: {
    type: Boolean,
    default: false,
  },
  replyTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tweet',
    default: null,
  },
  media: [{
    type: String,
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
TweetSchema.pre('save', function() {
  this.updatedAt = Date.now();
});

export default mongoose.models.Tweet || mongoose.model('Tweet', TweetSchema);
