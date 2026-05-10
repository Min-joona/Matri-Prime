'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Home, 
  BookOpen, 
  Trophy, 
  Users, 
  Award,
  Flame
} from 'lucide-react'
import { useGamificationStore } from '@/stores/gamification-store'

export function MobileNav() {
  const pathname = usePathname()
  const { streak } = useGamificationStore()
  
  // Streak at risk threshold for pulsing Study button
  const streakAtRisk = streak < 3 && streak > 0
  
  const navItems = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Courses', path: '/courses', icon: BookOpen },
    { name: 'Leaderboard', path: '/leaderboard', icon: Trophy },
    { name: 'Community', path: '/community', icon: Users },
    { name: 'Scholarships', path: '/scholarships', icon: Award },
  ]

  return (
    <>
      {/* Center Study Button (Prominent) */}
      <div className="fixed bottom-20 left-1/2 transform -translate-x-1/2 z-50 md:hidden">
        <Link
          href="/courses"
          className={`relative flex items-center justify-center w-16 h-16 ${
            streakAtRisk 
              ? 'bg-danger animate-pulse shadow-glow-danger' 
              : 'bg-primary shadow-glow'
          } rounded-full transition-all duration-300 hover:scale-110 active:scale-95`}
        >
          <Flame className={`h-8 w-8 ${streakAtRisk ? 'text-white' : 'text-black'}`} />
          {/* Pulsing ring animation for streak at risk */}
          <AnimatePresence>
            {streakAtRisk && (
              <motion.div
                initial={{ scale: 1, opacity: 0.7 }}
                animate={{ scale: 1.5, opacity: 0 }}
                exit={{ scale: 1, opacity: 0 }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut" }}
                className="absolute inset-0 bg-danger rounded-full"
              />
            )}
          </AnimatePresence>
        </Link>
      </div>

      {/* Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-background/90 backdrop-blur-xl border-t border-border md:hidden">
        <div className="px-4 py-2 pb-safe">
          <div className="flex items-center justify-around">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.path
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`flex flex-col items-center p-2 transition-all ${
                    isActive ? 'text-primary' : 'text-text-muted'
                  }`}
                >
                  <Icon className={`h-5 w-5 ${isActive ? 'text-primary' : ''}`} />
                  <span className="text-xs mt-1 font-medium">{item.name}</span>
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute -bottom-0.5 w-1 h-1 bg-primary rounded-full"
                    />
                  )}
                </Link>
              )
            })}
          </div>
        </div>
      </nav>
    </>
  )
}
