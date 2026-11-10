import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/client';
import { Button, Input } from '../../components/ui';
import { BoltIcon, EnvelopeIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { validateEmail } from '../../utils/validators';
import { getFriendlyError } from '../../utils/errorMessages';
import toast from 'react-hot-toast';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState(null);
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleBlur = () => {
    const result = validateEmail(email);
    setEmailError(result.valid ? null : result.error);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = validateEmail(email);
    if (!result.valid) {
      setEmailError(result.error);
      return;
    }
    setLoading(true);
    try {
      await api.post('/auth/forgot-password', { email: email.trim().toLowerCase() });
      setSent(true);
    } catch (error) {
      toast.error(getFriendlyError(error));
    } finally {
      setLoading(false);
    }
  };

  // ...rest of the JSX stays the same, but use <Input error={emailError} onBlur={handleBlur} />
  // I'll paste the full JSX below:

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
          {sent ? (
            <div className="text-center">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto mb-5">
                <CheckCircleIcon className="w-8 h-8 text-emerald-400" />
              </div>
              <h1 className="text-2xl font-display font-bold mb-2">Check your email</h1>
              <p className="text-sm text-text-secondary mb-6">
                We've sent a password reset link to
                <br />
                <span className="text-text-primary font-medium">{email}</span>
              </p>
              <p className="text-xs text-text-muted mb-6">
                The link expires in 15 minutes. Check your spam folder if you don't see it.
              </p>
              <Link to="/login">
                <Button variant="primary" className="w-full">Back to Sign In</Button>
              </Link>
            </div>
          ) : (
            <>
              <div className="text-center mb-8">
                <div className="w-14 h-14 rounded-2xl bg-crimson-600/10 border border-crimson-600/30 flex items-center justify-center mx-auto mb-5">
                  <EnvelopeIcon className="w-7 h-7 text-crimson-400" />
                </div>
                <h1 className="text-2xl font-display font-bold mb-2">Forgot password?</h1>
                <p className="text-sm text-text-secondary">Enter your email and we'll send you a reset link</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                <Input
                  label="Email address"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onBlur={handleBlur}
                  placeholder="you@example.com"
                  autoComplete="email"
                  error={emailError}
                />
                <Button type="submit" variant="primary" loading={loading} className="w-full">
                  {loading ? 'Sending...' : 'Send Reset Link'}
                </Button>
              </form>

              <div className="mt-8 pt-6 border-t border-black-border text-center">
                <Link to="/login" className="text-sm text-text-secondary hover:text-text-primary transition-colors">
                  ← Back to sign in
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}