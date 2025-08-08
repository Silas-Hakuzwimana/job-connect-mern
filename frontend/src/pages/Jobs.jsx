import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import JobCard from "../components/JobCard";
import { fetchJobs as fetchJobsFromAPI } from "../services/jobService";

export default function Jobs() {
    const { user } = useContext(AuthContext);
    const [jobs, setJobs] = useState([]);
    const [filteredJobs, setFilteredJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        const loadJobs = async () => {
            try {
                const jobData = await fetchJobsFromAPI();

                if (Array.isArray(jobData)) {
                    const sortedJobs = sortByQualificationMatch(jobData);
                    setJobs(sortedJobs);
                    setFilteredJobs(sortedJobs);
                } else {
                    console.error("Invalid job data format:", jobData);
                }
            } catch (err) {
                console.error("Failed to fetch jobs:", err);
            } finally {
                setLoading(false);
            }
        };

        loadJobs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const sortByQualificationMatch = (jobList) => {
        return jobList
            .map((job) => {
                const matchCount = user?.qualifications?.filter((q) =>
                    job.requirements.includes(q)
                )?.length || 0;
                return { ...job, matchCount };
            })
            .sort((a, b) => b.matchCount - a.matchCount);
    };

    const handleSearch = (e) => {
        const query = e.target.value.toLowerCase();
        setSearchQuery(query);

        const filtered = jobs.filter((job) =>
            job.title?.toLowerCase().includes(query) ||
            job.description?.toLowerCase().includes(query) ||
            job.company?.toLowerCase().includes(query)
        );

        const sorted = sortByQualificationMatch(filtered);
        setFilteredJobs(sorted);
    };

    return (
        <div className="max-w-7xl mx-auto p-4">
            <h1 className="text-3xl font-semibold mb-4">Available Jobs</h1>

            <input
                type="text"
                placeholder="Search by job title, company, or description..."
                value={searchQuery}
                onChange={handleSearch}
                className="w-full mb-6 px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            {loading ? (
                <div>Loading jobs...</div>
            ) : filteredJobs.length === 0 ? (
                <div className="text-gray-500">No jobs found matching your search.</div>
            ) : (
                <div className="text-gray-600 mb-4">
                    Found {filteredJobs.length} job{filteredJobs.length !== 1 ? "s" : ""}.
                </div>
            )}

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredJobs.map((job) => (
                    <JobCard key={job._id} job={job} isQualified={job.matchCount > 0} />
                ))}
            </div>
        </div>
    );
}
