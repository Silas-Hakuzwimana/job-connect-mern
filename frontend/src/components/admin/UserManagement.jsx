import { useEffect, useState, useMemo } from 'react';
import { fetchUsers, updateUserRole, deleteUser } from '../../services/adminApis';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { HiTrash, HiUserCircle } from 'react-icons/hi';

const ITEMS_PER_PAGE = 5;

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deletingUserId, setDeletingUserId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const res = await fetchUsers();
      setUsers(res.data);
    } catch (error) {
      console.log(error);
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleRoleChange = async (id, newRole) => {
    try {
      await updateUserRole(id, newRole);
      toast.success('User role updated');
      loadUsers();
    } catch {
      toast.error('Failed to update role');
    }
  };

  const confirmDelete = (id) => {
    setDeletingUserId(id);
  };

  const cancelDelete = () => {
    setDeletingUserId(null);
  };

  const handleDelete = async () => {
    if (!deletingUserId) return;
    try {
      await deleteUser(deletingUserId);
      toast.warn('User deleted');
      setDeletingUserId(null);
      loadUsers();
    } catch {
      toast.error('Failed to delete user');
    }
  };

  // Filter users by search term (name or email)
  const filteredUsers = useMemo(() => {
    return users.filter(user =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [users, searchTerm]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);
  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredUsers.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredUsers, currentPage]);

  // Handle page change
  const changePage = (pageNum) => {
    if (pageNum < 1 || pageNum > totalPages) return;
    setCurrentPage(pageNum);
  };

  return (
    <section className="max-w-6xl mx-auto p-6">
      <ToastContainer position="top-right" />
      <h2 className="text-3xl font-semibold mb-6 text-gray-900 flex items-center gap-2">
        <HiUserCircle size={28} /> User Management
      </h2>

      <input
        type="text"
        placeholder="Search by name or email"
        className="mb-4 w-full max-w-md border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        value={searchTerm}
        onChange={e => {
          setSearchTerm(e.target.value);
          setCurrentPage(1); // reset page on search
        }}
      />

      {loading ? (
        <p className="text-center text-gray-500">Loading users...</p>
      ) : (
        <>
          <div className="overflow-x-auto shadow-md rounded border border-gray-200">
            <table className="min-w-full bg-white">
              <thead className="bg-gray-100 text-gray-700">
                <tr>
                  <th className="py-3 px-5 text-left">Name</th>
                  <th className="py-3 px-5 text-left">Email</th>
                  <th className="py-3 px-5 text-left">Role</th>
                  <th className="py-3 px-5 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedUsers.length === 0 && (
                  <tr>
                    <td colSpan={4} className="text-center py-6 text-gray-500">
                      No users found.
                    </td>
                  </tr>
                )}

                {paginatedUsers.map(user => (
                  <tr
                    key={user._id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="py-3 px-5 border-b">{user.name}</td>
                    <td className="py-3 px-5 border-b">{user.email}</td>
                    <td className="py-3 px-5 border-b">
                      <select
                        className="border rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        value={user.role}
                        onChange={e => handleRoleChange(user._id, e.target.value)}
                      >
                        <option value="jobseeker">Job Seeker</option>
                        <option value="admin">Admin</option>
                        <option value="company">Company</option>
                      </select>
                    </td>
                    <td className="py-3 px-5 border-b">
                      <button
                        onClick={() => confirmDelete(user._id)}
                        aria-label="Delete user"
                        className="text-red-600 hover:text-red-800 transition"
                      >
                        <HiTrash size={20} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <nav className="mt-6 flex justify-center items-center space-x-2">
              <button
                onClick={() => changePage(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-3 py-1 rounded border ${
                  currentPage === 1
                    ? 'text-gray-400 border-gray-300 cursor-not-allowed'
                    : 'text-blue-600 border-blue-600 hover:bg-blue-100'
                }`}
              >
                Prev
              </button>

              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => changePage(i + 1)}
                  className={`px-3 py-1 rounded border ${
                    currentPage === i + 1
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'text-blue-600 border-blue-600 hover:bg-blue-100'
                  }`}
                >
                  {i + 1}
                </button>
              ))}

              <button
                onClick={() => changePage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`px-3 py-1 rounded border ${
                  currentPage === totalPages
                    ? 'text-gray-400 border-gray-300 cursor-not-allowed'
                    : 'text-blue-600 border-blue-600 hover:bg-blue-100'
                }`}
              >
                Next
              </button>
            </nav>
          )}
        </>
      )}

      {/* Delete confirmation modal */}
      {deletingUserId && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-sm w-full p-6">
            <h3 className="text-xl font-semibold mb-4">Confirm Delete</h3>
            <p className="mb-6">Are you sure you want to delete this user?</p>
            <div className="flex justify-end gap-4">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 rounded border border-gray-300 hover:bg-gray-100 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
