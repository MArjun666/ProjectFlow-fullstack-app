import React from 'react';
import { Link } from 'react-router-dom';
import './ProjectCard.css';

const ProjectCard = ({ project, color }) => {
    
    const cardStyle = {
        backgroundColor: `rgba(${color}, 0.1)`,
        borderLeft: `3px solid rgb(${color})`
    };

    const progressStyle = {
        width: `${project.overallCompletionPercentage || 0}%`,
        backgroundColor: `rgb(${color})`
    };
    
    const daysLeft = project.endDate 
        ? Math.ceil((new Date(project.endDate) - new Date()) / (1000 * 60 * 60 * 24)) 
        : null;

    return (
        <Link to={`/projects/${project._id}`} className="project-card-link">
            <div className="project-card" style={cardStyle}>
                <header className="card-header">
                    <span className="project-date">
                        {project.createdAt 
                            ? new Date(project.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })
                            : 'No Date'}
                    </span>
                    <span className="options-icon">...</span>
                </header>
                
                <main className="card-body">
                    <h4 className="project-card-title">{project.name}</h4>
                    <p className="project-card-subtitle">{project.description?.substring(0, 50)}...</p>
                    
                    <div className="progress-section">
                        <span className="progress-label">Progress</span>
                        <div className="progress-bar-background">
                            <div className="progress-bar-foreground" style={progressStyle}></div>
                        </div>
                    </div>
                </main>
                
                <footer className="card-footer">
                    <div className="card-avatars">
                        {project.teamMembers.slice(0, 2).map(member => (
                            <img 
                                key={member._id} 
                                src={member.avatar || `https://i.pravatar.cc/24?u=${member.email}`} 
                                alt={member.name} 
                                title={member.name} 
                            />
                        ))}
                        {project.teamMemberCount > 2 && (
                            <span className="avatar-plus">+{project.teamMemberCount - 2}</span>
                        )}
                    </div>
                    
                    {daysLeft !== null && daysLeft >= 0 && (
                        <div className="days-left-tag" style={{ color: `rgb(${color})`, backgroundColor: `rgba(${color}, 0.15)` }}>
                            {daysLeft} {daysLeft === 1 ? 'Day' : 'Days'} Left
                        </div>
                    )}
                </footer>
            </div>
        </Link>
    );
};

export default ProjectCard;