'use client'

import { motion } from 'framer-motion'
import { Flame, Calendar } from 'lucide-react'

export function StreakCalendar() {
  // Generate last 49 days (7 weeks) of calendar data
  const days = Array.from({ length: 49 }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() - (48 - i))
    return {
      date: date.toISOString().split('T')[0],
      day: date.getDate(),
      month: date.getMonth(),
      hasActivity: Math.random() > 0.3,
      intensity: Math.random() > 0.7 ? 3 : Math.random() > 0.5 ? 2 : 1,
    }
  })
  
  // Get current streak
  const currentStreak = 47

  const getColor = (hasActivity: boolean, intensity: number) => {
    if (!hasActivity) return 'bg-surface hover:bg-surface-600'
    const colors = {
      1: 'bg-secondary/40 hover:bg-secondary/60',
      2: 'bg-secondary/70 hover:bg-secondary/80',
      3: 'bg-secondary hover:bg-secondary/90',
    }
    return colors[intensity as keyof typeof colors] || colors[1]
  }

  return (
    <div className="glass-card p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Calendar className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-bold text-text-primary">Study Streak</h2>
        </div>
        <div className="flex items-center space-x-2">
          <Flame className="h-5 w-5 text-secondary" />
          <span className="font-bold text-text-primary">{currentStreak} Days</span>
        </div>
      </div>
      
      {/* GitHub-style contribution grid */}
      <div className="grid grid-cols-7 gap-1.5">
        {days.map((day, index) => (
          <motion.div
            key={day.date}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2, delay: index * 0.01 }}
            className={`aspect-square rounded-sm ${getColor(day.hasActivity, day.intensity)} cursor-pointer transition-all hover:scale-110`}
            title={`${day.date}: ${day.hasActivity ? 'Active' : 'No activity'}`}
          />
        ))}
      </div>
      
      {/* Legend */}
      <div className="flex items-center justify-between mt-4 text-xs text-text-muted">
        <span>Less</span>
        <div className="flex space-x-1">
          <div className="w-3 h-3 rounded-sm bg-surface" />
          <div className="w-3 h-3 rounded-sm bg-secondary/40" />
          <div className="w-3 h-3 rounded-sm bg-secondary/70" />
          <div className="w-3 h-3 rounded-sm bg-secondary" />
        </div>
        <span>More</span>
      </div>
    </div>
  )
}
