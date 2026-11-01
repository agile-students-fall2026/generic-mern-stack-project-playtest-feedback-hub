import { useState } from 'react'
import Header from '../components/Header.jsx'
import BottomNav from '../components/BottomNav.jsx'
import { Link } from 'react-router-dom'
import '../ptFeedBackPage.css'
import './AccountPage.css'

function AccountPage() {
    const [message, setMessage] = useState('')

    function handleResetPassword() {
        setMessage('Password reset is not connected yet.')
    }

    return (
        <div className="feedback-shell">
            <Header />

            <main className="feedback-page account-page">
                <Link className="account-back" to="/"> ‹ Back</Link>

                <div className="account-profile">
                    <div className="account-avatar">
                        <svg viewBox="0 0 100 100" role="img" aria-label="Default profile picture">
                            <circle cx="50" cy="50" r="45" fill="#ccc" />
                        </svg>
                    </div>

                    <div className="account-details">
                        <div className="account-detail-row">
                            <span>Username</span>
                            <span>username</span>
                        </div>
                        <div className="account-detail-row">
                            <span>Email</span>
                            <span>user@example.com</span>
                        </div>

                        <button className="reset-password-button" onClick={handleResetPassword}>
                            Reset Password
                        </button>

                        {message && (<p className="account-message" role="status">{message}</p>)}
                    </div>
                </div>
            </main>
            <BottomNav />
        </div>
    )
}

export default AccountPage
