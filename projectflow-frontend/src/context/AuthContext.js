import React, { useState, useEffect, useContext, useCallback, createContext } from 'react';
import authService from '../services/authService';
import projectService from '../services/projectService';
import notificationService from '../services/notificationService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Centralized state for projects and notifications
  const [projects, setProjects] = useState([]);
  const [projectsLoading, setProjectsLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [error, setError] = useState('');

  const fetchUserProjects = useCallback(async () => {
    try {
      setProjectsLoading(true);
      setError('');
      const data = await projectService.getProjects();
      setProjects(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch projects into context:", err);
      setError(err.message || "Could not load project data.");
      setProjects([]);
    } finally {
      setProjectsLoading(false);
    }
  }, []);

  const fetchUserNotifications = useCallback(async () => {
      try {
          const notifData = await notificationService.getNotifications();
          setNotifications(notifData.data || []);
          setUnreadCount(notifData.unreadCount || 0);
      } catch (err) {
          console.error("Failed to fetch notifications:", err);
      }
  }, []);

  // Effect to initialize user from local storage
  useEffect(() => {
    const initAuth = () => {
        try {
            const userString = localStorage.getItem('user');
            if (userString) {
                setUser(JSON.parse(userString));
            }
        } catch (err) {
            console.error("Failed to parse user from local storage", err);
            localStorage.removeItem('user');
        } finally {
            setLoading(false);
        }
    };
    initAuth();
  }, []);

  // Effect to fetch data when user state changes
  useEffect(() => {
    if (user) {
      fetchUserProjects();
      fetchUserNotifications();
    } else {
      setProjects([]);
      setNotifications([]);
      setUnreadCount(0);
      setProjectsLoading(false);
    }
  }, [user, fetchUserProjects, fetchUserNotifications]);

  const login = async (email, password) => {
    const userData = await authService.login(email, password);
    setUser(userData);
    return userData;
  };
  
  const register = async (name, email, password, role, avatar) => {
    const userData = await authService.register(name, email, password, role, avatar);
    setUser(userData);
    return userData;
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setError('');
    window.location.href = '/login'; // Redirect to ensure clean state
  };
  
  const value = { 
    user, 
    loading, 
    login, 
    logout, 
    register, 
    projects, 
    projectsLoading, 
    error, 
    fetchUserProjects,
    notifications,
    unreadCount,
    fetchUserNotifications
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);