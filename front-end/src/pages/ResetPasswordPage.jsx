import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import './ResetPasswordPage.css'
import './AuthPages.css'
import { authRequest } from '../api/auth.js'

function ResetPasswordPage() {
    const [error, setError] = useState('')
    const [message, setMessage] = useState('')
    const [pending, setPending] = useState(false)
    const navigate = useNavigate()
    const location = useLocation()
    const resetToken = new URLSearchParams(location.search).get('token')
    const isForgotPassword = Boolean(resetToken)

    async function handleSubmit(event) {
        event.preventDefault()
        if (pending) return
        const form = event.currentTarget

        const values = new FormData(event.currentTarget)
        const password = values.get('password')
        const confirmPassword = values.get('confirmPassword')

        setError('')
        setMessage('')

        if (!password || !confirmPassword) {
            setError('Please fill in all required fields.')
            return
        }

        if (password.length < 8 || password.length > 128) {
            setError('Password must be between 8 and 128 characters.')
            return
        }

        setPending(true)
        try {
            if (isForgotPassword) {
                await authRequest('reset-password', {
                    token: resetToken,
                    password
                })
            } else {
                await authRequest('change-password', {
                    password
                })
            }

            form.reset()

            setMessage(
                isForgotPassword
                    ? 'Success!'
                    : 'Success!'
            )

        } catch (error) {
            setError(error.message)
        } finally {
            setPending(false)
        }
    }

    return (
        <main className="reset-page">

            <Link
                className="auth-back"
                to={isForgotPassword ? '/signin' : '/account'}
            >
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
                        {isForgotPassword ? (
                            <> <Link to="/signin">Sign in</Link></>
                        ) : (
                            <> <Link to="/account">Back to Account</Link></>
                        )}
                    </p>
                )}

                <button
                    className="reset-continue"
                    type="submit"
                    disabled={pending}
                >
                    {pending ? 'Please wait…' : 'Continue'}
                </button>

            </form>

        </main>
    )
}

export default ResetPasswordPage
