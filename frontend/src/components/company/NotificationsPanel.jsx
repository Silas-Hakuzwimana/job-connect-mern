// src/components/company/NotificationsPanel.jsx
import { useEffect, useState } from "react";
import { Bell, CheckCircle2 } from "lucide-react";
import axios from "axios";
import LoadingSpinner from "../LoadingSpinner";

const NotificationsPanel = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/company/notifications",
        { withCredentials: true }
      );
      setNotifications(res.data || []);
    } catch (err) {
      console.error("Error fetching notifications:", err);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      await axios.put(
        `http://localhost:5000/api/company/notifications/${id}/read`,
        {},
        { withCredentials: true }
      );
      setNotifications((prev) =>
        prev.map((n) =>
          n.id === id ? { ...n, is_read: true } : n
        )
      );
    } catch (err) {
      console.error("Error marking notification as read:", err);
    }
  };

  useEffect(() => {
    fetchNotifications();

    // Later: Add WebSocket for real-time updates
    // Example: socket.on("newNotification", fetchNotifications);

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
            key={note.id}
            className={`flex items-start gap-3 p-4 rounded-lg border transition ${
              note.is_read
                ? "bg-gray-50 border-gray-200"
                : "bg-yellow-50 border-yellow-200"
            }`}
          >
            <Bell
              className={`w-5 h-5 mt-1 ${
                note.is_read ? "text-gray-500" : "text-yellow-600"
              }`}
            />
            <div className="flex-1">
              <p className="text-gray-800 text-sm">{note.message}</p>
              <p className="text-xs text-gray-500 mt-1">
                {new Date(note.created_at).toLocaleString()}
              </p>
            </div>
            {!note.is_read && (
              <button
                onClick={() => markAsRead(note.id)}
                className="text-green-600 hover:text-green-800"
                title="Mark as read"
              >
                <CheckCircle2 className="w-5 h-5" />
              </button>
            )}
          </div>
        ))
      ) : (
        <p className="text-gray-500 text-sm">No notifications yet.</p>
      )}
    </div>
  );
};

export default NotificationsPanel;
