'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Briefcase,
  Search,
  MapPin,
  Clock,
  Users,
  Calendar,
  HeartHandshake,
  Building2,
  Trophy,
  Code,
  ChevronRight,
  ExternalLink
} from 'lucide-react'

type OpportunityType = 'volunteer' | 'internship' | 'job' | 'extracurricular' | 'competition'

interface Opportunity {
  id: string
  title: string
  organization: string
  type: OpportunityType
  location: string
  description: string
  deadline: string
  duration?: string
  requirements: string[]
  benefits: string[]
  applicants: number
  image: string
}

const opportunities: Opportunity[] = [
  {
    id: '1',
    title: 'Youth Environmental Volunteer',
    organization: 'Green Ethiopia',
    type: 'volunteer',
    location: 'Addis Ababa',
    description: 'Join our team to plant trees and promote environmental awareness in local communities. Great for gaining community service hours!',
    deadline: '2024-05-01',
    duration: '3 months',
    requirements: ['Age 16-25', 'Interest in environment', 'Willing to travel'],
    benefits: ['Certificate', 'Leadership skills', 'Networking'],
    applicants: 234,
    image: 'bg-gradient-to-br from-emerald-500 to-green-600',
  },
  {
    id: '2',
    title: 'Software Development Intern',
    organization: 'TechEthiopia Solutions',
    type: 'internship',
    location: 'Addis Ababa',
    description: 'Paid internship for students interested in software development. Work on real projects using React, Node.js, and Python.',
    deadline: '2024-04-30',
    duration: '6 months',
    requirements: ['Basic programming knowledge', 'Currently studying IT/CS', 'Passion for technology'],
    benefits: ['Monthly stipend ETB 5,000', 'Mentorship', 'Job opportunity'],
    applicants: 456,
    image: 'bg-gradient-to-br from-primary to-blue-600',
  },
  {
    id: '3',
    title: 'Content Creator - Part Time',
    organization: 'MatriPrime',
    type: 'job',
    location: 'Remote',
    description: 'Create educational content for Ethiopian students. Flexible hours, work from anywhere. Great for students who love teaching!',
    deadline: '2024-05-15',
    duration: 'Ongoing',
    requirements: ['Strong writing skills', 'Knowledge of ESLCE subjects', 'Creative mindset'],
    benefits: ['Competitive pay', 'Flexible schedule', 'Remote work'],
    applicants: 189,
    image: 'bg-gradient-to-br from-secondary to-orange-600',
  },
  {
    id: '4',
    title: 'Mathematics Olympiad Prep',
    organization: 'Ethiopian Mathematical Society',
    type: 'competition',
    location: 'National',
    description: 'Prepare for the Ethiopian Mathematical Olympiad. Free training sessions and competition registration. Prizes for winners!',
    deadline: '2024-06-01',
    requirements: ['Love for mathematics', 'Grade 10-12 student', 'Competitive spirit'],
    benefits: ['Scholarship opportunities', 'Recognition', 'Math skills'],
    applicants: 567,
    image: 'bg-gradient-to-br from-purple-500 to-pink-600',
  },
  {
    id: '5',
    title: 'Debate Club Membership',
    organization: 'Ethiopian Debate Association',
    type: 'extracurricular',
    location: 'Multiple Cities',
    description: 'Join the national debate circuit. Build public speaking, critical thinking, and leadership skills. Compete in tournaments!',
    deadline: '2024-05-10',
    duration: '1 year',
    requirements: ['Good communication skills', 'Willingness to learn', 'Team player'],
    benefits: ['Certificate', 'Leadership', 'University admissions help'],
    applicants: 345,
    image: 'bg-gradient-to-br from-indigo-500 to-purple-600',
  },
  {
    id: '6',
    title: 'Hackathon 2024',
    organization: 'Tech Community Addis',
    type: 'competition',
    location: 'Addis Ababa',
    description: '48-hour coding competition. Build innovative solutions for Ethiopian challenges. Great prizes and networking opportunities!',
    deadline: '2024-06-15',
    duration: '2 days',
    requirements: ['Coding skills', 'Team of 3-5', 'Innovative ideas'],
    benefits: ['Cash prizes', 'Mentorship', 'Startup opportunities'],
    applicants: 234,
    image: 'bg-gradient-to-br from-cyan-500 to-blue-600',
  },
]

const typeIcons: Record<OpportunityType, React.ElementType> = {
  volunteer: HeartHandshake,
  internship: Building2,
  job: Briefcase,
  extracurricular: Users,
  competition: Trophy,
}

const typeLabels: Record<OpportunityType, string> = {
  volunteer: 'Volunteer',
  internship: 'Internship',
  job: 'Job',
  extracurricular: 'Extracurricular',
  competition: 'Competition',
}

const typeColors: Record<OpportunityType, string> = {
  volunteer: 'bg-emerald-500',
  internship: 'bg-primary',
  job: 'bg-secondary',
  extracurricular: 'bg-accent',
  competition: 'bg-purple-500',
}

export default function Opportunities() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedType, setSelectedType] = useState<OpportunityType | 'all'>('all')
  const [savedOpportunities, setSavedOpportunities] = useState<string[]>([])

  const filteredOpportunities = opportunities.filter(opp => {
    const matchesSearch = opp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         opp.organization.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = selectedType === 'all' || opp.type === selectedType
    return matchesSearch && matchesType
  })

  const toggleSaved = (id: string) => {
    setSavedOpportunities(prev => 
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    )
  }

  const getDaysLeft = (deadline: string) => {
    const days = Math.ceil((new Date(deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    return days > 0 ? `${days} days left` : 'Expired'
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
            <Briefcase className="h-8 w-8 text-accent" />
            <h1 className="text-3xl sm:text-4xl font-bold gradient-text">Opportunities</h1>
          </div>
          <p className="text-text-muted max-w-2xl mx-auto">
            Discover volunteer work, internships, jobs, extracurriculars, and competitions to boost your experience and university applications.
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
              placeholder="Search opportunities..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field pl-12"
            />
          </div>
          
          {/* Type Filter */}
          <div className="flex flex-wrap justify-center gap-2">
            <button
              onClick={() => setSelectedType('all')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                selectedType === 'all'
                  ? 'bg-accent text-white shadow-glow-success'
                  : 'bg-surface text-text-muted hover:bg-surface-700 hover:text-text-primary'
              }`}
            >
              All Types
            </button>
            {(['volunteer', 'internship', 'job', 'extracurricular', 'competition'] as const).map((type) => {
              const Icon = typeIcons[type]
              return (
                <button
                  key={type}
                  onClick={() => setSelectedType(type)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center space-x-1 ${
                    selectedType === type
                      ? `${typeColors[type]} text-white`
                      : 'bg-surface text-text-muted hover:bg-surface-700 hover:text-text-primary'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{typeLabels[type]}</span>
                </button>
              )
            })}
          </div>
        </motion.div>

        {/* Opportunities Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredOpportunities.map((opportunity, index) => {
            const Icon = typeIcons[opportunity.type]
            return (
              <motion.div
                key={opportunity.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="glass-card overflow-hidden group hover:scale-[1.02] transition-transform"
              >
                <div className={`h-16 ${opportunity.image}`} />
                
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <div className={`p-2 rounded-lg ${typeColors[opportunity.type]} bg-opacity-20`}>
                        <Icon className={`h-4 w-4 ${typeColors[opportunity.type].replace('bg-', 'text-')}`} />
                      </div>
                      <span className={`text-xs font-semibold px-2 py-1 rounded-full ${typeColors[opportunity.type]} text-white`}>
                        {typeLabels[opportunity.type]}
                      </span>
                    </div>
                    <button 
                      onClick={() => toggleSaved(opportunity.id)}
                      className={`p-2 rounded-full transition-colors ${
                        savedOpportunities.includes(opportunity.id)
                          ? 'bg-danger/20 text-danger'
                          : 'bg-surface text-text-muted hover:text-text-primary'
                      }`}
                    >
                      <HeartHandshake className="h-5 w-5" />
                    </button>
                  </div>
                  
                  <h3 className="font-bold text-lg text-text-primary mb-1 group-hover:text-primary transition-colors">
                    {opportunity.title}
                  </h3>
                  <p className="text-text-muted text-sm mb-3">{opportunity.organization}</p>
                  <p className="text-text-secondary text-sm mb-4 line-clamp-2">{opportunity.description}</p>
                  
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="flex items-center space-x-2 text-text-muted text-sm">
                      <MapPin className="h-4 w-4" />
                      <span>{opportunity.location}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-text-muted text-sm">
                      <Calendar className="h-4 w-4" />
                      <span>{getDaysLeft(opportunity.deadline)}</span>
                    </div>
                    {opportunity.duration && (
                      <div className="flex items-center space-x-2 text-text-muted text-sm">
                        <Clock className="h-4 w-4" />
                        <span>{opportunity.duration}</span>
                      </div>
                    )}
                    <div className="flex items-center space-x-2 text-text-muted text-sm">
                      <Users className="h-4 w-4" />
                      <span>{opportunity.applicants} applied</span>
                    </div>
                  </div>
                  
                  {/* Requirements */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {opportunity.requirements.slice(0, 3).map((req, i) => (
                      <span key={i} className="px-2 py-1 bg-surface text-text-muted text-xs rounded-full">
                        {req}
                      </span>
                    ))}
                  </div>
                  
                  {/* Benefits */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {opportunity.benefits.map((benefit, i) => (
                      <span key={i} className="px-2 py-1 bg-accent/20 text-accent text-xs rounded-full">
                        {benefit}
                      </span>
                    ))}
                  </div>
                  
                  {/* Apply Button */}
                  <button className="btn-primary w-full text-sm">
                    Apply Now
                    <ExternalLink className="inline-block ml-1 h-4 w-4" />
                  </button>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Empty State */}
        {filteredOpportunities.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <Search className="h-16 w-16 text-text-muted mx-auto mb-4" />
            <h3 className="text-xl font-bold text-text-primary mb-2">No opportunities found</h3>
            <p className="text-text-muted">Try adjusting your search or filters</p>
          </motion.div>
        )}
      </div>
    </div>
  )
}
