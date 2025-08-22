import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { MdAccountCircle } from 'react-icons/md'; // Importing the icon
import "../styles/notifications.css";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
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

  return (
    <div className="notifications-container">
      <h3>Notifications</h3>
      {notifications.map((notification) => (
        <div
          key={notification._id}
          className="notification"
          onClick={() => handleNotificationClick(notification)}
        >
          <span className="noti-profile" style={{ color: "#202020" }}>
            {notification.senderId && notification.senderId.profileImageUrl ? (
              <img
                className="profile-home"
                src={`http://localhost:3001${notification.senderId.profileImageUrl}`}
                alt="Profile"
                style={{ width: '50px', height: '50px', borderRadius: '50%' }}
              />
            ) : (
              <MdAccountCircle style={{ width: '50px', height: '50px' }} />
            )}
            {notification.senderId ? `1 notification from ${notification.senderId.firstName} ${notification.senderId.lastName}` : 'Notification from unknown user'}
          </span>
        </div>
      ))}
    </div>
  );
};

export default Notifications;
