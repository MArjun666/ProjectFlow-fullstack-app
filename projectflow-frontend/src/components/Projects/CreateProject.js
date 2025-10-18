import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import projectService from '../../services/projectService';
import { useAuth } from '../../context/AuthContext';
import './ProjectForm.css';

// Helper function to format date strings for <input type="date">
const formatDateForInput = (dateString) => {
  if (!dateString) return '';
  return new Date(dateString).toISOString().split('T')[0];
};

const initialState = {
    name: '',
    description: '',
    status: 'Not_Started',
    projectManager: '',
    teamMembers: [],
    startDate: '',
    endDate: '',
    clientName: '',
    clientEmail: '',
    clientCompany: '',
};

/**
 * This is the core form component for both creating and editing projects.
 */
const ProjectForm = ({ isEditMode = false }) => {
  const navigate = useNavigate();
  const { projectId } = useParams();
  
  // --- THIS IS THE KEY UPDATE ---
  // We now get the `fetchUserProjects` function from the context. This allows us
  // to trigger a refresh of the master project list after a successful submission.
  const { user, fetchUserProjects } = useAuth();

  const [formData, setFormData] = useState(initialState);
  const [assignableUsers, setAssignableUsers] = useState([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true); // For initial data loading
  const [isSubmitting, setIsSubmitting] = useState(false); // For submission process

  // Using useCallback prevents this function from being redefined on every render,
  // which is a good practice for functions used in useEffect.
  const loadInitialData = useCallback(async () => {
    try {
      setIsLoading(true);
      const usersData = await projectService.getAssignableUsers();
      setAssignableUsers(usersData || []);

      if (isEditMode && projectId) {
        const projectData = await projectService.getProjectById(projectId);
        setFormData({
            name: projectData.name || '',
            description: projectData.description || '',
            status: projectData.status.replace(' ', '_') || 'Not_Started',
            projectManager: projectData.projectManager?._id || '',
            teamMembers: projectData.teamMembers?.map(tm => tm._id) || [],
            startDate: formatDateForInput(projectData.startDate),
            endDate: formatDateForInput(projectData.endDate),
            clientName: projectData.clientName || '',
            clientEmail: projectData.clientEmail || '',
            clientCompany: projectData.clientCompany || '',
        });
      } else if (user) {
        const isEligiblePM = user.role === 'admin' || user.role === 'projectManager';
        setFormData(prev => ({
          ...prev,
          projectManager: isEligiblePM ? user._id : '',
          teamMembers: [user._id]
        }));
      }
    } catch (err) {
      setError(err.message || 'Failed to load form data.');
    } finally {
      setIsLoading(false);
    }
  }, [projectId, isEditMode, user]);

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleTeamMemberChange = (e) => {
    const memberId = e.target.value;
    setFormData(prev => ({
      ...prev,
      teamMembers: prev.teamMembers.includes(memberId)
        ? prev.teamMembers.filter(id => id !== memberId)
        : [...prev.teamMembers, memberId]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.projectManager) {
        setError("A Project Manager must be selected.");
        return;
    }
    
    setIsSubmitting(true);

    const finalFormData = {
      ...formData,
      teamMembers: [...new Set([...formData.teamMembers, formData.projectManager])]
    };

    try {
      if (isEditMode) {
        await projectService.updateProject(projectId, finalFormData);
      } else {
        await projectService.createProject(finalFormData);
      }

      // --- CRITICAL UPDATE ---
      // After successfully saving, trigger a refresh of the global project list.
      // This ensures all other components in the app have the latest data.
      await fetchUserProjects();
      
      // Navigate to the appropriate page after the action is complete.
      navigate(isEditMode ? `/projects/${projectId}` : '/organize');

    } catch (err) {
      setError(err.response?.data?.message || `Failed to ${isEditMode ? 'save' : 'create'} project.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <div className="form-loading"><p>Loading form...</p></div>;

  return (
    <div className="form-page-container">
      <div className="project-form-card">
        <h1 className="form-main-title">{isEditMode ? 'Edit Project Details' : 'Create New Project'}</h1>
        {error && <p className="error-message">{error}</p>}

        <form onSubmit={handleSubmit}>
          {/* Form sections (Core, Timeline, Team, Client) go here. */}
          {/* The JSX for the form itself doesn't need to change. */}
          <section className="form-section">
            <h3 className="form-section-title">Core Details</h3>
            <div className="form-group"><label htmlFor="name">Project Name</label><input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required /></div>
            <div className="form-group"><label htmlFor="description">Description</label><textarea id="description" name="description" value={formData.description} onChange={handleChange} rows="4" required /></div>
          </section>
          <section className="form-section">
            <h3 className="form-section-title">Timeline & Status</h3>
            <div className="form-grid"><div className="form-group"><label htmlFor="startDate">Start Date</label><input type="date" id="startDate" name="startDate" value={formData.startDate} onChange={handleChange} /></div><div className="form-group"><label htmlFor="endDate">End Date</label><input type="date" id="endDate" name="endDate" value={formData.endDate} onChange={handleChange} /></div></div>
            <div className="form-group"><label htmlFor="status">Status</label><select id="status" name="status" value={formData.status} onChange={handleChange}><option value="Not_Started">Not Started</option><option value="In_Progress">In Progress</option><option value="Completed">Completed</option><option value="On_Hold">On Hold</option><option value="Cancelled">Cancelled</option></select></div>
          </section>
          <section className="form-section">
            <h3 className="form-section-title">Team Management</h3>
            <div className="form-group"><label htmlFor="projectManager">Project Manager</label><select id="projectManager" name="projectManager" value={formData.projectManager} onChange={handleChange} required><option value="">-- Select a Manager --</option>{assignableUsers.filter(u => u.role === 'projectManager' || u.role === 'admin').map(u => <option key={u._id} value={u._id}>{u.name} ({u.email})</option>)}</select></div>
            <div className="form-group"><label>Team Members</label><div className="team-members-list">{assignableUsers.filter(u => u._id !== formData.projectManager).map(u => (<label htmlFor={`member-${u._id}`} key={u._id} className="team-member-item"><input type="checkbox" id={`member-${u._id}`} value={u._id} checked={formData.teamMembers.includes(u._id)} onChange={handleTeamMemberChange} /><span>{u.name}</span><span className="role-badge">{u.role}</span></label>))}</div></div>
          </section>
          <section className="form-section">
            <h3 className="form-section-title">Client Details (Optional)</h3>
            <div className="form-grid"><div className="form-group"><label htmlFor="clientName">Client Name</label><input type="text" id="clientName" name="clientName" value={formData.clientName} onChange={handleChange} /></div><div className="form-group"><label htmlFor="clientEmail">Client Email</label><input type="email" id="clientEmail" name="clientEmail" value={formData.clientEmail} onChange={handleChange} /></div></div>
            <div className="form-group"><label htmlFor="clientCompany">Client Company</label><input type="text" id="clientCompany" name="clientCompany" value={formData.clientCompany} onChange={handleChange} /></div>
          </section>
          
          <div className="submit-container">
            <button type="submit" disabled={isSubmitting} className="submit-button button-like primary">
              {isSubmitting ? 'Saving...' : (isEditMode ? 'Save Changes' : 'Create Project')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// These exports remain the same. They simply render the form component
// with the correct 'isEditMode' prop.
const CreateProject = () => <ProjectForm isEditMode={false} />;
const EditProject = () => <ProjectForm isEditMode={true} />;

export default CreateProject;
export { EditProject };