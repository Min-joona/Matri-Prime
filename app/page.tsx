'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion, useScroll, useTransform, useInView } from 'framer-motion'
import { useRef } from 'react'
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
  Flame,
  Sparkles,
  GraduationCap,
  Calculator,
  Atom,
  FlaskConical,
  Dna,
  CheckCircle2
} from 'lucide-react'

// Partner Logos Component
function PartnerMarquee() {
  const partners = [
    { name: 'Ministry of Education Ethiopia', abbr: 'MOE' },
    { name: 'Educational Assessment and Examination Services', abbr: 'EAES' },
    { name: 'Addis Ababa University', abbr: 'AAU' },
    { name: 'Ethiopian Education Network', abbr: 'EEN' },
    { name: 'STEM Ethiopia', abbr: 'STEM' },
    { name: 'Unity University', abbr: 'UU' },
  ]

  return (
    <div className="relative overflow-hidden py-8 bg-background-card/50 border-y border-border">
      <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-background to-transparent z-10" />
      <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-background to-transparent z-10" />
      
      <div className="flex animate-marquee">
        {[...partners, ...partners].map((partner, i) => (
          <div
            key={i}
            className="flex items-center gap-3 mx-12 whitespace-nowrap"
          >
            <div className="w-10 h-10 rounded-lg bg-background-surface border border-border flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-text-muted text-xs uppercase tracking-wider">Partner</p>
              <p className="text-text-primary font-semibold">{partner.abbr}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// Animated Section Component
function AnimatedSection({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 60 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
      transition={{ duration: 0.8, ease: [0.21, 0.47, 0.32, 0.98] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// Feature Card Component
function FeatureCard({ 
  icon: Icon, 
  title, 
  description, 
  delay = 0 
}: { 
  icon: React.ElementType
  title: string
  description: string
  delay?: number
}) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-50px" })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 40, scale: 0.95 }}
      transition={{ duration: 0.6, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
      className="group"
    >
      <div className="relative bg-background-card border border-border rounded-2xl p-6 h-full transition-all duration-500 hover:border-primary/50 hover:shadow-glow overflow-hidden">
        {/* Glow Effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        {/* Icon Container */}
        <div className="relative w-14 h-14 bg-background-surface border border-border rounded-xl flex items-center justify-center mb-4 group-hover:border-primary/50 group-hover:shadow-glow transition-all duration-300">
          <Icon className="w-7 h-7 text-primary" />
        </div>
        
        {/* Content */}
        <h3 className="relative text-xl font-bold text-text-primary mb-2">{title}</h3>
        <p className="relative text-text-muted leading-relaxed">{description}</p>
        
        {/* Arrow */}
        <div className="relative flex items-center gap-2 mt-4 text-primary font-medium opacity-0 group-hover:opacity-100 translate-x-0 group-hover:translate-x-2 transition-all duration-300">
          Learn more <ArrowRight className="w-4 h-4" />
        </div>
      </div>
    </motion.div>
  )
}

// Subject Card for Dashboard Preview
function SubjectCard({ 
  icon: Icon, 
  name, 
  progress,
  delay = 0
}: { 
  icon: React.ElementType
  name: string
  progress: number
  delay?: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay }}
      className="bg-background-surface border border-border rounded-2xl p-5 flex flex-col items-center gap-3 hover:border-primary/50 transition-all duration-300"
    >
      {/* Progress Circle */}
      <div className="relative w-20 h-20">
        <svg className="w-full h-full -rotate-90">
          <circle
            cx="40"
            cy="40"
            r="35"
            stroke="currentColor"
            strokeWidth="4"
            fill="none"
            className="text-border"
          />
          <circle
            cx="40"
            cy="40"
            r="35"
            stroke="currentColor"
            strokeWidth="4"
            fill="none"
            strokeLinecap="round"
            className="text-primary"
            strokeDasharray={`${progress * 2.2} 220`}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <Icon className="w-8 h-8 text-primary" />
        </div>
      </div>
      <span className="font-bold text-text-primary uppercase tracking-wider text-sm">{name}</span>
      <button className="bg-primary text-black text-xs font-bold px-4 py-1.5 rounded-full hover:bg-primary-light transition-colors">
        START
      </button>
    </motion.div>
  )
}

export default function Home() {
  const heroRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  })
  
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])
  const heroScale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95])
  const heroY = useTransform(scrollYProgress, [0, 0.5], [0, 100])
  
  const features = [
    {
      title: 'AI-Powered Notes',
      description: 'Smart summaries that adapt to your learning style. Highlight key concepts and export with ease.',
      icon: Brain,
    },
    {
      title: 'Video Lessons',
      description: 'Bite-sized 5-15 minute lessons with Ethiopian context. Learn anywhere, anytime.',
      icon: Video,
    },
    {
      title: 'Smart Flashcards',
      description: 'Anki-inspired spaced repetition with beautiful design. Master any subject faster.',
      icon: Layers,
    },
    {
      title: 'Practice Exams',
      description: 'Realistic ESLCE simulations with AI proctoring. Get instant feedback and analytics.',
      icon: Target,
    },
    {
      title: 'Scholarships',
      description: 'Discover 1000+ funding opportunities. Track deadlines and get application guidance.',
      icon: Award,
    },
    {
      title: 'Study Squad',
      description: 'Join 50,000+ students. Share notes, celebrate wins, and grow together.',
      icon: Users,
    },
  ]

  const stats = [
    { value: '50,000+', label: 'Active Students', icon: Users },
    { value: '892,400', label: 'Questions Answered', icon: Zap },
    { value: '12,450', label: 'Streaks Active Today', icon: Flame },
    { value: '4,200+', label: 'Scholarships Found', icon: Trophy },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(132,204,22,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(132,204,22,0.03)_1px,transparent_1px)] bg-[size:64px_64px]" />
        
        {/* Animated Glow Orbs */}
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full filter blur-[128px]"
          animate={{ 
            x: [0, 100, 0], 
            y: [0, -50, 0],
            scale: [1, 1.2, 1]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-secondary/10 rounded-full filter blur-[128px]"
          animate={{ 
            x: [0, -80, 0], 
            y: [0, 60, 0],
            scale: [1.2, 1, 1.2]
          }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        />
        
        <motion.div 
          style={{ opacity: heroOpacity, scale: heroScale, y: heroY }}
          className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 bg-background-card border border-border rounded-full px-4 py-2 mb-8"
          >
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm text-text-secondary">Ethiopia&apos;s #1 Learning Platform</span>
          </motion.div>
          
          {/* Main Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-5xl sm:text-7xl lg:text-8xl font-black mb-6 leading-[0.9] tracking-tight"
          >
            <span className="text-text-primary">Master Your</span>
            <br />
            <span className="gradient-text">Future.</span>
          </motion.h1>
          
          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg sm:text-xl text-text-muted max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Join 50,000+ Ethiopian students crushing the ESLCE with AI-powered study tools, 
            gamified learning, and a community that lifts everyone up.
          </motion.p>
          
          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16"
          >
            <Link
              href="/dashboard"
              className="group relative bg-primary text-black font-bold text-lg px-8 py-4 rounded-xl shadow-glow hover:shadow-glow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-2">
                Start Your Streak
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>
            
            <Link
              href="/courses"
              className="group bg-transparent text-text-primary font-semibold text-lg px-8 py-4 rounded-xl border border-border hover:border-primary/50 hover:bg-background-card transition-all duration-300"
            >
              <span className="flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                Explore Courses
              </span>
            </Link>
          </motion.div>
          
          {/* Hero Image - App Preview */}
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="relative max-w-4xl mx-auto"
          >
            {/* Tablet Frame */}
            <div className="relative bg-background-card border border-border rounded-3xl p-4 shadow-2xl">
              {/* Inner Screen */}
              <div className="bg-background-surface rounded-2xl p-6 overflow-hidden">
                {/* Dashboard Preview */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Streak Card */}
                  <div className="bg-background-card border border-border rounded-2xl p-5">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="text-text-muted text-sm uppercase tracking-wider">Streak</p>
                        <p className="text-4xl font-black text-text-primary">7 DAYS</p>
                      </div>
                      <Flame className="w-12 h-12 text-primary streak-flame" />
                    </div>
                    <div className="space-y-2">
                      <p className="text-text-muted text-sm">LEVEL 9</p>
                      <div className="h-2 bg-background-surface rounded-full overflow-hidden">
                        <div className="h-full w-[90%] bg-primary rounded-full" />
                      </div>
                      <p className="text-text-muted text-xs">4500/5000 XP</p>
                    </div>
                  </div>
                  
                  {/* Leaderboard Card */}
                  <div className="bg-background-card border border-border rounded-2xl p-5">
                    <p className="text-text-muted text-sm uppercase tracking-wider mb-3">Leaderboard</p>
                    <div className="space-y-2">
                      {[
                        { name: 'YOU', xp: '12000' },
                        { name: 'ALEX', xp: '11800' },
                        { name: 'SARA', xp: '10200' },
                      ].map((user, i) => (
                        <div key={i} className="flex items-center justify-between text-sm">
                          <span className="text-text-primary font-medium">{i + 1}. {user.name}</span>
                          <span className="text-primary">{user.xp} XP</span>
                        </div>
                      ))}
                    </div>
                    <button className="mt-3 w-full border border-border text-text-secondary text-xs font-medium py-2 rounded-lg hover:border-primary/50 transition-colors">
                      VIEW ALL
                    </button>
                  </div>
                </div>
                
                {/* Subject Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                  <SubjectCard icon={Calculator} name="Math" progress={75} delay={0.5} />
                  <SubjectCard icon={Atom} name="Physics" progress={60} delay={0.6} />
                  <SubjectCard icon={FlaskConical} name="Chemistry" progress={45} delay={0.7} />
                  <SubjectCard icon={Dna} name="Biology" progress={30} delay={0.8} />
                </div>
              </div>
            </div>
            
            {/* Floating Elements */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="absolute -left-8 top-1/4 hidden lg:block"
            >
              <div className="bg-background-card border border-primary/30 rounded-xl p-4 shadow-glow">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-primary font-bold">+50 XP</p>
                    <p className="text-text-muted text-xs">Lesson Completed!</p>
                  </div>
                </div>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 1 }}
              className="absolute -right-8 top-1/3 hidden lg:block"
            >
              <div className="bg-background-card border border-border rounded-xl p-4">
                <p className="text-primary font-bold text-2xl">CORRECT!</p>
                <p className="text-text-primary font-semibold mt-1">PHOTON</p>
                <p className="text-text-muted text-xs">Discrete packets of energy</p>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
        
        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <ChevronDown className="w-6 h-6 text-text-muted" />
          </motion.div>
        </motion.div>
      </section>
      
      {/* Partner Marquee */}
      <PartnerMarquee />
      
      {/* Features Section */}
      <section className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-black mb-4">
              <span className="text-text-primary">The Ultimate </span>
              <span className="gradient-text">Learning Arsenal</span>
            </h2>
            <p className="text-lg text-text-muted max-w-2xl mx-auto">
              Everything you need to crush the ESLCE, wrapped in gamification 
              that keeps you addicted to success.
            </p>
          </AnimatedSection>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <FeatureCard
                key={feature.title}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                delay={i * 0.1}
              />
            ))}
          </div>
        </div>
      </section>
      
      {/* Stats Section */}
      <section className="py-24 bg-background-card/50 border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, i) => {
              const Icon = stat.icon
              return (
                <AnimatedSection key={stat.label}>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                    className="text-center"
                  >
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-background-surface border border-border rounded-2xl mb-4">
                      <Icon className="w-8 h-8 text-primary" />
                    </div>
                    <p className="text-3xl sm:text-4xl font-black gradient-text mb-1">{stat.value}</p>
                    <p className="text-text-muted text-sm">{stat.label}</p>
                  </motion.div>
                </AnimatedSection>
              )
            })}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-24 bg-background relative overflow-hidden">
        {/* Background Glow */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent" />
        
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <AnimatedSection>
            <h2 className="text-4xl sm:text-5xl font-black text-text-primary mb-6">
              Ready to Start Your Journey?
            </h2>
            <p className="text-lg text-text-muted mb-10 max-w-2xl mx-auto">
              Join thousands of Ethiopian students already transforming their future with MatriPrime. 
              Your success story begins today.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/dashboard"
                className="group bg-primary text-black font-bold text-lg px-10 py-4 rounded-xl shadow-glow hover:shadow-glow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <span className="flex items-center justify-center gap-2">
                  Get Started Free
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
              <Link
                href="/courses"
                className="bg-transparent text-text-primary font-semibold text-lg px-10 py-4 rounded-xl border border-border hover:border-primary/50 transition-all duration-300"
              >
                Browse Courses
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-background-card border-t border-border py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl overflow-hidden">
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Make_a_favicon_for_this_202605101610-cf4gjUgqbIaMwLxgtQw9KAqtcivQvv.jpeg"
                  alt="MatriPrime Logo"
                  width={40}
                  height={40}
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="font-bold text-xl gradient-text">MatriPrime</span>
            </div>
            
            {/* Made with love */}
            <p className="text-text-muted text-sm">
              Made with love for Ethiopian Students
            </p>
            
            {/* Links */}
            <div className="flex items-center gap-6">
              <Link href="/privacy" className="text-text-muted hover:text-primary text-sm transition-colors">
                Privacy
              </Link>
              <Link href="/terms" className="text-text-muted hover:text-primary text-sm transition-colors">
                Terms
              </Link>
              <Link href="/support" className="text-text-muted hover:text-primary text-sm transition-colors">
                Support
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
