import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// --- Core Layout & Routing Components ---
import Navbar from './components/Layout/Navbar';
import ProtectedRoute from './components/common/ProtectedRoute';

// --- Page Components ---
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import ProjectDetailPage from './pages/ProjectDetailPage';
import MyTasksPage from './pages/MyTasksPage';
import OrganizePage from './pages/OrganizePage';
import CollaboratePage from './pages/CollaboratePage';
import TrackProgressPage from './pages/TrackProgressPage';

// --- Form Components for Specific Routes ---
import CreateProject, { EditProject } from './components/Projects/CreateProject';

// --- Global Styles ---
import './index.css';
import './App.css';

function App() {
  return (
    // The AuthProvider wraps the entire application, making user data and
    // project lists available to all components.
    <AuthProvider>
      <Router>
        <div className="app-layout">
          <Navbar />
          <main className="main-content-area">
            <Routes>
              {/* === Public Routes (accessible to everyone) === */}
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />

              {/* === General Protected Routes (user must be logged in) === */}
              {/* The <ProtectedRoute /> wrapper handles the login check. */}
              <Route element={<ProtectedRoute />}>
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/projects/:projectId" element={<ProjectDetailPage />} />
                <Route path="/my-tasks" element={<MyTasksPage />} />
                <Route path="/organize" element={<OrganizePage />} />
                <Route path="/collaborate" element={<CollaboratePage />} />
                <Route path="/track" element={<TrackProgressPage />} />
              </Route>

              {/* === Role-Specific Protected Routes === */}
              {/* This wrapper checks for login AND specific roles. */}
              <Route element={<ProtectedRoute allowedRoles={['admin', 'projectManager']} />}>
                <Route path="/projects/create" element={<CreateProject />} />
                <Route path="/projects/:projectId/edit" element={<EditProject />} />
              </Route>
              
              {/* === 404 Not Found Route (Catches any invalid URL) === */}
              <Route path="*" element={
                <div className="container" style={{ textAlign: 'center', marginTop: '50px' }}>
                  <h1 className="page-title">404 - Not Found</h1>
                  <p>The page you are looking for does not exist.</p>
                  <Link to="/" className="button-like primary">Go Home</Link>
                </div>
              } />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;