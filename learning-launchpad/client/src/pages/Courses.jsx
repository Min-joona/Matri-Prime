import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Courses.css';

const SUB_LINKS = [
  { label: 'Notes', path: '/courses/notes', icon: '📄' },
  { label: 'Videos', path: '/courses/videos', icon: '🎬' },
  { label: 'Quizzes', path: '/courses/quizzes', icon: '❓' },
  { label: 'Flashcards', path: '/courses/flashcards', icon: '🃏' },
  { label: 'Exams', path: '/courses/exams', icon: '📋' }
];

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');

  useEffect(() => {
    axios.get('/courses')
      .then(r => setCourses(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const categories = ['All', ...new Set(courses.map(c => c.category))];
  const filtered = courses.filter(c => {
    const matchCat = category === 'All' || c.category === category;
    const matchSearch = c.title.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="courses-page">
      <div className="page-hero">
        <div className="container">
          <h1>Browse All Courses</h1>
          <p>Choose from a wide range of subjects to start your learning journey.</p>
        </div>
      </div>

      {/* Sub-navigation */}
      <div className="courses-subnav">
        <div className="container subnav-inner">
          <span className="subnav-label">Learning Materials</span>
          {SUB_LINKS.map(l => (
            <Link key={l.path} to={l.path} className="subnav-link">
              {l.icon} {l.label}
            </Link>
          ))}
        </div>
      </div>

      <div className="container" style={{ padding: '2.5rem 1.5rem' }}>
        {/* Filters */}
        <div className="courses-filters">
          <input
            type="text" placeholder="🔍 Search courses…"
            className="form-input" value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ maxWidth: '320px' }}
          />
          <div className="cat-tags">
            {categories.map(cat => (
              <button key={cat} className={`tag ${category === cat ? 'active' : ''}`}
                onClick={() => setCategory(cat)}>{cat}</button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="loading"><div className="spinner"/> Loading courses…</div>
        ) : (
          <div className="all-courses-grid">
            {filtered.map(c => (
              <CourseCard key={c._id} course={c} />
            ))}
            {filtered.length === 0 && (
              <div style={{ gridColumn: '1/-1', textAlign: 'center', color: 'var(--text2)', padding: '3rem' }}>
                No courses found. Try a different search.
              </div>
            )}
          </div>
        )}
      </div>

      <div className="help-bubble">
        <Link to="/help" className="help-btn">💬 How can I help today?</Link>
      </div>
    </div>
  );
}

function CourseCard({ course }) {
  return (
    <div className="course-card card">
      <div className="cc-emoji" style={{ background: course.color + '22', color: course.color }}>
        {course.emoji}
      </div>
      <h3>{course.title}</h3>
      <p>{course.description}</p>
      <Link to="/courses" className="btn btn-primary btn-sm" style={{ marginTop: 'auto', alignSelf: 'flex-start' }}>
        Start Learning →
      </Link>
    </div>
  );
}
