'use client'

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, Mail, Shield } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState('instructor.benteke@eth.edu.et');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Default admin credentials
  const ADMIN_CREDENTIALS = {
    email: 'kimsabu36@gmail.com',
    password: 'MynameisKimMinJun32'
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Simulate authentication
    setTimeout(() => {
      if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
        // Store admin session
        localStorage.setItem('matriprime_admin', JSON.stringify({
          email,
          loginTime: new Date().toISOString(),
          token: 'admin-token-2024'
        }));
        router.push('/admin/dashboard');
      } else {
        setError('Invalid credentials. Please check your email and password.');
      }
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen pt-20 pb-24 bg-gradient-to-br from-background to-slate-800 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md glass-card p-8"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-primary rounded-2xl mb-4">
            <Shield className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold gradient-text">MatriPrime Admin</h1>
          <p className="text-text-muted mt-2">Instructor Portal</p>
        </div>

        {/* Demo Credentials Info */}
        <div className="mb-6 p-4 rounded-xl bg-surface/50 border border-white/10">
          <p className="text-sm font-semibold text-text-primary mb-2">Demo Credentials:</p>
          <div className="space-y-1 text-xs text-text-muted">
            <p>Email: kimsabu36@gmail.com</p>
            <p>Password: MynameisKimMinJun32</p>
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-text-primary text-sm font-medium mb-2">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-text-muted" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field pl-10"
                placeholder="Enter admin email"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-text-primary text-sm font-medium mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-text-muted" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field pl-10"
                placeholder="Enter admin password"
                required
              />
            </div>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-3 rounded-xl bg-danger/20 border border-danger text-danger text-sm"
            >
              {error}
            </motion.div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full text-lg py-3 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="inline-flex items-center">
                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                Signing In...
              </span>
            ) : (
              'Sign In to Admin Portal'
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-text-muted text-xs">
            Administrator Portal • Secure Access Only
          </p>
        </div>
      </motion.div>
    </div>
  );
}
