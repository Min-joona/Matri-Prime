'use client'

import { Component, ErrorInfo, ReactNode } from 'react'
import { motion } from 'framer-motion'
import { AlertTriangle } from 'lucide-react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by ErrorBoundary:', error, errorInfo)
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="min-h-screen pt-20 pb-24 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card p-8 max-w-md text-center"
          >
            <div className="w-20 h-20 bg-danger/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="h-10 w-10 text-danger" />
            </div>
            <h2 className="text-2xl font-bold text-text-primary mb-4">Something Went Wrong</h2>
            <p className="text-text-muted mb-4">
              We've encountered an unexpected error. Please try refreshing the page.
            </p>
            {this.state.error && (
              <details className="text-sm text-text-muted mb-6">
                <summary>Error Details</summary>
                <pre className="mt-2 p-3 bg-surface rounded-lg overflow-x-auto">
                  {this.state.error.stack}
                </pre>
              </details>
            )}
            <button
              onClick={() => window.location.reload()}
              className="btn-primary"
            >
              Refresh Page
            </button>
          </motion.div>
        </div>
      )
    }

    return this.props.children
  }
}
