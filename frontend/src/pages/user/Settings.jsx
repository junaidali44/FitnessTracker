import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import api from '../../api/client';
import toast from 'react-hot-toast';
import { FITNESS_GOALS } from '../../utils/constants';

export default function Settings() {
  const { user } = useAuth();
  const { dark, toggle } = useTheme();
  const [form, setForm] = useState({
    fitnessGoals: user?.fitnessGoals || 'General Fitness',
    preferences: {
      units: user?.preferences?.units || 'metric',
      notifications: user?.preferences?.notifications ?? true,
      emailNotifications: user?.preferences?.emailNotifications ?? true,
      weeklyGoal: user?.preferences?.weeklyGoal || 5
    }
  });
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.put('/settings', form);
      toast.success('Settings saved');
    } catch {
      toast.error('Failed to save');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fadeIn">
      <h1 className="text-2xl font-bold">⚙️ Settings</h1>

      <div className="card p-6 space-y-4">
        <div>
          <label className="label">Fitness Goal</label>
          <select className="input" value={form.fitnessGoals} onChange={(e) => setForm({ ...form, fitnessGoals: e.target.value })}>
            {FITNESS_GOALS.map(g => <option key={g}>{g}</option>)}
          </select>
        </div>

        <div>
          <label className="label">Units</label>
          <select className="input" value={form.preferences.units} onChange={(e) => setForm({ ...form, preferences: { ...form.preferences, units: e.target.value } })}>
            <option value="metric">Metric (kg, cm)</option>
            <option value="imperial">Imperial (lbs, in)</option>
          </select>
        </div>

        <div>
          <label className="label">Weekly Workout Goal</label>
          <input type="number" min="1" max="14" className="input" value={form.preferences.weeklyGoal} onChange={(e) => setForm({ ...form, preferences: { ...form.preferences, weeklyGoal: Number(e.target.value) } })} />
        </div>

        <div className="space-y-3 pt-2">
          <label className="flex items-center justify-between cursor-pointer">
            <span className="font-medium">In-App Notifications</span>
            <input type="checkbox" checked={form.preferences.notifications} onChange={(e) => setForm({ ...form, preferences: { ...form.preferences, notifications: e.target.checked } })} className="w-5 h-5" />
          </label>
          <label className="flex items-center justify-between cursor-pointer">
            <span className="font-medium">Email Notifications</span>
            <input type="checkbox" checked={form.preferences.emailNotifications} onChange={(e) => setForm({ ...form, preferences: { ...form.preferences, emailNotifications: e.target.checked } })} className="w-5 h-5" />
          </label>
          <label className="flex items-center justify-between cursor-pointer">
            <span className="font-medium">Dark Mode</span>
            <input type="checkbox" checked={dark} onChange={toggle} className="w-5 h-5" />
          </label>
        </div>

        <button onClick={handleSave} disabled={saving} className="btn-primary w-full mt-4">
          {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </div>
    </div>
  );
}