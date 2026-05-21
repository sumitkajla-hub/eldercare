'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { HeartPulse, User, Stethoscope, ArrowLeft, ArrowRight, Check } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [role, setRole] = useState('');
  const [formData, setFormData] = useState({ name: '', email: '', password: '', phone: '', specialization: '', experience: '', hourlyRate: '', qualifications: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const updateField = (field, value) => setFormData(prev => ({ ...prev, [field]: value }));

  const handleSubmit = async () => {
    setError('');
    setLoading(true);
    try {
      const payload = { ...formData, role };
      if (role === 'caregiver') {
        payload.qualifications = formData.qualifications.split(',').map(q => q.trim());
      }
      const res = await fetch('/api/auth/register', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || data.error || 'Registration failed');
      setSuccess(true);
      setTimeout(() => router.push('/login'), 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <div style={{ ...styles.logoIcon, background: 'linear-gradient(135deg, #22C55E, #16A34A)', margin: '0 auto 1rem' }}><Check size={32} color="#fff" /></div>
            <h2 style={{ fontFamily: "'Outfit', sans-serif", color: '#22C55E' }}>Registration Successful!</h2>
            <p style={{ color: '#78716C' }}>Redirecting to login page...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.logoSection}>
          <div style={styles.logoIcon}><HeartPulse size={32} color="#fff" /></div>
          <h1 style={styles.logoText}>Create Account</h1>
          <div style={styles.progressBar}>
            {[1, 2, 3].map(s => (
              <div key={s} style={{ ...styles.progressStep, background: s <= step ? '#0D9488' : '#E7E5E4', display: role !== 'caregiver' && s === 3 ? 'none' : 'block' }} />
            ))}
          </div>
        </div>

        {error && <div style={styles.error}>{error}</div>}

        {step === 1 && (
          <div style={styles.roleSelection}>
            <p style={{ textAlign: 'center', color: '#78716C', marginBottom: '1.5rem', fontSize: '1.05rem' }}>I want to...</p>
            <div style={styles.roleCards}>
              <button onClick={() => { setRole('user'); setStep(2); }} style={{ ...styles.roleCard, borderColor: role === 'user' ? '#0D9488' : '#E7E5E4' }}>
                <User size={40} color="#0D9488" />
                <h3 style={styles.roleTitle}>Find Care</h3>
                <p style={styles.roleDesc}>Book caregivers for my elderly family member</p>
              </button>
              <button onClick={() => { setRole('caregiver'); setStep(2); }} style={{ ...styles.roleCard, borderColor: role === 'caregiver' ? '#4F46E5' : '#E7E5E4' }}>
                <Stethoscope size={40} color="#4F46E5" />
                <h3 style={styles.roleTitle}>Provide Care</h3>
                <p style={styles.roleDesc}>Register as a healthcare professional</p>
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <form onSubmit={(e) => { e.preventDefault(); role === 'caregiver' ? setStep(3) : handleSubmit(); }} style={styles.form}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Full Name</label>
              <input type="text" value={formData.name} onChange={(e) => updateField('name', e.target.value)} required style={styles.input} placeholder="Enter your full name" />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Email</label>
              <input type="email" value={formData.email} onChange={(e) => updateField('email', e.target.value)} required style={styles.input} placeholder="Enter your email" />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Password</label>
              <input type="password" value={formData.password} onChange={(e) => updateField('password', e.target.value)} required minLength={6} style={styles.input} placeholder="Min 6 characters" />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Phone</label>
              <input type="tel" value={formData.phone} onChange={(e) => updateField('phone', e.target.value)} required style={styles.input} placeholder="Enter phone number" />
            </div>
            <div style={styles.btnRow}>
              <button type="button" onClick={() => setStep(1)} style={styles.backBtn}><ArrowLeft size={18} /> Back</button>
              <button type="submit" disabled={loading} style={styles.nextBtn}>{role === 'caregiver' ? 'Next' : loading ? 'Creating...' : 'Create Account'} <ArrowRight size={18} /></button>
            </div>
          </form>
        )}

        {step === 3 && role === 'caregiver' && (
          <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} style={styles.form}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Specialization</label>
              <select value={formData.specialization} onChange={(e) => updateField('specialization', e.target.value)} required style={styles.input}>
                <option value="">Select specialization</option>
                <option value="nursing">Nursing Care</option>
                <option value="attendant">Elderly Attendant</option>
                <option value="physiotherapy">Physiotherapy</option>
                <option value="post-hospital">Post-Hospital Care</option>
              </select>
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Experience (years)</label>
              <input type="number" value={formData.experience} onChange={(e) => updateField('experience', e.target.value)} required min={0} style={styles.input} placeholder="Years of experience" />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Hourly Rate (₹)</label>
              <input type="number" value={formData.hourlyRate} onChange={(e) => updateField('hourlyRate', e.target.value)} required min={0} style={styles.input} placeholder="Rate per hour" />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Qualifications (comma separated)</label>
              <input type="text" value={formData.qualifications} onChange={(e) => updateField('qualifications', e.target.value)} required style={styles.input} placeholder="e.g. BSc Nursing, ICU Certified" />
            </div>
            <div style={styles.btnRow}>
              <button type="button" onClick={() => setStep(2)} style={styles.backBtn}><ArrowLeft size={18} /> Back</button>
              <button type="submit" disabled={loading} style={styles.nextBtn}>{loading ? 'Creating...' : 'Register'} <Check size={18} /></button>
            </div>
          </form>
        )}

        <p style={styles.loginLink}>Already have an account? <Link href="/login" style={styles.link}>Sign In</Link></p>
      </div>
    </div>
  );
}

const styles = {
  container: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', background: 'linear-gradient(135deg, #f0fdfa 0%, #f5f5f4 50%, #eff6ff 100%)' },
  card: { background: '#fff', borderRadius: '24px', padding: '2.5rem', maxWidth: '520px', width: '100%', boxShadow: '0 20px 60px rgba(0,0,0,0.08)' },
  logoSection: { textAlign: 'center', marginBottom: '2rem' },
  logoIcon: { width: '64px', height: '64px', borderRadius: '16px', background: 'linear-gradient(135deg, #0D9488, #14B8A6)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' },
  logoText: { fontFamily: "'Outfit', sans-serif", fontSize: '1.8rem', fontWeight: 700, color: '#1C1917', margin: '0.5rem 0' },
  progressBar: { display: 'flex', gap: '8px', justifyContent: 'center', marginTop: '1rem' },
  progressStep: { width: '60px', height: '4px', borderRadius: '4px', transition: 'background 0.3s' },
  error: { background: '#FEF2F2', color: '#EF4444', padding: '0.75rem 1rem', borderRadius: '12px', marginBottom: '1rem', fontSize: '0.9rem', textAlign: 'center' },
  roleSelection: { padding: '1rem 0' },
  roleCards: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' },
  roleCard: { background: '#fff', border: '2px solid', borderRadius: '16px', padding: '2rem 1.5rem', cursor: 'pointer', textAlign: 'center', transition: 'all 0.3s', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' },
  roleTitle: { fontFamily: "'Outfit', sans-serif", fontSize: '1.1rem', fontWeight: 600, color: '#1C1917', margin: 0 },
  roleDesc: { fontSize: '0.85rem', color: '#78716C', margin: 0 },
  form: { display: 'flex', flexDirection: 'column', gap: '1.25rem' },
  formGroup: { display: 'flex', flexDirection: 'column', gap: '0.5rem' },
  label: { fontWeight: 500, color: '#1C1917', fontSize: '0.95rem' },
  input: { width: '100%', padding: '14px', border: '2px solid #E7E5E4', borderRadius: '12px', fontSize: '1rem', outline: 'none', background: '#FAFAF9', boxSizing: 'border-box' },
  btnRow: { display: 'flex', gap: '1rem', marginTop: '0.5rem' },
  backBtn: { flex: 1, padding: '14px', background: '#F5F5F4', color: '#1C1917', border: 'none', borderRadius: '12px', fontSize: '1rem', fontWeight: 500, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' },
  nextBtn: { flex: 2, padding: '14px', background: 'linear-gradient(135deg, #0D9488, #0F766E)', color: '#fff', border: 'none', borderRadius: '12px', fontSize: '1rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' },
  loginLink: { textAlign: 'center', color: '#78716C', marginTop: '1.5rem' },
  link: { color: '#0D9488', fontWeight: 600, textDecoration: 'none' },
};
