'use client';
import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';

export default function ManageUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  useEffect(() => {
    fetch('/api/users').then(r => r.json()).then(data => { setUsers(Array.isArray(data) ? data : []); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const filtered = users.filter(u => {
    const matchSearch = u.name?.toLowerCase().includes(search.toLowerCase()) || u.email?.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === 'all' || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  const roleBadge = (role) => {
    const colors = { admin: { bg: '#EF444420', color: '#EF4444' }, caregiver: { bg: '#4F46E520', color: '#4F46E5' }, user: { bg: '#0D948820', color: '#0D9488' } };
    const c = colors[role] || colors.user;
    return { background: c.bg, color: c.color, padding: '4px 12px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600, textTransform: 'capitalize' };
  };

  if (loading) return <div style={{ padding: '3rem', textAlign: 'center' }}>Loading...</div>;

  return (
    <div>
      <h1 style={styles.title}>Manage Users</h1>
      <div style={styles.toolbar}>
        <div style={styles.searchBox}><Search size={18} style={{ color: '#A8A29E' }} /><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search users..." style={styles.searchInput} /></div>
        <select value={roleFilter} onChange={e => setRoleFilter(e.target.value)} style={styles.select}><option value="all">All Roles</option><option value="user">Users</option><option value="caregiver">Caregivers</option><option value="admin">Admins</option></select>
      </div>
      <div style={styles.tableCard}>
        <table style={styles.table}>
          <thead><tr><th style={styles.th}>Name</th><th style={styles.th}>Email</th><th style={styles.th}>Phone</th><th style={styles.th}>Role</th><th style={styles.th}>City</th><th style={styles.th}>Joined</th></tr></thead>
          <tbody>
            {filtered.map(u => (
              <tr key={u._id}>
                <td style={styles.td}><strong>{u.name}</strong></td>
                <td style={styles.td}>{u.email}</td>
                <td style={styles.td}>{u.phone || '-'}</td>
                <td style={styles.td}><span style={roleBadge(u.role)}>{u.role}</span></td>
                <td style={styles.td}>{u.city || '-'}</td>
                <td style={styles.td}>{new Date(u.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <p style={{ textAlign: 'center', padding: '2rem', color: '#78716C' }}>No users found</p>}
      </div>
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
};
