'use client';

// Modal - Reusable overlay dialog with backdrop blur, close on Escape/click-outside
import { useEffect, useCallback, useRef } from 'react';
import { X } from 'lucide-react';

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  footer,
  maxWidth = 520,
}) {
  const overlayRef = useRef(null);

  const handleEscape = useCallback(
    (e) => {
      if (e.key === 'Escape') onClose?.();
    },
    [onClose]
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, handleEscape]);

  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (e.target === overlayRef.current) onClose?.();
  };

  return (
    <div ref={overlayRef} style={styles.overlay} onClick={handleOverlayClick}>
      <div style={{ ...styles.content, maxWidth }} role="dialog" aria-modal="true">
        {/* Header */}
        <div style={styles.header}>
          <h3 style={styles.title}>{title}</h3>
          <button onClick={onClose} style={styles.closeBtn} aria-label="Close">
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div style={styles.body}>{children}</div>

        {/* Footer (optional) */}
        {footer && <div style={styles.footer}>{footer}</div>}
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0, 0, 0, 0.45)',
    backdropFilter: 'blur(4px)',
    WebkitBackdropFilter: 'blur(4px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '1.5rem',
    zIndex: 2000,
    animation: 'fadeIn 200ms ease',
  },
  content: {
    background: 'var(--color-white)',
    borderRadius: 'var(--radius-xl)',
    boxShadow: 'var(--shadow-xl)',
    width: '100%',
    maxHeight: '90vh',
    display: 'flex',
    flexDirection: 'column',
    animation: 'scaleIn 250ms ease',
    overflow: 'hidden',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '1.25rem 1.5rem',
    borderBottom: '1px solid var(--color-border)',
  },
  title: {
    fontSize: '1.25rem',
    fontWeight: 600,
    fontFamily: 'var(--font-heading)',
    color: 'var(--color-text)',
  },
  closeBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 36,
    height: 36,
    borderRadius: 'var(--radius-sm)',
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    color: 'var(--color-text-secondary)',
    transition: 'all 200ms ease',
  },
  body: {
    padding: '1.5rem',
    overflowY: 'auto',
    flex: 1,
  },
  footer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: '0.75rem',
    padding: '1rem 1.5rem',
    borderTop: '1px solid var(--color-border)',
    background: 'var(--color-bg)',
  },
};
