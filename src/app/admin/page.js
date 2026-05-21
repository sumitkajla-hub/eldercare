'use client';
import { useState, useEffect } from 'react';
import { Users, ShieldCheck, Calendar, DollarSign, Package, Star, TrendingUp, Activity } from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/stats').then(r => r.json()).then(data => { setStats(data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  if (loading) return <div style={{ padding: '3rem', textAlign: 'center' }}>Loading dashboard...</div>;

  const kpis = [
    { label: 'Total Users', value: stats?.totalUsers || 0, icon: <Users size={24} />, color: '#0D9488', trend: '+12%' },
    { label: 'Verified Caregivers', value: stats?.verifiedCaregivers || 0, icon: <ShieldCheck size={24} />, color: '#4F46E5', trend: '+8%' },
    { label: 'Total Bookings', value: stats?.totalBookings || 0, icon: <Calendar size={24} />, color: '#3B82F6', trend: '+24%' },
    { label: 'Revenue', value: `₹${(stats?.totalRevenue || 0).toLocaleString()}`, icon: <DollarSign size={24} />, color: '#22C55E', trend: '+18%' },
    { label: 'Active Services', value: stats?.activeServices || 0, icon: <Package size={24} />, color: '#F59E0B', trend: '' },
    { label: 'Avg Rating', value: stats?.avgRating || 0, icon: <Star size={24} />, color: '#EF4444', trend: '+0.2' },
  ];

  const statusData = [
    { label: 'Completed', value: stats?.completedBookings || 0, color: '#22C55E' },
    { label: 'Active', value: stats?.activeBookings || 0, color: '#3B82F6' },
    { label: 'Pending', value: stats?.pendingBookings || 0, color: '#F59E0B' },
    { label: 'Cancelled', value: stats?.cancelledBookings || 0, color: '#EF4444' },
  ];
  const maxStatus = Math.max(...statusData.map(d => d.value), 1);

  return (
    <div>
      <div style={styles.header}>
        <h1 style={styles.title}>Admin Dashboard</h1>
        <p style={styles.subtitle}>Overview of your platform</p>
      </div>

      <div style={styles.kpiGrid}>
        {kpis.map((kpi, i) => (
          <div key={i} style={{ ...styles.kpiCard, borderLeftColor: kpi.color }}>
            <div style={styles.kpiTop}>
              <div style={{ ...styles.kpiIcon, background: `${kpi.color}15`, color: kpi.color }}>{kpi.icon}</div>
              {kpi.trend && <span style={styles.kpiTrend}><TrendingUp size={14} /> {kpi.trend}</span>}
            </div>
            <p style={styles.kpiValue}>{kpi.value}</p>
            <p style={styles.kpiLabel}>{kpi.label}</p>
          </div>
        ))}
      </div>

      <div style={styles.grid2}>
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>Bookings by Status</h2>
          <div style={styles.barChart}>
            {statusData.map((d, i) => (
              <div key={i} style={styles.barRow}>
                <span style={styles.barLabel}>{d.label}</span>
                <div style={styles.barTrack}>
                  <div style={{ ...styles.barFill, width: `${(d.value / maxStatus) * 100}%`, background: d.color }} />
                </div>
                <span style={styles.barValue}>{d.value}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={styles.card}>
          <h2 style={styles.cardTitle}>Quick Stats</h2>
          <div style={styles.quickStats}>
            <div style={styles.quickStat}><span style={styles.quickLabel}>Pending Verifications</span><span style={{ ...styles.quickValue, color: '#F59E0B' }}>{stats?.pendingCaregivers || 0}</span></div>
            <div style={styles.quickStat}><span style={styles.quickLabel}>Total Reviews</span><span style={styles.quickValue}>{stats?.totalReviews || 0}</span></div>
            <div style={styles.quickStat}><span style={styles.quickLabel}>Total Caregivers</span><span style={styles.quickValue}>{stats?.totalCaregivers || 0}</span></div>
            <div style={styles.quickStat}><span style={styles.quickLabel}>Completed Bookings</span><span style={{ ...styles.quickValue, color: '#22C55E' }}>{stats?.completedBookings || 0}</span></div>
          </div>
        </div>
      </div>

      <div style={styles.card}>
        <h2 style={styles.cardTitle}>Recent Bookings</h2>
        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead><tr><th style={styles.th}>User</th><th style={styles.th}>Service</th><th style={styles.th}>Status</th><th style={styles.th}>Date</th></tr></thead>
            <tbody>
              {(stats?.recentBookings || []).slice(0, 8).map((b, i) => (
                <tr key={i}>
                  <td style={styles.td}>{b.userId?.name || 'N/A'}</td>
                  <td style={styles.td}>{b.serviceId?.name || 'N/A'}</td>
                  <td style={styles.td}><span style={{ ...styles.badge, background: ({ completed: '#22C55E20', pending: '#F59E0B20', accepted: '#3B82F620', 'in-progress': '#0D948820', cancelled: '#EF444420' })[b.status] || '#E7E5E4', color: ({ completed: '#22C55E', pending: '#F59E0B', accepted: '#3B82F6', 'in-progress': '#0D9488', cancelled: '#EF4444' })[b.status] || '#78716C' }}>{b.status}</span></td>
                  <td style={styles.td}>{new Date(b.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

const styles = {
  header: { marginBottom: '2rem' },
  title: { fontFamily: "'Outfit', sans-serif", fontSize: '1.8rem', fontWeight: 700, marginBottom: '0.25rem' },
  subtitle: { color: '#78716C' },
  kpiGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1rem', marginBottom: '2rem' },
  kpiCard: { background: '#fff', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', borderLeft: '4px solid' },
  kpiTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' },
  kpiIcon: { width: '48px', height: '48px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  kpiTrend: { display: 'flex', alignItems: 'center', gap: '4px', color: '#22C55E', fontSize: '0.8rem', fontWeight: 600 },
  kpiValue: { fontFamily: "'Outfit',sans-serif", fontSize: '2rem', fontWeight: 800, margin: '0 0 0.25rem', color: '#1C1917' },
  kpiLabel: { fontSize: '0.9rem', color: '#78716C', margin: 0 },
  grid2: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' },
  card: { background: '#fff', borderRadius: '16px', padding: '1.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', marginBottom: '1.5rem' },
  cardTitle: { fontFamily: "'Outfit',sans-serif", fontSize: '1.2rem', fontWeight: 600, marginBottom: '1.25rem' },
  barChart: { display: 'flex', flexDirection: 'column', gap: '1rem' },
  barRow: { display: 'flex', alignItems: 'center', gap: '0.75rem' },
  barLabel: { width: '90px', fontSize: '0.85rem', color: '#78716C', fontWeight: 500 },
  barTrack: { flex: 1, height: '24px', background: '#F5F5F4', borderRadius: '12px', overflow: 'hidden' },
  barFill: { height: '100%', borderRadius: '12px', transition: 'width 0.8s ease' },
  barValue: { width: '30px', textAlign: 'right', fontWeight: 600, fontSize: '0.9rem' },
  quickStats: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' },
  quickStat: { background: '#FAFAF9', borderRadius: '12px', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' },
  quickLabel: { fontSize: '0.8rem', color: '#78716C' },
  quickValue: { fontFamily: "'Outfit',sans-serif", fontSize: '1.5rem', fontWeight: 700, color: '#1C1917' },
  tableWrapper: { overflowX: 'auto' },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: { textAlign: 'left', padding: '0.75rem 1rem', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', color: '#78716C', borderBottom: '2px solid #E7E5E4' },
  td: { padding: '0.75rem 1rem', borderBottom: '1px solid #F5F5F4', fontSize: '0.9rem' },
  badge: { padding: '4px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 600, textTransform: 'capitalize' },
};
