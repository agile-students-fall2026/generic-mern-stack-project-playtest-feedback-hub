import { useEffect, useState } from 'react'
import Header from '../components/Header.jsx'
import BottomNav from '../components/BottomNav.jsx'
import { Link, useNavigate } from 'react-router-dom'
import { authRequest } from '../api/auth.js'
import '../ptFeedBackPage.css'
import './AccountPage.css'

function AccountPage() {
    const [account, setAccount] = useState(null)
    const [error, setError] = useState('')
    const [message, setMessage] = useState('')
    const navigate = useNavigate()

    useEffect(() => {
        let active = true

        authRequest('me')
            .then(({ user }) => {
                if (active) setAccount(user)
            })
            .catch(error => {
                if (!active) return
                if (error.status === 401) navigate('/signin', { replace: true })
                else setError('Could not load your account. Refresh the page to try again.')
            })

        return () => { active = false }
    }, [navigate])

    function handleResetPassword() {
        setMessage('Password reset is not connected yet.')
    }

    return (
        <div className="account-page">

            <button
                className="account-back"
                type="button"
                onClick={() => navigate(-1)}
            >
                ‹ Back
            </button>

            <main className="account-main">

                <h1 className="account-title">Account</h1>

                {error && (
                    <p className="account-error" role="alert">
                        {error}
                    </p>
                )}

                {!account && !error && (
                    <p className="account-loading" role="status">
                        Loading your account…
                    </p>
                )}

                {account && (
                    <div className="account-profile">

                        <div className="account-avatar">
                            <svg
                                viewBox="0 0 100 100"
                                role="img"
                                aria-label="Default profile picture"
                            >
                                <circle cx="50" cy="50" r="45" fill="#ccc" />
                            </svg>
                        </div>

                        <div className="account-details">

                            <div className="account-detail-row">
                                <span className="account-label">Email</span>
                                <span className="account-email">
                                    {account.email}
                                </span>
                            </div>

                            <button
                                className="reset-password-button"
                                type="button"
                                onClick={handleResetPassword}
                            >
                                Reset Password
                            </button>

                            {message && (
                                <p className="account-message" role="status">
                                    {message}
                                </p>
                            )}

                        </div>
                    </div>
                )}

            </main>
        </div>
    )
}

export default AccountPage
