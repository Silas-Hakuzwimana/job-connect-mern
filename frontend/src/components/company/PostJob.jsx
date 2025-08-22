import { useState, useContext, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { createJob } from "../../services/jobService";
import { fetchMyCompanyProfile } from "../../services/companyApi";
import LoadingSpinner from "../LoadingSpinner";

const PostJob = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    salary: "",
    type: "full-time",
    qualifications: [""],
    deadline: "",
  });
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [companyProfile, setCompanyProfile] = useState(null);

  // Check company approval status
  useEffect(() => {
    const checkApproval = async () => {
      if (!user || user.role !== "employer") {
        setLoading(false);
        return;
      }
      try {
        const company = await fetchMyCompanyProfile();
        if (!company?._id || company.status !== "approved") {
          toast.error(
            !company?._id
              ? "Company profile not found."
              : "Your company account is not approved yet. Cannot post jobs."
          );
          navigate("/company/dashboard");
          return;
        }
        setCompanyProfile(company); // only set if approved
      } catch (err) {
        console.error(err);
        toast.error("Failed to verify company approval status.");
        navigate("/company/dashboard");
      } finally {
        setLoading(false);
      }
    };

    checkApproval();
  }, [user, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleQualificationChange = (index, value) => {
    const updated = [...formData.qualifications];
    updated[index] = value;
    setFormData((prev) => ({ ...prev, qualifications: updated }));
  };

  const addQualification = () => {
    setFormData((prev) => ({ ...prev, qualifications: [...prev.qualifications, ""] }));
  };

  const removeQualification = (index) => {
    if (formData.qualifications.length === 1) return;
    const updated = [...formData.qualifications];
    updated.splice(index, 1);
    setFormData((prev) => ({ ...prev, qualifications: updated }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!companyProfile) return; // already handled by useEffect
    setSaving(true);

    try {
      const payload = {
        ...formData,
        salary: Number(formData.salary),
        company: companyProfile._id,
        postedBy: user.id,
      };

      await createJob(payload);
      toast.success("Job posted successfully!");
      navigate("/company/dashboard/jobs");
    } catch (err) {
      console.error("Failed to post job:", err);
      toast.error("Failed to post job. Check your inputs.");
    } finally {
      setSaving(false);
    }
  };

  if (!user || loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500">{loading ? "Checking company approval..." : "You must be logged in to post a job."}</p>
      </div>
    );
  }

  // Only render form if company is approved
  if (!companyProfile) return null;

  return (
    <div className="max-w-3xl mx-auto bg-white shadow-md rounded-xl p-6 mt-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Post a New Job</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Job Title */}
        <InputField label="Job Title" name="title" value={formData.title} onChange={handleChange} required />

        {/* Description */}
        <TextAreaField label="Description" name="description" value={formData.description} onChange={handleChange} required />

        {/* Location & Salary */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <InputField label="Location" name="location" value={formData.location} onChange={handleChange} required />
          <InputField label="Salary" name="salary" value={formData.salary} onChange={handleChange} required type="number" />
        </div>

        {/* Job Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Job Type</label>
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2"
          >
            <option value="full-time">Full-time</option>
            <option value="part-time">Part-time</option>
            <option value="contract">Contract</option>
          </select>
        </div>

        {/* Qualifications */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Qualifications</label>
          {formData.qualifications.map((qual, idx) => (
            <div key={idx} className="flex items-center gap-2 mb-2">
              <input
                type="text"
                value={qual}
                onChange={(e) => handleQualificationChange(idx, e.target.value)}
                required
                className="flex-1 border border-gray-300 rounded-md p-2"
              />
              <button
                type="button"
                onClick={() => removeQualification(idx)}
                className="px-2 py-1 bg-red-500 text-white rounded-md hover:bg-red-600"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addQualification}
            className="px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600 mt-1"
          >
            Add Qualification
          </button>
        </div>

        {/* Deadline */}
        <InputField
          label="Application Deadline"
          name="deadline"
          value={formData.deadline}
          onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
          required
          type="date"
          min={new Date().toISOString().split("T")[0]}
        />

        {/* Submit */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
          >
            {saving && <LoadingSpinner size={5} />}
            {saving ? "Posting..." : "Post Job"}
          </button>
        </div>
      </form>
    </div>
  );
};

// Reusable Input Field Component
const InputField = ({ label, name, value, onChange, required, type = "text", min }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      min={min}
      className="w-full border border-gray-300 rounded-md p-2"
    />
  </div>
);

// Reusable TextArea Field Component
const TextAreaField = ({ label, name, value, onChange, required, rows = 4 }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <textarea
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      rows={rows}
      className="w-full border border-gray-300 rounded-md p-2 resize-none"
    />
  </div>
);

export default PostJob;
