import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [form, setForm] = useState({ fullName: '', email: '', password: '', confirm: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) return toast.error('Passwords do not match');
    if (form.password.length < 6) return toast.error('Password must be at least 6 characters');
    setLoading(true);
    try {
      await register(form.fullName, form.email, form.password);
      toast.success('Registration successful! Please login.');
      navigate('/login');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-primary-50 via-white to-secondary-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      <div className="w-full max-w-md animate-fadeIn">
        <div className="card p-8 shadow-xl">
          <div className="text-center mb-8">
            <div className="text-5xl mb-3">🚀</div>
            <h1 className="text-2xl font-bold">Create Account</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Start your fitness journey</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">Full Name</label>
              <input required className="input" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} placeholder="John Doe" />
            </div>
            <div>
              <label className="label">Email</label>
              <input type="email" required className="input" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" />
            </div>
            <div>
              <label className="label">Password</label>
              <input type="password" required className="input" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="Min 6 characters" />
            </div>
            <div>
              <label className="label">Confirm Password</label>
              <input type="password" required className="input" value={form.confirm} onChange={(e) => setForm({ ...form, confirm: e.target.value })} placeholder="Confirm password" />
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-gray-500 dark:text-gray-400 mt-6 text-sm">
            Already registered? <Link to="/login" className="text-primary-500 hover:text-primary-600 font-medium">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}