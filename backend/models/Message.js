const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  from: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  to: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  message: {
    type: String,
    required: true,
    maxlength: 2000
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  read: {
    type: Boolean,
    default: false
  },
  readAt: {
    type: Date,
    default: null
  },
  isSystem: {
    type: Boolean,
    default: false
  },
  conversationId: {
    type: String,
    index: true
  }
});

// Create conversation ID before saving
messageSchema.pre('save', function(next) {
  if (!this.conversationId) {
    const ids = [this.from.toString(), this.to.toString()].sort().join('-');
    this.conversationId = ids;
  }
  next();
});

messageSchema.index({ conversationId: 1, timestamp: -1 });
messageSchema.index({ from: 1, timestamp: -1 });
messageSchema.index({ to: 1, read: 1 });

module.exports = mongoose.model('Message', messageSchema);
