// Footer - 4-column layout with brand, links, services, contact info
import Link from 'next/link';
import { Heart, Phone, Mail, MapPin } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer style={styles.footer}>
      <div style={styles.container}>
        <div style={styles.grid}>
          {/* Brand Column */}
          <div style={styles.column}>
            <div style={styles.brand}>
              <div style={styles.logoIcon}>
                <Heart size={18} fill="white" color="white" />
              </div>
              <span style={styles.logoText}>ElderCare</span>
            </div>
            <p style={styles.brandDesc}>
              Providing compassionate, professional elderly care services
              to families across India. Your loved ones deserve the best.
            </p>
            <div style={styles.socialRow}>
              {['Facebook', 'Twitter', 'Instagram', 'LinkedIn'].map((platform) => (
                <a key={platform} href="#" style={styles.socialLink} aria-label={platform}>
                  {platform.charAt(0)}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div style={styles.column}>
            <h4 style={styles.columnTitle}>Quick Links</h4>
            <div style={styles.linksList}>
              <Link href="/" style={styles.footerLink}>Home</Link>
              <Link href="/services" style={styles.footerLink}>Services</Link>
              <Link href="/about" style={styles.footerLink}>About Us</Link>
              <Link href="/login" style={styles.footerLink}>Sign In</Link>
              <Link href="/register" style={styles.footerLink}>Get Started</Link>
            </div>
          </div>

          {/* Services */}
          <div style={styles.column}>
            <h4 style={styles.columnTitle}>Our Services</h4>
            <div style={styles.linksList}>
              <Link href="/services" style={styles.footerLink}>Nursing Care</Link>
              <Link href="/services" style={styles.footerLink}>Elderly Attendant</Link>
              <Link href="/services" style={styles.footerLink}>Physiotherapy</Link>
              <Link href="/services" style={styles.footerLink}>Post-Hospital Care</Link>
            </div>
          </div>

          {/* Contact */}
          <div style={styles.column}>
            <h4 style={styles.columnTitle}>Contact Us</h4>
            <div style={styles.contactList}>
              <div style={styles.contactItem}>
                <Phone size={16} style={{ flexShrink: 0 }} />
                <span>+91 1800-XXX-XXXX</span>
              </div>
              <div style={styles.contactItem}>
                <Mail size={16} style={{ flexShrink: 0 }} />
                <span>care@eldercare.com</span>
              </div>
              <div style={styles.contactItem}>
                <MapPin size={16} style={{ flexShrink: 0 }} />
                <span>Mumbai, India</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div style={styles.bottomBar}>
          <p style={styles.copyright}>
            © {currentYear} ElderCare. All rights reserved. Made with{' '}
            <Heart size={14} fill="#EF4444" color="#EF4444" style={{ display: 'inline', verticalAlign: 'middle' }} />{' '}
            for elderly wellness.
          </p>
          <div style={styles.bottomLinks}>
            <a href="#" style={styles.bottomLink}>Privacy Policy</a>
            <a href="#" style={styles.bottomLink}>Terms of Service</a>
            <a href="#" style={styles.bottomLink}>Accessibility</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

const styles = {
  footer: {
    background: 'linear-gradient(180deg, #1C1917 0%, #0C0A09 100%)',
    color: '#D6D3D1',
    marginTop: 'auto',
    paddingTop: '4rem',
  },
  container: {
    maxWidth: 1200,
    margin: '0 auto',
    padding: '0 1.5rem',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: '1.5fr 1fr 1fr 1.2fr',
    gap: '2.5rem',
    paddingBottom: '3rem',
  },
  column: {},
  brand: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    marginBottom: '1rem',
  },
  logoIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    fontSize: '1.25rem',
    fontWeight: 700,
    fontFamily: 'var(--font-heading)',
    color: 'var(--color-white)',
  },
  brandDesc: {
    fontSize: '0.9375rem',
    lineHeight: 1.7,
    color: '#A8A29E',
    marginBottom: '1.5rem',
  },
  socialRow: {
    display: 'flex',
    gap: '0.625rem',
  },
  socialLink: {
    width: 36,
    height: 36,
    borderRadius: '50%',
    background: 'rgba(255,255,255,0.1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#D6D3D1',
    textDecoration: 'none',
    fontSize: '0.8125rem',
    fontWeight: 600,
    transition: 'all 200ms ease',
  },
  columnTitle: {
    fontSize: '1.0625rem',
    fontWeight: 600,
    fontFamily: 'var(--font-heading)',
    color: 'var(--color-white)',
    marginBottom: '1.25rem',
  },
  linksList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
  },
  footerLink: {
    fontSize: '0.9375rem',
    color: '#A8A29E',
    textDecoration: 'none',
    transition: 'color 200ms ease',
  },
  contactList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  contactItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    fontSize: '0.9375rem',
    color: '#A8A29E',
  },
  bottomBar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '1.5rem 0',
    borderTop: '1px solid rgba(255,255,255,0.1)',
    flexWrap: 'wrap',
    gap: '1rem',
  },
  copyright: {
    fontSize: '0.875rem',
    color: '#78716C',
  },
  bottomLinks: {
    display: 'flex',
    gap: '1.5rem',
  },
  bottomLink: {
    fontSize: '0.875rem',
    color: '#78716C',
    textDecoration: 'none',
    transition: 'color 200ms ease',
  },
};

// Responsive styles injection (appended as a module-level side effect for SSR safety)
export const footerResponsiveCSS = `
  @media (max-width: 768px) {
    footer > div > div:first-child {
      grid-template-columns: 1fr 1fr !important;
    }
  }
  @media (max-width: 480px) {
    footer > div > div:first-child {
      grid-template-columns: 1fr !important;
    }
  }
`;
