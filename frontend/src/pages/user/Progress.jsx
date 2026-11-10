import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/client';
import toast from 'react-hot-toast';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';
import { TrashIcon, PlusIcon } from '@heroicons/react/24/outline';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

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
      toast.error('Failed to load');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this entry?')) return;
    try {
      await api.delete(`/progress/${id}`);
      toast.success('Deleted');
      load();
    } catch {
      toast.error('Failed');
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">📊 Progress</h1>
        <Link to="/progress/new" className="btn-primary flex items-center gap-2">
          <PlusIcon className="w-5 h-5" /> Add Entry
        </Link>
      </div>

      {chart?.weightChart?.length > 1 && (
        <div className="card p-6">
          <h2 className="text-lg font-bold mb-4">Weight Trend</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chart.weightChart}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="value" stroke="#10b981" strokeWidth={3} dot={{ r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {entries.length === 0 ? (
        <EmptyState icon="📏" title="No progress logged" message="Track your measurements to see your journey!" action={<Link to="/progress/new" className="btn-primary">Add Entry</Link>} />
      ) : (
        <div className="space-y-3">
          {entries.map(e => (
            <div key={e._id} className="card p-5">
              <div className="flex justify-between">
                <div>
                  <p className="font-medium">{new Date(e.date).toLocaleDateString()}</p>
                  <div className="mt-2 flex flex-wrap gap-4 text-sm">
                    {e.weight && <span>⚖️ {e.weight} kg</span>}
                    {e.bodyFat && <span>📉 {e.bodyFat}% fat</span>}
                    {e.measurements?.chest && <span>📏 Chest: {e.measurements.chest}cm</span>}
                    {e.measurements?.waist && <span>Waist: {e.measurements.waist}cm</span>}
                  </div>
                  {e.performance?.benchPress && (
                    <p className="text-xs text-gray-500 mt-2">🏋️ Bench: {e.performance.benchPress}kg • Pushups: {e.performance.pushups}</p>
                  )}
                </div>
                <button onClick={() => handleDelete(e._id)} className="p-1.5 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30 rounded h-fit">
                  <TrashIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}