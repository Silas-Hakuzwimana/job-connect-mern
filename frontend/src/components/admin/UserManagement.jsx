import { useEffect, useState } from 'react';
import { fetchUsers, updateUserRole, deleteUser } from '../../services/adminApis';

export default function UserManagement() {
  const [users, setUsers] = useState([]);

  const loadUsers = async () => {
    const res = await fetchUsers();
    setUsers(res.data);
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleRoleChange = async (id, newRole) => {
    await updateUserRole(id, newRole);
    loadUsers();
  };

  const handleDelete = async (id) => {
    if (confirm('Delete this user?')) {
      await deleteUser(id);
      loadUsers();
    }
  };

  return (
    <section>
      <h2 className="text-xl font-semibold mb-2">User Management</h2>
      <table className="w-full text-left border">
        <thead>
          <tr className="bg-gray-100">
            <th>Name</th><th>Email</th><th>Role</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user._id}>
              <td>{user.name}</td><td>{user.email}</td>
              <td>
                <select
                  value={user.role}
                  onChange={(e) => handleRoleChange(user._id, e.target.value)}
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                  <option value="company">Company</option>
                </select>
              </td>
              <td>
                <button onClick={() => handleDelete(user._id)} className="text-red-500">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
