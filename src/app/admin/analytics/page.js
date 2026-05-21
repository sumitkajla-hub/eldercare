'use client';
import { useState, useEffect } from 'react';
import { TrendingUp, DollarSign, Users, Star } from 'lucide-react';

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export default function AnalyticsPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/stats').then(r => r.json()).then(data => { setStats(data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  if (loading) return <div style={{ padding: '3rem', textAlign: 'center' }}>Loading analytics...</div>;

  const serviceData = (stats?.bookingsByService || []).map(s => ({ label: s._id || 'Other', count: s.count, revenue: s.revenue }));
  const maxService = Math.max(...serviceData.map(d => d.count), 1);

  const monthlyData = (stats?.monthlyBookings || []).map(m => ({ month: months[m._id - 1] || 'N/A', count: m.count, revenue: m.revenue }));
  const maxMonthly = Math.max(...monthlyData.map(d => d.count), 1);

  const ratingDist = [5, 4, 3, 2, 1];

  return (
    <div>
      <h1 style={styles.title}>Analytics</h1>

      <div style={styles.kpiRow}>
        {[
          { label: 'Total Revenue', value: `₹${(stats?.totalRevenue || 0).toLocaleString()}`, icon: <DollarSign size={24} />, color: '#22C55E' },
          { label: 'Avg Rating', value: stats?.avgRating || 0, icon: <Star size={24} />, color: '#F59E0B' },
          { label: 'Total Reviews', value: stats?.totalReviews || 0, icon: <TrendingUp size={24} />, color: '#3B82F6' },
          { label: 'Total Users', value: (stats?.totalUsers || 0) + (stats?.totalCaregivers || 0), icon: <Users size={24} />, color: '#4F46E5' },
        ].map((k, i) => (
          <div key={i} style={styles.kpiCard}>
            <div style={{ ...styles.kpiIcon, background: `${k.color}15`, color: k.color }}>{k.icon}</div>
            <p style={styles.kpiValue}>{k.value}</p>
            <p style={styles.kpiLabel}>{k.label}</p>
          </div>
        ))}
      </div>

      <div style={styles.grid2}>
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>Bookings Over Time</h2>
          <div style={styles.barChart}>
            {monthlyData.map((d, i) => (
              <div key={i} style={styles.barCol}>
                <span style={styles.barCount}>{d.count}</span>
                <div style={{ ...styles.bar, height: `${(d.count / maxMonthly) * 160}px` }} />
                <span style={styles.barMonth}>{d.month}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={styles.card}>
          <h2 style={styles.cardTitle}>Service Popularity</h2>
          <div style={styles.hBarChart}>
            {serviceData.map((d, i) => (
              <div key={i} style={styles.hBarRow}>
                <span style={styles.hBarLabel}>{d.label}</span>
                <div style={styles.hBarTrack}><div style={{ ...styles.hBarFill, width: `${(d.count / maxService) * 100}%`, background: ['#0D9488', '#4F46E5', '#F59E0B', '#EF4444'][i % 4] }} /></div>
                <span style={styles.hBarValue}>{d.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={styles.grid2}>
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>Revenue by Service</h2>
          <div style={styles.revenueList}>
            {serviceData.map((d, i) => (
              <div key={i} style={styles.revenueRow}>
                <span style={styles.revLabel}>{d.label}</span>
                <span style={styles.revValue}>₹{(d.revenue || 0).toLocaleString()}</span>
              </div>
            ))}
            <div style={{ ...styles.revenueRow, borderTop: '2px solid #E7E5E4', fontWeight: 700 }}>
              <span>Total</span>
              <span style={{ color: '#0D9488' }}>₹{(stats?.totalRevenue || 0).toLocaleString()}</span>
            </div>
          </div>
        </div>

        <div style={styles.card}>
          <h2 style={styles.cardTitle}>Caregiver Metrics</h2>
          <div style={styles.metricsList}>
            <div style={styles.metricItem}><span style={styles.metricLabel}>Total Caregivers</span><span style={styles.metricValue}>{stats?.totalCaregivers || 0}</span></div>
            <div style={styles.metricItem}><span style={styles.metricLabel}>Verified</span><span style={{ ...styles.metricValue, color: '#22C55E' }}>{stats?.verifiedCaregivers || 0}</span></div>
            <div style={styles.metricItem}><span style={styles.metricLabel}>Pending Verification</span><span style={{ ...styles.metricValue, color: '#F59E0B' }}>{stats?.pendingCaregivers || 0}</span></div>
            <div style={styles.metricItem}><span style={styles.metricLabel}>Verification Rate</span><span style={styles.metricValue}>{stats?.totalCaregivers ? Math.round((stats.verifiedCaregivers / stats.totalCaregivers) * 100) : 0}%</span></div>
            <div style={styles.metricItem}><span style={styles.metricLabel}>Avg Rating</span><span style={styles.metricValue}>⭐ {stats?.avgRating || 0}</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  title: { fontFamily: "'Outfit', sans-serif", fontSize: '1.8rem', fontWeight: 700, marginBottom: '2rem' },
  kpiRow: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' },
  kpiCard: { background: '#fff', borderRadius: '16px', padding: '1.5rem', textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' },
  kpiIcon: { width: '48px', height: '48px', borderRadius: '12px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.75rem' },
  kpiValue: { fontFamily: "'Outfit',sans-serif", fontSize: '1.8rem', fontWeight: 800, margin: '0 0 0.25rem' },
  kpiLabel: { color: '#78716C', fontSize: '0.85rem', margin: 0 },
  grid2: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' },
  card: { background: '#fff', borderRadius: '16px', padding: '1.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' },
  cardTitle: { fontFamily: "'Outfit',sans-serif", fontSize: '1.15rem', fontWeight: 600, marginBottom: '1.25rem' },
  barChart: { display: 'flex', alignItems: 'flex-end', gap: '0.75rem', height: '220px', paddingTop: '40px' },
  barCol: { flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem' },
  barCount: { fontSize: '0.7rem', color: '#0D9488', fontWeight: 600 },
  bar: { width: '100%', maxWidth: '36px', background: 'linear-gradient(180deg, #0D9488, #14B8A6)', borderRadius: '6px 6px 0 0', transition: 'height 0.6s ease', minHeight: '4px' },
  barMonth: { fontSize: '0.7rem', color: '#78716C' },
  hBarChart: { display: 'flex', flexDirection: 'column', gap: '1rem' },
  hBarRow: { display: 'flex', alignItems: 'center', gap: '0.75rem' },
  hBarLabel: { width: '100px', fontSize: '0.85rem', color: '#78716C', textTransform: 'capitalize' },
  hBarTrack: { flex: 1, height: '28px', background: '#F5F5F4', borderRadius: '14px', overflow: 'hidden' },
  hBarFill: { height: '100%', borderRadius: '14px', transition: 'width 0.8s ease' },
  hBarValue: { width: '30px', fontWeight: 600, fontSize: '0.9rem', textAlign: 'right' },
  revenueList: { display: 'flex', flexDirection: 'column', gap: '0.5rem' },
  revenueRow: { display: 'flex', justifyContent: 'space-between', padding: '0.75rem 0', borderBottom: '1px solid #F5F5F4', textTransform: 'capitalize' },
  revLabel: { color: '#78716C' },
  revValue: { fontWeight: 600, color: '#1C1917' },
  metricsList: { display: 'flex', flexDirection: 'column', gap: '0.75rem' },
  metricItem: { display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid #F5F5F4' },
  metricLabel: { color: '#78716C', fontSize: '0.9rem' },
  metricValue: { fontFamily: "'Outfit',sans-serif", fontWeight: 700, fontSize: '1.1rem' },
};
