import React, { useState } from "react";
import { addBookmark } from "../services/bookmarkService";
import { applyToJob } from "../services/jobService";
import { Bookmark, BookmarkCheck } from "lucide-react";
import { toast } from "react-toastify";
import Countdown from "./company/CountDown";

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
        coverLetter: coverLetterFile || coverLetterText,
        qualifications: [],
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

  const isDeadlineUrgent = () => {
    if (!job.deadline) return false;
    const diff = new Date(job.deadline) - new Date();
    return diff <= 3 * 24 * 60 * 60 * 1000; // 3 days
  };

  return (
    <div className="relative border border-gray-200 rounded-xl p-6 shadow-md transition-transform duration-300 transform hover:scale-105 hover:shadow-xl bg-white max-w-md mx-auto my-4">

      {/* Job Header */}
      <div className="flex justify-between items-start">
        <h2 className="text-2xl font-semibold text-gray-900">{job.title}</h2>
        <button
          onClick={handleBookmark}
          disabled={bookmarked}
          className={`p-2 rounded-full transition flex items-center justify-center
            ${bookmarked ? "bg-green-500 text-white hover:bg-green-600" : "bg-yellow-400 text-black hover:bg-yellow-500"}`}
          aria-label={bookmarked ? "Bookmarked" : "Bookmark"}
        >
          {bookmarked ? <BookmarkCheck size={20} /> : <Bookmark size={20} />}
        </button>
      </div>

      {/* Company & Location */}
      <p className="text-gray-600 mt-2 text-sm">
        <span className="font-semibold">Company: </span>{job.companyName || "Not specified"}<br />
        <span className="font-semibold">Location: </span>{job.location || "Not specified"}
      </p>

      {/* Job Description */}
      <p className="text-gray-700 mt-3">
        <span className="font-semibold">
          Job description:
        </span>
        <br>
        </br>
        {job.description}</p>

      {/* Qualifications */}
      <div className="mt-3 flex flex-wrap gap-2">
        <span className="font-semibold w-full">Qualification(s): </span>
        {job.qualifications && job.qualifications.length > 0 ? (
          job.qualifications.map((qual, idx) => (
            <span
              key={idx}
              className="bg-blue-100 border border-blue-300 text-blue-800 px-3 py-1 rounded-full text-sm shadow-sm transform transition-all duration-300 hover:scale-105 hover:bg-blue-200"
            >
              {qual}
            </span>
          ))
        ) : (
          <span className="text-gray-500 italic ml-1">Not specified</span>
        )}
      </div>

      {/* Salary & Type */}
      <div className="flex gap-4 mt-3 text-sm text-gray-700">
        <p><span className="font-semibold">Salary: </span>{job.salary ? `${job.salary} USD` : "Not specified"}</p>
        <p><span className="font-semibold">Type: </span>{job.type || "Not specified"}</p>
      </div>

      {/* Status & Qualification */}
      <div className="flex gap-4 mt-3">
        <p className="font-semibold">Status: </p>
        <span className={`font-semibold ${job.isActive ? "text-green-600" : "text-red-600"}`}>
          {job.isActive ? "Active" : "Inactive"}
        </span>
        <span className={`font-semibold ${isQualified ? "text-green-600" : "text-red-600"}`}>
          {isQualified ? "Qualified ✔️" : "Not Qualified ❌"}
        </span>
      </div>

      {/* Deadline */}
      {job.deadline && (
        <div className={`mt-3 p-2 rounded-md text-sm ${isDeadlineUrgent() ? "bg-red-100 text-red-700 font-bold" : "bg-gray-100 text-gray-700"}`}>
          <span className="font-semibold">Deadline: </span>
          <Countdown deadline={job.deadline} />
        </div>
      )}

      {/* Apply Button */}
      <div className="flex items-center gap-3 mt-6">
        <button
          disabled={!isQualified || job.applied}
          onClick={handleApplyClick}
          className={`flex-1 px-5 py-2 rounded-md font-semibold transition-all duration-300
            ${(!isQualified || job.applied) ? "bg-gray-300 cursor-not-allowed text-gray-500" : "bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 hover:scale-105"}`}
        >
          {job.applied ? "Applied" : "Apply"}
        </button>
      </div>

      {/* Animated Application Modal */}
      {showModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4 transition-opacity duration-300"
          style={{ animation: "fadeIn 0.3s ease forwards" }}
        >
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 transform transition-transform duration-300 scale-90 animate-modalPop">
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

      {/* Tailwind Custom Animation */}
      <style>
        {`
          @keyframes modalPop {
            0% { opacity: 0; transform: scale(0.9); }
            100% { opacity: 1; transform: scale(1); }
          }
          .animate-modalPop {
            animation: modalPop 0.25s ease-out forwards;
          }
        `}
      </style>
    </div>
  );
}
