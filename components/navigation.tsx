'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { useGamificationStore } from '@/stores/gamification-store'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Flame, 
  Trophy, 
  BookOpen, 
  Users, 
  Award, 
  Briefcase, 
  Zap,
  Bell,
  User,
  Menu,
  X
} from 'lucide-react'

export function Navigation() {
  const { user, signInWithGoogle } = useAuth()
  const pathname = usePathname()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [hasNotifications, setHasNotifications] = useState(true)
  
  // Gamification stats
  const { xp, level, streak, primeCoins } = useGamificationStore()
  
  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: BookOpen },
    { name: 'Courses', path: '/courses', icon: BookOpen },
    { name: 'Scholarships', path: '/scholarships', icon: Award },
    { name: 'Opportunities', path: '/opportunities', icon: Briefcase },
    { name: 'Community', path: '/community', icon: Users },
  ]

  // Check for streak risk (show notification if streak < 3 days)
  const streakAtRisk = streak < 3 && streak > 0

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <Link href="/" className="flex items-center space-x-2">
              <Flame className={`h-6 w-6 ${streakAtRisk ? 'text-danger' : 'text-secondary'} streak-flame`} />
              <span className="text-xl font-bold gradient-text">MatriPrime</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.path
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`flex items-center space-x-1 text-sm font-medium transition-colors ${
                    isActive ? 'text-primary' : 'text-text-muted hover:text-text-primary'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </Link>
              )
            })}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {/* XP Counter (Floating Pill) */}
            {user && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="hidden lg:flex items-center space-x-2"
              >
                <span className="px-3 py-1 bg-gradient-primary text-white rounded-full text-sm font-bold shadow-glow flex items-center space-x-1">
                  <Zap className="h-3 w-3" />
                  <span>{xp.toLocaleString()} XP</span>
                </span>
                <span className="text-xs text-text-muted">Lvl {level}</span>
              </motion.div>
            )}

            {/* Notification Bell */}
            <button className="relative p-2 rounded-lg hover:bg-surface transition-colors">
              <Bell className="h-5 w-5 text-text-muted hover:text-text-primary" />
              {hasNotifications && (
                <span className="absolute top-1 right-1 h-2 w-2 bg-danger rounded-full animate-pulse-slow" />
              )}
            </button>

            {/* Profile Section */}
            {user ? (
              <div className="flex items-center space-x-3">
                {/* Streak Indicator */}
                <div className="flex items-center space-x-1 bg-card-bg px-3 py-1 rounded-full border border-white/10">
                  <Flame className={`h-4 w-4 ${streakAtRisk ? 'text-danger' : 'text-amber-500'}`} />
                  <span className="text-sm font-semibold text-text-primary">{streak} DAYS</span>
                </div>
                
                {/* Avatar with Online Status */}
                <div className="relative">
                  {user.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt={user.displayName || 'User'}
                      className="h-8 w-8 rounded-full border-2 border-primary ring-2 ring-primary ring-offset-2 ring-offset-background"
                    />
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center border-2 border-primary ring-2 ring-primary ring-offset-2 ring-offset-background">
                      <User className="h-4 w-4 text-white" />
                    </div>
                  )}
                  <span className="absolute bottom-0 right-0 h-2 w-2 bg-accent rounded-full ring-2 ring-background" />
                </div>
              </div>
            ) : (
              <button
                onClick={signInWithGoogle}
                className="btn-primary text-sm px-4 py-2"
              >
                Sign In
              </button>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-surface transition-colors"
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden pb-4"
            >
              <div className="flex flex-col space-y-2">
                {navItems.map((item) => {
                  const Icon = item.icon
                  const isActive = pathname === item.path
                  return (
                    <Link
                      key={item.path}
                      href={item.path}
                      onClick={() => setIsMenuOpen(false)}
                      className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                        isActive ? 'bg-surface text-primary' : 'text-text-muted hover:bg-surface hover:text-text-primary'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{item.name}</span>
                    </Link>
                  )
                })}
                
                {user && (
                  <div className="pt-2 flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-sm">
                      <span className="text-text-muted">Lvl {level}</span>
                      <span className="text-primary">{xp} XP</span>
                    </div>
                    <button className="text-sm text-text-muted hover:text-danger">
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  )
}