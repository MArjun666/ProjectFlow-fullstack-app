import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './AuthForm.css'; // Uses the shared stylesheet for forms

const Register = () => {
  // State for each form field
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('teamMember'); // Default role is the most restrictive
  const [avatar, setAvatar] = useState('');

  // State for handling UI feedback
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Hooks for navigation and authentication
  const { register } = useAuth();
  const navigate = useNavigate();

  /**
   * Handles the form submission process.
   */
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent the browser's default form submission
    setError('');       // Clear any previous errors
    setLoading(true);   // Set loading state to disable the button and show feedback

    try {
      // Call the register function from our authentication context
      await register(name, email, password, role, avatar);
      // If successful, navigate the user to their main dashboard
      navigate('/dashboard');
    } catch (err) {
      // If an error occurs, display a user-friendly message
      setError(err.response?.data?.message || 'Failed to register. Please try again.');
      console.error("Registration Error:", err);
    } finally {
      // Always set loading back to false, whether the request succeeded or failed
      setLoading(false);
    }
  };

  return (
    <div className="auth-form-container glass-card">
      <h2 className="auth-title">Create Your Account</h2>
      
      {/* Conditionally render the error message if one exists */}
      {error && <p className="error-message">{error}</p>}
      
      <form onSubmit={handleSubmit} className="auth-form">
        <div className="form-group">
          <label htmlFor="name">Full Name</label>
          <input 
            type="text" 
            id="name" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            required 
            autoComplete="name"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="email">Email Address</label>
          <input 
            type="email" 
            id="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
            autoComplete="email"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input 
            type="password" 
            id="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
            minLength="6" 
            autoComplete="new-password"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="role">Your Role</label>
          {/* --- THIS IS THE ONLY CHANGE MADE TO THE FILE --- */}
          {/* The 'value' attribute is added to each option to ensure the correct role string is sent to the backend. */}
          <select id="role" value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="teamMember">Team Member</option>
            <option value="projectManager">Project Manager</option>
            <option value="admin">Admin</option>
          </select>
          {/* --- END OF CHANGE --- */}
        </div>
        
        <div className="form-group">
          <label htmlFor="avatar">Avatar URL (Optional)</label>
          <input 
            type="text" 
            id="avatar" 
            placeholder="e.g., https://example.com/avatar.png" 
            value={avatar} 
            onChange={(e) => setAvatar(e.target.value)} 
          />
        </div>
        
        <button type="submit" className="button-like primary auth-button" disabled={loading}>
          {loading ? 'Registering...' : 'Register'}
        </button>
      </form>
      
      <p className="auth-switch-link">
        Already have an account? <Link to="/login">Login here</Link>
      </p>
    </div>
  );
};

export default Register;