import React from 'react';
import './StatsCard.css';

const StatsCard = ({ count, title, color }) => {
    return (
        <div className="stats-card">
            <span className="stats-count" style={{ color: color }}>{count}</span>
            <span className="stats-title">{title}</span>
        </div>
    );
};

export default StatsCard;