import { useState } from 'react';
import { Link } from 'react-router-dom';
import './InfoPages.css';

const TOPICS = [
  { icon: '🚀', title: 'Getting Started', desc: 'Create your account, set up your profile, and begin your first course.' },
  { icon: '📚', title: 'Courses & Content', desc: 'Navigate courses, access notes, videos, and learning materials.' },
  { icon: '🃏', title: 'Flashcards', desc: 'Use spaced-repetition flashcards to retain information longer.' },
  { icon: '❓', title: 'Quizzes & Exams', desc: 'Take quizzes, understand scoring, and review your results.' },
  { icon: '🎓', title: 'Scholarships', desc: 'Find and apply for scholarships and funding opportunities.' },
  { icon: '🏆', title: 'Points & Streaks', desc: 'Earn points, maintain streaks, and unlock badges.' },
];

export default function HelpCenter() {
  const [query, setQuery] = useState('');
  const filtered = TOPICS.filter(t =>
    !query || t.title.toLowerCase().includes(query.toLowerCase()) || t.desc.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="info-page">
      <div className="page-hero">
        <div className="container" style={{ textAlign: 'center' }}>
          <h1>💬 Help Center</h1>
          <p>How can we help you today?</p>
          <div style={{ maxWidth: 480, margin: '1.5rem auto 0' }}>
            <input type="text" className="form-input" placeholder="🔍 Search for help…"
              value={query} onChange={e => setQuery(e.target.value)} />
          </div>
        </div>
      </div>

      <div className="container info-content">
        <div className="help-topics">
          {filtered.map(t => (
            <div key={t.title} className="help-topic card">
              <span className="help-topic-icon">{t.icon}</span>
              <h3>{t.title}</h3>
              <p>{t.desc}</p>
              <Link to="/faq" className="btn btn-outline btn-sm" style={{ alignSelf: 'flex-start', marginTop: 'auto' }}>
                Learn More →
              </Link>
            </div>
          ))}
        </div>

        <div className="help-contact card" style={{ marginTop: '2rem', textAlign: 'center', padding: '2.5rem' }}>
          <h2>Still need help?</h2>
          <p style={{ color: 'var(--text2)', marginBottom: '1.5rem' }}>
            Our support team is always here to help you succeed.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/contact" className="btn btn-primary">✉️ Contact Us</Link>
            <Link to="/faq" className="btn btn-outline">❓ View FAQ</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
