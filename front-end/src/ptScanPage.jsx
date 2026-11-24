import { useEffect, useRef, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { getGame } from './services/feedbackApi.js'
import Header from './components/Header.jsx'
import BottomNav from './components/BottomNav.jsx'
import './ptScanPage.css'

function ScanPage() {
    const [error, setError] = useState('')
    const navigate = useNavigate()
    const videoRef = useRef(null)
    const scanTimer = useRef(0)
    useEffect(() => {
      return () => {
        window.clearInterval(scanTimer.current)
        const stream = videoRef.current?.srcObject
        if (stream) stream.getTracks().forEach((track) => track.stop())
        }
      }, [])
    async function openPlaytest(id) {
        try {
            const game = await getGame(id)
            navigate(`/feedback?game=${encodeURIComponent(game.id)}`)
        } catch (err) {
            setError(err.message)
        }
    }
    function projectIdFromCode(value) {
      try {
        return new URL(value).searchParams.get('game') || ''
      } catch {
        return value.trim()
      }
    }
    async function handleScan() {
      if (!('BarcodeDetector' in window)) {
        setError('Use Chrome to scan a QR code.')
        return
      }
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' },
        })
        videoRef.current.srcObject = stream
        await videoRef.current.play()
        const detector = new BarcodeDetector({ formats: ['qr_code'] })
        window.clearInterval(scanTimer.current)
        scanTimer.current = window.setInterval(async () => {
          const codes = await detector.detect(videoRef.current)
          if (!codes.length) return
          window.clearInterval(scanTimer.current)
          stream.getTracks().forEach((track) => track.stop())
          const id = projectIdFromCode(codes[0].rawValue)
          if (!id) {
            setError('QR code has no project.')
            return
          }
          openPlaytest(id)
        }, 300)
      } catch (err) {
        setError(err.message)
      }
    }
    return (
    <div className="scan-page">
      <Header />
      <main className="scan-main">
        <Link className="scan-back" onClick={() => navigate(-1)}>
          ‹ Back
        </Link>
        <section className="scan-content">
          <h1 className="scan-title">Scan QR Code</h1>
          <div className="scan-preview">
            <video ref={videoRef} muted playsInline />
            </div>
            <p className="scan-description">
              Scan a QR Code to write<br />your feedback on a project
              </p>
              <div className="scan-error-container">
                  {error && <p className="scan-error" role="alert">{error}</p>}
              </div>
              <button className="scan-button" type="button" onClick={handleScan}>
                  Scan
              </button>
                </section>
      </main>
    </div>
    )
}

export default ScanPage
