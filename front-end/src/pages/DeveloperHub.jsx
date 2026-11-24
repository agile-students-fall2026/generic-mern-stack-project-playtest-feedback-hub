import { Link } from 'react-router-dom'
import Header from '../components/Header.jsx'
import BottomNav from '../components/BottomNav.jsx'
import './HubPages.css'

function DeveloperHub() {
  return (
    <div className="developer-page">
      <Header />
      <main className="developer-main">
        <p className="developer-welcome">Welcome to the</p>
        <h1 className="developer-title">Developer Hub</h1>

        <div className="developer-actions">
          <Link className="developer-link" to="/projects">My Projects</Link>
          <Link className="developer-link" to="/account" state={{ from: '/developer' }}>Account</Link>
          {/*
          <Link className="developer-link" to="/developer/feedback-history">Feedback History</Link>
          */}
          <Link className="developer-link" to="/playtester">Switch to Playtester Mode</Link>
        </div>
      </main>
    </div>
  )
}

export default DeveloperHub