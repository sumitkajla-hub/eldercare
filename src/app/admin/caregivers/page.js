'use client';
import { useState, useEffect } from 'react';
import { Search, ShieldCheck, X, Eye, Check } from 'lucide-react';

export default function ManageCaregiversPage() {
  const [caregivers, setCaregivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [selected, setSelected] = useState(null);

  useEffect(() => { fetchCaregivers(); }, []);

  const fetchCaregivers = async () => {
    try {
      const res = await fetch('/api/caregivers');
      const data = await res.json();
      setCaregivers(Array.isArray(data) ? data : []);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleVerify = async (id, isVerified) => {
    await fetch(`/api/admin/caregivers/${id}/verify`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ isVerified }) });
    fetchCaregivers();
    setSelected(null);
  };

  const filtered = caregivers.filter(cg => {
    const name = cg.userId?.name || '';
    const matchSearch = name.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'all' || (filter === 'verified' && cg.isVerified) || (filter === 'pending' && !cg.isVerified);
    return matchSearch && matchFilter;
  });

  if (loading) return <div style={{ padding: '3rem', textAlign: 'center' }}>Loading...</div>;

  return (
    <div>
      <h1 style={styles.title}>Manage Caregivers</h1>
      <div style={styles.toolbar}>
        <div style={styles.searchBox}><Search size={18} style={{ color: '#A8A29E' }} /><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search caregivers..." style={styles.searchInput} /></div>
        <select value={filter} onChange={e => setFilter(e.target.value)} style={styles.select}><option value="all">All</option><option value="verified">Verified</option><option value="pending">Pending</option></select>
      </div>
      <div style={styles.tableCard}>
        <table style={styles.table}>
          <thead><tr><th style={styles.th}>Name</th><th style={styles.th}>Specialization</th><th style={styles.th}>Experience</th><th style={styles.th}>Rating</th><th style={styles.th}>Status</th><th style={styles.th}>Actions</th></tr></thead>
          <tbody>
            {filtered.map(cg => (
              <tr key={cg._id}>
                <td style={styles.td}><strong>{cg.userId?.name || 'N/A'}</strong></td>
                <td style={{ ...styles.td, textTransform: 'capitalize' }}>{cg.specialization}</td>
                <td style={styles.td}>{cg.experience} yrs</td>
                <td style={styles.td}>⭐ {cg.rating}</td>
                <td style={styles.td}><span style={{ ...styles.badge, background: cg.isVerified ? '#22C55E20' : '#F59E0B20', color: cg.isVerified ? '#22C55E' : '#F59E0B' }}>{cg.isVerified ? 'Verified' : 'Pending'}</span></td>
                <td style={styles.td}>
                  <div style={styles.actionBtns}>
                    <button onClick={() => setSelected(cg)} style={styles.viewBtn}><Eye size={16} /></button>
                    {!cg.isVerified && <button onClick={() => handleVerify(cg._id, true)} style={styles.verifyBtn}><Check size={16} /></button>}
                    {!cg.isVerified && <button onClick={() => handleVerify(cg._id, false)} style={styles.rejectBtn}><X size={16} /></button>}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <p style={{ textAlign: 'center', padding: '2rem', color: '#78716C' }}>No caregivers found</p>}
      </div>

      {selected && (
        <div style={styles.overlay}>
          <div style={styles.modal}>
            <div style={styles.modalHeader}><h2>Caregiver Details</h2><button onClick={() => setSelected(null)} style={styles.closeBtn}><X size={20} /></button></div>
            <div style={styles.detailGrid}>
              {[['Name', selected.userId?.name], ['Email', selected.userId?.email], ['Phone', selected.userId?.phone], ['Specialization', selected.specialization], ['Experience', `${selected.experience} years`], ['Rating', `⭐ ${selected.rating} (${selected.totalReviews} reviews)`], ['Hourly Rate', `₹${selected.hourlyRate}`], ['Languages', selected.languages?.join(', ')], ['Areas', selected.serviceAreas?.join(', ')], ['Qualifications', selected.qualifications?.join(', ')]].map(([k, v], i) => (
                <div key={i}><p style={styles.detailLabel}>{k}</p><p style={styles.detailValue}>{v || 'N/A'}</p></div>
              ))}
            </div>
            {selected.bio && <div style={{ marginTop: '1rem' }}><p style={styles.detailLabel}>Bio</p><p style={styles.detailValue}>{selected.bio}</p></div>}
            {!selected.isVerified && (
              <div style={styles.modalActions}>
                <button onClick={() => handleVerify(selected._id, true)} style={styles.approveBtn}><ShieldCheck size={18} /> Approve</button>
                <button onClick={() => handleVerify(selected._id, false)} style={styles.rejectFullBtn}>Reject</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  title: { fontFamily: "'Outfit', sans-serif", fontSize: '1.8rem', fontWeight: 700, marginBottom: '1.5rem' },
  toolbar: { display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' },
  searchBox: { display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#fff', border: '1px solid #E7E5E4', borderRadius: '10px', padding: '0 12px', flex: 1, maxWidth: '400px' },
  searchInput: { border: 'none', outline: 'none', padding: '10px 0', fontSize: '0.95rem', width: '100%' },
  select: { padding: '10px 16px', border: '1px solid #E7E5E4', borderRadius: '10px', fontSize: '0.95rem', background: '#fff' },
  tableCard: { background: '#fff', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: { textAlign: 'left', padding: '1rem', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', color: '#78716C', borderBottom: '2px solid #E7E5E4', background: '#FAFAF9' },
  td: { padding: '0.85rem 1rem', borderBottom: '1px solid #F5F5F4' },
  badge: { padding: '4px 12px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600 },
  actionBtns: { display: 'flex', gap: '0.25rem' },
  viewBtn: { background: '#EFF6FF', color: '#3B82F6', border: 'none', borderRadius: '8px', padding: '6px', cursor: 'pointer' },
  verifyBtn: { background: '#F0FDF4', color: '#22C55E', border: 'none', borderRadius: '8px', padding: '6px', cursor: 'pointer' },
  rejectBtn: { background: '#FEF2F2', color: '#EF4444', border: 'none', borderRadius: '8px', padding: '6px', cursor: 'pointer' },
  overlay: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 },
  modal: { background: '#fff', borderRadius: '20px', padding: '2rem', maxWidth: '600px', width: '90%', maxHeight: '80vh', overflow: 'auto' },
  modalHeader: { display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' },
  closeBtn: { background: 'none', border: 'none', cursor: 'pointer', color: '#78716C' },
  detailGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' },
  detailLabel: { fontSize: '0.8rem', color: '#78716C', margin: '0 0 0.15rem', fontWeight: 500 },
  detailValue: { fontSize: '0.95rem', fontWeight: 500, margin: 0, textTransform: 'capitalize' },
  modalActions: { display: 'flex', gap: '1rem', marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid #E7E5E4' },
  approveBtn: { display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '12px 24px', background: '#22C55E', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: 600, cursor: 'pointer' },
  rejectFullBtn: { padding: '12px 24px', background: '#FEF2F2', color: '#EF4444', border: 'none', borderRadius: '12px', fontWeight: 600, cursor: 'pointer' },
};
