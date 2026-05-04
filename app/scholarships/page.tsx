'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Award, 
  Search, 
  Filter, 
  MapPin, 
  Users, 
  Clock, 
  CheckCircle2, 
  ExternalLink,
  Bookmark,
  Calendar
} from 'lucide-react'

interface Scholarship {
  id: string
  title: string
  organization: string
  description: string
  amount: string
  location: string
  field: string
  deadline: string
  applicants: number
  requirements: string[]
  image: string
}

const scholarships: Scholarship[] = [
  {
    id: '1',
    title: 'National Scholarship for STEM Excellence',
    organization: 'Ministry of Education - Ethiopia',
    description: 'Full scholarship for outstanding students in STEM fields. Covers tuition, accommodation, and living expenses for 4 years.',
    amount: 'ETB 480,000',
    location: 'Ethiopia',
    field: 'STEM',
    deadline: '2024-05-15',
    applicants: 2847,
    requirements: ['Grade 10 or 12 graduate', 'GPA > 3.5', 'National exam score > 80%'],
    image: 'bg-gradient-to-br from-primary to-blue-600',
  },
  {
    id: '2',
    title: 'Mastercard Foundation Scholars Program',
    organization: 'Mastercard Foundation',
    description: 'Comprehensive scholarship program for academically talented but economically disadvantaged students.',
    amount: 'Full Coverage',
    location: 'International',
    field: 'Any',
    deadline: '2024-04-30',
    applicants: 5432,
    requirements: ['Academic excellence', 'Financial need', 'Leadership potential'],
    image: 'bg-gradient-to-br from-secondary to-orange-600',
  },
  {
    id: '3',
    title: 'Horn of Africa Education Fund',
    organization: 'HOAEF',
    description: 'Scholarship for students from Ethiopia and neighboring countries pursuing undergraduate degrees.',
    amount: '$15,000/year',
    location: 'International',
    field: 'Any',
    deadline: '2024-06-01',
    applicants: 1893,
    requirements: ['High school diploma', 'English proficiency', 'Community service'],
    image: 'bg-gradient-to-br from-accent to-emerald-600',
  },
  {
    id: '4',
    title: 'Addis Ababa University Merit Scholarship',
    organization: 'Addis Ababa University',
    description: 'Merit-based scholarship for top-performing students admitted to AAU undergraduate programs.',
    amount: 'ETB 120,000',
    location: 'Ethiopia',
    field: 'Any',
    deadline: '2024-07-15',
    applicants: 1256,
    requirements: ['Admission to AAU', 'Top 5% ranking', 'Full-time enrollment'],
    image: 'bg-gradient-to-br from-indigo-500 to-purple-600',
  },
  {
    id: '5',
    title: 'Women in Technology Scholarship',
    organization: 'TechEthiopia',
    description: 'Supporting young Ethiopian women pursuing degrees in computer science, engineering, and IT.',
    amount: 'ETB 200,000',
    location: 'Ethiopia',
    field: 'Technology',
    deadline: '2024-05-30',
    applicants: 892,
    requirements: ['Female student', 'STEM field', 'Grade 12 or university'],
    image: 'bg-gradient-to-br from-pink-500 to-rose-600',
  },
  {
    id: '6',
    title: 'Agricultural Innovation Scholarship',
    organization: 'Ethiopian Agricultural Research Institute',
    description: 'For students passionate about agricultural science, food security, and sustainable farming.',
    amount: 'ETB 150,000',
    location: 'Ethiopia',
    field: 'Agriculture',
    deadline: '2024-06-20',
    applicants: 634,
    requirements: ['Agricultural field', 'Research interest', 'Rural background preferred'],
    image: 'bg-gradient-to-br from-green-500 to-teal-600',
  },
]

const fields = ['All', 'STEM', 'Any', 'Technology', 'Agriculture', 'Medicine', 'Arts']
const locations = ['All', 'Ethiopia', 'International']

export default function Scholarships() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedField, setSelectedField] = useState('All')
  const [selectedLocation, setSelectedLocation] = useState('All')
  const [savedScholarships, setSavedScholarships] = useState<string[]>([])

  const filteredScholarships = scholarships.filter(scholarship => {
    const matchesSearch = scholarship.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         scholarship.organization.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesField = selectedField === 'All' || scholarship.field === selectedField
    const matchesLocation = selectedLocation === 'All' || scholarship.location === selectedLocation
    return matchesSearch && matchesField && matchesLocation
  })

  const toggleSaved = (id: string) => {
    setSavedScholarships(prev => 
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    )
  }

  const getDaysLeft = (deadline: string) => {
    const days = Math.ceil((new Date(deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    return days > 0 ? `${days} days left` : 'Expired'
  }

  const getUrgencyColor = (deadline: string) => {
    const days = Math.ceil((new Date(deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    if (days <= 7) return 'bg-danger/20 text-danger'
    if (days <= 30) return 'bg-secondary/20 text-secondary'
    return 'bg-accent/20 text-accent'
  }

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
            <Award className="h-8 w-8 text-secondary" />
            <h1 className="text-3xl sm:text-4xl font-bold gradient-text">Scholarships</h1>
          </div>
          <p className="text-text-muted max-w-2xl mx-auto">
            Discover funding opportunities to support your education. Track deadlines and get application assistance.
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
              placeholder="Search scholarships..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field pl-12"
            />
          </div>
          
          {/* Field Filter */}
          <div className="flex flex-wrap justify-center gap-2">
            {fields.map((field) => (
              <button
                key={field}
                onClick={() => setSelectedField(field)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedField === field
                    ? 'bg-secondary text-white shadow-glow-amber'
                    : 'bg-surface text-text-muted hover:bg-surface-700 hover:text-text-primary'
                }`}
              >
                {field}
              </button>
            ))}
          </div>
          
          {/* Location Filter */}
          <div className="flex flex-wrap justify-center gap-2">
            {locations.map((location) => (
              <button
                key={location}
                onClick={() => setSelectedLocation(location)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedLocation === location
                    ? 'bg-primary text-white shadow-glow'
                    : 'bg-surface text-text-muted hover:bg-surface-700 hover:text-text-primary'
                }`}
              >
                {location}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Scholarship Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredScholarships.map((scholarship, index) => (
            <motion.div
              key={scholarship.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="glass-card overflow-hidden group hover:scale-[1.02] transition-transform"
            >
              <div className={`h-24 ${scholarship.image}`} />
              
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-bold text-lg text-text-primary group-hover:text-primary transition-colors">
                    {scholarship.title}
                  </h3>
                  <button 
                    onClick={() => toggleSaved(scholarship.id)}
                    className={`p-2 rounded-full transition-colors ${
                      savedScholarships.includes(scholarship.id)
                        ? 'bg-secondary/20 text-secondary'
                        : 'bg-surface text-text-muted hover:text-text-primary'
                    }`}
                  >
                    <Bookmark className={`h-5 w-5 ${savedScholarships.includes(scholarship.id) ? 'fill-current' : ''}`} />
                  </button>
                </div>
                
                <p className="text-text-muted text-sm mb-4">{scholarship.organization}</p>
                <p className="text-text-secondary text-sm mb-4 line-clamp-2">{scholarship.description}</p>
                
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="flex items-center space-x-2 text-text-muted text-sm">
                    <MapPin className="h-4 w-4" />
                    <span>{scholarship.location}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-text-muted text-sm">
                    <Users className="h-4 w-4" />
                    <span>{scholarship.applicants.toLocaleString()} applicants</span>
                  </div>
                </div>
                
                {/* Deadline */}
                <div className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-semibold mb-4 ${getUrgencyColor(scholarship.deadline)}`}>
                  <Clock className="h-3 w-3" />
                  <span>{getDaysLeft(scholarship.deadline)}</span>
                </div>
                
                {/* Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-white/10">
                  <span className="font-bold text-accent text-lg">{scholarship.amount}</span>
                  <button className="btn-primary text-sm px-4 py-2">
                    Apply Now
                    <ExternalLink className="inline-block ml-1 h-3 w-3" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {filteredScholarships.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <Search className="h-16 w-16 text-text-muted mx-auto mb-4" />
            <h3 className="text-xl font-bold text-text-primary mb-2">No scholarships found</h3>
            <p className="text-text-muted">Try adjusting your search or filters</p>
          </motion.div>
        )}
      </div>
    </div>
  )
}
