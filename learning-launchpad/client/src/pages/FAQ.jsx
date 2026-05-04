import { useState } from 'react';
import './InfoPages.css';

const FAQS = [
  { q: 'Is Learning Launchpad free to use?', a: 'Most content is free! We offer a free tier with access to many courses, notes, and flashcards. Some premium content (marked PRO) requires a subscription.' },
  { q: 'How do I earn points and maintain my streak?', a: 'You earn points by completing lessons, quizzes, and flashcard sessions. Your streak increases each day you log in and study. Missing a day resets your streak.' },
  { q: 'Can I download content for offline use?', a: 'Currently, offline downloads are available for Pro subscribers. We\'re working on expanding this feature for all users.' },
  { q: 'How does the flashcard spaced-repetition work?', a: 'After viewing each card, you rate your confidence (Again / Hard / Good / Easy). Cards you find hard appear more frequently; easy cards appear less often, optimizing your memory retention.' },
  { q: 'What subjects are available?', a: 'We cover Mathematics, Physics, Chemistry, Biology, English, Economics, Ethiopian SAT prep, Geography, Psychology, and more — with new content added regularly.' },
  { q: 'How do I apply for scholarships listed on the site?', a: 'Click "View Details" on any scholarship to visit the official application page. Learning Launchpad does not process scholarship applications — we curate and link to official sources.' },
  { q: 'Can I use Learning Launchpad on my phone?', a: 'Yes! The site is fully responsive and works on all devices. A dedicated mobile app is coming soon.' },
  { q: 'How do I reset my password?', a: 'Click "Forgot Password?" on the login page and enter your email. You\'ll receive a reset link within a few minutes.' },
];

export default function FAQ() {
  const [open, setOpen] = useState(null);
  return (
    <div className="info-page">
      <div className="page-hero">
        <div className="container" style={{ textAlign: 'center' }}>
          <h1>❓ Frequently Asked Questions</h1>
          <p>Find answers to the most common questions about Learning Launchpad.</p>
        </div>
      </div>
      <div className="container info-content" style={{ maxWidth: 780 }}>
        <div className="faq-list">
          {FAQS.map((f, i) => (
            <div key={i} className={`faq-item card ${open === i ? 'open' : ''}`}>
              <button className="faq-q" onClick={() => setOpen(open === i ? null : i)}>
                <span>{f.q}</span>
                <span className="faq-arrow">{open === i ? '▲' : '▼'}</span>
              </button>
              {open === i && <p className="faq-a">{f.a}</p>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
