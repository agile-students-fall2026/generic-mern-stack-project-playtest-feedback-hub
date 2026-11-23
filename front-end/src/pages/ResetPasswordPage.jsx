
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './ResetPasswordPage.css'
import './AuthPages.css'

function ResetPasswordPage() {
    const [error, setError] = useState('')
    const [message, setMessage] = useState('')
    const navigate = useNavigate()

    function handleSubmit(event) {
        event.preventDefault()

        const values = new FormData(event.currentTarget)
        const password = values.get('password')
        const confirmPassword = values.get('confirmPassword')

        setError('')
        setMessage('')

        if (!password || !confirmPassword) {
            setError('Please fill in all required fields.')
            return
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match.')
            return
        }

        // TODO: Connect to backend to update password

        setMessage('Your password has been reset successfully!')

        // Return to Sign In after successful reset
        // navigate('/signin')
    }

    return (
        <main className="reset-page">

            <Link className="auth-back" to="/signin">
                ‹ Back
            </Link>

            <img
                className="reset-logo"
                src="/logo.png"
                alt="Playtest Feedback Hub Logo"
            />

            <form className="reset-form" onSubmit={handleSubmit}>

                <div className="reset-field">
                    <label htmlFor="reset-password">New Password</label>
                    <input
                        id="reset-password"
                        name="password"
                        type="password"
                        placeholder="Please enter your new password"
                        required
                    />
                </div>

                <div className="reset-field">
                    <label htmlFor="reset-confirm-password">
                        Confirm New Password
                    </label>
                    <input
                        id="reset-confirm-password"
                        name="confirmPassword"
                        type="password"
                        placeholder="Please confirm your new password"
                        required
                    />
                </div>

                {error && (
                    <p className="reset-error" role="alert">
                        {error}
                    </p>
                )}

                {message && (
                    <p className="reset-message" role="status">
                        {message}
                    </p>
                )}

                <button className="reset-continue" type="submit">
                    Continue
                </button>

            </form>

        </main>
    )
}

export default ResetPasswordPage
