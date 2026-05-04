const express = require('express');
const router = express.Router();
const Course = require('../models/Course');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

// GET /api/courses
router.get('/', async (req, res) => {
  try {
    const courses = await Course.find();
    res.json(courses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/courses/seed - seed default courses
router.post('/seed', async (req, res) => {
  try {
    await Course.deleteMany();
    const courses = [
      { title: 'Ethiopian SAT Preparation', description: 'Comprehensive preparation for the Ethiopian Scholastic Assessment Test with practice questions, strategies, and more.', category: 'Test Prep', level: 'Intermediate', tag: 'PRO', rating: 4.9, students: 2500, duration: '12 weeks', isPro: true, emoji: '🎯', color: '#7c3aed' },
      { title: 'Advanced Mathematics', description: 'Master calculus, algebra, and statistical analysis for high school and university level mathematics.', category: 'Mathematics', level: 'Advanced', rating: 4.8, students: 1800, duration: '16 weeks', emoji: 'π', color: '#2563eb' },
      { title: 'General Physics Fundamentals', description: 'Explore mechanics, thermodynamics, and electromagnetism with interactive simulations and experiments.', category: 'Science', level: 'Beginner', rating: 4.7, students: 3200, duration: '14 weeks', emoji: '⚛️', color: '#0891b2' },
      { title: 'English Communication Skills', description: 'Improve your English proficiency with grammar, writing, and conversational practice.', category: 'Language', level: 'Intermediate', rating: 4.6, students: 4100, duration: '10 weeks', emoji: '📝', color: '#059669' },
      { title: 'Chemistry Lab & Theory', description: 'From basic atomic structure to complex organic reactions, master essential chemistry concepts.', category: 'Science', level: 'Intermediate', rating: 4.8, students: 1900, duration: '18 weeks', emoji: '⚗️', color: '#d97706' },
      { title: 'Critical Thinking & Logic', description: 'Develop analytical reasoning skills essential for university studies and real-world problem-solving.', category: 'Philosophy', level: 'Beginner', rating: 4.9, students: 2800, duration: '8 weeks', emoji: '🧠', color: '#dc2626' },
      { title: 'Biology - Life Sciences', description: 'Learn about life, from cellular structures to ecosystems.', category: 'Science', level: 'Beginner', rating: 4.7, students: 2200, duration: '12 weeks', emoji: '🦠', color: '#16a34a' },
      { title: 'Introduction to Economics', description: 'Learn the basic concepts of how economies and markets work.', category: 'Economics', level: 'Beginner', rating: 4.5, students: 1500, duration: '10 weeks', emoji: '💹', color: '#9333ea' },
      { title: 'Ethiopian Geography & the Horn', description: 'Study the unique geography and cultural landscapes of Ethiopia and the Horn of Africa.', category: 'Geography', level: 'Beginner', rating: 4.6, students: 1200, duration: '8 weeks', emoji: '🌍', color: '#0d9488' },
      { title: 'General Psychology', description: 'Examine the science of mind and behavior.', category: 'Psychology', level: 'Beginner', rating: 4.7, students: 1800, duration: '12 weeks', emoji: '🧩', color: '#e11d48' },
      { title: 'Moral & Civic Education', description: 'Cultivate a strong understanding of ethics, rights, and responsibilities.', category: 'Civics', level: 'Beginner', rating: 4.5, students: 900, duration: '8 weeks', emoji: '⚖️', color: '#b45309' },
      { title: 'Entrepreneurship', description: 'Learn the skills and mindset needed to start and grow a business.', category: 'Business', level: 'Intermediate', rating: 4.8, students: 2100, duration: '10 weeks', emoji: '🚀', color: '#7c3aed' },
      { title: 'Communicative English', description: 'Enhance your speaking and writing skills for daily and professional use.', category: 'Language', level: 'Beginner', rating: 4.6, students: 3500, duration: '8 weeks', emoji: '💬', color: '#0369a1' },
      { title: 'Mathematics for Natural Science', description: 'Apply mathematical principles to solve complex scientific problems.', category: 'Mathematics', level: 'Intermediate', rating: 4.7, students: 1400, duration: '14 weeks', emoji: '∑', color: '#4f46e5' },
      { title: 'Introduction to Emerging Technology', description: 'Get a foundational understanding of the latest technological advancements.', category: 'Technology', level: 'Beginner', rating: 4.8, students: 2600, duration: '10 weeks', emoji: '💡', color: '#0f766e' }
    ];
    const created = await Course.insertMany(courses);
    res.json({ message: `Seeded ${created.length} courses`, courses: created });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/courses/:id/enroll
router.post('/:id/enroll', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user.enrolledCourses.includes(req.params.id)) {
      user.enrolledCourses.push(req.params.id);
      user.points += 50;
      user.recentActivity.unshift({ icon: '📚', description: `Enrolled in a new course`, timeAgo: 'Just now' });
      await user.save();
      await Course.findByIdAndUpdate(req.params.id, { $inc: { students: 1 } });
    }
    res.json({ message: 'Enrolled successfully', user: user.toJSON() });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
