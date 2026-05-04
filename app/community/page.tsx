'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Users, 
  Heart, 
  MessageCircle, 
  Share2, 
  Bookmark, 
  MoreHorizontal,
  Image as ImageIcon,
  Send,
  TrendingUp,
  Clock,
  Search,
  Filter
} from 'lucide-react'

interface Post {
  id: string
  author: {
    name: string
    avatar: string
    level: number
    streak: number
  }
  content: string
  image?: string
  likes: number
  comments: number
  shares: number
  timestamp: string
  type: 'text' | 'achievement' | 'streak' | 'question'
}

const mockPosts: Post[] = [
  {
    id: '1',
    author: {
      name: 'Yoseph M.',
      avatar: 'bg-amber-400',
      level: 42,
      streak: 89
    },
    content: 'Just hit a 90-day streak! 🔥 The key is consistency - even 15 minutes a day adds up. Who else is grinding?',
    likes: 234,
    comments: 45,
    shares: 12,
    timestamp: '2 hours ago',
    type: 'streak'
  },
  {
    id: '2',
    author: {
      name: 'Meron T.',
      avatar: 'bg-slate-400',
      level: 38,
      streak: 76
    },
    content: 'Can someone explain quadratic equations? I\'m stuck on the practice exam question #12 from the Math Grade 10 set.',
    likes: 89,
    comments: 23,
    shares: 3,
    timestamp: '4 hours ago',
    type: 'question'
  },
  {
    id: '3',
    author: {
      name: 'Bereket A.',
      avatar: 'bg-amber-600',
      level: 35,
      streak: 64
    },
    content: '🎉 Just completed all Physics units! The simulations really helped understand concepts. Here\'s my study notes for anyone interested.',
    image: 'bg-gradient-to-br from-primary/20 to-blue-500/20',
    likes: 456,
    comments: 78,
    shares: 156,
    timestamp: '6 hours ago',
    type: 'achievement'
  },
  {
    id: '4',
    author: {
      name: 'Tigist K.',
      avatar: 'bg-primary',
      level: 33,
      streak: 58
    },
    content: 'Study tip: Use the Pomodoro technique! 25 minutes of focus, 5 minutes break. My productivity increased 3x since I started this.',
    likes: 312,
    comments: 56,
    shares: 89,
    timestamp: '8 hours ago',
    type: 'text'
  },
  {
    id: '5',
    author: {
      name: 'You',
      avatar: 'bg-primary',
      level: 12,
      streak: 14
    },
    content: 'Started my MatriPrime journey today! Excited to learn and grow with this amazing community. 🚀',
    likes: 45,
    comments: 12,
    shares: 2,
    timestamp: '1 day ago',
    type: 'text'
  }
]

const trendingTopics = [
  '#ESLCE2024',
  '#StudyTips',
  '#MathHelp',
  '#ScholarshipAlert',
  '#StudyWithMe',
  '#ExamPrep'
]

export default function Community() {
  const [newPost, setNewPost] = useState('')
  const [likedPosts, setLikedPosts] = useState<string[]>([])
  const [savedPosts, setSavedPosts] = useState<string[]>([])
  const [activeFilter, setActiveFilter] = useState<'all' | 'following' | 'popular'>('all')

  const handleLike = (postId: string) => {
    setLikedPosts(prev => 
      prev.includes(postId) 
        ? prev.filter(id => id !== postId)
        : [...prev, postId]
    )
  }

  const handleSave = (postId: string) => {
    setSavedPosts(prev => 
      prev.includes(postId) 
        ? prev.filter(id => id !== postId)
        : [...prev, postId]
    )
  }

  const handleSubmitPost = () => {
    if (newPost.trim()) {
      // In real app, this would submit to backend
      setNewPost('')
    }
  }

  return (
    <div className="min-h-screen pt-20 pb-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Users className="h-8 w-8 text-primary" />
            <h1 className="text-3xl sm:text-4xl font-bold gradient-text">Community</h1>
          </div>
          <p className="text-text-muted max-w-2xl mx-auto">
            Connect with 50,000+ Ethiopian students. Share your journey, ask questions, and celebrate wins together.
          </p>
        </motion.div>

        {/* Create Post */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="glass-card p-6 mb-8"
        >
          <div className="flex space-x-4">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold shrink-0">
              Y
            </div>
            <div className="flex-1">
              <textarea
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                placeholder="Share your study journey, ask a question, or celebrate a win!"
                className="w-full bg-surface rounded-xl p-3 text-text-primary placeholder:text-text-muted resize-none focus:outline-none focus:ring-2 focus:ring-primary/50"
                rows={3}
              />
              <div className="flex items-center justify-between mt-3">
                <div className="flex space-x-2">
                  <button className="p-2 rounded-lg bg-surface text-text-muted hover:text-primary transition-colors">
                    <ImageIcon className="h-5 w-5" />
                  </button>
                  <button className="p-2 rounded-lg bg-surface text-text-muted hover:text-primary transition-colors">
                    <TrendingUp className="h-5 w-5" />
                  </button>
                </div>
                <button 
                  onClick={handleSubmitPost}
                  disabled={!newPost.trim()}
                  className="btn-primary text-sm px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="h-4 w-4 inline-block mr-1" />
                  Post
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-wrap items-center justify-between gap-4 mb-6"
        >
          <div className="flex space-x-2">
            {(['all', 'following', 'popular'] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all capitalize ${
                  activeFilter === filter
                    ? 'bg-primary text-white shadow-glow'
                    : 'bg-surface text-text-muted hover:bg-surface-700 hover:text-text-primary'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
          
          <div className="flex items-center space-x-2">
            <button className="p-2 rounded-lg bg-surface text-text-muted hover:text-text-primary transition-colors">
              <Search className="h-5 w-5" />
            </button>
            <button className="p-2 rounded-lg bg-surface text-text-muted hover:text-text-primary transition-colors">
              <Filter className="h-5 w-5" />
            </button>
          </div>
        </motion.div>

        {/* Trending Topics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mb-6"
        >
          <div className="flex flex-wrap gap-2">
            {trendingTopics.map((topic) => (
              <button
                key={topic}
                className="px-3 py-1.5 bg-surface text-text-muted rounded-full text-sm hover:bg-surface-700 hover:text-text-primary transition-colors"
              >
                {topic}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Posts Feed */}
        <div className="space-y-6">
          {mockPosts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="glass-card p-6"
            >
              {/* Post Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-full ${post.author.avatar} flex items-center justify-center text-white font-bold`}>
                    {post.author.name.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="font-bold text-text-primary">{post.author.name}</h3>
                      <span className="text-xs text-text-muted">Lvl {post.author.level}</span>
                      <span className="text-xs text-secondary flex items-center">
                        <span className="mr-1">🔥</span>{post.author.streak}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 text-text-muted text-xs">
                      <Clock className="h-3 w-3" />
                      <span>{post.timestamp}</span>
                    </div>
                  </div>
                </div>
                <button className="p-2 rounded-full hover:bg-surface transition-colors">
                  <MoreHorizontal className="h-5 w-5 text-text-muted" />
                </button>
              </div>

              {/* Post Content */}
              <div className="mb-4">
                <p className="text-text-primary leading-relaxed">{post.content}</p>
                {post.image && (
                  <div className={`mt-4 h-48 rounded-xl ${post.image} flex items-center justify-center`}>
                    <span className="text-text-muted">Post Image</span>
                  </div>
                )}
              </div>

              {/* Post Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-white/10">
                <div className="flex items-center space-x-6">
                  <button 
                    onClick={() => handleLike(post.id)}
                    className={`flex items-center space-x-1 transition-colors ${
                      likedPosts.includes(post.id) ? 'text-danger' : 'text-text-muted hover:text-danger'
                    }`}
                  >
                    <Heart className={`h-5 w-5 ${likedPosts.includes(post.id) ? 'fill-current' : ''}`} />
                    <span className="text-sm">{post.likes + (likedPosts.includes(post.id) ? 1 : 0)}</span>
                  </button>
                  <button className="flex items-center space-x-1 text-text-muted hover:text-primary transition-colors">
                    <MessageCircle className="h-5 w-5" />
                    <span className="text-sm">{post.comments}</span>
                  </button>
                  <button className="flex items-center space-x-1 text-text-muted hover:text-primary transition-colors">
                    <Share2 className="h-5 w-5" />
                    <span className="text-sm">{post.shares}</span>
                  </button>
                </div>
                <button 
                  onClick={() => handleSave(post.id)}
                  className={`p-2 rounded-full transition-colors ${
                    savedPosts.includes(post.id) ? 'text-secondary' : 'text-text-muted hover:text-text-primary'
                  }`}
                >
                  <Bookmark className={`h-5 w-5 ${savedPosts.includes(post.id) ? 'fill-current' : ''}`} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Load More */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="text-center mt-8"
        >
          <button className="btn-ghost">
            Load More Posts
          </button>
        </motion.div>
      </div>
    </div>
  )
}
