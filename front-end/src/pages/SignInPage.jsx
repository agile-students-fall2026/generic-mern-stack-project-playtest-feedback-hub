import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { authRequest } from '../api/auth.js'
import './SignInPage.css'
import './AuthPages.css'

function SignInPage() {
    const [error, setError] = useState('')
    const [pending, setPending] = useState(false)
    const navigate = useNavigate()

    async function handleSubmit(event) {
        event.preventDefault()
        if (pending) return

        const values = new FormData(event.currentTarget)
        const email = values.get('email').trim()
        const password = values.get('password')

        setError('')

        if (!email || !password) {
            setError('Please fill in the required fields.')
            return
        }
        setPending(true)
        try {
            await authRequest('login', { email, password })
            navigate('/developer', { replace: true })
        } catch (error) {
            setError(error.message)
        } finally {
            setPending(false)
        }
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
                        autoComplete="email"
                        maxLength={254}
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
                        autoComplete="current-password"
                        maxLength={128}
                        placeholder="Please enter your password"
                        required
                    />
                </div>

                <div className="forgot-password">
                    <Link to="./forgot-password">Forgot Password?</Link>
                </div>

                {error && (
                    <p className="signin-error" role="alert">
                        {error}
                    </p>
                )}

                <button className="signin-continue" type="submit" disabled={pending}>
                    {pending ? 'Signing in…' : 'Continue'}
                </button>

            </form>

        </main>
    )
}

export default SignInPage
