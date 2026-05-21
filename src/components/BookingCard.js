// BookingCard - Displays booking details with status, actions, and meta info
import StatusBadge from './StatusBadge';
import { Calendar, Clock, User, CreditCard, ArrowRight } from 'lucide-react';

export default function BookingCard({ booking, onAction }) {
  const {
    _id = '',
    serviceName = 'Service',
    caregiverName = 'Caregiver',
    patientName = 'Patient',
    date = '',
    time = '',
    status = 'pending',
    bookingType = 'hourly',
    amount = 0,
  } = booking || {};

  // Format date for display
  const formattedDate = date
    ? new Date(date).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })
    : 'TBD';

  const handleAction = (action) => {
    if (onAction) onAction(action, _id);
  };

  // Determine available actions based on status
  const getActions = () => {
    switch (status) {
      case 'pending':
        return [
          { label: 'Cancel', action: 'cancel', variant: 'danger' },
        ];
      case 'accepted':
        return [
          { label: 'View Details', action: 'view', variant: 'outline' },
          { label: 'Cancel', action: 'cancel', variant: 'danger' },
        ];
      case 'in-progress':
        return [
          { label: 'View Details', action: 'view', variant: 'outline' },
        ];
      case 'completed':
        return [
          { label: 'Rate', action: 'rate', variant: 'primary' },
          { label: 'Rebook', action: 'rebook', variant: 'outline' },
        ];
      default:
        return [
          { label: 'View Details', action: 'view', variant: 'outline' },
        ];
    }
  };

  const typeLabels = {
    hourly: 'Hourly',
    daily: 'Daily',
    monthly: 'Monthly',
    'live-in': 'Live-in',
  };

  return (
    <div style={styles.card}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <h3 style={styles.serviceName}>{serviceName}</h3>
          <StatusBadge status={status} />
        </div>
        <span style={styles.typeBadge}>{typeLabels[bookingType] || bookingType}</span>
      </div>

      {/* Info Grid */}
      <div style={styles.infoGrid}>
        <div style={styles.infoItem}>
          <User size={14} color="var(--color-text-light)" />
          <div>
            <p style={styles.infoLabel}>Caregiver</p>
            <p style={styles.infoValue}>{caregiverName}</p>
          </div>
        </div>
        <div style={styles.infoItem}>
          <User size={14} color="var(--color-text-light)" />
          <div>
            <p style={styles.infoLabel}>Patient</p>
            <p style={styles.infoValue}>{patientName}</p>
          </div>
        </div>
        <div style={styles.infoItem}>
          <Calendar size={14} color="var(--color-text-light)" />
          <div>
            <p style={styles.infoLabel}>Date</p>
            <p style={styles.infoValue}>{formattedDate}</p>
          </div>
        </div>
        <div style={styles.infoItem}>
          <Clock size={14} color="var(--color-text-light)" />
          <div>
            <p style={styles.infoLabel}>Time</p>
            <p style={styles.infoValue}>{time || 'Flexible'}</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={styles.footer}>
        <div style={styles.amount}>
          <CreditCard size={16} color="var(--color-primary)" />
          <span style={styles.amountValue}>₹{amount.toLocaleString('en-IN')}</span>
        </div>
        <div style={styles.actions}>
          {getActions().map((btn) => (
            <button
              key={btn.action}
              onClick={() => handleAction(btn.action)}
              style={{
                ...styles.actionBtn,
                ...(btn.variant === 'primary'
                  ? styles.actionPrimary
                  : btn.variant === 'danger'
                  ? styles.actionDanger
                  : styles.actionOutline),
              }}
            >
              {btn.label}
              {btn.action === 'view' && <ArrowRight size={14} />}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

const styles = {
  card: {
    background: 'var(--color-white)',
    border: '1px solid var(--color-border)',
    borderRadius: 'var(--radius-lg)',
    padding: '1.5rem',
    transition: 'all 250ms ease',
    boxShadow: 'var(--shadow-sm)',
  },
  header: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: '1.25rem',
    gap: '0.5rem',
    flexWrap: 'wrap',
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    flexWrap: 'wrap',
  },
  serviceName: {
    fontSize: '1.0625rem',
    fontWeight: 600,
    fontFamily: 'var(--font-heading)',
    color: 'var(--color-text)',
  },
  typeBadge: {
    padding: '0.25rem 0.75rem',
    fontSize: '0.75rem',
    fontWeight: 500,
    color: 'var(--color-accent)',
    background: 'rgba(79, 70, 229, 0.08)',
    borderRadius: 'var(--radius-full)',
  },
  infoGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '0.875rem',
    marginBottom: '1.25rem',
    padding: '1rem',
    background: 'var(--color-bg)',
    borderRadius: 'var(--radius-md)',
  },
  infoItem: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '0.5rem',
  },
  infoLabel: {
    fontSize: '0.6875rem',
    color: 'var(--color-text-light)',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    marginBottom: '0.125rem',
  },
  infoValue: {
    fontSize: '0.875rem',
    fontWeight: 500,
    color: 'var(--color-text)',
  },
  footer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: '1rem',
    borderTop: '1px solid var(--color-border-light)',
    flexWrap: 'wrap',
    gap: '0.75rem',
  },
  amount: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  amountValue: {
    fontSize: '1.25rem',
    fontWeight: 700,
    fontFamily: 'var(--font-heading)',
    color: 'var(--color-text)',
  },
  actions: {
    display: 'flex',
    gap: '0.5rem',
  },
  actionBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.375rem',
    padding: '0.5rem 0.875rem',
    fontSize: '0.8125rem',
    fontWeight: 500,
    fontFamily: 'var(--font-body)',
    borderRadius: 'var(--radius-sm)',
    cursor: 'pointer',
    transition: 'all 200ms ease',
    border: 'none',
  },
  actionPrimary: {
    background: 'var(--color-primary)',
    color: 'var(--color-white)',
  },
  actionOutline: {
    background: 'transparent',
    color: 'var(--color-text-secondary)',
    border: '1px solid var(--color-border)',
  },
  actionDanger: {
    background: 'var(--color-error-bg)',
    color: 'var(--color-error)',
    border: '1px solid rgba(239, 68, 68, 0.2)',
  },
};
