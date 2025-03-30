import React, { useState, useEffect } from 'react';
import './notification.css';

function Notifications() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      const mockNotifications = [
        { id: 1, message: 'New stock added for Product A', timestamp: '2023-10-01 10:00 AM' },
        { id: 2, message: 'Threshold reached for Product B', timestamp: '2023-10-02 02:30 PM' },
        { id: 3, message: 'Product C is out of stock', timestamp: '2023-10-03 09:15 AM' },
      ];
      setNotifications(mockNotifications);
    };

    fetchNotifications();
  }, []);

  const clearNotifications = () => {
    setNotifications([]);
  };

  return (
    <div className="notifications">
      <h1>Notifications</h1>
      {notifications.length > 0 ? (
        <div>
          <ul className="notification-list">
            {notifications.map((notification) => (
              <li key={notification.id} className="notification-item">
                <p>{notification.message}</p>
                <span className="timestamp">{notification.timestamp}</span>
              </li>
            ))}
          </ul>
          <button className="clear-btn" onClick={clearNotifications}>
            Clear All
          </button>
        </div>
      ) : (
        <p>No notifications available</p>
      )}
    </div>
  );
}

export default Notifications;