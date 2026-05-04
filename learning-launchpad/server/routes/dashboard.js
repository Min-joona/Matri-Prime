// dashboard.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Course = require('../models/Course');
const { protect } = require('../middleware/auth');

router.get('/', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('enrolledCourses').populate('coursesCompleted');
    res.json({
      user: user.toJSON(),
      stats: {
        points: user.points,
        streak: user.streak,
        coursesCompleted: user.coursesCompleted.length,
        enrolledCourses: user.enrolledCourses.length
      },
      recentActivity: user.recentActivity.slice(0, 5)
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
