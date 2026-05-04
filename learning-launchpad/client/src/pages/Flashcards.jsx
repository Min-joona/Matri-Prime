import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Flashcards.css';

const SUBJECTS = [
  { id: 'biology', label: 'Biology', icon: '🦠', color: '#16a34a' },
  { id: 'mathematics', label: 'Mathematics', icon: 'π', color: '#2563eb' },
  { id: 'physics', label: 'Physics', icon: '⚛️', color: '#0891b2' },
  { id: 'chemistry', label: 'Chemistry', icon: '⚗️', color: '#d97706' },
];

const SUB_LINKS = [
  { label: 'Notes', path: '/courses/notes', icon: '📄' },
  { label: 'Videos', path: '/courses/videos', icon: '🎬' },
  { label: 'Quizzes', path: '/courses/quizzes', icon: '❓' },
  { label: 'Flashcards', path: '/courses/flashcards', icon: '🃏' },
  { label: 'Exams', path: '/courses/exams', icon: '📋' },
];

export default function Flashcards() {
  const [subject, setSubject] = useState(null);
  const [cards, setCards] = useState([]);
  const [sessionTitle, setSessionTitle] = useState('');
  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [shown, setShown] = useState(false);
  const [stats, setStats] = useState({ studied: 0, correct: 0, streak: 0, time: 0 });
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [seconds, setSeconds] = useState(0);

  // Timer
  useEffect(() => {
    if (!subject || done) return;
    const t = setInterval(() => setSeconds(s => s + 1), 1000);
    return () => clearInterval(t);
  }, [subject, done]);

  const fmt = s => `${String(Math.floor(s / 60)).padStart(2,'0')}:${String(s % 60).padStart(2,'0')}`;

  const loadSubject = async (sub) => {
    setLoading(true);
    try {
      const { data } = await axios.get(`/flashcards/${sub.id}`);
      setCards(data.cards);
      setSessionTitle(data.title);
      setSubject(sub);
      setIdx(0); setFlipped(false); setShown(false);
      setStats({ studied: 0, correct: 0, streak: 0, time: 0 });
      setDone(false); setSeconds(0);
    } catch { } finally { setLoading(false); }
  };

  const showAnswer = () => { setFlipped(true); setShown(true); };

  const grade = (rating) => {
    const isCorrect = rating >= 3;
    setStats(s => ({
      studied: s.studied + 1,
      correct: isCorrect ? s.correct + 1 : s.correct,
      streak: isCorrect ? s.streak + 1 : 0,
      time: seconds
    }));
    if (idx + 1 >= cards.length) { setDone(true); return; }
    setIdx(i => i + 1);
    setFlipped(false); setShown(false);
  };

  const handleKey = useCallback((e) => {
    if (!subject || done) return;
    if (e.code === 'Space') { e.preventDefault(); if (!shown) showAnswer(); }
    if (shown) {
      if (e.key === '1') grade(1);
      if (e.key === '2') grade(2);
      if (e.key === '3') grade(3);
      if (e.key === '4') grade(4);
    }
  }, [subject, done, shown, idx]);

  useEffect(() => {
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [handleKey]);

  const restart = () => { setIdx(0); setFlipped(false); setShown(false); setDone(false); setSeconds(0); setStats({ studied: 0, correct: 0, streak: 0, time: 0 }); };

  if (!subject) {
    return (
      <div className="flash-page">
        <div className="page-hero">
          <div className="container">
            <h1>✨ Practice Flashcards</h1>
            <p>Choose a subject to begin your spaced-repetition session.</p>
          </div>
        </div>
        <div className="courses-subnav">
          <div className="container subnav-inner">
            {SUB_LINKS.map(l => (
              <Link key={l.path} to={l.path} className={`subnav-link${l.path.includes('flashcards') ? ' active-sub' : ''}`}>
                {l.icon} {l.label}
              </Link>
            ))}
          </div>
        </div>
        <div className="container flash-picker">
          {SUBJECTS.map(s => (
            <button key={s.id} className="subject-card card" onClick={() => loadSubject(s)}
              style={{ '--c': s.color }}>
              <span className="sub-icon" style={{ background: s.color + '22', color: s.color }}>{s.icon}</span>
              <h3>{s.label}</h3>
              <p className="sub-count">Practice flashcards</p>
              <span className="btn btn-primary btn-sm" style={{ marginTop: '0.75rem' }}>Start Session →</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  const card = cards[idx];
  const progress = ((idx) / cards.length) * 100;

  return (
    <div className="flash-page">
      <div className="page-hero">
        <div className="container flash-hero-inner">
          <button className="btn btn-outline btn-sm" onClick={() => setSubject(null)}>← Back to Main</button>
          <div>
            <h1>{sessionTitle} Flashcards</h1>
            <p>Master your knowledge with spaced repetition</p>
          </div>
          <button className="btn btn-outline btn-sm end-btn" onClick={() => setDone(true)}>End Session</button>
        </div>
      </div>

      {loading ? (
        <div className="loading"><div className="spinner" /> Loading cards…</div>
      ) : done ? (
        <SessionComplete stats={stats} cards={cards} onMore={restart} onBack={() => setSubject(null)} />
      ) : (
        <div className="container flash-session">
          {/* Stats bar */}
          <div className="flash-stats-bar">
            <span>📖 {stats.studied} studied</span>
            <span>✅ {stats.correct} correct</span>
            <span>🔥 {stats.streak} streak</span>
            <span className="timer">⏱ {fmt(seconds)}</span>
          </div>

          {/* Progress */}
          <div className="flash-progress-row">
            <span className="prog-label">{idx + 1} / {cards.length}</span>
            <div className="prog-bar-bg">
              <div className="prog-bar-fill" style={{ width: `${progress}%` }} />
            </div>
          </div>

          {/* Card */}
          <div className={`flash-card-wrap ${flipped ? 'flipped' : ''}`} onClick={!shown ? showAnswer : undefined}>
            <div className="flash-card">
              <div className="flash-front">
                <div className="card-label">Question</div>
                <p className="card-text">{card?.question}</p>
                {!shown && <span className="click-hint">Click to reveal answer</span>}
              </div>
              <div className="flash-back">
                <div className="card-label">Answer</div>
                <p className="card-text">{card?.answer}</p>
              </div>
            </div>
          </div>

          {/* Actions */}
          {!shown ? (
            <div className="flash-actions">
              <button className="btn btn-primary btn-lg show-btn" onClick={showAnswer}>Show Answer</button>
              <p className="key-hint">Space - Show Answer</p>
            </div>
          ) : (
            <div className="grade-buttons">
              {[
                { r: 1, emoji: '😰', label: 'Again', key: '1' },
                { r: 2, emoji: '😐', label: 'Hard', key: '2' },
                { r: 3, emoji: '😊', label: 'Good', key: '3' },
                { r: 4, emoji: '😄', label: 'Easy', key: '4' },
              ].map(g => (
                <button key={g.r} className={`grade-btn grade-${g.r}`} onClick={() => grade(g.r)}>
                  <span className="grade-emoji">{g.emoji}</span>
                  <span className="grade-label">{g.label}</span>
                  <span className="grade-key">Press {g.key}</span>
                </button>
              ))}
              <p className="key-hint full-hint">Space - Show Answer &nbsp;|&nbsp; 1–4 - Select Difficulty</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function SessionComplete({ stats, cards, onMore, onBack }) {
  const accuracy = stats.studied > 0 ? Math.round((stats.correct / stats.studied) * 100) : 0;
  return (
    <div className="container session-complete">
      <div className="complete-card card">
        <div className="complete-icon">🎉</div>
        <h2>Session Complete!</h2>
        <p>Great work! Here's how you performed:</p>
        <div className="complete-stats">
          <div className="cs-item"><span className="cs-num">{stats.studied}</span><span>Cards Studied</span></div>
          <div className="cs-item"><span className="cs-num">{accuracy}%</span><span>Accuracy</span></div>
          <div className="cs-item"><span className="cs-num">{stats.streak}</span><span>Best Streak</span></div>
        </div>
        <div className="complete-actions">
          <button className="btn btn-primary btn-lg" onClick={onMore}>Study More</button>
          <button className="btn btn-outline btn-lg" onClick={onBack}>Back to Decks</button>
        </div>
      </div>
    </div>
  );
}
