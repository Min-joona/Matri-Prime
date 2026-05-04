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
  PlusCircle,
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
      <div className="fixed bottom-20 left-1/2 transform -translate-x-1/2 z-50">
        <Link
          href="/courses"
          className={`relative flex items-center justify-center w-16 h-16 ${
            streakAtRisk 
              ? 'bg-danger animate-pulse shadow-glow-danger' 
              : 'bg-gradient-to-r from-secondary to-accent shadow-glow'
          } rounded-full transition-all duration-300 hover:scale-110 active:scale-95`}
        >
          <Flame className="h-8 w-8 text-white" />
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
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-background/80 backdrop-blur-xl border-t border-white/10 md:hidden">
        <div className="px-4 py-2">
          <div className="flex items-center justify-around">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.path
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`flex flex-col items-center p-2 transition-transform ${
                    isActive ? 'text-primary' : 'text-text-muted hover:text-text-primary'
                  }`}
                >
                  <Icon className={`h-5 w-5 ${isActive ? 'fill-primary' : ''}`} />
                  <span className="text-xs mt-1">{item.name}</span>
                </Link>
              )
            })}
          </div>
        </div>
      </nav>
    </>
  )
}