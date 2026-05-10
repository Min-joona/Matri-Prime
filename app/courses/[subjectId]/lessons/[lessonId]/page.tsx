'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ChevronLeft,
  Lightbulb,
  AlertTriangle,
  GraduationCap,
  CheckCircle2,
  ArrowRight,
  Loader2,
  RefreshCw,
  Zap
} from 'lucide-react'

// Types
interface LessonContent {
  type: 'heading' | 'paragraph' | 'key-concept' | 'warning' | 'exam-tip' | 'formula' | 'example'
  level?: 2 | 3
  text?: string
  title?: string
  steps?: string[]
}

interface Lesson {
  id: string
  title: string
  subjectName: string
  chapterTitle: string
  content: LessonContent[]
  xpReward: number
  currentLesson: number
  totalLessons: number
  nextLessonId: string | null
}

// Mock data for development - will be replaced by API call
const mockLesson: Lesson = {
  id: 'lesson-1',
  title: 'Solving Linear Equations',
  subjectName: 'Mathematics',
  chapterTitle: 'Algebra Fundamentals',
  xpReward: 50,
  currentLesson: 2,
  totalLessons: 5,
  nextLessonId: 'lesson-2',
  content: [
    { type: 'heading', level: 2, text: 'What is a Linear Equation?' },
    { type: 'paragraph', text: 'A linear equation is an algebraic equation in which each term is either a constant or the product of a constant and a single variable. Linear equations can be written in the form ax + b = 0, where a and b are constants and x is the variable.' },
    { type: 'key-concept', title: 'Key Concept', text: 'The solution to a linear equation is the value of the variable that makes the equation true. We find this by isolating the variable on one side of the equation.' },
    { type: 'heading', level: 3, text: 'Steps to Solve Linear Equations' },
    { type: 'paragraph', text: 'Follow these systematic steps to solve any linear equation:' },
    { type: 'example', title: 'Example 1: Solve 3x + 7 = 22', steps: [
      'Step 1: Subtract 7 from both sides: 3x + 7 - 7 = 22 - 7',
      'Step 2: Simplify: 3x = 15',
      'Step 3: Divide both sides by 3: x = 15 / 3',
      'Step 4: Solution: x = 5'
    ]},
    { type: 'formula', text: 'ax + b = c  →  x = (c - b) / a' },
    { type: 'warning', title: 'Common Mistake', text: 'Remember to perform the same operation on BOTH sides of the equation. Many students forget to apply operations to both sides, leading to incorrect solutions.' },
    { type: 'heading', level: 2, text: 'Equations with Variables on Both Sides' },
    { type: 'paragraph', text: 'When variables appear on both sides of an equation, we need to first collect all variable terms on one side and all constant terms on the other side.' },
    { type: 'example', title: 'Example 2: Solve 5x - 3 = 2x + 9', steps: [
      'Step 1: Subtract 2x from both sides: 5x - 2x - 3 = 9',
      'Step 2: Simplify: 3x - 3 = 9',
      'Step 3: Add 3 to both sides: 3x = 12',
      'Step 4: Divide by 3: x = 4'
    ]},
    { type: 'exam-tip', title: 'Exam Tip', text: 'Always verify your answer by substituting it back into the original equation. On the ESSLCE, this can help you catch errors and earn partial credit even if you made calculation mistakes.' },
    { type: 'heading', level: 3, text: 'Practice Problems' },
    { type: 'paragraph', text: 'Try solving these equations on your own before moving to the quiz:' },
    { type: 'paragraph', text: '1. 4x - 8 = 20\n2. 7x + 14 = 3x - 6\n3. 2(x + 5) = 3x - 4' }
  ]
}

// Content Renderers
function ContentRenderer({ content }: { content: LessonContent }) {
  switch (content.type) {
    case 'heading':
      return content.level === 2 ? (
        <h2 className="text-2xl font-bold text-text-primary mt-8 mb-4 pl-4 border-l-4 border-primary">
          {content.text}
        </h2>
      ) : (
        <h3 className="text-xl font-semibold text-text-primary mt-6 mb-3 pl-4 border-l-4 border-primary/70">
          {content.text}
        </h3>
      )
    
    case 'paragraph':
      return (
        <p className="text-text-secondary text-base leading-relaxed mb-4 whitespace-pre-line">
          {content.text}
        </p>
      )
    
    case 'key-concept':
      return (
        <div className="bg-warning/10 border-l-4 border-warning rounded-r-xl p-4 my-6">
          <div className="flex items-center gap-2 mb-2">
            <Lightbulb className="h-5 w-5 text-warning" />
            <span className="font-semibold text-warning">{content.title}</span>
          </div>
          <p className="text-text-secondary text-base leading-relaxed">{content.text}</p>
        </div>
      )
    
    case 'warning':
      return (
        <div className="bg-danger/10 border-l-4 border-danger rounded-r-xl p-4 my-6">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="h-5 w-5 text-danger" />
            <span className="font-semibold text-danger">{content.title}</span>
          </div>
          <p className="text-text-secondary text-base leading-relaxed">{content.text}</p>
        </div>
      )
    
    case 'exam-tip':
      return (
        <div className="bg-primary/10 border-l-4 border-primary rounded-r-xl p-4 my-6">
          <div className="flex items-center gap-2 mb-2">
            <GraduationCap className="h-5 w-5 text-primary" />
            <span className="font-semibold text-primary">{content.title}</span>
          </div>
          <p className="text-text-secondary text-base leading-relaxed">{content.text}</p>
        </div>
      )
    
    case 'formula':
      return (
        <div className="flex justify-center my-6">
          <code className="bg-primary/20 text-primary px-4 py-2 rounded-lg font-mono text-lg">
            {content.text}
          </code>
        </div>
      )
    
    case 'example':
      return (
        <div className="bg-background-surface rounded-xl p-5 my-6 border border-border">
          <h4 className="font-semibold text-text-primary mb-4">{content.title}</h4>
          <div className="space-y-2">
            {content.steps?.map((step, idx) => (
              <div key={idx} className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center text-primary text-sm font-medium">
                  {idx + 1}
                </span>
                <p className="text-text-secondary text-base leading-relaxed font-mono text-sm">{step}</p>
              </div>
            ))}
          </div>
        </div>
      )
    
    default:
      return null
  }
}

// XP Animation Component
function XPAnimation({ xp, onComplete }: { xp: number; onComplete: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onComplete, 2000)
    return () => clearTimeout(timer)
  }, [onComplete])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.8 }}
      animate={{ opacity: 1, y: -50, scale: 1 }}
      exit={{ opacity: 0, y: -100, scale: 0.5 }}
      className="fixed bottom-32 left-1/2 -translate-x-1/2 z-50"
    >
      <div className="flex items-center gap-2 bg-primary text-black px-6 py-3 rounded-full shadow-lg shadow-primary/30">
        <Zap className="h-5 w-5" />
        <span className="font-bold text-lg">+{xp} XP</span>
      </div>
    </motion.div>
  )
}

export default function LessonPage() {
  const params = useParams()
  const router = useRouter()
  const subjectId = params.subjectId as string
  const lessonId = params.lessonId as string

  const [lesson, setLesson] = useState<Lesson | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [readingProgress, setReadingProgress] = useState(0)
  const [isCompleting, setIsCompleting] = useState(false)
  const [isCompleted, setIsCompleted] = useState(false)
  const [showXPAnimation, setShowXPAnimation] = useState(false)
  const [earnedXP, setEarnedXP] = useState(0)
  
  const contentRef = useRef<HTMLDivElement>(null)

  // Fetch lesson data
  const fetchLesson = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      // In production, this would be an API call:
      // const token = localStorage.getItem('token')
      // const res = await fetch(`/api/courses/${subjectId}/lessons/${lessonId}`, {
      //   headers: { Authorization: `Bearer ${token}` }
      // })
      // const data = await res.json()
      // setLesson(data.lesson)
      
      // Using mock data for now
      await new Promise(resolve => setTimeout(resolve, 500))
      setLesson(mockLesson)
    } catch (err) {
      setError('Failed to load lesson. Please try again.')
    } finally {
      setLoading(false)
    }
  }, [subjectId, lessonId])

  useEffect(() => {
    fetchLesson()
  }, [fetchLesson])

  // Track reading progress
  useEffect(() => {
    const handleScroll = () => {
      if (!contentRef.current) return
      
      const { scrollTop, scrollHeight, clientHeight } = document.documentElement
      const windowScroll = scrollTop
      const height = scrollHeight - clientHeight
      const scrolled = (windowScroll / height) * 100
      
      setReadingProgress(Math.min(scrolled, 100))
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Mark lesson as complete
  const handleComplete = async () => {
    if (isCompleting || isCompleted) return
    
    setIsCompleting(true)
    try {
      // In production:
      // const token = localStorage.getItem('token')
      // await fetch(`/api/courses/${subjectId}/lessons/${lessonId}/complete`, {
      //   method: 'POST',
      //   headers: {
      //     Authorization: `Bearer ${token}`,
      //     'Content-Type': 'application/json'
      //   },
      //   body: JSON.stringify({ userId: 'user-id', xpEarned: lesson?.xpReward || 50 })
      // })
      
      await new Promise(resolve => setTimeout(resolve, 800))
      setEarnedXP(lesson?.xpReward || 50)
      setShowXPAnimation(true)
      setIsCompleted(true)
    } catch (err) {
      setError('Failed to mark lesson as complete. Please try again.')
    } finally {
      setIsCompleting(false)
    }
  }

  const handleNextLesson = () => {
    if (lesson?.nextLessonId) {
      router.push(`/courses/${subjectId}/lessons/${lesson.nextLessonId}`)
    } else {
      router.push(`/courses/${subjectId}`)
    }
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0F172A] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 text-indigo-500 animate-spin" />
          <p className="text-slate-400">Loading lesson...</p>
        </div>
      </div>
    )
  }

  // Error state
  if (error && !lesson) {
    return (
      <div className="min-h-screen bg-[#0F172A] flex items-center justify-center p-4">
        <div className="bg-[#1E293B] rounded-xl p-6 max-w-md w-full text-center">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">Error Loading Lesson</h2>
          <p className="text-slate-400 mb-6">{error}</p>
          <button
            onClick={fetchLesson}
            className="inline-flex items-center gap-2 bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            <RefreshCw className="h-5 w-5" />
            Try Again
          </button>
        </div>
      </div>
    )
  }

  if (!lesson) return null

  return (
    <div className="min-h-screen bg-[#0F172A]">
      {/* Reading Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-slate-800 z-50">
        <motion.div
          className="h-full bg-indigo-500"
          style={{ width: `${readingProgress}%` }}
          transition={{ duration: 0.1 }}
        />
      </div>

      {/* Sticky Top Bar */}
      <header className="fixed top-1 left-0 right-0 bg-[#0F172A]/95 backdrop-blur-sm border-b border-slate-800 z-40">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <Link
                href={`/courses/${subjectId}`}
                className="flex-shrink-0 p-2 -m-2 text-slate-400 hover:text-white transition-colors"
              >
                <ChevronLeft className="h-6 w-6" />
              </Link>
              <div className="min-w-0">
                <h1 className="font-semibold text-white truncate">{lesson.subjectName}</h1>
                <p className="text-sm text-slate-400 truncate">{lesson.chapterTitle}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 flex-shrink-0">
              <span className="text-sm text-slate-400">
                {lesson.currentLesson}/{lesson.totalLessons}
              </span>
              <div className="flex items-center gap-1 bg-indigo-500/20 text-indigo-400 px-3 py-1 rounded-full text-sm font-medium">
                <Zap className="h-4 w-4" />
                {lesson.xpReward} XP
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main ref={contentRef} className="pt-24 pb-32 px-4">
        <div className="max-w-3xl mx-auto">
          {/* Lesson Title */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-bold text-white mb-2">{lesson.title}</h1>
            <p className="text-slate-400">{lesson.chapterTitle}</p>
          </motion.div>

          {/* Lesson Content */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {lesson.content.map((item, idx) => (
              <ContentRenderer key={idx} content={item} />
            ))}
          </motion.div>
        </div>
      </main>

      {/* XP Animation */}
      <AnimatePresence>
        {showXPAnimation && (
          <XPAnimation xp={earnedXP} onComplete={() => setShowXPAnimation(false)} />
        )}
      </AnimatePresence>

      {/* Bottom Sticky Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#0F172A]/95 backdrop-blur-sm border-t border-slate-800 p-4">
        <div className="max-w-3xl mx-auto">
          {!isCompleted ? (
            <button
              onClick={handleComplete}
              disabled={isCompleting}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white py-4 rounded-xl font-semibold text-lg transition-all"
            >
              {isCompleting ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Completing...
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-5 w-5" />
                  Mark as Complete
                </>
              )}
            </button>
          ) : (
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={handleNextLesson}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white py-4 rounded-xl font-semibold text-lg transition-all"
            >
              {lesson.nextLessonId ? (
                <>
                  Next Lesson
                  <ArrowRight className="h-5 w-5" />
                </>
              ) : (
                <>
                  Back to Course
                  <ArrowRight className="h-5 w-5" />
                </>
              )}
            </motion.button>
          )}
        </div>
      </div>
    </div>
  )
}
