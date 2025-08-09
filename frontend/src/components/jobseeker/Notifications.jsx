import React, { useEffect, useState, useRef } from 'react';
import { fetchNotifications, markNotificationAsRead, getNotificationsCount } from '../../services/notificationService';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [notificationsCount, setNotificationsCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const pollingInterval = useRef(null);

  const loadNotifications = async () => {
    try {
      const data = await fetchNotifications();
      setNotifications(Array.isArray(data.notifications) ? data.notifications : []);
    } catch {
      toast.error('Failed to load notifications.');
      setError('Failed to load notifications');
    }
  };

  const loadCount = async () => {
    try {
      const count = await getNotificationsCount();
      setNotificationsCount(count);
    } catch (err) {
      toast.error('Failed to fetch notifications count.');
      console.error("Failed to fetch notifications count", err);
    }
  };

  useEffect(() => {
    async function fetchAll() {
      setLoading(true);
      await Promise.all([loadNotifications(), loadCount()]);
      setLoading(false);
    }

    fetchAll();

    // Set up polling every 30 seconds (adjust as needed)
    pollingInterval.current = setInterval(() => {
      fetchAll();
    }, 1000);

    // Cleanup on unmount
    return () => clearInterval(pollingInterval.current);
  }, []);

  const handleMarkRead = async (id) => {
    try {
      await markNotificationAsRead(id);
      setNotifications((prev) =>
        prev.map((notif) =>
          notif._id === id ? { ...notif, isRead: true } : notif
        )
      );
      // Decrease count locally to reflect change instantly
      setNotificationsCount((count) => Math.max(count - 1, 0));
    } catch {
      toast.error('Failed to mark as read.');
      console.error('Failed to mark as read');
    }
  };

  if (loading) return <p className="text-center p-4">Loading notifications...</p>;
  if (error) return <p className="text-center p-4 text-red-600">{error}</p>;

  return (
    <div className="p-4 bg-white shadow rounded-lg max-w-md mx-auto">
      <h2 className="text-xl font-semibold mb-4 text-center">
        Notifications {notificationsCount > 0 && `(${notificationsCount})`}
      </h2>

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
                    <a
                      href={link}
                      className="text-blue-600 hover:underline text-sm mt-1 block"
                      target="_blank"
                      rel="noreferrer"
                    >
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
