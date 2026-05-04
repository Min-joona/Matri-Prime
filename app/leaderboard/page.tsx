'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Trophy, 
  Crown, 
  Medal, 
  Flame, 
  Zap, 
  ChevronDown,
  Users
} from 'lucide-react'

interface LeaderboardUser {
  id: string
  name: string
  level: number
  xp: number
  streak: number
  avatar?: string
  rankColor?: string
  online?: boolean
  isCurrentUser?: boolean
}

const leaderboardData: LeaderboardUser[] = [
  { id: '1', name: 'Yoseph M.', level: 42, xp: 12500, streak: 89, rankColor: 'bg-amber-400', online: true },
  { id: '2', name: 'Meron T.', level: 38, xp: 10800, streak: 76, rankColor: 'bg-slate-400', online: true },
  { id: '3', name: 'Bereket A.', level: 35, xp: 9500, streak: 64, rankColor: 'bg-amber-600', online: false },
  { id: '4', name: 'Tigist K.', level: 33, xp: 8900, streak: 58, rankColor: 'bg-primary', online: true },
  { id: '5', name: 'Dawit H.', level: 31, xp: 8200, streak: 52, rankColor: 'bg-secondary', online: false },
  { id: '6', name: 'Hanna B.', level: 29, xp: 7500, streak: 47, rankColor: 'bg-accent', online: true },
  { id: '7', name: 'Abel G.', level: 28, xp: 7100, streak: 43, rankColor: 'bg-primary', online: false },
  { id: '8', name: 'Selam W.', level: 27, xp: 6800, streak: 41, rankColor: 'bg-secondary', online: true },
  { id: '9', name: 'Kaleb T.', level: 26, xp: 6400, streak: 38, rankColor: 'bg-accent', online: false },
  { id: '10', name: 'You', level: 12, xp: 3400, streak: 14, rankColor: 'bg-primary', isCurrentUser: true, online: true },
]

const leagues = [
  { name: 'Bronze', color: 'text-amber-600', minXP: 0 },
  { name: 'Silver', color: 'text-slate-400', minXP: 5000 },
  { name: 'Gold', color: 'text-amber-400', minXP: 10000 },
  { name: 'Platinum', color: 'text-cyan-400', minXP: 20000 },
  { name: 'Diamond', color: 'text-purple-400', minXP: 50000 },
]

export default function Leaderboard() {
  const [sortBy, setSortBy] = useState<'xp' | 'streak'>('xp')
  const [timeRange, setTimeRange] = useState<'weekly' | 'monthly' | 'all'>('weekly')
  
  const sortedUsers = [...leaderboardData].sort((a, b) => {
    if (sortBy === 'xp') return b.xp - a.xp
    return b.streak - a.streak
  })

  const currentUser = leaderboardData.find(u => u.isCurrentUser)
  const userLeague = currentUser ? leagues.find(l => currentUser.xp >= l.minXP)?.name : 'Bronze'

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
            <Trophy className="h-8 w-8 text-secondary" />
            <h1 className="text-3xl sm:text-4xl font-bold gradient-text">Leaderboard</h1>
          </div>
          <p className="text-text-muted max-w-2xl mx-auto">
            Compete with fellow students and climb the ranks. Earn XP through studying to advance to higher leagues.
          </p>
        </motion.div>

        {/* League Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="glass-card p-6 mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-text-primary">Current League</h2>
              <p className="text-text-muted">{userLeague} League • Rank #{leaderboardData.findIndex(u => u.isCurrentUser) + 1}</p>
            </div>
            <div className="text-right">
              <span className={`text-2xl font-bold ${leagues.find(l => l.name === userLeague)?.color || 'text-amber-600'}`}>
                {userLeague}
              </span>
              <p className="text-text-muted text-sm">League</p>
            </div>
          </div>
          
          {/* League Progress */}
          <div className="space-y-2">
            {leagues.map((league, index) => {
              const isCurrent = league.name === userLeague
              const isPassed = currentUser && currentUser.xp > league.minXP && !isCurrent
              
              return (
                <div key={league.name} className="flex items-center space-x-3">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    isCurrent ? 'bg-secondary text-white' : isPassed ? 'bg-accent text-white' : 'bg-surface text-text-muted'
                  }`}>
                    {isPassed ? '✓' : index + 1}
                  </div>
                  <div className="flex-1">
                    <div className={`h-2 rounded-full ${isCurrent || isPassed ? 'bg-gradient-primary' : 'bg-surface'}`} style={{ width: isCurrent ? '60%' : isPassed ? '100%' : '0%' }} />
                  </div>
                  <span className={`text-sm font-semibold ${isCurrent ? 'text-secondary' : 'text-text-muted'}`}>
                    {league.name}
                  </span>
                </div>
              )
            })}
          </div>
          
          <p className="text-text-muted text-sm mt-4">
            Top 5 promote to next league • Bottom 5 demote
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-wrap items-center justify-between gap-4 mb-6"
        >
          <div className="flex items-center space-x-2">
            {(['weekly', 'monthly', 'all'] as const).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all capitalize ${
                  timeRange === range
                    ? 'bg-primary text-white shadow-glow'
                    : 'bg-surface text-text-muted hover:bg-surface-700 hover:text-text-primary'
                }`}
              >
                {range}
              </button>
            ))}
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setSortBy('xp')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center space-x-1 ${
                sortBy === 'xp'
                  ? 'bg-primary text-white'
                  : 'bg-surface text-text-muted hover:bg-surface-700'
              }`}
            >
              <Zap className="h-4 w-4" />
              <span>XP</span>
              <ChevronDown className={`h-4 w-4 transition-transform ${sortBy === 'xp' ? 'rotate-180' : ''}`} />
            </button>
            <button
              onClick={() => setSortBy('streak')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center space-x-1 ${
                sortBy === 'streak'
                  ? 'bg-secondary text-white'
                  : 'bg-surface text-text-muted hover:bg-surface-700'
              }`}
            >
              <Flame className="h-4 w-4" />
              <span>Streak</span>
              <ChevronDown className={`h-4 w-4 transition-transform ${sortBy === 'streak' ? 'rotate-180' : ''}`} />
            </button>
          </div>
        </motion.div>

        {/* Leaderboard List */}
        <div className="space-y-3">
          {sortedUsers.map((user, index) => {
            const actualRank = index + 1
            const isCurrentUser = user.isCurrentUser
            
            return (
              <motion.div
                key={user.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className={`flex items-center justify-between p-4 rounded-xl transition-colors ${
                  isCurrentUser
                    ? 'bg-primary/20 border-2 border-primary'
                    : 'bg-surface hover:bg-surface-700'
                }`}
              >
                {/* Rank & Avatar */}
                <div className="flex items-center space-x-4">
                  <div className={`w-10 text-center font-bold text-lg ${
                    actualRank <= 3 ? 'text-amber-400' : 'text-text-muted'
                  }`}>
                    {actualRank === 1 ? (
                      <Crown className="h-6 w-6 text-amber-400 mx-auto" />
                    ) : actualRank === 2 ? (
                      <Medal className="h-6 w-6 text-slate-400 mx-auto" />
                    ) : actualRank === 3 ? (
                      <Medal className="h-6 w-6 text-amber-600 mx-auto" />
                    ) : (
                      actualRank
                    )}
                  </div>
                  <div className="relative">
                    {user.avatar ? (
                      <img src={user.avatar} alt={user.name} className="w-12 h-12 rounded-full" />
                    ) : (
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold ${
                        user.rankColor || 'bg-primary'
                      }`}>
                        {user.name.charAt(0)}
                      </div>
                    )}
                    {user.online && (
                      <span className="absolute bottom-0 right-0 w-3 h-3 bg-accent rounded-full ring-2 ring-background" />
                    )}
                  </div>
                  <div>
                    <h3 className={`font-bold ${isCurrentUser ? 'text-primary' : 'text-text-primary'}`}>
                      {user.name}
                      {isCurrentUser && <span className="text-text-muted text-sm font-normal"> (You)</span>}
                    </h3>
                    <div className="flex items-center space-x-3 text-sm text-text-muted">
                      <span>Level {user.level}</span>
                      <span>•</span>
                      <span className="flex items-center space-x-1">
                        <Flame className="h-3 w-3 text-secondary" />
                        <span>{user.streak}</span>
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* Stats */}
                <div className="text-right">
                  <p className="font-bold text-text-primary">{user.xp.toLocaleString()} XP</p>
                  <p className="text-text-muted text-xs">This week</p>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Promotion/Demotion Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-8 glass-card p-6"
        >
          <h3 className="font-bold text-text-primary mb-4">League Rules</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center shrink-0">
                <Trophy className="h-4 w-4 text-accent" />
              </div>
              <div>
                <h4 className="font-semibold text-text-primary">Promotion</h4>
                <p className="text-text-muted text-sm">Top 5 students advance to the next league at week's end</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 rounded-full bg-danger/20 flex items-center justify-center shrink-0">
                <Users className="h-4 w-4 text-danger" />
              </div>
              <div>
                <h4 className="font-semibold text-text-primary">Demotion</h4>
                <p className="text-text-muted text-sm">Bottom 5 students drop to the previous league</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
