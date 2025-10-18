import api from './api';

/**
 * A centralized error handler to keep the code clean and provide consistent error messages.
 * @param {Error} error - The error object from the API call.
 * @param {string} functionName - The name of the function where the error occurred, for logging.
 * @throws {Error} Throws a new, user-friendly error message.
 */
const handleApiError = (error, functionName) => {
    const errorMessage = error.response?.data?.message || `An unexpected error occurred in ${functionName}.`;
    console.error(`API Error in ${functionName}:`, error.response || error);
    // Throwing a new error ensures the calling component's catch block receives a clear message.
    throw new Error(errorMessage);
};

const notificationService = {
  /**
   * Fetches all notifications and the unread count for the current user.
   * @returns {Promise<object>} A promise that resolves to an object like { data: [...], unreadCount: 5 }.
   */
  async getNotifications() {
    try {
      const response = await api.get('/notifications');
      return response.data; // The backend returns an object with 'data' and 'unreadCount' keys.
    } catch (error) {
      handleApiError(error, 'getNotifications');
    }
  },

  /**
   * Marks a single notification as read by its ID.
   * @param {string} notificationId - The ID of the notification to mark as read.
   * @returns {Promise<object>} A promise that resolves to the server's response data.
   */
  async markAsRead(notificationId) {
    try {
      // A PUT request is appropriate here as we are updating the state of a resource.
      // The request body is empty since the ID is in the URL.
      const response = await api.put(`/notifications/${notificationId}/read`, {});
      return response.data;
    } catch (error) {
      handleApiError(error, 'markAsRead');
    }
  },

  /**
   * Marks all of the current user's unread notifications as read.
   * @returns {Promise<object>} A promise that resolves to the server's response data.
   */
  async markAllAsRead() {
    try {
      const response = await api.put('/notifications/readall', {});
      return response.data;
    } catch (error) {
      handleApiError(error, 'markAllAsRead');
    }
  },
};

export default notificationService;