import { Link } from 'react-router-dom'
import { IconPuzzle, IconShield } from './Icons.jsx'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div className="footer-brand">
          <div className="nav-brand" style={{ marginBottom: 14 }}>
            <span className="nav-brand-mark">
              <IconPuzzle width={20} height={20} />
            </span>
            NeuroAccess
          </div>
          <p>
            A privacy-first browser extension that clears accessibility barriers in one click —
            built for blind, low-vision, dyslexic, and motor-impaired readers, and anyone
            whose eyes need a break.
          </p>
          <p className="footer-privacy">
            <IconShield width={16} height={16} />
            Local-first. Nothing you read is sent anywhere by default.
          </p>
        </div>

        <div className="footer-col">
          <h4>Product</h4>
          <ul>
            <li><Link to="/features">Features</Link></li>
            <li><Link to="/pricing">Pricing</Link></li>
            <li><Link to="/setup">Get the extension</Link></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>Support</h4>
          <ul>
            <li><Link to="/contact">Contact us</Link></li>
            <li><Link to="/setup">Setup guide</Link></li>
            <li><a href="#accessibility-statement">Accessibility statement</a></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>Company</h4>
          <ul>
            <li><a href="#privacy">Privacy policy</a></li>
            <li><a href="#terms">Terms of use</a></li>
          </ul>
        </div>
      </div>

      <div className="container footer-bottom">
        <p>© {new Date().getFullYear()} NeuroAccess. Not a medical device or treatment.</p>
      </div>

      <style>{`
        .footer {
          border-top: 1px solid var(--border);
          background: var(--bg-soft);
          padding: 64px 0 0;
        }
        .footer-grid {
          display: grid;
          grid-template-columns: 1.6fr 1fr 1fr 1fr;
          gap: 48px;
          padding-bottom: 48px;
        }
        .footer-brand p { font-size: 15px; }
        .footer-privacy {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 13.5px;
          color: var(--text-faint);
        }
        .footer-col h4 {
          font-size: 14px;
          color: var(--text);
          margin-bottom: 16px;
        }
        .footer-col ul { display: flex; flex-direction: column; gap: 12px; }
        .footer-col a {
          font-size: 14.5px;
          color: var(--text-muted);
        }
        .footer-col a:hover { color: var(--primary); }
        .footer-bottom {
          border-top: 1px solid var(--border);
          padding: 20px 0;
        }
        .footer-bottom p { margin: 0; font-size: 13.5px; color: var(--text-faint); }

        @media (max-width: 900px) {
          .footer-grid { grid-template-columns: 1fr 1fr; }
        }
        @media (max-width: 560px) {
          .footer-grid { grid-template-columns: 1fr; gap: 32px; }
        }
      `}</style>
    </footer>
  )
}
