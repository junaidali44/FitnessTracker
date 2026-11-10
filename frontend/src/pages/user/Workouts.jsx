import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/client';
import toast from 'react-hot-toast';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';
import { WORKOUT_CATEGORIES } from '../../utils/constants';
import { PencilSquareIcon, TrashIcon, PlusIcon } from '@heroicons/react/24/outline';

export default function Workouts() {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [search, setSearch] = useState('');
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    loadData();
  }, [filter, search]);

  const loadData = async () => {
    setLoading(true);
    try {
      const params = { limit: 50 };
      if (filter) params.category = filter;
      if (search) params.search = search;
      const [wRes, aRes] = await Promise.all([
        api.get('/workouts', { params }),
        api.get('/workouts/analytics')
      ]);
      setWorkouts(wRes.data.data);
      setAnalytics(aRes.data.data);
    } catch {
      toast.error('Failed to load workouts');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this workout?')) return;
    try {
      await api.delete(`/workouts/${id}`);
      toast.success('Deleted');
      loadData();
    } catch {
      toast.error('Delete failed');
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">🔥 Workouts</h1>
          {analytics && (
            <p className="text-sm text-gray-500 mt-1">
              {analytics.totalWorkouts} total • {analytics.totalDuration} min • {analytics.totalCalories} cal
            </p>
          )}
        </div>
        <Link to="/workouts/new" className="btn-primary flex items-center gap-2">
          <PlusIcon className="w-5 h-5" /> New Workout
        </Link>
      </div>

      <div className="card p-4 flex flex-wrap gap-3">
        <input className="input flex-1 min-w-[200px]" placeholder="Search workouts..." value={search} onChange={(e) => setSearch(e.target.value)} />
        <select className="input max-w-xs" value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="">All Categories</option>
          {WORKOUT_CATEGORIES.map(c => <option key={c}>{c}</option>)}
        </select>
      </div>

      {workouts.length === 0 ? (
        <EmptyState
          icon="🏋️"
          title="No workouts yet"
          message="Log your first workout to get started!"
          action={<Link to="/workouts/new" className="btn-primary">Log Workout</Link>}
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {workouts.map(w => (
            <div key={w._id} className="card p-5 hover:shadow-md transition-all">
              <div className="flex justify-between items-start">
                <div>
                  <span className="inline-block px-2 py-0.5 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 rounded text-xs font-medium">{w.category}</span>
                  <h3 className="text-lg font-bold mt-2">{w.name}</h3>
                  <p className="text-xs text-gray-500">{new Date(w.date).toLocaleDateString()}</p>
                </div>
                <div className="flex gap-1">
                  <Link to={`/workouts/edit/${w._id}`} className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                    <PencilSquareIcon className="w-4 h-4" />
                  </Link>
                  <button onClick={() => handleDelete(w._id)} className="p-1.5 hover:bg-red-100 dark:hover:bg-red-900/30 rounded text-red-500">
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="mt-4 flex items-center gap-4 text-sm">
                <span>⏱ {w.duration} min</span>
                <span>🔥 {w.caloriesBurned} cal</span>
              </div>
              {w.exercises?.length > 0 && (
                <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
                  <p className="text-xs text-gray-500">{w.exercises.length} exercises</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}