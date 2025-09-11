import React, { useState } from 'react';
import axios from 'axios';

function AddGoalForm({ onGoalAdded }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [difficulty, setDifficulty] = useState('easy');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    await axios.post(`${process.env.REACT_APP_API_URL}/api/goals`, { title, description, difficulty }, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setTitle('');
    setDescription('');
    setDifficulty('easy');
    onGoalAdded();
  };

  return (
    <form className="add-goal-form" onSubmit={handleSubmit}>
      <input type="text" placeholder="Goal Title" value={title} onChange={e => setTitle(e.target.value)} required />
      <input type="text" placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} />
      <select value={difficulty} onChange={e => setDifficulty(e.target.value)}>
        <option value="easy">Easy</option>
        <option value="medium">Medium</option>
        <option value="hard">Hard</option>
      </select>
      <button type="submit">Add Goal</button>
    </form>
  );
}

export default AddGoalForm;
