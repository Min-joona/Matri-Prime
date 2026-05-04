const express = require('express');
const scholarshipRouter = express.Router();
const opportunityRouter = express.Router();
const { Scholarship, Opportunity } = require('../models/ScholarshipOpportunity');

// ---- SCHOLARSHIPS ----
scholarshipRouter.get('/', async (req, res) => {
  try {
    let query = {};
    if (req.query.status) query.status = req.query.status;
    if (req.query.location) query.location = req.query.location;
    if (req.query.level) query.level = req.query.level;
    const scholarships = await Scholarship.find(query);
    res.json(scholarships);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

scholarshipRouter.post('/seed', async (req, res) => {
  try {
    await Scholarship.deleteMany();
    const data = [
      { title: 'NSHSS Foundation Business & Public Policy Scholarship 2025', provider: 'NSHSS Scholarships', description: 'This scholarship supports students pursuing degrees in business, finance, economics, or public policy, encouraging those who are passionate about making a positive impact in these fields.', deadline: 'Sep 23, 2025', status: 'Open', location: 'International', level: 'High School' },
      { title: 'Sweden Fully Funded Scholarships 2025 in Top Swedish Universities', provider: 'Top Swedish Universities', description: 'Thousands of Fully Funded Scholarships for international students for Short Courses, Undergraduate, Masters & Ph.D. degree programs.', deadline: 'Different Deadlines', status: 'Rolling', location: 'International', level: 'Graduate' },
      { title: 'Czech Government Scholarships 2026-27 | Study in Europe', provider: 'Government of the Czech Republic', description: 'Scholarships for Bachelor\'s, Master\'s, and PhD programs. 100% tuition covered, monthly stipend, free language courses, standard medical care, and visa support.', deadline: '30 September 2025', status: 'Open', location: 'International', level: 'Graduate' }
    ];
    const created = await Scholarship.insertMany(data);
    res.json({ message: `Seeded ${created.length} scholarships` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ---- OPPORTUNITIES ----
opportunityRouter.get('/', async (req, res) => {
  try {
    const opportunities = await Opportunity.find();
    res.json(opportunities);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

opportunityRouter.post('/seed', async (req, res) => {
  try {
    await Opportunity.deleteMany();
    const data = [
      { title: 'Software Development Internship', type: 'Internship', description: 'A paid internship with a leading tech company in Addis Ababa, focusing on web and mobile development.', deadline: 'Nov 30, 2024', status: 'Open' },
      { title: 'GeezX AI Bootcamp 2025', type: 'Bootcamp', description: 'A 4-day immersive program designed to introduce learners to the world of AI through interactive and practical sessions. Brought to you by GeezX in partnership with Hammerspacecraft and AbugidaByte.', deadline: 'Application Open', status: 'Open' },
      { title: 'AI & Machine Learning Workshop', type: 'Workshop', description: 'Learn the fundamentals of artificial intelligence in a hands-on workshop led by industry experts.', deadline: 'Dec 10, 2025', status: 'Open' }
    ];
    const created = await Opportunity.insertMany(data);
    res.json({ message: `Seeded ${created.length} opportunities` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = { scholarshipRouter, opportunityRouter };
