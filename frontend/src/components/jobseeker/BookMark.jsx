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
      // Accept either an array directly or an object with bookmarks array inside
      const data = Array.isArray(response.data) ? response.data : response.data.bookmarks;
      setBookmarks(data || []);
    } catch {
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

  if (loading) {
    return <p className="p-6 text-center text-gray-500">Loading bookmarks...</p>;
  }

  if (error) {
    return <p className="p-6 text-center text-red-600">{error}</p>;
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Your Bookmarks</h1>

      {bookmarks.length === 0 ? (
        <p className="text-gray-500 text-center">No bookmarks found.</p>
      ) : (
        <div className="space-y-4">
          {bookmarks.map((b) => (
            <div
              key={b._id}
              className="p-4 border rounded shadow-sm flex justify-between items-center"
            >
              <div>
                <h2 className="font-semibold text-lg">
                  {b.itemType === "job"
                    ? b.itemId?.title || "Untitled Job"
                    : b.itemType === "application"
                      ? b.itemId?.job?.title || "Untitled Application"
                      : "Untitled"}
                </h2>
                <p className="text-gray-500">
                  {b.itemType === "job"
                    ? "Bookmarked Job"
                    : b.itemType === "application"
                      ? "Bookmarked Application"
                      : ""}
                </p>
              </div>
              <button
                onClick={() => handleDelete(b._id)}
                className="text-red-500 hover:text-red-700"
                aria-label="Delete bookmark"
                title="Delete bookmark"
              >
                <Trash size={20} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
