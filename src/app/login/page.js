'use client';
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { HeartPulse, Mail, Lock, Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const result = await signIn('credentials', { email, password, redirect: false });
      if (result?.error) {
        setError('Invalid email or password. Please try again.');
      } else {
        router.push('/dashboard');
        router.refresh();
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.logoSection}>
          <div style={styles.logoIcon}><HeartPulse size={32} color="#fff" /></div>
          <h1 style={styles.logoText}>ElderCare</h1>
          <p style={styles.subtitle}>Welcome back! Sign in to your account</p>
        </div>

        {error && <div style={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Email Address</label>
            <div style={styles.inputWrapper}>
              <Mail size={20} style={styles.inputIcon} />
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" required style={styles.input} />
            </div>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Password</label>
            <div style={styles.inputWrapper}>
              <Lock size={20} style={styles.inputIcon} />
              <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" required style={styles.input} />
              <button type="button" onClick={() => setShowPassword(!showPassword)} style={styles.eyeBtn}>
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <button type="submit" disabled={loading} style={{ ...styles.submitBtn, opacity: loading ? 0.7 : 1 }}>
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <div style={styles.divider}><span>Demo Accounts</span></div>
        <div style={styles.demoAccounts}>
          <p style={styles.demoText}>Admin: admin@eldercare.com / admin123</p>
          <p style={styles.demoText}>User: rajesh@example.com / user123</p>
          <p style={styles.demoText}>Caregiver: anita@example.com / caregiver123</p>
        </div>

        <p style={styles.registerLink}>
          Don&apos;t have an account? <Link href="/register" style={styles.link}>Register here</Link>
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', background: 'linear-gradient(135deg, #f0fdfa 0%, #f5f5f4 50%, #eff6ff 100%)' },
  card: { background: '#fff', borderRadius: '24px', padding: '3rem', maxWidth: '460px', width: '100%', boxShadow: '0 20px 60px rgba(0,0,0,0.08)' },
  logoSection: { textAlign: 'center', marginBottom: '2rem' },
  logoIcon: { width: '64px', height: '64px', borderRadius: '16px', background: 'linear-gradient(135deg, #0D9488, #14B8A6)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' },
  logoText: { fontFamily: "'Outfit', sans-serif", fontSize: '2rem', fontWeight: 700, color: '#0D9488', margin: '0.5rem 0' },
  subtitle: { color: '#78716C', fontSize: '1rem' },
  error: { background: '#FEF2F2', color: '#EF4444', padding: '0.75rem 1rem', borderRadius: '12px', marginBottom: '1rem', fontSize: '0.9rem', textAlign: 'center' },
  form: { display: 'flex', flexDirection: 'column', gap: '1.25rem' },
  formGroup: { display: 'flex', flexDirection: 'column', gap: '0.5rem' },
  label: { fontWeight: 500, color: '#1C1917', fontSize: '0.95rem' },
  inputWrapper: { position: 'relative', display: 'flex', alignItems: 'center' },
  inputIcon: { position: 'absolute', left: '14px', color: '#A8A29E' },
  input: { width: '100%', padding: '14px 14px 14px 44px', border: '2px solid #E7E5E4', borderRadius: '12px', fontSize: '1rem', outline: 'none', transition: 'border-color 0.2s', background: '#FAFAF9' },
  eyeBtn: { position: 'absolute', right: '14px', background: 'none', border: 'none', cursor: 'pointer', color: '#A8A29E', padding: 0 },
  submitBtn: { padding: '14px', background: 'linear-gradient(135deg, #0D9488, #0F766E)', color: '#fff', border: 'none', borderRadius: '12px', fontSize: '1.05rem', fontWeight: 600, cursor: 'pointer', transition: 'transform 0.2s, opacity 0.2s', marginTop: '0.5rem' },
  divider: { textAlign: 'center', margin: '1.5rem 0 1rem', position: 'relative', color: '#A8A29E', fontSize: '0.85rem' },
  demoAccounts: { background: '#F5F5F4', borderRadius: '12px', padding: '1rem', marginBottom: '1rem' },
  demoText: { fontSize: '0.8rem', color: '#78716C', margin: '0.25rem 0', fontFamily: 'monospace' },
  registerLink: { textAlign: 'center', color: '#78716C', marginTop: '1rem' },
  link: { color: '#0D9488', fontWeight: 600, textDecoration: 'none' },
};
