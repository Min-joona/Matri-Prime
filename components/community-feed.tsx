import { useState, useEffect, useCallback } from 'react';
import { useSocket } from '../lib/socket-client';
import { useAuth } from '../lib/auth-context';
import Link from 'next/link';
import { Heart, MessageCircle, Share2, Bookmark, MoreHorizontal } from 'lucide-react';

interface Post {
  _id: string;
  content: string;
  userId: {
    _id: string;
    displayName: string;
    avatar?: string;
    level: number;
  };
  type: 'text' | 'achievement' | 'streak' | 'question';
  likes: number;
  likedBy: string[];
  comments: number;
  timestamp: string;
}

export default function CommunityFeed() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newPostContent, setNewPostContent] = useState('');
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
  const { socket, connected } = useSocket();
  const { user } = useAuth();

  const loadFeed = useCallback(async () => {
    try {
      const response = await fetch('/api/community/feed?page=1&limit=20');
      if (!response.ok) throw new Error('Failed to load feed');
      const data = await response.json();
      setPosts(data.posts || []);
      setIsLoading(false);
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadFeed();
  }, [loadFeed]);

  useEffect(() => {
    if (socket && connected) {
      socket.on('post-created', (newPost) => {
        setPosts(prev => [newPost, ...prev]);
      });

      socket.on('post-liked', (data) => {
        setPosts(prev => prev.map(post => 
          post._id === data.postId 
            ? { ...post, likes: data.likes, likedBy: [...post.likedBy, data.likedBy] }
            : post
        ));
      });

      socket.on('comment-added', (data) => {
        setPosts(prev => prev.map(post => 
          post._id === data.postId 
            ? { ...post, comments: post.comments + 1 }
            : post
        ));
      });
    }

    return () => {
      if (socket) {
        socket.off('post-created');
        socket.off('post-liked');
        socket.off('comment-added');
      }
    };
  }, [socket, connected]);

  const createPost = async () => {
    if (!newPostContent.trim() || !connected) return;

    try {
      const response = await fetch('/api/community/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: newPostContent, type: 'text' })
      });

      if (response.ok) {
        setNewPostContent('');
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const toggleLike = async (postId) => {
    if (!user || !connected) return;

    const isLiked = likedPosts.has(postId);
    setLikedPosts(prev => {
      const newSet = new Set(prev);
      if (isLiked) newSet.delete(postId);
      else newSet.add(postId);
      return newSet;
    });

    try {
      await fetch(`/api/community/posts/${postId}/like`, { method: 'POST' });
    } catch (err) {
      setLikedPosts(prev => {
        const newSet = new Set(prev);
        if (isLiked) newSet.delete(postId);
        else newSet.add(postId);
        return newSet;
      });
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1,2,3].map(i => (
          <div key={i} className="glass-card p-4">
            <div className="h-4 bg-surface rounded mb-3"></div>
            <div className="h-3 bg-surface rounded w-3/4"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-danger">{error}</p>
        <button onClick={loadFeed} className="btn-primary mt-4">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Create Post */}
      <div className="glass-card p-6">
        <textarea
          value={newPostContent}
          onChange={(e) => setNewPostContent(e.target.value)}
          placeholder="Share your study journey, ask a question, or celebrate a win!"
          className="w-full bg-surface rounded-xl p-3 text-text-primary placeholder:text-text-muted resize-none focus:outline-none focus:ring-2 focus:ring-primary/50 min-h-20"
          rows={3}
          maxLength={10000}
        />
        <div className="flex justify-between items-center mt-4">
          <span className="text-xs text-text-muted">{newPostContent.length}/10000</span>
          <button
            onClick={createPost}
            disabled={!connected || !newPostContent.trim()}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Post
          </button>
        </div>
        {!connected && <p className="text-xs text-danger mt-2">Reconnecting...</p>}
      </div>

      {/* Feed */}
      <div className="space-y-4">
        {posts.length === 0 ? (
          <div className="glass-card p-8 text-center">
            <p className="text-text-muted">No posts yet. Be the first to share!</p>
          </div>
        ) : (
          posts.map(post => (
            <div key={post._id} className="glass-card p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center text-white font-bold">
                    {post.userId.displayName.charAt(0)}
                  </div>
                  <div>
                    <Link href={`/profile/${post.userId._id}`} className="font-semibold text-text-primary hover:text-primary">
                      {post.userId.displayName}
                    </Link>
                    <p className="text-xs text-text-muted">Lvl {post.userId.level}</p>
                  </div>
                </div>
                <button className="p-2 hover:bg-surface rounded-lg">
                  <MoreHorizontal className="w-4 h-4 text-text-muted" />
                </button>
              </div>

              <p className="text-text-primary mb-4 leading-relaxed whitespace-pre-wrap">{post.content}</p>

              <div className="flex items-center justify-between pt-4 border-t border-white/10">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => toggleLike(post._id)}
                    className={`flex items-center space-x-1 transition-colors ${
                      likedPosts.has(post._id) ? 'text-danger' : 'text-text-muted hover:text-danger'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${likedPosts.has(post._id) ? 'fill-current' : ''}`} />
                    <span className="text-sm">{post.likes}</span>
                  </button>

                  <button className="flex items-center space-x-1 text-text-muted hover:text-primary">
                    <MessageCircle className="w-4 h-4" />
                    <span className="text-sm">{post.comments}</span>
                  </button>

                  <button className="flex items-center space-x-1 text-text-muted hover:text-primary">
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-center space-x-2">
                  <button className="p-2 hover:bg-surface rounded-lg">
                    <Bookmark className="w-4 h-4 text-text-muted" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
