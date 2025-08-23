import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { MdAccountCircle, MdMarkEmailRead, MdChat } from 'react-icons/md';
import { IoIosNotifications } from 'react-icons/io';
import "../styles/notifications.css";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [activeNotification, setActiveNotification] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNotifications = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await axios.get('http://localhost:3001/notifications', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setNotifications(response.data);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchNotifications();
  }, []);

  const handleNotificationClick = async (notification) => {
    const token = localStorage.getItem('token');
    try {
      await axios.put(`http://localhost:3001/notifications/${notification._id}/read`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (notification.senderId && notification.senderId._id) {
        navigate(`/chat/${notification.senderId._id}`);
      } else {
        console.error("Invalid notification structure:", notification);
      }
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const markAllAsRead = async () => {
    const token = localStorage.getItem('token');
    try {
      await axios.put('http://localhost:3001/notifications/mark-all-read', {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Update local state to reflect read status
      setNotifications(notifications.map(notif => ({...notif, read: true})));
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
    }
  };

  return (
    <div className="notifications-container">
      <div className="notifications-header">
        <div className="notifications-title">
          <IoIosNotifications className="notification-icon" />
          <h2>Notifications</h2>
          {notifications.filter(n => !n.read).length > 0 && (
            <span className="unread-badge">{notifications.filter(n => !n.read).length}</span>
          )}
        </div>
        {notifications.length > 0 && (
          <button className="mark-all-read-btn" onClick={markAllAsRead}>
            <MdMarkEmailRead /> Mark all as read
          </button>
        )}
      </div>

      <div className="notifications-list">
        {notifications.length === 0 ? (
          <div className="no-notifications">
            <MdChat className="no-notifications-icon" />
            <p>No notifications yet</p>
            <span>You'll see notifications here when someone messages you</span>
          </div>
        ) : (
          notifications.map((notification) => (
            <div
              key={notification._id}
              className={`notification ${notification.read ? 'read' : 'unread'}`}
              onMouseEnter={() => setActiveNotification(notification._id)}
              onMouseLeave={() => setActiveNotification(null)}
              onClick={() => handleNotificationClick(notification)}
            >
              <div className="notification-content">
                <div className="notification-avatar">
                  {notification.senderId && notification.senderId.profileImageUrl ? (
                    <img
                      src={`http://localhost:3001${notification.senderId.profileImageUrl}`}
                      alt="Profile"
                    />
                  ) : (
                    <MdAccountCircle />
                  )}
                </div>
                <div className="notification-details">
                  <div className="notification-message">
                    <span className="sender-name">
                      {notification.senderId ? 
                        `${notification.senderId.firstName} ${notification.senderId.lastName}` : 
                        'Unknown user'}
                    </span>
                    <span> sent you a message</span>
                  </div>
                  <div className="notification-time">
                    {new Date(notification.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
              {!notification.read && (
                <div className="unread-indicator"></div>
              )}
              {activeNotification === notification._id && (
                <div className="notification-hover-action">
                  <MdChat /> Open chat
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Notifications;