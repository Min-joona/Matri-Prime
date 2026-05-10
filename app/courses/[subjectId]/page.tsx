'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  BookOpen,
  Video,
  Layers,
  Target,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  Clock,
  CheckCircle2,
  PlayCircle,
  Lock,
  Star,
  Users,
  Trophy,
  Zap
} from 'lucide-react'
import { useGamificationStore } from '@/stores/gamification-store'

interface Unit {
  id: string
  title: string
  description: string
  completedLessons: number
  totalLessons: number
  lessons: Lesson[]
}

interface Lesson {
  id: string
  title: string
  type: 'notes' | 'video' | 'flashcards' | 'quiz'
  duration: number
  xpReward: number
  completed: boolean
  locked: boolean
}

const mockUnits: Record<string, Unit[]> = {
  mathematics: [
    {
      id: 'unit-1',
      title: 'Unit 1: Algebra Fundamentals',
      description: 'Master the basics of algebraic expressions and equations',
      completedLessons: 3,
      totalLessons: 5,
      lessons: [
        { id: 'l1', title: 'Introduction to Variables', type: 'notes', duration: 15, xpReward: 50, completed: true, locked: false },
        { id: 'l2', title: 'Solving Linear Equations', type: 'video', duration: 20, xpReward: 60, completed: true, locked: false },
        { id: 'l3', title: 'Inequalities', type: 'flashcards', duration: 10, xpReward: 40, completed: true, locked: false },
        { id: 'l4', title: 'Systems of Equations', type: 'notes', duration: 25, xpReward: 70, completed: false, locked: false },
        { id: 'l5', title: 'Unit Quiz', type: 'quiz', duration: 30, xpReward: 100, completed: false, locked: false },
      ]
    },
    {
      id: 'unit-2',
      title: 'Unit 2: Quadratic Equations',
      description: 'Learn to solve and graph quadratic functions',
      completedLessons: 0,
      totalLessons: 4,
      lessons: [
        { id: 'l6', title: 'Introduction to Quadratics', type: 'notes', duration: 20, xpReward: 50, completed: false, locked: false },
        { id: 'l7', title: 'Factoring Quadratics', type: 'video', duration: 25, xpReward: 60, completed: false, locked: false },
        { id: 'l8', title: 'Quadratic Formula', type: 'flashcards', duration: 15, xpReward: 50, completed: false, locked: false },
        { id: 'l9', title: 'Unit Quiz', type: 'quiz', duration: 30, xpReward: 100, completed: false, locked: false },
      ]
    },
    {
      id: 'unit-3',
      title: 'Unit 3: Functions & Graphs',
      description: 'Understanding functions and their graphical representations',
      completedLessons: 0,
      totalLessons: 5,
      lessons: [
        { id: 'l10', title: 'Function Basics', type: 'notes', duration: 20, xpReward: 50, completed: false, locked: true },
        { id: 'l11', title: 'Domain and Range', type: 'video', duration: 20, xpReward: 60, completed: false, locked: true },
        { id: 'l12', title: 'Graphing Functions', type: 'video', duration: 30, xpReward: 70, completed: false, locked: true },
        { id: 'l13', title: 'Transformations', type: 'flashcards', duration: 15, xpReward: 50, completed: false, locked: true },
        { id: 'l14', title: 'Unit Quiz', type: 'quiz', duration: 30, xpReward: 100, completed: false, locked: true },
      ]
    }
  ]
}

const getLessonIcon = (type: string) => {
  switch (type) {
    case 'notes': return BookOpen
    case 'video': return Video
    case 'flashcards': return Layers
    case 'quiz': return Target
    default: return BookOpen
  }
}

export default function SubjectDetail() {
  const params = useParams()
  const subjectId = params.subjectId as string
  const [expandedUnits, setExpandedUnits] = useState<string[]>(['unit-1'])
  
  const units = mockUnits[subjectId] || mockUnits['mathematics']
  
  const completedLessons = units.reduce((acc, unit) => acc + unit.completedLessons, 0)
  const totalLessons = units.reduce((acc, unit) => acc + unit.totalLessons, 0)
  const progress = Math.round((completedLessons / totalLessons) * 100)

  const toggleUnit = (unitId: string) => {
    setExpandedUnits(prev => 
      prev.includes(unitId) 
        ? prev.filter(id => id !== unitId)
        : [...prev, unitId]
    )
  }

  return (
    <div className="min-h-screen pt-20 pb-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Link href="/courses" className="inline-flex items-center text-text-muted hover:text-text-primary mb-6 transition-colors">
            <ChevronLeft className="h-5 w-5 mr-1" />
            Back to Courses
          </Link>
        </motion.div>

        {/* Subject Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="glass-card p-6 mb-8"
        >
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-text-primary capitalize mb-2">
                {subjectId.replace('-', ' ')}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-text-muted text-sm">
                <div className="flex items-center space-x-1">
                  <BookOpen className="h-4 w-4" />
                  <span>{units.length} Units</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="h-4 w-4" />
                  <span>{totalLessons} Lessons</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Users className="h-4 w-4" />
                  <span>12,500 enrolled</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Star className="h-4 w-4 text-primary" />
                  <span>4.9 rating</span>
                </div>
              </div>
            </div>
            
            {/* Progress */}
            <div className="w-full md:w-48">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-text-muted">Progress</span>
                <span className="text-primary font-bold">{progress}%</span>
              </div>
              <div className="h-3 bg-background-surface rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.8 }}
                  className="h-full bg-primary"
                />
              </div>
              <p className="text-text-muted text-xs mt-1">
                {completedLessons}/{totalLessons} completed
              </p>
            </div>
          </div>
        </motion.div>

        {/* Units */}
        <div className="space-y-4">
          {units.map((unit, unitIndex) => (
            <motion.div
              key={unit.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: unitIndex * 0.1 }}
              className="glass-card overflow-hidden"
            >
              {/* Unit Header */}
              <div 
                className={`p-6 cursor-pointer transition-colors ${
                  expandedUnits.includes(unit.id) ? 'bg-primary/5' : 'hover:bg-background-surface'
                }`}
                onClick={() => toggleUnit(unit.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h2 className="font-bold text-text-primary text-lg mb-1">{unit.title}</h2>
                    <p className="text-text-muted text-sm">{unit.description}</p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right hidden sm:block">
                      <p className="text-text-muted text-sm">
                        {unit.completedLessons}/{unit.totalLessons} Lessons
                      </p>
                      <div className="w-24 h-2 bg-background-surface rounded-full overflow-hidden mt-1">
                        <div 
                          className="h-full bg-primary"
                          style={{ width: `${(unit.completedLessons / unit.totalLessons) * 100}%` }}
                        />
                      </div>
                    </div>
                    <div className="p-2 rounded-full bg-background-surface hover:bg-background-elevated transition-colors">
                      {expandedUnits.includes(unit.id) ? (
                        <ChevronUp className="h-5 w-5 text-text-primary" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-text-primary" />
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Lessons */}
              <AnimatePresence>
                {expandedUnits.includes(unit.id) && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="border-t border-border"
                  >
                    <div className="p-6 space-y-3">
                      {unit.lessons.map((lesson, lessonIndex) => {
                        const Icon = getLessonIcon(lesson.type)
                        return (
                          <motion.div
                            key={lesson.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.2, delay: lessonIndex * 0.05 }}
                          >
                            <Link
                              href={lesson.locked ? '#' : `/courses/${subjectId}/${lesson.id}`}
                              className={`flex items-center space-x-4 p-4 rounded-xl transition-all ${
                                lesson.locked 
                                  ? 'bg-background-surface/50 cursor-not-allowed' 
                                  : lesson.completed
                                    ? 'bg-primary/10 hover:bg-primary/20 border border-primary/20'
                                    : 'bg-background-surface hover:bg-background-elevated border border-border'
                              }`}
                            >
                              {/* Icon/Status */}
                              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                                lesson.locked 
                                  ? 'bg-background-elevated' 
                                  : lesson.completed
                                    ? 'bg-primary/20'
                                    : 'bg-primary/10'
                              }`}>
                                {lesson.locked ? (
                                  <Lock className="h-5 w-5 text-text-muted" />
                                ) : lesson.completed ? (
                                  <CheckCircle2 className="h-5 w-5 text-primary" />
                                ) : (
                                  <Icon className="h-5 w-5 text-primary" />
                                )}
                              </div>

                              {/* Lesson Info */}
                              <div className="flex-1 min-w-0">
                                <h3 className={`font-semibold truncate ${
                                  lesson.completed ? 'text-primary' : 'text-text-primary'
                                }`}>
                                  {lesson.title}
                                </h3>
                                <div className="flex items-center space-x-3 text-text-muted text-sm">
                                  <div className="flex items-center space-x-1">
                                    <Clock className="h-3 w-3" />
                                    <span>{lesson.duration} min</span>
                                  </div>
                                  <div className="flex items-center space-x-1">
                                    <Zap className="h-3 w-3" />
                                    <span>{lesson.xpReward} XP</span>
                                  </div>
                                </div>
                              </div>

                              {/* Type Badge */}
                              <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${
                                lesson.locked 
                                  ? 'bg-background-elevated text-text-muted'
                                  : lesson.type === 'quiz' 
                                    ? 'bg-warning/20 text-warning'
                                    : lesson.type === 'video'
                                      ? 'bg-primary/20 text-primary'
                                      : 'bg-background-elevated text-text-muted'
                              }`}>
                                {lesson.type}
                              </span>
                            </Link>
                          </motion.div>
                        )
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
