import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";

function Home() {
  return (
    <div className="app">

      {/* Navbar */}
      <nav className="navbar">

        <div className="logo">
          <span className="logo-icon">J</span>
          JobTrack
        </div>

        <div className="nav-links">

          <a href="#features">
            Features
          </a>

          <a href="#how-it-works">
            How It Works
          </a>

          <a href="/login">
            <button className="login-btn">
              Log In
            </button>
          </a>

          <a href="/register">
            <button className="signup-btn">
              Get Started
            </button>
          </a>

        </div>
      </nav>


      {/* Hero */}
      <main className="hero">

        <div className="hero-content">

          <div className="badge">
            🚀 Your career, organized
          </div>

          <h1>
            Track your job search.
            <span> Land your dream job.</span>
          </h1>

          <p>
            JobTrack helps you organize applications, interviews,
            offers and everything in between — all in one place.
          </p>

          <div className="hero-buttons">

            <a href="/register">
              <button className="primary-btn">
                Start Tracking →
              </button>
            </a>

            <a href="#how-it-works">
              <button className="secondary-btn">
                See How It Works
              </button>
            </a>

          </div>

          <div className="stats">

            <div>
              <strong>100%</strong>
              <small>Organized</small>
            </div>

            <div>
              <strong>24/7</strong>
              <small>Accessible</small>
            </div>

            <div>
              <strong>1 Place</strong>
              <small>Everything</small>
            </div>

          </div>

        </div>


        {/* Dashboard Preview */}
        <div className="dashboard-preview">

          <div className="preview-header">

            <div>
              <small>Welcome back 👋</small>
              <h3>Job Applications</h3>
            </div>

            <div className="avatar">
              S
            </div>

          </div>


          <div className="preview-stats">

            <div className="mini-card">
              <small>Total Applications</small>
              <strong>24</strong>
            </div>

            <div className="mini-card">
              <small>Interviews</small>
              <strong>6</strong>
            </div>

            <div className="mini-card">
              <small>Offers</small>
              <strong>2</strong>
            </div>

          </div>


          <div className="application-list">

            <div className="application">

              <div className="company-icon">
                G
              </div>

              <div>
                <strong>Frontend Developer</strong>
                <small>Google</small>
              </div>

              <span className="status interview">
                Interview
              </span>

            </div>


            <div className="application">

              <div className="company-icon">
                M
              </div>

              <div>
                <strong>React Developer</strong>
                <small>Microsoft</small>
              </div>

              <span className="status applied">
                Applied
              </span>

            </div>


            <div className="application">

              <div className="company-icon">
                A
              </div>

              <div>
                <strong>Software Engineer</strong>
                <small>Amazon</small>
              </div>

              <span className="status offer">
                Offer
              </span>

            </div>

          </div>

        </div>

      </main>


      {/* Features */}
      <section className="features" id="features">

        <div className="section-heading">

          <span>FEATURES</span>

          <h2>
            Everything you need for your job search
          </h2>

          <p>
            Stop using spreadsheets and scattered notes.
            Keep your entire job hunt organized.
          </p>

        </div>


        <div className="feature-grid">

          <div className="feature-card">

            <div className="feature-icon">
              📋
            </div>

            <h3>
              Track Applications
            </h3>

            <p>
              Keep every job application organized with
              company, position, salary and status.
            </p>

          </div>


          <div className="feature-card">

            <div className="feature-icon">
              📅
            </div>

            <h3>
              Manage Interviews
            </h3>

            <p>
              Never miss an interview. Keep track of dates,
              times and important notes.
            </p>

          </div>


          <div className="feature-card">

            <div className="feature-icon">
              📊
            </div>

            <h3>
              See Your Progress
            </h3>

            <p>
              Understand your job search with useful
              statistics and visual reports.
            </p>

          </div>

        </div>

      </section>


      {/* How It Works */}
      <section
        className="how-it-works"
        id="how-it-works"
      >

        <div className="section-heading">

          <span>HOW IT WORKS</span>

          <h2>
            Simple. Organized. Effective.
          </h2>

        </div>


        <div className="steps">

          <div className="step">

            <div className="step-number">
              01
            </div>

            <h3>
              Add Applications
            </h3>

            <p>
              Add the jobs you're applying for.
            </p>

          </div>


          <div className="step">

            <div className="step-number">
              02
            </div>

            <h3>
              Track Progress
            </h3>

            <p>
              Move applications through each stage.
            </p>

          </div>


          <div className="step">

            <div className="step-number">
              03
            </div>

            <h3>
              Get Hired
            </h3>

            <p>
              Stay organized until you land the job.
            </p>

          </div>

        </div>

      </section>


      {/* Footer */}
      <footer>

        <div className="logo">

          <span className="logo-icon">
            J
          </span>

          JobTrack

        </div>

        <p>
          © 2026 JobTrack. Built with React.
        </p>

      </footer>

    </div>
  );
}


/* Protected Dashboard */

function ProtectedDashboard() {

  const isLoggedIn =
    localStorage.getItem("jobtrackLoggedIn");

  if (isLoggedIn !== "true") {
    return <Navigate to="/login" replace />;
  }

  return <Dashboard />;
}


/* Main App */

function App() {

  return (

    <BrowserRouter>

      <Routes>

        {/* Landing Page */}
        <Route
          path="/"
          element={<Home />}
        />

        {/* Login */}
        <Route
          path="/login"
          element={<Login />}
        />

        {/* Register */}
        <Route
          path="/register"
          element={<Register />}
        />

        {/* Protected Dashboard */}
        <Route
          path="/dashboard"
          element={<ProtectedDashboard />}
        />

        {/* Unknown URL */}
        <Route
          path="*"
          element={<Navigate to="/" replace />}
        />

      </Routes>

    </BrowserRouter>

  );
}


export default App;