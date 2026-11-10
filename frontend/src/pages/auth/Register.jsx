import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button, Input } from '../../components/ui';
import { BoltIcon } from '@heroicons/react/24/outline';
import { validateForm, registerSchema } from '../../utils/validators';
import { guardRegister } from '../../api/guards';
import { SUCCESS_MESSAGES } from '../../utils/errorMessages';
import toast from 'react-hot-toast';

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [form, setForm] = useState({ fullName: '', email: '', password: '', confirm: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleBlur = (field) => {
    const validator = registerSchema[field];
    if (validator) {
      const result = validator(form[field], form);
      setErrors((prev) => ({ ...prev, [field]: result.valid ? null : result.error }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    const { isValid, errors: validationErrors } = validateForm(form, registerSchema);
    if (!isValid) {
      setErrors(validationErrors);
      return;
    }

    const guard = guardRegister(form);
    if (!guard.valid) {
      toast.error(guard.error);
      return;
    }

    setLoading(true);
    try {
      await register(form.fullName.trim(), form.email.trim().toLowerCase(), form.password);
      toast.success(SUCCESS_MESSAGES.REGISTER);
      navigate('/login');
    } catch (error) {
      toast.error(error.friendlyMessage || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black grid-bg flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-crimson-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md relative animate-fade-up">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-crimson-500 to-accent flex items-center justify-center shadow-glow group-hover:shadow-glow-lg transition-all">
              <BoltIcon className="w-6 h-6 text-white" />
            </div>
            <span className="font-display font-bold text-2xl tracking-tight">FitTrack</span>
          </Link>
        </div>

        <div className="glass-card p-8 shadow-card">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-display font-bold mb-2">Create your account</h1>
            <p className="text-sm text-text-secondary">Start tracking your progress today</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <Input
              label="Full name"
              type="text"
              value={form.fullName}
              onChange={(e) => setForm({ ...form, fullName: e.target.value })}
              onBlur={() => handleBlur('fullName')}
              placeholder="John Doe"
              autoComplete="name"
              error={errors.fullName}
            />

            <Input
              label="Email address"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              onBlur={() => handleBlur('email')}
              placeholder="you@example.com"
              autoComplete="email"
              error={errors.email}
            />

            <Input
              label="Password"
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
              {loading ? 'Creating account...' : 'Create Account'}
            </Button>
          </form>

          <div className="mt-8 pt-6 border-t border-black-border">
            <p className="text-center text-sm text-text-secondary">
              Already have an account?{' '}
              <Link to="/login" className="text-crimson-400 hover:text-crimson-500 font-medium transition-colors">
                Sign in
              </Link>
            </p>
          </div>
        </div>

        <div className="text-center mt-6">
          <Link to="/" className="text-xs text-text-muted hover:text-text-secondary transition-colors">
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}