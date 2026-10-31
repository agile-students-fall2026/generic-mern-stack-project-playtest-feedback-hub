import MainPage from './pages/MainPage.jsx';
import SignInPage from './pages/SignInPage.jsx'
import SignUpPage from './pages/SignUpPage.jsx'
import ScanPage from './ptScanPage.jsx'
import FeedBackPage from './ptFeedBackPage.jsx'
import { Routes, Route } from 'react-router-dom'
import SuccessPage from './pages/SuccessPage/SuccessPage.jsx'
import PlaytesterHub from './pages/PlaytesterHub.jsx'
import FeedbackHistory from './pages/FeedbackHistory.jsx'
import AccountPage from './pages/AccountPage.jsx'
import DeveloperHub from './pages/DeveloperHub.jsx'
import MyProjects from './pages/MyProjects.jsx'
import AddProject from './pages/AddProject.jsx'
import QrDisplay from './pages/QrDisplay.jsx'

function App() {
    return (
        <Routes>
            <Route path="/" element={<MainPage />} />
            <Route path="/signin" element={<SignInPage />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/pth" element={<PlaytesterHub />} />
            <Route path="/scan" element={<ScanPage />} />
            <Route path="/feedback" element={<FeedBackPage />} />
            <Route path="/feedback/success" element={<SuccessPage />} />
            <Route path="/feedback-history" element={<FeedbackHistory />} />
            <Route path="/account" element={<AccountPage />} />
            <Route path="/developer" element={<DeveloperHub />} />
            <Route path="/projects" element={<MyProjects />} />
            <Route path="/projects/new" element={<AddProject />} />
            <Route path="/projects/:projectId/qr" element={<QrDisplay />} />
        </Routes>
    )
}

export default App
