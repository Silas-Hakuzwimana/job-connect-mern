import { useContext, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { AuthContext } from "../context/AuthContext";

export default function Logout() {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const hasLoggedOut = useRef(false); // ✅ guard

  useEffect(() => {
    const handleLogout = async () => {
      if (hasLoggedOut.current) return; // ✅ prevent double call
      hasLoggedOut.current = true;

      try {
        await axios.get("/api/auth/logout", { withCredentials: true });
        logout();
        toast.success("Logged out successfully");
      } catch (error) {
        toast.error(`Logout failed: ${error.message}`);
      } finally {
        navigate("/login"); // move navigation to finally to ensure it happens once
      }
    };

    handleLogout();
  }, [logout, navigate]);

  return null; // or return <LoadingSpinner />
}
