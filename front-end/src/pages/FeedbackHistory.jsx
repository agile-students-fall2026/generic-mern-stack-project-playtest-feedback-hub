import { useState } from 'react'
import { Link } from 'react-router-dom'
import Header from '../components/Header.jsx'
import BottomNav from '../components/BottomNav.jsx'
import { getFeedbackHistory } from '../services/feedbackApi.js'
import '../ptFeedBackPage.css'

function FeedbackHistory() {
    const [history] = useState(() => {
        try { return getFeedbackHistory() } catch { return [] }
    })

    return (
        <div className="feedback-shell">
            <Header />
            <main className="feedback-page">
                <Link to="/">‹ Back</Link>
                <h1>Feedback Log</h1>
                <p className="feedback-demo-note">Demo submissions from this browser only.</p>
                {history.length === 0 && <p>No feedback yet. <Link to="/scan">Start a playtest</Link></p>}
                {history.map(item => (
                    <details key={item.id} className="history-item">
                        <summary>{item.gameName} — {new Date(item.createdAt).toLocaleDateString()}</summary>
                        <p>by {item.developer}</p>
                        <p>Category: {item.category}</p>
                        <p>{item.feedback}</p>
                        <p>{item.anonymous ? 'Anonymous feedback' : 'Non-anonymous feedback'}</p>
                        {item.imageNames.map((name, index) => <p key={index}>Attachment filename: {name}</p>)}
                        {item.imageUrls.map((url, index) => <p key={index}><a href={url} target="_blank" rel="noreferrer">Image link {index + 1}</a></p>)}
                    </details>
                ))}
            </main>
            <BottomNav />
        </div>
    )
}

export default FeedbackHistory
