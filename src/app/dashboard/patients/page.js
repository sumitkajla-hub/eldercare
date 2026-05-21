'use client';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Plus, Edit2, Trash2, X, User, Phone, AlertCircle } from 'lucide-react';

export default function PatientsPage() {
  const { data: session } = useSession();
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '', age: '', gender: 'male', medicalConditions: '', allergies: '', emergencyContact: { name: '', phone: '', relation: '' }, specialNotes: '' });

  useEffect(() => { fetchPatients(); }, []);

  const fetchPatients = async () => {
    try {
      const res = await fetch('/api/patients');
      const data = await res.json();
      setPatients(Array.isArray(data) ? data : []);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { ...form, medicalConditions: form.medicalConditions.split(',').map(s => s.trim()).filter(Boolean), allergies: form.allergies.split(',').map(s => s.trim()).filter(Boolean), age: parseInt(form.age) };
    try {
      const url = editing ? `/api/patients/${editing}` : '/api/patients';
      const res = await fetch(url, { method: editing ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      if (res.ok) { fetchPatients(); closeModal(); }
    } catch (err) { console.error(err); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this patient profile?')) return;
    try {
      await fetch(`/api/patients/${id}`, { method: 'DELETE' });
      fetchPatients();
    } catch (err) { console.error(err); }
  };

  const openEdit = (patient) => {
    setEditing(patient._id);
    setForm({ name: patient.name, age: patient.age, gender: patient.gender, medicalConditions: patient.medicalConditions?.join(', ') || '', allergies: patient.allergies?.join(', ') || '', emergencyContact: patient.emergencyContact || { name: '', phone: '', relation: '' }, specialNotes: patient.specialNotes || '' });
    setShowModal(true);
  };

  const closeModal = () => { setShowModal(false); setEditing(null); setForm({ name: '', age: '', gender: 'male', medicalConditions: '', allergies: '', emergencyContact: { name: '', phone: '', relation: '' }, specialNotes: '' }); };

  if (loading) return <div style={{ padding: '3rem', textAlign: 'center' }}>Loading...</div>;

  return (
    <div>
      <div style={styles.header}>
        <h1 style={styles.title}>Patient Profiles</h1>
        <button onClick={() => setShowModal(true)} style={styles.addBtn}><Plus size={20} /> Add Patient</button>
      </div>

      {patients.length === 0 ? (
        <div style={styles.empty}>
          <User size={48} color="#A8A29E" />
          <h3>No patients added yet</h3>
          <p>Add a patient profile to get started with booking care services.</p>
          <button onClick={() => setShowModal(true)} style={styles.addBtn}><Plus size={20} /> Add Your First Patient</button>
        </div>
      ) : (
        <div style={styles.grid}>
          {patients.map(patient => (
            <div key={patient._id} style={styles.card}>
              <div style={styles.cardHeader}>
                <div style={styles.avatar}>{patient.name?.[0] || 'P'}</div>
                <div>
                  <h3 style={styles.patientName}>{patient.name}</h3>
                  <p style={styles.patientMeta}>{patient.age} years • {patient.gender}</p>
                </div>
                <div style={styles.actions}>
                  <button onClick={() => openEdit(patient)} style={styles.iconBtn}><Edit2 size={16} /></button>
                  <button onClick={() => handleDelete(patient._id)} style={{ ...styles.iconBtn, color: '#EF4444' }}><Trash2 size={16} /></button>
                </div>
              </div>
              {patient.medicalConditions?.length > 0 && (
                <div style={styles.tags}>
                  {patient.medicalConditions.map((c, i) => <span key={i} style={styles.tag}>{c}</span>)}
                </div>
              )}
              {patient.emergencyContact?.name && (
                <div style={styles.emergency}>
                  <Phone size={14} /> {patient.emergencyContact.name} ({patient.emergencyContact.relation}) - {patient.emergencyContact.phone}
                </div>
              )}
              {patient.specialNotes && <p style={styles.notes}>📝 {patient.specialNotes}</p>}
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div style={styles.overlay}>
          <div style={styles.modal}>
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>{editing ? 'Edit' : 'Add'} Patient</h2>
              <button onClick={closeModal} style={styles.closeBtn}><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} style={styles.form}>
              <div style={styles.formRow}>
                <div style={styles.formGroup}><label style={styles.label}>Name</label><input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required style={styles.input} /></div>
                <div style={styles.formGroup}><label style={styles.label}>Age</label><input type="number" value={form.age} onChange={e => setForm({ ...form, age: e.target.value })} required style={styles.input} /></div>
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Gender</label>
                <select value={form.gender} onChange={e => setForm({ ...form, gender: e.target.value })} style={styles.input}>
                  <option value="male">Male</option><option value="female">Female</option><option value="other">Other</option>
                </select>
              </div>
              <div style={styles.formGroup}><label style={styles.label}>Medical Conditions (comma separated)</label><input value={form.medicalConditions} onChange={e => setForm({ ...form, medicalConditions: e.target.value })} style={styles.input} placeholder="e.g. Diabetes, Hypertension" /></div>
              <div style={styles.formGroup}><label style={styles.label}>Allergies (comma separated)</label><input value={form.allergies} onChange={e => setForm({ ...form, allergies: e.target.value })} style={styles.input} placeholder="e.g. Penicillin" /></div>
              <h3 style={{ ...styles.label, marginTop: '0.5rem' }}>Emergency Contact</h3>
              <div style={styles.formRow}>
                <div style={styles.formGroup}><label style={styles.label}>Name</label><input value={form.emergencyContact.name} onChange={e => setForm({ ...form, emergencyContact: { ...form.emergencyContact, name: e.target.value } })} style={styles.input} /></div>
                <div style={styles.formGroup}><label style={styles.label}>Phone</label><input value={form.emergencyContact.phone} onChange={e => setForm({ ...form, emergencyContact: { ...form.emergencyContact, phone: e.target.value } })} style={styles.input} /></div>
                <div style={styles.formGroup}><label style={styles.label}>Relation</label><input value={form.emergencyContact.relation} onChange={e => setForm({ ...form, emergencyContact: { ...form.emergencyContact, relation: e.target.value } })} style={styles.input} /></div>
              </div>
              <div style={styles.formGroup}><label style={styles.label}>Special Notes</label><textarea value={form.specialNotes} onChange={e => setForm({ ...form, specialNotes: e.target.value })} style={{ ...styles.input, minHeight: '80px', resize: 'vertical' }} /></div>
              <button type="submit" style={styles.submitBtn}>{editing ? 'Update' : 'Add'} Patient</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' },
  title: { fontFamily: "'Outfit', sans-serif", fontSize: '1.8rem', fontWeight: 700, color: '#1C1917', margin: 0 },
  addBtn: { display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '12px 20px', background: 'linear-gradient(135deg, #0D9488, #0F766E)', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: 600, cursor: 'pointer', fontSize: '0.9rem' },
  empty: { textAlign: 'center', padding: '4rem 2rem', background: '#fff', borderRadius: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem', color: '#78716C' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '1.25rem' },
  card: { background: '#fff', borderRadius: '16px', padding: '1.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', border: '1px solid #E7E5E4' },
  cardHeader: { display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' },
  avatar: { width: '48px', height: '48px', borderRadius: '50%', background: 'linear-gradient(135deg, #0D9488, #14B8A6)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '1.2rem', flexShrink: 0 },
  patientName: { fontWeight: 600, color: '#1C1917', margin: 0, fontSize: '1.05rem' },
  patientMeta: { color: '#78716C', fontSize: '0.85rem', margin: '0.15rem 0 0', textTransform: 'capitalize' },
  actions: { marginLeft: 'auto', display: 'flex', gap: '0.25rem' },
  iconBtn: { background: 'none', border: 'none', cursor: 'pointer', color: '#78716C', padding: '6px', borderRadius: '8px' },
  tags: { display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.75rem' },
  tag: { background: '#F0FDFA', color: '#0D9488', padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 500 },
  emergency: { display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#78716C', fontSize: '0.85rem', marginBottom: '0.5rem' },
  notes: { color: '#78716C', fontSize: '0.85rem', fontStyle: 'italic' },
  overlay: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' },
  modal: { background: '#fff', borderRadius: '20px', padding: '2rem', maxWidth: '600px', width: '100%', maxHeight: '90vh', overflow: 'auto' },
  modalHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' },
  modalTitle: { fontFamily: "'Outfit', sans-serif", fontSize: '1.4rem', fontWeight: 600, margin: 0 },
  closeBtn: { background: 'none', border: 'none', cursor: 'pointer', color: '#78716C', padding: '4px' },
  form: { display: 'flex', flexDirection: 'column', gap: '1rem' },
  formRow: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem' },
  formGroup: { display: 'flex', flexDirection: 'column', gap: '0.4rem' },
  label: { fontWeight: 500, fontSize: '0.9rem', color: '#1C1917' },
  input: { padding: '12px', border: '2px solid #E7E5E4', borderRadius: '10px', fontSize: '0.95rem', outline: 'none', background: '#FAFAF9', width: '100%', boxSizing: 'border-box' },
  submitBtn: { padding: '14px', background: 'linear-gradient(135deg, #0D9488, #0F766E)', color: '#fff', border: 'none', borderRadius: '12px', fontSize: '1rem', fontWeight: 600, cursor: 'pointer', marginTop: '0.5rem' },
};
