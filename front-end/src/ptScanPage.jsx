import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { getGame } from './services/feedbackApi.js'
import Header from './components/Header.jsx'
import BottomNav from './components/BottomNav.jsx'
import './ptScanPage.css'

function ScanPage() {
    const [link, setLink] = useState('')
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

    function scan() {
        try {
            const parsed = new URL(link)
            const id = parsed.searchParams.get('game')
            if (!id) throw new Error()
            openPlaytest(id)
        } catch {
            setError('Paste a full playtest URL containing ?game=… or use the demo below.')
        }
    }

    return (
    <div className="scan-page">
      <Header />

      <main className="scan-main">
        <Link className="scan-back" to="/">
          ‹ Back
        </Link>

        <section className="scan-content">
          <h1 className="scan-title">Scan QR Code</h1>

          <div className="scan-preview">
            <p>Paste a playtest QR link below</p>
          </div>

          <p className="scan-description">
            Scan a QR code to write your feedback on a project.
          </p>

          <label htmlFor="playtest-link">Playtest link</label>
          <input className="scan-link-input" id="playtest-link" type="url" value={link} onChange={event => setLink(event.target.value)} placeholder="https://example.com/feedback?game=demo" />
          {error && <p role="alert">{error}</p>}
          <button className="scan-button" type="button" onClick={scan}>
            Scan
          </button>
          <p>Camera scanning is not connected in this demo.</p>
          <button className="scan-button" type="button" onClick={() => openPlaytest('demo')}>Try demo playtest</button>
        </section>
      </main>

      <BottomNav />
    </div>
    )
}

export default ScanPage
