import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Header from '../components/Header.jsx'
import BottomNav from '../components/BottomNav.jsx'
import { getProject } from '../mocks/projects.js'
import { getProjectFeedback } from '../mocks/feedback.js'
import './FeedbackList.css'

function FeedbackList() {
  const { projectId } = useParams()
  const [project, setProject] = useState(undefined)
  const [feedback, setFeedback] = useState([])

  useEffect(() => {
    getProject(projectId).then(setProject)
    getProjectFeedback(projectId).then(setFeedback)
  }, [projectId])

  return (
    <div className="feedback-list-page">
      <Header />
      <main className="feedback-list-main">
        <Link className="feedback-list-back" to="/projects">‹ Back</Link>
        {project === null && <p>Project not found.</p>}
        {project && (
          <>
            <div className="feedback-list-heading">
              <h1>{project.name} Feedback</h1>
              {/* Will open the status filter (Feedback Categories screen) */}
              <button type="button" className="feedback-filter" aria-label="Filter feedback">
                <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
                  <path d="M5 10h22M9 16h14M13 22h6" />
                </svg>
              </button>
            </div>
            {feedback.length === 0 ? (
              <p className="feedback-list-empty">No feedback yet.</p>
            ) : (
              <ul className="feedback-cards">
                {feedback.map((item) => (
                  <li className="feedback-card" key={item.id}>
                    <div>
                      <h2>{item.category}</h2>
                      <p>by {item.author}</p>
                      <p>submitted {item.submitted}</p>
                    </div>
                    <span className="feedback-status">{item.status}</span>
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
      </main>
      <BottomNav />
    </div>
  )
}

export default FeedbackList
