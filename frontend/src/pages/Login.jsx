import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-primary-50 via-white to-secondary-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      <div className="w-full max-w-md animate-fadeIn">
        <div className="card p-8 shadow-xl">
          <div className="text-center mb-8">
            <div className="text-5xl mb-3">💪</div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-500 to-secondary-500 bg-clip-text text-transparent">FitTrack</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Welcome back! Sign in to continue</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">Email</label>
              <input
                type="email"
                required
                className="input"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="you@example.com"
              />
            </div>
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="label mb-0">Password</label>
                <Link to="/forgot-password" className="text-sm text-primary-500 hover:text-primary-600">
                  Forgot?
                </Link>
              </div>
              <input
                type="password"
                required
                className="input"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="••••••••"
              />
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p className="text-center text-gray-500 dark:text-gray-400 mt-6 text-sm">
            No account? <Link to="/register" className="text-primary-500 hover:text-primary-600 font-medium">Create one</Link>
          </p>

          <div className="mt-6 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg text-xs text-center">
            <p className="text-gray-500 mb-1">Test credentials:</p>
            <p>User: <span className="font-mono">test@fitness.com</span> / <span className="font-mono">Test@123</span></p>
            <p>Admin: <span className="font-mono">admin@fitness.com</span> / <span className="font-mono">Test@123</span></p>
          </div>
        </div>
      </div>
    </div>
  );
}