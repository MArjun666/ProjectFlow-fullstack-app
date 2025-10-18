import React from 'react';
import { Link } from 'react-router-dom';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import './ProjectItem.css';

const getStatusColor = (status) => {
    switch (status) {
        case 'Completed': return 'var(--success-accent)';
        case 'On Hold': return 'var(--warning-accent)';
        case 'Cancelled': return 'var(--danger-accent)';
        default: return 'var(--primary-accent)';
    }
};

const ProjectItem = ({ project }) => {
    const percentage = project.overallCompletionPercentage || 0;
    const statusColor = getStatusColor(project.status);

    return (
        <div className="aurora-project-card glass-card">
            <div className="card-content">
                <Link to={`/projects/${project._id}`} className="project-title-link">
                    <h3>{project.name}</h3>
                </Link>
                <p className="project-status" style={{ color: statusColor }}>{project.status.replace('_', ' ')}</p>
                <p className="project-description">{project.description?.substring(0, 100)}...</p>
                <div className="project-meta">
                    <div className="team-avatars">
                        {project.teamMembers.slice(0, 3).map(member => (
                            <img key={member._id} src={member.avatar || `https://i.pravatar.cc/32?u=${member.email}`} alt={member.name} title={member.name} />
                        ))}
                        {project.teamMemberCount > 3 && <span className="avatar-plus">+{project.teamMemberCount - 3}</span>}
                    </div>
                    <span className="task-count">{project.taskCount} Tasks</span>
                </div>
            </div>
            <div className="progress-container">
                <CircularProgressbar
                    value={percentage}
                    text={`${percentage}%`}
                    styles={buildStyles({
                        rotation: 0.25,
                        strokeLinecap: 'round',
                        textSize: '24px',
                        pathTransitionDuration: 0.5,
                        pathColor: statusColor,
                        textColor: 'var(--text-primary)',
                        trailColor: 'var(--glass-border)',
                    })}
                />
            </div>
        </div>
    );
};

export default ProjectItem;