import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Header from '../components/Header.jsx'
import BottomNav from '../components/BottomNav.jsx'
import { getProject } from '../mocks/projects.js'
import { getProjectFeedback } from '../mocks/feedback.js'
import './FeedbackList.css'

const statusFilters = [
  { label: 'Complete', status: 'Complete' },
  { label: 'Incomplete', status: 'Incomplete' },
  { label: 'Work In Progress', status: 'WIP' },
  { label: 'Resolved', status: 'Resolved' },
  { label: 'Assigned', status: 'Assigned' },
]

function FeedbackList() {
  const { projectId } = useParams()
  const [project, setProject] = useState(undefined)
  const [feedback, setFeedback] = useState([])
  const [filterOpen, setFilterOpen] = useState(false)
  const [statusFilter, setStatusFilter] = useState(null)

  useEffect(() => {
    getProject(projectId).then(setProject)
    getProjectFeedback(projectId).then(setFeedback)
  }, [projectId])

  const shownFeedback = statusFilter === null
    ? feedback
    : feedback.filter((item) => item.status === statusFilter)

  function toggleStatus(status) {
    setStatusFilter(statusFilter === status ? null : status)
  }

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
              <button
                type="button"
                className="feedback-filter"
                aria-label="Filter feedback by status"
                aria-expanded={filterOpen}
                aria-controls="feedback-filter-menu"
                onClick={() => setFilterOpen(!filterOpen)}
              >
                <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
                  <path d="M5 10h22M9 16h14M13 22h6" />
                </svg>
              </button>
            </div>
            {filterOpen && (
              <ul className="feedback-filter-menu" id="feedback-filter-menu">
                {statusFilters.map((option) => (
                  <li key={option.status}>
                    <button
                      type="button"
                      aria-pressed={statusFilter === option.status}
                      onClick={() => toggleStatus(option.status)}
                    >
                      {option.label}
                    </button>
                  </li>
                ))}
              </ul>
            )}
            {shownFeedback.length === 0 ? (
              <p className="feedback-list-empty">
                {feedback.length === 0 ? 'No feedback yet.' : 'No feedback with this status.'}
              </p>
            ) : (
              <ul className="feedback-cards">
                {shownFeedback.map((item) => (
                  <li key={item.id}>
                    <Link
                      className="feedback-card"
                      to={`/developer/feedback/${item.id}`}
                      state={{ from: `/projects/${projectId}/feedback` }}
                    >
                      <div>
                        <h2>{item.category}</h2>
                        <p>by {item.author}</p>
                        <p>submitted {item.submitted}</p>
                      </div>
                      <span className="feedback-status">{item.status}</span>
                    </Link>
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
