import { useEffect, useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import Header from '../components/Header.jsx'
import BottomNav from '../components/BottomNav.jsx'
import './FeedbackList.css'

const statusFilters = [
  { label: 'Complete', status: 'Complete' },
  { label: 'Incomplete', status: 'Incomplete' },
  { label: 'Work In Progress', status: 'WIP' },
  { label: 'Resolved', status: 'Resolved' },
  { label: 'Assigned', status: 'Assigned' },
]

async function readJson(res) {
  if (res.status === 404) return null
  if (res.status === 401) throw new Error('Sign in to view feedback on your projects.')
  if (!res.ok) throw new Error('Could not load feedback. Please try again.')
  return res.json()
}

function FeedbackList() {
  const { projectId } = useParams()
  const [project, setProject] = useState(undefined)
  const [feedback, setFeedback] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [filterOpen, setFilterOpen] = useState(false)
  const [statusFilter, setStatusFilter] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    let active = true
    const id = encodeURIComponent(projectId)
    setLoading(true)
    setLoadError('')
    Promise.all([
      fetch(`/api/projects/${id}`).then(readJson),
      fetch(`/api/projects/${id}/feedback`).then(readJson),
    ])
      .then(([projectData, items]) => {
        if (!active) return
        setProject(items === null ? null : projectData)
        setFeedback(items ?? [])
      })
      .catch((error) => {
        if (active) setLoadError(error.message)
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => { active = false }
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
        
        {loading && <p className="feedback-list-empty">Loading feedback…</p>}
        {loadError && <p className="feedback-list-empty" role="alert">{loadError}</p>}
        {!loading && !loadError && project === null && <p>Project not found.</p>}
        {!loading && !loadError && project && (
          <>
            <div className="feedback-list-heading">
              <h1>{project.name} Feedback</h1>
              <div className="feedback-filter-wrap">
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
              </div>
            </div>
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
      
    </div>
  )
}

export default FeedbackList
