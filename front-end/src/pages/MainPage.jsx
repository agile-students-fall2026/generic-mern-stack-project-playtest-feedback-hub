import './MainPage.css';
import { Link } from 'react-router-dom'

function MainPage() {
  return (
    <main className="welcome-page">
      <img
      className="logo"
      src="/logo.png"
      alt="Playtest Feedback Hub Logo"
    />

      <h1>Welcome to the<br />
      Playtest Feedback Hub!</h1>

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