'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Cards, 
  Brain, 
  Clock, 
  Zap, 
  RotateCcw, 
  CheckCircle2, 
  XCircle,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Trophy
} from 'lucide-react'
import { useGamificationStore } from '@/stores/gamification-store'

interface Flashcard {
  id: string
  front: string
  back: string
  subject: string
  difficulty: 'easy' | 'medium' | 'hard'
  tags: string[]
}

const mockFlashcards: Flashcard[] = [
  {
    id: '1',
    front: 'What is the quadratic formula?',
    back: 'x = (-b ± √(b² - 4ac)) / 2a',
    subject: 'Mathematics',
    difficulty: 'medium',
    tags: ['algebra', 'equations']
  },
  {
    id: '2',
    front: 'Define photosynthesis',
    back: 'The process by which plants convert light energy into chemical energy (glucose) using carbon dioxide and water, releasing oxygen.',
    subject: 'Biology',
    difficulty: 'easy',
    tags: ['plants', 'energy']
  },
  {
    id: '3',
    front: 'What is Newton\'s Second Law?',
    back: 'F = ma. Force equals mass times acceleration.',
    subject: 'Physics',
    difficulty: 'medium',
    tags: ['forces', 'motion']
  },
  {
    id: '4',
    front: 'Name the 1995 Ethiopian Constitution article on equality',
    back: 'Article 25 - All persons are equal before the law',
    subject: 'Civics',
    difficulty: 'hard',
    tags: ['constitution', 'rights']
  },
  {
    id: '5',
    front: 'What is the capital city of Ethiopia?',
    back: 'Addis Ababa (New Flower)',
    subject: 'Geography',
    difficulty: 'easy',
    tags: ['cities', 'ethiopia']
  }
]

export default function Flashcards() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [showAnswer, setShowAnswer] = useState(false)
  const [studyMode, setStudyMode] = useState<'standard' | 'speed'>('standard')
  const [sessionStats, setSessionStats] = useState({ correct: 0, incorrect: 0, total: 0 })
  const [isCompleted, setIsCompleted] = useState(false)
  const [timer, setTimer] = useState(0)
  
  const { addXP, addQuestions } = useGamificationStore()

  const currentCard = mockFlashcards[currentIndex]
  const progress = ((currentIndex + 1) / mockFlashcards.length) * 100

  const handleFlip = () => {
    setIsFlipped(!isFlipped)
    setShowAnswer(true)
  }

  const handleRate = (rating: 'again' | 'hard' | 'good' | 'easy') => {
    const isCorrect = rating === 'good' || rating === 'easy'
    
    setSessionStats(prev => ({
      correct: isCorrect ? prev.correct + 1 : prev.correct,
      incorrect: !isCorrect ? prev.incorrect + 1 : prev.incorrect,
      total: prev.total + 1
    }))

    // Award XP
    const xpAmount = rating === 'easy' ? 15 : rating === 'good' ? 10 : 5
    addXP(xpAmount)
    addQuestions(1, isCorrect ? 100 : 0)

    // Move to next card
    if (currentIndex < mockFlashcards.length - 1) {
      setCurrentIndex(prev => prev + 1)
      setIsFlipped(false)
      setShowAnswer(false)
    } else {
      setIsCompleted(true)
    }
  }

  const handleRestart = () => {
    setCurrentIndex(0)
    setIsFlipped(false)
    setShowAnswer(false)
    setIsCompleted(false)
    setSessionStats({ correct: 0, incorrect: 0, total: 0 })
  }

  const accuracy = sessionStats.total > 0 
    ? Math.round((sessionStats.correct / sessionStats.total) * 100) 
    : 0

  if (isCompleted) {
    return (
      <div className="min-h-screen pt-20 pb-24">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card p-8 text-center"
          >
            <div className="w-20 h-20 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Trophy className="h-10 w-10 text-accent" />
            </div>
            <h2 className="text-3xl font-bold text-text-primary mb-4">Session Complete!</h2>
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="bg-surface p-4 rounded-xl">
                <p className="text-2xl font-bold text-accent">{sessionStats.correct}</p>
                <p className="text-text-muted text-sm">Correct</p>
              </div>
              <div className="bg-surface p-4 rounded-xl">
                <p className="text-2xl font-bold text-danger">{sessionStats.incorrect}</p>
                <p className="text-text-muted text-sm">Incorrect</p>
              </div>
              <div className="bg-surface p-4 rounded-xl">
                <p className="text-2xl font-bold text-primary">{accuracy}%</p>
                <p className="text-text-muted text-sm">Accuracy</p>
              </div>
            </div>
            <p className="text-text-muted mb-6">
              You earned {sessionStats.correct * 10 + sessionStats.total * 5} XP!
            </p>
            <button onClick={handleRestart} className="btn-primary">
              <RotateCcw className="h-5 w-5 inline-block mr-2" />
              Study Again
            </button>
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-20 pb-24">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Cards className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold gradient-text">Smart Flashcards</h1>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full h-2 bg-surface rounded-full overflow-hidden mb-4">
            <motion.div
              className="h-full bg-gradient-primary"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
          
          <div className="flex items-center justify-between text-sm text-text-muted">
            <span>Card {currentIndex + 1} of {mockFlashcards.length}</span>
            <div className="flex items-center space-x-4">
              <span className="flex items-center space-x-1">
                <CheckCircle2 className="h-4 w-4 text-accent" />
                <span>{sessionStats.correct}</span>
              </span>
              <span className="flex items-center space-x-1">
                <XCircle className="h-4 w-4 text-danger" />
                <span>{sessionStats.incorrect}</span>
              </span>
            </div>
          </div>
        </motion.div>

        {/* Flashcard */}
        <div className="perspective-1000 mb-8">
          <motion.div
            onClick={handleFlip}
            className="relative w-full aspect-[4/3] cursor-pointer"
            animate={{ rotateY: isFlipped ? 180 : 0 }}
            transition={{ duration: 0.6, type: 'spring' }}
            style={{ transformStyle: 'preserve-3d' }}
          >
            {/* Front */}
            <div 
              className="absolute inset-0 glass-card p-8 flex flex-col items-center justify-center text-center backface-hidden"
              style={{ backfaceVisibility: 'hidden' }}
            >
              <span className={`px-3 py-1 rounded-full text-xs font-semibold mb-4 ${
                currentCard.difficulty === 'easy' ? 'bg-accent/20 text-accent' :
                currentCard.difficulty === 'medium' ? 'bg-secondary/20 text-secondary' :
                'bg-danger/20 text-danger'
              }`}>
                {currentCard.difficulty.charAt(0).toUpperCase() + currentCard.difficulty.slice(1)}
              </span>
              <h3 className="text-2xl font-bold text-text-primary mb-4">{currentCard.front}</h3>
              <p className="text-text-muted text-sm">Click to reveal answer</p>
              
              <div className="mt-6 flex flex-wrap gap-2">
                {currentCard.tags.map(tag => (
                  <span key={tag} className="px-2 py-1 bg-surface rounded-full text-xs text-text-muted">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Back */}
            <div 
              className="absolute inset-0 glass-card p-8 flex flex-col items-center justify-center text-center"
              style={{ 
                backfaceVisibility: 'hidden',
                transform: 'rotateY(180deg)'
              }}
            >
              <div className="flex items-center space-x-2 mb-4">
                <Sparkles className="h-5 w-5 text-accent" />
                <span className="text-accent font-semibold">Answer</span>
              </div>
              <p className="text-xl text-text-primary">{currentCard.back}</p>
              <p className="text-text-muted text-sm mt-4">{currentCard.subject}</p>
            </div>
          </motion.div>
        </div>

        {/* Rating Buttons */}
        <AnimatePresence>
          {showAnswer && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="grid grid-cols-4 gap-2"
            >
              <button
                onClick={() => handleRate('again')}
                className="p-3 rounded-xl bg-danger/20 text-danger font-semibold hover:bg-danger/30 transition-colors"
              >
                <div className="text-xs text-danger/70 mb-1">&lt; 1 min</div>
                Again
              </button>
              <button
                onClick={() => handleRate('hard')}
                className="p-3 rounded-xl bg-secondary/20 text-secondary font-semibold hover:bg-secondary/30 transition-colors"
              >
                <div className="text-xs text-secondary/70 mb-1">&lt; 6 min</div>
                Hard
              </button>
              <button
                onClick={() => handleRate('good')}
                className="p-3 rounded-xl bg-primary/20 text-primary font-semibold hover:bg-primary/30 transition-colors"
              >
                <div className="text-xs text-primary/70 mb-1">&lt; 10 min</div>
                Good
              </button>
              <button
                onClick={() => handleRate('easy')}
                className="p-3 rounded-xl bg-accent/20 text-accent font-semibold hover:bg-accent/30 transition-colors"
              >
                <div className="text-xs text-accent/70 mb-1">&gt; 10 min</div>
                Easy
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Study Mode */}
        <div className="mt-8 flex items-center justify-center space-x-4">
          <button
            onClick={() => setStudyMode('standard')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              studyMode === 'standard' 
                ? 'bg-primary text-white' 
                : 'bg-surface text-text-muted hover:text-text-primary'
            }`}
          >
            Standard Mode
          </button>
          <button
            onClick={() => setStudyMode('speed')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              studyMode === 'speed' 
                ? 'bg-secondary text-white' 
                : 'bg-surface text-text-muted hover:text-text-primary'
            }`}
          >
            <Zap className="h-4 w-4 inline-block mr-1" />
            Speed Run
          </button>
        </div>
      </div>
    </div>
  )
}
