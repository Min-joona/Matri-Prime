import { useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from '../lib/auth-context';
import { useGamificationStore } from '../stores/gamification-store';

export function useSocket() {
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const { addXP, updateQuestProgress } = useGamificationStore();
  
  const reconnectTimer = useRef(null);

  useEffect(() => {
    if (!user) return;

    const socketInstance = io(process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:5000', {
      path: '/socket.io',
      transport: ['websocket'],
      upgrade: true,
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
      auth: {
        userId: user.uid,
        token: user.accessToken
      }
    });

    socketInstance.on('connect', () => {
      console.log('Socket connected');
      setConnected(true);
      setError(null);
      
      socketInstance.emit('join-room', { league: 'Bronze' });
      socketInstance.emit('join-feed', {});
    });

    socketInstance.on('disconnect', (reason) => {
      console.log('Socket disconnected:', reason);
      setConnected(false);
      
      if (reason === 'io server disconnect') {
        socketInstance.connect();
      }
    });

    socketInstance.on('connect_error', (err) => {
      console.error('Socket connection error:', err);
      setError('Connection failed');
      setConnected(false);
      
      if (err.message.includes('500')) {
        setTimeout(() => socketInstance.connect(), 3000);
      }
    });

    socketInstance.on('leaderboard-updated', (data) => {
      updateQuestProgress('daily-xp', data.xpEarned || 10);
      addXP(data.xpEarned || 10);
    });

    socketInstance.on('post-created', (post) => {
      
      
    });

    socketInstance.on('new-message', (message) => {
      
      
    });

    socketInstance.on('error', (err) => {
      console.error('Socket error:', err);
      
    });

    setSocket(socketInstance);

    return () => {
      if (reconnectTimer.current) clearTimeout(reconnectTimer.current);
      socketInstance.disconnect();
    };
  }, [user]);

  const sendMessage = (toUserId, message) => {
    if (!socket || !connected) return false;
    
    socket.emit('send-message', { toUserId, content: message });
    return true;
  };

  const createPost = (content, type = 'text') => {
    if (!socket || !connected) return false;
    
    socket.emit('new-post', { content, type });
    return true;
  };

  const joinStudyRoom = (roomId) => {
    if (!socket || !connected) return false;
    
    socket.emit('join-study-room', { roomId });
    return true;
  };

  return {
    socket,
    connected,
    error,
    sendMessage,
    createPost,
    joinStudyRoom
  };
}
