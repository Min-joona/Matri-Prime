'use client'

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  BookOpen, 
  Trophy, 
  Zap, 
  TrendingUp, 
  Activity,
  BarChart3,
  Monitor,
  Shield
} from 'lucide-react';

// Mock admin stats
const adminStats = [
  { 
    label: 'Total Students', 
    value: '52,847', 
    growth: '+12.5%',
    icon: Users, 
    color: 'text-primary',
    bg: 'bg-primary/10'
  },
  { 
    label: 'Active Courses', 
    value: '124', 
    growth: '+8',
    icon: BookOpen, 
    color: 'text-secondary',
    bg: 'bg-secondary/10'
  },
  { 
    label: 'Daily Active', 
    value: '12,450', 
    growth: '+23.1%',
    icon: Zap, 
    color: 'text-accent',
    bg: 'bg-accent/10'
  },
  { 
    label: 'Avg XP/User', 
    value: '2,847', 
    growth: '+15.3%',
    icon: Trophy, 
    color: 'text-amber-400',
    bg: 'bg-amber-400/10'
  },
];

const recentActivity = [
  { user: 'Yoseph M.', action: 'completed Chemistry Unit 3', time: '2 min ago', xp: '+50' },
  { user: 'Meron T.', action: 'achieved 30-day streak', time: '5 min ago', xp: '+100' },
  { user: 'Bereket A.', action: 'unlocked Gold League', time: '12 min ago', xp: '+200' },
  { user: 'Tigist K.', action: 'shared study notes', time: '18 min ago', xp: '+25' },
];

export default function AdminDashboard() {
  const [selectedTab, setSelectedTab] = useState<'overview' | 'users' | 'courses' | 'analytics'>('overview');

  return (
    <div className="min-h-screen pt-20 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center space-x-3"
          >
            <div className="w-12 h-12 bg-gradient-primary rounded-2xl flex items-center justify-center">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-text-primary">Admin Dashboard</h1>
              <p className="text-text-muted">Platform Overview & Management</p>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center space-x-2 text-text-muted">
            <Monitor className="h4 w-4" />
            <span className="text-sm">System Online</span>
          </motion.div>
        </div>

        {/* Admin Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-wrap gap-2 mb-8"
        >
          {['overview', 'users', 'courses', 'analytics'].map((tab) => (
            <button
              key={tab}
              onClick={() => setSelectedTab(tab as any)}
              className={`px-4 py-2 rounded-xl font-medium transition-all capitalize ${
                selectedTab === tab
                  ? 'bg-gradient-primary text-white shadow-glow'
                  : 'bg-surface text-text-muted hover:bg-surface-700'
              }`}
            >
              {tab}
            </button>
          ))}
        </motion.div>

        {/* Stats Grid */}
        {selectedTab === 'overview' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
          >
            {adminStats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="glass-card p-6 hover:scale-105 transition-transform"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className={`p-3 rounded-xl ${stat.bg}`}>
                      <Icon className={`h-6 w-6 ${stat.color}`} />
                    </div>
                    <div className="text-right">
                      <p className={`text-sm font-bold ${stat.color}`}>{stat.growth}</p>
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-text-primary mb-1">{stat.value}</h3>
                  <p className="text-text-muted text-sm">{stat.label}</p>
                </motion.div>
              );
            })}
          </motion.div>
        )}

        {/* Content Area */}
        {selectedTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Activity */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-2 glass-card p-6"
            >
              <h2 className="text-xl font-bold text-text-primary mb-4 flex items-center">
                <Activity className="h-5 w-5 mr-2 text-primary" />
                Recent Activity
              </h2>
              <div className="space-y-3">
                {recentActivity.map((activity, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center justify-between p-3 bg-surface rounded-lg hover:bg-surface-700 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center text-white font-bold text-sm">
                        {activity.user.charAt(0)}
                      </div>
                      <div>
                        <p className="text-text-primary font-medium text-sm">{activity.user}</p>
                        <p className="text-text-muted text-xs">{activity.action}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-accent font-bold text-sm">{activity.xp}</span>
                      <p className="text-text-muted text-xs">{activity.time}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Quick Stats */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="glass-card p-6"
            >
              <h2 className="text-xl font-bold text-text-primary mb-4 flex items-center">
                <BarChart3 className="h-5 w-5 mr-2 text-secondary" />
                Quick Stats
              </h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-text-muted">Server Uptime</span>
                  <span className="text-accent font-bold">99.9%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-text-muted">API Response</span>
                  <span className="text-accent font-bold">42ms</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-text-muted">Questions Answered</span>
                  <span className="text-accent font-bold">892.4K</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-text-muted">Study Hours</span>
                  <span className="text-accent font-bold">12,450h</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-text-muted">League Updates</span>
                  <span className="text-accent font-bold">Weekly</span>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* Placeholder sections for other tabs */}
        {selectedTab !== 'overview' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="glass-card p-12 text-center"
          >
            <div className="w-16 h-16 bg-surface rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Shield className="h-8 w-8 text-text-muted" />
            </div>
            <h3 className="text-xl font-bold text-text-primary mb-2">
              {selectedTab.charAt(0).toUpperCase() + selectedTab.slice(1)} Management
            </h3>
            <p className="text-text-muted">
              {selectedTab} management interface coming soon. Full CRUD operations will be available.
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
