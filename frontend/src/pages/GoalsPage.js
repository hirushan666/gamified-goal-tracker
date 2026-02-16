import React, { useEffect, useState } from "react";
import axios from "axios";
import GoalList from "../components/GoalList";
import AddGoalForm from "../components/AddGoalForm";
import Sidebar from "../components/Sidebar";

function GoalsPage() {
  const [goals, setGoals] = useState([]);
  const [showForm, setShowForm] = useState(false);

  const fetchGoals = async () => {
    const token = localStorage.getItem("token");
    const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/goals`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setGoals(res.data);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    window.location.href = "/";
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  const completedGoals = goals.filter((g) => g.status === "completed").length;
  const totalGoals = goals.length;
  const pendingGoals = totalGoals - completedGoals;
  const completionRate =
    totalGoals > 0 ? Math.round((completedGoals / totalGoals) * 100) : 0;

  return (
    <div className="app-layout">
      <Sidebar onLogout={handleLogout} />

      <main className="main-content">
        <header className="top-header goals-header">
          <div className="goals-header-left">
            <h1>My Goals</h1>
            <p className="date">Track and manage all your goals in one place</p>
          </div>
          <button
            className="add-goal-toggle-btn"
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? "✕ Cancel" : "＋ New Goal"}
          </button>
        </header>

        {/* Quick Stats Bar */}
        <div className="goals-stats-bar">
          <div className="goals-stat-chip">
            <span className="goals-stat-label">Total</span>
            <span className="goals-stat-value">{totalGoals}</span>
          </div>
          <div className="goals-stat-chip goals-stat-completed">
            <span className="goals-stat-label">Completed</span>
            <span className="goals-stat-value">{completedGoals}</span>
          </div>
          <div className="goals-stat-chip goals-stat-pending">
            <span className="goals-stat-label">Pending</span>
            <span className="goals-stat-value">{pendingGoals}</span>
          </div>
          <div className="goals-stat-chip goals-stat-rate">
            <span className="goals-stat-label">Completion</span>
            <span className="goals-stat-value">{completionRate}%</span>
          </div>
        </div>

        {/* Expandable Add Goal Form */}
        <div
          className={`goals-form-panel ${showForm ? "goals-form-open" : ""}`}
        >
          <div className="card goals-form-card">
            <h2>🚀 Create a New Goal</h2>
            <AddGoalForm
              onGoalAdded={() => {
                fetchGoals();
                setShowForm(false);
              }}
            />
          </div>
        </div>

        {/* Goals List */}
        <div className="card goals-list-card">
          <div className="card-header">
            <h2>Your Goals</h2>
          </div>
          <GoalList
            goals={goals}
            onGoalUpdated={fetchGoals}
            onGoalDeleted={fetchGoals}
          />
        </div>
      </main>
    </div>
  );
}

export default GoalsPage;
