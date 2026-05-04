'use client'

import { motion } from 'framer-motion';
import { WifiOff, RefreshCw, Home } from 'lucide-react';
import Link from 'next/link';

export default function OfflineError() {
  return (
    <div className="min-h-screen pt-20 pb-24 bg-gradient-to-br from-background to-slate-800 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          type: "spring",
          stiffness: 260,
          damping: 20
        }}
        className="w-full max-w-md glass-card p-8 text-center"
      >
        {/* Animated Icon */}
        <motion.div
          initial={{ y: -20 }}
          animate={{ y: [0, -10, 0] }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="w-20 h-20 bg-danger/20 rounded-full flex items-center justify-center mx-auto mb-6"
        >
          <WifiOff className="h-10 w-10 text-danger" />
        </motion.div>

        {/* Error Title */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-2xl sm:text-3xl font-black text-text-primary mb-4"
        >
          Connection Lost
        </motion.h2>

        {/* Message */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-text-muted mb-6 leading-relaxed"
        >
          Oops! It looks like you've lost your internet connection. 
          Some features may not work properly.
        </motion.p>

        {/* Offline Features Available */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-6 p-4 bg-surface/50 rounded-xl border border-white/10"
        >
          <h3 className="text-sm font-semibold text-text-primary mb-3">Available Offline:</h3>
          <div className="grid grid-cols-2 gap-2 text-xs text-text-muted">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-accent rounded-full"></div>
              <span>Flashcards</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-accent rounded-full"></div>
              <span>Notes</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-accent rounded-full"></div>
              <span>Saved Content</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-accent rounded-full"></div>
              <span>Practice Quizzes</span>
            </div>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex flex-col gap-3"
        >
          <button
            onClick={() => window.location.reload()}
            className="btn-primary flex items-center justify-center"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </button>

          <Link
            href="/dashboard"
            className="btn-secondary flex items-center justify-center"
          >
            <Home className="h-4 w-4 mr-2" />
            Go to Dashboard
          </Link>
        </motion.div>

        {/* Connection Status */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-6 text-xs text-text-muted"
        >
          <span className="inline-flex items-center">
            <span className="w-2 h-2 bg-danger rounded-full animate-pulse mr-2"></span>
            Offline Mode
          </span>
        </motion.div>
      </motion.div>
    </div>
  );
}
