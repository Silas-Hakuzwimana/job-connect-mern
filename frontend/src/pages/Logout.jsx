import { useContext, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { AuthContext } from "../context/AuthContext";
import LoadingSpinner from "../components/LoadingSpinner";

export default function Logout() {
  const { logout } = useContext(AuthContext);

  const handleLogout = async () => {
    try {
      await axios.get("/api/auth/logout", { withCredentials: true });
      logout(); 
      toast.success("Logged out successfully");
      window.location.href = "/";
    } catch (error) {
      toast.error(`Logout failed: ${error.message}`);
    }
  };

  useEffect(() => {
    handleLogout();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <LoadingSpinner />; 
}
