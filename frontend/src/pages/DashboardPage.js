import React, { useEffect, useState } from "react";
import axios from "axios";
import GoalList from "../components/GoalList";
import AddGoalForm from "../components/AddGoalForm";
import ProgressDashboard from "../components/ProgressDashboard";
import Sidebar from "../components/Sidebar";
import StatsCard from "../components/StatsCard";

function DashboardPage() {
  const [goals, setGoals] = useState([]);
  const [progress, setProgress] = useState({ xp: 0, streak: 0, badges: [] });

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
    window.location.href = "/";
  };

  useEffect(() => {
    fetchGoals();
    fetchProgress();
  }, []);

  // Calculate some quick stats for the cards
  const completedGoals = goals.filter((g) => g.status === "completed").length;
  const totalGoals = goals.length;
  const pendingGoals = totalGoals - completedGoals;

  return (
    <div className="app-layout">
      <Sidebar onLogout={handleLogout} />

      <main className="main-content">
        <header className="top-header">
          <h1>Welcome back!</h1>
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
            color="#ec4899" /* Pink */
          />
          <StatsCard
            title="Current Streak"
            value={`${progress.streak} days`}
            icon="🔥"
            color="#f59e0b" /* Amber */
          />
          <StatsCard
            title="Completed Goals"
            value={completedGoals}
            icon="✅"
            color="#10b981" /* Emerald */
          />
          <StatsCard
            title="Pending Goals"
            value={pendingGoals}
            icon="⏳"
            color="#6366f1" /* Indigo */
          />
        </div>

        <div className="dashboard-grid">
          <div className="left-column">
            <div className="card">
              <div className="card-header">
                <h2>Your Goals</h2>
                {/* Could add a filter/sort here later */}
              </div>
              <GoalList
                goals={goals}
                onGoalUpdated={fetchGoals}
                onGoalDeleted={fetchGoals}
              />
            </div>
          </div>

          <div className="right-column">
            <div className="card">
              <h2>Add New Goal</h2>
              <AddGoalForm onGoalAdded={fetchGoals} />
            </div>

            <div className="card">
              <ProgressDashboard progress={progress} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default DashboardPage;
//dashboard
