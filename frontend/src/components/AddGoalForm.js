import React, { useState } from "react";
import axios from "axios";

function AddGoalForm({ onGoalAdded }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [difficulty, setDifficulty] = useState("easy");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${process.env.REACT_APP_API_URL}/api/goals`,
        { title, description, difficulty },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      setTitle("");
      setDescription("");
      setDifficulty("easy");
      onGoalAdded();
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="add-goal-form" onSubmit={handleSubmit}>
      <div className="input-group">
        <label htmlFor="goal-title">Goal Title</label>
        <input
          id="goal-title"
          type="text"
          placeholder="e.g. Read 30 minutes daily"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>

      <div className="input-group">
        <label htmlFor="goal-desc">Description</label>
        <input
          id="goal-desc"
          type="text"
          placeholder="Optional details about your goal"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div className="input-group">
        <label htmlFor="goal-diff">Difficulty</label>
        <select
          id="goal-diff"
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
        >
          <option value="easy">🟢 Easy</option>
          <option value="medium">🟡 Medium</option>
          <option value="hard">🔴 Hard</option>
        </select>
      </div>

      <button type="submit" className="add-goal-btn" disabled={loading}>
        {loading ? <span className="spinner"></span> : "+ Add Goal"}
      </button>
    </form>
  );
}

export default AddGoalForm;
