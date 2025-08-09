import React, { useEffect, useState } from "react";
import Applications from "./Applications";
import { getUserApplications } from "../../services/applicationService";

export default function ApplicationsPage() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchApps() {
      try {
        setLoading(true);
        const data = await getUserApplications();

        // Normalize API data for your component
        const formattedApps = data.map((app) => ({
          _id: app._id,
          // Use embedded jobDetails instead of job
          jobTitle: app.jobDetails?.title || "N/A",
          companyName: app.jobDetails?.company || "N/A",
          companyLocation: app.jobDetails?.location || "N/A",
          jobSalary: app.jobDetails?.salary || "N/A",
          jobType: app.jobDetails?.type || "N/A",
          status: app.status,
          createdAt: app.appliedAt || app.createdAt,
          // Optional: add more fields if needed, e.g.
          location: app.jobDetails?.location || "N/A",
          coverLetter: app.coverLetter || "",
          resumeUrl: app.resumeUrl || "",
          // Applicant details if you want to show them
          applicantName: app.applicantDetails?.name || "N/A",
          applicantEmail: app.applicantDetails?.email || "N/A",
        }));

        setApplications(formattedApps);
      } catch {
        setError("Failed to load applications");
      } finally {
        setLoading(false);
      }
    }

    fetchApps();
  }, []);

  return <Applications applications={applications} loading={loading} error={error} />;
}
