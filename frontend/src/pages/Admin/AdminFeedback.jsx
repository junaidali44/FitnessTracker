import { useEffect, useState } from 'react';
import api from '../../api/client';
import toast from 'react-hot-toast';
import LoadingSpinner from '../../components/LoadingSpinner';
import Modal from '../../components/Modal';

export default function AdminFeedback() {
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('');
  const [selected, setSelected] = useState(null);
  const [response, setResponse] = useState('');
  const [newStatus, setNewStatus] = useState('Resolved');

  useEffect(() => { load(); }, [status]);

  const load = async () => {
    setLoading(true);
    try {
      const params = { limit: 50 };
      if (status) params.status = status;
      const { data } = await api.get('/admin/feedback', { params });
      setFeedback(data.data);
    } catch {
      toast.error('Failed to load');
    } finally {
      setLoading(false);
    }
  };

  const respond = async () => {
    if (!response.trim()) return toast.error('Enter a response');
    try {
      await api.put(`/admin/feedback/${selected._id}/respond`, {
        adminResponse: response,
        status: newStatus
      });
      toast.success('Response sent');
      setSelected(null);
      setResponse('');
      load();
    } catch {
      toast.error('Failed to respond');
    }
  };

  const del = async (id) => {
    if (!confirm('Delete this feedback?')) return;
    try {
      await api.delete(`/admin/feedback/${id}`);
      toast.success('Deleted');
      load();
    } catch {
      toast.error('Failed');
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6 animate-fadeIn">
      <h1 className="text-2xl font-bold">💬 Feedback Management</h1>

      <div className="card p-4">
        <select className="input max-w-xs" value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">All Status</option>
          <option value="Pending">Pending</option>
          <option value="In Progress">In Progress</option>
          <option value="Resolved">Resolved</option>
        </select>
      </div>

      <div className="space-y-3">
        {feedback.map(f => (
          <div key={f._id} className="card p-5">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                    f.status === 'Resolved' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                    f.status === 'In Progress' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                    'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                  }`}>{f.status}</span>
                  <span className="text-xs text-gray-500">{f.type}</span>
                </div>
                <p className="font-semibold mt-2">{f.subject}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{f.message}</p>
                <p className="text-xs text-gray-400 mt-2">From: {f.user?.fullName} ({f.user?.email})</p>
                {f.adminResponse && (
                  <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <p className="text-xs font-medium text-blue-600 dark:text-blue-400">Your Response:</p>
                    <p className="text-sm mt-1">{f.adminResponse}</p>
                  </div>
                )}
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <button onClick={() => { setSelected(f); setResponse(f.adminResponse || ''); setNewStatus(f.status); }} className="btn-primary text-sm">
                {f.adminResponse ? 'Update Response' : 'Respond'}
              </button>
              <button onClick={() => del(f._id)} className="btn-danger text-sm">Delete</button>
            </div>
          </div>
        ))}
        {feedback.length === 0 && <div className="card p-8 text-center text-gray-500">No feedback found</div>}
      </div>

      <Modal open={!!selected} onClose={() => setSelected(null)} title="Respond to Feedback">
        {selected && (
          <div className="space-y-4">
            <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <p className="font-medium">{selected.subject}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{selected.message}</p>
            </div>
            <div>
              <label className="label">Your Response</label>
              <textarea rows="4" className="input" value={response} onChange={(e) => setResponse(e.target.value)} placeholder="Type your response..." />
            </div>
            <div>
              <label className="label">Update Status</label>
              <select className="input" value={newStatus} onChange={(e) => setNewStatus(e.target.value)}>
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
              </select>
            </div>
            <button onClick={respond} className="btn-primary w-full">Send Response</button>
          </div>
        )}
      </Modal>
    </div>
  );
}