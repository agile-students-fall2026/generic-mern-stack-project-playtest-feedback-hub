import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Header from '../components/Header.jsx'
import BottomNav from '../components/BottomNav.jsx'
import { getProjects } from '../mocks/projects.js'
import { getAllFeedback } from '../mocks/feedback.js'
import './DeveloperFeedbackHistory.css'

const statusFilters = [
  { label: 'Complete', status: 'Complete' },
  { label: 'Incomplete', status: 'Incomplete' },
  { label: 'Work In Progress', status: 'WIP' },
  { label: 'Resolved', status: 'Resolved' },
  { label: 'Assigned', status: 'Assigned' },
]

function DeveloperFeedbackHistory() {
  const [feedback, setFeedback] = useState([])
  const [filterOpen, setFilterOpen] = useState(false)
  const [statusFilter, setStatusFilter] = useState(null)

  useEffect(() => {
    Promise.all([getProjects(), getAllFeedback()]).then(([projects, items]) => {
      const gameNames = Object.fromEntries(projects.map((project) => [project.id, project.name]))
      setFeedback(items.map((item) => ({ ...item, gameName: gameNames[item.projectId] })))
    })
  }, [])

  const shownFeedback = statusFilter === null
    ? feedback
    : feedback.filter((item) => item.status === statusFilter)

  function toggleStatus(status) {
    setStatusFilter(statusFilter === status ? null : status)
  }

  return (
    <div className="dev-history-page">
      <Header />
      <main className="dev-history-main">
        <Link className="dev-history-back" to="/developer">‹ Back</Link>
        <div className="dev-history-heading">
          <h1>Feedback History</h1>
          <button
            type="button"
            className="dev-history-filter"
            aria-label="Filter feedback by status"
            aria-expanded={filterOpen}
            aria-controls="dev-history-filter-menu"
            onClick={() => setFilterOpen(!filterOpen)}
          >
            <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
              <path d="M5 10h22M9 16h14M13 22h6" />
            </svg>
          </button>
        </div>
        {filterOpen && (
          <ul className="dev-history-filter-menu" id="dev-history-filter-menu">
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
          <p className="dev-history-empty">
            {feedback.length === 0 ? 'No feedback yet.' : 'No feedback with this status.'}
          </p>
        ) : (
          <ul className="dev-history-cards">
            {shownFeedback.map((item) => (
              <li key={item.id}>
                <Link
                  className="dev-history-card"
                  to={`/developer/feedback/${item.id}`}
                  state={{ from: '/developer/feedback-history' }}
                >
                  <div>
                    <h2>{item.gameName}</h2>
                    <p>{item.category} · by {item.author}</p>
                    <p>submitted {item.submitted}</p>
                  </div>
                  <span className="dev-history-status">{item.status}</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </main>
      <BottomNav />
    </div>
  )
}

export default DeveloperFeedbackHistory
