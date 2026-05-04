const socketIo = require('socket.io');
const User = require('./models/User');

let io;

const initSocketServer = (server) => {
  io = socketIo(server, {
    cors: {
      origin: process.env.FRONTEND_URL || "http://localhost:3000",
      methods: ["GET", "POST"],
      credentials: true
    },
    pingTimeout: 60000,
    pingInterval: 25000
  });

  const leaderboardNamespace = io.of('/leaderboard');
  const communityNamespace = io.of('/community');

  // Real-time Leaderboard
  leaderboardNamespace.on('connection', (socket) => {
    console.log('User connected to leaderboard:', socket.id);

    // Send initial leaderboard when user joins
    socket.on('join-leaderboard', async (data) => {
      const { league = 'all' } = data;
      
      try {
        const users = await User.find({})
          .select('displayName level xp streak league weeklyXP')
          .sort({ weeklyXP: -1 })
          .limit(50);

        const leaderboard = users.map((user, index) => ({
          rank: index + 1,
          userId: user._id,
          name: user.displayName,
          level: user.level,
          xp: user.xp,
          streak: user.streak,
          league: user.league,
          weeklyXP: user.weeklyXP
        }));

        socket.emit('leaderboard-update', { leaderboard });
      } catch (error) {
        console.error('Error fetching leaderboard:', error);
        socket.emit('error', { message: 'Failed to fetch leaderboard' });
      }
    });

    // Update leaderboard when user earns XP
    socket.on('update-xp', async (data) => {
      const { userId, xpEarned } = data;
      
      try {
        const user = await User.findById(userId);
        if (!user) return;

        user.weeklyXP += xpEarned;
        await user.save();

        // Broadcast update to all users in same league
        const updatedUsers = await User.find({ league: user.league })
          .sort({ weeklyXP: -1 })
          .limit(50);

        const leaderboard = updatedUsers.map((u, index) => ({
          rank: index + 1,
          userId: u._id,
          name: u.displayName,
          level: u.level,
          xp: u.xp,
          streak: u.streak,
          league: u.league,
          weeklyXP: u.weeklyXP
        }));

        leaderboardNamespace.to(`league-${user.league}`).emit('leaderboard-update', {
          leaderboard,
          updatedBy: userId
        });
      } catch (error) {
        console.error('Error updating XP:', error);
      }
    });

    // Real-time streak updates
    socket.on('update-streak', async (data) => {
      const { userId, streakDays } = data;
      
      try {
        const user = await User.findById(userId);
        if (!user) return;

        user.streak = streakDays;
        await user.save();

        // Notify followers
        socket.broadcast.emit('streak-update', {
          userId,
          name: user.displayName,
          streak: streakDays
        });
      } catch (error) {
        console.error('Error updating streak:', error);
      }
    });

    socket.on('disconnect', () => {
      console.log('User disconnected from leaderboard:', socket.id);
    });
  });

  // Community Features
  communityNamespace.on('connection', (socket) => {
    console.log('User connected to community:', socket.id);

    // Join specific rooms
    socket.on('join-feed', () => {
      socket.join('community-feed');
    });

    // Real-time post updates
    socket.on('new-post', (postData) => {
      socket.to('community-feed').emit('post-update', postData);
    });

    // Real-time comment updates
    socket.on('new-comment', (commentData) => {
      socket.to(`post-${commentData.postId}`).emit('comment-update', commentData);
    });

    // Study buddy matching
    socket.on('find-study-buddy', (criteria) => {
      socket.broadcast.emit('buddy-request', {
        from: socket.id,
        criteria
      });
    });

    // Direct messaging
    socket.on('send-message', (message) => {
      socket.to(`user-${message.toUserId}`).emit('new-message', message);
    });

    socket.on('disconnect', () => {
      console.log('User disconnected from community:', socket.id);
    });
  });

  return io;
};

const getIO = () => {
  if (!io) {
    throw new Error('Socket.io not initialized');
  }
  return io;
};

module.exports = { initSocketServer, getIO };
