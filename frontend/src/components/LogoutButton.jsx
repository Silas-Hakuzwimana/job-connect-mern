// src/components/LogoutButton.jsx
import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import axios from "axios";

const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post(
        "http://localhost:5000/api/auth/logout",
        {},
        { withCredentials: true }
      );

      // Clear stored user data
      localStorage.removeItem("user");

      // Redirect to home page
      navigate("/");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="flex items-center px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg shadow hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1 transition"
    >
      <LogOut className="w-4 h-4 mr-2" />
      Logout
    </button>
  );
};

export default LogoutButton;
