import React from 'react';
import { Link } from 'react-router-dom';
import './NotificationDropdown.css';
import { useAuth } from '../../context/AuthContext';
import notificationService from '../../services/notificationService';

// Helper function to get an icon based on notification type
const getNotificationIcon = (type) => {
    switch (type) {
        case 'newTaskAssigned': return '📝';
        case 'taskAccepted': return '✅';
        case 'taskRejectedByTeamMember': return '❌';
        case 'projectUpdate': return '🔄';
        case 'taskCompleted': return '🎉';
        default: return '🔔';
    }
};

const NotificationDropdown = ({ closeDropdown }) => {
    // Get notifications and the function to refetch them from the central context
    const { notifications, fetchUserNotifications } = useAuth();

    const handleMarkAllAsRead = async () => {
        try {
            await notificationService.markAllAsRead();
            fetchUserNotifications(); // Refresh the list and unread count
        } catch (error) {
            console.error("Failed to mark all notifications as read", error);
        }
    };

    return (
        <div className="notification-dropdown-card">
            <div className="dropdown-header">
                <h3>Notifications</h3>
                <button onClick={handleMarkAllAsRead} className="mark-all-read-btn">
                    Mark all as read
                </button>
            </div>
            <div className="notification-list">
                {notifications && notifications.length > 0 ? (
                    notifications.map(notif => (
                        <Link to={notif.link || '/dashboard'} key={notif._id} className="notification-item" onClick={closeDropdown}>
                            <span className="notification-icon">{getNotificationIcon(notif.type)}</span>
                            <div className="notification-content">
                                <p className="notification-message">{notif.message}</p>
                                <span className="notification-time">
                                    {new Date(notif.createdAt).toLocaleString()}
                                </span>
                            </div>
                            {!notif.isRead && <div className="status-dot-unread"></div>}
                        </Link>
                    ))
                ) : (
                    <p className="no-notifications-message">You have no new notifications.</p>
                )}
            </div>
        </div>
    );
};

export default NotificationDropdown;