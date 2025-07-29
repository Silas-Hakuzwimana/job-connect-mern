import React, { useEffect, useState } from 'react';
import { getCompanies, createCompany, updateCompany, deleteCompany } from '../services/companyApi';
import CompanyForm from '../components/CompanyForm';

export default function CompanyManager() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const loadCompanies = async () => {
    try {
      setLoading(true);
      const { data } = await getCompanies();
      setCompanies(data);
    } catch {
      alert('Failed to load companies');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCompanies();
  }, []);

  const handleSave = async (company) => {
    try {
      if (company._id) {
        await updateCompany(company._id, company);
      } else {
        await createCompany(company);
      }
      setEditing(null);
      setShowForm(false);
      loadCompanies();
    } catch {
      alert('Failed to save company');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this company?')) return;
    try {
      await deleteCompany(id);
      loadCompanies();
    } catch {
      alert('Failed to delete company');
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Companies</h2>
        <button
          onClick={() => { setEditing(null); setShowForm(true); }}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add Company
        </button>
      </div>

      {showForm && (
        <CompanyForm
          initialData={editing || {}}
          onSave={handleSave}
          onCancel={() => { setEditing(null); setShowForm(false); }}
        />
      )}

      {loading ? (
        <p className="text-center">Loading companies...</p>
      ) : (
        <table className="w-full table-auto border-collapse border border-gray-300 rounded-md overflow-hidden">
          <thead className="bg-gray-100">
            <tr>
              <th className="border border-gray-300 px-4 py-2 text-left">Name</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Industry</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Website</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Location</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {companies.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center p-4 text-gray-600">
                  No companies found.
                </td>
              </tr>
            ) : (
              companies.map((company) => (
                <tr
                  key={company._id}
                  className="hover:bg-gray-50 transition"
                >
                  <td className="border border-gray-300 px-4 py-2">{company.name}</td>
                  <td className="border border-gray-300 px-4 py-2">{company.industry || '-'}</td>
                  <td className="border border-gray-300 px-4 py-2">
                    {company.website ? (
                      <a
                        href={company.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        Visit
                      </a>
                    ) : (
                      '-'
                    )}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">{company.location || '-'}</td>
                  <td className="border border-gray-300 px-4 py-2">
                    <button
                      onClick={() => {
                        setEditing(company);
                        setShowForm(true);
                      }}
                      className="mr-2 text-blue-600 hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(company._id)}
                      className="text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}
