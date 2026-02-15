import React from "react";
import { Link, useNavigate } from "react-router-dom";

function Sidebar({ onLogout }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate("/");
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-logo">🎯</div>
        <h2>HabitTracker</h2>
      </div>

      <nav className="sidebar-nav">
        <ul>
          <li>
            <Link to="/dashboard" className="active">
              <span className="nav-icon">📊</span> Dashboard
            </Link>
          </li>
        </ul>
      </nav>

      <div className="sidebar-footer">
        <div className="user-info">
          <div className="avatar">U</div>
          <div className="user-details">
            <span className="name">User</span>
            <span className="role">Free Plan</span>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="logout-btn-sidebar"
          title="Log out"
        >
          <span className="logout-icon">⬅</span>
          <span className="logout-text">Logout</span>
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
//ss
