import { Link } from 'react-router-dom'
import Header from '../components/Header.jsx'
import BottomNav from '../components/BottomNav.jsx'
import './SuccessPage/SuccessPage.css'

function PlaytesterHub() {
    return (
        <div className="success-page">
            <Header />
            <main className="success-main">
                <h1 className="success-message">Welcome to the Playtester Hub</h1>
                <div className="success-actions">
                    <Link className="success-link" to="/scan">Scan a QR Code</Link>
                    <Link className="success-link" to="/account">Account</Link>
                    <Link className="success-link" to="/feedback-history">Feedback History</Link>
                </div>
            </main>
            <BottomNav />
        </div>
    )
}

export default PlaytesterHub
