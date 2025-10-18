import React from 'react';

// --- THIS IS A CRITICAL FIX ---
// It correctly imports the necessary 'Navigate' and 'Outlet' components
// from the modern 'react-router-dom' library (version 6+).
import { Navigate, Outlet } from 'react-router-dom';

import { useAuth } from '../../context/AuthContext';

/**
 * A component that acts as a gatekeeper for routes in your application.
 * It checks for authentication and authorization before allowing access.
 * 
 * How it's used in App.js:
 * <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
 *   <Route path="/admin" element={<AdminPage />} />
 * </Route>
 *
 * @param {object} props - The component props.
 * @param {string[]} [props.allowedRoles] - An optional array of roles that are allowed to access the nested routes.
 */
const ProtectedRoute = ({ allowedRoles }) => {
  // Get the current user and loading status from the central authentication context.
  const { user, loading } = useAuth();

  // 1. Handle the initial loading state.
  // While the context is checking for a user in local storage, we display a loading message.
  // This prevents the user from being prematurely redirected to the login page.
  if (loading) {
    return <div className="container" style={{ textAlign: 'center', padding: '3rem' }}>Loading session...</div>;
  }

  // 2. Check for authentication.
  // If loading is complete and there is still no user, they are not authenticated.
  // We use the <Navigate> component to redirect them to the login page.
  // The 'replace' prop prevents the user from navigating back to the protected page.
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // 3. Check for authorization (role-based access).
  // If the route specifies 'allowedRoles' and the current user's role is not in that list,
  // they are not authorized. Redirect them to the main dashboard.
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  // 4. Grant access.
  // If all checks pass, render the child route's component using the <Outlet /> component.
  // <Outlet /> acts as a placeholder for the nested route's element defined in App.js.
  return <Outlet />;
};

export default ProtectedRoute;