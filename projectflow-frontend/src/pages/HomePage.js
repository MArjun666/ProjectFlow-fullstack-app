import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './HomePage.css';

/**
 * The landing page of the application.
 * It presents a hero section with a call-to-action that changes based on user authentication status.
 */
const HomePage = () => {
    const { user } = useAuth();
    
    return (
        <div className="homepage-container">
            {/* The ::before and ::after pseudo-elements in CSS will create the background aurora effect */}
            <div className="hero-section">
                <h1 className="hero-title">
                    Flow, Redefined.
                    <br />
                    <span className="gradient-text">Achieve Project Clarity.</span>
                </h1>
                <p className="hero-subtitle">
                    ProjectFlow is the command center for high-performing teams.
                    Organize tasks, track progress, and collaborate seamlessly in a modern,
                    intuitive workspace.
                </p>
                <div className="hero-cta-buttons">
                    {user ? (
                        // If the user is logged in, show a single button to the dashboard.
                        <Link to="/dashboard" className="button-like primary large-button">
                            Go to Dashboard
                        </Link>
                    ) : (
                        // If the user is not logged in, show registration and login buttons.
                        <>
                            <Link to="/register" className="button-like primary large-button">
                                Get Started Free
                            </Link>
                            <Link to="/login" className="button-like secondary large-button">
                                I have an account
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default HomePage;