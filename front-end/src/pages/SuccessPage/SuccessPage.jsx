import { Link } from 'react-router-dom'
import Header from '../../components/Header.jsx'
import BottomNav from '../../components/BottomNav.jsx'
import './SuccessPage.css'

function SuccessPage() {
    return (
        <div className="success-page">
            <Header />
            <main className="success-main">
                <h1 className="success-message">Thank you for submitting feedback!</h1>
                <div className="success-actions">
                    <Link className="success-link" to="/scan">Scan another QR Code</Link>
                    <Link className="success-link" to="/">Go to Playtest Hub</Link>
                </div>
            </main>
            <BottomNav />
        </div>
    )
}

export default SuccessPage
