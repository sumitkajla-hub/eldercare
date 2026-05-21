'use client';
import { useState, useEffect } from 'react';
import { DollarSign } from 'lucide-react';

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export default function EarningsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/bookings').then(r => r.json()).then(data => {
      setBookings(Array.isArray(data) ? data.filter(b => b.status === 'completed') : []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const totalEarnings = bookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0);

  const monthlyData = months.map((m, i) => ({
    month: m,
    amount: bookings.filter(b => new Date(b.createdAt).getMonth() === i).reduce((s, b) => s + (b.totalAmount || 0), 0),
  }));
  const maxMonthly = Math.max(...monthlyData.map(d => d.amount), 1);

  if (loading) return <div style={{ padding: '3rem', textAlign: 'center' }}>Loading...</div>;

  return (
    <div>
      <h1 style={styles.title}>Earnings</h1>

      <div style={styles.totalCard}>
        <DollarSign size={32} color="#0D9488" />
        <div>
          <p style={styles.totalLabel}>Total Earnings</p>
          <p style={styles.totalValue}>₹{totalEarnings.toLocaleString()}</p>
        </div>
      </div>

      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Monthly Earnings</h2>
        <div style={styles.chart}>
          {monthlyData.map((d, i) => (
            <div key={i} style={styles.barContainer}>
              <div style={{ ...styles.bar, height: `${(d.amount / maxMonthly) * 200}px`, background: d.amount > 0 ? 'linear-gradient(180deg, #0D9488, #14B8A6)' : '#E7E5E4' }} />
              <span style={styles.barLabel}>{d.month}</span>
              {d.amount > 0 && <span style={styles.barValue}>₹{(d.amount / 1000).toFixed(0)}k</span>}
            </div>
          ))}
        </div>
      </div>

      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Transaction History</h2>
        {bookings.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#78716C', padding: '2rem' }}>No completed bookings yet</p>
        ) : (
          <div style={styles.table}>
            <div style={styles.tableHeader}>
              <span>Service</span><span>Date</span><span>Amount</span>
            </div>
            {bookings.map(b => (
              <div key={b._id} style={styles.tableRow}>
                <span style={styles.cellService}>{b.serviceId?.name || 'Service'}</span>
                <span style={styles.cellDate}>{new Date(b.createdAt).toLocaleDateString()}</span>
                <span style={styles.cellAmount}>₹{b.totalAmount?.toLocaleString()}</span>
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
  totalCard: { display: 'flex', alignItems: 'center', gap: '1rem', background: 'linear-gradient(135deg, #F0FDFA, #fff)', border: '2px solid #99F6E4', borderRadius: '20px', padding: '2rem', marginBottom: '2rem' },
  totalLabel: { color: '#78716C', fontSize: '0.9rem', margin: '0 0 0.25rem' },
  totalValue: { fontFamily: "'Outfit',sans-serif", fontSize: '2.5rem', fontWeight: 700, color: '#0D9488', margin: 0 },
  section: { background: '#fff', borderRadius: '16px', padding: '2rem', marginBottom: '1.5rem', border: '1px solid #E7E5E4' },
  sectionTitle: { fontFamily: "'Outfit',sans-serif", fontSize: '1.2rem', fontWeight: 600, marginBottom: '1.5rem' },
  chart: { display: 'flex', alignItems: 'flex-end', gap: '0.5rem', height: '240px', paddingTop: '40px' },
  barContainer: { flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem', position: 'relative' },
  bar: { width: '100%', maxWidth: '40px', borderRadius: '6px 6px 0 0', transition: 'height 0.5s ease', minHeight: '4px' },
  barLabel: { fontSize: '0.7rem', color: '#78716C' },
  barValue: { fontSize: '0.65rem', color: '#0D9488', fontWeight: 600, position: 'absolute', top: '-20px' },
  table: {},
  tableHeader: { display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', padding: '0.75rem 0', borderBottom: '2px solid #E7E5E4', fontWeight: 600, color: '#78716C', fontSize: '0.85rem' },
  tableRow: { display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', padding: '0.75rem 0', borderBottom: '1px solid #F5F5F4' },
  cellService: { fontWeight: 500 },
  cellDate: { color: '#78716C', fontSize: '0.9rem' },
  cellAmount: { fontWeight: 600, color: '#0D9488' },
};
