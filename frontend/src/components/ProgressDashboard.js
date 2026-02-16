import React from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

function ProgressDashboard({ progress }) {
  const { xp, streak, badges } = progress;

  const data = {
    labels: ["XP Earned", "Day Streak"],
    datasets: [
      {
        data: [xp || 0, streak || 0],
        backgroundColor: ["rgba(99, 102, 241, 0.9)", "rgba(245, 158, 11, 0.9)"],
        hoverBackgroundColor: [
          "rgba(99, 102, 241, 1)",
          "rgba(245, 158, 11, 1)",
        ],
        borderWidth: 0,
        cutout: "72%",
        borderRadius: 6,
        spacing: 4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "#1e293b",
        titleColor: "#f8fafc",
        bodyColor: "#cbd5e1",
        padding: 12,
        cornerRadius: 10,
        titleFont: { size: 13, weight: "600" },
        bodyFont: { size: 12 },
        displayColors: true,
        boxPadding: 4,
      },
    },
    animation: {
      duration: 1000,
      easing: "easeOutQuart",
    },
  };

  const badgeIcons = {
    "100 XP": "💎",
    "7 Day Streak": "🔥",
    "10 Goals Completed": "🏅",
  };

  return (
    <div className="progress-dashboard-grid">
      {/* Left: Chart Card */}
      <div className="progress-chart-card card">
        <h3>📊 Progress Overview</h3>
        <div className="doughnut-wrapper">
          <div className="doughnut-container">
            <Doughnut data={data} options={options} />
            <div className="doughnut-center">
              <span className="doughnut-center-value">{xp}</span>
              <span className="doughnut-center-label">Total XP</span>
            </div>
          </div>
          <div className="chart-legend">
            <div className="legend-item">
              <span
                className="legend-dot"
                style={{ background: "rgba(99, 102, 241, 0.9)" }}
              ></span>
              <span className="legend-label">XP Earned</span>
              <span className="legend-value">{xp}</span>
            </div>
            <div className="legend-item">
              <span
                className="legend-dot"
                style={{ background: "rgba(245, 158, 11, 0.9)" }}
              ></span>
              <span className="legend-label">Day Streak</span>
              <span className="legend-value">{streak}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right: Badges Card */}
      <div className="progress-badges-card card">
        <h3>🏆 Badges Earned</h3>
        {badges.length > 0 ? (
          <div className="badges-grid">
            {badges.map((badge) => (
              <div key={badge} className="badge-card">
                <span className="badge-card-icon">
                  {badgeIcons[badge] || "🏅"}
                </span>
                <span className="badge-card-label">{badge}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-badges-state">
            <span className="no-badges-icon">🎖️</span>
            <p className="no-badges">
              Complete goals to earn your first badge!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProgressDashboard;
