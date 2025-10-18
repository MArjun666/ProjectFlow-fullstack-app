import React from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import './OverallProgress.css';

const OverallProgress = ({ percentage, completed, total }) => {
    return (
        <div className="progress-meter-card glass-card">
            <h3 className="progress-meter-title">Overall Task Progress</h3>
            <div className="progress-meter-content">
                <div className="progress-meter-gauge">
                    <CircularProgressbar
                        value={percentage}
                        text={`${percentage}%`}
                        circleRatio={0.5} // Creates the semi-circle
                        styles={buildStyles({
                            rotation: 0.75, // Rotates start to bottom-left
                            pathColor: `var(--success-accent)`,
                            textColor: 'var(--text-primary)',
                            trailColor: 'var(--glass-border)',
                            strokeLinecap: 'butt',
                            pathTransitionDuration: 0.5,
                        })}
                    />
                </div>
                <div className="progress-meter-summary">
                    <div className="summary-item">
                        <span className="summary-count completed">{completed}</span>
                        <span className="summary-label">Tasks Completed</span>
                    </div>
                    <div className="summary-item">
                        <span className="summary-count">{total}</span>
                        <span className="summary-label">Total Tasks</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OverallProgress;