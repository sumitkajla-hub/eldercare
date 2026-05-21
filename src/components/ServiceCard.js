// ServiceCard - Displays a service with icon, name, description, price, and CTA
import Link from 'next/link';
import { Clock, ArrowRight } from 'lucide-react';

export default function ServiceCard({ service }) {
  const {
    icon: Icon,
    name = 'Service',
    description = '',
    price = '',
    duration = '',
    href = '/services',
    color = 'var(--color-primary)',
  } = service || {};

  return (
    <div style={styles.card}>
      <div style={{ ...styles.iconWrap, background: `${color}12`, color }}>
        {Icon && <Icon size={28} />}
      </div>

      <h3 style={styles.name}>{name}</h3>
      <p style={styles.description}>{description}</p>

      <div style={styles.meta}>
        {price && (
          <div style={styles.price}>
            <span style={styles.priceLabel}>Starting at</span>
            <span style={styles.priceValue}>{price}</span>
          </div>
        )}
        {duration && (
          <div style={styles.duration}>
            <Clock size={14} />
            <span>{duration}</span>
          </div>
        )}
      </div>

      <Link href={href} style={styles.cta}>
        Learn More
        <ArrowRight size={16} />
      </Link>
    </div>
  );
}

const styles = {
  card: {
    background: 'var(--color-white)',
    border: '1px solid var(--color-border)',
    borderRadius: 'var(--radius-lg)',
    padding: '2rem',
    transition: 'all 300ms ease',
    boxShadow: 'var(--shadow-sm)',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    overflow: 'hidden',
  },
  iconWrap: {
    width: 56,
    height: 56,
    borderRadius: 'var(--radius-md)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '1.25rem',
    fontSize: '1.5rem',
  },
  name: {
    fontSize: '1.25rem',
    fontWeight: 600,
    fontFamily: 'var(--font-heading)',
    color: 'var(--color-text)',
    marginBottom: '0.625rem',
  },
  description: {
    fontSize: '0.9375rem',
    color: 'var(--color-text-secondary)',
    lineHeight: 1.65,
    marginBottom: '1.25rem',
    flex: 1,
  },
  meta: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '1.25rem',
    flexWrap: 'wrap',
    gap: '0.5rem',
  },
  price: {
    display: 'flex',
    flexDirection: 'column',
  },
  priceLabel: {
    fontSize: '0.75rem',
    color: 'var(--color-text-light)',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  priceValue: {
    fontSize: '1.25rem',
    fontWeight: 700,
    fontFamily: 'var(--font-heading)',
    color: 'var(--color-primary)',
  },
  duration: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.375rem',
    fontSize: '0.875rem',
    color: 'var(--color-text-secondary)',
    background: 'var(--color-bg-secondary)',
    padding: '0.375rem 0.75rem',
    borderRadius: 'var(--radius-full)',
  },
  cta: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.75rem 1.25rem',
    fontSize: '0.9375rem',
    fontWeight: 500,
    color: 'var(--color-primary)',
    textDecoration: 'none',
    borderRadius: 'var(--radius-md)',
    border: '1.5px solid var(--color-primary)',
    transition: 'all 250ms ease',
    justifyContent: 'center',
  },
};
