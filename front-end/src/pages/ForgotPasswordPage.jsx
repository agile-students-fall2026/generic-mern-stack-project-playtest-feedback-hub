import { useState } from 'react'
import { Link } from 'react-router-dom'
import './ForgotPasswordPage.css'
import './AuthPages.css'

function ForgotPasswordPage() {
    const [message, setMessage] = useState('')
    const [error, setError] = useState('')

    function handleSubmit(event) {
        event.preventDefault()

        const values = new FormData(event.currentTarget)
        const email = values.get('email').trim()

        setError('')
        setMessage('')

        if (!email) {
            setError('Please enter your email address.')
            return
        }

        // TODO: Connect to backend
        setMessage('If an account exists with this email, password reset instructions will be sent.')
    }

    return (
        <main className="forgot-page">

            <Link className="auth-back" to="/signin">
                ‹ Back
            </Link>

            <img
                className="forgot-logo"
                src="/logo.png"
                alt="Playtest Feedback Hub Logo"
            />

            <form className="forgot-form" onSubmit={handleSubmit}>

                <div className="forgot-field">
                    <label htmlFor="forgot-email">Email</label>
                    <input
                        id="forgot-email"
                        name="email"
                        type="email"
                        placeholder="Please enter your email"
                        required
                    />
                </div>

                {error && (
                    <p className="forgot-error" role="alert">
                        {error}
                    </p>
                )}

                {message && (
                    <p className="forgot-message" role="status">
                        {message}
                    </p>
                )}

                <button className="forgot-continue" type="submit">
                    Continue
                </button>

            </form>

        </main>
    )
}

export default ForgotPasswordPage