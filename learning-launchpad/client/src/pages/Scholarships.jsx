import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Scholarships.css';

export default function Scholarships() {
  const [scholarships, setScholarships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ status: [], location: [], level: [] });
  const [search, setSearch] = useState('');
  const [saved, setSaved] = useState([]);

  useEffect(() => {
    axios.get('/scholarships')
      .then(r => setScholarships(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const toggleFilter = (group, val) => {
    setFilters(f => ({
      ...f,
      [group]: f[group].includes(val) ? f[group].filter(v => v !== val) : [...f[group], val]
    }));
  };

  const filtered = scholarships.filter(s => {
    const matchStatus = !filters.status.length || filters.status.includes(s.status);
    const matchLoc = !filters.location.length || filters.location.includes(s.location);
    const matchLevel = !filters.level.length || filters.level.includes(s.level);
    const matchSearch = !search || s.title.toLowerCase().includes(search.toLowerCase()) || s.provider.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchLoc && matchLevel && matchSearch;
  });

  const toggleSave = (id) => setSaved(s => s.includes(id) ? s.filter(i => i !== id) : [...s, id]);

  const statusColor = { Open: 'success', Rolling: 'warning', Closed: 'danger' };

  return (
    <div className="scholarships-page">
      <div className="page-hero">
        <div className="container">
          <h1>🎓 Scholarships</h1>
          <p>A curated list of scholarships to help you fund your education.</p>
        </div>
      </div>

      <div className="container schol-layout">
        {/* Sidebar Filters */}
        <aside className="filter-sidebar card">
          <h3>Filters</h3>

          <div className="filter-group">
            <h4>Application Status</h4>
            {['Open', 'Rolling', 'Closed'].map(v => (
              <label key={v} className="filter-check">
                <input type="checkbox" checked={filters.status.includes(v)}
                  onChange={() => toggleFilter('status', v)} />
                {v}
              </label>
            ))}
          </div>

          <div className="filter-group">
            <h4>Location</h4>
            {['Domestic', 'International'].map(v => (
              <label key={v} className="filter-check">
                <input type="checkbox" checked={filters.location.includes(v)}
                  onChange={() => toggleFilter('location', v)} />
                {v}
              </label>
            ))}
          </div>

          <div className="filter-group">
            <h4>Field of Study</h4>
            {['High School', 'Undergraduate', 'Graduate'].map(v => (
              <label key={v} className="filter-check">
                <input type="checkbox" checked={filters.level.includes(v)}
                  onChange={() => toggleFilter('level', v)} />
                {v}
              </label>
            ))}
          </div>

          <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}
            onClick={() => setFilters({ status: [], location: [], level: [] })}>
            Clear Filters
          </button>
        </aside>

        {/* Main content */}
        <div className="schol-main">
          <div className="schol-search">
            <input type="text" className="form-input" placeholder="🔍 Search scholarships…"
              value={search} onChange={e => setSearch(e.target.value)} />
          </div>

          {loading ? (
            <div className="loading"><div className="spinner" /> Loading scholarships…</div>
          ) : filtered.length === 0 ? (
            <div className="empty-state">No scholarships match your filters.</div>
          ) : (
            <div className="schol-list">
              {filtered.map(s => (
                <div key={s._id} className="schol-card card">
                  <div className="schol-top">
                    <div className="schol-tags">
                      <span className={`badge badge-${statusColor[s.status] || 'primary'}`}>{s.level}</span>
                      <span className={`badge badge-${statusColor[s.status] || 'primary'}`}>{s.status}</span>
                    </div>
                    <button className={`save-btn ${saved.includes(s._id) ? 'saved' : ''}`}
                      onClick={() => toggleSave(s._id)} title="Save">
                      {saved.includes(s._id) ? '★ Saved' : '☆ Save'}
                    </button>
                  </div>
                  <div className="schol-meta">
                    <span>🗓 Deadline: {s.deadline}</span>
                    <span>🏛 Offered by {s.provider}</span>
                  </div>
                  <h3 className="schol-title">{s.title}</h3>
                  <p className="schol-desc">{s.description}</p>
                  <a href={s.link} className="btn btn-primary btn-sm" style={{ alignSelf: 'flex-start' }}>
                    View Details →
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="help-bubble">
        <Link to="/help" className="help-btn">💬 How can I help today?</Link>
      </div>
    </div>
  );
}
