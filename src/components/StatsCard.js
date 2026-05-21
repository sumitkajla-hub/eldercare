// StatsCard - Dashboard statistics card with icon, value, label, and trend
import { TrendingUp, TrendingDown } from 'lucide-react';

export default function StatsCard({ icon: Icon, label, value, trend, trendValue, color = 'var(--color-primary)' }) {
  const isPositive = trend === 'up';

  return (
    <div style={styles.card}>
      <div style={{ ...styles.iconWrap, background: `${color}12`, color }}>
        {Icon && <Icon size={24} />}
      </div>
      <div style={styles.content}>
        <p style={styles.label}>{label}</p>
        <p style={styles.value}>{value}</p>
        {trendValue && (
          <div style={{
            ...styles.trend,
            color: isPositive ? 'var(--color-success)' : 'var(--color-error)',
          }}>
            {isPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
            <span style={styles.trendText}>{trendValue}</span>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  card: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '1rem',
    background: 'var(--color-white)',
    border: '1px solid var(--color-border)',
    borderRadius: 'var(--radius-lg)',
    padding: '1.5rem',
    transition: 'all var(--transition-normal)',
    boxShadow: 'var(--shadow-sm)',
    cursor: 'default',
  },
  iconWrap: {
    width: 48,
    height: 48,
    borderRadius: 'var(--radius-md)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  content: {
    flex: 1,
    minWidth: 0,
  },
  label: {
    fontSize: '0.875rem',
    color: 'var(--color-text-secondary)',
    marginBottom: '0.25rem',
  },
  value: {
    fontSize: '1.75rem',
    fontWeight: 700,
    fontFamily: 'var(--font-heading)',
    color: 'var(--color-text)',
    lineHeight: 1.2,
  },
  trend: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.25rem',
    marginTop: '0.5rem',
    fontSize: '0.8125rem',
    fontWeight: 500,
  },
  trendText: {
    lineHeight: 1,
  },
};
