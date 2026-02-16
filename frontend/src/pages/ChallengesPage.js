import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";

function ChallengesPage() {
  const [challenges, setChallenges] = useState([]);
  const [friends, setFriends] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [expandedId, setExpandedId] = useState(null);

  // Form state
  const [formName, setFormName] = useState("");
  const [formStart, setFormStart] = useState("");
  const [formEnd, setFormEnd] = useState("");
  const [selectedFriends, setSelectedFriends] = useState([]);
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState("");

  const token = localStorage.getItem("token");
  const currentUser = localStorage.getItem("username") || "You";
  const headers = { Authorization: `Bearer ${token}` };

  const fetchChallenges = async () => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/challenges`,
        { headers },
      );
      setChallenges(res.data);
    } catch (err) {}
  };

  const fetchFriends = async () => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/friends`,
        { headers },
      );
      setFriends(res.data);
    } catch (err) {}
  };

  const createChallenge = async (e) => {
    e.preventDefault();
    setFormError("");
    if (!formName || !formStart || !formEnd) {
      setFormError("All fields are required");
      return;
    }
    if (selectedFriends.length === 0) {
      setFormError("Select at least one friend");
      return;
    }
    setFormLoading(true);
    try {
      await axios.post(
        `${process.env.REACT_APP_API_URL}/api/challenges`,
        {
          name: formName,
          participantIds: selectedFriends,
          startDate: formStart,
          endDate: formEnd,
        },
        { headers },
      );
      setFormName("");
      setFormStart("");
      setFormEnd("");
      setSelectedFriends([]);
      setShowForm(false);
      fetchChallenges();
    } catch (err) {
      setFormError(err.response?.data?.msg || "Failed to create challenge");
    } finally {
      setFormLoading(false);
    }
  };

  const deleteChallenge = async (id) => {
    try {
      await axios.delete(
        `${process.env.REACT_APP_API_URL}/api/challenges/${id}`,
        { headers },
      );
      fetchChallenges();
    } catch (err) {}
  };

  const toggleFriend = (id) => {
    setSelectedFriends((prev) => {
      if (prev.includes(id)) return prev.filter((f) => f !== id);
      if (prev.length >= 4) return prev; // max 4 friends + creator = 5
      return [...prev, id];
    });
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    window.location.href = "/";
  };

  useEffect(() => {
    fetchChallenges();
    fetchFriends();
  }, []);

  const activeChallenges = challenges.filter((c) => c.status === "active");
  const completedChallenges = challenges.filter(
    (c) => c.status === "completed",
  );

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getDaysRemaining = (endDate) => {
    const now = new Date();
    const end = new Date(endDate);
    const diff = Math.ceil((end - now) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 0;
  };

  const renderLeaderboard = (challenge) => {
    const { leaderboard, status } = challenge;
    if (!leaderboard || leaderboard.length === 0) return null;

    return (
      <div className="challenge-leaderboard">
        <div className="leaderboard-header">
          <h4>
            {status === "completed"
              ? "🏆 Final Standings"
              : "📊 Live Standings"}
          </h4>
          {status === "active" && leaderboard[0]?.xp > 0 && (
            <span className="winner-so-far-badge">
              👑 {leaderboard[0].username} leads!
            </span>
          )}
        </div>
        <div className="leaderboard-list">
          {leaderboard.map((entry, idx) => (
            <div
              key={entry.userId}
              className={`leaderboard-row ${idx === 0 && entry.xp > 0 ? "leaderboard-leader" : ""} ${entry.username === currentUser ? "leaderboard-you" : ""}`}
            >
              <div className="leaderboard-rank">
                {idx === 0 && entry.xp > 0 ? "👑" : `#${idx + 1}`}
              </div>
              <div className="leaderboard-avatar">
                {entry.username.charAt(0).toUpperCase()}
              </div>
              <span className="leaderboard-name">
                {entry.username}
                {entry.username === currentUser && (
                  <span className="you-tag">you</span>
                )}
              </span>
              <div className="leaderboard-xp">
                <span className="xp-value">{entry.xp}</span>
                <span className="xp-label">XP</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderChallengeCard = (challenge) => {
    const isExpanded = expandedId === challenge._id;
    const daysLeft = getDaysRemaining(challenge.endDate);
    const isActive = challenge.status === "active";

    return (
      <div
        key={challenge._id}
        className={`challenge-card ${isActive ? "" : "challenge-completed"}`}
      >
        <div
          className="challenge-card-header"
          onClick={() => setExpandedId(isExpanded ? null : challenge._id)}
        >
          <div className="challenge-card-left">
            <span
              className="challenge-status-dot"
              style={{ background: isActive ? "#10b981" : "#94a3b8" }}
            ></span>
            <div>
              <h3 className="challenge-name">{challenge.name}</h3>
              <div className="challenge-meta">
                <span>
                  📅 {formatDate(challenge.startDate)} —{" "}
                  {formatDate(challenge.endDate)}
                </span>
                <span>👥 {challenge.participants.length} players</span>
                {isActive && (
                  <span className="days-remaining">
                    ⏰ {daysLeft} days left
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="challenge-card-right">
            {isActive && challenge.winner && challenge.winner.xp > 0 && (
              <div className="mini-leader">
                <span className="mini-leader-icon">👑</span>
                <span>{challenge.winner.username}</span>
                <span className="mini-leader-xp">{challenge.winner.xp} XP</span>
              </div>
            )}
            {!isActive && challenge.winner && (
              <div className="winner-badge">
                🏆 {challenge.winner.username} won
              </div>
            )}
            <span className={`expand-icon ${isExpanded ? "expanded" : ""}`}>
              ▾
            </span>
          </div>
        </div>

        {isExpanded && (
          <div className="challenge-card-body">
            {renderLeaderboard(challenge)}
            {challenge.creator?.username === currentUser && (
              <button
                className="btn-delete-challenge"
                onClick={(e) => {
                  e.stopPropagation();
                  deleteChallenge(challenge._id);
                }}
              >
                🗑 Delete Challenge
              </button>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="app-layout">
      <Sidebar onLogout={handleLogout} />

      <main className="main-content">
        <header className="top-header goals-header">
          <div className="goals-header-left">
            <h1>Challenges ⚔️</h1>
            <p className="date">Compete with friends and earn the most XP</p>
          </div>
          <button
            className="add-goal-toggle-btn"
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? "✕ Cancel" : "⚡ New Challenge"}
          </button>
        </header>

        {/* Create Challenge Form */}
        <div
          className={`goals-form-panel ${showForm ? "goals-form-open" : ""}`}
        >
          <div className="card goals-form-card">
            <h2>⚡ Create a New Challenge</h2>
            {formError && (
              <div className="error">
                <span className="error-icon">⚠️</span>
                {formError}
              </div>
            )}
            <form onSubmit={createChallenge} className="add-goal-form">
              <div className="input-group">
                <label>Challenge Name</label>
                <input
                  type="text"
                  placeholder="e.g. February XP Blitz"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  required
                />
              </div>
              <div className="challenge-date-row">
                <div className="input-group">
                  <label>Start Date</label>
                  <input
                    type="date"
                    value={formStart}
                    onChange={(e) => setFormStart(e.target.value)}
                    required
                  />
                </div>
                <div className="input-group">
                  <label>End Date</label>
                  <input
                    type="date"
                    value={formEnd}
                    onChange={(e) => setFormEnd(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="input-group">
                <label>Select Friends (max 4)</label>
                {friends.length === 0 ? (
                  <p className="no-friends-msg">
                    You need to add friends first! Go to the Friends page.
                  </p>
                ) : (
                  <div className="friend-select-grid">
                    {friends.map((friend) => (
                      <div
                        key={friend._id}
                        className={`friend-select-chip ${selectedFriends.includes(friend._id) ? "friend-selected" : ""}`}
                        onClick={() => toggleFriend(friend._id)}
                      >
                        <div className="friend-select-avatar">
                          {friend.username.charAt(0).toUpperCase()}
                        </div>
                        <span>{friend.username}</span>
                        {selectedFriends.includes(friend._id) && (
                          <span className="friend-check">✓</span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <button
                type="submit"
                className="add-goal-btn"
                disabled={formLoading || friends.length === 0}
              >
                {formLoading ? (
                  <span className="spinner"></span>
                ) : (
                  "🚀 Start Challenge"
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Active Challenges */}
        <div className="challenges-section">
          <h2 className="section-title">
            🔥 Active Challenges ({activeChallenges.length})
          </h2>
          {activeChallenges.length === 0 ? (
            <div className="card">
              <div className="empty-state">
                <span className="empty-icon">⚔️</span>
                <p>No active challenges. Create one to start competing!</p>
              </div>
            </div>
          ) : (
            <div className="challenges-list">
              {activeChallenges.map(renderChallengeCard)}
            </div>
          )}
        </div>

        {/* Completed Challenges */}
        {completedChallenges.length > 0 && (
          <div className="challenges-section">
            <h2 className="section-title">
              ✅ Completed Challenges ({completedChallenges.length})
            </h2>
            <div className="challenges-list">
              {completedChallenges.map(renderChallengeCard)}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default ChallengesPage;
