import { Link } from 'react-router-dom'
import Header from '../components/Header.jsx'
import BottomNav from '../components/BottomNav.jsx'
import './SuccessPage/SuccessPage.css'

function PlaytesterHub() {
    return (
        <div className="success-page playtester-hub">
            <Header />
            <main className="success-main">
                <p className="hub-welcome">Welcome to the</p>
                <h1 className="success-message">Playtester Hub</h1>
                <div className="success-actions">
                    <Link className="success-link" to="/scan">Scan a QR Code</Link>
                    <Link className="success-link" to="/account">Account</Link>
                    <Link className="success-link" to="/feedback-history">Feedback History</Link>
                    <Link className="success-link" to="/developer">Switch to Developer Mode</Link>
                </div>
            </main>
            <BottomNav />
        </div>
    )
}

export default PlaytesterHub
