import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/client';
import toast from 'react-hot-toast';
import LoadingSpinner from '../../components/LoadingSpinner';
import StatCard from '../../components/StatCard';

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/dashboard')
      .then(res => setData(res.data.data))
      .catch(() => toast.error('Failed to load'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;
  if (!data) return null;

  return (
    <div className="space-y-6 animate-fadeIn">
      <h1 className="text-2xl font-bold">🛡️ Admin Dashboard</h1>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard icon="" label="Total Users" value={data.stats.totalUsers} subtitle={`+${data.stats.newUsersThisWeek} this week`} color="blue" />
        <StatCard icon="" label="Total Workouts" value={data.stats.totalWorkouts} color="orange" />
        <StatCard icon="" label="Total Meals" value={data.stats.totalNutrition} color="primary" />
        <StatCard icon="" label="Pending Feedback" value={data.stats.pendingFeedback} subtitle={`${data.stats.totalFeedback} total`} color="red" />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="card p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-bold">Recent Feedback</h2>
            <Link to="/admin/feedback" className="text-sm text-primary-500">View all →</Link>
          </div>
          {data.recentFeedback?.length > 0 ? (
            <div className="space-y-2">
              {data.recentFeedback.map(f => (
                <div key={f._id} className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <p className="font-medium text-sm">{f.subject}</p>
                  <p className="text-xs text-gray-500">{f.user?.fullName} • {f.type}</p>
                </div>
              ))}
            </div>
          ) : <p className="text-sm text-gray-500">No feedback yet</p>}
        </div>

        <div className="card p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-bold">Most Active Users</h2>
            <Link to="/admin/users" className="text-sm text-primary-500">View all →</Link>
          </div>
          {data.activeUsers?.length > 0 ? (
            <div className="space-y-2">
              {data.activeUsers.map(u => (
                <div key={u._id} className="flex justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <div>
                    <p className="font-medium text-sm">{u.user.fullName}</p>
                    <p className="text-xs text-gray-500">{u.user.email}</p>
                  </div>
                  <span className="text-sm font-bold text-orange-500">{u.workoutCount} 🔥</span>
                </div>
              ))}
            </div>
          ) : <p className="text-sm text-gray-500">No activity</p>}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <Link to="/admin/users" className="card p-6 hover:shadow-md transition-shadow text-center">
          <div className="text-4xl mb-2">👥</div>
          <p className="font-bold">Manage Users</p>
        </Link>
        <Link to="/admin/feedback" className="card p-6 hover:shadow-md transition-shadow text-center">
          <div className="text-4xl mb-2">💬</div>
          <p className="font-bold">Manage Feedback</p>
        </Link>
      </div>
    </div>
  );
}