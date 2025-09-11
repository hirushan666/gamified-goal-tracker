import React, { useEffect, useState } from 'react';
import axios from 'axios';
import GoalList from '../components/GoalList';
import AddGoalForm from '../components/AddGoalForm';
import ProgressDashboard from '../components/ProgressDashboard';


function DashboardPage() {
  const [goals, setGoals] = useState([]);
  const [progress, setProgress] = useState({ xp: 0, streak: 0, badges: [] });

  const fetchGoals = async () => {
    const token = localStorage.getItem('token');
    const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/goals`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setGoals(res.data);
  };

  const fetchProgress = async () => {
    const token = localStorage.getItem('token');
    const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/progress`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setProgress(res.data);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/';
  };

  useEffect(() => {
    fetchGoals();
    fetchProgress();
  }, []);

  return (
    <div className="dashboard-container" style={{ position: 'relative' }}>
      <button
        onClick={handleLogout}
        style={{
          position: 'absolute',
          top: 12,
          right: 12,
          padding: '0.1rem 0.4rem',
          fontSize: '0.7rem',
          background: '#f44336',
          color: '#fff',
          border: 'none',
          borderRadius: '2px',
          cursor: 'pointer',
          minWidth: 'auto',
          zIndex: 10,
        }}
        title="Logout"
      >
        Logout
      </button>
      <h2 style={{ textAlign: 'center' }}>Dashboard</h2>
      <ProgressDashboard progress={progress} />
      <AddGoalForm onGoalAdded={fetchGoals} />
      <GoalList goals={goals} onGoalUpdated={fetchGoals} onGoalDeleted={fetchGoals} />
    </div>
  );
}

export default DashboardPage;
