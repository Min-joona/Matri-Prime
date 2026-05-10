'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  BookOpen, 
  Layers, 
  Target, 
  Clock, 
  TrendingUp, 
  Flame, 
  Trophy, 
  Zap,
  Calendar,
  ChevronRight,
  MoreHorizontal,
  Bookmark,
  Settings
} from 'lucide-react'
import { useGamificationStore } from '@/stores/gamification-store'
import { ProgressRing } from '@/components/progress-ring'
import { StreakCalendar } from '@/components/streak-calendar'
import { DailyQuests } from '@/components/daily-quests'
import { LeaderboardPreview } from '@/components/leaderboard-preview'
import { CourseProgress } from '@/components/course-progress'

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('overview')
  
  const { 
    xp, 
    level, 
    streak, 
    totalStudyTime, 
    totalQuestions, 
    averageScore,
    primeCoins,
    getLevelProgress,
    quests
  } = useGamificationStore()
  
  const levelProgress = getLevelProgress()
  
  const sidebarItems = [
    { name: 'My Courses', path: '/courses', icon: BookOpen },
    { name: 'Flashcards', path: '/flashcards', icon: Layers },
    { name: 'Quizzes', path: '/quizzes', icon: Target },
    { name: 'Saved', path: '/saved', icon: Bookmark },
    { name: 'Settings', path: '/settings', icon: Settings },
  ]
  
  const quickStats = [
    { label: 'Study Time', value: `${Math.floor(totalStudyTime)}h`, icon: Clock, color: 'text-primary' },
    { label: 'Questions', value: totalQuestions.toLocaleString(), icon: Zap, color: 'text-primary' },
    { label: 'Avg Score', value: `${averageScore}%`, icon: TrendingUp, color: 'text-primary' },
    { label: 'PrimeCoins', value: primeCoins, icon: Trophy, color: 'text-warning' },
  ]

  return (
    <div className="min-h-screen pt-20 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="hidden lg:block lg:col-span-1"
          >
            <div className="sticky top-24 space-y-6">
              {/* Profile Card */}
              <div className="glass-card p-6">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="relative">
                    <div className="w-16 h-16 rounded-full bg-gradient-primary flex items-center justify-center text-white text-2xl font-bold">
                      {level}
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-accent rounded-full flex items-center justify-center text-xs font-bold text-white border-2 border-background">
                      {levelProgress.percentage}%
                    </div>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-text-primary">Welcome Back!</h3>
                    <p className="text-text-muted text-sm">Level {level} Scholar</p>
                  </div>
                </div>
                
                {/* Level Progress Bar */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-text-muted">XP: {xp}</span>
                    <span className="text-text-muted">{levelProgress.current}/{levelProgress.next}</span>
                  </div>
                  <div className="h-2 bg-surface rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${levelProgress.percentage}%` }}
                      transition={{ duration: 1, delay: 0.3 }}
                      className="h-full bg-gradient-primary"
                    />
                  </div>
                </div>
                
                {/* Streak */}
                <div className="flex items-center justify-between bg-background-surface border border-border p-3 rounded-xl">
                  <div className="flex items-center space-x-2">
                    <Flame className="h-5 w-5 text-primary streak-flame" />
                    <span className="font-bold text-text-primary">{streak} DAYS</span>
                  </div>
                  <span className="text-text-muted text-sm">On Fire!</span>
                </div>
              </div>
              
              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-3">
                {quickStats.map((stat) => {
                  const Icon = stat.icon
                  return (
                    <div key={stat.label} className="glass-card p-4 text-center">
                      <Icon className={`h-5 w-5 mx-auto mb-1 ${stat.color}`} />
                      <p className="font-bold text-text-primary">{stat.value}</p>
                      <p className="text-xs text-text-muted">{stat.label}</p>
                    </div>
                  )
                })}
              </div>
              
              {/* Navigation */}
              <div className="glass-card p-4">
                {sidebarItems.map((item) => {
                  const Icon = item.icon
                  return (
                    <Link
                      key={item.name}
                      href={item.path}
                      className="flex items-center space-x-3 p-3 rounded-lg text-text-muted hover:bg-surface hover:text-text-primary transition-colors"
                    >
                      <Icon className="h-5 w-5" />
                      <span>{item.name}</span>
                    </Link>
                  )
                })}
              </div>
            </div>
          </motion.div>
          
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            
            {/* Welcome Banner */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="glass-card p-6 relative overflow-hidden"
            >
              <div className="relative z-10">
                <div className="flex items-center space-x-2 mb-2">
                  <Flame className="h-6 w-6 text-primary" />
                  <span className="text-2xl font-bold gradient-text">
                    {streak > 7 ? 'You&apos;re Unstoppable!' : streak > 3 ? 'Keep That Streak Going!' : 'Start Your Streak Today!'}
                  </span>
                </div>
                <p className="text-text-muted mb-4">
                  {quests.filter(q => q.completed).length}/3 daily quests completed. You're on a {streak}-day streak!
                </p>
                <Link href="/courses" className="btn-primary">
                  Continue Learning
                  <ChevronRight className="inline-block ml-1 h-4 w-4" />
                </Link>
              </div>
              
              {/* Decorative Element */}
              <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl" />
            </motion.div>
            
            {/* Daily Quests */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <DailyQuests />
            </motion.div>
            
            {/* Continue Learning */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-text-primary">Continue Learning</h2>
                <Link href="/courses" className="text-primary hover:text-primary-light text-sm">
                  View All
                </Link>
              </div>
              <CourseProgress />
            </motion.div>
            
            {/* Two Column Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Streak Calendar */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <StreakCalendar />
              </motion.div>
              
              {/* Leaderboard Preview */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <LeaderboardPreview />
              </motion.div>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  )
}
