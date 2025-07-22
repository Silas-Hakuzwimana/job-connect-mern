import AdminHeader from "../components/headers/AdminHeader";
import AdminFooter from "../components/footers/AdminFooter";
import AdminNavbar from "../components/admin/AdminNavbar";

export default function AdminLayout({ children }) {
    return (
        <div className="min-h-screen flex flex-col">
            <AdminHeader />
            <AdminNavbar />
            <main className="flex-1 bg-gray-50 p-6">{children}</main>
            <AdminFooter />
        </div>
    );
}
