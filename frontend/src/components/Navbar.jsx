import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);

  return (
    <nav className="bg-white shadow p-4 flex justify-between max-w-7xl mx-auto">
      <Link to="/" className="text-xl font-bold text-blue-600">
        JobConnect
      </Link>
      <div className="space-x-4">
        <Link to="/jobs" className="hover:text-blue-600">
          Jobs
        </Link>

        {!user && (
          <>
            <Link to="/login" className="hover:text-blue-600">
              Login
            </Link>
            <Link to="/register" className="hover:text-blue-600">
              Register
            </Link>
          </>
        )}

        {user && (
          <>
            {user.role === "admin" && (
              <Link to="/admin" className="hover:text-blue-600">
                Admin Dashboard
              </Link>
            )}
            <button onClick={logout} className="hover:text-red-600">
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
