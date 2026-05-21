'use client';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Save, Calendar } from 'lucide-react';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export default function SchedulePage() {
  const { data: session } = useSession();
  const [caregiver, setCaregiver] = useState(null);
  const [availability, setAvailability] = useState({ days: [], hours: { start: '08:00', end: '20:00' } });
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const [cgRes, bkRes] = await Promise.all([fetch('/api/caregivers'), fetch('/api/bookings')]);
      const cgData = await cgRes.json();
      const bkData = await bkRes.json();
      const cg = Array.isArray(cgData) ? cgData[0] : cgData;
      if (cg) { setCaregiver(cg); setAvailability(cg.availability || { days: [], hours: { start: '08:00', end: '20:00' } }); }
      setBookings(Array.isArray(bkData) ? bkData.filter(b => ['accepted', 'in-progress'].includes(b.status)) : []);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const toggleDay = (day) => {
    setAvailability(prev => ({ ...prev, days: prev.days.includes(day) ? prev.days.filter(d => d !== day) : [...prev.days, day] }));
  };

  const handleSave = async () => {
    if (!caregiver) return;
    setSaving(true);
    try {
      await fetch(`/api/caregivers/${caregiver._id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ availability }) });
      setMsg('Schedule saved!');
      setTimeout(() => setMsg(''), 3000);
    } catch (err) { console.error(err); }
    finally { setSaving(false); }
  };

  if (loading) return <div style={{ padding: '3rem', textAlign: 'center' }}>Loading...</div>;

  return (
    <div>
      <h1 style={styles.title}>My Schedule</h1>

      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Availability</h2>
        {msg && <div style={styles.success}>{msg}</div>}
        <div style={styles.daysGrid}>
          {DAYS.map(day => (
            <button key={day} onClick={() => toggleDay(day)} style={{ ...styles.dayBtn, background: availability.days.includes(day) ? '#0D9488' : '#fff', color: availability.days.includes(day) ? '#fff' : '#78716C', borderColor: availability.days.includes(day) ? '#0D9488' : '#E7E5E4' }}>
              {day.substring(0, 3)}
            </button>
          ))}
        </div>
        <div style={styles.timeRow}>
          <div style={styles.formGroup}><label style={styles.label}>Start Time</label><input type="time" value={availability.hours?.start || '08:00'} onChange={e => setAvailability({ ...availability, hours: { ...availability.hours, start: e.target.value } })} style={styles.input} /></div>
          <div style={styles.formGroup}><label style={styles.label}>End Time</label><input type="time" value={availability.hours?.end || '20:00'} onChange={e => setAvailability({ ...availability, hours: { ...availability.hours, end: e.target.value } })} style={styles.input} /></div>
        </div>
        <button onClick={handleSave} disabled={saving} style={styles.saveBtn}><Save size={18} /> {saving ? 'Saving...' : 'Save Availability'}</button>
      </div>

      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Upcoming Bookings</h2>
        {bookings.length === 0 ? (
          <p style={{ color: '#78716C', textAlign: 'center', padding: '2rem' }}>No upcoming bookings</p>
        ) : (
          <div style={styles.bookingsList}>
            {bookings.map(b => (
              <div key={b._id} style={styles.bookingCard}>
                <div style={styles.bookingDate}><Calendar size={16} /> {new Date(b.startDate).toLocaleDateString()}</div>
                <h3 style={styles.bookingService}>{b.serviceId?.name}</h3>
                <p style={styles.bookingMeta}>Patient: {b.patientId?.name} • {b.scheduledTime}</p>
                <span style={{ ...styles.badge, background: b.status === 'in-progress' ? '#0D948820' : '#3B82F620', color: b.status === 'in-progress' ? '#0D9488' : '#3B82F6' }}>{b.status}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  title: { fontFamily: "'Outfit', sans-serif", fontSize: '1.8rem', fontWeight: 700, marginBottom: '1.5rem' },
  section: { background: '#fff', borderRadius: '16px', padding: '2rem', marginBottom: '1.5rem', border: '1px solid #E7E5E4' },
  sectionTitle: { fontFamily: "'Outfit',sans-serif", fontSize: '1.2rem', fontWeight: 600, marginBottom: '1.25rem' },
  success: { background: '#F0FDF4', color: '#22C55E', padding: '0.75rem', borderRadius: '10px', marginBottom: '1rem', fontWeight: 500 },
  daysGrid: { display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.5rem' },
  dayBtn: { padding: '10px 16px', border: '2px solid', borderRadius: '10px', cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem', transition: 'all 0.2s' },
  timeRow: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' },
  formGroup: { display: 'flex', flexDirection: 'column', gap: '0.4rem' },
  label: { fontWeight: 500, fontSize: '0.9rem', color: '#1C1917' },
  input: { padding: '12px', border: '2px solid #E7E5E4', borderRadius: '10px', fontSize: '0.95rem', outline: 'none' },
  saveBtn: { display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '12px 24px', background: 'linear-gradient(135deg, #0D9488, #0F766E)', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: 600, cursor: 'pointer' },
  bookingsList: { display: 'flex', flexDirection: 'column', gap: '0.75rem' },
  bookingCard: { padding: '1rem', background: '#FAFAF9', borderRadius: '12px', border: '1px solid #E7E5E4' },
  bookingDate: { display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#0D9488', fontSize: '0.85rem', fontWeight: 500, marginBottom: '0.25rem' },
  bookingService: { fontWeight: 600, margin: '0.25rem 0', fontSize: '1rem' },
  bookingMeta: { color: '#78716C', fontSize: '0.85rem', marginBottom: '0.5rem' },
  badge: { padding: '4px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 600, textTransform: 'capitalize' },
};
