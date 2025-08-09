import { Trash } from "lucide-react";
import { useEffect, useState } from "react";
import { getBookmarks, deleteBookmark } from "../../services/bookmarkService";

export default function BookMark() {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBookmarks = async () => {
    setLoading(true);
    try {
      const response = await getBookmarks();
      const data = Array.isArray(response) ? response : [];
      setBookmarks(data);
    } catch (err) {
      console.error("Error fetching bookmarks:", err);
      setError("Failed to load bookmarks.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteBookmark(id);
      setBookmarks((prev) => prev.filter((bookmark) => bookmark._id !== id));
    } catch (error) {
      console.error("Error deleting bookmark:", error);
      alert("Failed to delete bookmark. Please try again.");
    }
  };

  useEffect(() => {
    fetchBookmarks();
  }, []);

  if (loading) return <p className="p-6 text-center text-gray-500">Loading bookmarks...</p>;
  if (error) return <p className="p-6 text-center text-red-600">{error}</p>;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">Your Bookmarks</h1>

      {bookmarks.length === 0 ? (
        <p className="text-gray-500 text-center">No bookmarks found.</p>
      ) : (
        <div className="flex flex-wrap gap-6 justify-center">
          {bookmarks.map((b) => {
            const { itemType, createdAt } = b;
            const date = new Date(createdAt).toLocaleDateString();

            if (itemType === "job" && b.itemId) {
              const { title, type, company, location, salary } = b.itemId;
              return (
                <div
                  key={b._id}
                  className="flex flex-col justify-between p-4 border rounded-lg shadow-md w-full sm:w-80 md:w-72 lg:w-64 bg-white dark:bg-gray-800 hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="mb-4">
                    <h2 className="font-semibold text-xl text-white">{title || "Untitled Job"}</h2>
                    {company && <p className="text-gray-700 font-medium">{company}</p>}
                    {location && <p className="text-gray-600">{location}</p>}
                    {type && <p className="text-sm text-indigo-600 font-semibold">Type: {type}</p>}
                    {salary != null && <p className="text-sm text-green-600">Salary: ${salary.toLocaleString()}</p>}
                    <p className="text-sm text-gray-400 mt-2">Bookmarked on: {date}</p>
                  </div>

                  <button
                    onClick={() => handleDelete(b._id)}
                    className="self-end text-red-500 hover:text-red-700 cursor-pointer"
                    aria-label="Delete bookmark"
                    title="Delete bookmark"
                  >
                    <Trash size={24} />
                  </button>
                </div>
              );
            } else if (itemType === "application" && b.itemId) {

              return (
                <div
                  key={b._id}
                  className="flex flex-col justify-between p-4 border rounded-lg shadow-md w-full sm:w-80 md:w-72 lg:w-64 bg-white dark:bg-gray-800 hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="mb-4">
                    <h2 className="font-semibold text-xl text-white">
                      {/* If your itemId is just _id, consider fetching more details */}
                      Application ID: {b.itemId._id}
                    </h2>
                    <p className="text-gray-600">Type: Application</p>
                    <p className="text-sm text-gray-400 mt-2">Bookmarked on: {date}</p>
                  </div>

                  <button
                    onClick={() => handleDelete(b._id)}
                    className="self-end text-red-500 hover:text-red-700 cursor-pointer"
                    aria-label="Delete bookmark"
                    title="Delete bookmark"
                  >
                    <Trash size={24} />
                  </button>
                </div>
              );
            } else {
              // fallback for missing or unknown types
              return (
                <div
                  key={b._id}
                  className="flex flex-col justify-between p-4 border rounded-lg shadow-md w-full sm:w-80 md:w-72 lg:w-64 bg-gray-100 hover:shadow-lg transition-shadow duration-300"
                >
                  <p className="text-gray-600">Unknown bookmark type</p>
                  <button
                    onClick={() => handleDelete(b._id)}
                    className="self-end text-red-500 hover:text-red-700 cursor-pointer"
                    aria-label="Delete bookmark"
                    title="Delete bookmark"
                  >
                    <Trash size={24} />
                  </button>
                </div>
              );
            }
          })}
        </div>
      )}
    </div>
  );
}
