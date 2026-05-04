import { useState, useEffect, useRef } from 'react';
import { useSocket } from '../lib/socket-client';
import { useAuth } from '../lib/auth-context';
import { Send, MoreHorizontal } from 'lucide-react';

interface DM {
  _id: string;
  from: string;
  message: string;
  timestamp: string;
  read: boolean;
}

interface Conversation {
  id: string;
  otherUser: {
    name: string;
    level: number;
    online: boolean;
  };
  lastMessage: string;
  unread: number;
}

export default function DirectMessaging() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversation, setCurrentConversation] = useState<string | null>(null);
  const [messages, setMessages] = useState<DM[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [newMessageData, setNewMessageData] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { socket } = useSocket();
  const { user } = useAuth();

  const loadConversations = async () => {
    const response = await fetch('/api/community/conversations');
    const data = await response.json();
    if (data.success) setConversations(data.conversations);
  };

  const loadMessages = async (conversationId: string) => {
    const response = await fetch(`/api/community/messages/${conversationId}`);
    const data = await response.json();
    if (data.success) setMessages(data.messages);
  };

  useEffect(() => {
    loadConversations();
  }, []);

  useEffect(() => {
    if (socket && currentConversation) {
      socket.emit('join-dm', { conversationId: currentConversation });

      socket.on('new-dm', (message) => {
        setMessages(prev => [...prev, message]);
      });

      return () => socket.off('new-dm');
    }
  }, [socket, currentConversation]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!newMessage.trim() || !currentConversation) return;

    try {
      await fetch('/api/community/dm/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ toUserId: currentConversation, content: newMessage })
      });

      setNewMessage('');
    } catch (err) {
      console.error('Send error:', err);
    }
  };

  return (
    <div className="flex h-full">
      {/* Conversations Sidebar */}
      <div className="w-80 border-r border-white/10">
        <div className="p-4">
          <h3 className="font-bold text-text-primary mb-3">Messages</h3>
          <div className="space-y-2">
            {conversations.length === 0 ? (
              <p className="text-center text-text-muted text-sm p-8">No conversations yet</p>
            ) : (
              conversations.map(conv => (
                <button
                  key={conv.id}
                  onClick={() => setCurrentConversation(conv.id)}
                  className={`w-full p-3 rounded-lg flex items-center space-x-3 ${
                    currentConversation === conv.id ? 'bg-surface' : 'hover:bg-surface/50'
                  }`}
                >
                  <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center text-white font-bold">
                    {conv.otherUser.name.charAt(0)}
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-sm font-medium text-text-primary">{conv.otherUser.name}</p>
                    <p className="text-xs text-text-muted truncate">{conv.lastMessage}</p>
                  </div>
                  {conv.unread > 0 && (
                    <span className="bg-primary text-white text-xs px-2 py-1 rounded-full">
                      {conv.unread}
                    </span>
                  )}
                </button>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Message Area */}
      <div className="flex-1 flex flex-col">
        {currentConversation ? (
          <>
            <div className="flex-1 p-6 overflow-y-auto">
              <div className="space-y-3">
                {messages.map(msg => (
                  <div
                    key={msg._id}
                    className={`flex ${msg.from === user?._id ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xl p-3 rounded-xl ${
                        msg.from === user?._id
                          ? 'bg-gradient-primary text-white'
                          : 'bg-surface text-text-primary'
                      }`}
                    >
                      <p className="text-sm leading-relaxed">{msg.message}</p>
                      <p className="text-xs opacity-70 mt-1">
                        {new Date(msg.timestamp).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <div ref={messagesEndRef} />
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                sendMessage();
              }}
              className="p-4 border-t border-white/10"
            >
              <div className="flex space-x-3">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => {
                    setNewMessage(e.target.value);
                    // Handle typing indicator
                  }}
                  placeholder="Type a message..."
                  className="flex-1 bg-surface rounded-xl px-4 py-2 text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
                <button
                  type="submit"
                  disabled={!newMessage.trim()}
                  className="btn-primary px-4 py-2 disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-text-muted">Select a conversation to start messaging</p>
          </div>
        )}
      </div>
    </div>
  );
}
