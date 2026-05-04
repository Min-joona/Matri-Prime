const mongoose = require('mongoose');

const scholarshipSchema = new mongoose.Schema({
  title: { type: String, required: true },
  provider: { type: String, required: true },
  description: { type: String, required: true },
  deadline: { type: String, required: true },
  status: { type: String, enum: ['Open', 'Rolling', 'Closed'], default: 'Open' },
  location: { type: String, enum: ['Domestic', 'International'], default: 'International' },
  level: { type: String, enum: ['High School', 'Undergraduate', 'Graduate'], default: 'Undergraduate' },
  link: { type: String, default: '#' }
}, { timestamps: true });

const opportunitySchema = new mongoose.Schema({
  title: { type: String, required: true },
  type: { type: String, enum: ['Internship', 'Bootcamp', 'Workshop', 'Job'], default: 'Internship' },
  description: { type: String, required: true },
  deadline: { type: String, required: true },
  status: { type: String, default: 'Open' },
  link: { type: String, default: '#' }
}, { timestamps: true });

module.exports = {
  Scholarship: mongoose.model('Scholarship', scholarshipSchema),
  Opportunity: mongoose.model('Opportunity', opportunitySchema)
};
