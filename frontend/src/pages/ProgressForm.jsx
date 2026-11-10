import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/client';
import toast from 'react-hot-toast';

export default function ProgressForm() {
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    weight: '', bodyFat: '',
    measurements: { chest: '', waist: '', hips: '', arms: '', thighs: '' },
    performance: { benchPress: '', pushups: '', pullups: '', squats: '', deadlift: '', runTime: '' },
    notes: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.post('/progress', {
        weight: Number(form.weight) || undefined,
        bodyFat: Number(form.bodyFat) || undefined,
        measurements: Object.fromEntries(Object.entries(form.measurements).map(([k, v]) => [k, Number(v) || undefined])),
        performance: Object.fromEntries(Object.entries(form.performance).map(([k, v]) => [k, Number(v) || undefined])),
        notes: form.notes
      });
      toast.success('Progress logged!');
      navigate('/progress');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto animate-fadeIn">
      <h1 className="text-2xl font-bold mb-6">Log Progress</h1>
      <form onSubmit={handleSubmit} className="card p-6 space-y-6">
        <div>
          <h2 className="font-semibold mb-3">Body Metrics</h2>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="label">Weight (kg)</label><input type="number" step="0.1" className="input" value={form.weight} onChange={(e) => setForm({ ...form, weight: e.target.value })} /></div>
            <div><label className="label">Body Fat (%)</label><input type="number" step="0.1" className="input" value={form.bodyFat} onChange={(e) => setForm({ ...form, bodyFat: e.target.value })} /></div>
          </div>
        </div>

        <div>
          <h2 className="font-semibold mb-3">Measurements (cm)</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {Object.keys(form.measurements).map(k => (
              <div key={k}>
                <label className="label capitalize">{k}</label>
                <input type="number" className="input" value={form.measurements[k]} onChange={(e) => setForm({ ...form, measurements: { ...form.measurements, [k]: e.target.value } })} />
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="font-semibold mb-3">Performance</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {Object.keys(form.performance).map(k => (
              <div key={k}>
                <label className="label capitalize">{k.replace(/([A-Z])/g, ' $1')}</label>
                <input type="number" className="input" value={form.performance[k]} onChange={(e) => setForm({ ...form, performance: { ...form.performance, [k]: e.target.value } })} />
              </div>
            ))}
          </div>
        </div>

        <div>
          <label className="label">Notes</label>
          <textarea className="input" rows="2" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
        </div>

        <div className="flex gap-3">
          <button type="button" onClick={() => navigate('/progress')} className="btn-secondary flex-1">Cancel</button>
          <button type="submit" disabled={saving} className="btn-primary flex-1">{saving ? 'Saving...' : 'Save'}</button>
        </div>
      </form>
    </div>
  );
}