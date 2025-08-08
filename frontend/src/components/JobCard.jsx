import React, { useState } from "react";
import { addBookmark } from "../services/bookmarkService";
import { Bookmark, BookmarkCheck } from "lucide-react";
import { toast } from "react-toastify";

export default function JobCard({ job, isQualified }) {
  const [bookmarked, setBookmarked] = useState(false); // ideally load this from backend in a real app

  const handleBookmark = async () => {
    try {
      await addBookmark({ itemId: job._id, itemType: "job" });
      setBookmarked(true);
      toast.success("Bookmarked successfully!");
    } catch (err) {
      console.error("Bookmark error:", err);
      toast.error(err.response?.data?.message || "Bookmark failed");
    }
  };

  return (
    <div className="border rounded p-4 shadow hover:shadow-lg transition relative">
      <h2 className="text-xl font-bold">{job.title}</h2>
      <p className="text-gray-700 mt-2">{job.description}</p>
      <p className="text-sm mt-1"><strong>Location:</strong> {job.location}</p>
      {job.salary && job.salary.min != null && job.salary.max != null ? (
        <p className="text-sm">
          <strong>Salary:</strong> {job.salary.min}$ - {job.salary.max}$
        </p>
      ) : (
        <p className="text-sm text-muted">
          <strong>Salary:</strong> Not specified
        </p>
      )}

      <p className="mt-2">
        {isQualified ? (
          <span className="text-green-600 font-semibold">Qualified ✔️</span>
        ) : (
          <span className="text-red-600 font-semibold">Not Qualified ❌</span>
        )}
      </p>

      <div className="flex items-center gap-2 mt-4">
        <button
          disabled={!isQualified}
          className={`px-4 py-2 rounded ${isQualified
            ? "bg-blue-600 text-white hover:bg-blue-700"
            : "bg-gray-300 cursor-not-allowed"
            }`}
        >
          Apply
        </button>

        <button
          onClick={handleBookmark}
          disabled={bookmarked}
          className={`px-3 py-2 rounded ${bookmarked
            ? "bg-green-500 text-white"
            : "bg-yellow-400 text-black hover:bg-yellow-500"
            }`}
        >
          {bookmarked ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}
        </button>
      </div>
    </div>
  );
}
