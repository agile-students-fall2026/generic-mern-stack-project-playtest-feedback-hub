import { useState } from 'react'
import { Link } from 'react-router-dom'
import './Header.css'

function Header() {
    const [menuOpen, setMenuOpen] = useState(false)

    return (
        <header className="hub-header">
            <button
                className="hub-menu-button"
                type="button"
                aria-label="Open menu"
                aria-expanded={menuOpen}
                aria-controls="hub-menu"
                onClick={() => setMenuOpen(!menuOpen)}
            >
                <img src="/logo_black.png" alt="" />
            </button>
            <span className="hub-header-title"></span>
            {menuOpen && (
                <nav className="hub-menu" id="hub-menu" aria-label="Menu">
                    <Link to="/" onClick={() => setMenuOpen(false)}>Sign Out</Link>
                    {/*
                    <Link to="/scan" onClick={() => setMenuOpen(false)}>Scan a QR Code</Link>
                    */}
                    <Link to="/developer" onClick={() => setMenuOpen(false)}>Developer Hub</Link>
                    <Link to="/playtester" onClick={() => setMenuOpen(false)}>Playtester Hub</Link>
                </nav>
            )}
        </header>
    )
}

export default Header
