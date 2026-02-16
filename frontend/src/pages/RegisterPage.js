import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

function RegisterPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 4) {
      setError("Password must be at least 4 characters long.");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/auth/register`,
        {
          username,
          password,
        },
      );
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("username", res.data.username);
      navigate("/dashboard");
    } catch (err) {
      setError("Registration failed. Username may already be taken.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-brand">
        <div className="auth-brand-content">
          <div className="auth-logo">🎯</div>
          <h1>HabitTracker</h1>
          <p>
            Build better habits, achieve your goals, and level up your life —
            one step at a time.
          </p>
          <div className="auth-features">
            <div className="auth-feature">
              <span className="auth-feature-icon">✨</span>
              <span>Earn XP for every goal you complete</span>
            </div>
            <div className="auth-feature">
              <span className="auth-feature-icon">🔥</span>
              <span>Build streaks and stay consistent</span>
            </div>
            <div className="auth-feature">
              <span className="auth-feature-icon">🏆</span>
              <span>Unlock badges and track progress</span>
            </div>
          </div>
        </div>
      </div>

      <div className="auth-form-section">
        <div className="auth-container">
          <div className="auth-header">
            <h2>Create an account</h2>
            <p className="auth-subtitle">
              Get started for free — no credit card needed
            </p>
          </div>

          {error && (
            <div className="error">
              <span className="error-icon">⚠️</span>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="input-group">
              <label htmlFor="reg-username">Username</label>
              <input
                id="reg-username"
                type="text"
                placeholder="Choose a username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                autoFocus
              />
            </div>

            <div className="input-group">
              <label htmlFor="reg-password">Password</label>
              <input
                id="reg-password"
                type="password"
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="input-group">
              <label htmlFor="reg-confirm-password">Confirm Password</label>
              <input
                id="reg-confirm-password"
                type="password"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="auth-submit-btn"
              disabled={loading}
            >
              {loading ? <span className="spinner"></span> : "Create Account"}
            </button>
          </form>

          <div className="auth-footer">
            <p>
              Already have an account? <Link to="/">Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
