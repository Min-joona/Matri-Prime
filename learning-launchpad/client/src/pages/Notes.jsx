import { Link } from 'react-router-dom';
import './SubPages.css';

const SUB_LINKS = [
  { label: 'Notes', path: '/courses/notes', icon: '📄' },
  { label: 'Videos', path: '/courses/videos', icon: '🎬' },
  { label: 'Quizzes', path: '/courses/quizzes', icon: '❓' },
  { label: 'Flashcards', path: '/courses/flashcards', icon: '🃏' },
  { label: 'Exams', path: '/courses/exams', icon: '📋' },
];

const NOTES_DATA = [
  { subject: 'Mathematics', icon: 'π', color: '#2563eb', topics: ['Algebra & Equations', 'Calculus Fundamentals', 'Trigonometry', 'Statistics & Probability'] },
  { subject: 'Physics', icon: '⚛️', color: '#0891b2', topics: ['Mechanics & Motion', 'Thermodynamics', 'Electromagnetism', 'Optics & Waves'] },
  { subject: 'Chemistry', icon: '⚗️', color: '#d97706', topics: ['Atomic Structure', 'Chemical Bonding', 'Organic Chemistry', 'Equilibrium'] },
  { subject: 'Biology', icon: '🦠', color: '#16a34a', topics: ['Cell Biology', 'Genetics & DNA', 'Ecology', 'Human Physiology'] },
  { subject: 'English', icon: '📝', color: '#7c3aed', topics: ['Grammar & Syntax', 'Essay Writing', 'Literature Analysis', 'Vocabulary'] },
  { subject: 'Economics', icon: '💹', color: '#9333ea', topics: ['Microeconomics', 'Macroeconomics', 'Market Structures', 'Fiscal Policy'] },
];

export default function Notes() {
  return (
    <SubPageShell title="📄 Study Notes" sub="Detailed notes and summaries for every subject." active="Notes">
      <div className="notes-grid">
        {NOTES_DATA.map(n => (
          <div key={n.subject} className="note-card card">
            <div className="note-icon" style={{ background: n.color + '22', color: n.color }}>{n.icon}</div>
            <h3>{n.subject}</h3>
            <ul className="note-topics">
              {n.topics.map(t => <li key={t}><span>→</span> {t}</li>)}
            </ul>
            <Link to="/courses" className="btn btn-primary btn-sm" style={{ marginTop: 'auto', alignSelf: 'flex-start' }}>
              View Notes →
            </Link>
          </div>
        ))}
      </div>
    </SubPageShell>
  );
}

export function Videos() {
  const videos = [
    { title: 'Introduction to Calculus', subject: 'Mathematics', duration: '18 min', icon: 'π', color: '#2563eb', thumb: '▶' },
    { title: "Newton's Laws of Motion", subject: 'Physics', duration: '22 min', icon: '⚛️', color: '#0891b2', thumb: '▶' },
    { title: 'Organic Chemistry Basics', subject: 'Chemistry', duration: '25 min', icon: '⚗️', color: '#d97706', thumb: '▶' },
    { title: 'Cell Division: Mitosis & Meiosis', subject: 'Biology', duration: '20 min', icon: '🦠', color: '#16a34a', thumb: '▶' },
    { title: 'Essay Writing Masterclass', subject: 'English', duration: '15 min', icon: '📝', color: '#7c3aed', thumb: '▶' },
    { title: 'Supply & Demand Explained', subject: 'Economics', duration: '17 min', icon: '💹', color: '#9333ea', thumb: '▶' },
  ];
  return (
    <SubPageShell title="🎬 Video Lessons" sub="Watch concise, high-quality lesson videos for every topic." active="Videos">
      <div className="videos-grid">
        {videos.map(v => (
          <div key={v.title} className="video-card card">
            <div className="video-thumb" style={{ background: v.color + '22' }}>
              <span className="play-icon" style={{ color: v.color }}>▶</span>
              <span className="vid-subject-icon" style={{ color: v.color + 'aa' }}>{v.icon}</span>
            </div>
            <div className="video-info">
              <span className="vid-subject">{v.subject}</span>
              <h4>{v.title}</h4>
              <span className="vid-dur">⏱ {v.duration}</span>
            </div>
          </div>
        ))}
      </div>
    </SubPageShell>
  );
}

export function Quizzes() {
  const quizzes = [
    { title: 'Algebra Quiz — Chapter 3', subject: 'Mathematics', questions: 20, difficulty: 'Medium', icon: 'π', color: '#2563eb' },
    { title: 'Physics: Kinematics Test', subject: 'Physics', questions: 15, difficulty: 'Hard', icon: '⚛️', color: '#0891b2' },
    { title: 'Chemistry Bonding Quiz', subject: 'Chemistry', questions: 18, difficulty: 'Medium', icon: '⚗️', color: '#d97706' },
    { title: 'Biology: Genetics Round', subject: 'Biology', questions: 25, difficulty: 'Easy', icon: '🦠', color: '#16a34a' },
    { title: 'English Grammar Challenge', subject: 'English', questions: 30, difficulty: 'Easy', icon: '📝', color: '#7c3aed' },
    { title: 'SAT Practice — Math Section', subject: 'SAT Prep', questions: 44, difficulty: 'Hard', icon: '🎯', color: '#dc2626' },
  ];
  const diffColor = { Easy: 'success', Medium: 'warning', Hard: 'danger' };
  return (
    <SubPageShell title="❓ Quizzes" sub="Test your knowledge with interactive quizzes." active="Quizzes">
      <div className="quiz-list">
        {quizzes.map(q => (
          <div key={q.title} className="quiz-card card">
            <div className="quiz-icon" style={{ background: q.color + '22', color: q.color }}>{q.icon}</div>
            <div className="quiz-info">
              <span className="quiz-subject">{q.subject}</span>
              <h4>{q.title}</h4>
              <div className="quiz-meta">
                <span>📝 {q.questions} questions</span>
                <span className={`badge badge-${diffColor[q.difficulty]}`}>{q.difficulty}</span>
              </div>
            </div>
            <button className="btn btn-primary btn-sm quiz-start">Start Quiz →</button>
          </div>
        ))}
      </div>
    </SubPageShell>
  );
}

export function Exams() {
  const exams = [
    { title: 'Ethiopian SAT — Full Practice Exam', type: 'SAT', duration: '3 hrs', icon: '🎯', color: '#dc2626', status: 'Available' },
    { title: 'Grade 12 Mathematics Final', type: 'Mathematics', duration: '2.5 hrs', icon: 'π', color: '#2563eb', status: 'Available' },
    { title: 'Grade 12 Physics Final', type: 'Physics', duration: '2 hrs', icon: '⚛️', color: '#0891b2', status: 'Available' },
    { title: 'Grade 12 Chemistry Final', type: 'Chemistry', duration: '2 hrs', icon: '⚗️', color: '#d97706', status: 'Available' },
    { title: 'Grade 12 Biology Final', type: 'Biology', duration: '2 hrs', icon: '🦠', color: '#16a34a', status: 'Available' },
    { title: 'University Entrance Mock Exam', type: 'General', duration: '4 hrs', icon: '🏛', color: '#7c3aed', status: 'Coming Soon' },
  ];
  return (
    <SubPageShell title="📋 Exams" sub="Full-length practice exams to prepare for the real thing." active="Exams">
      <div className="exam-grid">
        {exams.map(ex => (
          <div key={ex.title} className="exam-card card">
            <div className="exam-icon" style={{ background: ex.color + '22', color: ex.color }}>{ex.icon}</div>
            <div className="exam-type">{ex.type}</div>
            <h3 className="exam-title">{ex.title}</h3>
            <div className="exam-meta">
              <span>⏱ {ex.duration}</span>
              <span className={`badge ${ex.status === 'Available' ? 'badge-success' : 'badge-warning'}`}>{ex.status}</span>
            </div>
            <button
              className={`btn btn-sm ${ex.status === 'Available' ? 'btn-primary' : 'btn-outline'}`}
              style={{ marginTop: '0.75rem', alignSelf: 'flex-start' }}
              disabled={ex.status !== 'Available'}
            >
              {ex.status === 'Available' ? 'Start Exam →' : 'Coming Soon'}
            </button>
          </div>
        ))}
      </div>
    </SubPageShell>
  );
}

function SubPageShell({ title, sub, active, children }) {
  return (
    <div className="subpage">
      <div className="page-hero">
        <div className="container">
          <h1>{title}</h1>
          <p>{sub}</p>
        </div>
      </div>
      <div className="courses-subnav">
        <div className="container subnav-inner">
          {SUB_LINKS.map(l => (
            <Link key={l.path} to={l.path} className={`subnav-link ${l.label === active ? 'active-sub' : ''}`}>
              {l.icon} {l.label}
            </Link>
          ))}
        </div>
      </div>
      <div className="container subpage-content">{children}</div>
    </div>
  );
}
