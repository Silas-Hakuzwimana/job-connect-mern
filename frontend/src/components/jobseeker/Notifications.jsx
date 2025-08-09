import React, { useEffect, useState, useRef } from 'react';
import { fetchUnhiddenNotifications, markNotificationAsRead, getNotificationsCount, hideNotification, unhideNotification } from '../../services/notificationService';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [notificationsCount, setNotificationsCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Track which notifications are expanded (store IDs)
  const [expandedIds, setExpandedIds] = useState(new Set());

  // Track hidden notification IDs
  const [hiddenIds, setHiddenIds] = useState(new Set());
  const [processingHideIds, setProcessingHideIds] = useState(new Set()); // to disable

  const pollingInterval = useRef(null);

  const loadNotifications = async () => {
    try {
      const data = await fetchUnhiddenNotifications();
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

    pollingInterval.current = setInterval(() => {
      fetchAll();
    }, 30000);

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
      setNotificationsCount((count) => Math.max(count - 1, 0));
    } catch {
      toast.error('Failed to mark as read.');
      console.error('Failed to mark as read');
    }
  };

  const toggleExpand = (id) => {
    setExpandedIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) newSet.delete(id);
      else newSet.add(id);
      return newSet;
    });
  };

  const toggleHide = async (id) => {
    if (processingHideIds.has(id)) return; // prevent double clicks
    const currentlyHidden = hiddenIds.has(id);

    setProcessingHideIds((prev) => new Set(prev).add(id));

    try {
      if (currentlyHidden) {
        await unhideNotification(id);
        setHiddenIds((prev) => {
          const newSet = new Set(prev);
          newSet.delete(id);
          return newSet;
        });
        await loadNotifications(); // reload fresh list after unhide
      } else {
        await hideNotification(id);
        setHiddenIds((prev) => new Set(prev).add(id));
        setNotifications((prev) => prev.filter((n) => n._id !== id));
        setNotificationsCount((count) =>
          Math.max(count - (notifications.find((n) => n._id === id)?.isRead ? 0 : 1), 0)
        );
      }
    } catch (err) {
      toast.error('Failed to update notification visibility.');
      console.error('Toggle hide/unhide error', err);
    } finally {
      setProcessingHideIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    }
  };

  if (loading) return <p className="text-center p-4">Loading notifications...</p>;
  if (error) return <p className="text-center p-4 text-red-600">{error}</p>;

  // Filter out hidden notifications before displaying
  const visibleNotifications = notifications.filter(n => !hiddenIds.has(n._id));

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <h2 className="text-xl font-semibold mb-6 text-center">
        Notifications {notificationsCount > 0 && `(${notificationsCount})`}
      </h2>

      {visibleNotifications.length === 0 ? (
        <p className="text-gray-500 text-center">You have no notifications.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {visibleNotifications.map(({ _id, message, createdAt, isRead, type, link }) => {
            const bgColorClass = {
              success: 'bg-green-50 border-green-300 text-green-800',
              error: 'bg-red-50 border-red-300 text-red-800',
              warning: 'bg-yellow-50 border-yellow-300 text-yellow-800',
              info: 'bg-blue-50 border-blue-300 text-blue-800',
            };

            const isExpanded = expandedIds.has(_id);
            const isHidden = hiddenIds.has(_id);
            const isProcessing = processingHideIds.has(_id);

            return (
              <div
                key={_id}
                className={`border rounded-lg p-4 shadow-sm flex flex-col justify-between transition hover:shadow-md
                  ${bgColorClass[type] || 'bg-gray-50 border-gray-200 text-gray-700'}
                  ${!isRead ? 'font-semibold' : 'opacity-80'}
                `}
              >
                <div>
                  <p className="mb-2 cursor-pointer" onClick={() => toggleExpand(_id)}>
                    {isExpanded ? message : (message.length > 80 ? message.slice(0, 80) + '...' : message)}
                  </p>
                  {isExpanded && (
                    <>
                      <span className="text-xs text-gray-400 block mb-3">
                        {new Date(createdAt).toLocaleString()}
                      </span>
                      {link && (
                        <a
                          href={link}
                          className="text-blue-600 hover:underline text-sm"
                          target="_blank"
                          rel="noreferrer"
                        >
                          View Details
                        </a>
                      )}
                    </>
                  )}
                </div>

                <div className="mt-4 flex justify-between items-center">
                  {!isRead ? (
                    <button
                      onClick={() => handleMarkRead(_id)}
                      className="text-sm text-blue-600 hover:underline"
                      aria-label="Mark notification as read"
                    >
                      Mark as read
                    </button>
                  ) : (
                    <span className="text-sm text-gray-500">Read</span>
                  )}

                  <button
                    onClick={() => toggleHide(_id)}
                    className="text-sm hover:underline"
                    aria-label={isHidden ? 'Unhide notification' : 'Hide notification'}
                    disabled={isProcessing}
                    style={{ color: isHidden ? '#16a34a' : '#dc2626' }} // green if unhide, red if hide
                  >
                    {isHidden ? 'Unhide' : 'Hide'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
