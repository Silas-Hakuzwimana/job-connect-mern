import React, { useState, useEffect } from "react";

export default function CompanyForm({ initialData = {}, onSave, onCancel }) {
  const [form, setForm] = useState({
    name: "",
    industry: "",
    website: "",
    location: "",
    description: "",
    ...initialData,
  });

  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setForm({ name: "", industry: "", website: "", location: "", description: "", ...initialData });
  }, [initialData]);

  // Validate form
  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = "Company name is required";
    if (form.website && !/^https?:\/\/\S+\.\S+/.test(form.website)) errs.website = "Website must be a valid URL";
    if (form.description && form.description.length > 500) errs.description = "Description cannot exceed 500 characters";
    return errs;
  };

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors(prev => ({ ...prev, [e.target.name]: "" })); // Clear error on change
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setSaving(true);
    try {
      await onSave({
        ...form,
        name: form.name.trim(),
        industry: form.industry.trim(),
        website: form.website.trim(),
        location: form.location.trim(),
        description: form.description.trim(),
      });
    } catch (err) {
      console.error("Save failed:", err);
      alert("Failed to save company. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-xl shadow-md max-w-md mx-auto space-y-4"
    >
      <h3 className="text-2xl font-semibold text-gray-800">{initialData._id ? "Edit Company" : "Add Company"}</h3>

      <div className="space-y-1">
        <input
          type="text"
          name="name"
          placeholder="Company Name"
          value={form.name}
          onChange={handleChange}
          className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.name ? "border-red-500" : "border-gray-300"}`}
          required
        />
        {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
      </div>

      <div className="space-y-1">
        <input
          type="text"
          name="industry"
          placeholder="Industry"
          value={form.industry}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-300"
        />
      </div>

      <div className="space-y-1">
        <input
          type="url"
          name="website"
          placeholder="Website URL"
          value={form.website}
          onChange={handleChange}
          className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.website ? "border-red-500" : "border-gray-300"}`}
        />
        {errors.website && <p className="text-red-500 text-sm">{errors.website}</p>}
      </div>

      <div className="space-y-1">
        <input
          type="text"
          name="location"
          placeholder="Location"
          value={form.location}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-300"
        />
      </div>

      <div className="space-y-1">
        <textarea
          name="description"
          placeholder="Description (max 500 chars)"
          value={form.description}
          onChange={handleChange}
          rows={4}
          className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none ${errors.description ? "border-red-500" : "border-gray-300"}`}
        />
        {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border rounded hover:bg-gray-100 transition"
          disabled={saving}
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={saving}
          className={`px-4 py-2 rounded text-white bg-blue-600 hover:bg-blue-700 transition ${saving ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          {saving ? "Saving..." : "Save"}
        </button>
      </div>
    </form>
  );
}
