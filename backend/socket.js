const socketIo = require('socket.io');
const User = require('./models/User');
const Message = require('./models/Message');
const Post = require('./models/Post');

class SocketService {
  constructor(server) {
    this.io = socketIo(server, {
      cors: {
        origin: process.env.FRONTEND_URL || "http://localhost:3000",
        methods: ["GET", "POST"],
        credentials: true
      },
      pingTimeout: 60000,
      pingInterval: 25000
    });

    this.setupLeaderboardNamespace();
    this.setupCommunityNamespace();
    this.setupChatNamespace();

    return this.io;
  }

  setupLeaderboardNamespace() {
    const leaderboard = this.io.of('/leaderboard');

    leaderboard.on('connection', (socket) => {
      console.log('Leaderboard connected:', socket.id, 'User:', socket.handshake.auth.userId);

      socket.on('join-room', async ({ league }) => {
        const room = league || 'all';
        socket.join(`${room}`);
        socket.leagueRoom = `${room}`;

        try {
          const users = await User.find({})
            .select('displayName level xp streak league weeklyXP avatar')
            .sort({ weeklyXP: -1 })
            .limit(100);

          socket.emit('leaderboard-data', { 
            users: users.slice(0, 50),
            lastUpdate: new Date().toISOString() 
          });
        } catch (error) {
          console.error('Leaderboard error:', error);
          socket.emit('error', { message: 'Failed to load leaderboard' });
        }
      });

      socket.on('xp-update', async ({ userId, xpEarned }) => {
        try {
          const user = await User.findById(userId);
          if (!user) return;

          user.weeklyXP += xpEarned;
          if (user.xp) user.xp += xpEarned;
          await user.save();

          leaderboard.to(`${socket.leagueRoom}`).emit('leaderboard-updated', {
            userId: user._id,
            name: user.displayName,
            xp: user.xp,
            weeklyXP: user.weeklyXP,
            level: user.level
          });
        } catch (error) {
          console.error('XP update error:', error);
        }
      });

      socket.on('disconnect', () => {
        console.log('Leaderboard disconnected:', socket.id);
      });
    });
  }

  setupCommunityNamespace() {
    const community = this.io.of('/community');

    community.on('connection', (socket) => {
      console.log('Community connected:', socket.id);

      // Feed (timeline/posts)
      socket.on('join-feed', () => {
        socket.join('feed');
      });

      socket.on('new-post', async (postData) => {
        try {
          const post = new Post({
            userId: socket.handshake.auth.userId,
            content: postData.content,
            type: 'text',
            image: postData.image || null,
            timestamp: new Date(),
            likes: 0,
            comments: 0,
            shares: 0
          });

          await post.save();
          
          const populatedPost = await Post.findById(post._id)
            .populate('userId', 'displayName avatar level');

          community.to('feed').emit('post-created', populatedPost);
        } catch (error) {
          console.error('Post creation error:', error);
          socket.emit('error', { message: 'Failed to create post' });
        }
      });

      socket.on('like-post', async ({ postId }) => {
        try {
          const post = await Post.findById(postId);
          if (!post) return;

          post.likes += 1;
          await post.save();

          community.to('feed').emit('post-liked', { 
            postId, 
            likes: post.likes,
            likedBy: socket.handshake.auth.userId 
          });
        } catch (error) {
          console.error('Like error:', error);
        }
      });

      socket.on('comment-post', async ({ postId, comment }) => {
        try {
          const post = await Post.findById(postId);
          if (!post) return;

          post.comments += 1;
          await post.save();

          const commentObj = {
            postId,
            userId: socket.handshake.auth.userId,
            content: comment,
            timestamp: new Date()
          };

          community.to('feed').emit('comment-added', commentObj);
        } catch (error) {
          console.error('Comment error:', error);
        }
      });

      socket.on('disconnect', () => {
        console.log('Community disconnected:', socket.id);
      });
    });
  }

  setupChatNamespace() {
    const chat = this.io.of('/chat');

    chat.on('connection', (socket) => {
      console.log('Chat connected:', socket.id);

      socket.on('join-conversation', async ({ partnerId }) => {
        const userId = socket.handshake.auth.userId;
        const roomName = [userId, partnerId].sort().join('-');
        socket.join(roomName);
        socket.currentRoom = roomName;

        try {
          // Send conversation history
          const messages = await Message.find({
            $or: [
              { from: userId, to: partnerId },
              { from: partnerId, to: userId }
            ]
          }).sort({ timestamp: -1 }).limit(50);

          socket.emit('conversation-history', messages.reverse());
        } catch (error) {
          console.error('Chat history error:', error);
        }
      });

      socket.on('send-message', async ({ content, toUserId }) => {
        try {
          const fromUserId = socket.handshake.auth.userId;
          const roomName = [fromUserId, toUserId].sort().join('-');

          const message = new Message({
            from: fromUserId,
            to: toUserId,
            message: content,
            timestamp: new Date(),
            read: false
          });

          await message.save();

          const populatedMessage = await Message.findById(message._id)
            .populate('from', 'displayName avatar level');

          chat.to(roomName).emit('new-message', populatedMessage);
        } catch (error) {
          console.error('Message error:', error);
          socket.emit('error', { message: 'Failed to send message' });
        }
      });

      socket.on('typing', ({ toUserId, isTyping }) => {
        const fromUserId = socket.handshake.auth.userId;
        const roomName = [fromUserId, toUserId].sort().join('-');
        
        socket.to(roomName).emit('user-typing', { 
          userId: fromUserId, 
          isTyping 
        });
      });

      socket.on('mark-read', async ({ messageId }) => {
        try {
          await Message.findByIdAndUpdate(messageId, { read: true, readAt: new Date() });
          socket.emit('message-read', { messageId });
        } catch (error) {
          console.error('Mark read error:', error);
        }
      });

      socket.on('disconnect', () => {
        console.log('Chat disconnected:', socket.id);
      });
    });
  }
}

module.exports = SocketService;
