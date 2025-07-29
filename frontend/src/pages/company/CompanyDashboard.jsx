import { AuthContext } from "../../context/AuthContext";
import LoadingSpinner from "../../components/LoadingSpinner";
import LogoutButton from "../../components/LogoutButton";

const CompanyDashboard = () => {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Company Dashboard</h1>
      <p className="text-gray-600">Welcome! <br></br>Here you can post jobs, view applicants, and manage your listings.</p>
      {/* Add more cards/sections for analytics, job listings, etc. */}
      <div className="mt-6">
        <LogoutButton />
      </div>
      <AuthContext.Consumer>
        {({ user }) => (
          <div className="mt-4">
            <h2 className="text-xl font-semibold">Logged in as: {user?.name || "Guest"}</h2>
          </div>
        )}
      </AuthContext.Consumer>
      <LoadingSpinner />
    </div>
  );
};

export default CompanyDashboard;
