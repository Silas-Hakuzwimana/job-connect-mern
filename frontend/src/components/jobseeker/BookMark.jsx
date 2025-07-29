import { Bookmark, Briefcase, Trash } from "lucide-react";
import { useEffect, useState } from "react";
import { getBookmarks, deleteBookmark } from "../../services/bookmarkService";

export default function BookMark() {
    // Example placeholder jobs (you can fetch from backend later)
    //   const bookmarkedJobs = [
    //     {
    //       id: 1,
    //       title: "Frontend Developer",
    //       company: "Tech Corp",
    //       location: "Kigali, Rwanda",
    //       date: "Jul 22, 2025",
    //     },
    //     {
    //       id: 2,
    //       title: "Backend Engineer",
    //       company: "Cloud Systems",
    //       location: "Remote",
    //       date: "Jul 20, 2025",
    //     },
    //   ];

    const [bookmarks, setBookmarks] = useState([]);

    const fetchBookmarks = async () => {
        try {
            const response = await getBookmarks();
            setBookmarks(response.data);
        } catch (error) {
            console.error("Error fetching bookmarks:", error);
        }
    };

    const handleDelete = async (id) => {
        try {
            await deleteBookmark(id);
            setBookmarks(bookmarks.filter((bookmark) => bookmark.id !== id));
        } catch (error) {
            console.error("Error deleting bookmark:", error);
        }
    };

    useEffect(() => {
        fetchBookmarks();
    }, []);

    return (
        <div className="p-6 max-w-5xl mx-auto">
            <h1 className="text-3xl font-bold mb-4">Your Bookmarks</h1>
            <div className="space-y-4">
                {bookmarks.map((b) => (
                    <div key={b._id} className="p-4 border rounded shadow-sm flex justify-between items-center">
                        <div>
                            <h2 className="font-semibold text-lg">
                                {b.job?.title || b.application?.job?.title || "Untitled"}
                            </h2>
                            <p className="text-gray-500">
                                {b.job ? "Bookmarked Job" : "Bookmarked Application"}
                            </p>
                        </div>
                        <button onClick={() => handleDelete(b._id)} className="text-red-500 hover:text-red-700">
                            <Trash size={20} />
                        </button>
                    </div>
                ))}
                {bookmarks.length === 0 && (
                    <p className="text-gray-500">No bookmarks found.</p>
                )}
            </div>
        </div>
    );
}
