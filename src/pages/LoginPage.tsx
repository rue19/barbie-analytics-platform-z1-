import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { Sparkles, Crown } from 'lucide-react';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const { login, isLoading } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(email, password);
    navigate(isAdmin ? '/admin' : '/dashboard');
  };

  const handleDemoLogin = async () => {
    await login('demo@example.com', 'demo123');
    navigate('/upload');
  };

  return (
    <div className="min-h-screen bg-barbie-gradient flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      {/* Decorative elements */}
      <div className="absolute top-10 right-10">
        <Sparkles className="text-barbie-400 animate-pulse" size={24} />
      </div>
      <div className="absolute bottom-10 left-10">
        <Crown className="text-barbie-500" size={28} />
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <Crown className="text-barbie-600" size={48} />
        </div>
        <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
          Welcome Back!
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          So happy to see you again!{' '}
          <button
            onClick={handleDemoLogin}
            className="font-medium text-barbie-600 hover:text-barbie-500"
          >
            try the demo
          </button>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white/80 backdrop-blur-sm py-8 px-4 shadow-xl sm:rounded-2xl sm:px-10 border border-barbie-100">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-xl px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-barbie-500 focus:border-barbie-500"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-xl px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-barbie-500 focus:border-barbie-500"
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="admin"
                  type="checkbox"
                  checked={isAdmin}
                  onChange={(e) => setIsAdmin(e.target.checked)}
                  className="h-4 w-4 text-barbie-600 focus:ring-barbie-500 border-gray-300 rounded"
                />
                <label htmlFor="admin" className="ml-2 block text-sm text-gray-900">
                  Login as Admin
                </label>
              </div>

              <div className="text-sm">
                <Link to="/forgot-password" className="font-medium text-barbie-600 hover:text-barbie-500">
                  Forgot your password?
                </Link>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-lg text-sm font-medium text-white bg-barbie-500 hover:bg-barbie-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-barbie-500 disabled:opacity-50 transition-all duration-300 hover:scale-105"
              >
                {isLoading ? 'Signing in...' : 'Sign in'}
              </button>
            </div>

            {/* Demo Login Button */}
            <div>
              <button
                type="button"
                onClick={handleDemoLogin}
                disabled={isLoading}
                className="w-full flex justify-center py-3 px-4 border border-barbie-300 rounded-xl shadow text-sm font-medium text-barbie-600 bg-white hover:bg-barbie-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-barbie-500 disabled:opacity-50 transition-all duration-300"
              >
                {isLoading ? 'Signing in...' : 'Try Demo Version'}
              </button>
            </div>

            <div className="text-center">
              <span className="text-sm text-gray-600">
                Don't have an account?{' '}
                <Link to="/register" className="font-medium text-barbie-600 hover:text-barbie-500">
                  Sign up now!
                </Link>
              </span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;