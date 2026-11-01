import { useState } from 'react'
import { Link } from 'react-router-dom'
import './Header.css'

function Header() {
    const [menuOpen, setMenuOpen] = useState(false)

    return (
        <header className="hub-header">
            <button className="hub-menu-button" type="button" aria-label="Menu" aria-expanded={menuOpen} aria-controls="hub-menu" onClick={() => setMenuOpen(!menuOpen)}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                    <path d="M2 6h20M2 12h20M2 18h20" />
                </svg>
            </button>
            <span className="hub-header-title">Playtest Feedback Hub</span>
            {menuOpen && (
                <nav className="hub-menu" id="hub-menu" aria-label="Menu">
                    <Link to="/" onClick={() => setMenuOpen(false)}>Sign Out</Link>
                    <Link to="/scan" onClick={() => setMenuOpen(false)}>Scan a QR Code</Link>
                    <Link to="/pth" onClick={() => setMenuOpen(false)}>Playtester Hub</Link>
                    <Link to="/developer" onClick={() => setMenuOpen(false)}>Developer Hub</Link>
                </nav>
            )}
        </header>
    )
}

export default Header
