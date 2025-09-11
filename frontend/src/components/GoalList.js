import React from 'react';
import axios from 'axios';

function GoalList({ goals, onGoalUpdated, onGoalDeleted }) {
  const token = localStorage.getItem('token');

  const markCompleted = async (id) => {
    await axios.put(`${process.env.REACT_APP_API_URL}/api/goals/${id}`, { status: 'completed' }, {
      headers: { Authorization: `Bearer ${token}` },
    });
    onGoalUpdated();
  };

  const deleteGoal = async (id) => {
    await axios.delete(`${process.env.REACT_APP_API_URL}/api/goals/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    onGoalDeleted();
  };

  return (
    <div className="goal-list">
      <h3>Your Goals</h3>
      <ul>
        {goals.map(goal => (
          <li key={goal._id} className={goal.status === 'completed' ? 'completed' : ''}>
            <span>{goal.title} ({goal.difficulty})</span>
            <span>{goal.description}</span>
            {goal.status === 'pending' && (
              <button onClick={() => markCompleted(goal._id)}>Mark Completed</button>
            )}
            <button onClick={() => deleteGoal(goal._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default GoalList;
