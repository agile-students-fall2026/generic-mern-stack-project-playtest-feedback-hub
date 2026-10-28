import Header from '../components/Header.jsx'
import BottomNav from '../components/BottomNav.jsx'
import { Link } from 'react-router-dom'
import '../ptFeedBackPage.css'

function AccountPage() {
    return (
        <div className="feedback-shell">
            <Header />
            <main className="feedback-page">
                <Link to="/">‹ Back</Link>
                <h1>Account</h1>
                <p>You are using the front-end demo as a guest.</p>
                <p>Sign-in and password reset are not connected yet.</p>
                <Link to="/feedback-history">View feedback from this browser</Link>
            </main>
            <BottomNav />
        </div>
    )
}

export default AccountPage
