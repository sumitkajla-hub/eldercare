'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import {
  Clock,
  Activity,
  CheckCircle2,
  DollarSign,
  User,
  Calendar,
  FileText,
  ClipboardList,
  Bell,
  UserCircle,
  ArrowRight,
} from 'lucide-react';

/* ================================================================
   Caregiver Home / Dashboard Page
   Shows welcome, stats, pending requests preview, today's schedule,
   recent care notes, and quick actions.
   ================================================================ */
export default function CaregiverHomePage() {
  const { data: session } = useSession();

  const [bookings, setBookings] = useState([]);
  const [careNotes, setCareNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  /* ---------- Fetch all data on mount ---------- */
  useEffect(() => {
    if (!session) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        /* Fetch bookings */
        const bRes = await fetch('/api/bookings');
        const bData = await bRes.json();
        const allBookings = Array.isArray(bData) ? bData : bData.bookings || [];
        setBookings(allBookings);

        /* Fetch care notes */
        const nRes = await fetch('/api/care-notes');
        const nData = await nRes.json();
        setCareNotes(Array.isArray(nData) ? nData : nData.careNotes || []);
      } catch (err) {
        setError('Failed to load dashboard data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [session]);

  /* ---------- Compute stats ---------- */
  const pendingRequests = bookings.filter((b) => b.status === 'pending');
  const activeServices = bookings.filter(
    (b) => b.status === 'accepted' || b.status === 'in-progress'
  );
  const completedServices = bookings.filter((b) => b.status === 'completed');
  const totalEarnings = completedServices.reduce(
    (sum, b) => sum + (b.totalAmount || 0),
    0
  );

  /* ---------- Today's schedule ---------- */
  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];
  const todaySchedule = bookings.filter((b) => {
    if (b.status !== 'accepted' && b.status !== 'in-progress') return false;
    const start = b.startDate ? b.startDate.split('T')[0] : '';
    const end = b.endDate ? b.endDate.split('T')[0] : start;
    return todayStr >= start && todayStr <= end;
  });

  /* ---------- Handle accept / reject ---------- */
  const handleAction = async (id, status) => {
    try {
      const res = await fetch(`/api/bookings/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        setBookings((prev) =>
          prev.map((b) => (b._id === id ? { ...b, status } : b))
        );
      }
    } catch {
      setError('Action failed. Please try again.');
    }
  };

  /* ---------- Format helpers ---------- */
  const fmtDate = (d) => {
    if (!d) return '—';
    return new Date(d).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const fmtTime = (d) => {
    if (!d) return '';
    return new Date(d).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  /* ---------- Loading ---------- */
  if (loading) {
    return (
      <div className="cg-loading">
        <div className="cg-spinner" />
        <p className="cg-loading-text">Loading dashboard…</p>
      </div>
    );
  }

  /* ---------- Render ---------- */
  return (
    <div>
      {/* Page header */}
      <div className="cg-page-header">
        <h1 className="cg-page-title">
          Welcome back, {session?.user?.name?.split(' ')[0] || 'Caregiver'}! 👋
        </h1>
        <p className="cg-page-subtitle">
          Here&apos;s what&apos;s happening with your care services today.
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="cg-error-alert">
          <Activity size={18} />
          {error}
        </div>
      )}

      {/* Stats row */}
      <div className="cg-stats-row">
        <div className="cg-stat-card">
          <div className="cg-stat-icon pending">
            <Clock size={24} />
          </div>
          <div className="cg-stat-value">{pendingRequests.length}</div>
          <div className="cg-stat-label">Pending Requests</div>
        </div>

        <div className="cg-stat-card">
          <div className="cg-stat-icon active">
            <Activity size={24} />
          </div>
          <div className="cg-stat-value">{activeServices.length}</div>
          <div className="cg-stat-label">Active Services</div>
        </div>

        <div className="cg-stat-card">
          <div className="cg-stat-icon completed">
            <CheckCircle2 size={24} />
          </div>
          <div className="cg-stat-value">{completedServices.length}</div>
          <div className="cg-stat-label">Completed</div>
        </div>

        <div className="cg-stat-card">
          <div className="cg-stat-icon earnings">
            <DollarSign size={24} />
          </div>
          <div className="cg-stat-value">
            ₹{totalEarnings.toLocaleString()}
          </div>
          <div className="cg-stat-label">Total Earnings</div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="cg-quick-actions">
        <Link href="/caregiver/requests" className="cg-quick-action">
          <Bell size={28} />
          <span>View Requests</span>
        </Link>
        <Link href="/caregiver/schedule" className="cg-quick-action">
          <Calendar size={28} />
          <span>My Schedule</span>
        </Link>
        <Link href="/caregiver/bookings" className="cg-quick-action">
          <ClipboardList size={28} />
          <span>My Bookings</span>
        </Link>
        <Link href="/caregiver/earnings" className="cg-quick-action">
          <DollarSign size={28} />
          <span>Earnings</span>
        </Link>
        <Link href="/caregiver/profile" className="cg-quick-action">
          <UserCircle size={28} />
          <span>Edit Profile</span>
        </Link>
        <Link href="/caregiver/bookings" className="cg-quick-action">
          <FileText size={28} />
          <span>Add Care Note</span>
        </Link>
      </div>

      {/* Two-column section: Pending Requests + Today's Schedule */}
      <div className="cg-section-grid">
        {/* Pending Requests Preview */}
        <div className="cg-card">
          <div className="cg-card-header">
            <h2 className="cg-card-title">Pending Requests</h2>
            <Link
              href="/caregiver/requests"
              className="cg-btn cg-btn-outline cg-btn-sm"
            >
              View All <ArrowRight size={16} />
            </Link>
          </div>

          {pendingRequests.length === 0 ? (
            <div className="cg-empty" style={{ padding: '30px 0' }}>
              <div
                className="cg-empty-icon"
                style={{ width: 56, height: 56 }}
              >
                <Bell size={28} />
              </div>
              <p className="cg-empty-text">No pending requests right now.</p>
            </div>
          ) : (
            pendingRequests.slice(0, 3).map((b) => (
              <div key={b._id} className="cg-request-card" style={{ boxShadow: 'none', border: `1px solid var(--color-border)` }}>
                <div className="cg-request-top">
                  <div className="cg-request-service">
                    {b.service?.name || b.serviceName || 'Service'}
                  </div>
                  <div className="cg-request-amount">
                    ₹{(b.totalAmount || 0).toLocaleString()}
                  </div>
                </div>
                <div className="cg-request-details">
                  <div className="cg-request-detail">
                    <User size={16} />
                    {b.patient?.name || b.patientName || 'Patient'}
                  </div>
                  <div className="cg-request-detail">
                    <Calendar size={16} />
                    {fmtDate(b.startDate)}
                  </div>
                </div>
                <div className="cg-request-actions">
                  <button
                    className="cg-btn cg-btn-success cg-btn-sm"
                    onClick={() => handleAction(b._id, 'accepted')}
                  >
                    <CheckCircle2 size={16} /> Accept
                  </button>
                  <button
                    className="cg-btn cg-btn-danger cg-btn-sm"
                    onClick={() => handleAction(b._id, 'cancelled')}
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Today's Schedule */}
        <div className="cg-card">
          <div className="cg-card-header">
            <h2 className="cg-card-title">Today&apos;s Schedule</h2>
            <Link
              href="/caregiver/schedule"
              className="cg-btn cg-btn-outline cg-btn-sm"
            >
              Full Schedule <ArrowRight size={16} />
            </Link>
          </div>

          {todaySchedule.length === 0 ? (
            <div className="cg-empty" style={{ padding: '30px 0' }}>
              <div
                className="cg-empty-icon"
                style={{ width: 56, height: 56 }}
              >
                <Calendar size={28} />
              </div>
              <p className="cg-empty-text">
                No appointments scheduled for today.
              </p>
            </div>
          ) : (
            todaySchedule.map((b) => (
              <div key={b._id} className="cg-schedule-item">
                <div className="cg-schedule-time">{fmtTime(b.startDate)}</div>
                <div className="cg-schedule-info">
                  <div className="cg-schedule-service">
                    {b.service?.name || b.serviceName || 'Service'}
                  </div>
                  <div className="cg-schedule-patient">
                    {b.patient?.name || b.patientName || 'Patient'}
                  </div>
                </div>
                <span
                  className={`cg-status-badge ${b.status}`}
                >
                  {b.status === 'in-progress' ? 'In Progress' : b.status}
                </span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Recent Care Notes */}
      <div className="cg-card cg-mb-32">
        <div className="cg-card-header">
          <h2 className="cg-card-title">Recent Care Notes</h2>
        </div>

        {careNotes.length === 0 ? (
          <div className="cg-empty" style={{ padding: '30px 0' }}>
            <div className="cg-empty-icon" style={{ width: 56, height: 56 }}>
              <FileText size={28} />
            </div>
            <p className="cg-empty-text">
              No care notes yet. Add notes from your active bookings.
            </p>
          </div>
        ) : (
          careNotes.slice(0, 5).map((note, idx) => (
            <div key={note._id || idx} className="cg-note-item">
              <div className="cg-note-header">
                <span className="cg-note-patient">
                  {note.patient?.name || note.patientName || 'Patient'}
                </span>
                <span className="cg-note-date">{fmtDate(note.createdAt)}</span>
              </div>
              <p className="cg-note-text">
                {note.notes || note.content || 'No content'}
              </p>
              {(note.vitals || note.bloodPressure || note.temperature) && (
                <div
                  className="cg-request-details"
                  style={{ marginTop: 8, marginBottom: 0 }}
                >
                  {(note.vitals?.bloodPressure || note.bloodPressure) && (
                    <span className="cg-request-detail">
                      BP: {note.vitals?.bloodPressure || note.bloodPressure}
                    </span>
                  )}
                  {(note.vitals?.temperature || note.temperature) && (
                    <span className="cg-request-detail">
                      Temp: {note.vitals?.temperature || note.temperature}°
                    </span>
                  )}
                  {(note.vitals?.pulse || note.pulse) && (
                    <span className="cg-request-detail">
                      Pulse: {note.vitals?.pulse || note.pulse}
                    </span>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
