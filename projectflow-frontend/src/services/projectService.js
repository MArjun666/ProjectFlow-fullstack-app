import api from './api';

const handleApiError = (error, functionName) => {
    const errorMessage = error.response?.data?.message || `An unexpected error occurred in ${functionName}.`;
    console.error(`API Error in ${functionName}:`, error.response || error);
    throw new Error(errorMessage);
};

const projectService = {
  async getProjects() {
    try {
      const response = await api.get('/projects');
      return response.data;
    } catch (error) {
      handleApiError(error, 'getProjects');
    }
  },

  async getProjectById(id) {
    try {
      const response = await api.get(`/projects/${id}`);
      return response.data;
    } catch (error) {
      handleApiError(error, 'getProjectById');
    }
  },

  async getMyTasks() {
    try {
        const response = await api.get('/tasks/mytasks');
        return response.data;
    } catch (error) {
        handleApiError(error, 'getMyTasks');
    }
  },

  async createProject(projectData) {
    try {
      const response = await api.post('/projects', projectData);
      return response.data;
    } catch (error) {
      handleApiError(error, 'createProject');
    }
  },

  async getAssignableUsers() {
    try {
      const response = await api.get('/projects/users');
      return response.data;
    } catch (error) {
      handleApiError(error, 'getAssignableUsers');
    }
  },

  async updateProject(id, projectData) {
    try {
      const response = await api.put(`/projects/${id}`, projectData);
      return response.data;
    } catch (error) {
      handleApiError(error, 'updateProject');
    }
  },

  async deleteProject(id) {
    try {
      const response = await api.delete(`/projects/${id}`);
      return response.data;
    } catch (error) {
      handleApiError(error, 'deleteProject');
    }
  },

  async addMemberToProject(projectId, userId) {
    try {
      const response = await api.post(`/projects/${projectId}/members`, { userId });
      return response.data;
    } catch (error) {
      handleApiError(error, 'addMemberToProject');
    }
  },

  async removeMemberFromProject(projectId, userId) {
    try {
      const response = await api.delete(`/projects/${projectId}/members/${userId}`);
      return response.data;
    } catch (error) {
      handleApiError(error, 'removeMemberFromProject');
    }
  },

  async createTask(projectId, taskData) {
    try {
      const response = await api.post(`/projects/${projectId}/tasks`, taskData);
      return response.data;
    } catch (error) {
      handleApiError(error, 'createTask');
    }
  },

  async updateTask(projectId, taskId, taskData) {
    try {
      const response = await api.put(`/projects/${projectId}/tasks/${taskId}`, taskData);
      return response.data;
    } catch (error) {
      handleApiError(error, 'updateTask');
    }
  },

  async deleteTask(projectId, taskId) {
    try {
      const response = await api.delete(`/projects/${projectId}/tasks/${taskId}`);
      return response.data;
    } catch (error) {
      handleApiError(error, 'deleteTask');
    }
  },

  async updateTaskAcceptanceStatus(projectId, taskId, acceptanceStatus) {
    try {
      const response = await api.put(`/projects/${projectId}/tasks/${taskId}/accept`, { acceptanceStatus });
      return response.data;
    } catch (error) {
      handleApiError(error, 'updateTaskAcceptanceStatus');
    }
  },
};

export default projectService;