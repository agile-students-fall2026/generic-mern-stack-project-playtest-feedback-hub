import '../pages/MainPage.css';

function WelcomePage() {
  return (
    <main className="welcome-container">
      <img
      className="logo"
      src="/logo.png"
      alt="Playtest Feedback Hub Logo"
    />

      <h1>Welcome to Playtest Feedback Hub!</h1>

      <div className="button-container">
        <button className="sign-in">Sign in</button>

        <p className="signup-text">
          or <a href="/signup">Sign up</a>
        </p>
      </div>
    </main>
  );
}

export default WelcomePage;