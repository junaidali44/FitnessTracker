import { useEffect, useState } from 'react';
import api from '../../api/client';
import toast from 'react-hot-toast';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';
import { BellIcon, CheckIcon, TrashIcon } from '@heroicons/react/24/outline';
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
      toast.error('Failed to load notifications');
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
    <div className="space-y-6 animate-fade-in max-w-3xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-display font-bold flex items-center gap-2">
            <BellIcon className="w-6 h-6 text-crimson-500" />
            Notifications
          </h1>
          {unreadCount > 0 && (
            <p className="text-sm text-text-secondary mt-1">{unreadCount} unread messages</p>
          )}
        </div>
        {unreadCount > 0 && (
          <button onClick={markAllRead} className="btn-secondary btn-sm">
            Mark all as read
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <EmptyState 
          title="No notifications" 
          message="You're all caught up! Check back later." 
        />
      ) : (
        <div className="space-y-3">
          {notifications.map(n => (
            <div 
              key={n._id} 
              className={`glass-card p-5 transition-all ${
                !n.read ? 'border-l-4 border-l-crimson-500 bg-black-elevated/80' : 'opacity-80'
              }`}
            >
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-semibold text-text-primary">{n.title}</span>
                    {!n.read && <span className="w-1.5 h-1.5 rounded-full bg-crimson-500" />}
                  </div>
                  <p className="text-sm text-text-secondary leading-relaxed">{n.message}</p>
                  <p className="text-xs text-text-muted mt-2">
                    {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}
                  </p>
                </div>
                <div className="flex gap-2">
                  {!n.read && (
                    <button onClick={() => markRead(n._id)} className="p-1.5 text-text-muted hover:text-emerald-400 bg-black-elevated rounded-lg transition-colors" title="Mark as read">
                      <CheckIcon className="w-4 h-4" />
                    </button>
                  )}
                  <button onClick={() => del(n._id)} className="p-1.5 text-text-muted hover:text-crimson-500 bg-black-elevated rounded-lg transition-colors" title="Delete">
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}