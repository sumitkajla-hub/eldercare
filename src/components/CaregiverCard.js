// CaregiverCard - Displays caregiver profile with avatar, details, rating, and actions
import Link from 'next/link';
import RatingStars from './RatingStars';
import { BadgeCheck, MapPin, Briefcase, Globe } from 'lucide-react';

export default function CaregiverCard({ caregiver }) {
  const {
    _id = '',
    name = 'Caregiver',
    specialization = '',
    experience = 0,
    rating = 0,
    totalReviews = 0,
    hourlyRate = 0,
    verified = false,
    languages = [],
    serviceAreas = [],
    avatar = '',
  } = caregiver || {};

  // Generate initials from name
  const initials = name
    .split(' ')
    .map((n) => n.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);

  // Generate a consistent color from name
  const colors = ['#0D9488', '#4F46E5', '#7C3AED', '#2563EB', '#DC2626', '#EA580C'];
  const colorIndex = name.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0) % colors.length;
  const avatarColor = colors[colorIndex];

  return (
    <div style={styles.card}>
      {/* Header */}
      <div style={styles.header}>
        <div style={{ ...styles.avatar, background: avatarColor }}>
          {avatar ? (
            <img src={avatar} alt={name} style={styles.avatarImg} />
          ) : (
            <span>{initials}</span>
          )}
        </div>
        <div style={styles.headerInfo}>
          <div style={styles.nameRow}>
            <h3 style={styles.name}>{name}</h3>
            {verified && (
              <BadgeCheck size={18} color="#0D9488" fill="#99F6E4" />
            )}
          </div>
          {specialization && (
            <span style={styles.specBadge}>{specialization}</span>
          )}
        </div>
      </div>

      {/* Stats Row */}
      <div style={styles.statsRow}>
        <div style={styles.stat}>
          <Briefcase size={14} color="var(--color-text-light)" />
          <span>{experience} yr{experience !== 1 ? 's' : ''} exp</span>
        </div>
        <div style={styles.stat}>
          <RatingStars rating={rating} size={14} />
          <span style={styles.reviewCount}>({totalReviews})</span>
        </div>
      </div>

      {/* Details */}
      <div style={styles.details}>
        {languages.length > 0 && (
          <div style={styles.detailItem}>
            <Globe size={14} color="var(--color-text-light)" />
            <span>{languages.join(', ')}</span>
          </div>
        )}
        {serviceAreas.length > 0 && (
          <div style={styles.detailItem}>
            <MapPin size={14} color="var(--color-text-light)" />
            <span>{serviceAreas.slice(0, 2).join(', ')}{serviceAreas.length > 2 ? ` +${serviceAreas.length - 2}` : ''}</span>
          </div>
        )}
      </div>

      {/* Footer */}
      <div style={styles.footer}>
        <div style={styles.rate}>
          <span style={styles.rateAmount}>₹{hourlyRate}</span>
          <span style={styles.rateUnit}>/hour</span>
        </div>
        <div style={styles.actions}>
          <Link href={`/caregiver/${_id}`} style={styles.viewBtn}>
            View Profile
          </Link>
          <Link href={`/booking/new?caregiver=${_id}`} style={styles.bookBtn}>
            Book
          </Link>
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
    transition: 'all 300ms ease',
    boxShadow: 'var(--shadow-sm)',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  header: {
    display: 'flex',
    gap: '1rem',
    alignItems: 'flex-start',
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 'var(--radius-md)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontSize: '1.125rem',
    fontWeight: 700,
    fontFamily: 'var(--font-heading)',
    flexShrink: 0,
    overflow: 'hidden',
  },
  avatarImg: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  headerInfo: {
    flex: 1,
    minWidth: 0,
  },
  nameRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.375rem',
    marginBottom: '0.25rem',
  },
  name: {
    fontSize: '1.0625rem',
    fontWeight: 600,
    fontFamily: 'var(--font-heading)',
    color: 'var(--color-text)',
    lineHeight: 1.3,
  },
  specBadge: {
    display: 'inline-block',
    padding: '0.25rem 0.625rem',
    fontSize: '0.75rem',
    fontWeight: 500,
    color: 'var(--color-accent)',
    background: 'rgba(79, 70, 229, 0.08)',
    borderRadius: 'var(--radius-full)',
  },
  statsRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    flexWrap: 'wrap',
  },
  stat: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.375rem',
    fontSize: '0.8125rem',
    color: 'var(--color-text-secondary)',
  },
  reviewCount: {
    fontSize: '0.75rem',
    color: 'var(--color-text-light)',
  },
  details: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  detailItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '0.8125rem',
    color: 'var(--color-text-secondary)',
  },
  footer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: '1rem',
    borderTop: '1px solid var(--color-border-light)',
    marginTop: 'auto',
  },
  rate: {
    display: 'flex',
    alignItems: 'baseline',
    gap: '0.125rem',
  },
  rateAmount: {
    fontSize: '1.25rem',
    fontWeight: 700,
    fontFamily: 'var(--font-heading)',
    color: 'var(--color-text)',
  },
  rateUnit: {
    fontSize: '0.8125rem',
    color: 'var(--color-text-light)',
  },
  actions: {
    display: 'flex',
    gap: '0.5rem',
  },
  viewBtn: {
    padding: '0.5rem 0.875rem',
    fontSize: '0.8125rem',
    fontWeight: 500,
    color: 'var(--color-text-secondary)',
    textDecoration: 'none',
    borderRadius: 'var(--radius-sm)',
    border: '1px solid var(--color-border)',
    transition: 'all 200ms ease',
  },
  bookBtn: {
    padding: '0.5rem 0.875rem',
    fontSize: '0.8125rem',
    fontWeight: 500,
    color: 'var(--color-white)',
    textDecoration: 'none',
    borderRadius: 'var(--radius-sm)',
    background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%)',
    transition: 'all 200ms ease',
  },
};
