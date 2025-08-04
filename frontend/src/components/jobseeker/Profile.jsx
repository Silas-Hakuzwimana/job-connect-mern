import { useEffect, useState } from 'react';
import { getJobseekerProfile  } from '../../services/jobseekerService';

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await getJobseekerProfile();
        setProfile(res.data);
      } catch (err) {
        console.error(err);
        setError('Failed to load profile.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []); // ✅ Only run on mount

  if (loading) return <p className="text-gray-500">Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="max-w-4xl mx-auto mt-8 bg-white shadow-md p-6 rounded-lg">
      <h2 className="text-xl font-bold mb-4">My Profile</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <p className="text-gray-600">Full Name</p>
          <p className="text-lg font-semibold">{profile.name}</p>
        </div>
        <div>
          <p className="text-gray-600">Email</p>
          <p className="text-lg font-semibold">{profile.email}</p>
        </div>
        <div>
          <p className="text-gray-600">Phone</p>
          <p className="text-lg font-semibold">{profile.phone}</p>
        </div>
        <div>
          <p className="text-gray-600">Location</p>
          <p className="text-lg font-semibold">{profile.location}</p>
        </div>
      </div>
    </div>
  );
}
