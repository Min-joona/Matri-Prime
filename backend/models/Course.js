const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['notes', 'video', 'flashcards', 'quiz'],
    required: true
  },
  duration: {
    type: Number,
    default: 0
  },
  xpReward: {
    type: Number,
    default: 10
  },
  content: {
    type: String,
    default: ''
  },
  videoUrl: {
    type: String,
    default: ''
  },
  completed: {
    type: Boolean,
    default: false
  },
  locked: {
    type: Boolean,
    default: true
  }
});

const unitSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  order: {
    type: Number,
    required: true
  },
  lessons: [lessonSchema]
});

const courseSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  subject: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  gradeLevels: [{
    type: String
  }],
  icon: {
    type: String,
    default: 'BookOpen'
  },
  color: {
    type: String,
    default: 'primary'
  },
  gradient: {
    type: String,
    default: 'bg-gradient-to-br from-primary/20 to-blue-500/10'
  },
  totalUnits: {
    type: Number,
    default: 0
  },
  totalLessons: {
    type: Number,
    default: 0
  },
  enrolled: {
    type: Number,
    default: 0
  },
  rating: {
    type: Number,
    default: 4.5,
    min: 0,
    max: 5
  },
  units: [unitSchema],
  
  // Metadata
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  isActive: {
    type: Boolean,
    default: true
  }
});

courseSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  this.totalUnits = this.units.length;
  this.totalLessons = this.units.reduce((acc, unit) => acc + unit.lessons.length, 0);
  next();
});

const Course = mongoose.model('Course', courseSchema);

module.exports = Course;
