'use client';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Save, ShieldCheck, X } from 'lucide-react';

export default function CaregiverProfilePage() {
  const { data: session } = useSession();
  const [caregiver, setCaregiver] = useState(null);
  const [form, setForm] = useState({ specialization: '', experience: '', bio: '', hourlyRate: '', dailyRate: '', monthlyRate: '', serviceAreas: '', languages: '', qualifications: '' });
  const [userForm, setUserForm] = useState({ name: '', phone: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => { fetchProfile(); }, []);

  const fetchProfile = async () => {
    try {
      const res = await fetch('/api/caregivers');
      const data = await res.json();
      const cg = Array.isArray(data) ? data[0] : data;
      if (cg) {
        setCaregiver(cg);
        setForm({ specialization: cg.specialization || '', experience: cg.experience || '', bio: cg.bio || '', hourlyRate: cg.hourlyRate || '', dailyRate: cg.dailyRate || '', monthlyRate: cg.monthlyRate || '', serviceAreas: cg.serviceAreas?.join(', ') || '', languages: cg.languages?.join(', ') || '', qualifications: cg.qualifications?.join(', ') || '' });
        setUserForm({ name: cg.userId?.name || '', phone: cg.userId?.phone || '' });
      }
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await fetch(`/api/caregivers/${caregiver._id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...form, serviceAreas: form.serviceAreas.split(',').map(s => s.trim()), languages: form.languages.split(',').map(s => s.trim()), qualifications: form.qualifications.split(',').map(s => s.trim()), experience: parseInt(form.experience), hourlyRate: parseInt(form.hourlyRate), dailyRate: parseInt(form.dailyRate), monthlyRate: parseInt(form.monthlyRate) }) });
      setMsg('Profile updated!');
      setTimeout(() => setMsg(''), 3000);
    } catch (err) { console.error(err); }
    finally { setSaving(false); }
  };

  if (loading) return <div style={{ padding: '3rem', textAlign: 'center' }}>Loading...</div>;

  return (
    <div style={{ maxWidth: '700px' }}>
      <h1 style={styles.title}>My Profile</h1>

      <div style={styles.verifyBadge}>
        <ShieldCheck size={20} color={caregiver?.isVerified ? '#22C55E' : '#F59E0B'} />
        <span style={{ color: caregiver?.isVerified ? '#22C55E' : '#F59E0B', fontWeight: 600 }}>
          {caregiver?.isVerified ? 'Verified Caregiver' : 'Verification Pending'}
        </span>
      </div>

      {msg && <div style={styles.success}>{msg}</div>}

      <form onSubmit={handleSave} style={styles.form}>
        <h3 style={styles.sectionLabel}>Personal Information</h3>
        <div style={styles.row}>
          <div style={styles.formGroup}><label style={styles.label}>Name</label><input value={userForm.name} disabled style={{ ...styles.input, background: '#F5F5F4' }} /></div>
          <div style={styles.formGroup}><label style={styles.label}>Phone</label><input value={userForm.phone} disabled style={{ ...styles.input, background: '#F5F5F4' }} /></div>
        </div>

        <h3 style={styles.sectionLabel}>Professional Details</h3>
        <div style={styles.row}>
          <div style={styles.formGroup}><label style={styles.label}>Specialization</label><select value={form.specialization} onChange={e => setForm({ ...form, specialization: e.target.value })} style={styles.input}><option value="nursing">Nursing</option><option value="attendant">Attendant</option><option value="physiotherapy">Physiotherapy</option><option value="post-hospital">Post-Hospital</option></select></div>
          <div style={styles.formGroup}><label style={styles.label}>Experience (years)</label><input type="number" value={form.experience} onChange={e => setForm({ ...form, experience: e.target.value })} style={styles.input} /></div>
        </div>
        <div style={styles.formGroup}><label style={styles.label}>Qualifications (comma separated)</label><input value={form.qualifications} onChange={e => setForm({ ...form, qualifications: e.target.value })} style={styles.input} /></div>
        <div style={styles.formGroup}><label style={styles.label}>Bio</label><textarea value={form.bio} onChange={e => setForm({ ...form, bio: e.target.value })} style={{ ...styles.input, minHeight: '100px' }} placeholder="Tell families about your experience..." /></div>

        <h3 style={styles.sectionLabel}>Rates</h3>
        <div style={styles.row3}>
          <div style={styles.formGroup}><label style={styles.label}>Hourly (₹)</label><input type="number" value={form.hourlyRate} onChange={e => setForm({ ...form, hourlyRate: e.target.value })} style={styles.input} /></div>
          <div style={styles.formGroup}><label style={styles.label}>Daily (₹)</label><input type="number" value={form.dailyRate} onChange={e => setForm({ ...form, dailyRate: e.target.value })} style={styles.input} /></div>
          <div style={styles.formGroup}><label style={styles.label}>Monthly (₹)</label><input type="number" value={form.monthlyRate} onChange={e => setForm({ ...form, monthlyRate: e.target.value })} style={styles.input} /></div>
        </div>

        <div style={styles.formGroup}><label style={styles.label}>Service Areas (comma separated)</label><input value={form.serviceAreas} onChange={e => setForm({ ...form, serviceAreas: e.target.value })} style={styles.input} /></div>
        <div style={styles.formGroup}><label style={styles.label}>Languages (comma separated)</label><input value={form.languages} onChange={e => setForm({ ...form, languages: e.target.value })} style={styles.input} /></div>

        <button type="submit" disabled={saving} style={styles.saveBtn}><Save size={18} /> {saving ? 'Saving...' : 'Save Profile'}</button>
      </form>
    </div>
  );
}

const styles = {
  title: { fontFamily: "'Outfit', sans-serif", fontSize: '1.8rem', fontWeight: 700, marginBottom: '1rem' },
  verifyBadge: { display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', padding: '0.75rem 1rem', background: '#fff', borderRadius: '12px', border: '1px solid #E7E5E4', width: 'fit-content' },
  success: { background: '#F0FDF4', color: '#22C55E', padding: '0.75rem', borderRadius: '10px', marginBottom: '1rem', fontWeight: 500 },
  form: { display: 'flex', flexDirection: 'column', gap: '1rem', background: '#fff', padding: '2rem', borderRadius: '16px', border: '1px solid #E7E5E4' },
  sectionLabel: { fontFamily: "'Outfit',sans-serif", fontSize: '1.1rem', fontWeight: 600, color: '#1C1917', margin: '0.5rem 0 0' },
  row: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' },
  row3: { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' },
  formGroup: { display: 'flex', flexDirection: 'column', gap: '0.3rem' },
  label: { fontWeight: 500, fontSize: '0.85rem', color: '#78716C' },
  input: { padding: '12px', border: '2px solid #E7E5E4', borderRadius: '10px', fontSize: '0.95rem', outline: 'none', width: '100%', boxSizing: 'border-box' },
  saveBtn: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '14px', background: 'linear-gradient(135deg, #4F46E5, #6366F1)', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: 600, cursor: 'pointer', marginTop: '0.5rem' },
};
