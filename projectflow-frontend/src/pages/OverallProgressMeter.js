import React from 'react';
import './OverallProgressMeter.css';

const OverallProgressMeter = ({ percentage, completedTasks, totalTasks }) => {
    const radius = 50;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percentage / 100) * circumference;

    return (
        <div className="progress-meter-container">
            <svg className="progress-meter-svg" viewBox="0 0 120 120">
                <circle
                    className="meter-track"
                    cx="60"
                    cy="60"
                    r={radius}
                />
                <circle
                    className="meter-progress"
                    cx="60"
                    cy="60"
                    r={radius}
                    style={{
                        strokeDasharray: circumference,
                        strokeDashoffset: offset
                    }}
                />
                <text x="60" y="55" className="meter-percent">
                    {percentage}%
                </text>
                <text x="60" y="80" className="meter-tasks">
                    <tspan className="meter-tasks-completed">{completedTasks}</tspan>
                    <tspan className="meter-tasks-divider"> / </tspan>
                    <tspan className="meter-tasks-total">{totalTasks}</tspan>
                </text>
            </svg>
            <span className="meter-label">Overall Progress</span>
        </div>
    );
};

export default OverallProgressMeter;