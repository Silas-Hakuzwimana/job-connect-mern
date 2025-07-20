import React from "react";

export default function JobCard({ job, isQualified }) {
  return (
    <div className="border rounded p-4 shadow hover:shadow-lg transition">
      <h2 className="text-xl font-bold">{job.title}</h2>
      <p className="text-gray-700 mt-2">{job.description}</p>
      <p className="text-sm mt-1">
        <strong>Location:</strong> {job.location}
      </p>
      <p className="text-sm">
        <strong>Salary:</strong> {job.salaryRange}
      </p>
      <p className="mt-2">
        {isQualified ? (
          <span className="text-green-600 font-semibold">Qualified ✔️</span>
        ) : (
          <span className="text-red-600 font-semibold">Not Qualified ❌</span>
        )}
      </p>
      <button
        disabled={!isQualified}
        className={`mt-4 px-4 py-2 rounded ${
          isQualified
            ? "bg-blue-600 text-white hover:bg-blue-700"
            : "bg-gray-300 cursor-not-allowed"
        }`}
      >
        Apply
      </button>
    </div>
  );
}
