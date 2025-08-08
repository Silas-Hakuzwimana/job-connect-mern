import { useState } from "react";

export default function ApplicationModal({ job, onClose, onSubmit }) {
  const [coverLetter, setCoverLetter] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(coverLetter);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6">
        <h2 className="text-xl font-semibold mb-4">
          Apply for {job.title}
        </h2>

        <form onSubmit={handleSubmit}>
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Cover Letter:
          </label>
          <textarea
            value={coverLetter}
            onChange={(e) => setCoverLetter(e.target.value)}
            rows="6"
            className="w-full border p-2 rounded"
            required
          ></textarea>

          <div className="mt-4 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Submit Application
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
