import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/client';
import toast from 'react-hot-toast';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import { MEAL_TYPES } from '../utils/constants';
import { PencilSquareIcon, TrashIcon, PlusIcon } from '@heroicons/react/24/outline';

export default function Nutrition() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => { load(); }, [filter]);

  const load = async () => {
    setLoading(true);
    try {
      const params = { limit: 50 };
      if (filter) params.mealType = filter;
      const [eRes, aRes] = await Promise.all([
        api.get('/nutrition', { params }),
        api.get('/nutrition/analytics?days=7')
      ]);
      setEntries(eRes.data.data);
      setAnalytics(aRes.data.data);
    } catch {
      toast.error('Failed to load nutrition');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this entry?')) return;
    try {
      await api.delete(`/nutrition/${id}`);
      toast.success('Deleted');
      load();
    } catch {
      toast.error('Delete failed');
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">🍽️ Nutrition</h1>
          {analytics && (
            <p className="text-sm text-gray-500 mt-1">
              Avg: {analytics.avgCalories} cal • {analytics.avgProtein}g protein
            </p>
          )}
        </div>
        <Link to="/nutrition/new" className="btn-primary flex items-center gap-2">
          <PlusIcon className="w-5 h-5" /> Log Meal
        </Link>
      </div>

      <div className="card p-4">
        <select className="input max-w-xs" value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="">All Meals</option>
          {MEAL_TYPES.map(m => <option key={m}>{m}</option>)}
        </select>
      </div>

      {entries.length === 0 ? (
        <EmptyState icon="🥗" title="No meals logged" message="Start tracking your nutrition!" action={<Link to="/nutrition/new" className="btn-primary">Log Meal</Link>} />
      ) : (
        <div className="space-y-3">
          {entries.map(e => (
            <div key={e._id} className="card p-5">
              <div className="flex justify-between items-start">
                <div>
                  <span className="inline-block px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded text-xs font-medium">{e.mealType}</span>
                  <p className="text-xs text-gray-500 mt-1">{new Date(e.date).toLocaleDateString()}</p>
                </div>
                <div className="flex gap-1">
                  <Link to={`/nutrition/edit/${e._id}`} className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                    <PencilSquareIcon className="w-4 h-4" />
                  </Link>
                  <button onClick={() => handleDelete(e._id)} className="p-1.5 hover:bg-red-100 dark:hover:bg-red-900/30 rounded text-red-500">
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {e.foods.map((f, i) => (
                  <span key={i} className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs">{f.name} ({f.calories} cal)</span>
                ))}
              </div>
              <div className="mt-4 grid grid-cols-4 gap-2 text-center text-sm">
                <div><p className="font-bold text-orange-500">{e.totalCalories}</p><p className="text-xs text-gray-500">Cal</p></div>
                <div><p className="font-bold text-green-500">{e.totalProtein}g</p><p className="text-xs text-gray-500">Protein</p></div>
                <div><p className="font-bold text-yellow-500">{e.totalCarbs}g</p><p className="text-xs text-gray-500">Carbs</p></div>
                <div><p className="font-bold text-red-500">{e.totalFat}g</p><p className="text-xs text-gray-500">Fat</p></div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}