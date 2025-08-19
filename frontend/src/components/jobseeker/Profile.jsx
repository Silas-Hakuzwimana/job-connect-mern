import { useEffect, useState } from "react";
import { getJobseekerProfile } from "../../services/jobseekerService";

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await getJobseekerProfile();
        setProfile(res.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load profile.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) return <p className="text-gray-500 text-center mt-8">Loading profile...</p>;
  if (error) return <p className="text-red-500 text-center mt-8">{error}</p>;

  return (
    <div className="max-w-4xl mx-auto mt-10 bg-white shadow-lg rounded-xl p-8">
      <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
        {/* Profile Picture */}
        <div className="flex-shrink-0">
          <img
            src={profile.profilePic || "/default-profile.png"}
            alt="Profile"
            className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover border-2 border-gray-200 shadow-sm"
          />
        </div>

        {/* Profile Details */}
        <div className="flex-1 w-full grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <p className="text-gray-500 text-sm uppercase">Full Name</p>
            <p className="text-gray-800 font-semibold text-lg">{profile.name}</p>
          </div>
          <div>
            <p className="text-gray-500 text-sm uppercase">Email</p>
            <p className="text-gray-800 font-semibold text-lg">{profile.email}</p>
          </div>
          <div>
            <p className="text-gray-500 text-sm uppercase">Phone</p>
            <p className="text-gray-800 font-semibold text-lg">{profile.phone || "-"}</p>
          </div>
          <div>
            <p className="text-gray-500 text-sm uppercase">Location</p>
            <p className="text-gray-800 font-semibold text-lg">{profile.location || "-"}</p>
          </div>
          {profile.bio && (
            <div className="sm:col-span-2">
              <p className="text-gray-500 text-sm uppercase">Bio</p>
              <p className="text-gray-800 font-medium">{profile.bio}</p>
            </div>
          )}
        </div>
      </div>

      {/* Optional Action Buttons */}
      <div className="mt-6 flex gap-3">
        <button className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
          Edit Profile
        </button>
        <button className="px-5 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition">
          Change Password
        </button>
      </div>
    </div>
  );
}
