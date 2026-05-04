const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  firebaseUid: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  displayName: {
    type: String,
    required: true
  },
  photoURL: {
    type: String,
    default: null
  },
  phoneNumber: {
    type: String,
    default: null
  },
  
  // Gamification
  xp: {
    type: Number,
    default: 0
  },
  level: {
    type: Number,
    default: 1
  },
  streak: {
    type: Number,
    default: 0
  },
  lastActivityDate: {
    type: Date,
    default: null
  },
  totalStudyTime: {
    type: Number,
    default: 0
  },
  totalQuestions: {
    type: Number,
    default: 0
  },
  averageScore: {
    type: Number,
    default: 0
  },
  primeCoins: {
    type: Number,
    default: 0
  },
  
  // Badges & Achievements
  badges: [{
    id: String,
    name: String,
    description: String,
    unlockedAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  // League
  league: {
    type: String,
    enum: ['Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond'],
    default: 'Bronze'
  },
  weeklyXP: {
    type: Number,
    default: 0
  },
  
  // Profile
  bio: {
    type: String,
    default: ''
  },
  school: {
    type: String,
    default: ''
  },
  grade: {
    type: String,
    enum: ['9', '10', '11', '12', 'university'],
    default: '10'
  },
  subjects: [{
    type: String
  }],
  
  // Settings
  settings: {
    notifications: {
      type: Boolean,
      default: true
    },
    darkMode: {
      type: Boolean,
      default: true
    },
    language: {
      type: String,
      enum: ['en', 'am'],
      default: 'en'
    }
  },
  
  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update timestamp
userSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Calculate level based on XP
userSchema.pre('save', function(next) {
  if (this.isModified('xp')) {
    this.level = Math.floor(Math.sqrt(this.xp / 100)) + 1;
  }
  next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;
