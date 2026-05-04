import './InfoPages.css';

export default function Privacy() {
  return (
    <div className="info-page">
      <div className="page-hero">
        <div className="container"><h1>🔒 Privacy Policy</h1><p>Last updated: January 2025</p></div>
      </div>
      <div className="container info-content legal-content">
        {[
          { title: '1. Information We Collect', body: 'We collect information you provide when creating an account (name, email, phone), usage data (courses viewed, quiz scores, flashcard sessions), and technical data (browser type, device info) to improve our services.' },
          { title: '2. How We Use Your Information', body: 'We use your information to provide and improve our educational services, personalize your learning experience, track your progress and achievements, and communicate updates about courses and opportunities.' },
          { title: '3. Data Security', body: 'We implement industry-standard security measures including encryption of passwords using bcrypt, JWT-based authentication, and HTTPS connections to protect your personal data.' },
          { title: '4. Data Sharing', body: 'We do not sell your personal data. We may share anonymized, aggregated data for research purposes. We do not share individual user data with third parties except as required by law.' },
          { title: '5. Your Rights', body: 'You have the right to access, update, or delete your personal data at any time through your account settings or by contacting us at support@learninglaunchpad.et.' },
          { title: '6. Cookies', body: 'We use essential cookies for authentication and session management. We do not use advertising or tracking cookies.' },
          { title: '7. Contact', body: 'For privacy-related questions, contact us at support@learninglaunchpad.et or +251 93 368 0059.' },
        ].map(s => (
          <div key={s.title} className="legal-section">
            <h3>{s.title}</h3>
            <p>{s.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export function Terms() {
  return (
    <div className="info-page">
      <div className="page-hero">
        <div className="container"><h1>📜 Terms of Service</h1><p>Last updated: January 2025</p></div>
      </div>
      <div className="container info-content legal-content">
        {[
          { title: '1. Acceptance of Terms', body: 'By creating an account or using Learning Launchpad, you agree to these Terms of Service. If you do not agree, please do not use our platform.' },
          { title: '2. Eligibility', body: 'Learning Launchpad is intended for students of all ages. Users under 13 must have parental consent. By registering, you confirm you meet these requirements.' },
          { title: '3. Account Responsibilities', body: 'You are responsible for maintaining the security of your account credentials and for all activities under your account. Notify us immediately of any unauthorized use.' },
          { title: '4. Acceptable Use', body: 'You agree not to share account access, reproduce or distribute our content without permission, use the platform for any illegal purposes, or attempt to disrupt or hack our systems.' },
          { title: '5. Intellectual Property', body: 'All content on Learning Launchpad — including course materials, videos, notes, and quizzes — is the intellectual property of Learning Launchpad or our content partners and may not be reproduced without permission.' },
          { title: '6. Disclaimer', body: 'Learning Launchpad provides educational content for informational purposes. We do not guarantee specific academic outcomes. Scholarship listings are curated from public sources; we are not responsible for their accuracy.' },
          { title: '7. Changes to Terms', body: 'We may update these terms periodically. Continued use of the platform after changes constitutes acceptance of the new terms.' },
        ].map(s => (
          <div key={s.title} className="legal-section">
            <h3>{s.title}</h3>
            <p>{s.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
