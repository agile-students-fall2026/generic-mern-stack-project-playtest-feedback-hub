import { useEffect, useState } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'
import Header from '../components/Header.jsx'
import BottomNav from '../components/BottomNav.jsx'
import './ViewFeedback.css'

const statusOptions = [
  { label: 'Complete', status: 'Complete' },
  { label: 'Incomplete', status: 'Incomplete' },
  { label: 'Work In Progress', status: 'WIP' },
  { label: 'Resolved', status: 'Resolved' },
  { label: 'Assigned', status: 'Assigned' },
]

async function readJson(res) {
  if (res.status === 404) return null
  if (!res.ok) throw new Error(`Request failed with status ${res.status}`)
  return res.json()
}

function ViewFeedback() {
  const { feedbackId } = useParams()
  const location = useLocation()
  const [feedback, setFeedback] = useState(undefined)
  const [project, setProject] = useState(null)
  const [loadError, setLoadError] = useState('')
  const [statusError, setStatusError] = useState('')
  const [saving, setSaving] = useState(false)
  const [statusOpen, setStatusOpen] = useState(false)
  const backTo = location.state?.from ?? '/developer/feedback-history'

  useEffect(() => {
    let active = true
    setFeedback(undefined)
    setProject(null)
    setLoadError('')
    fetch(`/api/feedback/${encodeURIComponent(feedbackId)}`)
      .then(readJson)
      .then((item) => {
        if (!active) return
        setFeedback(item)
        if (!item) return
        return fetch(`/api/projects/${encodeURIComponent(item.projectId)}`)
          .then(readJson)
          .then((projectData) => {
            if (active) setProject(projectData)
          })
      })
      .catch(() => {
        if (active) setLoadError('Could not load this feedback. Check that the back-end is running.')
      })
    return () => { active = false }
  }, [feedbackId])

  function changeStatus(status) {
    setStatusOpen(false)
    setStatusError('')
    setSaving(true)
    fetch(`/api/feedback/${encodeURIComponent(feedback.id)}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
      .then((res) => {
        if (!res.ok) throw new Error(`Request failed with status ${res.status}`)
        return res.json()
      })
      .then(setFeedback)
      .catch(() => setStatusError('Could not save the new status. Please try again.'))
      .finally(() => setSaving(false))
  }

  return (
    <div className="view-feedback-page">
      <Header />
      <main className="view-feedback-main">
        <div className="view-feedback-top">
          
          {feedback && (
            <div className="view-feedback-status-picker">
              <button
                type="button"
                className="view-feedback-status"
                aria-label={`Status: ${feedback.status}. Change status`}
                aria-expanded={statusOpen}
                aria-controls="view-feedback-status-menu"
                disabled={saving}
                onClick={() => setStatusOpen(!statusOpen)}
              >
                Status: {feedback.status}
                <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M2 4l4 4 4-4" />
                </svg>
              </button>
              {statusOpen && (
                <ul className="view-feedback-status-menu" id="view-feedback-status-menu">
                  {statusOptions.map((option) => (
                    <li key={option.status}>
                      <button
                        type="button"
                        aria-pressed={feedback.status === option.status}
                        onClick={() => changeStatus(option.status)}
                      >
                        {option.label}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
        {statusError && <p role="alert">{statusError}</p>}
        {loadError && <p role="alert">{loadError}</p>}
        {feedback === undefined && !loadError && <p>Loading feedback…</p>}
        {feedback === null && <p>Feedback not found.</p>}
        {feedback && (
          <>
            <div className="view-feedback-game">
              <div>
                <p className="view-feedback-game-label">Playtest Feedback for</p>
                <h1>{project?.name ?? 'Unknown project'}</h1>
                {project && <p className="view-feedback-game-developer">by {project.developer}</p>}
              </div>
              <span className="view-feedback-icon" aria-hidden="true">
                <svg viewBox="0 0 100 100">
                  <rect x="4" y="4" width="92" height="92" rx="24" fill="none" stroke="currentColor" strokeWidth="3" />
                  <path d="M18 18 L82 82 M82 18 L18 82" fill="none" stroke="currentColor" strokeWidth="3" />
                </svg>
              </span>
            </div>
            <h2 className="view-feedback-label">Feedback Category</h2>
            <p className="view-feedback-field">{feedback.category}</p>
            <h2 className="view-feedback-label">Feedback</h2>
            <p className="view-feedback-text">{feedback.text}</p>
            <h2 className="view-feedback-label">Images</h2>
            {feedback.images.length === 0 ? (
              <p className="view-feedback-no-images">No images attached.</p>
            ) : (
              <ul className="view-feedback-images">
                {feedback.images.map((url, index) => (
                  <li key={`${url}-${index}`}>
                    <a href={url} target="_blank" rel="noreferrer">
                      <img src={url} alt={`Attachment ${index + 1}`} />
                    </a>
                  </li>
                ))}
              </ul>
            )}
            <button
              type="button"
              className="view-feedback-resolve"
              onClick={() => changeStatus('Resolved')}
              disabled={saving || feedback.status === 'Resolved'}
            >
              {saving ? 'Saving…' : feedback.status === 'Resolved' ? 'Resolved' : 'Mark Resolved'}
            </button>
          </>
        )}
      </main>
      
    </div>
  )
}

export default ViewFeedback
