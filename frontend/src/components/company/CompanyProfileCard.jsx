import { useEffect, useState } from "react";
import { Building2, MapPin, Mail, Phone, X } from "lucide-react";
import { updateMyCompanyProfile } from "../../services/companyApi";
import { toast } from "react-toastify";

const CompanyProfileCard = ({ company }) => {
  const [profile, setProfile] = useState(company || null);
  const [editOpen, setEditOpen] = useState(false);
  const [formData, setFormData] = useState(company || {});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setProfile(company);
    setFormData(company);
  }, [company]);


  const handleSave = () => {
    setSaving(true);
    updateMyCompanyProfile(formData)
      .then((res) => {
        setProfile(res.data);
        toast.success("Profile updated successfully!");
        setEditOpen(false);
      })
      .catch((err) => {
        console.error(err);
        toast.error("Failed to update profile.");
      })
      .finally(() => setSaving(false));
  };

  if (!profile) return <div>No profile found.</div>;

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm p-6 flex flex-col items-center text-center max-w-md mx-auto">
        {/* Logo */}
        <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden mb-4">
          {profile.logoUrl ? (
            <img
              src={profile.logoUrl}
              alt={`${profile.name} logo`}
              className="w-full h-full object-cover"
            />
          ) : (
            <Building2 className="w-10 h-10 text-gray-400" />
          )}
        </div>

        {/* Company Name */}
        <h2 className="text-lg font-semibold text-gray-800">{profile.name || "Company Name"}</h2>

        {/* Industry */}
        <p className="text-sm text-gray-500 mb-4">{profile.industry || "Industry not set"}</p>

        {/* Details */}
        <div className="space-y-2 text-sm text-gray-600 w-full">
          {profile.location && (
            <div className="flex items-center justify-center gap-2">
              <MapPin className="w-4 h-4 text-gray-400" />
              {profile.location}
            </div>
          )}
          {profile.email && (
            <div className="flex items-center justify-center gap-2">
              <Mail className="w-4 h-4 text-gray-400" />
              {profile.email}
            </div>
          )}
          {profile.phone && (
            <div className="flex items-center justify-center gap-2">
              <Phone className="w-4 h-4 text-gray-400" />
              {profile.phone}
            </div>
          )}
        </div>

        {/* Edit Profile Button */}
        <button
          onClick={() => setEditOpen(true)}
          className="mt-6 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg shadow-sm transition"
        >
          Edit Profile
        </button>
      </div>

      {/* Edit Modal */}
      {editOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
            <button
              onClick={() => setEditOpen(false)}
              className="absolute top-3 right-3 text-gray-600 hover:text-gray-900"
              aria-label="Close modal"
            >
              <X size={20} />
            </button>

            <h3 className="text-xl font-semibold mb-4 text-gray-800">Edit Company Profile</h3>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSave();
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  value={formData.name || ""}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full border border-gray-300 rounded-md p-2"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Industry</label>
                <input
                  type="text"
                  value={formData.industry || ""}
                  onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                  className="w-full border border-gray-300 rounded-md p-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <input
                  type="text"
                  value={formData.location || ""}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full border border-gray-300 rounded-md p-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={formData.email || ""}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full border border-gray-300 rounded-md p-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input
                  type="tel"
                  value={formData.phone || ""}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full border border-gray-300 rounded-md p-2"
                />
              </div>

              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setEditOpen(false)}
                  className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100"
                  disabled={saving}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                  disabled={saving}
                >
                  {saving ? "Saving..." : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default CompanyProfileCard;
