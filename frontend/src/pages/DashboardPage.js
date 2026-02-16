import React, { useEffect, useState } from "react";
import axios from "axios";
import ProgressDashboard from "../components/ProgressDashboard";
import Sidebar from "../components/Sidebar";
import StatsCard from "../components/StatsCard";

function DashboardPage() {
  const [goals, setGoals] = useState([]);
  const [progress, setProgress] = useState({ xp: 0, streak: 0, badges: [] });
  const username = localStorage.getItem("username") || "User";

  const fetchGoals = async () => {
    const token = localStorage.getItem("token");
    const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/goals`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setGoals(res.data);
  };

  const fetchProgress = async () => {
    const token = localStorage.getItem("token");
    const res = await axios.get(
      `${process.env.REACT_APP_API_URL}/api/progress`,
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );
    setProgress(res.data);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    window.location.href = "/";
  };

  useEffect(() => {
    fetchGoals();
    fetchProgress();
  }, []);

  const completedGoals = goals.filter((g) => g.status === "completed").length;
  const totalGoals = goals.length;
  const pendingGoals = totalGoals - completedGoals;

  return (
    <div className="app-layout">
      <Sidebar onLogout={handleLogout} />

      <main className="main-content">
        <header className="top-header">
          <h1>Welcome back, {username}! 👋</h1>
          <p className="date">
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </header>

        <div className="stats-grid">
          <StatsCard
            title="Total XP"
            value={progress.xp}
            icon="✨"
            color="#ec4899"
          />
          <StatsCard
            title="Current Streak"
            value={`${progress.streak} days`}
            icon="🔥"
            color="#f59e0b"
          />
          <StatsCard
            title="Completed Goals"
            value={completedGoals}
            icon="✅"
            color="#10b981"
          />
          <StatsCard
            title="Pending Goals"
            value={pendingGoals}
            icon="⏳"
            color="#6366f1"
          />
        </div>

        <div className="dashboard-bottom-section">
          <ProgressDashboard progress={progress} />
        </div>
      </main>
    </div>
  );
}

export default DashboardPage;
