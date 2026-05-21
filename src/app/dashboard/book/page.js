'use client';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Check, ArrowLeft, ArrowRight, Star, ShieldCheck, Calendar, Clock } from 'lucide-react';

const steps = ['Select Service', 'Select Patient', 'Choose Caregiver', 'Schedule', 'Confirm'];

export default function BookServicePage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [services, setServices] = useState([]);
  const [patients, setPatients] = useState([]);
  const [caregivers, setCaregivers] = useState([]);
  const [selected, setSelected] = useState({ service: null, patient: null, caregiver: null, bookingType: 'hourly', startDate: '', endDate: '', scheduledTime: '09:00' });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    Promise.all([fetch('/api/services').then(r => r.json()), fetch('/api/patients').then(r => r.json())])
      .then(([s, p]) => { setServices(Array.isArray(s) ? s : []); setPatients(Array.isArray(p) ? p : []); setLoading(false); });
  }, []);

  useEffect(() => {
    if (selected.service) {
      fetch(`/api/caregivers?specialization=${selected.service.category}&verified=true`)
        .then(r => r.json()).then(d => setCaregivers(Array.isArray(d) ? d : []));
    }
  }, [selected.service]);

  const calculateTotal = () => {
    if (!selected.caregiver) return 0;
    const cg = selected.caregiver;
    if (selected.bookingType === 'hourly') return cg.hourlyRate || 0;
    if (selected.bookingType === 'daily') {
      const days = selected.startDate && selected.endDate ? Math.max(1, Math.ceil((new Date(selected.endDate) - new Date(selected.startDate)) / 86400000)) : 1;
      return (cg.dailyRate || 0) * days;
    }
    const months = selected.startDate && selected.endDate ? Math.max(1, Math.ceil((new Date(selected.endDate) - new Date(selected.startDate)) / (86400000 * 30))) : 1;
    return (cg.monthlyRate || 0) * months;
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ serviceId: selected.service._id, patientId: selected.patient._id, caregiverId: selected.caregiver._id, bookingType: selected.bookingType, startDate: selected.startDate, endDate: selected.endDate || selected.startDate, scheduledTime: selected.scheduledTime, totalAmount: calculateTotal() }),
      });
      if (res.ok) setSuccess(true);
    } catch (err) { console.error(err); }
    finally { setSubmitting(false); }
  };

  if (success) return (
    <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
      <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: '#F0FDF4', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}><Check size={40} color="#22C55E" /></div>
      <h2 style={{ fontFamily: "'Outfit',sans-serif", color: '#22C55E', marginBottom: '0.5rem' }}>Booking Confirmed!</h2>
      <p style={{ color: '#78716C', marginBottom: '2rem' }}>Your service request has been sent to the caregiver.</p>
      <button onClick={() => router.push('/dashboard/bookings')} style={styles.primaryBtn}>View My Bookings</button>
    </div>
  );

  if (loading) return <div style={{ padding: '3rem', textAlign: 'center' }}>Loading...</div>;

  return (
    <div>
      <h1 style={styles.title}>Book a Service</h1>
      <div style={styles.progressBar}>
        {steps.map((s, i) => (
          <div key={i} style={{ ...styles.progressStep, opacity: i <= step ? 1 : 0.4 }}>
            <div style={{ ...styles.stepCircle, background: i <= step ? '#0D9488' : '#E7E5E4', color: i <= step ? '#fff' : '#78716C' }}>{i < step ? '✓' : i + 1}</div>
            <span style={styles.stepLabel}>{s}</span>
          </div>
        ))}
      </div>

      <div style={styles.content}>
        {step === 0 && (
          <div style={styles.grid}>{services.map(s => (
            <div key={s._id} onClick={() => setSelected({ ...selected, service: s })} style={{ ...styles.selectCard, borderColor: selected.service?._id === s._id ? '#0D9488' : '#E7E5E4', boxShadow: selected.service?._id === s._id ? '0 0 0 3px rgba(13,148,136,0.15)' : 'none' }}>
              <h3 style={styles.cardTitle}>{s.name}</h3>
              <p style={styles.cardDesc}>{s.description?.substring(0, 100)}...</p>
              <p style={styles.cardPrice}>From ₹{s.basePrice}/hr</p>
            </div>
          ))}</div>
        )}

        {step === 1 && (
          <div style={styles.grid}>{patients.length === 0 ? (
            <div style={styles.emptyState}><p>No patients added. Please <a href="/dashboard/patients" style={{ color: '#0D9488' }}>add a patient</a> first.</p></div>
          ) : patients.map(p => (
            <div key={p._id} onClick={() => setSelected({ ...selected, patient: p })} style={{ ...styles.selectCard, borderColor: selected.patient?._id === p._id ? '#0D9488' : '#E7E5E4', boxShadow: selected.patient?._id === p._id ? '0 0 0 3px rgba(13,148,136,0.15)' : 'none' }}>
              <h3 style={styles.cardTitle}>{p.name}</h3>
              <p style={styles.cardDesc}>{p.age} years • {p.gender}</p>
              {p.medicalConditions?.length > 0 && <div style={styles.tagRow}>{p.medicalConditions.map((c, i) => <span key={i} style={styles.tag}>{c}</span>)}</div>}
            </div>
          ))}</div>
        )}

        {step === 2 && (
          <div style={styles.grid}>{caregivers.map(cg => (
            <div key={cg._id} onClick={() => setSelected({ ...selected, caregiver: cg })} style={{ ...styles.selectCard, borderColor: selected.caregiver?._id === cg._id ? '#0D9488' : '#E7E5E4', boxShadow: selected.caregiver?._id === cg._id ? '0 0 0 3px rgba(13,148,136,0.15)' : 'none' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <h3 style={styles.cardTitle}>{cg.userId?.name || 'Caregiver'}</h3>
                {cg.isVerified && <ShieldCheck size={18} color="#0D9488" />}
              </div>
              <p style={styles.cardDesc}>{cg.experience} yrs exp • ⭐ {cg.rating}</p>
              <p style={styles.cardPrice}>₹{cg.hourlyRate}/hr • ₹{cg.dailyRate}/day</p>
            </div>
          ))}</div>
        )}

        {step === 3 && (
          <div style={styles.scheduleForm}>
            <div style={styles.formGroup}><label style={styles.label}>Booking Type</label><select value={selected.bookingType} onChange={e => setSelected({ ...selected, bookingType: e.target.value })} style={styles.input}><option value="hourly">Hourly</option><option value="daily">Daily</option><option value="long-term">Long-term</option></select></div>
            <div style={styles.formRow}>
              <div style={styles.formGroup}><label style={styles.label}>Start Date</label><input type="date" value={selected.startDate} onChange={e => setSelected({ ...selected, startDate: e.target.value })} style={styles.input} required /></div>
              {selected.bookingType !== 'hourly' && <div style={styles.formGroup}><label style={styles.label}>End Date</label><input type="date" value={selected.endDate} onChange={e => setSelected({ ...selected, endDate: e.target.value })} style={styles.input} /></div>}
            </div>
            <div style={styles.formGroup}><label style={styles.label}>Scheduled Time</label><input type="time" value={selected.scheduledTime} onChange={e => setSelected({ ...selected, scheduledTime: e.target.value })} style={styles.input} /></div>
            <div style={styles.totalCard}><span style={styles.totalLabel}>Estimated Total</span><span style={styles.totalValue}>₹{calculateTotal().toLocaleString()}</span></div>
          </div>
        )}

        {step === 4 && (
          <div style={styles.summary}>
            <h2 style={{ fontFamily: "'Outfit',sans-serif", marginBottom: '1.5rem' }}>Booking Summary</h2>
            {[['Service', selected.service?.name], ['Patient', selected.patient?.name], ['Caregiver', selected.caregiver?.userId?.name], ['Type', selected.bookingType], ['Date', selected.startDate], ['Time', selected.scheduledTime], ['Total', `₹${calculateTotal().toLocaleString()}`]].map(([k, v], i) => (
              <div key={i} style={styles.summaryRow}><span style={styles.summaryKey}>{k}</span><span style={styles.summaryVal}>{v}</span></div>
            ))}
          </div>
        )}
      </div>

      <div style={styles.navRow}>
        {step > 0 && <button onClick={() => setStep(step - 1)} style={styles.backBtn}><ArrowLeft size={18} /> Back</button>}
        <div style={{ flex: 1 }} />
        {step < 4 ? (
          <button onClick={() => setStep(step + 1)} disabled={step === 0 && !selected.service || step === 1 && !selected.patient || step === 2 && !selected.caregiver || step === 3 && !selected.startDate} style={styles.primaryBtn}>Next <ArrowRight size={18} /></button>
        ) : (
          <button onClick={handleSubmit} disabled={submitting} style={styles.primaryBtn}>{submitting ? 'Booking...' : 'Confirm Booking'} <Check size={18} /></button>
        )}
      </div>
    </div>
  );
}

const styles = {
  title: { fontFamily: "'Outfit', sans-serif", fontSize: '1.8rem', fontWeight: 700, marginBottom: '1.5rem' },
  progressBar: { display: 'flex', gap: '0.5rem', marginBottom: '2rem', overflowX: 'auto' },
  progressStep: { display: 'flex', alignItems: 'center', gap: '0.5rem', transition: 'opacity 0.3s' },
  stepCircle: { width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600, fontSize: '0.85rem', flexShrink: 0 },
  stepLabel: { fontSize: '0.85rem', fontWeight: 500, whiteSpace: 'nowrap' },
  content: { minHeight: '300px', marginBottom: '2rem' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1rem' },
  selectCard: { background: '#fff', border: '2px solid', borderRadius: '16px', padding: '1.5rem', cursor: 'pointer', transition: 'all 0.2s' },
  cardTitle: { fontFamily: "'Outfit',sans-serif", fontSize: '1.1rem', fontWeight: 600, margin: '0 0 0.5rem' },
  cardDesc: { color: '#78716C', fontSize: '0.9rem', margin: '0 0 0.5rem' },
  cardPrice: { color: '#0D9488', fontWeight: 600, fontSize: '0.95rem', margin: 0 },
  tagRow: { display: 'flex', flexWrap: 'wrap', gap: '0.25rem', marginTop: '0.5rem' },
  tag: { background: '#F0FDF4', color: '#0D9488', padding: '2px 8px', borderRadius: '12px', fontSize: '0.75rem' },
  emptyState: { gridColumn: '1/-1', textAlign: 'center', padding: '3rem', color: '#78716C' },
  scheduleForm: { maxWidth: '500px', display: 'flex', flexDirection: 'column', gap: '1.25rem' },
  formGroup: { display: 'flex', flexDirection: 'column', gap: '0.4rem' },
  formRow: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' },
  label: { fontWeight: 500, fontSize: '0.9rem', color: '#1C1917' },
  input: { padding: '12px', border: '2px solid #E7E5E4', borderRadius: '10px', fontSize: '0.95rem', outline: 'none', background: '#FAFAF9' },
  totalCard: { background: 'linear-gradient(135deg, #F0FDFA, #fff)', border: '2px solid #99F6E4', borderRadius: '16px', padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  totalLabel: { fontWeight: 500, color: '#0F766E', fontSize: '1rem' },
  totalValue: { fontFamily: "'Outfit',sans-serif", fontSize: '2rem', fontWeight: 700, color: '#0D9488' },
  summary: { background: '#fff', borderRadius: '16px', padding: '2rem', maxWidth: '500px', border: '1px solid #E7E5E4' },
  summaryRow: { display: 'flex', justifyContent: 'space-between', padding: '0.75rem 0', borderBottom: '1px solid #F5F5F4' },
  summaryKey: { color: '#78716C', fontWeight: 500 },
  summaryVal: { fontWeight: 600, color: '#1C1917', textTransform: 'capitalize' },
  navRow: { display: 'flex', gap: '1rem', paddingTop: '1rem', borderTop: '1px solid #E7E5E4' },
  backBtn: { display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '12px 20px', background: '#F5F5F4', color: '#1C1917', border: 'none', borderRadius: '12px', fontWeight: 500, cursor: 'pointer' },
  primaryBtn: { display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '12px 24px', background: 'linear-gradient(135deg, #0D9488, #0F766E)', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: 600, cursor: 'pointer' },
};
