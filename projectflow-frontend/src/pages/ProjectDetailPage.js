import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import projectService from '../services/projectService';
import { useAuth } from '../context/AuthContext';
import './ProjectDetailPage.css';

const ProjectDetailPage = () => {
    const { projectId } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [project, setProject] = useState(null);
    const [assignableUsers, setAssignableUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchProjectDetails = useCallback(async () => {
        try {
            setLoading(true);
            const projectData = await projectService.getProjectById(projectId);
            setProject(projectData);

            // FIX: Allow PMs to see the list of users they can add to the project
            if (user && (user.role === 'admin' || user.role === 'projectManager')) {
                const usersData = await projectService.getAssignableUsers();
                setAssignableUsers(usersData);
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [projectId, user]);

    useEffect(() => {
        fetchProjectDetails();
    }, [fetchProjectDetails]);

    const handleProjectUpdate = (updatedProject) => {
        setProject(updatedProject);
    };

    const handleTaskCreated = (newTask) => {
        setProject(prev => ({ ...prev, tasks: [...(prev.tasks || []), newTask] }));
    };

    const handleTaskDelete = (taskId) => {
        setProject(prev => ({ ...prev, tasks: prev.tasks.filter(t => t._id !== taskId) }));
    };

    if (loading) return <div className="container"><p>Loading details...</p></div>;
    if (error) return <div className="container error-message">{error}</div>;
    if (!project) return <div className="container"><p>Project not found.</p></div>;

    // FIX: Consistent permission check for the whole page
    const canManageProject = user && (
        user.role === 'admin' || 
        user.role === 'projectManager' || 
        user._id === project.projectManager?._id
    );

    return (
        <div className="container project-detail-page">
            <header className="page-header">
                <h1 className="page-title">{project.name}</h1>
                {canManageProject && 
                    <div className="page-header-actions">
                        <Link to={`/projects/${projectId}/edit`} className="button-like secondary">Edit Project</Link>
                    </div>
                }
            </header>

            <ProjectOverview project={project} />
            <TeamMembers project={project} canManage={canManageProject} assignableUsers={assignableUsers} onUpdate={handleProjectUpdate} />
            <ProjectTasks project={project} canManage={canManageProject} onTaskCreated={handleTaskCreated} onTaskDeleted={handleTaskDelete} />
        </div>
    );
};

const TeamMembers = ({ project, canManage, assignableUsers, onUpdate }) => {
    const [userToAssign, setUserToAssign] = useState('');

    // FIX: Unique members filter to prevent multiple "Mahesh" entries
    const uniqueMembers = project.teamMembers?.reduce((acc, current) => {
        if (!acc.find(item => item._id === current._id)) acc.push(current);
        return acc;
    }, []) || [];

    const handleAddMember = async (e) => {
        e.preventDefault();
        if (!userToAssign) return;
        try {
            const updatedProject = await projectService.addMemberToProject(project._id, userToAssign);
            onUpdate(updatedProject);
            setUserToAssign('');
        } catch (err) { alert(`Failed: ${err.message}`); }
    };

    const handleRemoveMember = async (memberId) => {
        if (!window.confirm("Are you sure?")) return;
        try {
            const updatedProject = await projectService.removeMemberFromProject(project._id, memberId);
            onUpdate(updatedProject);
        } catch (err) { alert(`Failed: ${err.message}`); }
    };
    
    const availableUsersToAdd = assignableUsers.filter(u => !uniqueMembers.some(tm => tm._id === u._id));

    return (
        <section className="page-section glass-card">
            <h3 className="section-title">Team Members ({uniqueMembers.length})</h3>
            <ul className="team-member-list">
                {uniqueMembers.map(member => (
                    <li key={member._id} className="team-member-item">
                        <div className="member-info">
                            <img src={member.avatar || `https://i.pravatar.cc/32?u=${member.email}`} alt={member.name} className="member-avatar" />
                            <span>{member.name}</span>
                            <span className="role-badge">{project.projectManager?._id === member._id ? 'Manager' : member.role}</span>
                        </div>
                        {canManage && project.projectManager?._id !== member._id && (
                            <button onClick={() => handleRemoveMember(member._id)} className="button-like danger small-btn">Remove</button>
                        )}
                    </li>
                ))}
            </ul>
            {canManage && (
                <form onSubmit={handleAddMember} className="add-member-form">
                    <select value={userToAssign} onChange={(e) => setUserToAssign(e.target.value)}>
                        <option value="">-- Add a team member --</option>
                        {availableUsersToAdd.map(u => (<option key={u._id} value={u._id}>{u.name} ({u.role})</option>))}
                    </select>
                    <button type="submit" className="button-like primary" disabled={!userToAssign}>Add</button>
                </form>
            )}
        </section>
    );
};

const ProjectTasks = ({ project, canManage, onTaskCreated, onTaskDeleted }) => {
    // FIX: Use unique members for the task assignment dropdown
    const uniqueTeamMembers = project.teamMembers?.reduce((acc, current) => {
        if (!acc.find(item => item._id === current._id)) acc.push(current);
        return acc;
    }, []) || [];

    const handleTaskDelete = async (taskId) => {
        if (!window.confirm("Delete this task?")) return;
        try {
            await projectService.deleteTask(project._id, taskId);
            onTaskDeleted(taskId);
        } catch (err) { alert(`Error: ${err.message}`); }
    };
    
    return (
        <section className="page-section">
            <h2 className="section-title full-width">Project Tasks ({project.tasks?.length || 0})</h2>
            {canManage && <CreateTaskForm projectId={project._id} assignableUsers={uniqueTeamMembers} onTaskCreated={onTaskCreated} />}
            {project.tasks?.length > 0 ? (
                <ul className="task-list-ul">
                    {project.tasks.map(task => (
                        <li key={task._id} className="task-item-detail glass-card">
                            <div className="task-item-header">
                                <strong>{task.title}</strong>
                                <span className={`task-status-badge-detail status-${task.status.toLowerCase().replace(/_/g, '-')}`}>{task.status.replace(/_/g, ' ')}</span>
                            </div>
                            <p className="task-item-description">{task.description}</p>
                            <div className="task-item-meta">
                                <span>Assigned to: {task.assignedTo?.name || 'Unassigned'}</span>
                                <span>Due: {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'N/A'}</span>
                            </div>
                            {canManage && (
                                <div className="task-actions-detail">
                                    <button onClick={() => handleTaskDelete(task._id)} className="button-like danger small-btn">Delete</button>
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="glass-card" style={{padding: '1.5rem', textAlign: 'center'}}>No tasks created yet.</p>
            )}
        </section>
    );
};

const CreateTaskForm = ({ projectId, assignableUsers, onTaskCreated }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [assignedTo, setAssignedTo] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (!title.trim()) { setError("Title is required."); return; }
        try {
            const newTask = await projectService.createTask(projectId, { title, description, assignedTo, dueDate });
            onTaskCreated(newTask);
            setTitle(''); setDescription(''); setAssignedTo(''); setDueDate('');
        } catch (err) { setError(err.response?.data?.message || err.message); }
    };

    return (
        <form onSubmit={handleSubmit} className="create-task-form glass-card">
            <h4 className="section-title">Add New Task</h4>
            {error && <p className="error-message">{error}</p>}
            <div className="form-group"><label>Title</label><input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required /></div>
            <div className="form-group"><label>Description</label><textarea value={description} onChange={(e) => setDescription(e.target.value)} /></div>
            <div className="form-grid">
                <div className="form-group">
                    <label>Assign To</label>
                    <select value={assignedTo} onChange={(e) => setAssignedTo(e.target.value)}>
                        <option value="">-- Unassigned --</option>
                        {assignableUsers.map(user => (
                            <option key={user._id} value={user._id}>{user.name}</option>
                        ))}
                    </select>
                </div>
                <div className="form-group"><label>Due Date</label><input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} /></div>
            </div>
            <button type="submit" className="button-like primary">Add Task</button>
        </form>
    );
};

const ProjectOverview = ({ project }) => (
    <section className="page-section glass-card">
        <h3 className="section-title">Project Overview</h3>
        <p className="project-description-detail">{project.description}</p>
        <div className="project-meta-grid">
            <div className="meta-item"><strong>Status</strong><span className={`status-badge status-${project.status.toLowerCase().replace(/_/g, '-')}`}>{project.status.replace(/_/g, ' ')}</span></div>
            <div className="meta-item"><strong>Start Date</strong><span>{project.startDate ? new Date(project.startDate).toLocaleDateString() : 'N/A'}</span></div>
            <div className="meta-item"><strong>End Date</strong><span>{project.endDate ? new Date(project.endDate).toLocaleDateString() : 'N/A'}</span></div>
            <div className="meta-item"><strong>Manager</strong><span>{project.projectManager?.name || 'N/A'}</span></div>
        </div>
    </section>
);

export default ProjectDetailPage;