import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // ===============================
  // LOGIN
  // ===============================

  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");

    const cleanEmail = email.trim().toLowerCase();

    // Required field validation
    if (!cleanEmail || !password) {
      setError("Please enter your email and password.");
      return;
    }

    // Email validation
    const emailPattern =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(cleanEmail)) {
      setError("Please enter a valid email address.");
      return;
    }

    // Password validation
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        "http://localhost:5000/api/login",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            email: cleanEmail,
            password,
          }),
        }
      );

      const data = await response.json();

      // Backend returned an error
      if (!response.ok) {
        setError(
          data.message ||
            "Invalid email or password."
        );
        return;
      }

      // Make sure token exists
      if (!data.token || !data.user) {
        setError(
          "Login response is incomplete. Please try again."
        );
        return;
      }

      console.log(
        "Login successful:",
        data.user
      );

      // ===============================
      // SAVE LOGIN STATE
      // ===============================

      localStorage.setItem(
        "jobtrackLoggedIn",
        "true"
      );

      // ===============================
      // SAVE JWT TOKEN
      // ===============================

      localStorage.setItem(
        "jobtrackToken",
        data.token
      );

      // ===============================
      // SAVE USER INFORMATION
      // ===============================

      localStorage.setItem(
        "jobtrackUser",
        JSON.stringify(data.user)
      );

      // ===============================
      // GO TO DASHBOARD
      // ===============================

      navigate("/dashboard");

    } catch (error) {
      console.error(
        "Login Error:",
        error
      );

      setError(
        "Could not connect to backend. Please make sure the backend server is running."
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">

      <div className="auth-card">

        <div className="auth-logo">

          <span className="logo-icon">
            J
          </span>

          JobTrack

        </div>

        <h1>
          Welcome back
        </h1>

        <p className="auth-subtitle">
          Log in to continue managing your job search.
        </p>

        {error && (
          <div className="auth-error">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>

          {/* EMAIL */}

          <div className="form-group">

            <label>
              Email address
            </label>

            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              disabled={loading}
            />

          </div>

          {/* PASSWORD */}

          <div className="form-group">

            <label>
              Password
            </label>

            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              disabled={loading}
            />

          </div>

          {/* REMEMBER / FORGOT */}

          <div className="forgot-row">

            <label>

              <input
                type="checkbox"
                disabled={loading}
              />

              Remember me

            </label>

            <a href="#">
              Forgot password?
            </a>

          </div>

          {/* LOGIN BUTTON */}

          <button
            type="submit"
            className="auth-btn"
            disabled={loading}
          >
            {loading
              ? "Logging in..."
              : "Log In"}
          </button>

        </form>

        <p className="auth-switch">

          Don't have an account?

          <a href="/register">
            Create account
          </a>

        </p>

        <a
          className="back-home"
          href="/"
        >
          ← Back to JobTrack
        </a>

      </div>

    </div>
  );
}

export default Login;