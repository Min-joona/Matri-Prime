const express = require('express');
const Course = require('../models/Course');
const { auth } = require('./auth');
const router = express.Router();

// Quiz questions from seed data
const { quizQuestions } = require('../seed');

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

// Get lesson by ID
router.get('/:subjectId/lessons/:lessonId', async (req, res) => {
  try {
    const { subjectId, lessonId } = req.params;
    
    const course = await Course.findOne({ id: subjectId });
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }
    
    // Find lesson across all units
    let foundLesson = null;
    let unitIndex = -1;
    let lessonIndex = -1;
    let totalLessons = 0;
    let currentLessonNumber = 0;
    
    for (let i = 0; i < course.units.length; i++) {
      for (let j = 0; j < course.units[i].lessons.length; j++) {
        totalLessons++;
        if (course.units[i].lessons[j].id === lessonId) {
          foundLesson = course.units[i].lessons[j];
          unitIndex = i;
          lessonIndex = j;
          currentLessonNumber = totalLessons;
        }
      }
    }
    
    if (!foundLesson) {
      return res.status(404).json({ error: 'Lesson not found' });
    }
    
    // Find next lesson
    let nextLessonId = null;
    const currentUnit = course.units[unitIndex];
    
    if (lessonIndex < currentUnit.lessons.length - 1) {
      nextLessonId = currentUnit.lessons[lessonIndex + 1].id;
    } else if (unitIndex < course.units.length - 1) {
      nextLessonId = course.units[unitIndex + 1].lessons[0]?.id || null;
    }
    
    // Parse content if stored as JSON string
    let content = foundLesson.content;
    if (typeof content === 'string') {
      try {
        content = JSON.parse(content);
      } catch (e) {
        content = [];
      }
    }
    
    res.json({
      success: true,
      lesson: {
        id: foundLesson.id,
        title: foundLesson.title,
        subjectName: course.name,
        chapterTitle: currentUnit.title,
        content,
        xpReward: foundLesson.xpReward || 50,
        currentLesson: currentLessonNumber,
        totalLessons,
        nextLessonId
      }
    });
  } catch (error) {
    console.error('Lesson fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch lesson' });
  }
});

// Get quiz questions for a subject
router.get('/:subjectId/quiz', async (req, res) => {
  try {
    const { subjectId } = req.params;
    const { chapter, limit = 10 } = req.query;
    
    // For now, combine all questions or filter by chapter
    let questions = [];
    
    if (chapter && quizQuestions[chapter.toLowerCase()]) {
      questions = quizQuestions[chapter.toLowerCase()];
    } else {
      // Combine all questions
      questions = [
        ...quizQuestions.algebra,
        ...quizQuestions.calculus,
        ...quizQuestions.statistics
      ];
    }
    
    // Shuffle questions
    questions = questions.sort(() => Math.random() - 0.5);
    
    // Limit questions
    questions = questions.slice(0, parseInt(limit));
    
    res.json({
      success: true,
      questions,
      count: questions.length
    });
  } catch (error) {
    console.error('Quiz fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch quiz questions' });
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

// Legacy lesson completion endpoint
router.post('/:subjectId/lessons/:lessonId/complete', auth, async (req, res) => {
  try {
    const { subjectId, lessonId } = req.params;
    const { xpEarned = 50 } = req.body;
    
    res.json({
      success: true,
      message: 'Lesson marked as completed',
      xpEarned
    });
  } catch (error) {
    console.error('Lesson completion error:', error);
    res.status(500).json({ error: 'Failed to mark lesson complete' });
  }
});

// Save quiz results
router.post('/quiz-results', auth, async (req, res) => {
  try {
    const { userId, subjectId, score, xpEarned, answers, timeTaken, weakTopics } = req.body;
    
    // In a real app, save to database
    res.json({
      success: true,
      message: 'Quiz results saved',
      score,
      xpEarned
    });
  } catch (error) {
    console.error('Save quiz results error:', error);
    res.status(500).json({ error: 'Failed to save quiz results' });
  }
});

module.exports = router;
