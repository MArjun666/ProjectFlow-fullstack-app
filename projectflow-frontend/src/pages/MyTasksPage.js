import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import projectService from '../services/projectService';
import { useAuth } from '../context/AuthContext';
import './MyTasksPage.css';

const MyTasksPage = () => {
  const [myTasks, setMyTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();

  const fetchMyTasks = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setError('');
    try {
      // Use the efficient, dedicated API endpoint
      const tasks = await projectService.getMyTasks();
      setMyTasks(tasks || []);
    } catch (err) {
      setError(err.message || 'An error occurred while fetching tasks.');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchMyTasks();
  }, [fetchMyTasks]);

  const handleTaskUpdateInList = (updatedTask) => {
    setMyTasks(prevTasks =>
      prevTasks.map(task =>
        task._id === updatedTask._id ? { ...task, ...updatedTask } : task
      )
    );
  };

  const handleTaskAcceptReject = async (projectId, taskId, acceptanceDecision) => {
    try {
        const updatedTask = await projectService.updateTaskAcceptanceStatus(projectId, taskId, acceptanceDecision);
        fetchMyTasks(); // Refetch the whole list to ensure status consistency
    } catch (err) {
        alert(err.message || `Error updating task acceptance.`);
    }
  };

  const handleMarkTaskAsCompleted = async (taskToComplete) => {
    try {
        const updatePayload = { status: 'Completed' };
        await projectService.updateTask(
            taskToComplete.projectId, taskToComplete._id, updatePayload
        );
        fetchMyTasks(); // Refetch to ensure status consistency
    } catch (err) {
        alert(err.message || 'An error occurred while marking the task as completed.');
    }
  };
  
  if (loading) return <div className="container"><p>Loading your tasks...</p></div>;
  if (error) return <div className="container error-message"><p>{error}</p></div>;

  return (
    <div className="container my-tasks-page">
      <h1 className="page-title">My Assigned Tasks</h1>
      {myTasks.length === 0 ? (
        <div className="glass-card" style={{ padding: '2rem', textAlign: 'center' }}>
            <p>You have no tasks assigned to you currently.</p>
        </div>
      ) : (
        <ul className="task-list">
          {myTasks.map(task => (
            <li key={task._id} className="task-item glass-card">
              <div className="task-header">
                <h4>{task.title}</h4>
                <span className={`task-status-badge status-${task.status?.toLowerCase().replace(/_/g, '-')}`}>{task.status?.replace(/_/g, ' ')}</span>
              </div>
              
              <p className="task-project">
                From Project: <Link to={`/projects/${task.projectId}`}>{task.projectName}</Link>
              </p>

              {task.description && <p className="task-description">{task.description}</p>}
              
              <div className="task-meta">
                <p><strong>Acceptance:</strong> {task.acceptanceStatus?.replace('ByTeamMember', '')}</p>
                {task.dueDate && <p><strong>Due:</strong> {new Date(task.dueDate).toLocaleDateString()}</p>}
              </div>

              <div className="task-actions">
                {task.acceptanceStatus === 'Pending' && (
                  <>
                    <button onClick={() => handleTaskAcceptReject(task.projectId, task._id, 'Accepted')} className="button-like primary small-btn">Accept</button>
                    <button onClick={() => handleTaskAcceptReject(task.projectId, task._id, 'RejectedByTeamMember')} className="button-like warning small-btn">Reject</button>
                  </>
                )}
                {task.acceptanceStatus === 'Accepted' && task.status !== 'Completed' && (
                     <button onClick={() => handleMarkTaskAsCompleted(task)} className="button-like success small-btn">Mark as Completed</button>
                )}
                 {task.status === 'Completed' && (
                    <span className="task-completed-indicator">✓ Completed</span>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MyTasksPage;