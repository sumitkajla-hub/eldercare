'use client';

// RatingStars - Display or interactive star rating component
import { Star } from 'lucide-react';
import { useState } from 'react';

export default function RatingStars({ rating = 0, maxStars = 5, size = 18, interactive = false, onRate }) {
  const [hovered, setHovered] = useState(0);

  const handleClick = (value) => {
    if (interactive && onRate) {
      onRate(value);
    }
  };

  return (
    <div style={styles.container}>
      {Array.from({ length: maxStars }, (_, i) => {
        const starValue = i + 1;
        const filled = interactive ? starValue <= (hovered || rating) : starValue <= rating;
        const halfFilled = !interactive && !filled && starValue - 0.5 <= rating;

        return (
          <button
            key={i}
            type="button"
            onClick={() => handleClick(starValue)}
            onMouseEnter={() => interactive && setHovered(starValue)}
            onMouseLeave={() => interactive && setHovered(0)}
            style={{
              ...styles.starButton,
              cursor: interactive ? 'pointer' : 'default',
            }}
            aria-label={`${starValue} star${starValue > 1 ? 's' : ''}`}
            tabIndex={interactive ? 0 : -1}
          >
            <Star
              size={size}
              fill={filled || halfFilled ? '#F59E0B' : 'none'}
              color={filled || halfFilled ? '#F59E0B' : '#D6D3D1'}
              strokeWidth={1.5}
            />
          </button>
        );
      })}
      {!interactive && rating > 0 && (
        <span style={styles.ratingText}>{rating.toFixed(1)}</span>
      )}
    </div>
  );
}

const styles = {
  container: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '2px',
  },
  starButton: {
    background: 'none',
    border: 'none',
    padding: '1px',
    display: 'inline-flex',
    alignItems: 'center',
    transition: 'transform 150ms ease',
  },
  ratingText: {
    marginLeft: '6px',
    fontSize: '0.9rem',
    fontWeight: 500,
    color: 'var(--color-text-secondary)',
  },
};
