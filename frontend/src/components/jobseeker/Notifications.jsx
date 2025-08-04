import React from 'react';

export default function Notifications({ notifications = [] }) {
  return (
    <div className="p-4 bg-white shadow rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Notifications</h2>
      {notifications.length === 0 ? (
        <p className="text-gray-500">You have no notifications.</p>
      ) : (
        <ul className="space-y-3">
          {notifications.map((notification, index) => (
            <li
              key={index}
              className="p-3 border border-gray-200 rounded-md bg-gray-50 hover:bg-gray-100 transition"
            >
              <p className="text-sm text-gray-700">{notification.message}</p>
              <span className="text-xs text-gray-400 block mt-1">
                {new Date(notification.createdAt).toLocaleString()}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}