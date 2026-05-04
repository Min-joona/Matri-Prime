const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: true,
    maxlength: 10000
  },
  type: {
    type: String,
    enum: ['text', 'achievement', 'streak', 'question', 'resource', 'victory'],
    default: 'text'
  },
  image: {
    type: String,
    default: null
  },
  subject: {
    type: String,
    default: null
  },
  privacy: {
    type: String,
    enum: ['public', 'friends', 'private'],
    default: 'public'
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  likes: {
    type: Number,
    default: 0
  },
  likedBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  comments: {
    type: Number,
    default: 0
  },
  shares: {
    type: Number,
    default: 0
  },
  isPinned: {
    type: Boolean,
    default: false
  },
  isModerated: {
    type: Boolean,
    default: false
  }
});

postSchema.index({ userId: 1, timestamp: -1 });
postSchema.index({ timestamp: -1 });
postSchema.index({ type: 1 });
postSchema.index({ isModerated: 1, timestamp: -1 });

module.exports = mongoose.model('Post', postSchema);
