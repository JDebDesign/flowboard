import { useState } from 'react';
import type { FormEvent } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import { supabase } from '../lib/supabaseClient';
import { LogoIcon } from '../components/icons';
import styles from './LoginPage.module.css';

type Tab = 'password' | 'magic-link' | 'sign-up';

const TABS: { id: Tab; label: string }[] = [
  { id: 'password', label: 'Password' },
  { id: 'magic-link', label: 'Magic link' },
  { id: 'sign-up', label: 'Sign up' },
];

export function LoginPage() {
  const { user, loading: authLoading, signInWithPassword, signInWithMagicLink, signUpWithPassword } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>('password');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  if (!authLoading && user) {
    return <Navigate to="/boards" replace />;
  }

  const switchTab = (nextTab: Tab) => {
    setTab(nextTab);
    setError(null);
    setNotice(null);
  };

  const handlePasswordSignIn = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    setNotice(null);
    setSubmitting(true);
    const { error: signInError } = await signInWithPassword(email, password);
    setSubmitting(false);
    if (signInError) {
      setError(signInError);
      return;
    }
    navigate('/boards');
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setError('Enter your email address first, then click "Forgot password?".');
      return;
    }
    setError(null);
    setSubmitting(true);
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin,
    });
    setSubmitting(false);
    if (resetError) {
      setError(resetError.message);
      return;
    }
    setNotice('Password reset email sent — check your inbox.');
  };

  const handleMagicLink = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    setNotice(null);
    setSubmitting(true);
    const { error: magicLinkError } = await signInWithMagicLink(email);
    setSubmitting(false);
    if (magicLinkError) {
      setError(magicLinkError);
      return;
    }
    setNotice('Magic link sent — check your email to finish signing in.');
  };

  const handleSignUp = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    setNotice(null);
    setSubmitting(true);
    const { error: signUpError, needsEmailConfirmation } = await signUpWithPassword(email, password);
    setSubmitting(false);
    if (signUpError) {
      setError(signUpError);
      return;
    }
    if (needsEmailConfirmation) {
      setNotice('Account created — check your email to confirm before signing in.');
      return;
    }
    navigate('/boards');
  };

  return (
    <div className={styles.page}>
      <div>
        <div className={styles.header}>
          <span className={styles.logoMark}>
            <LogoIcon size={24} />
          </span>
          <h1 className={styles.title}>FlowBoard</h1>
          <p className={styles.subtitle}>Sign in to manage your boards</p>
        </div>

        <div className={styles.card}>
          <div className={styles.tabs}>
            {TABS.map(({ id, label }) => (
              <button
                key={id}
                type="button"
                className={`${styles.tab} ${tab === id ? styles.tabActive : ''}`}
                onClick={() => switchTab(id)}
              >
                {label}
              </button>
            ))}
          </div>

          {error && <p className={styles.errorText}>{error}</p>}
          {notice && <p className={styles.noticeText}>{notice}</p>}

          {tab === 'password' && (
            <form className={styles.form} onSubmit={handlePasswordSignIn}>
              <div className={styles.field}>
                <label className={styles.label} htmlFor="email">
                  Email Address
                </label>
                <input
                  id="email"
                  className={styles.input}
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className={styles.field}>
                <label className={styles.label} htmlFor="password">
                  Password
                </label>
                <input
                  id="password"
                  className={styles.input}
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className={styles.rowEnd}>
                <button type="button" className={styles.link} onClick={handleForgotPassword} disabled={submitting}>
                  Forgot password?
                </button>
              </div>
              <button type="submit" className={styles.submit} disabled={submitting}>
                {submitting ? 'Signing in…' : 'Sign in'}
              </button>
            </form>
          )}

          {tab === 'magic-link' && (
            <form className={styles.form} onSubmit={handleMagicLink}>
              <div className={styles.field}>
                <label className={styles.label} htmlFor="magic-email">
                  Email Address
                </label>
                <input
                  id="magic-email"
                  className={styles.input}
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className={styles.submit} disabled={submitting}>
                {submitting ? 'Sending…' : 'Send magic link'}
              </button>
            </form>
          )}

          {tab === 'sign-up' && (
            <form className={styles.form} onSubmit={handleSignUp}>
              <div className={styles.field}>
                <label className={styles.label} htmlFor="signup-email">
                  Email Address
                </label>
                <input
                  id="signup-email"
                  className={styles.input}
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className={styles.field}>
                <label className={styles.label} htmlFor="signup-password">
                  Password
                </label>
                <input
                  id="signup-password"
                  className={styles.input}
                  type="password"
                  placeholder="At least 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  minLength={6}
                  required
                />
              </div>
              <button type="submit" className={styles.submit} disabled={submitting}>
                {submitting ? 'Creating account…' : 'Create account'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
