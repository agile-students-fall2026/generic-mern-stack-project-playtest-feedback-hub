import './MainPage.css';
import './AuthPages.css'
import { Link } from 'react-router-dom'

function MainPage() {
  return (
    <main className="welcome-page">
      <img
        className="logo"
        src="/logo.png"
        alt="Playtest Feedback Hub Logo"
      />

      <div className="button-container">
        <Link to="/signin" className="sign-in">
          Sign In
        </Link>

        <p className="signup-text">
          or <Link to="/signup">Sign up</Link>
        </p>
      </div>
    </main>
  );
}

export default MainPage;