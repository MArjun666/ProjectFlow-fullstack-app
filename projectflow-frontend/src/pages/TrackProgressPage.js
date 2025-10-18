import React, { useState, memo, useEffect } from 'react';
import { useAuth } from '../context/AuthContext'; 
import projectService from '../services/projectService';
import { Link } from 'react-router-dom';
import './PageStyles.css';
import './TrackProgressPage.css';

// Memoized component for the expanded details section.
const ExpandedProjectProgress = memo(({ projectId }) => {
  const [details, setDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProjectDetails = async () => {
      if (!projectId) return;
      setIsLoading(true);
      setError('');
      try {
        const response = await projectService.getProjectById(projectId);
        setDetails(response);
      } catch (err) {
        setError(err.message || 'Error fetching project details.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchProjectDetails();
  }, [projectId]);

  if (isLoading) return <p className="loading-details-message">Loading details...</p>;
  if (error) return <p className="error-message">{error}</p>;
  if (!details) return null;
  
  const allMembers = [
      ...(details.projectManager ? [{...details.projectManager, isPM: true}] : []), 
      ...details.teamMembers
  ];

  const memberProgressData = allMembers.map(member => {
    const assignedTasks = (details.tasks || []).filter(task => task.assignedTo?._id === member._id);
    const completedTasks = assignedTasks.filter(task => task.status === 'Completed');
    const taskCount = assignedTasks.length;
    const completedTaskCount = completedTasks.length;
    const completionPercentage = taskCount > 0 ? Math.round((completedTaskCount / taskCount) * 100) : 0;
    
    return {
      id: member._id, name: member.name, email: member.email, avatar: member.avatar,
      role: member.isPM ? 'Project Manager' : member.role, taskCount,
      completedTaskCount, completionPercentage
    };
  });

  return (
    <div className="expanded-project-details glass-card">
      <h4>Team Progress for "{details.name}"</h4>
      {memberProgressData.length > 0 ? (
        memberProgressData.map(member => <TeamMemberProgress key={member.id} member={member} />)
      ) : (
        <p>No team members are assigned to tasks in this project.</p>
      )}
      <Link to={`/projects/${details._id}`} className="button-like secondary" style={{marginTop: '15px'}}>
        Go to Full Project Page
      </Link>
    </div>
  );
});

// Memoized component for displaying a single team member's progress.
const TeamMemberProgress = memo(({ member }) => (
  <div className="team-member-progress-item">
    <div className="member-info">
      <img src={member.avatar || `https://i.pravatar.cc/28?u=${member.email}`} alt={member.name} className="member-avatar-small" />
      <span className="member-name">{member.name}</span>
      <span className="member-role-badge">{member.role}</span>
    </div>
    <p className="member-task-count">
      Tasks: {member.completedTaskCount} / {member.taskCount} completed
    </p>
    <div className="progress-bar-container small-progress-bar-container">
      <div className="progress-bar small-progress-bar" style={{ width: `${member.completionPercentage}%` }} title={`${member.completionPercentage}% complete`}>
        {member.completionPercentage > 15 && `${member.completionPercentage}%`}
      </div>
    </div>
  </div>
));

const TrackProgressPage = () => {
  const { projects, projectsLoading } = useAuth();
  const [expandedProjectId, setExpandedProjectId] = useState(null);

  const handleProjectClick = (projectId) => {
    setExpandedProjectId(prevId => (prevId === projectId ? null : projectId));
  };

  if (projectsLoading) {
    return <div className="container" style={{ textAlign: 'center', padding: '3rem' }}>Loading progress data...</div>;
  }

  return (
    <div className="container page-container track-progress-page">
      <h1 className="page-title">Track Project Progress</h1>
      
      <section className="page-section glass-card intro-section">
        <h2 className="section-title">Monitor Status and Completion</h2>
        <p className="section-intro">
          View the overall progress for each project. Click on a project to expand its detailed team member progress breakdown.
        </p>
      </section>

      <div className="project-progress-grid">
        {projects.length === 0 ? (
          <div className="glass-card" style={{ padding: '2rem', textAlign: 'center' }}>
            <p>No projects found to track.</p>
          </div>
        ) : (
          projects.map(project => (
            <React.Fragment key={project._id}>
              <div 
                className="project-progress-item glass-card"
                onClick={() => handleProjectClick(project._id)}
                role="button" tabIndex={0}
                onKeyPress={(e) => (e.key === 'Enter' || e.key === ' ') && handleProjectClick(project._id)}
              >
                <div className="progress-item-header">
                  <h3>{project.name}</h3>
                  <span className={`status-badge status-${project.status.toLowerCase().replace(/_/g, '-')}`}>
                      {project.status.replace(/_/g, ' ')}
                  </span>
                </div>
                <p className="project-description-tp">{project.description.substring(0,120)}...</p>
                
                <div className="overall-progress-section">
                  <span className="progress-label">Overall Progress</span>
                  <div className="progress-bar-container">
                    <div className="progress-bar" style={{ width: `${project.overallCompletionPercentage}%` }}>
                      {project.overallCompletionPercentage > 10 && `${project.overallCompletionPercentage}%`}
                    </div>
                  </div>
                  <p className="task-count-summary">
                      Tasks: {project.completedTaskCount} / {project.taskCount} completed
                  </p>
                </div>

                <div className="expand-indicator">
                  {expandedProjectId === project._id ? 'Collapse Details [-]' : 'View Team Details [+]'}
                </div>
              </div>
              {expandedProjectId === project._id && (
                <div className="expanded-details-container">
                  <ExpandedProjectProgress projectId={project._id} />
                </div>
              )}
            </React.Fragment>
          ))
        )}
      </div>
    </div>
  );
};

export default TrackProgressPage;