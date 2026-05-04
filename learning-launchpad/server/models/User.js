const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  phone: { type: String, default: '' },
  password: { type: String, required: true },
  avatar: { type: String, default: '' },
  points: { type: Number, default: 0 },
  streak: { type: Number, default: 0 },
  lastActivity: { type: Date, default: Date.now },
  coursesCompleted: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
  enrolledCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
  badges: [{ name: String, icon: String, earnedAt: Date }],
  recentActivity: [{
    icon: String,
    description: String,
    timeAgo: String,
    createdAt: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.toJSON = function() {
  const user = this.toObject();
  delete user.password;
  return user;
};

module.exports = mongoose.model('User', userSchema);
