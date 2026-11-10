import { useEffect, useState } from 'react';
import api from '../../api/client';
import toast from 'react-hot-toast';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';
import { FEEDBACK_TYPES } from '../../utils/constants';

export default function Feedback() {
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ type: 'Suggestion', subject: '', message: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => { load(); }, []);

  const load = async () => {
    try {
      const { data } = await api.get('/feedback');
      setFeedback(data.data);
    } catch {
      toast.error('Failed to load');
    } finally {
      setLoading(false);
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.post('/feedback', form);
      toast.success('Thanks for your feedback!');
      setForm({ type: 'Suggestion', subject: '', message: '' });
      load();
    } catch {
      toast.error('Failed to submit');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6 animate-fadeIn max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold">💬 Feedback</h1>

      <div className="card p-6">
        <h2 className="font-semibold mb-4">Submit Feedback</h2>
        <form onSubmit={submit} className="space-y-3">
          <div>
            <label className="label">Type</label>
            <select className="input" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
              {FEEDBACK_TYPES.map(t => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Subject</label>
            <input required className="input" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} placeholder="Brief summary" />
          </div>
          <div>
            <label className="label">Message</label>
            <textarea required rows="4" className="input" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="Describe in detail..." />
          </div>
          <button type="submit" disabled={saving} className="btn-primary w-full">
            {saving ? 'Sending...' : 'Submit Feedback'}
          </button>
        </form>
      </div>

      <div>
        <h2 className="font-semibold mb-3">My Feedback</h2>
        {feedback.length === 0 ? (
          <EmptyState icon="💬" title="No feedback yet" message="Help us improve by sharing your thoughts!" />
        ) : (
          <div className="space-y-3">
            {feedback.map(f => (
              <div key={f._id} className="card p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${
                      f.status === 'Resolved' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                      f.status === 'In Progress' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                      'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                    }`}>{f.status}</span>
                    <span className="text-xs ml-2 text-gray-500">{f.type}</span>
                    <p className="font-semibold mt-1">{f.subject}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{f.message}</p>
                  </div>
                </div>
                {f.adminResponse && (
                  <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <p className="text-xs font-medium text-blue-600 dark:text-blue-400 mb-1">Admin Response:</p>
                    <p className="text-sm">{f.adminResponse}</p>
                  </div>
                )}
                <p className="text-xs text-gray-400 mt-2">{new Date(f.createdAt).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}