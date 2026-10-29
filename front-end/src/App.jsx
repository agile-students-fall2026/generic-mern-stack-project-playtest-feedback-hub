import ScanPage from './ptScanPage.jsx'
import FeedBackPage from './ptFeedBackPage.jsx'
import { Routes, Route } from 'react-router-dom'
import SuccessPage from './pages/SuccessPage/SuccessPage.jsx'
import PlaytesterHub from './pages/PlaytesterHub.jsx'
import FeedbackHistory from './pages/FeedbackHistory.jsx'
import AccountPage from './pages/AccountPage.jsx'

function App() {
    return (
        <Routes>
            <Route path="/" element={<PlaytesterHub />} />
            <Route path="/scan" element={<ScanPage />} />
            <Route path="/feedback" element={<FeedBackPage />} />
            <Route path="/feedback/success" element={<SuccessPage />} />
            <Route path="/feedback-history" element={<FeedbackHistory />} />
            <Route path="/account" element={<AccountPage />} />
        </Routes>
    )
}

export default App
