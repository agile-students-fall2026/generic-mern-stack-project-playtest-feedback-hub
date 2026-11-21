import { useEffect, useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { QRCodeSVG } from 'qrcode.react'
import Header from '../components/Header.jsx'
import BottomNav from '../components/BottomNav.jsx'
import './QrDisplay.css'

function QrDisplay() {
  const { projectId } = useParams()
  const [project, setProject] = useState(undefined)
  const navigate = useNavigate()
  useEffect(() => {
    fetch(`/api/projects/${projectId}`)
    .then((response) => {
      if (response.status === 404) return null
      return response.json()
    })
     .then(setProject)
    }, [projectId])

  return (
    <div className="qr-page">
      <Header />
      <main className="qr-main">
        <Link className="qr-back-link" onClick={() => navigate(-1)}>‹ Back</Link>
        {project === null && <p>Project not found.</p>}
        {project && (
          <>
            <h1>Your QR Code:</h1>
            <div className="qr-frame" aria-label={`QR code for ${project.name}`}>
              <QRCodeSVG
              value={`${window.location.origin}/feedback?game=${projectId}`}
              size={240}
              />
              </div>
            <p>Show the QR Code above to receive feedback on your project</p>
          </>
        )}
        <Link className="qr-back-button" to="/projects">Back</Link>
      </main>
      <BottomNav />
    </div>
  )
}

export default QrDisplay