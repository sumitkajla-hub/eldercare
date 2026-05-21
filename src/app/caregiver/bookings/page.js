'use client';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Play, CheckCircle, FileText, X } from 'lucide-react';

const statusColors = { pending: '#F59E0B', accepted: '#3B82F6', 'in-progress': '#0D9488', completed: '#22C55E', cancelled: '#EF4444' };

export default function CaregiverBookingsPage() {
  const { data: session } = useSession();
  const [bookings, setBookings] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [showNoteModal, setShowNoteModal] = useState(null);
  const [noteForm, setNoteForm] = useState({ note: '', vitals: { bp: '', temperature: '', pulse: '' } });

  useEffect(() => { fetchBookings(); }, []);

  const fetchBookings = async () => {
    try {
      const res = await fetch('/api/bookings');
      const data = await res.json();
      setBookings(Array.isArray(data) ? data : []);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const updateStatus = async (id, status) => {
    await fetch(`/api/bookings/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status }) });
    fetchBookings();
  };

  const submitNote = async () => {
    if (!showNoteModal) return;
    const booking = bookings.find(b => b._id === showNoteModal);
    await fetch('/api/care-notes', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ bookingId: showNoteModal, caregiverId: booking?.caregiverId?._id || booking?.caregiverId, ...noteForm }) });
    setShowNoteModal(null);
    setNoteForm({ note: '', vitals: { bp: '', temperature: '', pulse: '' } });
  };

  const filtered = filter === 'all' ? bookings : bookings.filter(b => filter === 'active' ? ['accepted', 'in-progress'].includes(b.status) : b.status === filter);

  if (loading) return <div style={{ padding: '3rem', textAlign: 'center' }}>Loading...</div>;

  return (
    <div>
      <h1 style={styles.title}>My Bookings</h1>
      <div style={styles.tabs}>
        {['all', 'active', 'completed'].map(t => (
          <button key={t} onClick={() => setFilter(t)} style={{ ...styles.tab, background: filter === t ? '#4F46E5' : '#fff', color: filter === t ? '#fff' : '#78716C' }}>
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div style={styles.empty}><p>No bookings found</p></div>
      ) : (
        <div style={styles.list}>
          {filtered.map(b => (
            <div key={b._id} style={styles.card}>
              <div style={styles.cardTop}>
                <div>
                  <h3 style={styles.serviceName}>{b.serviceId?.name || 'Service'}</h3>
                  <p style={styles.meta}>Patient: {b.patientId?.name || 'N/A'}</p>
                  <p style={styles.meta}>{new Date(b.startDate).toLocaleDateString()} • {b.scheduledTime}</p>
                </div>
                <span style={{ ...styles.badge, background: `${statusColors[b.status]}20`, color: statusColors[b.status] }}>{b.status}</span>
              </div>
              <div style={styles.actions}>
                {b.status === 'accepted' && <button onClick={() => updateStatus(b._id, 'in-progress')} style={styles.startBtn}><Play size={16} /> Start Service</button>}
                {b.status === 'in-progress' && (
                  <>
                    <button onClick={() => updateStatus(b._id, 'completed')} style={styles.completeBtn}><CheckCircle size={16} /> Complete</button>
                    <button onClick={() => setShowNoteModal(b._id)} style={styles.noteBtn}><FileText size={16} /> Add Note</button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {showNoteModal && (
        <div style={styles.overlay}>
          <div style={styles.modal}>
            <div style={styles.modalHeader}><h2>Add Care Note</h2><button onClick={() => setShowNoteModal(null)} style={styles.closeBtn}><X size={20} /></button></div>
            <div style={styles.form}>
              <div style={styles.formGroup}><label style={styles.label}>Notes</label><textarea value={noteForm.note} onChange={e => setNoteForm({ ...noteForm, note: e.target.value })} style={{ ...styles.input, minHeight: '100px' }} placeholder="Describe the care provided..." required /></div>
              <h3 style={styles.label}>Vitals</h3>
              <div style={styles.vitalsRow}>
                <div style={styles.formGroup}><label style={styles.smallLabel}>BP</label><input value={noteForm.vitals.bp} onChange={e => setNoteForm({ ...noteForm, vitals: { ...noteForm.vitals, bp: e.target.value } })} style={styles.input} placeholder="120/80" /></div>
                <div style={styles.formGroup}><label style={styles.smallLabel}>Temp (°F)</label><input value={noteForm.vitals.temperature} onChange={e => setNoteForm({ ...noteForm, vitals: { ...noteForm.vitals, temperature: e.target.value } })} style={styles.input} placeholder="98.6" /></div>
                <div style={styles.formGroup}><label style={styles.smallLabel}>Pulse</label><input value={noteForm.vitals.pulse} onChange={e => setNoteForm({ ...noteForm, vitals: { ...noteForm.vitals, pulse: e.target.value } })} style={styles.input} placeholder="72" /></div>
              </div>
              <button onClick={submitNote} style={styles.submitBtn}>Save Care Note</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  title: { fontFamily: "'Outfit', sans-serif", fontSize: '1.8rem', fontWeight: 700, marginBottom: '1.5rem' },
  tabs: { display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' },
  tab: { padding: '8px 16px', border: '1px solid #E7E5E4', borderRadius: '20px', cursor: 'pointer', fontWeight: 500, fontSize: '0.85rem' },
  empty: { textAlign: 'center', padding: '3rem', color: '#78716C' },
  list: { display: 'flex', flexDirection: 'column', gap: '1rem' },
  card: { background: '#fff', borderRadius: '16px', padding: '1.5rem', border: '1px solid #E7E5E4' },
  cardTop: { display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' },
  serviceName: { fontWeight: 600, fontSize: '1.1rem', margin: '0 0 0.25rem' },
  meta: { color: '#78716C', fontSize: '0.85rem', margin: '0.1rem 0' },
  badge: { padding: '4px 14px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600, textTransform: 'capitalize', height: 'fit-content' },
  actions: { display: 'flex', gap: '0.75rem', borderTop: '1px solid #F5F5F4', paddingTop: '1rem' },
  startBtn: { display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '10px 16px', background: '#3B82F6', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 600, cursor: 'pointer' },
  completeBtn: { display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '10px 16px', background: '#22C55E', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 600, cursor: 'pointer' },
  noteBtn: { display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '10px 16px', background: '#EFF6FF', color: '#3B82F6', border: 'none', borderRadius: '10px', fontWeight: 600, cursor: 'pointer' },
  overlay: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 },
  modal: { background: '#fff', borderRadius: '20px', padding: '2rem', maxWidth: '500px', width: '90%' },
  modalHeader: { display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' },
  closeBtn: { background: 'none', border: 'none', cursor: 'pointer', color: '#78716C' },
  form: { display: 'flex', flexDirection: 'column', gap: '1rem' },
  formGroup: { display: 'flex', flexDirection: 'column', gap: '0.3rem' },
  label: { fontWeight: 600, fontSize: '0.95rem', color: '#1C1917' },
  smallLabel: { fontWeight: 500, fontSize: '0.85rem', color: '#78716C' },
  input: { padding: '12px', border: '2px solid #E7E5E4', borderRadius: '10px', fontSize: '0.95rem', outline: 'none', width: '100%', boxSizing: 'border-box' },
  vitalsRow: { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem' },
  submitBtn: { padding: '14px', background: 'linear-gradient(135deg, #4F46E5, #6366F1)', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: 600, cursor: 'pointer' },
};
