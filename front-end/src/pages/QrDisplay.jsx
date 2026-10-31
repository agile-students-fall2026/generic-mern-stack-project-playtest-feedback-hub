import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Header from '../components/Header.jsx'
import BottomNav from '../components/BottomNav.jsx'
import { getProject } from '../mocks/projects.js'
import './QrDisplay.css'

function QrDisplay() {
  const { projectId } = useParams()
  const [project, setProject] = useState(undefined)

  useEffect(() => {
    getProject(projectId).then(setProject)
  }, [projectId])

  return (
    <div className="qr-page">
      <Header />
      <main className="qr-main">
        <Link className="qr-back-link" to="/projects">‹ Back</Link>
        {project === null && <p>Project not found.</p>}
        {project && (
          <>
            <h1>Your QR Code:</h1>
            <div className="qr-frame" aria-label={`QR code for ${project.name}`}>
              <svg viewBox="0 0 100 100">
                <rect x="3" y="3" width="94" height="94" rx="14" fill="none" stroke="currentColor" strokeWidth="2" />
                <path d="M12 12 L88 88 M88 12 L12 88" fill="none" stroke="currentColor" strokeWidth="2" />
              </svg>
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