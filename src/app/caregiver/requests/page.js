'use client';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Check, X, Calendar, Clock, DollarSign, User } from 'lucide-react';

export default function CaregiverRequestsPage() {
  const { data: session } = useSession();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchRequests(); }, []);

  const fetchRequests = async () => {
    try {
      const res = await fetch('/api/bookings?status=pending');
      const data = await res.json();
      setRequests(Array.isArray(data) ? data : []);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleAction = async (id, status) => {
    await fetch(`/api/bookings/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status }) });
    fetchRequests();
  };

  if (loading) return <div style={{ padding: '3rem', textAlign: 'center' }}>Loading...</div>;

  return (
    <div>
      <h1 style={styles.title}>Service Requests</h1>
      {requests.length === 0 ? (
        <div style={styles.empty}><Calendar size={48} color="#A8A29E" /><h3>No pending requests</h3><p>New service requests will appear here.</p></div>
      ) : (
        <div style={styles.list}>
          {requests.map(req => (
            <div key={req._id} style={styles.card}>
              <div style={styles.cardBody}>
                <h3 style={styles.serviceName}>{req.serviceId?.name || 'Service'}</h3>
                <div style={styles.details}>
                  <p><User size={14} /> Patient: {req.patientId?.name || 'N/A'}</p>
                  <p><Calendar size={14} /> {new Date(req.startDate).toLocaleDateString()} - {new Date(req.endDate).toLocaleDateString()}</p>
                  <p><Clock size={14} /> {req.scheduledTime} • {req.bookingType}</p>
                  <p><DollarSign size={14} /> ₹{req.totalAmount?.toLocaleString()}</p>
                </div>
              </div>
              <div style={styles.actions}>
                <button onClick={() => handleAction(req._id, 'accepted')} style={styles.acceptBtn}><Check size={18} /> Accept</button>
                <button onClick={() => handleAction(req._id, 'cancelled')} style={styles.rejectBtn}><X size={18} /> Reject</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const styles = {
  title: { fontFamily: "'Outfit', sans-serif", fontSize: '1.8rem', fontWeight: 700, marginBottom: '1.5rem' },
  empty: { textAlign: 'center', padding: '4rem', color: '#78716C', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' },
  list: { display: 'flex', flexDirection: 'column', gap: '1rem' },
  card: { background: '#fff', borderRadius: '16px', padding: '1.5rem', border: '1px solid #E7E5E4', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' },
  cardBody: { marginBottom: '1rem' },
  serviceName: { fontFamily: "'Outfit',sans-serif", fontSize: '1.2rem', fontWeight: 600, marginBottom: '0.75rem' },
  details: { display: 'flex', flexDirection: 'column', gap: '0.4rem', color: '#78716C', fontSize: '0.9rem' },
  actions: { display: 'flex', gap: '0.75rem', borderTop: '1px solid #F5F5F4', paddingTop: '1rem' },
  acceptBtn: { display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '10px 20px', background: '#22C55E', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 600, cursor: 'pointer' },
  rejectBtn: { display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '10px 20px', background: '#FEF2F2', color: '#EF4444', border: 'none', borderRadius: '10px', fontWeight: 600, cursor: 'pointer' },
};
