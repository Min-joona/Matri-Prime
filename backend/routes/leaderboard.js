const express = require('express');
const User = require('../models/User');
const { auth } = require('./auth');
const router = express.Router();

// Get leaderboard with pagination
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 50, sortBy = 'xp', league = null } = req.query;
    const skip = (page - 1) * limit;

    const query = { isActive: true };
    if (league) query.league = league;

    const users = await User.find(query)
      .select('displayName level xp streak league weeklyXP')
      .sort({ [sortBy]: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await User.countDocuments(query);

    const leaderboard = users.map((user, index) => ({
      rank: skip + index + 1,
      id: user._id,
      name: user.displayName,
      level: user.level,
      xp: user.xp,
      streak: user.streak,
      league: user.league,
      weeklyXP: user.weeklyXP
    }));

    res.json({
      success: true,
      leaderboard,
      page: parseInt(page),
      totalPages: Math.ceil(total / limit),
      total,
      league
    });
  } catch (error) {
    console.error('Leaderboard fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch leaderboard' });
  }
});

// Get user rank
router.get('/rank/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Find user's rank in XP
    const rank = await User.countDocuments({ xp: { $gt: user.xp } });
    
    res.json({
      success: true,
      rank: rank + 1,
      user: {
        id: user._id,
        name: user.displayName,
        level: user.level,
        xp: user.xp,
        streak: user.streak,
        league: user.league
      }
    });
  } catch (error) {
    console.error('Rank fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch rank' });
  }
});

// Update weekly standings (admin only)
router.post('/update-weekly', auth, async (req, res) => {
  try {
    // In real app, check if user is admin
    const adminUsers = ['kimsabu36@gmail.com'];
    
    if (!adminUsers.includes(req.user.email)) {
      return res.status(403).json({ error: 'Admin access required' });
    }

    // Reset weekly XP for all users
    await User.updateMany({}, { weeklyXP: 0 });

    // Update leagues based on XP (simplified logic)
    const users = await User.find().sort({ xp: -1 });
    
    // League assignment logic
    users.forEach(async (user, index) => {
      const rank = index + 1;
      if (rank <= 10) {
        user.league = 'Diamond';
      } else if (rank <= 50) {
        user.league = 'Platinum';
      } else if (rank <= 150) {
        user.league = 'Gold';
      } else if (rank <= 500) {
        user.league = 'Silver';
      } else {
        user.league = 'Bronze';
      }
      await user.save();
    });

    res.json({
      success: true,
      message: 'Weekly leaderboard updated successfully'
    });
  } catch (error) {
    console.error('Weekly update error:', error);
    res.status(500).json({ error: 'Failed to update weekly standings' });
  }
});

module.exports = router;
