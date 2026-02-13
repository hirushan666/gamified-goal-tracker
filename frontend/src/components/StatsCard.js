import React from "react";

function StatsCard({ title, value, icon, color }) {
  return (
    <div className="stats-card" style={{ borderTopColor: color }}>
      <div
        className="stats-icon"
        style={{ backgroundColor: `${color}20`, color: color }}
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
