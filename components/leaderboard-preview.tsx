'use client'

import { motion } from 'framer-motion'
import { Trophy, Crown, Medal, TrendingUp, ChevronRight } from 'lucide-react'
import Link from 'next/link'

export function LeaderboardPreview() {
  const topStudents = [
    { rank: 1, name: 'Yoseph M.', level: 42, xp: 12500, streak: 89, avatar: 'bg-primary' },
    { rank: 2, name: 'Meron T.', level: 38, xp: 10800, streak: 76, avatar: 'bg-primary/70' },
    { rank: 3, name: 'Bereket A.', level: 35, xp: 9500, streak: 64, avatar: 'bg-primary/50' },
  ]
  
  const myRank = { rank: 47, level: 12, xp: 3400, streak: 14 }

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="h-5 w-5 text-primary" />
      case 2:
        return <Medal className="h-5 w-5 text-text-secondary" />
      case 3:
        return <Medal className="h-5 w-5 text-warning" />
      default:
        return <span className="text-text-muted font-semibold">{rank}</span>
    }
  }

  return (
    <div className="glass-card p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Trophy className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-bold text-text-primary">Weekly Leaderboard</h2>
        </div>
        <Link href="/leaderboard" className="text-primary text-sm hover:underline">
          View All
        </Link>
      </div>
      
      {/* Top 3 Podium */}
      <div className="flex justify-center items-end mb-6 space-x-4">
        {topStudents.slice(0, 3).map((student, index) => {
          const heights = ['h-20', 'h-28', 'h-24']
          const orders = [1, 0, 2]
          const order = orders[index]
          const height = heights[order]
          const isFirst = order === 0
          
          return (
            <motion.div
              key={student.rank}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`flex flex-col items-center ${order === 0 ? 'order-2' : order === 1 ? 'order-1' : 'order-3'}`}
            >
              <div className={`w-10 h-10 rounded-full ${student.avatar} flex items-center justify-center mb-2 ${isFirst ? 'ring-4 ring-primary/50 shadow-glow' : ''}`}>
                <span className="text-white font-bold text-sm">
                  {student.name.charAt(0)}
                </span>
              </div>
              <div className={`w-12 ${height} rounded-t-xl bg-gradient-to-t from-background-surface to-background-elevated flex items-end justify-center pb-2`}>
                <span className="text-text-primary font-bold">#{student.rank}</span>
              </div>
            </motion.div>
          )
        })}
      </div>
      
      {/* List */}
      <div className="space-y-3">
        {topStudents.map((student, index) => (
          <motion.div
            key={student.rank}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="flex items-center justify-between p-3 bg-background-surface rounded-xl hover:bg-background-elevated transition-colors border border-border"
          >
            <div className="flex items-center space-x-3">
              <div className="w-8 text-center">
                {getRankIcon(student.rank)}
              </div>
              <div className={`w-8 h-8 rounded-full ${student.avatar} flex items-center justify-center`}>
                <span className="text-white font-bold text-xs">
                  {student.name.charAt(0)}
                </span>
              </div>
              <div>
                <p className="font-semibold text-text-primary text-sm">{student.name}</p>
                <p className="text-text-muted text-xs">Level {student.level}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-bold text-text-primary text-sm">{student.xp.toLocaleString()} XP</p>
              <p className="text-text-muted text-xs">{student.streak} days</p>
            </div>
          </motion.div>
        ))}
        
        {/* My Position */}
        <div className="mt-4 pt-4 border-t border-white/10">
          <div className="flex items-center justify-between p-3 bg-primary/10 rounded-xl border border-primary/20">
            <div className="flex items-center space-x-3">
              <span className="text-text-muted font-semibold w-8">#{myRank.rank}</span>
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                <span className="text-white font-bold text-xs">YOU</span>
              </div>
              <div>
                <p className="font-semibold text-text-primary text-sm">You</p>
                <p className="text-text-muted text-xs">Level {myRank.level}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-bold text-primary text-sm">{myRank.xp.toLocaleString()} XP</p>
              <p className="text-text-muted text-xs">{myRank.streak} days</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* League Info */}
      <div className="mt-4 text-center">
        <span className="inline-flex items-center px-3 py-1 bg-primary/20 text-primary rounded-full text-xs font-semibold">
          <Trophy className="h-3 w-3 mr-1" />
          Bronze League
        </span>
        <p className="text-text-muted text-xs mt-2">
          Top 5 promote to Silver League
        </p>
      </div>
    </div>
  )
}
