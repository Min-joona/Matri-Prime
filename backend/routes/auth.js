const express = require('express');
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'matriprime-secret-key';

// Middleware
const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) throw new Error();
    
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findOne({ firebaseUid: decoded.uid });
    
    if (!user) throw new Error();
    
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Please authenticate' });
  }
};

// Firebase Auth Sync
router.post('/firebase-sync', async (req, res) => {
  try {
    const { firebaseUser } = req.body;
    
    if (!firebaseUser?.uid) {
      return res.status(400).json({ error: 'Firebase user data required' });
    }
    
    let user = await User.findOne({ firebaseUid: firebaseUser.uid });
    
    if (!user) {
      // Create new user
      user = new User({
        firebaseUid: firebaseUser.uid,
        email: firebaseUser.email,
        displayName: firebaseUser.displayName || 'Student',
        photoURL: firebaseUser.photoURL,
        phoneNumber: firebaseUser.phoneNumber
      });
      
      await user.save();
      
      // Generate JWT
      const token = jwt.sign({ uid: user.firebaseUid }, JWT_SECRET, { expiresIn: '30d' });
      
      res.status(201).json({
        success: true,
        user,
        token,
        message: 'User created successfully'
      });
    } else {
      // Update existing user
      user.email = firebaseUser.email;
      user.displayName = firebaseUser.displayName || user.displayName;
      user.photoURL = firebaseUser.photoURL || user.photoURL;
      user.phoneNumber = firebaseUser.phoneNumber || user.phoneNumber;
      user.updatedAt = Date.now();
      
      await user.save();
      
      // Generate JWT
      const token = jwt.sign({ uid: user.firebaseUid }, JWT_SECRET, { expiresIn: '30d' });
      
      res.json({
        success: true,
        user,
        token,
        message: 'User synced successfully'
      });
    }
  } catch (error) {
    console.error('Auth sync error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get current user
router.get('/me', auth, async (req, res) => {
  res.json({ success: true, user: req.user });
});

// Update user profile
router.patch('/profile', auth, [
  body('displayName').isLength({ min: 1, max: 100 }).optional(),
  body('bio').isLength({ max: 500 }).optional(),
  body('school').isLength({ max: 200 }).optional(),
  body('grade').isIn(['9', '10', '11', '12', 'university']).optional()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    const updates = Object.keys(req.body);
    const allowedUpdates = ['displayName', 'bio', 'school', 'grade', 'subjects'];
    const isValid = updates.every(update => allowedUpdates.includes(update));
    
    if (!isValid) {
      return res.status(400).json({ error: 'Invalid updates' });
    }
    
    updates.forEach(update => {
      req.user[update] = req.body[update];
    });
    
    await req.user.save();
    res.json({ success: true, user: req.user });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
module.exports.auth = auth;
