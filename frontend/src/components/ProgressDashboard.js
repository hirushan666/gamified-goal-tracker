
import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function ProgressDashboard({ progress }) {
  const { xp, streak, badges } = progress;
  const data = {
    labels: ['XP', 'Streak'],
    datasets: [
      {
        label: 'Progress',
        data: [xp, streak],
        backgroundColor: ['#4caf50', '#2196f3'],
      },
    ],
  };
  return (
    <div className="progress-dashboard">
      <h3>Progress</h3>
      <div className="progress-bars">
        <Bar data={data} />
      </div>
      <div className="badges">
        <h4>Badges</h4>
        <ul>
          {badges.map(badge => <li key={badge}>{badge}</li>)}
        </ul>
      </div>
    </div>
  );
}

export default ProgressDashboard;
