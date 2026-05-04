import { useState, useRef, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

export default function Navbar() {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [coursesOpen, setCoursesOpen] = useState(false);
  const navigate = useNavigate();
  const dropRef = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (dropRef.current && !dropRef.current.contains(e.target)) setCoursesOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = () => { logout(); navigate('/'); setMenuOpen(false); };

  return (
    <nav className="navbar">
      <div className="nav-inner container">
        <Link to="/" className="nav-logo">
          <div className="logo-icon">🚀</div>
          <div className="logo-text">
            <span className="logo-main">Learning</span>
            <span className="logo-sub">Launchpad</span>
          </div>
        </Link>

        <ul className={`nav-links ${menuOpen ? 'open' : ''}`}>
          {user && (
            <li><NavLink to="/dashboard" onClick={() => setMenuOpen(false)} className={({isActive}) => isActive ? 'active' : ''}>Dashboard</NavLink></li>
          )}
          <li><NavLink to="/" end onClick={() => setMenuOpen(false)} className={({isActive}) => isActive ? 'active' : ''}>Home</NavLink></li>
          <li className="has-dropdown" ref={dropRef}>
            <button className="nav-dropdown-btn" onClick={() => setCoursesOpen(p => !p)}>
              Courses <span className={`arrow ${coursesOpen ? 'up' : ''}`}>▾</span>
            </button>
            {coursesOpen && (
              <ul className="dropdown">
                {[['Notes','notes'],['Videos','videos'],['Quizzes','quizzes'],['Flashcards','flashcards'],['Exams','exams']].map(([label,path]) => (
                  <li key={path}>
                    <Link to={`/courses/${path}`} onClick={() => { setCoursesOpen(false); setMenuOpen(false); }}>{label}</Link>
                  </li>
                ))}
              </ul>
            )}
          </li>
          <li><NavLink to="/scholarships" onClick={() => setMenuOpen(false)} className={({isActive}) => isActive ? 'active' : ''}>Scholarships</NavLink></li>
          <li><NavLink to="/opportunities" onClick={() => setMenuOpen(false)} className={({isActive}) => isActive ? 'active' : ''}>Opportunities</NavLink></li>
        </ul>

        <div className="nav-actions">
          {user ? (
            <div className="nav-user">
              <div className="user-avatar">{user.fullName?.charAt(0).toUpperCase()}</div>
              <span className="user-name">{user.fullName?.split(' ')[0]}</span>
              <button className="btn btn-outline btn-sm" onClick={handleLogout}>Sign Out</button>
            </div>
          ) : (
            <>
              <Link to="/login" className="btn btn-outline btn-sm">Log In</Link>
              <Link to="/signup" className="btn btn-primary btn-sm">Get Started</Link>
            </>
          )}
        </div>

        <button className="hamburger" onClick={() => setMenuOpen(p => !p)} aria-label="Menu">
          <span /><span /><span />
        </button>
      </div>
    </nav>
  );
}
