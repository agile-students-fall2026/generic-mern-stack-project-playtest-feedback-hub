import { useEffect, useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { authRequest } from '../api/auth.js'
import './MainPage.css'

function SessionHome() {
    const [destination, setDestination] = useState(null)
    const [error, setError] = useState('')

    useEffect(() => {
        let active = true

        async function resume() {
            try {
                await authRequest('me')
                if (active) setDestination('/developer')
            } catch (error) {
                if (!active) return
                if (error.status === 401) setDestination('/')
                else setError('Could not check your session. Refresh the page to try again.')
            }
        }

        resume()
        return () => { active = false }
    }, [])

    if (destination) return <Navigate to={destination} replace />

    return (
        <main className="welcome-page">
            {error ? (
                <>
                    <p role="alert">{error}</p>
                    <Link to="/">Back to welcome</Link>
                </>
            ) : (
                <p role="status">Checking your session…</p>
            )}
        </main>
    )
}

export default SessionHome
