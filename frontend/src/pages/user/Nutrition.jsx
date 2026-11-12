import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/client';
import toast from 'react-hot-toast';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';
import { MEAL_TYPES } from '../../utils/constants';
import { PencilSquareIcon, TrashIcon, PlusIcon, CakeIcon } from '@heroicons/react/24/outline';
import { formatDate } from '../../utils/formatters';

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
      toast.success('Entry deleted');
      load();
    } catch {
      toast.error('Delete failed');
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold flex items-center gap-2">
            <CakeIcon className="w-6 h-6 text-crimson-500" />
            Nutrition
          </h1>
          {analytics && (
            <p className="text-sm text-text-secondary mt-1">
              Avg: <span className="text-text-primary font-medium">{analytics.avgCalories} kcal</span> • 
              <span className="text-text-primary font-medium ml-1">{analytics.avgProtein}g protein</span>
            </p>
          )}
        </div>
        <Link to="/nutrition/new" className="btn-primary">
          <PlusIcon className="w-5 h-5" /> Log Meal
        </Link>
      </div>

      <div className="glass-card p-4">
        <select className="input max-w-xs" value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="">All Meals</option>
          {MEAL_TYPES.map(m => <option key={m}>{m}</option>)}
        </select>
      </div>

      {entries.length === 0 ? (
        <EmptyState 
          title="No meals logged" 
          message="Start tracking your nutrition to hit your goals." 
          action={<Link to="/nutrition/new" className="btn-primary">Log Your First Meal</Link>} 
        />
      ) : (
        <div className="space-y-3">
          {entries.map(e => (
            <div key={e._id} className="glass-card p-5 hover:border-crimson-600/30 transition-colors">
              <div className="flex justify-between items-start">
                <div>
                  <span className="badge-primary">{e.mealType}</span>
                  <p className="text-xs text-text-muted mt-2">{formatDate(e.date)}</p>
                </div>
                <div className="flex gap-1">
                  <Link to={`/nutrition/edit/${e._id}`} className="p-1.5 text-text-muted hover:text-text-primary hover:bg-black-elevated rounded transition-colors">
                    <PencilSquareIcon className="w-4 h-4" />
                  </Link>
                  <button onClick={() => handleDelete(e._id)} className="p-1.5 text-text-muted hover:text-crimson-500 hover:bg-crimson-600/10 rounded transition-colors">
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <div className="mt-4 flex flex-wrap gap-2">
                {e.foods.map((f, i) => (
                  <span key={i} className="px-2.5 py-1 bg-black-elevated border border-black-border rounded-md text-xs text-text-secondary">
                    {f.name} <span className="text-text-muted">({f.calories} kcal)</span>
                  </span>
                ))}
              </div>

              <div className="mt-5 pt-4 border-t border-black-border/50 grid grid-cols-4 gap-4 text-center">
                <div>
                  <p className="font-display font-bold text-lg text-text-primary">{e.totalCalories}</p>
                  <p className="text-2xs text-text-muted uppercase tracking-wider">Calories</p>
                </div>
                <div>
                  <p className="font-display font-bold text-lg text-text-primary">{e.totalProtein}g</p>
                  <p className="text-2xs text-text-muted uppercase tracking-wider">Protein</p>
                </div>
                <div>
                  <p className="font-display font-bold text-lg text-text-primary">{e.totalCarbs}g</p>
                  <p className="text-2xs text-text-muted uppercase tracking-wider">Carbs</p>
                </div>
                <div>
                  <p className="font-display font-bold text-lg text-text-primary">{e.totalFat}g</p>
                  <p className="text-2xs text-text-muted uppercase tracking-wider">Fat</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}