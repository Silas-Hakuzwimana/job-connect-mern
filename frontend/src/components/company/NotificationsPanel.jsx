import { useEffect, useState, useContext } from "react";
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

  const loadNotifications = async () => {
    try {
      setLoading(true);
      const res = await fetchNotifications(); // res is { notifications: [...] }
      const data = res.notifications || [];
      const visible = data.filter((n) => !n.hiddenBy.includes(user._id));
      setNotifications(visible);
    } catch (err) {
      console.error("Error fetching notifications:", err);
    } finally {
      setLoading(false);
    }
  };

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

    // Polling every 30 seconds for new notifications
    const interval = setInterval(() => {
      loadNotifications();
    }, 30000);

    return () => clearInterval(interval); // cleanup on unmount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-6">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {notifications.length > 0 ? (
        notifications.map((note) => (
          <div
            key={note._id}
            className={`flex items-start gap-3 p-4 rounded-lg border transition ${note.isRead ? "bg-gray-50 border-gray-200" : "bg-yellow-50 border-yellow-200"
              }`}
          >
            <Bell className={`w-5 h-5 mt-1 ${note.isRead ? "text-gray-500" : "text-yellow-600"}`} />
            <div className="flex-1">
              <p className="text-gray-800 text-sm">{note.message}</p>
              <p className="text-xs text-gray-500 mt-1">
                {new Date(note.createdAt).toLocaleString()}
              </p>
            </div>
            <div className="flex items-center gap-2">
              {!note.isRead && (
                <button
                  onClick={() => handleMarkAsRead(note._id)}
                  className="text-green-600 hover:text-green-800"
                  title="Mark as read"
                >
                  <CheckCircle2 className="w-5 h-5" />
                </button>
              )}
              <button
                onClick={() => handleHide(note._id)}
                className="text-gray-400 hover:text-gray-600"
                title="Hide notification"
              >
                <EyeOff className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))
      ) : (
        <p className="text-gray-500 text-sm">No notifications yet.</p>
      )}
    </div>
  );
};

export default NotificationsPanel;
