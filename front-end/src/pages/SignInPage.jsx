import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './SignInPage.css'

function SignInPage() {
    const [error, setError] = useState('')
    const [message, setMessage] = useState('')
    const navigate = useNavigate()

    function handleSubmit(event) {
        event.preventDefault()

        const values = new FormData(event.currentTarget)
        const email = values.get('email').trim()
        const password = values.get('password')

        setError('')
        setMessage('')

        if (!email || !password) {
            setError('Please fill in the required fields.')
            return
        }
        // TODO: Connect to backend

        navigate('/developer')
    }

    return (
        <main className="signin-page">
            
            <Link className="auth-back" to="/">
                ‹ Back
            </Link>

            <img
                className="signin-logo"
                src="/logo.png"
                alt="Playtest Feedback Hub Logo"
            />
            
            <form className="signin-form" onSubmit={handleSubmit}>

                <div className="signin-field">
                    <label htmlFor="signin-email">Email</label>
                    <input
                        id="signin-email"
                        name="email"
                        type="email"
                        placeholder="Please enter your email"
                        required
                    />
                </div>

                <div className="signin-field">
                    <label htmlFor="signin-password">Password</label>
                    <input
                        id="signin-password"
                        name="password"
                        type="password"
                        placeholder="Please enter your password"
                        required
                    />
                </div>

                {error && (
                    <p className="signin-error" role="alert">
                        {error}
                    </p>
                )}

                {message && (
                    <p className="signin-message" role="status">
                        {message}
                    </p>
                )}

                <button className="signin-continue" type="submit">
                    Continue
                </button>

            </form>

        </main>
    )
}

export default SignInPage