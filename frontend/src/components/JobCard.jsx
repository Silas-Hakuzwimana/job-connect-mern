import React, { useState } from "react";
import { addBookmark } from "../services/bookmarkService";
import { applyToJob } from "../services/jobService"; // Adjust path if needed
import { Bookmark, BookmarkCheck } from "lucide-react";
import { toast } from "react-toastify";

export default function JobCard({ job, isQualified }) {
  const [bookmarked, setBookmarked] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [coverLetterText, setCoverLetterText] = useState("");
  const [coverLetterFile, setCoverLetterFile] = useState(null);
  const [resumeFile, setResumeFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleApplyClick = () => {
    if (!isQualified) return;
    setShowModal(true);
  };

  const handleApplySubmit = async () => {
    if (!resumeFile) {
      toast.error("Please upload your resume before submitting.");
      return;
    }
    setIsSubmitting(true);
    try {
      await applyToJob({
        jobId: job._id,
        resumeFile,
        coverLetter: coverLetterFile || coverLetterText, // file or text
        qualifications: [], // add qualifications if needed
      });
      toast.success("Application submitted!");
      setShowModal(false);
      setCoverLetterText("");
      setCoverLetterFile(null);
      setResumeFile(null);
    } catch (err) {
      console.error("Application error:", err);
      toast.error(err.response?.data?.message || "Failed to apply");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-lg transition-shadow bg-white max-w-md mx-auto">

      <h2 className="text-2xl font-semibold text-gray-900"><span className="bg-blue-800 border border-blue-300 text-white px-3 py-1 rounded shadow-sm">Job Title: </span>
        <br>
        </br>
        {job.title}</h2>

      <p className="text-gray-700 mt-3"><span className="font-semibold">Description: </span>
        <br>
        </br>
        {job.description}</p>

      <p className="text-sm mt-4">
        <span className="font-semibold">Qualification(s): </span>
        {job.qualifications && job.qualifications.length > 0 ? (
          <span className="inline-flex flex-wrap gap-2 ml-1 mt-2">
            {Array.isArray(job.qualifications)
              ? job.qualifications.map((qual, idx) => (
                <span
                  key={idx}
                  className="bg-blue-100 border border-blue-300 text-blue-800 px-3 py-1 rounded shadow-sm"
                >
                  {qual}
                </span>
              ))
              : job.qualifications
                .split(',')
                .map((qual, idx) => (
                  <span
                    key={idx}
                    className="bg-blue-100 border border-blue-300 text-blue-800 px-3 py-1 rounded shadow-sm"
                  >
                    {qual.trim()}
                  </span>
                ))}
          </span>
        ) : (
          <span className="text-gray-500 italic ml-1">Not specified</span>
        )}
      </p>

      <p className="text-sm mt-1 text-gray-600">
        <span className="font-semibold">Location: </span>
        {job.location || "Not specified"}
      </p>

      <p className="text-sm mt-1 text-gray-600">
        <span className="font-semibold">Company: </span>
        {job.company || "Not specified"}
      </p>

      <p className="text-sm mt-1 text-gray-700">
        <span className="font-semibold">Salary: </span>
        {job.salary ? `${job.salary} USD` : 'Not specified'}
      </p>

      <p className="text-sm mt-1 text-gray-700">
        <span className="font-semibold">Type: </span>
        {job.salary ? `${job.type}` : 'Not specified'}
      </p>


      <p className="mt-3">
        {isQualified ? (
          <span className="text-green-600 font-semibold inline-flex items-center gap-1">
            Qualified <span>✔️</span>
          </span>
        ) : (
          <span className="text-red-600 font-semibold inline-flex items-center gap-1">
            Not Qualified <span>❌</span>
          </span>
        )}
      </p>


      <p className="text-sm mt-1">
        <span className="font-semibold">Status: </span>
        {job.isActive === true ? (
          <span className="text-green-600 font-semibold">Active</span>
        ) : job.isActive === false ? (
          <span className="text-red-600 font-semibold">Inactive</span>
        ) : (
          <span className="text-gray-500 italic">Not specified</span>
        )}
      </p>


      <div className="flex items-center gap-3 mt-6">
        <button
          disabled={!isQualified || job.applied} // disable if not qualified OR already applied
          onClick={handleApplyClick}
          className={`flex-1 px-5 py-2 rounded-md font-semibold transition 
    ${(!isQualified || job.applied)
              ? "bg-gray-300 cursor-not-allowed text-gray-500"
              : "bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            }`}
        >
          {job.applied ? "Applied" : "Apply"}

          {job.applied && (
            <span className="ml-2 text-green-600 font-semibold text-sm">
              Already Applied
            </span>
          )}
        </button>


        <button
          onClick={handleBookmark}
          disabled={bookmarked}
          className={`p-2 rounded-md transition flex items-center justify-center
            ${bookmarked
              ? "bg-green-500 text-white hover:bg-green-600"
              : "bg-yellow-400 text-black hover:bg-yellow-500"
            }`}
          aria-label={bookmarked ? "Bookmarked" : "Bookmark"}
        >
          {bookmarked ? <BookmarkCheck size={20} /> : <Bookmark size={20} />}
        </button>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
            <h2 className="text-xl font-semibold mb-5 text-gray-900">Submit Application</h2>

            <label className="block mb-4">
              <span className="text-gray-700 font-medium">Upload Resume (required)</span>
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={(e) => setResumeFile(e.target.files[0])}
                required
                className="mt-2 block w-full text-sm text-gray-500
                           file:mr-4 file:py-2 file:px-4
                           file:rounded-md file:border-0
                           file:text-sm file:font-semibold
                           file:bg-blue-600 file:text-white
                           hover:file:bg-blue-700
                           cursor-pointer"
              />
            </label>

            <label className="block mb-4">
              <span className="text-gray-700 font-medium">Upload Cover Letter (optional)</span>
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={(e) => setCoverLetterFile(e.target.files[0])}
                disabled={!!coverLetterText}
                className="mt-2 block w-full text-sm text-gray-500
                           file:mr-4 file:py-2 file:px-4
                           file:rounded-md file:border-0
                           file:text-sm file:font-semibold
                           file:bg-yellow-400 file:text-black
                           hover:file:bg-yellow-500
                           cursor-pointer"
              />
            </label>

            <p className="text-center text-gray-500 my-2 font-semibold">OR</p>

            <textarea
              rows={5}
              value={coverLetterText}
              onChange={(e) => setCoverLetterText(e.target.value)}
              placeholder="Write a cover letter or reason for applying..."
              disabled={!!coverLetterFile}
              className="w-full p-3 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="px-5 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Cancel
              </button>

              <button
                onClick={handleApplySubmit}
                disabled={isSubmitting}
                className="px-5 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Submitting..." : "Submit"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
