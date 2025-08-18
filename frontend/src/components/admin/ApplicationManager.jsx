import { useEffect, useState } from 'react';
import { fetchApplications } from '../../services/adminApis';

export default function ApplicationManagement() {
  const [applications, setApplications] = useState([]);
  const [selectedApp, setSelectedApp] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchApplications().then((res) => setApplications(res.data));
  }, []);

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-700';
      case 'reviewed':
        return 'bg-blue-100 text-blue-700';
      case 'accepted':
        return 'bg-green-100 text-green-700';
      case 'rejected':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-GB', options); // d/m/y
  };

  const handleView = (app) => {
    setSelectedApp(app);
    setShowModal(true);
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-lg">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Applications</h2>

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200 rounded-lg overflow-hidden">
          <thead className="bg-gray-50 text-gray-700 uppercase text-sm">
            <tr>
              <th className="px-6 py-3 text-left">Applicant</th>
              <th className="px-6 py-3 text-left">Job Title</th>
              <th className="px-6 py-3 text-left">Company</th>
              <th className="px-6 py-3 text-left">Status</th>
              <th className="px-6 py-3 text-left">Applied At</th>
              <th className="px-6 py-3 text-left">Action</th>
            </tr>
          </thead>
          <tbody className="text-gray-700 divide-y divide-gray-100 bg-white">
            {applications.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                  No applications found.
                </td>
              </tr>
            ) : (
              applications.map((app) => (
                <tr key={app._id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4 flex items-center gap-3">
                    <img
                      src={app.applicantDetails?.profilePic || 'https://via.placeholder.com/40'}
                      alt={app.applicantDetails?.name || 'Applicant'}
                      className="w-10 h-10 rounded-full object-cover border border-gray-300"
                    />
                    <div>
                      <p className="font-semibold">{app.applicantDetails?.name || 'N/A'}</p>
                      <p className="text-xs text-gray-500">{app.applicantDetails?.email || 'N/A'}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">{app.jobDetails?.title || 'N/A'}</td>
                  <td className="px-6 py-4">{app.jobDetails?.company || 'N/A'}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(app.status)}`}>
                      {app.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">{formatDate(app.appliedAt)}</td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleView(app)}
                      className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && selectedApp && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full p-6 overflow-y-auto max-h-[90vh]">
            <h2 className="text-xl font-semibold mb-4 text-gray-900">Application Details</h2>

            <div className="flex gap-4 mb-4">
              <img
                src={selectedApp.applicantDetails?.profilePic || 'https://via.placeholder.com/80'}
                alt={selectedApp.applicantDetails?.name || 'Applicant'}
                className="w-20 h-20 rounded-full object-cover border border-gray-300"
              />
              <div>
                <p className="font-semibold text-lg">{selectedApp.applicantDetails?.name || 'N/A'}</p>
                <p className="text-sm text-gray-500">{selectedApp.applicantDetails?.email || 'N/A'}</p>
                <p className="text-sm text-gray-500">{selectedApp.applicantDetails?.phone || 'N/A'}</p>
                <p className="text-sm text-gray-500">{selectedApp.applicantDetails?.location || 'N/A'}</p>
              </div>
            </div>

            <div className="mb-4">
              <h3 className="font-semibold text-gray-800 mb-1">Bio:</h3>
              <p className="text-gray-700">{selectedApp.applicantDetails?.bio || 'N/A'}</p>
            </div>

            <div className="mb-4">
              <h3 className="font-semibold text-gray-800 mb-1">Job:</h3>
              <p><span className="font-semibold">Title:</span> {selectedApp.jobDetails?.title || 'N/A'}</p>
              <p><span className="font-semibold">Company:</span> {selectedApp.jobDetails?.company || 'N/A'}</p>
              <p><span className="font-semibold">Location:</span> {selectedApp.jobDetails?.location || 'N/A'}</p>
              <p><span className="font-semibold">Type:</span> {selectedApp.jobDetails?.type || 'N/A'}</p>
              <p><span className="font-semibold">Salary:</span> {selectedApp.jobDetails?.salary ? `${selectedApp.jobDetails.salary} USD` : 'N/A'}</p>
              <p className="mt-2"><span className="font-semibold">Description:</span> {selectedApp.jobDetails?.description || 'N/A'}</p>
            </div>

            <div className="mb-4">
              <h3 className="font-semibold text-gray-800 mb-1">Cover Letter:</h3>
              <p className="text-gray-700">{selectedApp.coverLetter || 'Not provided'}</p>
            </div>

            <div className="mb-4">
              <h3 className="font-semibold text-gray-800 mb-1">Resume:</h3>
              {selectedApp.resumeUrl ? (
                <a href={selectedApp.resumeUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  View Resume
                </a>
              ) : (
                <span className="text-gray-500">Not uploaded</span>
              )}
            </div>

            <div className="flex justify-end mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="px-5 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
