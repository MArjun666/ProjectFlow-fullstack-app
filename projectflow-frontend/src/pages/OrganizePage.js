import React from 'react';
import { Link } from 'react-router-dom';
import ProjectList from '../components/Projects/ProjectList';
import { useAuth } from '../context/AuthContext';
import './PageStyles.css';

const OrganizePage = () => {
  const { user } = useAuth();
  const canCreateProjects = user && (user.role === 'projectManager' || user.role === 'admin');

  return (
    <div className="container page-container">
      <div className="page-header">
        <h1 className="page-title">Organize Projects</h1>
        {canCreateProjects && (
          <Link to="/projects/create" className="button-like primary">
            Create New Project
          </Link>
        )}
      </div>
      
      <section className="page-section">
        <p className="section-intro">
          This is your central hub to view all projects you are a part of. Click on a project to see its details.
        </p>
        {/* CRITICAL FIX: ProjectList now reliably gets its data from context, handling all states internally. */}
        <ProjectList />
      </section>
    </div>
  );
};

export default OrganizePage;