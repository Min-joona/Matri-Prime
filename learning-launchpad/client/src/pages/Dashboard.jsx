import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import './Dashboard.css';

export default function Dashboard() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('/dashboard')
      .then(r => setData(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading"><div className="spinner"/> Loading dashboard…</div>;

  const stats = data?.stats || {};
  const activity = data?.recentActivity || [];

  return (
    <div className="dashboard-page">
      <div className="page-hero">
        <div className="container">
          <div className="dash-subnav">
            <Link to="/dashboard" className="subnav-link active">Dashboard</Link>
            <Link to="/courses" className="subnav-link">Community</Link>
            <Link to="/courses" className="subnav-link">Leaderboard</Link>
            <Link to="/courses" className="subnav-link">Members</Link>
          </div>
        </div>
      </div>

      <div className="container dash-content">
        <div className="dash-welcome">
          <div className="dash-avatar">{user?.fullName?.charAt(0).toUpperCase()}</div>
          <div>
            <h1>Welcome Back, {user?.fullName?.split(' ')[0]}!</h1>
            <p>A quick look at your progress.</p>
          </div>
        </div>

        <div className="dash-stats">
          <div className="stat-card card">
            <div className="stat-icon" style={{ background: 'rgba(79,70,229,0.15)', color: '#818cf8' }}>🏆</div>
            <div>
              <p className="stat-label">Total Points</p>
              <h2 className="stat-value">{stats.points?.toLocaleString() || 0}</h2>
            </div>
          </div>
          <div className="stat-card card">
            <div className="stat-icon" style={{ background: 'rgba(245,158,11,0.15)', color: '#f59e0b' }}>🔥</div>
            <div>
              <p className="stat-label">Current Streak</p>
              <h2 className="stat-value">{stats.streak || 0} Days</h2>
            </div>
          </div>
          <div className="stat-card card">
            <div className="stat-icon" style={{ background: 'rgba(16,185,129,0.15)', color: '#10b981' }}>📊</div>
            <div>
              <p className="stat-label">Courses Completed</p>
              <h2 className="stat-value">{stats.coursesCompleted || 0}</h2>
            </div>
          </div>
        </div>

        <div className="dash-main">
          <div className="activity-section card">
            <h2>Recent Activity</h2>
            {activity.length === 0 ? (
              <p className="no-activity">No activity yet. Start learning!</p>
            ) : (
              <div className="activity-list">
                {activity.map((a, i) => (
                  <div key={i} className="activity-item">
                    <span className="activity-icon">{a.icon}</span>
                    <div>
                      <p className="activity-desc">{a.description}</p>
                      <span className="activity-time">{a.timeAgo}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="dash-actions">
            <Link to="/courses" className="action-btn">
              <span className="action-icon">📚</span>
              <span>Continue Learning →</span>
            </Link>
            <Link to="/courses/flashcards" className="action-btn secondary">
              <span className="action-icon">🃏</span>
              <span>Start Flashcard Session</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
