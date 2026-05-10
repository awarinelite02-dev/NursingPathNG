import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { FiMail, FiLock, FiArrowRight } from 'react-icons/fi';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signIn(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Failed to sign in');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy via-navy-light to-navy-dark flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent/20 mb-4">
            <svg className="w-8 h-8 text-accent" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">Nursing CBT</h1>
          <p className="text-blue-200">Prepare for your entrance exam</p>
        </div>

        {/* Card */}
        <div className="bg-white dark:bg-navy-dark rounded-2xl shadow-2xl p-8 backdrop-blur-sm border border-blue-100 dark:border-navy-light">
          <h2 className="text-2xl font-bold text-navy dark:text-white mb-6">Welcome Back</h2>

          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Input */}
            <div>
              <label className="block text-sm font-medium text-navy dark:text-blue-200 mb-2">
                Email Address
              </label>
              <div className="relative">
                <FiMail className="absolute left-3 top-3.5 text-blue-300" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-2.5 border border-blue-200 dark:border-navy-light rounded-lg focus:outline-none focus:ring-2 focus:ring-accent dark:bg-navy dark:text-white"
                  placeholder="your@email.com"
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-sm font-medium text-navy dark:text-blue-200 mb-2">
                Password
              </label>
              <div className="relative">
                <FiLock className="absolute left-3 top-3.5 text-blue-300" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-2.5 border border-blue-200 dark:border-navy-light rounded-lg focus:outline-none focus:ring-2 focus:ring-accent dark:bg-navy dark:text-white"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-6 bg-gradient-to-r from-accent to-blue-600 hover:from-blue-600 hover:to-accent text-white font-semibold py-2.5 rounded-lg transition duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in...' : 'Sign In'}
              {!loading && <FiArrowRight />}
            </button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center gap-3">
            <div className="flex-1 h-px bg-blue-200 dark:bg-navy-light" />
            <span className="text-xs text-blue-400">OR</span>
            <div className="flex-1 h-px bg-blue-200 dark:bg-navy-light" />
          </div>

          {/* Sign Up Link */}
          <p className="text-center text-sm text-blue-600 dark:text-blue-300">
            Don't have an account?{' '}
            <Link to="/signup" className="font-semibold text-accent hover:underline">
              Sign up here
            </Link>
          </p>
        </div>

        {/* Demo Credentials */}
        <div className="mt-6 p-4 bg-blue-50 dark:bg-navy-dark/50 rounded-lg border border-blue-200 dark:border-navy-light">
          <p className="text-xs font-semibold text-blue-900 dark:text-blue-300 mb-2">📝 Demo Credentials</p>
          <p className="text-xs text-blue-700 dark:text-blue-400">
            Student: student@test.com / password123
            <br />
            Admin: admin@test.com / password123
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
