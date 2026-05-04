import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface Badge {
  id: string
  name: string
  description: string
  icon: string
  unlockedAt: Date
}

interface Quest {
  id: string
  title: string
  description: string
  progress: number
  target: number
  xpReward: number
  completed: boolean
}

interface LeaderboardEntry {
  rank: number
  username: string
  xp: number
  level: number
  streak: number
  avatar?: string
}

interface GamificationState {
  // Core Stats
  xp: number
  level: number
  streak: number
  lastActivityDate: string | null
  totalStudyTime: number // in hours
  totalQuestions: number
  averageScore: number
  
  // Currency
  primeCoins: number
  
  // Achievements
  badges: Badge[]
  quests: Quest[]
  completedQuests: number
  
  // Leaderboard
  weeklyRank: number
  weeklyXP: number
  league: 'Bronze' | 'Silver' | 'Gold' | 'Platinum' | 'Diamond'
  
  // Actions
  addXP: (amount: number) => void
  maintainStreak: () => void
  resetStreak: () => void
  addBadge: (badge: Badge) => void
  updateQuestProgress: (questId: string, amount: number) => void
  addPrimeCoins: (amount: number) => void
  addStudyTime: (minutes: number) => void
  addQuestions: (count: number, score: number) => void
  getLevelRequirement: () => number
  getLevelProgress: () => { current: number; next: number }
  addWeeklyXP: (amount: number) => void
}

export const useGamificationStore = create(
  persist<GamificationState>(
    (set, get) => ({
      // Initial State
      xp: 0,
      level: 1,
      streak: 0,
      lastActivityDate: null,
      totalStudyTime: 0,
      totalQuestions: 0,
      averageScore: 0,
      primeCoins: 0,
      badges: [],
      quests: [],
      completedQuests: 0,
      weeklyRank: 999,
      weeklyXP: 0,
      league: 'Bronze',
      
      // Actions
      addXP: (amount) => {
        set((state) => {
          const newXP = state.xp + amount
          const newLevel = Math.floor(Math.sqrt(newXP / 100)) + 1
          const coinsEarned = Math.floor(amount / 10)
          
          const updatedQuests = state.quests.map(quest => {
            if (quest.id === 'daily-xp' && !quest.completed) {
              const newProgress = Math.min(quest.progress + amount, quest.target)
              return {
                ...quest,
                progress: newProgress,
                completed: newProgress >= quest.target
              }
            }
            return quest
          })
          
          return {
            xp: newXP,
            level: newLevel,
            quests: updatedQuests,
            primeCoins: state.primeCoins + coinsEarned
          }
        })
      },
      
      maintainStreak: () => {
        const today = new Date().toDateString()
        const state = get()
        
        if (state.lastActivityDate !== today) {
          set((state) => {
            const yesterday = new Date()
            yesterday.setDate(yesterday.getDate() - 1)
            
            const isConsecutive = state.lastActivityDate === yesterday.toDateString()
            const newStreak = isConsecutive ? state.streak + 1 : 1
            
            // Award streak bonuses
            const streakBonuses = [1, 7, 30, 100, 365]
            let xpBonus = 0
            if (streakBonuses.includes(newStreak)) {
              xpBonus = newStreak * 10
            }
            
            return {
              streak: newStreak,
              lastActivityDate: today,
              xp: state.xp + xpBonus
            }
          })
        }
      },
      
      resetStreak: () => set({ streak: 0 }),
      
      addBadge: (badge) => {
        set((state) => {
          const exists = state.badges.find(b => b.id === badge.id)
          if (!exists) {
            return {
              badges: [...state.badges, badge],
              xp: state.xp + 100, // Badge reward
            }
          }
          return state
        })
      },
      
      updateQuestProgress: (questId, amount) => {
        set((state) => {
          const quest = state.quests.find(q => q.id === questId)
          if (!quest || quest.completed) return state
          
          const newProgress = Math.min(quest.progress + amount, quest.target)
          const completed = newProgress >= quest.target
          const xpReward = completed ? quest.xpReward : 0
          
          return {
            quests: state.quests.map(q => 
              q.id === questId 
                ? { ...q, progress: newProgress, completed }
                : q
            ),
            xp: state.xp + xpReward,
            completedQuests: completed ? state.completedQuests + 1 : state.completedQuests,
            primeCoins: completed ? state.primeCoins + 5 : state.primeCoins
          }
        })
      },
      
      addPrimeCoins: (amount) => set((state) => ({ primeCoins: state.primeCoins + amount })),
      
      addStudyTime: (minutes) => {
        set((state) => {
          const newTotal = state.totalStudyTime + (minutes / 60)
          
          // Update study time quest
          const updatedQuests = state.quests.map(quest => {
            if (quest.id === 'daily-study' && !quest.completed) {
              return {
                ...quest,
                progress: Math.min(quest.progress + minutes, quest.target),
                completed: quest.progress + minutes >= quest.target
              }
            }
            return quest
          })
          
          return { totalStudyTime: newTotal, quests: updatedQuests }
        })
      },
      
      addQuestions: (count, score) => {
        set((state) => {
          const totalScore = state.averageScore * state.totalQuestions
          const newQuestions = state.totalQuestions + count
          const newAverageScore = (totalScore + score) / newQuestions
          
          // Update questions quest
          const updatedQuests = state.quests.map(quest => {
            if (quest.id === 'daily-questions' && !quest.completed) {
              return {
                ...quest,
                progress: Math.min(quest.progress + count, quest.target),
                completed: quest.progress + count >= quest.target
              }
            }
            return quest
          })
          
          return {
            totalQuestions: newQuestions,
            averageScore: newAverageScore,
            quests: updatedQuests
          }
        })
      },
      
      getLevelRequirement: () => {
        const state = get()
        return (state.level) ** 2 * 100
      },
      
      getLevelProgress: () => {
        const state = get()
        const currentLevelXP = ((state.level - 1) ** 2) * 100
        const nextLevelXP = (state.level ** 2) * 100
        const progress = ((state.xp - currentLevelXP) / (nextLevelXP - currentLevelXP)) * 100
        
        return {
          current: Math.floor(state.xp - currentLevelXP),
          next: Math.floor(nextLevelXP - currentLevelXP),
          percentage: Math.floor(progress)
        }
      },
      
      addWeeklyXP: (amount) => {
        set((state) => {
          const newWeeklyXP = state.weeklyXP + amount
          const newRank = Math.max(1, Math.floor(1000 / Math.log(newWeeklyXP || 1)))
          const league = calculateLeague(newRank)
          
          return { weeklyXP: newWeeklyXP, weeklyRank: newRank, league }
        })
      }
    }),
    {
      name: 'gamification-storage',
      partialize: (state) => ({
        xp: state.xp,
        level: state.level,
        streak: state.streak,
        lastActivityDate: state.lastActivityDate,
        totalStudyTime: state.totalStudyTime,
        totalQuestions: state.totalQuestions,
        averageScore: state.averageScore,
        primeCoins: state.primeCoins,
        badges: state.badges,
        quests: state.quests,
        completedQuests: state.completedQuests,
        weeklyRank: state.weeklyRank,
        weeklyXP: state.weeklyXP,
        league: state.league,
      }),
    }
  )
)

function calculateLeague(rank: number): GamificationState['league'] {
  if (rank <= 10) return 'Diamond'
  if (rank <= 50) return 'Platinum'
  if (rank <= 150) return 'Gold'
  if (rank <= 500) return 'Silver'
  return 'Bronze'
}

// Initialize daily quests
const initializeQuests = () => {
  const { quests } = useGamificationStore.getState()
  
  if (quests.length === 0) {
    useGamificationStore.setState({
      quests: [
        {
          id: 'daily-xp',
          title: 'XP Hunter',
          description: 'Earn 100 XP today',
          progress: 0,
          target: 100,
          xpReward: 50,
          completed: false,
        },
        {
          id: 'daily-questions',
          title: 'Quiz Master',
          description: 'Answer 20 questions',
          progress: 0,
          target: 20,
          xpReward: 30,
          completed: false,
        },
        {
          id: 'daily-study',
          title: 'Study Session',
          description: 'Study for 60 minutes',
          progress: 0,
          target: 60,
          xpReward: 40,
          completed: false,
        }
      ]
    })
  }
}

// Initialize on mount
if (typeof window !== 'undefined') {
  initializeQuests()
}