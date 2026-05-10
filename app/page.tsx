'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  Brain, 
  Video, 
  Layers, 
  Target, 
  Award, 
  Users, 
  ArrowRight,
  ChevronDown,
  Zap,
  BookOpen,
  Trophy,
  Flame
} from 'lucide-react'
import { useGamificationStore } from '@/stores/gamification-store'

export default function Home() {
  const { streak, xp, level } = useGamificationStore()
  
  const features = [
    {
      title: 'AI Notes',
      description: 'Intelligent summaries that adapt to your learning style. Highlight, annotate, and export with ease.',
      icon: Brain,
      gradient: 'bg-gradient-to-br from-primary/20 to-primary/5',
      feature: 'AI-enhanced smart notes'
    },
    {
      title: 'Video Lessons',
      description: '5-15 minute lessons with Ethiopian context. Watch on any device, anytime.',
      icon: Video,
      gradient: 'bg-gradient-to-br from-secondary/20 to-secondary/5',
      feature: 'Netflix-style video player'
    },
    {
      title: 'Smart Flashcards',
      description: 'Anki-inspired SRS algorithm with beautiful glassmorphic design. Speed run mode included.',
      icon: Layers,
      gradient: 'bg-gradient-to-br from-accent/20 to-accent/5',
      feature: 'Spaced repetition mastery'
    },
    {
      title: 'Practice Exams',
      description: 'AI-proctored mock ESLCE simulations. Real-time analytics and detailed feedback.',
      icon: Target,
      gradient: 'bg-gradient-to-br from-danger/20 to-danger/5',
      feature: 'Full mock tests with timers'
    },
    {
      title: 'Scholarships',
      description: 'Discover 1000+ funding opportunities. Track deadlines and get application prep.',
      icon: Award,
      gradient: 'bg-gradient-to-br from-primary/20 to-secondary/20',
      feature: 'Scholarship discovery engine'
    },
    {
      title: 'Study Squad',
      description: 'Join 50,000+ Ethiopian students. Share notes, celebrate wins, grow together.',
      icon: Users,
      gradient: 'bg-gradient-to-br from-secondary/20 to-accent/20',
      feature: 'Community-driven learning'
    }
  ]

  const stats = [
    { label: 'Streaks Active Today', value: '12,450', icon: Flame },
    { label: 'Questions Answered', value: '892,400', icon: Zap },
    { label: 'Scholarships Found', value: '4,200', icon: Trophy },
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Animated Background */}
        <motion.div
          className="absolute inset-0 bg-gradient-primary opacity-20"
          animate={{
            backgroundPosition: ['0% 0%', '100% 100%'],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            repeatType: 'reverse',
            ease: 'linear',
          }}
          style={{
            backgroundSize: '200% 200%',
          }}
        />
        
        {/* Geometric Shapes */}
        <motion.div
          className="absolute top-20 left-20 w-64 h-64 bg-primary/20 rounded-full filter blur-3xl"
          animate={{ x: [0, 100, 0], y: [0, -50, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        />
        
        <motion.div
          className="absolute bottom-20 right-20 w-96 h-96 bg-secondary/20 rounded-full filter blur-3xl"
          animate={{ x: [0, -150, 0], y: [0, 100, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
        />
        
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="text-4xl sm:text-6xl lg:text-7xl font-black gradient-text mb-6 leading-tight"
          >
            Master Your Future.<br />One Streak at a Time.
          </motion.h1>
          
          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
            className="text-lg sm:text-xl text-text-muted max-w-3xl mx-auto mb-8"
          >
            Join 50,000+ Ethiopian students crushing the ESLCE with AI-powered study tools, gamified learning, and a community that lifts everyone up.
          </motion.p>
          
          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: 'easeOut' }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
          >
            <Link
              href="/dashboard"
              className="btn-primary text-lg px-8 py-4 group relative overflow-hidden"
            >
              <span className="relative z-10">Start Your Streak</span>
              <ArrowRight className="inline-block ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent"
                initial={{ x: '-100%' }}
                whileHover={{ x: '100%' }}
                transition={{ duration: 0.6 }}
              />
            </Link>
            
            <Link
              href="/courses"
              className="btn-secondary text-lg px-8 py-4 group"
            >
              Explore Courses
              <BookOpen className="inline-block ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
          
          {/* Social Proof */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex items-center justify-center space-x-4"
          >
            {/* Floating Avatars */}
            <div className="flex -space-x-2">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="w-10 h-10 rounded-full bg-gradient-primary border-2 border-background animate-float"
                  style={{ animationDelay: `${i * 0.2}s` }}
                />
              ))}
            </div>
            <div className="text-sm text-text-muted">
              <span className="font-semibold text-text-primary">12,450</span> students active now
            </div>
          </motion.div>
        </div>
        
        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <ChevronDown className="h-6 w-6 text-text-muted" />
          </motion.div>
        </motion.div>
      </section>
      
      {/* Features Grid Section */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-5xl font-bold gradient-text mb-4">
              The Ultimate Learning Arsenal
            </h2>
            <p className="text-lg text-text-muted max-w-2xl mx-auto">
              Everything you need to crush the ESLCE,
              wrapped in gamification that keeps you addicted to success.
            </p>
          </motion.div>
          
          {/* Bento Box Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="group relative"
                >
                  <div className="relative glass-card p-8 h-full overflow-hidden card-hover">
                    {/* Gradient Background Layer */}
                    <div className={`absolute inset-0 ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
                    
                    {/* Content */}
                    <div className="relative z-10">
                      <motion.div
                        className="w-14 h-14 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center mb-4 group-hover:rotate-3 transition-transform"
                        whileHover={{ scale: 1.1 }}
                      >
                        <Icon className="h-7 w-7 text-white" />
                      </motion.div>
                      
                      <h3 className="text-xl font-bold text-text-primary mb-2 group-hover:text-text-primary">
                        {feature.title}
                      </h3>
                      <p className="text-text-muted mb-4 group-hover:text-text-secondary">
                        {feature.description}
                      </p>
                      <div className="inline-flex items-center text-sm text-primary font-semibold">
                        {feature.feature}
                        <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                    
                    {/* Tilt Effect on Hover */}
                    <motion.div
                      className="pointer-events-none"
                      initial={{ rotateX: 0, rotateY: 0 }}
                      whileHover={{ rotateX: 2, rotateY: 2 }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>
      
      {/* Stats Section */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="text-center"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.2, type: 'spring' }}
                    className="glass-card inline-flex items-center justify-center w-20 h-20 rounded-2xl mb-4"
                  >
                    <Icon className="h-10 w-10 text-primary" />
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.1 + 0.3 }}
                    className="text-4xl font-bold gradient-text mb-2"
                  >
                    {stat.value}
                  </motion.div>
                  <p className="text-text-muted">{stat.label}</p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 bg-gradient-primary">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-5xl font-bold text-white mb-6">
            Ready to Start Your Journey?
          </h2>
          <p className="text-lg text-white/90 mb-8">
            Join thousands of students already transforming their future with MatriPrime.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/dashboard"
              className="bg-white text-primary font-bold px-8 py-4 rounded-xl hover:bg-white/90 transition-all hover:scale-105 group"
            >
              Get Started Free
              <ArrowRight className="inline-block ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/courses"
              className="bg-white/20 text-white border-2 border-white/50 font-semibold px-8 py-4 rounded-xl hover:bg-white/30 transition-all"
            >
              Explore Courses
            </Link>
          </div>
        </div>
      </section>
      
      {/* Footer Section */}
      <footer className="bg-background border-t border-white/10 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Flame className="h-6 w-6 text-secondary" />
              <span className="font-bold text-lg gradient-text">MatriPrime</span>
            </div>
            <div className="text-text-muted text-sm">
              Made with ❤️ for Ethiopian Students
            </div>
            <div className="flex items-center space-x-4 mt-4 md:mt-0">
              <Link href="/privacy" className="text-text-muted hover:text-text-primary text-sm">
                Privacy
              </Link>
              <Link href="/terms" className="text-text-muted hover:text-text-primary text-sm">
                Terms
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
