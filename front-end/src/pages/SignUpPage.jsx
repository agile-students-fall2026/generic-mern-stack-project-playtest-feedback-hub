
import { useState } from 'react'
import './SignUpPage.css'

function SignUpPage() {
    const [error, setError] = useState('')
    const [message, setMessage] = useState('')

    function handleSubmit(event) {
        event.preventDefault()

        const values = new FormData(event.currentTarget)
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

        setMessage('Account created successfully!')
        // TODO: Connect to backend
    }

    return (
        <main className="signup-page">

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
                        {message}
                    </p>
                )}

                <button className="signup-continue" type="submit">
                    Continue
                </button>

            </form>

        </main>
    )
}

export default SignUpPage