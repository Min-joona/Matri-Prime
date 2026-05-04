import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Opportunities.css';

const TYPE_COLORS = {
  Internship: { bg: 'rgba(79,70,229,0.15)', color: '#818cf8' },
  Bootcamp: { bg: 'rgba(6,182,212,0.15)', color: '#22d3ee' },
  Workshop: { bg: 'rgba(16,185,129,0.15)', color: '#34d399' },
  Job: { bg: 'rgba(245,158,11,0.15)', color: '#fbbf24' },
};

export default function Opportunities() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    axios.get('/opportunities')
      .then(r => setItems(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const types = ['All', ...new Set(items.map(i => i.type))];
  const filtered = filter === 'All' ? items : items.filter(i => i.type === filter);

  return (
    <div className="opps-page">
      <div className="page-hero">
        <div className="container">
          <h1>💼 Internships, Bootcamps, and More</h1>
          <p>Discover curated internships, bootcamps, and career opportunities to launch your future.</p>
        </div>
      </div>

      <div className="container" style={{ padding: '2.5rem 1.5rem' }}>
        <div className="opp-filters">
          {types.map(t => (
            <button key={t} className={`tag ${filter === t ? 'active' : ''}`} onClick={() => setFilter(t)}>{t}</button>
          ))}
        </div>

        {loading ? (
          <div className="loading"><div className="spinner" /> Loading opportunities…</div>
        ) : (
          <div className="opp-list">
            {filtered.map(item => {
              const style = TYPE_COLORS[item.type] || TYPE_COLORS.Internship;
              return (
                <div key={item._id} className="opp-card card">
                  <div className="opp-header">
                    <span className="opp-type-badge" style={{ background: style.bg, color: style.color }}>
                      {item.type}
                    </span>
                    <span className="opp-deadline">
                      {item.status === 'Open' ? '🟢' : '🔴'} {item.deadline}
                    </span>
                  </div>
                  <h3 className="opp-title">{item.title}</h3>
                  <p className="opp-desc">{item.description}</p>
                  <a href={item.link} className="btn btn-primary btn-sm opp-btn">View Details →</a>
                </div>
              );
            })}
            {filtered.length === 0 && (
              <p style={{ color: 'var(--text3)', textAlign: 'center', padding: '3rem' }}>
                No opportunities found.
              </p>
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
