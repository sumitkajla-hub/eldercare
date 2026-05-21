'use client';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Calendar, Users, ClipboardList, Clock, Plus, ArrowRight, Activity } from 'lucide-react';

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState({ active: 0, completed: 0, patients: 0, pending: 0 });
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/login');
    if (status === 'authenticated') fetchData();
  }, [status]);

  const fetchData = async () => {
    try {
      const [bookingsRes, patientsRes] = await Promise.all([
        fetch('/api/bookings'),
        fetch('/api/patients'),
      ]);
      const bookingsData = await bookingsRes.json();
      const patientsData = await patientsRes.json();
      
      setBookings(Array.isArray(bookingsData) ? bookingsData.slice(0, 5) : []);
      const b = Array.isArray(bookingsData) ? bookingsData : [];
      setStats({
        active: b.filter(b => ['accepted', 'in-progress'].includes(b.status)).length,
        completed: b.filter(b => b.status === 'completed').length,
        patients: Array.isArray(patientsData) ? patientsData.length : 0,
        pending: b.filter(b => b.status === 'pending').length,
      });
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const statusColors = { pending: '#F59E0B', accepted: '#3B82F6', 'in-progress': '#0D9488', completed: '#22C55E', cancelled: '#EF4444' };

  if (loading) return <div style={{ padding: '3rem', textAlign: 'center' }}>Loading...</div>;

  return (
    <div style={styles.page}>
      <div style={styles.welcome}>
        <h1 style={styles.welcomeTitle}>Welcome back, {session?.user?.name || 'User'}! 👋</h1>
        <p style={styles.welcomeSubtitle}>Here&apos;s an overview of your care services</p>
      </div>

      <div style={styles.statsGrid}>
        {[
          { label: 'Active Bookings', value: stats.active, icon: <Activity size={24} />, color: '#0D9488' },
          { label: 'Completed', value: stats.completed, icon: <ClipboardList size={24} />, color: '#22C55E' },
          { label: 'Patients', value: stats.patients, icon: <Users size={24} />, color: '#4F46E5' },
          { label: 'Pending', value: stats.pending, icon: <Clock size={24} />, color: '#F59E0B' },
        ].map((stat, i) => (
          <div key={i} style={styles.statCard}>
            <div style={{ ...styles.statIcon, background: `${stat.color}15`, color: stat.color }}>{stat.icon}</div>
            <div><p style={styles.statValue}>{stat.value}</p><p style={styles.statLabel}>{stat.label}</p></div>
          </div>
        ))}
      </div>

      <div style={styles.quickActions}>
        <Link href="/dashboard/book" style={{ ...styles.actionBtn, background: 'linear-gradient(135deg, #0D9488, #0F766E)' }}>
          <Plus size={20} /> Book New Service
        </Link>
        <Link href="/dashboard/patients" style={{ ...styles.actionBtn, background: 'linear-gradient(135deg, #4F46E5, #6366F1)' }}>
          <Users size={20} /> Manage Patients
        </Link>
        <Link href="/dashboard/bookings" style={{ ...styles.actionBtn, background: 'linear-gradient(135deg, #F59E0B, #D97706)' }}>
          <Calendar size={20} /> View History
        </Link>
      </div>

      <div style={styles.recentSection}>
        <div style={styles.sectionHeader}>
          <h2 style={styles.sectionTitle}>Recent Bookings</h2>
          <Link href="/dashboard/bookings" style={styles.viewAll}>View All <ArrowRight size={16} /></Link>
        </div>
        {bookings.length === 0 ? (
          <div style={styles.empty}>
            <p>No bookings yet. <Link href="/dashboard/book" style={{ color: '#0D9488' }}>Book your first service!</Link></p>
          </div>
        ) : (
          <div style={styles.bookingsList}>
            {bookings.map((booking, i) => (
              <div key={i} style={styles.bookingItem}>
                <div style={styles.bookingInfo}>
                  <h3 style={styles.bookingService}>{booking.serviceId?.name || 'Service'}</h3>
                  <p style={styles.bookingMeta}>{booking.patientId?.name || 'Patient'} • {new Date(booking.startDate).toLocaleDateString()}</p>
                </div>
                <div style={styles.bookingRight}>
                  <span style={{ ...styles.statusBadge, background: `${statusColors[booking.status]}20`, color: statusColors[booking.status] }}>
                    {booking.status}
                  </span>
                  <span style={styles.bookingAmount}>₹{booking.totalAmount?.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  page: { padding: '0.5rem' },
  welcome: { marginBottom: '2rem' },
  welcomeTitle: { fontFamily: "'Outfit', sans-serif", fontSize: '1.8rem', fontWeight: 700, color: '#1C1917', marginBottom: '0.25rem' },
  welcomeSubtitle: { color: '#78716C', fontSize: '1rem' },
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1rem', marginBottom: '2rem' },
  statCard: { background: '#fff', borderRadius: '16px', padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', border: '1px solid #E7E5E4' },
  statIcon: { width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  statValue: { fontFamily: "'Outfit', sans-serif", fontSize: '1.8rem', fontWeight: 700, color: '#1C1917', margin: 0, lineHeight: 1 },
  statLabel: { color: '#78716C', fontSize: '0.85rem', margin: '0.25rem 0 0' },
  quickActions: { display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' },
  actionBtn: { display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '12px 20px', color: '#fff', borderRadius: '12px', textDecoration: 'none', fontWeight: 600, fontSize: '0.9rem' },
  recentSection: { background: '#fff', borderRadius: '16px', padding: '1.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', border: '1px solid #E7E5E4' },
  sectionHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' },
  sectionTitle: { fontFamily: "'Outfit', sans-serif", fontSize: '1.2rem', fontWeight: 600, color: '#1C1917', margin: 0 },
  viewAll: { display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#0D9488', textDecoration: 'none', fontWeight: 500, fontSize: '0.9rem' },
  empty: { textAlign: 'center', padding: '3rem', color: '#78716C' },
  bookingsList: { display: 'flex', flexDirection: 'column' },
  bookingItem: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 0', borderBottom: '1px solid #F5F5F4' },
  bookingInfo: {},
  bookingService: { fontWeight: 600, color: '#1C1917', fontSize: '1rem', margin: '0 0 0.25rem' },
  bookingMeta: { color: '#78716C', fontSize: '0.85rem', margin: 0 },
  bookingRight: { display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.25rem' },
  statusBadge: { padding: '4px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 600, textTransform: 'capitalize' },
  bookingAmount: { fontWeight: 600, color: '#1C1917', fontSize: '0.95rem' },
};
