import React from "react";
import axios from "axios";

function GoalList({ goals, onGoalUpdated, onGoalDeleted }) {
  const token = localStorage.getItem("token");

  const markCompleted = async (id) => {
    await axios.put(
      `${process.env.REACT_APP_API_URL}/api/goals/${id}`,
      { status: "completed" },
      { headers: { Authorization: `Bearer ${token}` } },
    );
    onGoalUpdated();
  };

  const deleteGoal = async (id) => {
    await axios.delete(`${process.env.REACT_APP_API_URL}/api/goals/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    onGoalDeleted();
  };

  const getDifficultyBadge = (difficulty) => {
    const map = {
      easy: { label: "Easy", className: "badge-easy" },
      medium: { label: "Medium", className: "badge-medium" },
      hard: { label: "Hard", className: "badge-hard" },
    };
    const d = map[difficulty] || map.easy;
    return <span className={`difficulty-badge ${d.className}`}>{d.label}</span>;
  };

  if (goals.length === 0) {
    return (
      <div className="goal-list">
        <div className="empty-state">
          <span className="empty-icon">📝</span>
          <p>No goals yet. Add your first goal to get started!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="goal-list">
      {goals.map((goal) => (
        <div
          key={goal._id}
          className={`goal-card ${goal.status === "completed" ? "goal-completed" : ""}`}
        >
          <div className="goal-info">
            <div className="goal-title-row">
              <span className="goal-title">{goal.title}</span>
              {getDifficultyBadge(goal.difficulty)}
              {goal.status === "completed" && (
                <span className="status-badge">✓ Done</span>
              )}
            </div>
            {goal.description && (
              <p className="goal-description">{goal.description}</p>
            )}
          </div>
          <div className="goal-actions">
            {goal.status === "pending" && (
              <button
                className="btn-complete"
                onClick={() => markCompleted(goal._id)}
              >
                ✓ Complete
              </button>
            )}
            <button className="btn-delete" onClick={() => deleteGoal(goal._id)}>
              🗑 Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default GoalList;
