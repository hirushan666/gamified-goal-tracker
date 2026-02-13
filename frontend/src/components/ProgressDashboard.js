import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

function ProgressDashboard({ progress }) {
  const { xp, streak, badges } = progress;

  const data = {
    labels: ["XP Earned", "Day Streak"],
    datasets: [
      {
        label: "Your Progress",
        data: [xp, streak],
        backgroundColor: ["#4F46E5", "#818CF8"],
        borderRadius: 6,
        borderSkipped: false,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: { display: false },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: "#64748b", font: { weight: 600 } },
      },
      y: {
        beginAtZero: true,
        grid: { color: "#f1f5f9" },
        ticks: { color: "#94a3b8" },
      },
    },
  };

  return (
    <div className="progress-dashboard">
      <h3>📊 Progress Overview</h3>
      <div className="chart-container">
        <Bar data={data} options={options} />
      </div>

      <div className="badges-section">
        <h4>🏆 Badges Earned</h4>
        {badges.length > 0 ? (
          <div className="badges-list">
            {badges.map((badge) => (
              <span key={badge} className="badge-pill">
                {badge}
              </span>
            ))}
          </div>
        ) : (
          <p className="no-badges">Complete goals to earn your first badge!</p>
        )}
      </div>
    </div>
  );
}

export default ProgressDashboard;
