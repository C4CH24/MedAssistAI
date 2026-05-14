import React from 'react';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-copyright">
            © {new Date().getFullYear()} MedAssistAI. All rights reserved.
          </div>
          <div className="footer-links">
            <a href="/privacy" className="footer-link">Privacy Policy</a>
            <span className="footer-divider">•</span>
            <a href="/terms" className="footer-link">Terms of Service</a>
            <span className="footer-divider">•</span>
            <a href="/contact" className="footer-link">Contact</a>
          </div>
          <div className="footer-version">
            v1.0.0 | Fadhili AI Primary
          </div>
        </div>
      </div>

      <style jsx>{`
        .footer {
          background: white;
          border-top: 1px solid #EDF2F7;
          padding: 1rem 0;
          margin-top: auto;
        }
        .footer-container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 2rem;
        }
        .footer-content {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 0.75rem;
          color: #718096;
        }
        .footer-links {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .footer-link {
          color: #4A5568;
          text-decoration: none;
          transition: all 0.3s ease;
        }
        .footer-link:hover {
          color: #4A90E2;
        }
        .footer-divider {
          color: #CBD5E0;
        }
        .footer-version {
          color: #A0AEC0;
          font-family: monospace;
        }
        @media (max-width: 768px) {
          .footer-container {
            padding: 0 1rem;
          }
          .footer-content {
            flex-direction: column;
            gap: 0.5rem;
            text-align: center;
          }
          .footer-links {
            flex-wrap: wrap;
            justify-content: center;
          }
        }
      `}</style>
    </footer>
  );
};

export default Footer;
