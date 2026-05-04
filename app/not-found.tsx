import Link from 'next/link'
import { motion } from 'framer-motion'
import { AlertTriangle, Home, RefreshCw } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen pt-20 pb-24 bg-gradient-to-br from-background to-danger/10 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
        className="w-full max-w-md glass-card p-8 text-center"
      >
        <motion.div initial={{ scale: 0, rotate: -180 }} animate={{ scale: 1, rotate: 0 }} transition={{ delay: 0.1, type: "spring", stiffness: 260, damping: 20 }} className="w-20 h-20 bg-danger/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertTriangle className="h-10 w-10 text-danger" />
        </motion.div>

        <motion.h2 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-2xl sm:text-3xl font-black text-text-primary mb-4">
          404 - Page Not Found
        </motion.h2>

        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="text-text-muted mb-6 leading-relaxed">
          Oops! We couldn't find the page you're looking for.
        </motion.p>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="flex flex-col gap-3">
          <Link href="/dashboard" className="btn-primary flex items-center justify-center">
            <Home className="h-4 w-4 mr-2" />
            Go to Dashboard
          </Link>
          <button onClick={() => window.location.reload()} className="btn-secondary flex items-center justify-center">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh Page
          </button>
        </motion.div>
      </motion.div>
    </div>
  )
}
