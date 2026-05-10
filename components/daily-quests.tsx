'use client'

import { motion } from 'framer-motion'
import { Zap, Target, Clock, CheckCircle2 } from 'lucide-react'
import { useGamificationStore } from '@/stores/gamification-store'

export function DailyQuests() {
  const { quests } = useGamificationStore()
  
  const questIcons = {
    'daily-xp': Zap,
    'daily-questions': Target,
    'daily-study': Clock,
  }

  return (
    <div className="glass-card p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-text-primary">Daily Quests</h2>
        <span className="text-text-muted text-sm">
          {quests.filter(q => q.completed).length}/{quests.length} Completed
        </span>
      </div>
      
      <div className="space-y-4">
        {quests.map((quest, index) => {
          const Icon = questIcons[quest.id as keyof typeof questIcons] || Zap
          const isCompleted = quest.completed
          const progressPercentage = (quest.progress / quest.target) * 100
          
          return (
            <motion.div
              key={quest.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className={`p-4 rounded-xl border transition-all ${
                isCompleted 
                  ? 'bg-primary/10 border-primary/30' 
                  : 'bg-background-surface border-border'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${isCompleted ? 'bg-primary' : 'bg-primary/20'}`}>
                    {isCompleted ? (
                      <CheckCircle2 className="h-5 w-5 text-black" />
                    ) : (
                      <Icon className="h-5 w-5 text-primary" />
                    )}
                  </div>
                  <div>
                    <h3 className={`font-semibold ${isCompleted ? 'text-primary' : 'text-text-primary'}`}>
                      {quest.title}
                    </h3>
                    <p className="text-text-muted text-sm">{quest.description}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-primary font-bold text-sm">+{quest.xpReward} XP</span>
                </div>
              </div>
              
              {/* Progress Bar */}
              <div className="mt-3">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-text-muted">
                    {quest.progress}/{quest.target}
                  </span>
                  <span className={isCompleted ? 'text-primary' : 'text-primary'}>
                    {Math.round(progressPercentage)}%
                  </span>
                </div>
                <div className="h-2 bg-background-elevated rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercentage}%` }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="h-full rounded-full bg-primary"
                  />
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
