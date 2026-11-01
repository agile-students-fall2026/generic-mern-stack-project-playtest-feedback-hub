import { Link } from 'react-router-dom'
import Header from '../components/Header.jsx'
import BottomNav from '../components/BottomNav.jsx'
import './SuccessPage/SuccessPage.css'

function DeveloperHub() {
  return (
    <div className="success-page">
      <Header />
      <main className="success-main">
        <p>Welcome to the</p>
        <h1 className="success-message">Developer Hub</h1>
        <div className="success-actions">
          <Link className="success-link" to="/projects">My Projects</Link>
          <Link className="success-link" to="/account" state={{ from: '/developer' }}>Account</Link>
          <Link className="success-link" to="/developer/feedback-history">Feedback History</Link>
          <Link className="success-link" to="/pth">Switch to Playtester Mode</Link>
        </div>
      </main>
      <BottomNav />
    </div>
  )
}

export default DeveloperHub