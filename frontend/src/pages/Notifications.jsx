import { useEffect, useState } from 'react';
import api from '../api/client';
import toast from 'react-hot-toast';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import { formatDistanceToNow } from 'date-fns';

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { load(); }, []);

  const load = async () => {
    try {
      const { data } = await api.get('/notifications?limit=50');
      setNotifications(data.data);
    } catch {
      toast.error('Failed to load');
    } finally {
      setLoading(false);
    }
  };

  const markRead = async (id) => {
    try {
      await api.put(`/notifications/${id}/read`);
      load();
    } catch {}
  };

  const markAllRead = async () => {
    try {
      await api.put('/notifications/read-all');
      toast.success('All marked as read');
      load();
    } catch {}
  };

  const del = async (id) => {
    try {
      await api.delete(`/notifications/${id}`);
      load();
    } catch {}
  };

  if (loading) return <LoadingSpinner />;

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">🔔 Notifications</h1>
          {unreadCount > 0 && <p className="text-sm text-gray-500">{unreadCount} unread</p>}
        </div>
        {unreadCount > 0 && (
          <button onClick={markAllRead} className="btn-secondary text-sm">Mark all read</button>
        )}
      </div>

      {notifications.length === 0 ? (
        <EmptyState icon="🔔" title="No notifications" message="You're all caught up!" />
      ) : (
        <div className="space-y-2">
          {notifications.map(n => (
            <div key={n._id} className={`card p-4 ${!n.read ? 'border-l-4 border-l-primary-500' : ''}`}>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <p className="font-semibold">{n.title}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{n.message}</p>
                  <p className="text-xs text-gray-400 mt-2">{formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}</p>
                </div>
                <div className="flex gap-1 ml-2">
                  {!n.read && (
                    <button onClick={() => markRead(n._id)} className="text-xs text-primary-500 hover:underline">Mark read</button>
                  )}
                  <button onClick={() => del(n._id)} className="text-xs text-red-500 hover:underline">Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}