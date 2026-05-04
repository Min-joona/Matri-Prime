import { Link } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <Link to="/" className="footer-logo">
              <div className="logo-icon">🚀</div>
              <div>
                <div className="logo-main">Learning Launchpad</div>
                <div className="logo-tagline">Academic Excellence</div>
              </div>
            </Link>
            <p>Empowering Ethiopian students with world-class education and career opportunities.</p>
            <p className="footer-copy">© 2025 The Learning Launchpad. All rights reserved.</p>
          </div>

          <div className="footer-col">
            <h4>Quick Links</h4>
            <ul>
              <li><Link to="/courses">Browse Courses</Link></li>
              <li><Link to="/dashboard">Student Dashboard</Link></li>
              <li><Link to="/flashcards">Flashcards</Link></li>
              <li><Link to="/opportunities">Opportunities</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Support</h4>
            <ul>
              <li><Link to="/help">Help Center</Link></li>
              <li><Link to="/faq">FAQ</Link></li>
              <li><Link to="/contact">Contact Us</Link></li>
              <li><Link to="/privacy">Privacy Policy</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Contact Info</h4>
            <ul className="contact-list">
              <li><span>✉️</span> support@learninglaunchpad.et</li>
              <li><span>📞</span> +251 93 368 0059</li>
              <li><span>📍</span> Addis Ababa, Ethiopia</li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <Link to="/terms">Terms of Service</Link>
          <span>·</span>
          <Link to="/privacy">Privacy Policy</Link>
        </div>
      </div>
    </footer>
  );
}
