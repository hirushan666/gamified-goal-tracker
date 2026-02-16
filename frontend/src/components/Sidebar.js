import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

function Sidebar({ onLogout }) {
  const navigate = useNavigate();
  const location = useLocation();
  const username = localStorage.getItem("username") || "User";

  const handleLogout = () => {
    onLogout();
    navigate("/");
  };

  const navItems = [
    { path: "/dashboard", label: "Dashboard", icon: "📊" },
    { path: "/goals", label: "Goals", icon: "🎯" },
    { path: "/friends", label: "Friends", icon: "👥" },
    { path: "/challenges", label: "Challenges", icon: "⚔️" },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-logo">🎯</div>
        <h2>HabitTracker</h2>
      </div>

      <nav className="sidebar-nav">
        <ul>
          {navItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={location.pathname === item.path ? "active" : ""}
              >
                <span className="nav-icon">{item.icon}</span> {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="sidebar-footer">
        <div className="user-info">
          <div className="avatar">{username.charAt(0).toUpperCase()}</div>
          <div className="user-details">
            <span className="name">{username}</span>
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
