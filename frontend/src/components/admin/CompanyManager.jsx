import { useEffect, useState } from "react";
import { fetchCompanies } from "../../services/adminApis"; 

export default function CompanyManagement() {
  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchCompanies().then((res) => setCompanies(res.data));
  }, []);

  const handleView = (company) => {
    setSelectedCompany(company);
    setShowModal(true);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const options = { day: "2-digit", month: "2-digit", year: "numeric" };
    return new Date(dateString).toLocaleDateString("en-GB", options); // d/m/y
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-lg">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Companies</h2>

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200 rounded-lg overflow-hidden">
          <thead className="bg-gray-50 text-gray-700 uppercase text-sm">
            <tr>
              <th className="px-6 py-3 text-left">Name</th>
              <th className="px-6 py-3 text-left">Industry</th>
              <th className="px-6 py-3 text-left">Location</th>
              <th className="px-6 py-3 text-left">Status</th>
              <th className="px-6 py-3 text-left">Created At</th>
              <th className="px-6 py-3 text-left">Action</th>
            </tr>
          </thead>
          <tbody className="text-gray-700 divide-y divide-gray-100 bg-white">
            {companies.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                  No companies found.
                </td>
              </tr>
            ) : (
              companies.map((company) => (
                <tr key={company._id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4 font-semibold">{company.name || "N/A"}</td>
                  <td className="px-6 py-4">{company.industry || "N/A"}</td>
                  <td className="px-6 py-4">{company.location || "N/A"}</td>
                  <td className="px-6 py-4 capitalize">{company.status || "N/A"}</td>
                  <td className="px-6 py-4">{formatDate(company.createdAt)}</td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleView(company)}
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
      {showModal && selectedCompany && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full p-6 overflow-y-auto max-h-[90vh]">
            <h2 className="text-xl font-semibold mb-4 text-gray-900">{selectedCompany.name}</h2>

            <div className="mb-4">
              <p><span className="font-semibold">Industry:</span> {selectedCompany.industry || "N/A"}</p>
              <p><span className="font-semibold">Location:</span> {selectedCompany.location || "N/A"}</p>
              <p><span className="font-semibold">Status:</span> {selectedCompany.status || "N/A"}</p>
              <p><span className="font-semibold">Website:</span> {selectedCompany.website ? (
                <a href={selectedCompany.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  {selectedCompany.website}
                </a>
              ) : "N/A"}</p>
              <p><span className="font-semibold">Email:</span> {selectedCompany.email || "N/A"}</p>
              <p><span className="font-semibold">Phone:</span> {selectedCompany.phone || "N/A"}</p>
            </div>

            <div className="mb-4">
              <h3 className="font-semibold text-gray-800 mb-1">Description:</h3>
              <p className="text-gray-700">{selectedCompany.description || "N/A"}</p>
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
