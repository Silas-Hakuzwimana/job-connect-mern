import { useEffect, useState } from "react";
import { Building2, MapPin, Mail, Phone, RefreshCw } from "lucide-react";
import LoadingSpinner from "../LoadingSpinner";
import { fetchMyCompanyProfile } from "../../services/companyApi";
import { toast } from "react-toastify";

const CompanyDetails = () => {
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadCompanyProfile = async () => {
    try {
      setLoading(true);
      const res = await fetchMyCompanyProfile();
      setCompany(res?.data || res); // handles both {data: ...} and plain response
    } catch (err) {
      console.error("Failed to load company profile:", err);
      toast.error("Failed to load company profile.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCompanyProfile();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner />
      </div>
    );
  }

  if (!company) {
    return (
      <div className="flex flex-col items-center gap-4 text-center text-gray-500">
        <p>No company profile found.</p>
        <button
          onClick={loadCompanyProfile}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
        >
          <RefreshCw className="w-4 h-4" />
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 flex flex-col items-center text-center max-w-md mx-auto">
      {/* Logo */}
      <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden mb-4">
        {company.logoUrl ? (
          <img
            src={company.logoUrl}
            alt={`${company.name} logo`}
            className="w-full h-full object-cover"
          />
        ) : (
          <Building2 className="w-12 h-12 text-gray-400" />
        )}
      </div>

      {/* Company Name */}
      <h2 className="text-2xl font-semibold text-gray-800">{company.name || "Company Name"}</h2>

      {/* Industry */}
      <p className="text-sm text-gray-500 mb-4">{company.industry || "Industry not specified"}</p>

      {/* Contact Details */}
      <div className="space-y-2 text-sm text-gray-600 w-full">
        {company.email && (
          <div className="flex items-center justify-center gap-2">
            <Mail className="w-4 h-4 text-gray-400" />
            {company.email}
          </div>
        )}
        {company.phone && (
          <div className="flex items-center justify-center gap-2">
            <Phone className="w-4 h-4 text-gray-400" />
            {company.phone}
          </div>
        )}
        {company.location && (
          <div className="flex items-center justify-center gap-2">
            <MapPin className="w-4 h-4 text-gray-400" />
            {company.location}
          </div>
        )}
      </div>

      {/* Refresh Button */}
      <button
        onClick={loadCompanyProfile}
        className="mt-6 flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
      >
        <RefreshCw className="w-4 h-4" />
        Refresh
      </button>
    </div>
  );
};

export default CompanyDetails;
