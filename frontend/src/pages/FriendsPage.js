import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";

function FriendsPage() {
  const [friends, setFriends] = useState([]);
  const [requests, setRequests] = useState([]);
  const [searchUsername, setSearchUsername] = useState("");
  const [message, setMessage] = useState({ text: "", type: "" });
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  const fetchFriends = async () => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/friends`,
        { headers },
      );
      setFriends(res.data);
    } catch (err) {}
  };

  const fetchRequests = async () => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/friends/requests`,
        { headers },
      );
      setRequests(res.data);
    } catch (err) {}
  };

  const sendRequest = async (e) => {
    e.preventDefault();
    if (!searchUsername.trim()) return;
    setLoading(true);
    setMessage({ text: "", type: "" });
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/friends/request`,
        { username: searchUsername },
        { headers },
      );
      setMessage({ text: res.data.msg, type: "success" });
      setSearchUsername("");
    } catch (err) {
      setMessage({
        text: err.response?.data?.msg || "Failed to send request",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const acceptRequest = async (id) => {
    try {
      await axios.put(
        `${process.env.REACT_APP_API_URL}/api/friends/requests/${id}/accept`,
        {},
        { headers },
      );
      fetchRequests();
      fetchFriends();
    } catch (err) {}
  };

  const rejectRequest = async (id) => {
    try {
      await axios.put(
        `${process.env.REACT_APP_API_URL}/api/friends/requests/${id}/reject`,
        {},
        { headers },
      );
      fetchRequests();
    } catch (err) {}
  };

  const removeFriend = async (id) => {
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/api/friends/${id}`, {
        headers,
      });
      fetchFriends();
    } catch (err) {}
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    window.location.href = "/";
  };

  useEffect(() => {
    fetchFriends();
    fetchRequests();
  }, []);

  return (
    <div className="app-layout">
      <Sidebar onLogout={handleLogout} />

      <main className="main-content">
        <header className="top-header">
          <h1>Friends 👥</h1>
          <p className="date">Connect and compete with your friends</p>
        </header>

        {/* Send Friend Request */}
        <div className="card friends-send-card">
          <h2>➕ Add a Friend</h2>
          <form onSubmit={sendRequest} className="friend-search-form">
            <div className="friend-search-input-wrap">
              <input
                type="text"
                placeholder="Enter friend's username..."
                value={searchUsername}
                onChange={(e) => setSearchUsername(e.target.value)}
                className="friend-search-input"
              />
              <button
                type="submit"
                disabled={loading}
                className="friend-search-btn"
              >
                {loading ? <span className="spinner"></span> : "Send Request"}
              </button>
            </div>
          </form>
          {message.text && (
            <div
              className={`friend-message ${message.type === "success" ? "friend-msg-success" : "friend-msg-error"}`}
            >
              {message.type === "success" ? "✅" : "⚠️"} {message.text}
            </div>
          )}
        </div>

        <div className="friends-grid">
          {/* Friend Requests */}
          <div className="card friends-requests-card">
            <h2>📩 Friend Requests</h2>
            {requests.length === 0 ? (
              <div className="empty-state">
                <span className="empty-icon">📭</span>
                <p>No pending requests</p>
              </div>
            ) : (
              <div className="friend-requests-list">
                {requests.map((req) => (
                  <div key={req._id} className="friend-request-item">
                    <div className="friend-request-info">
                      <div className="friend-avatar">
                        {req.from.username.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <span className="friend-name">{req.from.username}</span>
                        <span className="friend-xp">{req.from.xp} XP</span>
                      </div>
                    </div>
                    <div className="friend-request-actions">
                      <button
                        className="btn-accept"
                        onClick={() => acceptRequest(req._id)}
                      >
                        ✓ Accept
                      </button>
                      <button
                        className="btn-reject"
                        onClick={() => rejectRequest(req._id)}
                      >
                        ✕ Decline
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Friends List */}
          <div className="card friends-list-card">
            <h2>👫 Your Friends ({friends.length})</h2>
            {friends.length === 0 ? (
              <div className="empty-state">
                <span className="empty-icon">🤝</span>
                <p>Add friends to compete together!</p>
              </div>
            ) : (
              <div className="friends-list">
                {friends.map((friend) => (
                  <div key={friend._id} className="friend-item">
                    <div className="friend-item-info">
                      <div className="friend-avatar">
                        {friend.username.charAt(0).toUpperCase()}
                      </div>
                      <div className="friend-item-details">
                        <span className="friend-name">{friend.username}</span>
                        <div className="friend-stats">
                          <span>✨ {friend.xp} XP</span>
                          <span>🔥 {friend.streak} streak</span>
                        </div>
                      </div>
                    </div>
                    <button
                      className="btn-remove-friend"
                      onClick={() => removeFriend(friend._id)}
                      title="Remove friend"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default FriendsPage;
