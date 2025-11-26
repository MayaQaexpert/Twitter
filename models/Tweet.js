import mongoose from 'mongoose';

const TweetSchema = new mongoose.Schema({
  content: {
    type: String,
    required: [true, 'Tweet content is required'],
    maxlength: [280, 'Tweet cannot exceed 280 characters'],
    trim: true
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Tweet must have an author']
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  retweets: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  bookmarks: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  replies: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tweet'
  }],
  replyTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tweet',
    default: null
  },
  media: [{
    type: String,
    url: String
  }],
  isRetweet: {
    type: Boolean,
    default: false
  },
  originalTweet: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tweet',
    default: null
  }
}, {
  timestamps: true
});

// Indexes for better query performance
TweetSchema.index({ author: 1, createdAt: -1 });
TweetSchema.index({ createdAt: -1 });

// Virtual for like count
TweetSchema.virtual('likeCount').get(function() {
  return this.likes ? this.likes.length : 0;
});

// Virtual for retweet count
TweetSchema.virtual('retweetCount').get(function() {
  return this.retweets ? this.retweets.length : 0;
});

// Virtual for reply count
TweetSchema.virtual('replyCount').get(function() {
  return this.replies ? this.replies.length : 0;
});

// Ensure virtuals are included when converting to JSON
TweetSchema.set('toJSON', { virtuals: true });
TweetSchema.set('toObject', { virtuals: true });

export default mongoose.models.Tweet || mongoose.model('Tweet', TweetSchema);
