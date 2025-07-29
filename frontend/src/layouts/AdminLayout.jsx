import AdminHeader from "../components/headers/AdminHeader";
import AdminFooter from "../components/footers/AdminFooter";
import AdminNavbar from "../components/admin/AdminNavbar";
import { Outlet } from "react-router-dom";

export default function AdminLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <AdminHeader />
      <AdminNavbar />
      <main className="flex-1 bg-gray-50 p-6">
        <Outlet />
      </main>
      <AdminFooter />
    </div>
  );
}
