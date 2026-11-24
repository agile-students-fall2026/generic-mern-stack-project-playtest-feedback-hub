import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Header from '../components/Header.jsx'
import BottomNav from '../components/BottomNav.jsx'
import { getFeedbackHistory } from '../services/feedbackApi.js'
import '../ptFeedBackPage.css'
import './FeedbackHistory.css'

function FeedbackHistory() {
    const navigate = useNavigate()
    const [history] = useState(() => {
        try { 
            return getFeedbackHistory() 
        } catch { 
            return [] 
        }
    })

    return (
        <div className="feedback-list-page">
            <Header />
            <main className="feedback-list-main">
                <Link className="feedback-list-back" onClick={() => navigate(-1)}>‹ Back</Link>
                
                <h1 className="feedback-list-heading h1">Feedback Log</h1>

                {history.length === 0 ? (
                    <p className="feedback-list-empty">
                        No feedback yet.{' '}
                        <Link to="/scan">Start a playtest.</Link>
                    </p>
                ) : (
                    <div className="feedback-cards">
                        {history.map(item => (
                            <details key={item.id} className="feedback-card">
                                <summary className="history-card-summary">
                                    <span className="history-game-name">
                                        {item.gameName}
                                    </span>

                                    <span className="history-developer">
                                        by {item.developer}
                                    </span>

                                    <span className="history-date">
                                        submitted {' '} {new Date(item.createdAt).toLocaleDateString()}
                                    </span>
                                </summary>

                                <div className="history-card-content">
                                    <p>Category: {item.category}</p>
                                    <p>{item.feedback}</p>
                                    <p>{item.anonymous ? 'Anonymous feedback' : 'Non-anonymous feedback'}</p>
                                </div>       
                                
                                {item.imageNames?.map((name, index) => <p key={index}>Attachment filename: {name}</p>)}
                                {item.imageUrls?.map((url, index) => <p key={index}><a href={url} target="_blank" rel="noreferrer">Image link {index + 1}</a></p>)}
                            </details>
                        ))}
                    </div>
                )}
            </main>
        </div>
    )
}

export default FeedbackHistory
