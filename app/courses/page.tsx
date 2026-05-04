'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  Calculator, 
  FlaskConical, 
  Microscope, 
  BookOpen, 
  Globe, 
  Map, 
  History, 
  Coins, 
  Monitor,
  GraduationCap,
  Clock,
  Users,
  Star,
  ChevronRight,
  Search
} from 'lucide-react'
import { useGamificationStore } from '@/stores/gamification-store'

interface Subject {
  id: string
  name: string
  icon: React.ElementType
  description: string
  gradeLevels: string[]
  totalUnits: number
  totalLessons: number
  enrolled: number
  rating: number
  color: string
  gradient: string
}

const subjects: Subject[] = [
  {
    id: 'mathematics',
    name: 'Mathematics',
    icon: Calculator,
    description: 'Master algebra, geometry, calculus, statistics, and trigonometry with AI-powered learning paths.',
    gradeLevels: ['9', '10', '11', '12'],
    totalUnits: 24,
    totalLessons: 480,
    enrolled: 12500,
    rating: 4.9,
    color: 'text-primary',
    gradient: 'bg-gradient-to-br from-primary/20 to-blue-500/10',
  },
  {
    id: 'physics',
    name: 'Physics',
    icon: FlaskConical,
    description: 'Understand mechanics, thermodynamics, electricity, and modern physics through interactive simulations.',
    gradeLevels: ['10', '11', '12'],
    totalUnits: 18,
    totalLessons: 360,
    enrolled: 8900,
    rating: 4.8,
    color: 'text-secondary',
    gradient: 'bg-gradient-to-br from-secondary/20 to-orange-500/10',
  },
  {
    id: 'chemistry',
    name: 'Chemistry',
    icon: FlaskConical,
    description: 'Learn organic, inorganic, physical chemistry, and environmental chemistry with virtual labs.',
    gradeLevels: ['10', '11', '12'],
    totalUnits: 16,
    totalLessons: 320,
    enrolled: 7600,
    rating: 4.7,
    color: 'text-accent',
    gradient: 'bg-gradient-to-br from-accent/20 to-teal-500/10',
  },
  {
    id: 'biology',
    name: 'Biology',
    icon: Microscope,
    description: 'Explore cell biology, genetics, ecology, and human anatomy with 3D visualizations.',
    gradeLevels: ['10', '11', '12'],
    totalUnits: 20,
    totalLessons: 400,
    enrolled: 9800,
    rating: 4.8,
    color: 'text-accent',
    gradient: 'bg-gradient-to-br from-emerald-500/20 to-green-500/10',
  },
  {
    id: 'english',
    name: 'English',
    icon: BookOpen,
    description: 'Enhance grammar, literature, composition, and vocabulary skills for ESLCE excellence.',
    gradeLevels: ['9', '10', '11', '12'],
    totalUnits: 15,
    totalLessons: 300,
    enrolled: 15600,
    rating: 4.9,
    color: 'text-secondary',
    gradient: 'bg-gradient-to-br from-amber-500/20 to-yellow-500/10',
  },
  {
    id: 'civics',
    name: 'Civics',
    icon: Globe,
    description: 'Study Ethiopian Constitution, citizenship, governance, and democratic values.',
    gradeLevels: ['9', '10', '11', '12'],
    totalUnits: 10,
    totalLessons: 200,
    enrolled: 6800,
    rating: 4.6,
    color: 'text-primary',
    gradient: 'bg-gradient-to-br from-indigo-500/20 to-purple-500/10',
  },
  {
    id: 'geography',
    name: 'Geography',
    icon: Map,
    description: 'Learn physical geography, human geography, Ethiopian geography, and GIS basics.',
    gradeLevels: ['9', '10', '11', '12'],
    totalUnits: 12,
    totalLessons: 240,
    enrolled: 6200,
    rating: 4.7,
    color: 'text-accent',
    gradient: 'bg-gradient-to-br from-teal-500/20 to-cyan-500/10',
  },
  {
    id: 'history',
    name: 'History',
    icon: History,
    description: 'Discover Ethiopian history, world history, and African history through engaging narratives.',
    gradeLevels: ['9', '10', '11', '12'],
    totalUnits: 14,
    totalLessons: 280,
    enrolled: 5900,
    rating: 4.7,
    color: 'text-secondary',
    gradient: 'bg-gradient-to-br from-rose-500/20 to-red-500/10',
  },
  {
    id: 'economics',
    name: 'Economics',
    icon: Coins,
    description: 'Master microeconomics, macroeconomics, development economics, and Ethiopian economy.',
    gradeLevels: ['11', '12'],
    totalUnits: 12,
    totalLessons: 240,
    enrolled: 4500,
    rating: 4.8,
    color: 'text-primary',
    gradient: 'bg-gradient-to-br from-blue-500/20 to-indigo-500/10',
  },
  {
    id: 'it',
    name: 'Information Technology',
    icon: Monitor,
    description: 'Learn programming (Python), databases, networking, and AI basics with hands-on projects.',
    gradeLevels: ['9', '10', '11', '12'],
    totalUnits: 15,
    totalLessons: 300,
    enrolled: 7200,
    rating: 4.9,
    color: 'text-accent',
    gradient: 'bg-gradient-to-br from-cyan-500/20 to-blue-500/10',
  },
]

export default function Courses() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedGrade, setSelectedGrade] = useState<string>('all')
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null)
  
  const { level } = useGamificationStore()

  const filteredSubjects = subjects.filter(subject => {
    const matchesSearch = subject.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         subject.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesGrade = selectedGrade === 'all' || subject.gradeLevels.includes(selectedGrade)
    return matchesSearch && matchesGrade
  })

  const gradeLevels = ['all', '9', '10', '11', '12']

  return (
    <div className="min-h-screen pt-20 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center space-x-2 mb-4">
            <GraduationCap className="h-8 w-8 text-primary" />
            <h1 className="text-3xl sm:text-4xl font-bold gradient-text">All Courses</h1>
          </div>
          <p className="text-text-muted max-w-2xl mx-auto">
            Explore Ethiopian secondary curriculum subjects. Master every concept with AI-enhanced notes, 
            video lessons, flashcards, and practice exams.
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-8 space-y-4"
        >
          {/* Search */}
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-text-muted" />
            <input
              type="text"
              placeholder="Search courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field pl-12"
            />
          </div>
          
          {/* Grade Filter */}
          <div className="flex flex-wrap justify-center gap-2">
            {gradeLevels.map((grade) => (
              <button
                key={grade}
                onClick={() => setSelectedGrade(grade)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedGrade === grade
                    ? 'bg-primary text-white shadow-glow'
                    : 'bg-surface text-text-muted hover:bg-surface-700 hover:text-text-primary'
                }`}
              >
                {grade === 'all' ? 'All Grades' : `Grade ${grade}`}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Subject Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSubjects.map((subject, index) => {
            const Icon = subject.icon
            return (
              <motion.div
                key={subject.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
              >
                <Link
                  href={`/courses/${subject.id}`}
                  className="block h-full"
                >
                  <div className="glass-card h-full p-6 group hover:scale-[1.02] transition-transform">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className={`w-14 h-14 ${subject.gradient} rounded-2xl flex items-center justify-center`}>
                        <Icon className={`h-7 w-7 ${subject.color}`} />
                      </div>
                      <div className="flex items-center space-x-1 text-amber-400">
                        <Star className="h-4 w-4 fill-current" />
                        <span className="text-sm font-semibold">{subject.rating}</span>
                      </div>
                    </div>
                    
                    {/* Content */}
                    <h2 className="text-xl font-bold text-text-primary mb-2 group-hover:text-primary transition-colors">
                      {subject.name}
                    </h2>
                    <p className="text-text-muted text-sm mb-4 line-clamp-2">
                      {subject.description}
                    </p>
                    
                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="flex items-center space-x-2 text-text-muted text-sm">
                        <BookOpen className="h-4 w-4" />
                        <span>{subject.totalUnits} Units</span>
                      </div>
                      <div className="flex items-center space-x-2 text-text-muted text-sm">
                        <Clock className="h-4 w-4" />
                        <span>{subject.totalLessons} Lessons</span>
                      </div>
                    </div>
                    
                    {/* Footer */}
                    <div className="flex items-center justify-between pt-4 border-t border-white/10">
                      <div className="flex items-center space-x-1 text-text-muted text-sm">
                        <Users className="h-4 w-4" />
                        <span>{subject.enrolled.toLocaleString()} enrolled</span>
                      </div>
                      <ChevronRight className="h-5 w-5 text-primary group-hover:translate-x-1 transition-transform" />
                    </div>
                    
                    {/* Grade Tags */}
                    <div className="flex flex-wrap gap-1 mt-4">
                      {subject.gradeLevels.map((grade) => (
                        <span
                          key={grade}
                          className="px-2 py-1 bg-surface text-text-muted text-xs rounded-full"
                        >
                          G{grade}
                        </span>
                      ))}
                    </div>
                  </div>
                </Link>
              </motion.div>
            )
          })}
        </div>

        {/* Empty State */}
        {filteredSubjects.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <Search className="h-16 w-16 text-text-muted mx-auto mb-4" />
            <h3 className="text-xl font-bold text-text-primary mb-2">No courses found</h3>
            <p className="text-text-muted">Try adjusting your search or filters</p>
          </motion.div>
        )}
      </div>
    </div>
  )
}
