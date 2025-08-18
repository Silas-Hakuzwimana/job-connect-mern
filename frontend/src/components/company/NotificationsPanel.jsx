import { useEffect, useState, useContext, useCallback } from "react";
import { Bell, CheckCircle2, EyeOff } from "lucide-react";
import LoadingSpinner from "../LoadingSpinner";
import {
  fetchNotifications,
  markNotificationAsRead,
  hideNotification,
} from "../../services/notificationService";
import { AuthContext } from "../../context/AuthContext";

const NotificationsPanel = () => {
  const { user } = useContext(AuthContext);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load notifications with filtering hidden ones
  const loadNotifications = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetchNotifications();
      const data = res.notifications || [];
      const visible = data.filter((n) => !n.hiddenBy.includes(user._id));
      setNotifications(visible);
    } catch (err) {
      console.error("Error fetching notifications:", err);
    } finally {
      setLoading(false);
    }
  }, [user._id]);

  const handleMarkAsRead = async (id) => {
    try {
      await markNotificationAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
      );
    } catch (err) {
      console.error("Error marking notification as read:", err);
    }
  };

  const handleHide = async (id) => {
    try {
      await hideNotification(id);
      setNotifications((prev) => prev.filter((n) => n._id !== id));
    } catch (err) {
      console.error("Error hiding notification:", err);
    }
  };

  useEffect(() => {
    loadNotifications();
    const interval = setInterval(() => {
      loadNotifications();
    }, 30000); // Poll every 30s
    return () => clearInterval(interval);
  }, [loadNotifications]);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center p-6">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Bell className="w-6 h-6 text-indigo-600" />
          <h2 className="text-lg font-semibold text-gray-800">Notifications</h2>
        </div>
        {unreadCount > 0 && (
          <span className="text-sm bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-medium">
            {unreadCount} New
          </span>
        )}
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {notifications.length > 0 ? (
          notifications.map((note) => (
            <div
              key={note._id}
              className={`flex items-start justify-between p-4 rounded-xl shadow-sm transition-all hover:shadow-md border ${note.isRead ? "bg-white border-gray-200" : "bg-yellow-50 border-yellow-300"
                }`}
            >
              <div className="flex items-start gap-3">
                <div className="relative">
                  <Bell
                    className={`w-6 h-6 mt-1 ${note.isRead ? "text-gray-400" : "text-yellow-600"}`}
                  />
                  {!note.isRead && (
                    <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                  )}
                </div>
                <div>
                  <p className="text-gray-800 text-sm font-medium">{note.message}</p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {new Date(note.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {!note.isRead && (
                  <button
                    onClick={() => handleMarkAsRead(note._id)}
                    className="text-green-600 hover:text-green-800 transition"
                    title="Mark as read"
                  >
                    <CheckCircle2 className="w-5 h-5" />
                  </button>
                )}
                <button
                  onClick={() => handleHide(note._id)}
                  className="text-gray-400 hover:text-gray-600 transition"
                  title="Hide notification"
                >
                  <EyeOff className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center p-6 text-gray-500">
            <Bell className="w-8 h-8 mb-2" />
            <p className="text-sm">No notifications yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsPanel;
