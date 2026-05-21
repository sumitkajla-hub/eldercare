'use client';
import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';

const statusColors = { pending: '#F59E0B', accepted: '#3B82F6', 'in-progress': '#0D9488', completed: '#22C55E', cancelled: '#EF4444' };
const tabs = ['all', 'pending', 'accepted', 'in-progress', 'completed', 'cancelled'];

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetch('/api/bookings').then(r => r.json()).then(data => { setBookings(Array.isArray(data) ? data : []); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const filtered = bookings.filter(b => {
    const matchFilter = filter === 'all' || b.status === filter;
    const matchSearch = !search || (b.userId?.name || '').toLowerCase().includes(search.toLowerCase()) || (b.serviceId?.name || '').toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  if (loading) return <div style={{ padding: '3rem', textAlign: 'center' }}>Loading...</div>;

  return (
    <div>
      <h1 style={styles.title}>All Bookings</h1>
      <div style={styles.toolbar}>
        <div style={styles.searchBox}><Search size={18} style={{ color: '#A8A29E' }} /><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search..." style={styles.searchInput} /></div>
      </div>
      <div style={styles.tabs}>
        {tabs.map(t => (
          <button key={t} onClick={() => setFilter(t)} style={{ ...styles.tab, background: filter === t ? '#0D9488' : '#fff', color: filter === t ? '#fff' : '#78716C' }}>
            {t === 'all' ? 'All' : t.replace('-', ' ')} ({t === 'all' ? bookings.length : bookings.filter(b => b.status === t).length})
          </button>
        ))}
      </div>
      <div style={styles.tableCard}>
        <table style={styles.table}>
          <thead><tr><th style={styles.th}>User</th><th style={styles.th}>Service</th><th style={styles.th}>Patient</th><th style={styles.th}>Date</th><th style={styles.th}>Status</th><th style={styles.th}>Amount</th></tr></thead>
          <tbody>
            {filtered.map(b => (
              <tr key={b._id}>
                <td style={styles.td}>{b.userId?.name || 'N/A'}</td>
                <td style={styles.td}>{b.serviceId?.name || 'N/A'}</td>
                <td style={styles.td}>{b.patientId?.name || 'N/A'}</td>
                <td style={styles.td}>{new Date(b.startDate).toLocaleDateString()}</td>
                <td style={styles.td}><span style={{ ...styles.badge, background: `${statusColors[b.status]}20`, color: statusColors[b.status] }}>{b.status}</span></td>
                <td style={styles.td}><strong>₹{b.totalAmount?.toLocaleString()}</strong></td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <p style={{ textAlign: 'center', padding: '2rem', color: '#78716C' }}>No bookings found</p>}
      </div>
    </div>
  );
}

const styles = {
  title: { fontFamily: "'Outfit', sans-serif", fontSize: '1.8rem', fontWeight: 700, marginBottom: '1.5rem' },
  toolbar: { display: 'flex', gap: '1rem', marginBottom: '1rem' },
  searchBox: { display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#fff', border: '1px solid #E7E5E4', borderRadius: '10px', padding: '0 12px', flex: 1, maxWidth: '400px' },
  searchInput: { border: 'none', outline: 'none', padding: '10px 0', fontSize: '0.95rem', width: '100%' },
  tabs: { display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', overflowX: 'auto', paddingBottom: '0.25rem' },
  tab: { padding: '8px 14px', border: '1px solid #E7E5E4', borderRadius: '20px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 500, textTransform: 'capitalize', whiteSpace: 'nowrap' },
  tableCard: { background: '#fff', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: { textAlign: 'left', padding: '1rem', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', color: '#78716C', borderBottom: '2px solid #E7E5E4', background: '#FAFAF9' },
  td: { padding: '0.85rem 1rem', borderBottom: '1px solid #F5F5F4' },
  badge: { padding: '4px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 600, textTransform: 'capitalize' },
};
