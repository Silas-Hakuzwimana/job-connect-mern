import React, { useState, useEffect } from 'react';
import IndustrySelect from './IndustrySelect';

const STATUS_OPTIONS = ['pending', 'approved', 'rejected'];

export default function CompanyForm({ initialData = {}, onSave, onCancel }) {
  const [form, setForm] = useState({
    name: '',
    industry: '',
    website: '',
    email: '',
    phone: '',
    location: '',
    description: '',
    status: 'pending',  // default to pending
    ...initialData,
  });

  useEffect(() => {
    setForm({
      name: '',
      industry: '',
      website: '',
      email: '',
      phone: '',
      location: '',
      description: '',
      status: 'pending', // default
      ...initialData,
    });
  }, [initialData]);

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      alert('Name is required');
      return;
    }
    if (!form.industry) {
      alert('Industry is required');
      return;
    }
    onSave(form);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow space-y-4 max-w-md mx-auto">
      <h3 className="text-xl font-semibold">{initialData._id ? 'Edit Company' : 'Add Company'}</h3>

      <input
        type="text"
        name="name"
        placeholder="Company Name"
        value={form.name}
        onChange={handleChange}
        className="w-full border rounded px-3 py-2"
        required
      />

      <IndustrySelect value={form.industry} onChange={handleChange} />

      <input
        type="url"
        name="website"
        placeholder="Website URL"
        value={form.website}
        onChange={handleChange}
        className="w-full border rounded px-3 py-2"
      />

      <input
        type="email"
        name="email"
        placeholder="Website Email"
        value={form.email}
        onChange={handleChange}
        className="w-full border rounded px-3 py-2"
      />

      <input
        type="tel"
        name="phone"
        placeholder="Company phone"
        value={form.phone}
        onChange={handleChange}
        className="w-full border rounded px-3 py-2"
      />

      <input
        type="text"
        name="location"
        placeholder="Location"
        value={form.location}
        onChange={handleChange}
        className="w-full border rounded px-3 py-2"
      />

      <textarea
        name="description"
        placeholder="Description"
        value={form.description}
        onChange={handleChange}
        rows={4}
        className="w-full border rounded px-3 py-2 resize-none"
      />

      {/* Status Select */}
      <div>
        <label htmlFor="status" className="block mb-1 font-medium text-sm">Status</label>
        <select
          id="status"
          name="status"
          value={form.status}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
          required
        >
          {STATUS_OPTIONS.map(status => (
            <option key={status} value={status}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </option>
          ))}
        </select>
      </div>

      <div className="flex space-x-3 justify-end">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border rounded hover:bg-gray-100"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Save
        </button>
      </div>
    </form>
  );
}
