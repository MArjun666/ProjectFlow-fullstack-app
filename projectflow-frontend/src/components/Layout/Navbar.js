import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Navbar.css';

// A small helper component to render icons with tooltips
const Icon = ({ name, title }) => (
    <span title={title} className="icon-text">{name}</span>
);

const Navbar = () => {
    // Get the current user and logout function from the authentication context
    const { user, logout } = useAuth();

    return (
        <nav className="aurora-navbar">
            <div className="navbar-top">
                <NavLink to="/" className="navbar-logo" title="ProjectFlow Home">
                    PF
                </NavLink>
                <div className="navbar-links">
                    {/* Conditionally render links based on user authentication */}
                    {user ? (
                        <>
                            <NavLink to="/dashboard" className="nav-item" title="Dashboard">
                                <Icon name="🏠" />
                            </NavLink>
                            <NavLink to="/organize" className="nav-item" title="Organize Projects">
                                <Icon name="📂" />
                            </NavLink>
                            <NavLink to="/my-tasks" className="nav-item" title="My Tasks">
                                <Icon name="✅" />
                            </NavLink>
                            <NavLink to="/track" className="nav-item" title="Track Progress">
                                <Icon name="📊" />
                            </NavLink>
                        </>
                    ) : (
                         <NavLink to="/" className="nav-item" title="Home">
                            <Icon name="🏠"/>
                         </NavLink>
                    )}
                </div>
            </div>
            
            <div className="navbar-bottom">
                {/* Conditionally render user avatar/logout or a login button */}
                {user ? (
                    <>
                        <div className="user-avatar-container" title={`Logged in as ${user.name}`}>
                            <img 
                                src={user.avatar || `https://i.pravatar.cc/45?u=${user.email}`} 
                                alt={user.name} 
                                className="user-avatar" 
                            />
                        </div>
                        <button onClick={logout} className="logout-button" title="Logout">
                            <Icon name="🚪" />
                        </button>
                    </>
                ) : (
                    <NavLink to="/login" className="nav-item" title="Login">
                        <Icon name="🔑" />
                    </NavLink>
                )}
            </div>
        </nav>
    );
};

export default Navbar;