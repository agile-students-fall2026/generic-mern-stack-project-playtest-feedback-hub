import { authRequest } from '../api/auth.js'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './SignUpPage.css'

function SignUpPage() {
    const [error, setError] = useState('')
    const [message, setMessage] = useState('')
    const [pending, setPending] = useState(false)
    const navigate = useNavigate()

    async function handleSubmit(event) {
        event.preventDefault()
        if (pending) return

        const form = event.currentTarget
        const values = new FormData(form)
        const email = values.get('email').trim()
        const password = values.get('password')
        const confirmPassword = values.get('confirmPassword')

        setError('')
        setMessage('')

        if (!email || !password || !confirmPassword) {
            setError('Please fill in all required fields.')
            return
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match.')
            return
        }
        setPending(true)
        try {
            await authRequest('register', { email, password })
            form.reset()
            setMessage('Account created. You can now sign in.')
        } catch (error) {
            setError(error.message)
        } finally {
            setPending(false)
        }
    }

    return (
        <main className="signup-page">

            <Link className="auth-back" onClick={() => navigate(-1)}>
                ‹ Back
            </Link>

            <img
                className="signup-logo"
                src="/logo.png"
                alt="Playtest Feedback Hub Logo"
            />

            <form className="signup-form" onSubmit={handleSubmit}>

                <div className="signup-field">
                    <label htmlFor="signup-email">Email</label>
                    <input
                        id="signup-email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        maxLength={254}
                        placeholder="Please enter your email"
                        required
                    />
                </div>

                <div className="signup-field">
                    <label htmlFor="signup-password">Password</label>
                    <input
                        id="signup-password"
                        name="password"
                        type="password"
                        autoComplete="new-password"
                        maxLength={128}
                        minLength={8}
                        placeholder="Please enter your password"
                        required
                    />
                </div>

                <div className="signup-field">
                    <label htmlFor="signup-confirm-password">
                        Confirm Password
                    </label>
                    <input
                        id="signup-confirm-password"
                        name="confirmPassword"
                        type="password"
                        autoComplete="new-password"
                        maxLength={128}
                        minLength={8}
                        placeholder="Please confirm your password"
                        required
                    />
                </div>

                {error && (
                    <p className="signup-error" role="alert">
                        {error}
                    </p>
                )}

                {message && (
                    <p className="signup-message" role="status">
                        {message} <Link to="/signin">Sign in</Link>
                    </p>
                )}

                <button className="signup-continue" type="submit" disabled={pending}>
                    {pending ? 'Please wait…' : 'Continue'}
                </button>

            </form>

        </main>
    )
}

export default SignUpPage
