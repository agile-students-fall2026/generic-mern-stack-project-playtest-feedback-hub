import { Link } from 'react-router-dom'
import './BottomNav.css'

function BottomNav() {
    return (
          <nav className="bottom-nav" aria-label="Main navigation">
            <span className="bottom-nav-logo" role="img" aria-label="Playtest Feedback Hub logo">
              <svg viewBox="0 0 32 32" aria-hidden="true">
                <g fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 25 2 14l6-2c7-2 9 6 2 8l-5 1" />
                  <path d="M11 6h12m-6 0v18" />
                  <path d="m22 27 4-15 6 2m-8 5 6 2" />
                </g>
              </svg>
            </span>
            <Link to="/" aria-label="Home">
              <svg viewBox="0 0 32 32" fill="currentColor" aria-hidden="true">
                <path d="m2 14 14-12 7 6V4h5v8l3 2-3 4-2-2v14h-8V20h-5v10H6V16l-2 2z" />
              </svg>
            </Link>
            <Link to="/scan" aria-label="Scan QR code">
              <svg viewBox="0 0 32 32" aria-hidden="true">
                <circle cx="16" cy="16" r="14.5" fill="none" stroke="currentColor" />
              </svg>
            </Link>
            <Link to="/feedback-history" aria-label="Feedback history">
              <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M12 6H8a2 2 0 0 0-2 2v20a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-4" />
                <rect x="12" y="3" width="8" height="6" rx="2" />
                <path d="M11 15h10m-10 5h10m-10 5h6" />
              </svg>
            </Link>
            <Link to="/account" aria-label="Account">
              <svg viewBox="0 0 32 32" fill="currentColor" aria-hidden="true">
                <circle cx="16" cy="10" r="7" />
                <path d="M4 30v-3c0-9 24-9 24 0v3z" />
              </svg>
            </Link>
          </nav>
    )
}

export default BottomNav
