import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button, Input } from '../../components/ui';
import { BoltIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: '',
    confirm: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) {
      return toast.error('Passwords do not match');
    }
    if (form.password.length < 6) {
      return toast.error('Password must be at least 6 characters');
    }
    setLoading(true);
    try {
      await register(form.fullName, form.email, form.password);
      toast.success('Account created. Please sign in.');
      navigate('/login');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black grid-bg flex items-center justify-center p-4 relative overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-crimson-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md relative animate-fade-up">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-crimson-500 to-accent flex items-center justify-center shadow-glow group-hover:shadow-glow-lg transition-all">
              <BoltIcon className="w-6 h-6 text-white" />
            </div>
            <span className="font-display font-bold text-2xl tracking-tight">
              FitTrack
            </span>
          </Link>
        </div>

        {/* Card */}
        <div className="glass-card p-8 shadow-card">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-display font-bold mb-2">Create your account</h1>
            <p className="text-sm text-text-secondary">
              Start tracking your progress today
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Full name"
              type="text"
              required
              value={form.fullName}
              onChange={(e) => setForm({ ...form, fullName: e.target.value })}
              placeholder="John Doe"
              autoComplete="name"
            />

            <Input
              label="Email address"
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="you@example.com"
              autoComplete="email"
            />

            <Input
              label="Password"
              type="password"
              required
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="At least 6 characters"
              hint="Minimum 6 characters"
              autoComplete="new-password"
            />

            <Input
              label="Confirm password"
              type="password"
              required
              value={form.confirm}
              onChange={(e) => setForm({ ...form, confirm: e.target.value })}
              placeholder="Re-enter your password"
              autoComplete="new-password"
            />

            <Button
              type="submit"
              variant="primary"
              loading={loading}
              className="w-full mt-2"
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </Button>
          </form>

          <div className="mt-8 pt-6 border-t border-black-border">
            <p className="text-center text-sm text-text-secondary">
              Already have an account?{' '}
              <Link
                to="/login"
                className="text-crimson-400 hover:text-crimson-500 font-medium transition-colors"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>

        <div className="text-center mt-6">
          <Link
            to="/"
            className="text-xs text-text-muted hover:text-text-secondary transition-colors"
          >
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}