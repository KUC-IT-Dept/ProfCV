import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { GraduationCap, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function LoginPage() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (user) return <Navigate to="/dashboard" replace />;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.info('[LoginPage] Submit', { email });
    setError('');
    setIsLoading(true);
    try {
      await login(email, password);
      console.info('[LoginPage] Navigation to dashboard');
      navigate('/dashboard', { replace: true });
    } catch (err: any) {
      console.error('[LoginPage] Login failed', {
        message: err?.message,
        status: err?.response?.status,
        data: err?.response?.data,
        code: err?.code,
      });
      setError(err?.response?.data?.message ?? 'Invalid credentials. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--color-bg)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
      }}
    >
      <div style={{ width: '100%', maxWidth: '420px' }}>
        {/* Brand */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 12,
              background: 'var(--color-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem',
            }}
          >
            <GraduationCap size={28} color="#fff" />
          </div>
          <h1 style={{ fontSize: '1.625rem', marginBottom: '0.25rem' }}>Prof CV</h1>
          <p style={{ fontSize: '0.9rem' }}>Academic Portfolio & Administration Platform</p>
        </div>

        {/* Card */}
        <div className="card" style={{ padding: '2rem' }}>
          <h2 style={{ fontSize: '1.125rem', marginBottom: '1.5rem' }}>Sign in to your account</h2>

          {error && (
            <div className="alert alert-error" style={{ marginBottom: '1.25rem' }}>
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="form-group">
                <label htmlFor="email" className="form-label">Email address</label>
                <input
                  id="email"
                  type="email"
                  className="form-input"
                  placeholder="you@profcv.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                />
              </div>

              <div className="form-group">
                <label htmlFor="password" className="form-label">Password</label>
                <input
                  id="password"
                  type="password"
                  className="form-input"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                />
              </div>

              <button
                id="login-submit"
                type="submit"
                className="btn btn-primary"
                disabled={isLoading}
                style={{ width: '100%', justifyContent: 'center', padding: '0.625rem 1rem', marginTop: '0.5rem' }}
              >
                {isLoading ? <span className="spinner" style={{ width: 18, height: 18 }} /> : 'Sign In'}
              </button>
            </div>
          </form>
        </div>

        <div className="card" style={{ padding: '1rem 1.25rem', marginTop: '1rem' }}>
          <p style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text)', marginBottom: '0.5rem' }}>
            Demo Credentials (password: <code>password123</code>)
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            {[
              { email: 'admin@profcv.edu', role: 'Super Admin' },
              { email: 'vc@profcv.edu', role: 'Vice Chancellor' },
              { email: 'hod_cs@profcv.edu', role: 'HOD — CS' },
              { email: 'teacher@profcv.edu', role: 'Teacher' },
            ].map((c) => (
              <button
                key={c.email}
                className="btn btn-ghost"
                style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem', justifyContent: 'flex-start', gap: '0.5rem' }}
                onClick={() => { setEmail(c.email); setPassword('password123'); }}
              >
                <span style={{ color: 'var(--color-primary)', fontWeight: 600 }}>{c.role}</span>
                <span style={{ color: 'var(--color-text-muted)' }}>{c.email}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
