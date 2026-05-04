import { useState } from 'react';
import './InfoPages.css';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sent, setSent] = useState(false);
  const upd = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handle = (e) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="info-page">
      <div className="page-hero">
        <div className="container" style={{ textAlign: 'center' }}>
          <h1>✉️ Contact Us</h1>
          <p>Have a question or feedback? We'd love to hear from you.</p>
        </div>
      </div>

      <div className="container info-content contact-layout">
        <div className="contact-info">
          {[
            { icon: '✉️', label: 'Email', val: 'support@learninglaunchpad.et' },
            { icon: '📞', label: 'Phone', val: '+251 93 368 0059' },
            { icon: '📍', label: 'Address', val: 'Addis Ababa, Ethiopia' },
          ].map(c => (
            <div key={c.label} className="contact-info-item card">
              <span className="ci-icon">{c.icon}</span>
              <div>
                <p className="ci-label">{c.label}</p>
                <p className="ci-val">{c.val}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="contact-form card">
          {sent ? (
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✅</div>
              <h3>Message Sent!</h3>
              <p style={{ color: 'var(--text2)', marginTop: '0.5rem' }}>We'll get back to you within 24 hours.</p>
              <button className="btn btn-primary" style={{ marginTop: '1.5rem' }} onClick={() => setSent(false)}>Send Another</button>
            </div>
          ) : (
            <form onSubmit={handle}>
              <h3 style={{ marginBottom: '1.5rem' }}>Send a Message</h3>
              <div className="form-group">
                <label className="form-label">Your Name</label>
                <input type="text" className="form-input" placeholder="Full name"
                  value={form.name} onChange={e => upd('name', e.target.value)} required />
              </div>
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input type="email" className="form-input" placeholder="you@example.com"
                  value={form.email} onChange={e => upd('email', e.target.value)} required />
              </div>
              <div className="form-group">
                <label className="form-label">Subject</label>
                <input type="text" className="form-input" placeholder="How can we help?"
                  value={form.subject} onChange={e => upd('subject', e.target.value)} required />
              </div>
              <div className="form-group">
                <label className="form-label">Message</label>
                <textarea className="form-input" rows={5} placeholder="Write your message here…"
                  value={form.message} onChange={e => upd('message', e.target.value)} required
                  style={{ resize: 'vertical' }} />
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                Send Message ✉️
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
