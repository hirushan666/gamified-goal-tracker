import React from "react";

function StatsCard({ title, value, icon, color }) {
  return (
    <div className="stats-card" style={{ "--card-accent": color }}>
      <div
        className="stats-card-glow"
        style={{ background: `${color}15` }}
      ></div>
      <div
        className="stats-icon"
        style={{ backgroundColor: `${color}18`, color: color }}
      >
        {icon}
      </div>
      <div className="stats-content">
        <h3>{value}</h3>
        <p>{title}</p>
      </div>
    </div>
  );
}

export default StatsCard;
