const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  level: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'], default: 'Beginner' },
  tag: { type: String, default: '' },
  rating: { type: Number, default: 4.5, min: 0, max: 5 },
  students: { type: Number, default: 0 },
  duration: { type: String, default: '8 weeks' },
  isPro: { type: Boolean, default: false },
  image: { type: String, default: '' },
  emoji: { type: String, default: '📚' },
  color: { type: String, default: '#4f46e5' }
}, { timestamps: true });

module.exports = mongoose.model('Course', courseSchema);
