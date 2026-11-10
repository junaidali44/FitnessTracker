import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button, Input } from '../../components/ui';
import { BoltIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { validateForm, loginSchema } from '../../utils/validators';
import { guardLogin } from '../../api/guards';
import { SUCCESS_MESSAGES } from '../../utils/errorMessages';
import toast from 'react-hot-toast';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const handleBlur = (field) => {
    const validator = loginSchema[field];
    if (validator) {
      const result = validator(form[field], form);
      setErrors((prev) => ({ ...prev, [field]: result.valid ? null : result.error }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    // 1. Client-side validation
    const { isValid, errors: validationErrors } = validateForm(form, loginSchema);
    if (!isValid) {
      setErrors(validationErrors);
      return;
    }

    // 2. Guard — block bad requests
    const guard = guardLogin(form);
    if (!guard.valid) {
      toast.error(guard.error);
      return;
    }

    // 3. Submit
    setLoading(true);
    try {
      await login(form.email, form.password);
      toast.success(SUCCESS_MESSAGES.LOGIN);
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.friendlyMessage || 'Sign-in failed. Please try again.');
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
            <span className="font-display font-bold text-2xl tracking-tight">
              FitTrack
            </span>
          </Link>
        </div>

        <div className="glass-card p-8 shadow-card">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-display font-bold mb-2">Welcome back</h1>
            <p className="text-sm text-text-secondary">Sign in to continue your progress</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
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

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="label mb-0">Password</label>
                <Link
                  to="/forgot-password"
                  className="text-xs text-crimson-400 hover:text-crimson-500 transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
              
              <div className="relative">
                <input
                type={showPassword ? 'text' : 'password'}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                onBlur={() => handleBlur('password')}
                placeholder="Enter your password"
                autoComplete="current-password"
                className={`input ${errors.password ? 'input-error' : ''}`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-text-secondary hover:text-text-primary"
              >
                {showPassword ? (
                  <EyeIcon className="w-5 h-5" />
                ) : (
                  <EyeSlashIcon className="w-5 h-5" />
                )}
              </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-xs text-crimson-500">{errors.password}</p>
              )}
            </div>

            <Button type="submit" variant="primary" loading={loading} className="w-full mt-2">
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          <div className="mt-8 pt-6 border-t border-black-border">
            <p className="text-center text-sm text-text-secondary">
              Don't have an account?{' '}
              <Link
                to="/register"
                className="text-crimson-400 hover:text-crimson-500 font-medium transition-colors"
              >
                Create one
              </Link>
            </p>
          </div>
        </div>

        <div className="mt-6 glass-card p-4 text-xs">
          <p className="text-text-muted mb-2 uppercase tracking-wider font-medium">Test credentials</p>
          <div className="space-y-1.5 font-mono text-text-secondary">
            <p>
              <span className="text-text-muted">User:</span>{' '}
              <span className="text-text-primary">test@fitness.com</span>{' '}
              <span className="text-text-muted">/</span>{' '}
              <span className="text-text-primary">Test@123</span>
            </p>
            <p>
              <span className="text-text-muted">Admin:</span>{' '}
              <span className="text-text-primary">admin@fitness.com</span>{' '}
              <span className="text-text-muted">/</span>{' '}
              <span className="text-text-primary">Test@123</span>
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