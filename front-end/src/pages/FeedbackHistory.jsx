import { useState } from 'react'
import { Link } from 'react-router-dom'
import Header from '../components/Header.jsx'
import BottomNav from '../components/BottomNav.jsx'
import { getFeedbackHistory } from '../services/feedbackApi.js'
import '../ptFeedBackPage.css'
import './FeedbackHistory.css'

function FeedbackHistory() {
    const [history] = useState(() => {
        try { 
            return getFeedbackHistory() 
        } catch { 
            return [] 
        }
    })

    return (
        <div className="feedback-shell">
            <Header />

            <main className="feedback-page feedback-history-page">
                <Link className="history-back" to="/">&lt; Back</Link>
                
                
                <h1 className="history-title">Feedback Log</h1>

                {history.length === 0 ? (
                    <p className="history-empty">
                        No feedback yet.{' '}
                        <Link to="/scan">Start a playtest.</Link>
                    </p>
                ) : (
                    <div className="history-list">
                        {history.map(item => (
                            <details key={item.id} className="history-item">
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
            <BottomNav />
        </div>
    )
}

export default FeedbackHistory
