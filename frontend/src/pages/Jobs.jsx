import { useEffect, useState } from "react";
import JobCard from "../components/JobCard";
import { fetchJobs, fetchQualificationFlags } from "../services/jobService";
import { flagApplication } from "../services/applicationService";

export default function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Search & filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [jobTypeFilter, setJobTypeFilter] = useState("all");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 3;

  useEffect(() => {
    const loadJobsAndFlags = async () => {
      setLoading(true);
      setError(null);

      try {
        const allJobs = await fetchJobs();
        const jobIds = allJobs.map((job) => job._id);

        const flags = await fetchQualificationFlags(jobIds);
        const appliedFlags = await flagApplication(jobIds);

        const combinedJobs = allJobs.map((job) => ({
          ...job,
          qualified: !!flags[job._id],
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

  // Apply search and filter together
  useEffect(() => {
    let filtered = jobs;

    // Filter by job type
    if (jobTypeFilter !== "all") {
      filtered = filtered.filter((job) => job.type === jobTypeFilter);
    }

    // Filter by search query
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (job) =>
          job.title?.toLowerCase().includes(query) ||
          job.company?.toLowerCase().includes(query) ||
          job.description?.toLowerCase().includes(query)
      );
    }

    setFilteredJobs(filtered);
    setCurrentPage(1); // Reset to first page on filter/search change
  }, [jobs, jobTypeFilter, searchQuery]);

  // Pagination calculations
  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = filteredJobs.slice(indexOfFirstJob, indexOfLastJob);
  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);

  return (
    <div className="max-w-7xl mx-auto p-4">
      <h1 className="text-3xl font-semibold mb-6 text-center">
        Available Jobs For Approved Companies
      </h1>

      {/* Filters */}
      <div className="flex flex-col md:flex-row md:space-x-4 mb-6">
        <input
          type="text"
          placeholder="Search by job title, company, or description..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full md:flex-1 mb-4 md:mb-0 px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <select
          value={jobTypeFilter}
          onChange={(e) => setJobTypeFilter(e.target.value)}
          className="w-full md:w-48 px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Job Types</option>
          <option value="full-time">Full-time</option>
          <option value="part-time">Part-time</option>
          <option value="contract">Contract</option>
          {/* Add more options if your job data has more types */}
        </select>
      </div>

      {loading && <div>Loading jobs...</div>}

      {error && <div className="text-red-600 mb-4">{error}</div>}

      {!loading && !error && filteredJobs.length === 0 && (
        <div className="text-gray-500">No jobs found matching your criteria.</div>
      )}

      {!loading && !error && filteredJobs.length > 0 && (
        <>
          <div className="text-gray-600 mb-4">
            Found {filteredJobs.length} job
            {filteredJobs.length !== 1 ? "s" : ""}.
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {currentJobs.map((job) => (
              <JobCard key={job._id} job={job} isQualified={job.qualified} />
            ))}
          </div>

          {/* Pagination Controls */}
          <div className="flex justify-center mt-6 space-x-2">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => prev - 1)}
              className={`px-3 py-1 border rounded-md ${currentPage === 1
                  ? "text-gray-400 border-gray-300"
                  : "text-blue-600 border-blue-400 hover:bg-blue-50"
                }`}
            >
              Previous
            </button>

            {Array.from({ length: totalPages }, (_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentPage(idx + 1)}
                className={`px-3 py-1 border rounded-md ${currentPage === idx + 1
                    ? "bg-blue-500 text-white"
                    : "text-blue-600 border-blue-400 hover:bg-blue-50"
                  }`}
              >
                {idx + 1}
              </button>
            ))}

            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((prev) => prev + 1)}
              className={`px-3 py-1 border rounded-md ${currentPage === totalPages
                  ? "text-gray-400 border-gray-300"
                  : "text-blue-600 border-blue-400 hover:bg-blue-50"
                }`}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}
