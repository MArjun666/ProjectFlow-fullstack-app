import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import './PageStyles.css'; // Shared styles

const CollaboratePage = () => {
  const { user } = useAuth();

  return (
    <div className="container page-container">
      <h1 className="page-title">Collaborate with Your Team</h1>
      
      <section className="page-section glass-card">
        <h2 className="section-title">Team Synergy</h2>
        <p className="section-intro">
          Work seamlessly with your team members and project managers. ProjectFlow helps you 
          manage shared projects, communicate updates, and coordinate efforts.
        </p>
        {user && (
          <div className="collaboration-links">
            <p>You can manage team members on each project's detail page. See all your projects on the <Link to="/organize">Organize</Link> page.</p>
            {user.role === 'teamMember' && <p>Your assigned tasks, where you collaborate, are on the <Link to="/my-tasks">My Tasks</Link> page.</p>}
          </div>
        )}
      </section>

      <section className="page-section glass-card">
        <h2 className="section-title">Collaboration Features in Development</h2>
        <ul>
          <li>Real-time notifications for task comments and updates.</li>
          <li>Integrated team chat boards per project.</li>
          <li>Shared file repositories for project assets.</li>
          <li>Guest access for clients or external stakeholders.</li>
        </ul>
      </section>
    </div>
  );
};

export default CollaboratePage;