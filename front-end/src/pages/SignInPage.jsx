import { useEffect, useState } from 'react'
import { Link } from  'react-router-dom'
import Header from './components/Header.jsx'
import BottomNav from './components/BottomNav.jsx'
import './SignInPage.css'

function SignInPage() {
    const [error, setError] = useState('')
    const [message, setMessage] = useState('')

    function handleSubmit(event) {
        event.preventDefault()

        const values  = new FormData(event.currentTarget)
        const email = values.get('email').trim()
        const password = values.get('password')

        setError('')
        setMessage('')

        if (!email || !password) {
            setError('Please fill in the required fields.')
            return
        }

        setMessage('Successfully signed in!')
        //TODO: Actual backend
    }

    return (
        <div className="signin-shell">
            <Header />
            <main className="sign-in-page">
                <Link className="auth-back" to="/">
                    &lt; Back
                </Link>

                <div className="auth-logo" aria-label="PTF">
                    <span className="logo-p">P</span>
                    <span className="logo-t">T</span>
                    <span className="logo-f">F</span>
                </div>

                {error && <p className="auth-error" role="alert">{error}</p>}
                {message && <p className="auth-message" role="status">{message}</p>}

                <form className='auth-form signin-form' onSubmit={handleSubmit}>
                    <div className="auth-field">
                        <label htmlFor="signin-email">Email</label>
                        <input
                            id="signin-email"
                            name="email"
                            type="email"
                            placeholder="Please enter your email"
                            required
                        />
                    </div>

                    <div className="auth-field">
                        <label htmlFor="signin-password">Password</label>
                        <input
                            id="signin-password"
                            name="password"
                            type="password"
                            placeholder="Please enter your password"
                            required
                        />
                    </div>

                    <button className="auth-continue" type="submit">
                        Continue
                    </button>
                </form>
            </main>
            <BottomNav />
        </div>
    )

}

export default SignInPage