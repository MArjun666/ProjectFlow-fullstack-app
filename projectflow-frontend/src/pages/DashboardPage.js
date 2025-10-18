import React from 'react';
// --- All necessary imports from libraries and local components ---
import { useAuth } from '../context/AuthContext';
import DashboardHeader from '../components/Dashboard/DashboardHeader';
import StatsCard from '../components/Dashboard/StatsCard';
import ProjectCard from '../components/Dashboard/ProjectCard';
import OverallProgress from '../components/Dashboard/OverallProgress';
import './DashboardPage.css';

// A predefined color palette to cycle through for the project cards, making the UI more vibrant.
const projectCardColors = [
    '58, 141, 255', // Primary Blue
    '196, 95, 255', // Secondary Purple
    '51, 255, 181', // Success Green/Teal
    '255, 214, 10',  // Warning Yellow
];

/**
 * The main Dashboard component.
 * This component acts as the central hub for the user, displaying an overview of their projects and progress.
 * It is a "presentational" component that gets all its data directly from the central AuthContext.
 */
const DashboardPage = () => {
    // --- State Consumption ---
    // The component consumes the master list of 'projects', its loading status, and any errors
    // directly from the central AuthContext. This is the critical architectural decision that
    // solves race conditions and ensures data is always synchronized across the entire application.
    const { projects, projectsLoading, error } = useAuth();

    // --- Derived Data Calculations ---
    // All statistics are calculated directly from the centrally managed 'projects' state.
    // If the 'projects' array in the context updates, these values will automatically recalculate.
    const inProgress = projects.filter(p => p.status === 'In Progress').length;
    const completed = projects.filter(p => p.status === 'Completed').length;
    const upcoming = projects.filter(p => p.status === 'Not Started').length;
    const total = projects.length;

    const totalTasks = projects.reduce((sum, p) => sum + (p.taskCount || 0), 0);
    const completedTasks = projects.reduce((sum, p) => sum + (p.completedTaskCount || 0), 0);
    const percentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
    
    // --- Render Logic ---
    // The component renders its UI based on the three possible states from the context:
    // 1. Loading: Shows a simple text indicator.
    // 2. Error: Shows a formatted error message.
    // 3. Success: Shows the full dashboard layout.
    
    return (
        <div className="dashboard-container-dark">
            <DashboardHeader />
            <main className="dashboard-main-content-dark">
                <section className="projects-section">
                    <div className="projects-header">
                        <h2>Projects</h2>
                        <span>{new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
                    </div>
                    
                    <div className="stats-grid">
                        <StatsCard count={inProgress} title="In Progress" color="var(--primary-accent)" />
                        <StatsCard count={completed} title="Completed" color="var(--success-accent)" />
                        <StatsCard count={upcoming} title="Upcoming" color="var(--warning-accent)" />
                        <StatsCard count={total} title="Total Projects" color="var(--text-secondary)" />
                    </div>

                    {/* This logic block robustly handles all possible UI states from the context */}
                    {projectsLoading && <p>Loading projects...</p>}
                    
                    {error && <p className="error-message">{error}</p>}
                    
                    {!projectsLoading && !error && projects.length === 0 && (
                        <div className="glass-card" style={{padding: '2rem', textAlign: 'center'}}>
                            <p>No projects found. Try creating one!</p>
                        </div>
                    )}

                    {!projectsLoading && !error && projects.length > 0 && (
                        <div className="project-cards-grid">
                            {projects.map((project, index) => (
                                <ProjectCard 
                                    key={project._id} 
                                    project={project} 
                                    color={projectCardColors[index % projectCardColors.length]} 
                                />
                            ))}
                        </div>
                    )}
                </section>
                
                {/* The progress section is also hidden during loading, errors, or if there are no projects */}
                {!projectsLoading && !error && projects.length > 0 && (
                     <section className="progress-tracking-section">
                        <OverallProgress 
                            percentage={percentage}
                            completed={completedTasks}
                            total={totalTasks}
                        />
                     </section>
                )}
            </main>
        </div>
    );
};

export default DashboardPage;