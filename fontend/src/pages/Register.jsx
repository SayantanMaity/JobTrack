import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleRegister = (e) => {
    e.preventDefault();

    setError("");

    if (!name || !email || !password || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    const existingUser = JSON.parse(
      localStorage.getItem("jobtrackUser")
    );

    if (existingUser && existingUser.email === email) {
      setError("An account with this email already exists.");
      return;
    }

    const user = {
      name,
      email,
      password,
    };

    localStorage.setItem(
      "jobtrackUser",
      JSON.stringify(user)
    );

    alert("Account created successfully!");

    navigate("/login");
  };

  return (
    <div className="auth-page">
      <div className="auth-card">

        <div className="auth-logo">
          <span className="logo-icon">J</span>
          JobTrack
        </div>

        <h1>Create your account</h1>

        <p className="auth-subtitle">
          Start organizing your job search today.
        </p>

        {error && (
          <div className="auth-error">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister}>

          <div className="form-group">
            <label>Full name</label>

            <input
              type="text"
              placeholder="Your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Email address</label>

            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Password</label>

            <input
              type="password"
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Confirm password</label>

            <input
              type="password"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) =>
                setConfirmPassword(e.target.value)
              }
            />
          </div>

          <button
            type="submit"
            className="auth-btn"
          >
            Create Account
          </button>

        </form>

        <p className="auth-switch">
          Already have an account?

          <a href="/login">
            Log in
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

export default Register;