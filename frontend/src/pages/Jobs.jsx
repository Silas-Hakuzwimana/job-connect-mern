import { useEffect, useState } from "react";
import JobCard from "../components/JobCard";
import { fetchJobs, fetchQualificationFlags } from "../services/jobService";
import { flagApplication } from "../services/applicationService";

export default function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const loadJobsAndFlags = async () => {
      setLoading(true);
      setError(null);

      try {
        // 1. Fetch all active & approved jobs
        const allJobs = await fetchJobs();

        // 2. Extract all job IDs
        const jobIds = allJobs.map(job => job._id);

        // 3. Fetch qualification flags for these job IDs
        const flags = await fetchQualificationFlags(jobIds);

        // 4. Fetch applied flags (new API)
        const appliedFlags = await flagApplication(jobIds);

        // 5. Combine jobs with their qualification flag
        const combinedJobs = allJobs.map(job => ({
          ...job,
          qualified: !!flags[job._id], // true or false
          applied: !!appliedFlags[job._id],
        }));

        setJobs(combinedJobs);
        setFilteredJobs(combinedJobs);
      } catch (err) {
        console.error("Failed to load jobs or flags:", err);
        setError("Failed to load jobs. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    loadJobsAndFlags();
  }, []);

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    const filtered = jobs.filter(
      (job) =>
        job.title?.toLowerCase().includes(query) ||
        job.company?.toLowerCase().includes(query) ||
        job.description?.toLowerCase().includes(query)
    );

    setFilteredJobs(filtered);
  };

  return (
    <div className="max-w-7xl mx-auto p-4">
      <h1 className="text-3xl font-semibold mb-6 text-center">
        Available Jobs For Approved Companies
      </h1>

      <input
        type="text"
        placeholder="Search by job title, company, or description..."
        value={searchQuery}
        onChange={handleSearch}
        className="w-full mb-6 px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      {loading && <div>Loading jobs...</div>}

      {error && <div className="text-red-600 mb-4">{error}</div>}

      {!loading && !error && filteredJobs.length === 0 && (
        <div className="text-gray-500">No jobs found matching your search.</div>
      )}

      {!loading && !error && filteredJobs.length > 0 && (
        <>
          <div className="text-gray-600 mb-4">
            Found {filteredJobs.length} job{filteredJobs.length !== 1 ? "s" : ""}.
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredJobs.map((job) => (
              <JobCard key={job._id} job={job} isQualified={job.qualified} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
