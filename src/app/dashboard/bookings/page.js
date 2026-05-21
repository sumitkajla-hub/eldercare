'use client';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Calendar, Star, X } from 'lucide-react';

const statusColors = { pending: '#F59E0B', accepted: '#3B82F6', 'in-progress': '#0D9488', completed: '#22C55E', cancelled: '#EF4444' };
const tabs = ['all', 'pending', 'accepted', 'in-progress', 'completed', 'cancelled'];

export default function BookingsPage() {
  const { data: session } = useSession();
  const [bookings, setBookings] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');

  useEffect(() => { fetchBookings(); }, []);

  const fetchBookings = async () => {
    try {
      const res = await fetch('/api/bookings');
      const data = await res.json();
      setBookings(Array.isArray(data) ? data : []);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleCancel = async (id) => {
    if (!confirm('Cancel this booking?')) return;
    await fetch(`/api/bookings/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status: 'cancelled' }) });
    fetchBookings();
  };

  const handleRate = async (id) => {
    await fetch(`/api/bookings/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ rating, review }) });
    setSelectedBooking(null); setRating(0); setReview('');
    fetchBookings();
  };

  const filtered = filter === 'all' ? bookings : bookings.filter(b => b.status === filter);

  if (loading) return <div style={{ padding: '3rem', textAlign: 'center' }}>Loading...</div>;

  return (
    <div>
      <h1 style={styles.title}>My Bookings</h1>
      <div style={styles.tabs}>
        {tabs.map(t => (
          <button key={t} onClick={() => setFilter(t)} style={{ ...styles.tab, background: filter === t ? '#0D9488' : '#fff', color: filter === t ? '#fff' : '#78716C' }}>
            {t === 'all' ? 'All' : t.replace('-', ' ')} {t !== 'all' && `(${bookings.filter(b => b.status === t).length})`}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div style={styles.empty}><Calendar size={48} color="#A8A29E" /><p>No bookings found</p></div>
      ) : (
        <div style={styles.list}>
          {filtered.map(booking => (
            <div key={booking._id} style={styles.card}>
              <div style={styles.cardTop}>
                <div>
                  <h3 style={styles.serviceName}>{booking.serviceId?.name || 'Service'}</h3>
                  <p style={styles.meta}>{booking.patientId?.name || 'Patient'} • {booking.caregiverId?.userId?.name || 'Caregiver'}</p>
                  <p style={styles.meta}>{new Date(booking.startDate).toLocaleDateString()} • {booking.bookingType}</p>
                </div>
                <div style={styles.cardRight}>
                  <span style={{ ...styles.badge, background: `${statusColors[booking.status]}20`, color: statusColors[booking.status] }}>{booking.status}</span>
                  <span style={styles.amount}>₹{booking.totalAmount?.toLocaleString()}</span>
                </div>
              </div>
              <div style={styles.cardActions}>
                {booking.status === 'pending' && <button onClick={() => handleCancel(booking._id)} style={styles.cancelBtn}>Cancel</button>}
                {booking.status === 'completed' && !booking.rating && <button onClick={() => { setSelectedBooking(booking); setRating(0); setReview(''); }} style={styles.rateBtn}><Star size={16} /> Rate</button>}
                {booking.rating > 0 && <span style={styles.rated}>⭐ {booking.rating}/5</span>}
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedBooking && (
        <div style={styles.overlay}>
          <div style={styles.modal}>
            <div style={styles.modalHeader}><h2>Rate Service</h2><button onClick={() => setSelectedBooking(null)} style={styles.closeBtn}><X size={20} /></button></div>
            <p style={{ color: '#78716C', marginBottom: '1rem' }}>{selectedBooking.serviceId?.name} with {selectedBooking.caregiverId?.userId?.name}</p>
            <div style={styles.stars}>
              {[1,2,3,4,5].map(s => <button key={s} onClick={() => setRating(s)} style={{ ...styles.starBtn, color: s <= rating ? '#F59E0B' : '#E7E5E4' }}>★</button>)}
            </div>
            <textarea value={review} onChange={e => setReview(e.target.value)} placeholder="Share your experience..." style={styles.textarea} />
            <button onClick={() => handleRate(selectedBooking._id)} disabled={!rating} style={styles.submitBtn}>Submit Review</button>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  title: { fontFamily: "'Outfit', sans-serif", fontSize: '1.8rem', fontWeight: 700, marginBottom: '1.5rem' },
  tabs: { display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', overflowX: 'auto', paddingBottom: '0.25rem' },
  tab: { padding: '8px 16px', border: '1px solid #E7E5E4', borderRadius: '20px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 500, whiteSpace: 'nowrap', textTransform: 'capitalize' },
  empty: { textAlign: 'center', padding: '4rem', color: '#78716C', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' },
  list: { display: 'flex', flexDirection: 'column', gap: '1rem' },
  card: { background: '#fff', borderRadius: '16px', padding: '1.5rem', border: '1px solid #E7E5E4', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' },
  cardTop: { display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '1rem' },
  serviceName: { fontFamily: "'Outfit',sans-serif", fontSize: '1.1rem', fontWeight: 600, margin: '0 0 0.25rem' },
  meta: { color: '#78716C', fontSize: '0.85rem', margin: '0.15rem 0' },
  cardRight: { display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem' },
  badge: { padding: '4px 14px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600, textTransform: 'capitalize' },
  amount: { fontWeight: 700, fontSize: '1.1rem', color: '#1C1917' },
  cardActions: { display: 'flex', gap: '0.75rem', borderTop: '1px solid #F5F5F4', paddingTop: '1rem' },
  cancelBtn: { padding: '8px 16px', background: '#FEF2F2', color: '#EF4444', border: 'none', borderRadius: '8px', fontWeight: 500, cursor: 'pointer' },
  rateBtn: { padding: '8px 16px', background: '#FFFBEB', color: '#D97706', border: 'none', borderRadius: '8px', fontWeight: 500, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem' },
  rated: { color: '#F59E0B', fontWeight: 600 },
  overlay: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 },
  modal: { background: '#fff', borderRadius: '20px', padding: '2rem', maxWidth: '450px', width: '90%' },
  modalHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' },
  closeBtn: { background: 'none', border: 'none', cursor: 'pointer', color: '#78716C' },
  stars: { display: 'flex', gap: '0.5rem', justifyContent: 'center', margin: '1rem 0' },
  starBtn: { background: 'none', border: 'none', fontSize: '2.5rem', cursor: 'pointer', transition: 'color 0.2s' },
  textarea: { width: '100%', padding: '12px', border: '2px solid #E7E5E4', borderRadius: '10px', fontSize: '0.95rem', minHeight: '100px', resize: 'vertical', outline: 'none', boxSizing: 'border-box' },
  submitBtn: { width: '100%', padding: '14px', background: 'linear-gradient(135deg, #0D9488, #0F766E)', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: 600, cursor: 'pointer', marginTop: '1rem' },
};
