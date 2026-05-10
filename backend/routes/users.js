const express = require('express');
const User = require('../models/User');
const { auth } = require('./auth');
const router = express.Router();

/**
 * GET /api/users/me
 * Get current user profile with stats and progress
 */
router.get('/me', auth, async (req, res) => {
  try {
    const user = req.user;
    
    // Calculate additional stats
    const stats = {
      level: user.level,
      xp: user.xp,
      streak: user.streak,
      totalStudyTime: user.totalStudyTime,
      totalQuestions: user.totalQuestions,
      averageScore: user.averageScore,
      primeCoins: user.primeCoins,
      weeklyXP: user.weeklyXP,
      league: user.league,
      badgesCount: user.badges?.length || 0
    };
    
    // Calculate level progress
    const currentLevelXP = Math.pow(user.level - 1, 2) * 100;
    const nextLevelXP = Math.pow(user.level, 2) * 100;
    const levelProgress = {
      current: user.xp - currentLevelXP,
      required: nextLevelXP - currentLevelXP,
      percentage: Math.round(((user.xp - currentLevelXP) / (nextLevelXP - currentLevelXP)) * 100)
    };
    
    res.json({
      success: true,
      user: {
        id: user._id,
        firebaseUid: user.firebaseUid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        bio: user.bio,
        school: user.school,
        grade: user.grade,
        subjects: user.subjects,
        settings: user.settings,
        badges: user.badges,
        createdAt: user.createdAt
      },
      stats,
      levelProgress
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Failed to get user profile' });
  }
});

/**
 * PATCH /api/users/profile
 * Update user profile (name, avatar, bio, grade, stream)
 */
router.patch('/profile', auth, async (req, res) => {
  try {
    const allowedUpdates = ['displayName', 'photoURL', 'bio', 'grade', 'school', 'subjects', 'settings'];
    const updates = Object.keys(req.body);
    const isValidOperation = updates.every(update => allowedUpdates.includes(update));
    
    if (!isValidOperation) {
      return res.status(400).json({ error: 'Invalid updates. Allowed fields: ' + allowedUpdates.join(', ') });
    }
    
    // Validate grade
    if (req.body.grade && !['9', '10', '11', '12', 'university'].includes(req.body.grade)) {
      return res.status(400).json({ error: 'Invalid grade. Must be 9, 10, 11, 12, or university' });
    }
    
    // Validate displayName length
    if (req.body.displayName && (req.body.displayName.length < 1 || req.body.displayName.length > 100)) {
      return res.status(400).json({ error: 'Display name must be between 1 and 100 characters' });
    }
    
    // Validate bio length
    if (req.body.bio && req.body.bio.length > 500) {
      return res.status(400).json({ error: 'Bio must not exceed 500 characters' });
    }
    
    const user = req.user;
    updates.forEach(update => {
      if (update === 'settings') {
        // Merge settings instead of replacing
        user.settings = { ...user.settings, ...req.body.settings };
      } else {
        user[update] = req.body[update];
      }
    });
    
    await user.save();
    
    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        displayName: user.displayName,
        photoURL: user.photoURL,
        bio: user.bio,
        grade: user.grade,
        school: user.school,
        subjects: user.subjects,
        settings: user.settings
      }
    });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

/**
 * POST /api/users/xp
 * Add XP to user, recalculate level, return new total
 * Level formula: Math.floor(Math.sqrt(totalXP / 100)) + 1
 */
router.post('/xp', auth, async (req, res) => {
  try {
    const { amount, source } = req.body;
    
    if (typeof amount !== 'number' || amount < 0) {
      return res.status(400).json({ error: 'XP amount must be a positive number' });
    }
    
    if (amount > 1000) {
      return res.status(400).json({ error: 'XP amount cannot exceed 1000 per transaction' });
    }
    
    const user = req.user;
    const previousLevel = user.level;
    const previousXP = user.xp;
    
    // Add XP
    user.xp += amount;
    user.weeklyXP += amount;
    
    // Recalculate level using the formula
    const newLevel = Math.floor(Math.sqrt(user.xp / 100)) + 1;
    const leveledUp = newLevel > previousLevel;
    user.level = newLevel;
    
    // Award PrimeCoins for leveling up
    let primeCoinsEarned = 0;
    if (leveledUp) {
      primeCoinsEarned = (newLevel - previousLevel) * 50; // 50 coins per level
      user.primeCoins += primeCoinsEarned;
    }
    
    // Update league based on XP thresholds
    if (user.xp >= 50000) user.league = 'Diamond';
    else if (user.xp >= 25000) user.league = 'Platinum';
    else if (user.xp >= 10000) user.league = 'Gold';
    else if (user.xp >= 5000) user.league = 'Silver';
    else user.league = 'Bronze';
    
    // Update last activity
    user.lastActivityDate = new Date();
    
    await user.save();
    
    res.json({
      success: true,
      xp: {
        previous: previousXP,
        added: amount,
        total: user.xp,
        source: source || 'unspecified'
      },
      level: {
        previous: previousLevel,
        current: user.level,
        leveledUp,
        primeCoinsEarned
      },
      league: user.league,
      weeklyXP: user.weeklyXP
    });
  } catch (error) {
    console.error('XP update error:', error);
    res.status(500).json({ error: 'Failed to update XP' });
  }
});

/**
 * POST /api/users/streak
 * Check if studied today, increment streak
 * If missed a day: reset streak to 0
 * If streak frozen: preserve streak, deduct freeze
 */
router.post('/streak', auth, async (req, res) => {
  try {
    const user = req.user;
    const { useFreeze } = req.body;
    
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const lastActivity = user.lastActivityDate 
      ? new Date(user.lastActivityDate.getFullYear(), user.lastActivityDate.getMonth(), user.lastActivityDate.getDate())
      : null;
    
    let streakAction = 'none';
    let previousStreak = user.streak;
    let freezeUsed = false;
    
    if (!lastActivity) {
      // First activity ever
      user.streak = 1;
      streakAction = 'started';
    } else {
      const daysDiff = Math.floor((today.getTime() - lastActivity.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysDiff === 0) {
        // Already studied today
        streakAction = 'already_studied';
      } else if (daysDiff === 1) {
        // Consecutive day - increment streak
        user.streak += 1;
        streakAction = 'incremented';
        
        // Award bonus XP for milestones
        if (user.streak % 7 === 0) {
          user.xp += 100; // Weekly streak bonus
          user.primeCoins += 25;
        }
        if (user.streak % 30 === 0) {
          user.xp += 500; // Monthly streak bonus
          user.primeCoins += 100;
        }
      } else if (daysDiff > 1) {
        // Missed days
        const userFreezes = user.streakFreezes || 0;
        
        if (useFreeze && userFreezes > 0) {
          // Use streak freeze
          user.streakFreezes = userFreezes - 1;
          user.streak += 1; // Continue streak
          freezeUsed = true;
          streakAction = 'freeze_used';
        } else {
          // Reset streak
          user.streak = 1;
          streakAction = 'reset';
        }
      }
    }
    
    user.lastActivityDate = now;
    await user.save();
    
    res.json({
      success: true,
      streak: {
        previous: previousStreak,
        current: user.streak,
        action: streakAction,
        freezeUsed,
        freezesRemaining: user.streakFreezes || 0
      },
      lastActivityDate: user.lastActivityDate
    });
  } catch (error) {
    console.error('Streak update error:', error);
    res.status(500).json({ error: 'Failed to update streak' });
  }
});

/**
 * GET /api/users/progress/:subjectId
 * Return completed lessons, quiz scores, flashcard mastery for a subject
 */
router.get('/progress/:subjectId', auth, async (req, res) => {
  try {
    const { subjectId } = req.params;
    const user = req.user;
    
    // In a real app, this would query from UserProgress collection
    // For now, we'll structure the expected response
    
    // Mock progress data - replace with actual DB queries
    const progress = {
      subjectId,
      completedLessons: [],
      totalLessons: 0,
      lessonsProgress: 0,
      quizzes: {
        attempts: [],
        averageScore: 0,
        bestScore: 0,
        totalAttempts: 0
      },
      flashcards: {
        totalCards: 0,
        masteredCards: 0,
        learningCards: 0,
        newCards: 0,
        masteryPercentage: 0
      },
      timeSpent: 0, // in minutes
      lastAccessedAt: null,
      xpEarned: 0
    };
    
    // Try to get actual progress from user's progress data
    // This assumes a UserProgress model or embedded progress in User
    const userProgress = user.subjectProgress?.find(p => p.subjectId === subjectId);
    
    if (userProgress) {
      progress.completedLessons = userProgress.completedLessons || [];
      progress.totalLessons = userProgress.totalLessons || 0;
      progress.lessonsProgress = progress.totalLessons > 0 
        ? Math.round((progress.completedLessons.length / progress.totalLessons) * 100) 
        : 0;
      progress.quizzes = userProgress.quizzes || progress.quizzes;
      progress.flashcards = userProgress.flashcards || progress.flashcards;
      progress.timeSpent = userProgress.timeSpent || 0;
      progress.lastAccessedAt = userProgress.lastAccessedAt;
      progress.xpEarned = userProgress.xpEarned || 0;
    }
    
    res.json({
      success: true,
      progress
    });
  } catch (error) {
    console.error('Get progress error:', error);
    res.status(500).json({ error: 'Failed to get progress' });
  }
});

/**
 * POST /api/users/progress/:subjectId/lesson
 * Mark a lesson as complete and award XP
 */
router.post('/progress/:subjectId/lesson', auth, async (req, res) => {
  try {
    const { subjectId } = req.params;
    const { lessonId, xpEarned = 50 } = req.body;
    
    if (!lessonId) {
      return res.status(400).json({ error: 'Lesson ID is required' });
    }
    
    const user = req.user;
    
    // Initialize subjectProgress if not exists
    if (!user.subjectProgress) {
      user.subjectProgress = [];
    }
    
    let subjectProgress = user.subjectProgress.find(p => p.subjectId === subjectId);
    
    if (!subjectProgress) {
      subjectProgress = {
        subjectId,
        completedLessons: [],
        quizzes: { attempts: [] },
        flashcards: {},
        timeSpent: 0,
        xpEarned: 0
      };
      user.subjectProgress.push(subjectProgress);
    }
    
    // Check if lesson already completed
    if (subjectProgress.completedLessons.includes(lessonId)) {
      return res.json({
        success: true,
        message: 'Lesson already completed',
        alreadyCompleted: true,
        xpAwarded: 0
      });
    }
    
    // Mark lesson as complete
    subjectProgress.completedLessons.push(lessonId);
    subjectProgress.xpEarned += xpEarned;
    subjectProgress.lastAccessedAt = new Date();
    
    // Award XP to user
    user.xp += xpEarned;
    user.weeklyXP += xpEarned;
    user.level = Math.floor(Math.sqrt(user.xp / 100)) + 1;
    
    await user.save();
    
    res.json({
      success: true,
      message: 'Lesson completed',
      alreadyCompleted: false,
      xpAwarded: xpEarned,
      totalXP: user.xp,
      level: user.level
    });
  } catch (error) {
    console.error('Complete lesson error:', error);
    res.status(500).json({ error: 'Failed to complete lesson' });
  }
});

/**
 * POST /api/users/progress/:subjectId/quiz
 * Save quiz attempt results
 */
router.post('/progress/:subjectId/quiz', auth, async (req, res) => {
  try {
    const { subjectId } = req.params;
    const { score, totalQuestions, xpEarned, answers, timeTaken, chapter } = req.body;
    
    if (typeof score !== 'number' || typeof totalQuestions !== 'number') {
      return res.status(400).json({ error: 'Score and totalQuestions are required' });
    }
    
    const user = req.user;
    
    // Initialize subjectProgress if not exists
    if (!user.subjectProgress) {
      user.subjectProgress = [];
    }
    
    let subjectProgress = user.subjectProgress.find(p => p.subjectId === subjectId);
    
    if (!subjectProgress) {
      subjectProgress = {
        subjectId,
        completedLessons: [],
        quizzes: { attempts: [], averageScore: 0, bestScore: 0, totalAttempts: 0 },
        flashcards: {},
        timeSpent: 0,
        xpEarned: 0
      };
      user.subjectProgress.push(subjectProgress);
    }
    
    const percentage = Math.round((score / totalQuestions) * 100);
    
    // Add quiz attempt
    const attempt = {
      date: new Date(),
      score,
      totalQuestions,
      percentage,
      timeTaken: timeTaken || 0,
      chapter: chapter || 'general',
      xpEarned: xpEarned || 0
    };
    
    subjectProgress.quizzes.attempts.push(attempt);
    subjectProgress.quizzes.totalAttempts += 1;
    subjectProgress.quizzes.bestScore = Math.max(subjectProgress.quizzes.bestScore || 0, percentage);
    
    // Calculate new average
    const allScores = subjectProgress.quizzes.attempts.map(a => a.percentage);
    subjectProgress.quizzes.averageScore = Math.round(allScores.reduce((a, b) => a + b, 0) / allScores.length);
    
    subjectProgress.xpEarned += xpEarned || 0;
    subjectProgress.lastAccessedAt = new Date();
    
    // Update user stats
    user.totalQuestions += totalQuestions;
    user.xp += xpEarned || 0;
    user.weeklyXP += xpEarned || 0;
    user.level = Math.floor(Math.sqrt(user.xp / 100)) + 1;
    
    // Update average score across all quizzes
    const allAttempts = user.subjectProgress.flatMap(p => p.quizzes?.attempts || []);
    if (allAttempts.length > 0) {
      user.averageScore = Math.round(allAttempts.reduce((sum, a) => sum + a.percentage, 0) / allAttempts.length);
    }
    
    await user.save();
    
    res.json({
      success: true,
      message: 'Quiz results saved',
      attempt,
      quizStats: {
        averageScore: subjectProgress.quizzes.averageScore,
        bestScore: subjectProgress.quizzes.bestScore,
        totalAttempts: subjectProgress.quizzes.totalAttempts
      },
      userStats: {
        totalXP: user.xp,
        level: user.level,
        averageScore: user.averageScore
      }
    });
  } catch (error) {
    console.error('Save quiz results error:', error);
    res.status(500).json({ error: 'Failed to save quiz results' });
  }
});

module.exports = router;
