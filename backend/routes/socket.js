const { getIO } = require('../socket-server');
const express = require('express');
const router = express.Router();
const { auth } = require('./auth');

// Socket connection endpoint
router.post('/connect', auth, (req, res) => {
  const io = getIO();
  const userId = req.user._id;
  
  // Get socket IDs for this user
  const userSockets = [];
  
  io.sockets.sockets.forEach((socket) => {
    if (socket.handshake.auth.userId === userId.toString()) {
      userSockets.push(socket.id);
    }
  });

  res.json({
    success: true,
    connected: userSockets.length > 0,
    socketIds: userSockets
  });
});

// Get real-time leaderboard update
router.get('/leaderboard/updates', auth, async (req, res) => {
  try {
    const io = getIO();
    const userId = req.user._id;
    
    // Socket will handle real-time updates
    res.json({
      success: true,
      message: 'Connected to real-time leaderboard',
      endpoint: '/socket.io/leaderboard'
    });
  } catch (error) {
    console.error('Socket leaderboard error:', error);
    res.status(500).json({ error: 'Failed to connect to leaderboard' });
  }
});

module.exports = router;
