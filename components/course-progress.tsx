'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { BookOpen, ChevronRight, Clock } from 'lucide-react'

interface Course {
  id: string
  title: string
  subject: string
  progress: number
  totalLessons: number
  completedLessons: number
  lastAccessed: string
  thumbnail: string
}

export function CourseProgress() {
  const enrolledCourses: Course[] = [
    {
      id: 'math-grade-10',
      title: 'Grade 10 Mathematics',
      subject: 'Mathematics',
      progress: 65,
      totalLessons: 120,
      completedLessons: 78,
      lastAccessed: '2 hours ago',
      thumbnail: 'bg-gradient-to-br from-primary to-blue-500',
    },
    {
      id: 'physics-grade-10',
      title: 'Grade 10 Physics',
      subject: 'Physics',
      progress: 42,
      totalLessons: 85,
      completedLessons: 36,
      lastAccessed: '1 day ago',
      thumbnail: 'bg-gradient-to-br from-secondary to-orange-500',
    },
    {
      id: 'english-grade-10',
      title: 'Grade 10 English',
      subject: 'English',
      progress: 28,
      totalLessons: 60,
      completedLessons: 17,
      lastAccessed: '3 days ago',
      thumbnail: 'bg-gradient-to-br from-accent to-green-500',
    },
  ]

  return (
    <div className="space-y-4">
      {enrolledCourses.map((course, index) => (
        <motion.div
          key={course.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
        >
          <Link
            href={`/courses/${course.id}`}
            className="block glass-card p-4 hover:scale-[1.02] transition-transform group"
          >
            <div className="flex items-start space-x-4">
              {/* Thumbnail */}
              <div className={`w-16 h-16 rounded-xl ${course.thumbnail} flex items-center justify-center shrink-0`}>
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              
              {/* Course Info */}
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-text-primary truncate group-hover:text-primary transition-colors">
                  {course.title}
                </h3>
                <p className="text-text-muted text-sm">{course.subject}</p>
                
                {/* Progress */}
                <div className="mt-2">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-text-muted">
                      {course.completedLessons}/{course.totalLessons} lessons
                    </span>
                    <span className="text-primary font-semibold">
                      {course.progress}%
                    </span>
                  </div>
                  <div className="h-2 bg-surface rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${course.progress}%` }}
                      transition={{ duration: 0.5, delay: index * 0.1 + 0.3 }}
                      className="h-full bg-gradient-primary"
                    />
                  </div>
                </div>
              </div>
              
              {/* Continue Button */}
              <div className="flex flex-col items-end space-y-2">
                <ChevronRight className="h-5 w-5 text-text-muted group-hover:text-primary group-hover:translate-x-1 transition-all" />
                <div className="flex items-center text-xs text-text-muted">
                  <Clock className="h-3 w-3 mr-1" />
                  {course.lastAccessed}
                </div>
              </div>
            </div>
          </Link>
        </motion.div>
      ))}
    </div>
  )
}
