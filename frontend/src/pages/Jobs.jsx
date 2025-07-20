import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import JobCard from "../components/JobCard";
import axios from "axios";

export default function Jobs() {
    const { user } = useContext(AuthContext);
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const res = await axios.get("http://localhost:5000/api/jobs");
                const data = res.data;

                console.log("Jobs data:", data);

                if (Array.isArray(data)) {
                    setJobs(data);
                } else {
                    console.error("Unexpected data format:", data);
                }
            } catch (error) {
                console.error("Error fetching jobs:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchJobs();
    }, []);

    if (loading) {
        return <div className="max-w-7xl mx-auto p-4">Loading jobs...</div>;
    }

    return (
        <div className="max-w-7xl mx-auto p-4">
            <h1 className="text-3xl font-semibold mb-4">Available Jobs</h1>

            {loading && <div>Loading jobs...</div>}
            {jobs.length === 0 ? (
                <div className="text-gray-500">
                    <p>No jobs available at the moment.</p>
                </div>
            ) : (
                <div className="text-gray-500 mb-4">
                    <p>Found {jobs.length} job(s).</p>
                </div>
            )}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {jobs.map((job) => {
                    const isQualified =
                        user?.qualifications?.some((q) =>
                            job.requirements.includes(q)
                        ) ?? false;
                    return <JobCard key={job._id} job={job} isQualified={isQualified} />;
                })}
            </div>
        </div>
    );
}
