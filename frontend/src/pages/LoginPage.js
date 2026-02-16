import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/auth/login`,
        { username, password },
      );
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("username", res.data.username);
      navigate("/dashboard");
    } catch (err) {
      setError("Invalid credentials. Please try again.");
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
            <div className="auth-feature">
              <span className="auth-feature-icon">⚔️</span>
              <span>Connect with friends and compete in challenges</span>
            </div>
          </div>
        </div>
      </div>

      <div className="auth-form-section">
        <div className="auth-container">
          <div className="auth-header">
            <h2>Welcome Back!</h2>
            <p className="auth-subtitle">Sign in to your account to continue</p>
          </div>

          {error && (
            <div className="error">
              <span className="error-icon">⚠️</span>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="input-group">
              <label htmlFor="username">Username</label>
              <input
                id="username"
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                autoFocus
              />
            </div>

            <div className="input-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="auth-submit-btn"
              disabled={loading}
            >
              {loading ? <span className="spinner"></span> : "Sign In"}
            </button>
          </form>

          <div className="auth-footer">
            <p>
              Don't have an account? <Link to="/register">Create one</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
