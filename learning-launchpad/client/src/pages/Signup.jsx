import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

export default function Signup() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ fullName: '', email: '', phone: '', password: '', confirm: '', terms: false });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handle = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirm) return setError('Passwords do not match');
    if (!form.terms) return setError('Please accept the Terms of Service');
    if (form.password.length < 6) return setError('Password must be at least 6 characters');
    setLoading(true);
    try {
      await signup({ fullName: form.fullName, email: form.email, phone: form.phone, password: form.password });
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed');
    } finally { setLoading(false); }
  };

  const upd = (k, v) => setForm(f => ({ ...f, [k]: v }));

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          <Link to="/" className="auth-logo-link">
            <div className="logo-icon">🚀</div>
          </Link>
        </div>
        <h1>Join The Launchpad</h1>
        <p className="auth-sub">Create your account and start your learning journey today!</p>

        {error && <div className="auth-error">⚠️ {error}</div>}

        <form onSubmit={handle}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input type="text" className="form-input" placeholder="Your full name"
              value={form.fullName} onChange={e => upd('fullName', e.target.value)} required />
          </div>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input type="email" className="form-input" placeholder="you@example.com"
              value={form.email} onChange={e => upd('email', e.target.value)} required />
          </div>
          <div className="form-group">
            <label className="form-label">Phone Number</label>
            <input type="tel" className="form-input" placeholder="+251 …"
              value={form.phone} onChange={e => upd('phone', e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Create Password</label>
            <input type="password" className="form-input" placeholder="Min. 6 characters"
              value={form.password} onChange={e => upd('password', e.target.value)} required />
          </div>
          <div className="form-group">
            <label className="form-label">Confirm Password</label>
            <input type="password" className="form-input" placeholder="Repeat password"
              value={form.confirm} onChange={e => upd('confirm', e.target.value)} required />
          </div>
          <div className="auth-options" style={{ justifyContent: 'flex-start' }}>
            <label className="checkbox-label">
              <input type="checkbox" checked={form.terms} onChange={e => upd('terms', e.target.checked)} />
              I agree to the <Link to="/terms" className="auth-link" style={{ marginLeft: 4 }}>Terms of Service</Link>
            </label>
          </div>
          <button type="submit" className="btn btn-primary auth-btn" disabled={loading}>
            {loading ? <><div className="spinner" style={{ width: 18, height: 18 }} /> Creating account…</> : 'Create Account'}
          </button>
        </form>
        <p className="auth-switch">
          Already have an account? <Link to="/login" className="auth-link">Log In</Link>
        </p>
      </div>
    </div>
  );
}
