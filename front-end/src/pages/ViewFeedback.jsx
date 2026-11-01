import { useEffect, useState } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'
import Header from '../components/Header.jsx'
import BottomNav from '../components/BottomNav.jsx'
import { getProject } from '../mocks/projects.js'
import { getFeedback, updateFeedbackStatus } from '../mocks/feedback.js'
import './ViewFeedback.css'

const statusOptions = [
  { label: 'Complete', status: 'Complete' },
  { label: 'Incomplete', status: 'Incomplete' },
  { label: 'Work In Progress', status: 'WIP' },
  { label: 'Resolved', status: 'Resolved' },
  { label: 'Assigned', status: 'Assigned' },
]

function ViewFeedback() {
  const { feedbackId } = useParams()
  const location = useLocation()
  const [feedback, setFeedback] = useState(undefined)
  const [project, setProject] = useState(null)
  const [statusOpen, setStatusOpen] = useState(false)
  const backTo = location.state?.from ?? '/developer/feedback-history'

  useEffect(() => {
    getFeedback(feedbackId).then((item) => {
      setFeedback(item)
      if (item) getProject(item.projectId).then(setProject)
    })
  }, [feedbackId])

  function changeStatus(status) {
    setStatusOpen(false)
    updateFeedbackStatus(feedback.id, status).then(setFeedback)
  }

  return (
    <div className="view-feedback-page">
      <Header />
      <main className="view-feedback-main">
        <div className="view-feedback-top">
          <Link className="view-feedback-back" to={backTo}>‹ Back</Link>
          {feedback && (
            <div className="view-feedback-status-picker">
              <button
                type="button"
                className="view-feedback-status"
                aria-label={`Status: ${feedback.status}. Change status`}
                aria-expanded={statusOpen}
                aria-controls="view-feedback-status-menu"
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
        {feedback === null && <p>Feedback not found.</p>}
        {feedback && project && (
          <>
            <div className="view-feedback-game">
              <div>
                <p className="view-feedback-game-label">Playtest Feedback for</p>
                <h1>{project.name}</h1>
                <p className="view-feedback-game-developer">by {project.developer}</p>
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
                  <li key={url}>
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
              disabled={feedback.status === 'Resolved'}
            >
              {feedback.status === 'Resolved' ? 'Resolved' : 'Mark Resolved'}
            </button>
          </>
        )}
      </main>
      <BottomNav />
    </div>
  )
}

export default ViewFeedback
