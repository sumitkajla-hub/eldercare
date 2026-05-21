'use client';
import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X, ToggleLeft, ToggleRight } from 'lucide-react';

export default function ManageServicesPage() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '', description: '', category: 'nursing', icon: 'Stethoscope', duration: '', basePrice: '', requiredQualification: '' });

  useEffect(() => { fetchServices(); }, []);

  const fetchServices = async () => {
    try {
      const res = await fetch('/api/services');
      const data = await res.json();
      setServices(Array.isArray(data) ? data : []);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = editing ? `/api/services/${editing}` : '/api/services';
    await fetch(url, { method: editing ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...form, basePrice: parseInt(form.basePrice) }) });
    fetchServices(); closeModal();
  };

  const toggleActive = async (id, isActive) => {
    await fetch(`/api/services/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ isActive: !isActive }) });
    fetchServices();
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this service?')) return;
    await fetch(`/api/services/${id}`, { method: 'DELETE' });
    fetchServices();
  };

  const openEdit = (s) => {
    setEditing(s._id);
    setForm({ name: s.name, description: s.description, category: s.category, icon: s.icon, duration: s.duration, basePrice: s.basePrice, requiredQualification: s.requiredQualification });
    setShowModal(true);
  };

  const closeModal = () => { setShowModal(false); setEditing(null); setForm({ name: '', description: '', category: 'nursing', icon: '', duration: '', basePrice: '', requiredQualification: '' }); };

  const icons = { nursing: '🩺', attendant: '💝', physiotherapy: '🏃', 'post-hospital': '🏥' };

  if (loading) return <div style={{ padding: '3rem', textAlign: 'center' }}>Loading...</div>;

  return (
    <div>
      <div style={styles.header}>
        <h1 style={styles.title}>Manage Services</h1>
        <button onClick={() => setShowModal(true)} style={styles.addBtn}><Plus size={20} /> Add Service</button>
      </div>

      <div style={styles.grid}>
        {services.map(s => (
          <div key={s._id} style={{ ...styles.card, opacity: s.isActive ? 1 : 0.6 }}>
            <div style={styles.cardTop}>
              <span style={{ fontSize: '2rem' }}>{icons[s.category] || '📋'}</span>
              <div style={styles.cardBtns}>
                <button onClick={() => toggleActive(s._id, s.isActive)} style={styles.iconBtn}>{s.isActive ? <ToggleRight size={20} color="#22C55E" /> : <ToggleLeft size={20} color="#A8A29E" />}</button>
                <button onClick={() => openEdit(s)} style={styles.iconBtn}><Edit2 size={16} /></button>
                <button onClick={() => handleDelete(s._id)} style={styles.iconBtn}><Trash2 size={16} color="#EF4444" /></button>
              </div>
            </div>
            <h3 style={styles.cardName}>{s.name}</h3>
            <span style={styles.catBadge}>{s.category}</span>
            <p style={styles.cardDesc}>{s.description?.substring(0, 80)}...</p>
            <div style={styles.cardFooter}>
              <span style={styles.price}>₹{s.basePrice}/hr</span>
              <span style={{ ...styles.statusDot, background: s.isActive ? '#22C55E' : '#A8A29E' }}>{s.isActive ? 'Active' : 'Inactive'}</span>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div style={styles.overlay}>
          <div style={styles.modal}>
            <div style={styles.modalHeader}><h2>{editing ? 'Edit' : 'Add'} Service</h2><button onClick={closeModal} style={styles.closeBtn}><X size={20} /></button></div>
            <form onSubmit={handleSubmit} style={styles.form}>
              <div style={styles.formGroup}><label style={styles.label}>Name</label><input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required style={styles.input} /></div>
              <div style={styles.formGroup}><label style={styles.label}>Description</label><textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} required style={{ ...styles.input, minHeight: '80px' }} /></div>
              <div style={styles.formRow}>
                <div style={styles.formGroup}><label style={styles.label}>Category</label><select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} style={styles.input}><option value="nursing">Nursing</option><option value="attendant">Attendant</option><option value="physiotherapy">Physiotherapy</option><option value="post-hospital">Post-Hospital</option></select></div>
                <div style={styles.formGroup}><label style={styles.label}>Base Price (₹/hr)</label><input type="number" value={form.basePrice} onChange={e => setForm({ ...form, basePrice: e.target.value })} required style={styles.input} /></div>
              </div>
              <div style={styles.formRow}>
                <div style={styles.formGroup}><label style={styles.label}>Duration</label><input value={form.duration} onChange={e => setForm({ ...form, duration: e.target.value })} style={styles.input} placeholder="e.g. Flexible" /></div>
                <div style={styles.formGroup}><label style={styles.label}>Required Qualification</label><input value={form.requiredQualification} onChange={e => setForm({ ...form, requiredQualification: e.target.value })} style={styles.input} /></div>
              </div>
              <button type="submit" style={styles.submitBtn}>{editing ? 'Update' : 'Create'} Service</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' },
  title: { fontFamily: "'Outfit', sans-serif", fontSize: '1.8rem', fontWeight: 700, margin: 0 },
  addBtn: { display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '12px 20px', background: 'linear-gradient(135deg, #0D9488, #0F766E)', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: 600, cursor: 'pointer' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.25rem' },
  card: { background: '#fff', borderRadius: '16px', padding: '1.5rem', border: '1px solid #E7E5E4', transition: 'opacity 0.3s' },
  cardTop: { display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' },
  cardBtns: { display: 'flex', gap: '0.25rem' },
  iconBtn: { background: 'none', border: 'none', cursor: 'pointer', color: '#78716C', padding: '4px' },
  cardName: { fontFamily: "'Outfit',sans-serif", fontSize: '1.15rem', fontWeight: 600, margin: '0 0 0.5rem' },
  catBadge: { display: 'inline-block', padding: '2px 10px', background: '#F0FDFA', color: '#0D9488', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 500, textTransform: 'capitalize', marginBottom: '0.75rem' },
  cardDesc: { color: '#78716C', fontSize: '0.85rem', lineHeight: 1.5, marginBottom: '1rem' },
  cardFooter: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  price: { fontFamily: "'Outfit',sans-serif", fontSize: '1.1rem', fontWeight: 700, color: '#0D9488' },
  statusDot: { fontSize: '0.75rem', fontWeight: 600, color: '#fff', padding: '3px 10px', borderRadius: '12px' },
  overlay: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 },
  modal: { background: '#fff', borderRadius: '20px', padding: '2rem', maxWidth: '550px', width: '90%' },
  modalHeader: { display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' },
  closeBtn: { background: 'none', border: 'none', cursor: 'pointer', color: '#78716C' },
  form: { display: 'flex', flexDirection: 'column', gap: '1rem' },
  formRow: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' },
  formGroup: { display: 'flex', flexDirection: 'column', gap: '0.3rem' },
  label: { fontWeight: 500, fontSize: '0.85rem', color: '#1C1917' },
  input: { padding: '12px', border: '2px solid #E7E5E4', borderRadius: '10px', fontSize: '0.95rem', outline: 'none', width: '100%', boxSizing: 'border-box' },
  submitBtn: { padding: '14px', background: 'linear-gradient(135deg, #0D9488, #0F766E)', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: 600, cursor: 'pointer', marginTop: '0.5rem' },
};
