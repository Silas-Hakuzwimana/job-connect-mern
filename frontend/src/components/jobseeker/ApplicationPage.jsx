import React, { useEffect, useState, useContext } from "react";
import Applications from "./Applications";
import { getUserApplications } from "../../services/applicationService";
import { createNotification } from "../../services/notificationService";
import { AuthContext } from "../../context/AuthContext"; // example for user info

export default function ApplicationsPage() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useContext(AuthContext); // get logged in user info

  useEffect(() => {
    async function fetchApps() {
      try {
        setLoading(true);
        const data = await getUserApplications();

        const formattedApps = data.map((app) => ({
          _id: app._id,
          jobTitle: app.jobDetails?.title || "N/A",
          companyName: app.jobDetails?.company || "N/A",
          companyLocation: app.jobDetails?.location || "N/A",
          jobSalary: app.jobDetails?.salary || "N/A",
          jobType: app.jobDetails?.type || "N/A",
          status: app.status,
          createdAt: app.appliedAt || app.createdAt,
          coverLetter: app.coverLetter || "",
          resumeUrl: app.resumeUrl || "",
          applicantId: app.applicantDetails?._id || "N/A",
          applicantName: app.applicantDetails?.name || "N/A",
          applicantEmail: app.applicantDetails?.email || "N/A",
        }));

        setApplications(formattedApps);
      } catch {
        setError("Failed to load applications");

        if (user?.id) {
          try {
            await createNotification(
              user.id,
              "Failed to load your applications. Please try again later."
            );
          } catch (notifyErr) {
            console.error("Failed to create notification", notifyErr);
          }
        }
      } finally {
        setLoading(false);
      }
    }

    fetchApps();
  }, [user]);

  return <Applications applications={applications} loading={loading} error={error} />;
}
