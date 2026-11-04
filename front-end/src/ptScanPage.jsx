import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { getGame } from './services/feedbackApi.js'
import Header from './components/Header.jsx'
import BottomNav from './components/BottomNav.jsx'
import './ptScanPage.css'

function ScanPage() {
    const [error, setError] = useState('')
    const navigate = useNavigate()

    async function openPlaytest(id) {
        try {
            const game = await getGame(id)
            navigate(`/feedback?game=${encodeURIComponent(game.id)}`)
        } catch (err) {
            setError(err.message)
        }
    }

    return (
    <div className="scan-page">
      <Header />

      <main className="scan-main">
        <Link className="scan-back" to="/playtester">
          ‹ Back
        </Link>

        <section className="scan-content">
          <h1 className="scan-title">Scan QR Code.</h1>

          <div className="scan-preview">
            <svg viewBox="0 0 300 300" role="img" aria-label="Camera preview placeholder"><path d="M0 0 300 300M300 0 0 300" /></svg>
          </div>

          <p className="scan-description">
            Scan a QR Code to write<br />your feedback on a project
          </p>

          {error && <p role="alert">{error}</p>}
          <button className="scan-button" type="button" onClick={() => openPlaytest('demo')}>
            Scan
          </button>
        </section>
      </main>

      <BottomNav />
    </div>
    )
}

export default ScanPage
