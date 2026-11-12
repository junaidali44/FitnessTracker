import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/client';
import toast from 'react-hot-toast';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';
import { TrashIcon, PlusIcon, ChartBarSquareIcon, ScaleIcon, HeartIcon, ArrowsPointingOutIcon } from '@heroicons/react/24/outline';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { formatDate } from '../../utils/formatters';

export default function Progress() {
  const [entries, setEntries] = useState([]);
  const [chart, setChart] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { load(); }, []);

  const load = async () => {
    try {
      const [eRes, cRes] = await Promise.all([
        api.get('/progress'),
        api.get('/progress/chart')
      ]);
      setEntries(eRes.data.data);
      setChart(cRes.data.data);
    } catch {
      toast.error('Failed to load progress data');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this entry?')) return;
    try {
      await api.delete(`/progress/${id}`);
      toast.success('Entry deleted');
      load();
    } catch {
      toast.error('Failed to delete entry');
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-display font-bold flex items-center gap-2">
          <ChartBarSquareIcon className="w-6 h-6 text-crimson-500" />
          Progress
        </h1>
        <Link to="/progress/new" className="btn-primary">
          <PlusIcon className="w-5 h-5" /> Add Entry
        </Link>
      </div>

      {chart?.weightChart?.length > 1 && (
        <div className="glass-card p-6">
          <h2 className="text-lg font-display font-bold mb-6 text-text-primary">Weight Trend</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chart.weightChart}>
              <CartesianGrid strokeDasharray="3 3" stroke="#262626" vertical={false} />
              <XAxis dataKey="date" stroke="#71717a" tick={{ fill: '#a1a1aa', fontSize: 12 }} />
              <YAxis stroke="#71717a" tick={{ fill: '#a1a1aa', fontSize: 12 }} />
              <Tooltip 
                contentStyle={{ background: '#1a1a1a', border: '1px solid #262626', borderRadius: '8px', color: '#fafafa' }}
                itemStyle={{ color: '#dc2626' }}
              />
              <Line type="monotone" dataKey="value" stroke="#dc2626" strokeWidth={3} dot={{ r: 4, fill: '#dc2626', strokeWidth: 0 }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {entries.length === 0 ? (
        <EmptyState 
          icon={<ChartBarSquareIcon className="w-8 h-8 text-crimson-500" />}
          title="No progress logged" 
          message="Track your measurements to see your transformation over time." 
          action={<Link to="/progress/new" className="btn-primary">Add First Entry</Link>} 
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {entries.map(e => (
            <div key={e._id} className="glass-card p-5 hover:border-crimson-600/30 transition-colors">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="font-semibold text-text-primary">{formatDate(e.date)}</p>
                </div>
                <button onClick={() => handleDelete(e._id)} className="p-1.5 text-text-muted hover:text-crimson-500 hover:bg-crimson-600/10 rounded transition-colors">
                  <TrashIcon className="w-4 h-4" />
                </button>
              </div>
              
              <div className="flex flex-wrap gap-2 mb-3">
                {e.weight && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-black-elevated border border-black-border rounded-md text-xs font-medium text-text-secondary">
                    <ScaleIcon className="w-3.5 h-3.5 text-crimson-500" /> {e.weight} kg
                  </span>
                )}
                {e.bodyFat && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-black-elevated border border-black-border rounded-md text-xs font-medium text-text-secondary">
                    <HeartIcon className="w-3.5 h-3.5 text-crimson-500" /> {e.bodyFat}% fat
                  </span>
                )}
                {e.measurements?.chest && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-black-elevated border border-black-border rounded-md text-xs font-medium text-text-secondary">
                    <ArrowsPointingOutIcon className="w-3.5 h-3.5 text-crimson-500" /> Chest: {e.measurements.chest}cm
                  </span>
                )}
              </div>
              
              {e.performance?.benchPress && (
                <div className="pt-3 border-t border-black-border/50">
                  <p className="text-xs text-text-muted">
                    Bench Press: <span className="text-text-primary font-medium">{e.performance.benchPress}kg</span> • 
                    Pushups: <span className="text-text-primary font-medium">{e.performance.pushups}</span>
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}