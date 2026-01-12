import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import NotificationDropdown from './NotificationDropdown';
import './DashboardHeader.css';

const AddIcon = () => <span className="icon" style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>+</span>;
const NotificationIcon = () => <span className="icon">🔔</span>;

/**
 * A helper function to format the role string for display.
 * e.g., "projectManager" becomes "Project Manager"
 * @param {string} role The role string from the user object.
 * @returns {string} A formatted, human-readable role.
 */
const formatRole = (role) => {
    if (!role) return '';
    const spaced = role.replace(/([A-Z])/g, ' $1'); // Adds a space before capital letters
    return spaced.charAt(0).toUpperCase() + spaced.slice(1); // Capitalizes the first letter
};

const DashboardHeader = () => {
    const { user, unreadCount } = useAuth();
    const navigate = useNavigate();
    const [showNotifications, setShowNotifications] = useState(false);
    const notificationRef = useRef(null);

    // Effect to close the dropdown when clicking outside of it
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (notificationRef.current && !notificationRef.current.contains(event.target)) {
                setShowNotifications(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []); // Dependency array is empty, which is fine for this effect

    const handleAddClick = () => {
        navigate('/projects/create');
    };

    const toggleNotifications = () => {
        setShowNotifications(prev => !prev);
    };

    return (
        <header className="dashboard-header-container">
            <h1 className="portfolio-title">Dashboard</h1>
            <div className="header-controls">
                <div className="search-bar">
                    <input type="text" placeholder="Search..." />
                </div>

                {/* Only render the "Create Project" button for authorized roles */}
                {(user?.role === 'projectManager' || user?.role === 'admin') && (
                    <button onClick={handleAddClick} className="control-button add-button" title="Create New Project">
                        <AddIcon />
                    </button>
                )}

                <div className="notification-container" ref={notificationRef}>
                    <button onClick={toggleNotifications} className="control-button notification-button" title="View Notifications">
                        <NotificationIcon />
                        {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
                    </button>
                    {showNotifications && <NotificationDropdown closeDropdown={() => setShowNotifications(false)} />}
                </div>

                {/* --- THIS IS THE ONLY UPDATED SECTION --- */}
                <div className="user-profile">
                    <img src={user?.avatar || `https://i.pravatar.cc/36?u=${user?.email}`} alt={user?.name} />
                    {/* A new wrapper for the name and role */}
                    <div className="user-details">
                        <span className="user-name">{user?.name || 'User'}</span>
                        {/* The new element that displays the formatted user role */}
                        <span className="user-role">{formatRole(user?.role)}</span>
                    </div>
                </div>
                {/* --- END OF UPDATE --- */}
            </div>
        </header>
    );
};

export default DashboardHeader;