'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X,
  Check,
  Clock,
  Zap,
  ChevronRight,
  RefreshCw,
  ArrowLeft,
  Share2,
  AlertTriangle,
  Loader2,
  Trophy,
  Target
} from 'lucide-react'

// Types
interface Question {
  id: string
  text: string
  options: string[]
  correctIndex: number
  explanation: string
  difficulty: 'Easy' | 'Medium' | 'Hard'
  chapter: string
  imageUrl?: string
}

interface QuizState {
  questions: Question[]
  currentIndex: number
  answers: (number | null)[]
  submitted: boolean[]
  xpEarned: number
  startTime: number
}

// Mock quiz questions for development
const mockQuestions: Question[] = [
  {
    id: 'q1',
    text: 'If 3x + 7 = 22, what is the value of x?',
    options: ['x = 3', 'x = 5', 'x = 7', 'x = 15'],
    correctIndex: 1,
    explanation: 'Subtract 7 from both sides: 3x = 15. Then divide by 3: x = 5.',
    difficulty: 'Easy',
    chapter: 'Algebra'
  },
  {
    id: 'q2',
    text: 'Solve for y: 2y - 8 = 3y + 4',
    options: ['y = -12', 'y = 12', 'y = -4', 'y = 4'],
    correctIndex: 0,
    explanation: 'Subtract 2y from both sides: -8 = y + 4. Subtract 4: y = -12.',
    difficulty: 'Medium',
    chapter: 'Algebra'
  },
  {
    id: 'q3',
    text: 'What is the slope of the line passing through points (2, 5) and (4, 11)?',
    options: ['m = 2', 'm = 3', 'm = 4', 'm = 6'],
    correctIndex: 1,
    explanation: 'Slope = (y2 - y1)/(x2 - x1) = (11 - 5)/(4 - 2) = 6/2 = 3.',
    difficulty: 'Medium',
    chapter: 'Coordinate Geometry'
  },
  {
    id: 'q4',
    text: 'Simplify: (x + 3)(x - 3)',
    options: ['x² - 9', 'x² + 9', 'x² - 6x + 9', 'x² + 6x - 9'],
    correctIndex: 0,
    explanation: 'This is a difference of squares: (a + b)(a - b) = a² - b². So (x + 3)(x - 3) = x² - 9.',
    difficulty: 'Easy',
    chapter: 'Algebra'
  },
  {
    id: 'q5',
    text: 'If f(x) = 2x² - 3x + 1, what is f(2)?',
    options: ['f(2) = 1', 'f(2) = 3', 'f(2) = 5', 'f(2) = 7'],
    correctIndex: 1,
    explanation: 'f(2) = 2(2)² - 3(2) + 1 = 2(4) - 6 + 1 = 8 - 6 + 1 = 3.',
    difficulty: 'Medium',
    chapter: 'Functions'
  },
  {
    id: 'q6',
    text: 'What is the derivative of f(x) = 3x⁴ - 2x² + 5?',
    options: ['12x³ - 4x', '12x³ - 4x + 5', '3x³ - 2x', '12x⁴ - 4x²'],
    correctIndex: 0,
    explanation: 'Using power rule: d/dx(3x⁴) = 12x³, d/dx(-2x²) = -4x, d/dx(5) = 0. Result: 12x³ - 4x.',
    difficulty: 'Hard',
    chapter: 'Calculus'
  },
  {
    id: 'q7',
    text: 'Solve: |2x - 6| = 10',
    options: ['x = 8 only', 'x = -2 only', 'x = 8 or x = -2', 'x = 2 or x = -8'],
    correctIndex: 2,
    explanation: '|2x - 6| = 10 gives us 2x - 6 = 10 or 2x - 6 = -10. Solving: x = 8 or x = -2.',
    difficulty: 'Medium',
    chapter: 'Algebra'
  },
  {
    id: 'q8',
    text: 'What is the sum of the interior angles of a hexagon?',
    options: ['540°', '720°', '900°', '1080°'],
    correctIndex: 1,
    explanation: 'Sum of interior angles = (n - 2) × 180° = (6 - 2) × 180° = 4 × 180° = 720°.',
    difficulty: 'Easy',
    chapter: 'Geometry'
  },
  {
    id: 'q9',
    text: 'Find the limit: lim(x→0) (sin x)/x',
    options: ['0', '1', 'undefined', 'infinity'],
    correctIndex: 1,
    explanation: 'This is a fundamental limit in calculus. lim(x→0) (sin x)/x = 1.',
    difficulty: 'Hard',
    chapter: 'Calculus'
  },
  {
    id: 'q10',
    text: 'If log₂(x) = 5, what is the value of x?',
    options: ['x = 10', 'x = 25', 'x = 32', 'x = 64'],
    correctIndex: 2,
    explanation: 'log₂(x) = 5 means 2⁵ = x, so x = 32.',
    difficulty: 'Medium',
    chapter: 'Logarithms'
  }
]

// Timer Component
function CircularTimer({ 
  totalSeconds, 
  remainingSeconds, 
  isWarning 
}: { 
  totalSeconds: number
  remainingSeconds: number
  isWarning: boolean 
}) {
  const radius = 20
  const circumference = 2 * Math.PI * radius
  const progress = (remainingSeconds / totalSeconds) * circumference
  const minutes = Math.floor(remainingSeconds / 60)
  const seconds = remainingSeconds % 60
  
  const colorClass = remainingSeconds <= 10 
    ? 'stroke-red-500' 
    : remainingSeconds <= 30 
      ? 'stroke-amber-500' 
      : 'stroke-lime-500'

  return (
    <div className="flex items-center gap-2">
      <svg width="48" height="48" className="-rotate-90">
        <circle
          cx="24"
          cy="24"
          r={radius}
          fill="none"
          className="stroke-slate-700"
          strokeWidth="4"
        />
        <circle
          cx="24"
          cy="24"
          r={radius}
          fill="none"
          className={colorClass}
          strokeWidth="4"
          strokeDasharray={circumference}
          strokeDashoffset={circumference - progress}
          strokeLinecap="round"
        />
      </svg>
      <span className={`font-mono font-bold ${
        remainingSeconds <= 10 ? 'text-red-500' : remainingSeconds <= 30 ? 'text-amber-500' : 'text-white'
      }`}>
        {minutes}:{seconds.toString().padStart(2, '0')}
      </span>
    </div>
  )
}

// Progress Dots
function ProgressDots({ 
  total, 
  current, 
  answers, 
  submitted 
}: { 
  total: number
  current: number
  answers: (number | null)[]
  submitted: boolean[] 
}) {
  return (
    <div className="flex items-center gap-1.5">
      {Array.from({ length: total }).map((_, idx) => (
        <div
          key={idx}
          className={`w-2.5 h-2.5 rounded-full transition-all ${
            idx === current 
              ? 'bg-lime-500 ring-2 ring-lime-500/30 animate-pulse' 
              : submitted[idx] 
                ? 'bg-lime-500' 
                : answers[idx] !== null 
                  ? 'bg-slate-500'
                  : 'bg-slate-700'
          }`}
        />
      ))}
    </div>
  )
}

// Results Screen Component
function ResultsScreen({
  questions,
  answers,
  xpEarned,
  timeTaken,
  onRetry,
  onBackToCourse,
  subjectId
}: {
  questions: Question[]
  answers: (number | null)[]
  xpEarned: number
  timeTaken: number
  onRetry: () => void
  onBackToCourse: () => void
  subjectId: string
}) {
  const correctCount = answers.filter((ans, idx) => ans === questions[idx]?.correctIndex).length
  const percentage = Math.round((correctCount / questions.length) * 100)
  
  // Find weak topics
  const weakTopics = questions
    .filter((q, idx) => answers[idx] !== q.correctIndex)
    .map(q => q.chapter)
    .filter((v, i, a) => a.indexOf(v) === i)
  
  const minutes = Math.floor(timeTaken / 60)
  const seconds = timeTaken % 60

  // SVG Circle animation
  const radius = 70
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (percentage / 100) * circumference

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center p-4"
    >
      <div className="max-w-md w-full bg-[#141414] border border-[#262626] rounded-2xl p-8 text-center">
        {/* Score Circle */}
        <div className="relative w-48 h-48 mx-auto mb-6">
          <svg width="192" height="192" className="-rotate-90">
            <circle
              cx="96"
              cy="96"
              r={radius}
              fill="none"
              className="stroke-slate-700"
              strokeWidth="12"
            />
            <motion.circle
              cx="96"
              cy="96"
              r={radius}
              fill="none"
              className="stroke-lime-500"
              strokeWidth="12"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset }}
              transition={{ duration: 1.5, ease: 'easeOut' }}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <motion.span 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-4xl font-bold text-white"
            >
              {percentage}%
            </motion.span>
            <span className="text-slate-400 text-sm">{correctCount}/{questions.length} correct</span>
          </div>
        </div>

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-2xl font-bold text-white mb-2">
            {percentage >= 80 ? 'Excellent Work!' : percentage >= 60 ? 'Good Job!' : 'Keep Practicing!'}
          </h2>
          <p className="text-slate-400 mb-6">
            {percentage >= 80 
              ? 'You&apos;ve mastered this topic!' 
              : percentage >= 60 
                ? 'You&apos;re making great progress!' 
                : 'Review the weak areas and try again!'}
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="grid grid-cols-2 gap-4 mb-6"
        >
          <div className="bg-[#1f1f1f] rounded-xl p-4">
            <div className="flex items-center justify-center gap-2 text-lime-500 mb-1">
              <Zap className="h-5 w-5" />
              <span className="font-bold text-lg">{xpEarned}</span>
            </div>
            <p className="text-slate-400 text-sm">XP Earned</p>
          </div>
          <div className="bg-[#1f1f1f] rounded-xl p-4">
            <div className="flex items-center justify-center gap-2 text-lime-400 mb-1">
              <Clock className="h-5 w-5" />
              <span className="font-bold text-lg">{minutes}:{seconds.toString().padStart(2, '0')}</span>
            </div>
            <p className="text-slate-400 text-sm">Time Taken</p>
          </div>
        </motion.div>

        {/* Weak Areas */}
        {weakTopics.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-6 text-left"
          >
            <h3 className="font-semibold text-red-400 mb-2 flex items-center gap-2">
              <Target className="h-4 w-4" />
              Areas to Review
            </h3>
            <div className="flex flex-wrap gap-2">
              {weakTopics.map((topic, idx) => (
                <span key={idx} className="bg-red-500/20 text-red-400 px-3 py-1 rounded-full text-sm">
                  {topic}
                </span>
              ))}
            </div>
          </motion.div>
        )}

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="flex flex-col sm:flex-row gap-3"
        >
          <button
            onClick={onRetry}
            className="flex-1 flex items-center justify-center gap-2 bg-[#1f1f1f] border border-[#262626] hover:border-lime-500/50 text-white py-3 px-4 rounded-xl font-semibold transition-colors"
          >
            <RefreshCw className="h-5 w-5" />
            Retry Quiz
          </button>
          <button
            onClick={onBackToCourse}
            className="flex-1 flex items-center justify-center gap-2 bg-lime-500 hover:bg-lime-400 text-black py-3 px-4 rounded-xl font-semibold transition-colors"
          >
            Back to Course
            <ChevronRight className="h-5 w-5" />
          </button>
        </motion.div>

        {/* Share Button */}
        <button className="mt-4 flex items-center justify-center gap-2 text-slate-400 hover:text-white mx-auto transition-colors">
          <Share2 className="h-4 w-4" />
          Share Results
        </button>
      </div>
    </motion.div>
  )
}

// Confetti Component (simple version)
function Confetti() {
  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {Array.from({ length: 50 }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ 
            x: Math.random() * window.innerWidth,
            y: -20,
            rotate: 0,
            scale: Math.random() * 0.5 + 0.5
          }}
          animate={{ 
            y: window.innerHeight + 20,
            rotate: Math.random() * 720,
          }}
          transition={{ 
            duration: Math.random() * 2 + 2,
            ease: 'linear'
          }}
          className="absolute w-3 h-3"
          style={{
            backgroundColor: ['#6366F1', '#F59E0B', '#10B981', '#EF4444', '#8B5CF6'][Math.floor(Math.random() * 5)],
            borderRadius: Math.random() > 0.5 ? '50%' : '0%'
          }}
        />
      ))}
    </div>
  )
}

export default function QuizPage() {
  const params = useParams()
  const router = useRouter()
  const searchParams = useSearchParams()
  const subjectId = params.subjectId as string
  const chapter = searchParams.get('chapter') || '1'
  const limit = parseInt(searchParams.get('limit') || '10')

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [quizState, setQuizState] = useState<QuizState | null>(null)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showExplanation, setShowExplanation] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [timeRemaining, setTimeRemaining] = useState(600) // 10 minutes
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  // Fetch quiz questions
  const fetchQuiz = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      // In production:
      // const token = localStorage.getItem('token')
      // const res = await fetch(`/api/courses/${subjectId}/quiz?chapter=${chapter}&limit=${limit}`, {
      //   headers: { Authorization: `Bearer ${token}` }
      // })
      // const data = await res.json()
      // if (!data.success) throw new Error(data.error)
      
      await new Promise(resolve => setTimeout(resolve, 500))
      const questions = mockQuestions.slice(0, limit)
      
      setQuizState({
        questions,
        currentIndex: 0,
        answers: new Array(questions.length).fill(null),
        submitted: new Array(questions.length).fill(false),
        xpEarned: 0,
        startTime: Date.now()
      })
      setTimeRemaining(questions.length * 60) // 1 minute per question
    } catch (err) {
      setError('Failed to load quiz. Please try again.')
    } finally {
      setLoading(false)
    }
  }, [subjectId, chapter, limit])

  useEffect(() => {
    fetchQuiz()
  }, [fetchQuiz])

  // Timer
  useEffect(() => {
    if (!quizState || showResults) return

    timerRef.current = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current!)
          setShowResults(true)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [quizState, showResults])

  const currentQuestion = quizState?.questions[quizState.currentIndex]
  const isCurrentSubmitted = quizState?.submitted[quizState.currentIndex]

  const handleSelectAnswer = (index: number) => {
    if (isCurrentSubmitted) return
    setSelectedAnswer(index)
  }

  const handleSubmitAnswer = () => {
    if (selectedAnswer === null || !quizState || !currentQuestion) return

    const isCorrect = selectedAnswer === currentQuestion.correctIndex
    const xpGain = isCorrect ? 15 : 0

    setQuizState(prev => {
      if (!prev) return prev
      const newAnswers = [...prev.answers]
      newAnswers[prev.currentIndex] = selectedAnswer
      const newSubmitted = [...prev.submitted]
      newSubmitted[prev.currentIndex] = true
      return {
        ...prev,
        answers: newAnswers,
        submitted: newSubmitted,
        xpEarned: prev.xpEarned + xpGain
      }
    })

    if (isCorrect) {
      setShowConfetti(true)
      setTimeout(() => setShowConfetti(false), 2000)
    }
    setShowExplanation(true)
  }

  const handleNextQuestion = () => {
    if (!quizState) return

    if (quizState.currentIndex === quizState.questions.length - 1) {
      // Quiz finished - save results
      // In production:
      // const timeTaken = Math.floor((Date.now() - quizState.startTime) / 1000)
      // fetch('/api/quiz-results', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      //   body: JSON.stringify({
      //     userId, subjectId, score: correctCount, xpEarned: quizState.xpEarned,
      //     answers: quizState.answers, timeTaken, weakTopics
      //   })
      // })
      setShowResults(true)
      if (timerRef.current) clearInterval(timerRef.current)
    } else {
      setQuizState(prev => prev ? { ...prev, currentIndex: prev.currentIndex + 1 } : prev)
      setSelectedAnswer(null)
      setShowExplanation(false)
    }
  }

  const handleRetry = () => {
    setShowResults(false)
    setSelectedAnswer(null)
    setShowExplanation(false)
    fetchQuiz()
  }

  const handleBackToCourse = () => {
    router.push(`/courses/${subjectId}`)
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0F172A] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 text-indigo-500 animate-spin" />
          <p className="text-slate-400">Loading quiz...</p>
        </div>
      </div>
    )
  }

  // Error state
  if (error || !quizState) {
    return (
      <div className="min-h-screen bg-[#0F172A] flex items-center justify-center p-4">
        <div className="bg-[#1E293B] rounded-xl p-6 max-w-md w-full text-center">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">Error Loading Quiz</h2>
          <p className="text-slate-400 mb-6">{error}</p>
          <button
            onClick={fetchQuiz}
            className="inline-flex items-center gap-2 bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            <RefreshCw className="h-5 w-5" />
            Try Again
          </button>
        </div>
      </div>
    )
  }

  // Results screen
  if (showResults) {
    const timeTaken = Math.floor((Date.now() - quizState.startTime) / 1000)
    return (
      <ResultsScreen
        questions={quizState.questions}
        answers={quizState.answers}
        xpEarned={quizState.xpEarned}
        timeTaken={timeTaken}
        onRetry={handleRetry}
        onBackToCourse={handleBackToCourse}
        subjectId={subjectId}
      />
    )
  }

  if (!currentQuestion) return null

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-emerald-500/20 text-emerald-400'
      case 'Medium': return 'bg-amber-500/20 text-amber-400'
      case 'Hard': return 'bg-red-500/20 text-red-400'
      default: return 'bg-slate-500/20 text-slate-400'
    }
  }

  const getOptionStyles = (index: number) => {
    if (!isCurrentSubmitted) {
      return selectedAnswer === index
        ? 'border-indigo-500 bg-indigo-500/10'
        : 'border-slate-700 bg-slate-800/50 hover:border-indigo-500/50'
    }

    if (index === currentQuestion.correctIndex) {
      return 'border-emerald-500 bg-emerald-500/20'
    }

    if (index === selectedAnswer && index !== currentQuestion.correctIndex) {
      return 'border-red-500 bg-red-500/20'
    }

    return 'border-slate-700 bg-slate-800/30 opacity-50'
  }

  return (
    <div className="min-h-screen bg-[#0F172A] flex flex-col">
      {/* Confetti */}
      <AnimatePresence>
        {showConfetti && <Confetti />}
      </AnimatePresence>

      {/* Top Bar */}
      <header className="bg-[#1E293B] border-b border-slate-800 p-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <ProgressDots
            total={quizState.questions.length}
            current={quizState.currentIndex}
            answers={quizState.answers}
            submitted={quizState.submitted}
          />
          
          <CircularTimer
            totalSeconds={quizState.questions.length * 60}
            remainingSeconds={timeRemaining}
            isWarning={timeRemaining <= 30}
          />
          
          <div className="flex items-center gap-1 bg-indigo-500/20 text-indigo-400 px-3 py-1.5 rounded-full text-sm font-medium">
            <Zap className="h-4 w-4" />
            {quizState.xpEarned} XP
          </div>
        </div>
      </header>

      {/* Question Card */}
      <main className="flex-1 flex items-center justify-center p-4">
        <motion.div
          key={quizState.currentIndex}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          className="w-full max-w-2xl"
        >
          {/* Question */}
          <div className="bg-[#1E293B] rounded-2xl p-6 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getDifficultyColor(currentQuestion.difficulty)}`}>
                {currentQuestion.difficulty}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-slate-700 text-slate-300">
                {currentQuestion.chapter}
              </span>
            </div>
            
            <h2 className="text-xl font-semibold text-white leading-relaxed">
              {currentQuestion.text}
            </h2>

            {currentQuestion.imageUrl && (
              <div className="mt-4 bg-slate-800 rounded-xl p-4 flex items-center justify-center">
                <span className="text-slate-500">Image placeholder</span>
              </div>
            )}
          </div>

          {/* Options */}
          <div className="space-y-3 mb-6">
            {currentQuestion.options.map((option, idx) => (
              <button
                key={idx}
                onClick={() => handleSelectAnswer(idx)}
                disabled={isCurrentSubmitted}
                className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left ${getOptionStyles(idx)}`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  isCurrentSubmitted && idx === currentQuestion.correctIndex
                    ? 'bg-emerald-500 text-white'
                    : isCurrentSubmitted && idx === selectedAnswer && idx !== currentQuestion.correctIndex
                      ? 'bg-red-500 text-white'
                      : selectedAnswer === idx
                        ? 'bg-indigo-500 text-white'
                        : 'bg-slate-700 text-slate-300'
                }`}>
                  {isCurrentSubmitted && idx === currentQuestion.correctIndex ? (
                    <Check className="h-5 w-5" />
                  ) : isCurrentSubmitted && idx === selectedAnswer && idx !== currentQuestion.correctIndex ? (
                    <X className="h-5 w-5" />
                  ) : (
                    String.fromCharCode(65 + idx)
                  )}
                </div>
                <span className={`text-base ${
                  isCurrentSubmitted && idx === currentQuestion.correctIndex
                    ? 'text-emerald-400'
                    : isCurrentSubmitted && idx === selectedAnswer && idx !== currentQuestion.correctIndex
                      ? 'text-red-400'
                      : 'text-white'
                }`}>
                  {option}
                </span>
              </button>
            ))}
          </div>

          {/* Explanation Panel */}
          <AnimatePresence>
            {showExplanation && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="bg-[#1E293B] rounded-2xl p-6 mb-6"
              >
                <div className="flex items-center gap-2 mb-3">
                  {selectedAnswer === currentQuestion.correctIndex ? (
                    <>
                      <div className="flex items-center gap-2 text-emerald-400">
                        <Check className="h-5 w-5" />
                        <span className="font-semibold">Correct! +15 XP</span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex items-center gap-2 text-red-400">
                        <X className="h-5 w-5" />
                        <span className="font-semibold">Not quite</span>
                      </div>
                    </>
                  )}
                </div>
                <p className="text-slate-300 leading-relaxed">{currentQuestion.explanation}</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Action Button */}
          {!isCurrentSubmitted ? (
            <button
              onClick={handleSubmitAnswer}
              disabled={selectedAnswer === null}
              className="w-full bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white py-4 rounded-xl font-semibold text-lg transition-all"
            >
              Submit Answer
            </button>
          ) : (
            <button
              onClick={handleNextQuestion}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white py-4 rounded-xl font-semibold text-lg transition-all"
            >
              {quizState.currentIndex === quizState.questions.length - 1 ? 'See Results' : 'Next Question'}
              <ChevronRight className="h-5 w-5" />
            </button>
          )}
        </motion.div>
      </main>
    </div>
  )
}
