'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Target, 
  Clock, 
  Heart, 
  Zap, 
  Trophy, 
  CheckCircle2, 
  XCircle,
  ArrowRight,
  RotateCcw,
  Flame
} from 'lucide-react'
import { useGamificationStore } from '@/stores/gamification-store'

interface Question {
  id: string
  type: 'multiple_choice' | 'true_false' | 'fill_blank'
  question: string
  options: string[]
  correctAnswer: string | number
  explanation: string
  difficulty: 'easy' | 'medium' | 'hard'
  subject: string
  xpReward: number
}

const mockQuestions: Question[] = [
  {
    id: '1',
    type: 'multiple_choice',
    question: 'What is the derivative of x²?',
    options: ['x', '2x', 'x²', '2'],
    correctAnswer: 1,
    explanation: 'Using the power rule: d/dx(xⁿ) = nxⁿ⁻¹. So d/dx(x²) = 2x',
    difficulty: 'easy',
    subject: 'Mathematics',
    xpReward: 10
  },
  {
    id: '2',
    type: 'multiple_choice',
    question: 'Which gas is most abundant in Earth\'s atmosphere?',
    options: ['Oxygen', 'Carbon Dioxide', 'Nitrogen', 'Hydrogen'],
    correctAnswer: 2,
    explanation: 'Nitrogen makes up about 78% of Earth\'s atmosphere.',
    difficulty: 'easy',
    subject: 'Chemistry',
    xpReward: 10
  },
  {
    id: '3',
    type: 'true_false',
    question: 'Ethiopia was never colonized by European powers.',
    options: ['True', 'False'],
    correctAnswer: 0,
    explanation: 'Ethiopia successfully resisted Italian colonization, maintaining independence throughout the colonial era.',
    difficulty: 'medium',
    subject: 'History',
    xpReward: 15
  },
  {
    id: '4',
    type: 'multiple_choice',
    question: 'What is the capital of Ethiopia?',
    options: ['Lalibela', 'Gondar', 'Addis Ababa', 'Axum'],
    correctAnswer: 2,
    explanation: 'Addis Ababa, meaning "New Flower" in Amharic, is the capital city of Ethiopia.',
    difficulty: 'easy',
    subject: 'Geography',
    xpReward: 5
  },
  {
    id: '5',
    type: 'multiple_choice',
    question: 'According to Newton\'s Second Law, F = ?',
    options: ['mv', 'ma', 'm/a', 'm + a'],
    correctAnswer: 1,
    explanation: 'Newton\'s Second Law states that Force equals mass times acceleration (F = ma).',
    difficulty: 'medium',
    subject: 'Physics',
    xpReward: 15
  }
]

export default function Quizzes() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [hearts, setHearts] = useState(5)
  const [score, setScore] = useState(0)
  const [isCompleted, setIsCompleted] = useState(false)
  const [timer, setTimer] = useState(0)
  const [quizStarted, setQuizStarted] = useState(false)
  
  const { addXP, addQuestions, maintainStreak } = useGamificationStore()

  useEffect(() => {
    if (quizStarted && !isCompleted) {
      const interval = setInterval(() => setTimer(t => t + 1), 1000)
      return () => clearInterval(interval)
    }
  }, [quizStarted, isCompleted])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const handleAnswer = (index: number) => {
    if (selectedAnswer !== null) return
    
    setSelectedAnswer(index)
    const correct = index === mockQuestions[currentQuestion].correctAnswer
    setIsCorrect(correct)
    setShowResult(true)

    if (correct) {
      setScore(s => s + mockQuestions[currentQuestion].xpReward)
      addXP(mockQuestions[currentQuestion].xpReward)
    } else {
      setHearts(h => h - 1)
    }
    
    addQuestions(1, correct ? 100 : 0)

    setTimeout(() => {
      if (currentQuestion < mockQuestions.length - 1 && (correct || hearts > 1)) {
        setCurrentQuestion(c => c + 1)
        setSelectedAnswer(null)
        setShowResult(false)
      } else {
        setIsCompleted(true)
        maintainStreak()
      }
    }, 2000)
  }

  const handleRestart = () => {
    setCurrentQuestion(0)
    setSelectedAnswer(null)
    setShowResult(false)
    setHearts(5)
    setScore(0)
    setIsCompleted(false)
    setTimer(0)
    setQuizStarted(false)
  }

  const accuracy = isCompleted 
    ? Math.round((score / mockQuestions.reduce((acc, q) => acc + q.xpReward, 0)) * 100)
    : 0

  if (!quizStarted) {
    return (
      <div className="min-h-screen pt-20 pb-24">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-8 text-center"
          >
            <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Target className="h-10 w-10 text-primary" />
            </div>
            <h2 className="text-3xl font-bold text-text-primary mb-4">Ready to Quiz?</h2>
            <p className="text-text-muted mb-6">
              Test your knowledge with {mockQuestions.length} questions.<br />
              Earn XP for correct answers and maintain your streak!
            </p>
            <div className="flex items-center justify-center space-x-4 mb-6">
              <div className="flex items-center space-x-1 text-text-muted">
                <Clock className="h-5 w-5" />
                <span>~{Math.ceil(mockQuestions.length * 1.5)} min</span>
              </div>
              <div className="flex items-center space-x-1 text-text-muted">
                <Zap className="h-5 w-5" />
                <span>{mockQuestions.reduce((acc, q) => acc + q.xpReward, 0)} XP max</span>
              </div>
              <div className="flex items-center space-x-1 text-text-muted">
                <Heart className="h-5 w-5 text-danger" />
                <span>5 lives</span>
              </div>
            </div>
            <button 
              onClick={() => setQuizStarted(true)}
              className="btn-primary text-lg px-8 py-4"
            >
              Start Quiz
              <ArrowRight className="h-5 w-5 inline-block ml-2" />
            </button>
          </motion.div>
        </div>
      </div>
    )
  }

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
            <h2 className="text-3xl font-bold text-text-primary mb-4">Quiz Complete!</h2>
            
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="bg-surface p-4 rounded-xl">
                <p className="text-2xl font-bold text-accent">{score}</p>
                <p className="text-text-muted text-sm">XP Earned</p>
              </div>
              <div className="bg-surface p-4 rounded-xl">
                <p className="text-2xl font-bold text-primary">{accuracy}%</p>
                <p className="text-text-muted text-sm">Accuracy</p>
              </div>
              <div className="bg-surface p-4 rounded-xl">
                <p className="text-2xl font-bold text-secondary">{formatTime(timer)}</p>
                <p className="text-text-muted text-sm">Time</p>
              </div>
            </div>

            <div className="flex items-center justify-center space-x-2 mb-6">
              <Flame className="h-6 w-6 text-secondary" />
              <span className="text-xl font-bold text-text-primary">Streak Maintained!</span>
            </div>
            
            <button onClick={handleRestart} className="btn-primary">
              <RotateCcw className="h-5 w-5 inline-block mr-2" />
              Try Another Quiz
            </button>
          </motion.div>
        </div>
      </div>
    )
  }

  const question = mockQuestions[currentQuestion]
  const progress = ((currentQuestion + 1) / mockQuestions.length) * 100

  return (
    <div className="min-h-screen pt-20 pb-24">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <span className="text-text-muted">
                Question {currentQuestion + 1}/{mockQuestions.length}
              </span>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                question.difficulty === 'easy' ? 'bg-accent/20 text-accent' :
                question.difficulty === 'medium' ? 'bg-secondary/20 text-secondary' :
                'bg-danger/20 text-danger'
              }`}>
                {question.difficulty}
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <Clock className="h-5 w-5 text-text-muted" />
                <span className="text-text-muted">{formatTime(timer)}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Heart className="h-5 w-5 text-danger fill-current" />
                <span className="text-text-primary font-bold">{hearts}</span>
              </div>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full h-2 bg-surface rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-primary"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </motion.div>

        {/* Question Card */}
        <motion.div
          key={question.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass-card p-6 mb-6"
        >
          <p className="text-xl font-bold text-text-primary mb-6">{question.question}</p>
          
          <div className="space-y-3">
            {question.options.map((option, index) => {
              const isSelected = selectedAnswer === index
              const isCorrectAnswer = index === question.correctAnswer
              
              let buttonClass = 'p-4 rounded-xl text-left transition-all '
              
              if (showResult) {
                if (isCorrectAnswer) {
                  buttonClass += 'bg-accent/20 border-2 border-accent text-accent'
                } else if (isSelected) {
                  buttonClass += 'bg-danger/20 border-2 border-danger text-danger'
                } else {
                  buttonClass += 'bg-surface text-text-muted'
                }
              } else {
                buttonClass += isSelected 
                  ? 'bg-primary text-white' 
                  : 'bg-surface text-text-primary hover:bg-surface-700'
              }

              return (
                <button
                  key={index}
                  onClick={() => handleAnswer(index)}
                  disabled={showResult}
                  className={buttonClass}
                >
                  <div className="flex items-center justify-between">
                    <span>{option}</span>
                    {showResult && isCorrectAnswer && (
                      <CheckCircle2 className="h-5 w-5" />
                    )}
                    {showResult && isSelected && !isCorrectAnswer && (
                      <XCircle className="h-5 w-5" />
                    )}
                  </div>
                </button>
              )
            })}
          </div>

          {/* Explanation */}
          <AnimatePresence>
            {showResult && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 p-4 bg-surface rounded-xl"
              >
                <div className="flex items-start space-x-2">
                  {isCorrect ? (
                    <CheckCircle2 className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                  ) : (
                    <XCircle className="h-5 w-5 text-danger shrink-0 mt-0.5" />
                  )}
                  <div>
                    <p className={`font-semibold ${isCorrect ? 'text-accent' : 'text-danger'}`}>
                      {isCorrect ? 'Correct!' : 'Not quite!'}
                    </p>
                    <p className="text-text-muted text-sm">{question.explanation}</p>
                    <p className="text-primary text-sm mt-2">+{question.xpReward} XP</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* XP Preview */}
        <div className="text-center text-text-muted text-sm">
          <Zap className="h-4 w-4 inline-block mr-1 text-secondary" />
          Earn up to {mockQuestions.reduce((acc, q) => acc + q.xpReward, 0)} XP
        </div>
      </div>
    </div>
  )
}
