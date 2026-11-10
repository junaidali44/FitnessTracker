import { useEffect, useState } from 'react';
import api from '../../api/client';
import toast from 'react-hot-toast';
import LoadingSpinner from '../../components/LoadingSpinner';
import { TrashIcon } from '@heroicons/react/24/outline';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [role, setRole] = useState('');

  useEffect(() => { load(); }, [search, role]);

  const load = async () => {
    setLoading(true);
    try {
      const params = { limit: 50 };
      if (search) params.search = search;
      if (role) params.role = role;
      const { data } = await api.get('/admin/users', { params });
      setUsers(data.data);
    } catch {
      toast.error('Failed to load');
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (id, name) => {
    if (!confirm(`Delete ${name}? This will delete all their data.`)) return;
    try {
      await api.delete(`/admin/users/${id}`);
      toast.success('User deleted');
      load();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed');
    }
  };

  const changeRole = async (id, newRole) => {
    try {
      await api.put(`/admin/users/${id}/role`, { role: newRole });
      toast.success('Role updated');
      load();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed');
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6 animate-fadeIn">
      <h1 className="text-2xl font-bold">👥 Users</h1>

      <div className="card p-4 flex gap-3 flex-wrap">
        <input className="input flex-1 min-w-[200px]" placeholder="Search by name or email..." value={search} onChange={(e) => setSearch(e.target.value)} />
        <select className="input max-w-xs" value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="">All Roles</option>
          <option value="User">User</option>
          <option value="Admin">Admin</option>
        </select>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="text-left p-3">Name</th>
                <th className="text-left p-3">Email</th>
                <th className="text-left p-3">Role</th>
                <th className="text-left p-3">Joined</th>
                <th className="text-left p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u._id} className="border-t border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <td className="p-3 font-medium">{u.fullName}</td>
                  <td className="p-3 text-gray-600 dark:text-gray-400">{u.email}</td>
                  <td className="p-3">
                    <select
                      value={u.role}
                      onChange={(e) => changeRole(u._id, e.target.value)}
                      className="text-xs px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800"
                    >
                      <option value="User">User</option>
                      <option value="Admin">Admin</option>
                    </select>
                  </td>
                  <td className="p-3 text-gray-500 text-xs">{new Date(u.createdAt).toLocaleDateString()}</td>
                  <td className="p-3">
                    <button onClick={() => deleteUser(u._id, u.fullName)} className="p-1.5 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30 rounded">
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {users.length === 0 && <div className="text-center p-8 text-gray-500">No users found</div>}
      </div>
    </div>
  );
}