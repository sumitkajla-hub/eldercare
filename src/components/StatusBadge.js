// StatusBadge - Color-coded badge based on status value
const STATUS_STYLES = {
  pending: {
    background: '#FEF3C7',
    color: '#92400E',
    label: 'Pending',
  },
  accepted: {
    background: 'var(--color-info-bg)',
    color: '#2563EB',
    label: 'Accepted',
  },
  'in-progress': {
    background: 'var(--color-primary-lighter)',
    color: 'var(--color-primary-dark)',
    label: 'In Progress',
  },
  completed: {
    background: 'var(--color-success-bg)',
    color: '#16A34A',
    label: 'Completed',
  },
  cancelled: {
    background: 'var(--color-error-bg)',
    color: '#DC2626',
    label: 'Cancelled',
  },
};

export default function StatusBadge({ status }) {
  const config = STATUS_STYLES[status] || STATUS_STYLES.pending;

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.375rem',
        padding: '0.375rem 0.875rem',
        fontSize: '0.8125rem',
        fontWeight: 500,
        borderRadius: 'var(--radius-full)',
        background: config.background,
        color: config.color,
        lineHeight: 1,
      }}
    >
      <span
        style={{
          width: 6,
          height: 6,
          borderRadius: '50%',
          background: config.color,
        }}
      />
      {config.label}
    </span>
  );
}
