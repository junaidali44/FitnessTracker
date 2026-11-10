import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/client';
import toast from 'react-hot-toast';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/auth/forgot-password', { email });
      setSent(true);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send reset link');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-gray-900 dark:to-gray-800">
      <div className="w-full max-w-md card p-8 shadow-xl animate-fadeIn">
        <div className="text-center mb-6">
          <div className="text-5xl mb-3">🔐</div>
          <h1 className="text-2xl font-bold">Forgot Password?</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">We'll send you a reset link</p>
        </div>

        {sent ? (
          <div className="text-center space-y-4">
            <div className="p-4 bg-green-50 dark:bg-green-900/30 rounded-xl">
              <p className="text-green-700 dark:text-green-400 font-medium">✅ Check your email</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Reset link sent to {email}</p>
            </div>
            <Link to="/login" className="btn-primary inline-block w-full">Back to Login</Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">Email Address</label>
              <input type="email" required className="input" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>
            <p className="text-center text-sm text-gray-500">
              <Link to="/login" className="text-primary-500 hover:text-primary-600">Back to login</Link>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}