import React, { useState} from "react";
import { toast } from "react-toastify";
import { addBookmark, deleteBookmark } from "../../services/bookmarkService";

export default function Applications({ applications = [], loading, error, initialBookmarked = [] }) {
  const [bookmarkedApps, setBookmarkedApps] = useState(initialBookmarked);

  async function toggleBookmark(appId) {
    if (bookmarkedApps.includes(appId)) {
      // Remove bookmark
      try {
        await deleteBookmark(appId, "application");
        setBookmarkedApps((prev) => prev.filter((id) => id !== appId));
        toast.success("Bookmark removed");
      } catch {
        toast.error("Failed to remove bookmark");
      }
    } else {
      // Add bookmark
      try {
        await addBookmark({ itemId: appId, itemType: "application" });
        setBookmarkedApps((prev) => [...prev, appId]);
        toast.success("Bookmarked successfully!");
      } catch{
        toast.error("Failed to add bookmark");
      }
    }
  }

  if (loading) return <p className="text-center p-4">Loading your applications...</p>;
  if (error) return <p className="text-center p-4 text-red-600">{error}</p>;

  return (
    <div className="p-4 bg-white shadow rounded-lg">
      <h2 className="text-xl font-semibold mb-4 text-center">Your Applications</h2>
      {applications.length === 0 ? (
        <p className="text-gray-500 text-center">You have not applied for any jobs yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border-collapse border border-gray-200">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-200 px-4 py-2 text-left">Job Title</th>
                <th className="border border-gray-200 px-4 py-2 text-left">Company</th>
                <th className="border border-gray-200 px-4 py-2 text-left">Location</th>
                <th className="border border-gray-200 px-4 py-2 text-left">Salary</th>
                <th className="border border-gray-200 px-4 py-2 text-left">Type</th>
                <th className="border border-gray-200 px-4 py-2 text-left">Status</th>
                <th className="border border-gray-200 px-4 py-2 text-left">Applied At</th>
                <th className="border border-gray-200 px-4 py-2 text-left">Bookmark</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((app) => (
                <tr key={app._id} className="hover:bg-gray-50">
                  <td className="border border-gray-200 px-4 py-2">{app.jobTitle}</td>
                  <td className="border border-gray-200 px-4 py-2">{app.companyName}</td>
                  <td className="border border-gray-200 px-4 py-2">{app.companyLocation}</td>
                  <td className="border border-gray-200 px-4 py-2">{app.jobSalary}</td>
                  <td className="border border-gray-200 px-4 py-2">{app.jobType}</td>
                  <td className="border border-gray-200 px-4 py-2">
                    <span
                      className={`inline-block px-2 py-1 text-xs rounded-full ${
                        app.status === "pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : app.status === "accepted"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {app.status}
                    </span>
                  </td>
                  <td className="border border-gray-200 px-4 py-2">
                    {new Date(app.createdAt).toLocaleDateString()}
                  </td>
                  <td className="border border-gray-200 px-4 py-2 text-center">
                    <button
                      onClick={() => toggleBookmark(app._id)}
                      className={`text-xl ${
                        bookmarkedApps.includes(app._id) ? "text-blue-600" : "text-gray-400"
                      }`}
                      aria-label="Bookmark application"
                    >
                      {bookmarkedApps.includes(app._id) ? "★" : "☆"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
