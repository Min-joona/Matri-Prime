import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Home.css';

const TOPICS = [
  { label: 'Math', icon: 'π' }, { label: 'Physics', icon: '⚛️' },
  { label: 'Chemistry', icon: '⚗️' }, { label: 'Biology', icon: '🦠' },
  { label: 'English', icon: '📝' }, { label: 'Economics', icon: '💹' },
  { label: 'SAT', icon: '🎯' }, { label: 'Logic', icon: '🧠' }
];

const FEATURES = [
  { icon: '🎓', title: 'Interactive Lessons', desc: 'Engaging video content with detailed study guides' },
  { icon: '🏆', title: 'Gamified Learning', desc: 'Earn points, maintain streaks, and compete with peers' },
  { icon: '💼', title: 'Career Opportunities', desc: 'Access scholarships, internships, and career guidance' }
];

const WHY = [
  { icon: '🗺️', title: 'Structured Paths', desc: 'Clear units and lessons from beginner to advanced.' },
  { icon: '🧩', title: 'Spaced Repetition', desc: 'AI-powered flashcards to retain knowledge.' },
  { icon: '🏅', title: 'Gamified Progress', desc: 'XP, streaks, badges, and leaderboards.' },
  { icon: '🎬', title: 'Video + Notes', desc: 'Concise summaries with step-by-step videos.' },
  { icon: '✏️', title: 'Hands-on Practice', desc: 'Quizzes and practical assignments.' },
  { icon: '👥', title: 'Community', desc: 'Study groups and peer support.' }
];

const FLOATING = ['A+','π','E=mc²','∑','⚗️','🔬','🦠','🌋','💹','💱'];

export default function Home() {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    axios.get('/courses').then(r => setCourses(r.data.slice(0, 6))).catch(() => {});
  }, []);

  return (
    <div className="home">
      {/* Hero */}
      <section className="hero">
        <div className="hero-bg">
          {FLOATING.map((f, i) => (
            <span key={i} className="float-el" style={{ '--delay': `${i * 0.4}s`, '--x': `${10 + i * 9}%`, '--y': `${15 + (i % 3) * 25}%` }}>{f}</span>
          ))}
        </div>
        <div className="hero-badge container">
          <span className="badge badge-warning">⭐ Empowering Ethiopian Students Since 2025</span>
        </div>
        <div className="container hero-content">
          <h1 className="hero-title">
            <span className="gradient-text">Learning</span> Launchpad
          </h1>
          <p className="hero-sub">
            Your comprehensive path to academic excellence. Master Ethiopian SAT, high school subjects, and university courses with interactive lessons, gamified quizzes, and AI-powered flashcards.
          </p>
          <div className="hero-cta">
            <Link to="/signup" className="btn btn-primary btn-lg">Start Learning Today →</Link>
            <Link to="/courses/videos" className="btn btn-outline btn-lg">▶ Watch Demo</Link>
          </div>
          <div className="hero-stats">
            {[['100+','Courses'],['1000+','Students'],['500+','Exams'],['24/7','Access']].map(([n,l]) => (
              <div key={l} className="stat-item">
                <span className="stat-num">{n}</span>
                <span className="stat-label">{l}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Topics */}
      <section className="topics-section">
        <div className="container">
          <h2 className="section-title text-center">Start with Essential Topics</h2>
          <div className="topics-grid">
            {TOPICS.map(t => (
              <Link to="/courses" key={t.label} className="topic-card">
                <span className="topic-icon">{t.icon}</span>
                <span>{t.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="features-section section">
        <div className="container features-grid">
          {FEATURES.map(f => (
            <div key={f.title} className="feature-card card">
              <div className="feature-icon">{f.icon}</div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Why */}
      <section className="why-section section">
        <div className="container">
          <div className="text-center" style={{ marginBottom: '2.5rem' }}>
            <h2 className="section-title">Why Students Love Learning Launchpad</h2>
            <p className="section-sub">Built to help you learn faster, remember longer, and achieve more.</p>
          </div>
          <div className="why-grid">
            {WHY.map(w => (
              <div key={w.title} className="why-card">
                <span className="why-icon">{w.icon}</span>
                <div>
                  <h4>{w.title}</h4>
                  <p>{w.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Courses */}
      <section className="popular-section section">
        <div className="container">
          <div className="text-center" style={{ marginBottom: '2.5rem' }}>
            <h2 className="section-title">Popular Courses</h2>
          </div>
          {courses.length === 0 ? (
            <div className="loading"><div className="spinner"/> Loading courses…</div>
          ) : (
            <div className="courses-grid">
              {courses.map(c => (
                <CourseCard key={c._id} course={c} />
              ))}
            </div>
          )}
          <div className="text-center" style={{ marginTop: '2.5rem' }}>
            <Link to="/courses" className="btn btn-outline btn-lg">View All Courses →</Link>
          </div>
        </div>
      </section>

      {/* Help CTA */}
      <div className="help-bubble">
        <Link to="/help" className="help-btn" title="How can I help today?">
          💬 How can I help today?
        </Link>
      </div>
    </div>
  );
}

function CourseCard({ course }) {
  return (
    <div className="home-course-card card">
      <div className="course-badge-row">
        <span className="badge badge-primary">{course.category}</span>
        <span className="badge badge-warning">{course.level}</span>
        {course.isPro && <span className="badge badge-pro">PRO</span>}
      </div>
      <div className="course-emoji" style={{ background: course.color + '22', color: course.color }}>
        {course.emoji}
      </div>
      <h3 className="course-title">{course.title}</h3>
      <p className="course-desc">{course.description}</p>
      <div className="course-meta">
        <span className="star">★</span> {course.rating?.toFixed(1)}
      </div>
      <div className="course-footer">
        <span>⏱ {course.duration}</span>
        <span>👤 {course.students?.toLocaleString()} students</span>
      </div>
      <Link to="/courses" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '1rem' }}>
        Start Learning
      </Link>
    </div>
  );
}
