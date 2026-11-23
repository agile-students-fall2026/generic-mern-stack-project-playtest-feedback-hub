import { useState } from 'react'
import { Link } from 'react-router-dom'
import './ForgotPasswordPage.css'
import './AuthPages.css'
import { useNavigate } from 'react-router-dom'
import { authRequest } from '../api/auth.js'

function ForgotPasswordPage() {
    const [message, setMessage] = useState('')
    const [error, setError] = useState('')
    const navigate = useNavigate()

    async function handleSubmit(event) {
        event.preventDefault()

        const values = new FormData(event.currentTarget)
        const email = values.get('email').trim()

        setError('')
        setMessage('')

        try {
            const response = await authRequest('forgot-password', { email })

            if (response.resetUrl) {
                const url = new URL(response.resetUrl)
                navigate(`${url.pathname}${url.search}`)
            } else {
                setMessage(response.message)
            }
        } catch (error) {
            setError(error.message)
        }
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