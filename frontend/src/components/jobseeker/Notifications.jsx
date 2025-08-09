import React, { useEffect, useState } from 'react';
import { fetchNotifications, markNotificationAsRead } from '../../services/notificationService';

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      const data = await fetchNotifications();
      setNotifications(Array.isArray(data.notifications) ? data.notifications : []);
    } catch {
      setError('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  const handleMarkRead = async (id) => {
    try {
      await markNotificationAsRead(id);
      setNotifications((prev) =>
        prev.map((notif) =>
          notif._id === id ? { ...notif, read: true } : notif
        )
      );
    } catch {
      alert('Failed to mark as read');
    }
  };

  if (loading) return <p className="text-center p-4">Loading notifications...</p>;
  if (error) return <p className="text-center p-4 text-red-600">{error}</p>;

  return (
    <div className="p-4 bg-white shadow rounded-lg max-w-md mx-auto">
      <h2 className="text-xl font-semibold mb-4 text-center">Notifications</h2>

      {notifications.length === 0 ? (
        <p className="text-gray-500 text-center">You have no notifications.</p>
      ) : (
        <ul className="space-y-3">
          {notifications.map(({ _id, message, createdAt, isRead, type, link }) => {
            const bgColorClass = {
              success: 'bg-green-50 border-green-300 text-green-800',
              error: 'bg-red-50 border-red-300 text-red-800',
              warning: 'bg-yellow-50 border-yellow-300 text-yellow-800',
              info: 'bg-blue-50 border-blue-300 text-blue-800',
            };

            return (
              <li
                key={_id}
                className={`p-3 border rounded-md hover:bg-gray-100 transition flex justify-between items-start ${bgColorClass[type] || 'bg-gray-50 border-gray-200 text-gray-700'
                  }`}
              >
                <div>
                  <p className={`text-sm ${isRead ? 'opacity-70' : 'font-semibold'}`}>{message}</p>
                  <span className="text-xs text-gray-400 block mt-1">
                    {new Date(createdAt).toLocaleString()}
                  </span>
                  {link && (
                    <a href={link} className="text-blue-600 hover:underline text-sm mt-1 block" target="_blank" rel="noreferrer">
                      View Details
                    </a>
                  )}
                </div>

                {!isRead && (
                  <button
                    onClick={() => handleMarkRead(_id)}
                    className="ml-3 text-sm text-blue-600 hover:underline"
                    aria-label="Mark notification as read"
                  >
                    Mark as read
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
