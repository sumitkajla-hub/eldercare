'use client';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { User, Save } from 'lucide-react';

export default function ProfilePage() {
  const { data: session } = useSession();
  const [form, setForm] = useState({ name: '', email: '', phone: '', address: '', city: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    if (session?.user?.id) {
      fetch(`/api/users/${session.user.id}`).then(r => r.json()).then(data => {
        setForm({ name: data.name || '', email: data.email || '', phone: data.phone || '', address: data.address || '', city: data.city || '' });
        setLoading(false);
      }).catch(() => setLoading(false));
    }
  }, [session]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch(`/api/users/${session.user.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: form.name, phone: form.phone, address: form.address, city: form.city }) });
      if (res.ok) setMsg('Profile updated successfully!');
      setTimeout(() => setMsg(''), 3000);
    } catch (err) { console.error(err); }
    finally { setSaving(false); }
  };

  if (loading) return <div style={{ padding: '3rem', textAlign: 'center' }}>Loading...</div>;

  return (
    <div style={{ maxWidth: '600px' }}>
      <h1 style={styles.title}>My Profile</h1>
      <div style={styles.avatarSection}>
        <div style={styles.avatar}>{form.name?.[0] || 'U'}</div>
        <div><h3 style={{ margin: 0, fontFamily: "'Outfit',sans-serif" }}>{form.name}</h3><p style={{ color: '#78716C', margin: '0.25rem 0 0', fontSize: '0.9rem' }}>{form.email}</p></div>
      </div>
      {msg && <div style={styles.success}>{msg}</div>}
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.formGroup}><label style={styles.label}>Full Name</label><input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} style={styles.input} required /></div>
        <div style={styles.formGroup}><label style={styles.label}>Email</label><input value={form.email} style={{ ...styles.input, background: '#F5F5F4', color: '#A8A29E' }} disabled /></div>
        <div style={styles.formGroup}><label style={styles.label}>Phone</label><input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} style={styles.input} /></div>
        <div style={styles.formGroup}><label style={styles.label}>Address</label><input value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} style={styles.input} placeholder="Enter your address" /></div>
        <div style={styles.formGroup}><label style={styles.label}>City</label><input value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} style={styles.input} placeholder="Enter your city" /></div>
        <button type="submit" disabled={saving} style={styles.submitBtn}><Save size={18} /> {saving ? 'Saving...' : 'Save Changes'}</button>
      </form>
    </div>
  );
}

const styles = {
  title: { fontFamily: "'Outfit', sans-serif", fontSize: '1.8rem', fontWeight: 700, marginBottom: '1.5rem' },
  avatarSection: { display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem', background: '#fff', padding: '1.5rem', borderRadius: '16px', border: '1px solid #E7E5E4' },
  avatar: { width: '64px', height: '64px', borderRadius: '50%', background: 'linear-gradient(135deg, #0D9488, #14B8A6)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '1.5rem', fontFamily: "'Outfit',sans-serif" },
  success: { background: '#F0FDF4', color: '#22C55E', padding: '0.75rem 1rem', borderRadius: '12px', marginBottom: '1rem', fontWeight: 500 },
  form: { display: 'flex', flexDirection: 'column', gap: '1.25rem', background: '#fff', padding: '2rem', borderRadius: '16px', border: '1px solid #E7E5E4' },
  formGroup: { display: 'flex', flexDirection: 'column', gap: '0.4rem' },
  label: { fontWeight: 500, fontSize: '0.9rem', color: '#1C1917' },
  input: { padding: '12px', border: '2px solid #E7E5E4', borderRadius: '10px', fontSize: '0.95rem', outline: 'none', background: '#FAFAF9' },
  submitBtn: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '14px', background: 'linear-gradient(135deg, #0D9488, #0F766E)', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: 600, cursor: 'pointer', marginTop: '0.5rem' },
};
