const express = require('express');
const Course = require('../models/Course');
const { auth } = require('./auth');
const router = express.Router();

// Get all courses
router.get('/', async (req, res) => {
  try {
    const courses = await Course.find({ isActive: true })
      .select('-units')
      .sort({ enrolled: -1 });
    
    res.json({
      success: true,
      courses,
      count: courses.length
    });
  } catch (error) {
    console.error('Courses fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch courses' });
  }
});

// Get course by ID
router.get('/:id', async (req, res) => {
  try {
    const course = await Course.findOne({ id: req.params.id });
    
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }
    
    res.json({
      success: true,
      course
    });
  } catch (error) {
    console.error('Course fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch course' });
  }
});

// Mark lesson as completed
router.post('/:courseId/unit/:unitId/lesson/:lessonId/complete', auth, async (req, res) => {
  try {
    const { courseId, unitId, lessonId } = req.params;
    
    // Update user progress (in real app, you'd have UserProgress model)
    res.json({
      success: true,
      message: 'Lesson marked as completed',
      xpEarned: 50
    });
  } catch (error) {
    console.error('Lesson completion error:', error);
    res.status(500).json({ error: 'Failed to mark lesson complete' });
  }
});

module.exports = router;
