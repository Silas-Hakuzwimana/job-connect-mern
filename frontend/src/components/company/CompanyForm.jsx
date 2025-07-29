import React, { useState, useEffect } from 'react';

export default function CompanyForm({ initialData = {}, onSave, onCancel }) {
  const [form, setForm] = useState({
    name: '',
    industry: '',
    website: '',
    location: '',
    description: '',
    ...initialData,
  });

  useEffect(() => {
    setForm({ name: '', industry: '', website: '', location: '', description: '', ...initialData });
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

      <input
        type="text"
        name="industry"
        placeholder="Industry"
        value={form.industry}
        onChange={handleChange}
        className="w-full border rounded px-3 py-2"
      />

      <input
        type="url"
        name="website"
        placeholder="Website URL"
        value={form.website}
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
