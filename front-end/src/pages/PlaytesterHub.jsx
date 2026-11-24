import { Link } from 'react-router-dom'
import Header from '../components/Header.jsx'
import BottomNav from '../components/BottomNav.jsx'
import './HubPages.css'

function PlaytesterHub() {
    return (
        <div className="playtester-page playtester-hub">
            <Header />
            <main className="playtester-main">
                <p className="playtester-welcome">Welcome to the</p>
                <h1 className="playtester-title">Playtester Hub</h1>
                <div className="playtester-actions">
                    <Link className="playtester-link" to="/scan">Scan a QR Code</Link>
                    <Link className="playtester-link" to="/account">Account</Link>
                    <Link className="playtester-link" to="/feedback-history">Feedback History</Link>
                    <Link className="playtester-link" to="/explore">Explore Projects</Link>
                    <Link className="playtester-link" to="/developer">Switch to Developer Mode</Link>
                </div>
            </main>
        </div>
    )
}

export default PlaytesterHub
