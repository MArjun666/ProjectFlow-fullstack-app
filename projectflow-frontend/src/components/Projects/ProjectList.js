import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import ProjectItem from './ProjectItem';

/**
 * ProjectList is now a "presentational" component. It no longer fetches its own data.
 * Instead, it consumes the master list of projects, loading status, and any errors
 * directly from the central AuthContext.
 *
 * This is a critical architectural improvement that ensures:
 * 1.  **Single Source of Truth:** The project list is fetched only once when the user logs in.
 * 2.  **Efficiency:** Prevents multiple, redundant API calls from different components.
 * 3.  **Data Consistency:** Any update to a project will be reflected everywhere automatically.
 */
const ProjectList = () => {
  // Consume the centralized state from AuthContext.
  // Note that we no longer need useState or useEffect in this component.
  const { projects, projectsLoading, error, user } = useAuth();

  // --- UI STATE 1: LOADING ---
  // Display a clear loading message while the context is fetching the data.
  if (projectsLoading) {
    return <p style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>Loading projects...</p>;
  }

  // --- UI STATE 2: ERROR ---
  // If an error occurred during the fetch in the context, display it.
  if (error) {
    return <div className="error-message">{error}</div>;
  }

  // --- UI STATE 3: NO PROJECTS ---
  // If the API call was successful but returned no projects, show a helpful message.
  // The UI is enhanced to use a "glass-card" for consistency.
  if (projects.length === 0) {
    return (
      <div className="glass-card" style={{ textAlign: 'center', padding: '2rem' }}>
        <p style={{ color: 'var(--text-primary)', fontSize: '1.1rem', margin: 0 }}>
            You are not part of any projects yet.
        </p>
        {/* The link to create a project is only shown to authorized users. */}
        {(user && (user.role === 'projectManager' || user.role === 'admin')) && (
          <p style={{ color: 'var(--text-secondary)', marginTop: '1rem' }}>
            Why not <Link to="/projects/create" style={{ color: 'var(--primary-accent)', fontWeight: 'bold' }}>create one</Link>?
          </p>
        )}
      </div>
    );
  }

  // --- UI STATE 4: SUCCESS ---
  // If projects exist in the context, map over them and render a ProjectItem for each one.
  return (
    <div style={{ display: 'grid', gap: '1.5rem' }}>
      {projects.map(project => (
        <ProjectItem key={project._id} project={project} />
      ))}
    </div>
  );
};

export default ProjectList;