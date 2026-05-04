'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Flame, Zap, Brain, Trophy } from 'lucide-react'

interface PreLoaderProps {
  isLoading: boolean
  progress?: number
  message?: string
}

export function PreLoader({ isLoading, progress = 0, message = "MatriPrime" }: PreLoaderProps) {
  const [dots, setDots] = useState('')

  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? '' : prev + '.')
    }, 500)
    return () => clearInterval(interval)
  }, [])

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-50 bg-background flex flex-col items-center justify-center"
        >
          {/* Animated Background */}
          <div className="absolute inset-0 overflow-hidden">
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 0.4 }}
              transition={{ duration: 2, ease: 'easeOut' }}
              className="absolute top-0 left-0 w-full h-full"
            >
              <div className="absolute top-20 left-20 w-64 h-64 bg-primary/20 rounded-full filter blur-3xl" />
              <div className="absolute bottom-20 right-20 w-96 h-96 bg-secondary/20 rounded-full filter blur-3xl" />
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 w-96 h-96 bg-accent/20 rounded-full filter blur-3xl" />
            </motion.div>
          </div>

          {/* Logo Animation */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{
              type: 'spring',
              stiffness: 260,
              damping: 20,
              delay: 0.5
            }}
            className="relative z-10"
          >
            <div className="relative w-32 h-32 sm:w-40 sm:h-40">
              {/* Outer Ring */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: 'linear'
                }}
                className="absolute inset-0 rounded-full border-2 border-transparent"
                style={{
                  background: 'linear-gradient(45deg, #6366F1, #8B5CF6, #EC4899)',
                  padding: '2px',
                  backgroundClip: 'padding-box'
                }}
              >
                <div className="w-full h-full rounded-full bg-background"></div>
              </motion.div>

              {/* Logo */}
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  animate={{ 
                    scale: [1, 1.1, 1],
                    y: [0, -5, 0]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeInOut'
                  }}
                  className="bg-gradient-to-br from-primary to-purple-500 w-20 h-20 sm:w-24 sm:h-24 rounded-2xl flex items-center justify-center shadow-glow"
                >
                  <Flame className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
                </motion.div>
              </div>

              {/* Icons Around */}
              <motion.div
                className="absolute -top-2 right-8"
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
              >
                <Brain className="w-5 h-5 text-primary" />
              </motion.div>
              <motion.div
                className="absolute -bottom-2 left-8"
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity, delay: 1 }}
              >
                <Trophy className="w-5 h-5 text-secondary" />
              </motion.div>
              <motion.div
                className="absolute top-8 -right-2"
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity, delay: 1.5 }}
              >
                <Zap className="w-5 h-5 text-accent" />
              </motion.div>
            </div>
          </motion.div>

          {/* Brand Text */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="mt-6 text-center z-10"
          >
            <h1 className="text-3xl sm:text-4xl font-black gradient-text mb-2">
              MatriPrime
            </h1>
            <p className="text-text-muted">
              Master Your Future
            </p>
          </motion.div>

          {/* Loading Animation */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 0.8 }}
            className="mt-8 z-10"
          >
            {/* Bouncing Dots */}
            <div className="flex items-center justify-center space-x-2">
              <motion.div
                animate={{ y: [0, -15, 0] }}
                transition={{ duration: 1.2, repeat: Infinity, delay: 0 }}
                className="w-2 h-2 bg-primary rounded-full"
              />
              <motion.div
                animate={{ y: [0, -15, 0] }}
                transition={{ duration: 1.2, repeat: Infinity, delay: 0.2 }}
                className="w-2 h-2 bg-secondary rounded-full"
              />
              <motion.div
                animate={{ y: [0, -15, 0] }}
                transition={{ duration: 1.2, repeat: Infinity, delay: 0.4 }}
                className="w-2 h-2 bg-accent rounded-full"
              />
            </div>

            {/* Progress Text */}
            <div className="mt-4 text-center">
              <p className="text-text-primary font-medium mb-1">
                {message}{dots}
              </p>
              {progress > 0 && (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-32 h-1 bg-surface rounded-full overflow-hidden">
                    <motion.div
                      animate={{ width: `${progress}%` }}
                      className="h-full bg-gradient-primary"
                    />
                  </div>
                  <span className="text-text-muted text-xs">{Math.round(progress)}%</span>
                </div>
              )}
            </div>
          </motion.div>

          {/* Tips Carousel */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2, duration: 1 }}
            className="mt-8 z-10 text-center"
          >
            <p className="text-text-muted text-sm font-light italic">
              "Intelligence is the result of persistent learning."
            </p>
            <p className="text-text-muted text-xs mt-1">~ Ethiopian Educational Wisdom</p>
          </motion.div>
        </motion.div>
      
      )}
    </AnimatePresence>
  )
}

export function usePreloader(delay = 2000) {
  const [isLoading, setIsLoading] = useState(true)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    let mounted = true
    
    // Simulate loading
    const interval = setInterval(() => {
      if (!mounted) return
      
      setProgress(prev => {
        if (prev >= 100) {
          if (delay > 0) {
            setTimeout(() => {
              if (mounted) setIsLoading(false)
            }, delay)
          } else {
            setIsLoading(false)
          }
          clearInterval(interval)
        }
        return Math.min(prev + 5, 100)
      })
    }, 100)

    return () => {
      mounted = false
      clearInterval(interval)
    }
  }, [delay])

  return { isLoading, progress, setIsLoading }
}
