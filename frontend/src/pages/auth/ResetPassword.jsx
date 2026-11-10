import { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import api from '../../api/client';
import { Button, Input } from '../../components/ui';
import { BoltIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { validatePassword, validateConfirmPassword } from '../../utils/validators';
import { getFriendlyError, SUCCESS_MESSAGES } from '../../utils/errorMessages';
import toast from 'react-hot-toast';

export default function ResetPassword() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const token = params.get('token');
  const [form, setForm] = useState({ password: '', confirm: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleBlur = (field) => {
    if (field === 'password') {
      const r = validatePassword(form.password);
      setErrors((prev) => ({ ...prev, password: r.valid ? null : r.error }));
    }
    if (field === 'confirm') {
      const r = validateConfirmPassword(form.password, form.confirm);
      setErrors((prev) => ({ ...prev, confirm: r.valid ? null : r.error }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const pw = validatePassword(form.password);
    const cf = validateConfirmPassword(form.password, form.confirm);
    if (!pw.valid || !cf.valid) {
      setErrors({
        password: pw.valid ? null : pw.error,
        confirm: cf.valid ? null : cf.error,
      });
      return;
    }
    setLoading(true);
    try {
      await api.post('/auth/reset-password', { token, newPassword: form.password });
      toast.success('Password reset. Please sign in.');
      navigate('/login');
    } catch (error) {
      toast.error(getFriendlyError(error));
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen bg-black grid-bg flex items-center justify-center p-4 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-crimson-600/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="w-full max-w-md relative animate-fade-up">
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-2 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-crimson-500 to-accent flex items-center justify-center shadow-glow">
                <BoltIcon className="w-6 h-6 text-white" />
              </div>
              <span className="font-display font-bold text-2xl tracking-tight">FitTrack</span>
            </Link>
          </div>
          <div className="glass-card p-8 text-center">
            <div className="w-14 h-14 rounded-2xl bg-crimson-600/10 border border-crimson-600/30 flex items-center justify-center mx-auto mb-5">
              <ExclamationTriangleIcon className="w-7 h-7 text-crimson-400" />
            </div>
            <h1 className="text-2xl font-display font-bold mb-2">Invalid reset link</h1>
            <p className="text-sm text-text-secondary mb-6">
              This reset link is invalid or has expired. Please request a new one.
            </p>
            <Link to="/forgot-password">
              <Button variant="primary" className="w-full">Request New Link</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black grid-bg flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-crimson-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="w-full max-w-md relative animate-fade-up">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-crimson-500 to-accent flex items-center justify-center shadow-glow">
              <BoltIcon className="w-6 h-6 text-white" />
            </div>
            <span className="font-display font-bold text-2xl tracking-tight">FitTrack</span>
          </Link>
        </div>
        <div className="glass-card p-8 shadow-card">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-display font-bold mb-2">Set new password</h1>
            <p className="text-sm text-text-secondary">Choose a strong password for your account</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <Input
              label="New password"
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              onBlur={() => handleBlur('password')}
              placeholder="At least 6 characters"
              hint="Minimum 6 characters, one letter and one number"
              autoComplete="new-password"
              error={errors.password}
            />
            <Input
              label="Confirm password"
              type="password"
              value={form.confirm}
              onChange={(e) => setForm({ ...form, confirm: e.target.value })}
              onBlur={() => handleBlur('confirm')}
              placeholder="Re-enter your password"
              autoComplete="new-password"
              error={errors.confirm}
            />
            <Button type="submit" variant="primary" loading={loading} className="w-full mt-2">
              {loading ? 'Resetting...' : 'Reset Password'}
            </Button>
          </form>
          <div className="mt-8 pt-6 border-t border-black-border text-center">
            <Link to="/login" className="text-sm text-text-secondary hover:text-text-primary transition-colors">
              ← Back to sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}