'use client';

// Navbar - Sticky navigation with role-aware links, glassmorphism, mobile menu
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { Heart, Menu, X, ChevronDown, LogOut, LayoutDashboard, User } from 'lucide-react';

export default function Navbar() {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
    setProfileOpen(false);
  }, [pathname]);

  // Determine dashboard route based on role
  const getDashboardPath = () => {
    if (!session?.user?.role) return '/dashboard';
    if (session.user.role === 'admin') return '/admin';
    if (session.user.role === 'caregiver') return '/caregiver/dashboard';
    return '/dashboard';
  };

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/services', label: 'Services' },
    { href: '/about', label: 'About Us' },
  ];

  const isActive = (href) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <>
      <nav style={{
        ...styles.nav,
        ...(scrolled ? styles.navScrolled : {}),
      }}>
        <div style={styles.container}>
          {/* Logo */}
          <Link href="/" style={styles.logo}>
            <div style={styles.logoIcon}>
              <Heart size={22} fill="white" color="white" />
            </div>
            <span style={styles.logoText}>ElderCare</span>
          </Link>

          {/* Desktop Links */}
          <div style={styles.desktopNav}>
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                style={{
                  ...styles.navLink,
                  ...(isActive(link.href) ? styles.navLinkActive : {}),
                }}
              >
                {link.label}
                {isActive(link.href) && <span style={styles.activeIndicator} />}
              </Link>
            ))}
          </div>

          {/* Desktop Auth */}
          <div style={styles.desktopAuth}>
            {status === 'loading' ? (
              <div style={styles.authSkeleton} />
            ) : session ? (
              <div style={styles.profileWrap}>
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  style={styles.profileButton}
                >
                  <div style={styles.avatar}>
                    {session.user?.name?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                  <span style={styles.profileName}>{session.user?.name || 'User'}</span>
                  <ChevronDown size={16} style={{
                    transition: 'transform 200ms ease',
                    transform: profileOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                  }} />
                </button>
                {profileOpen && (
                  <div style={styles.dropdown}>
                    <Link href={getDashboardPath()} style={styles.dropdownItem}>
                      <LayoutDashboard size={16} />
                      Dashboard
                    </Link>
                    <Link href="/profile" style={styles.dropdownItem}>
                      <User size={16} />
                      Profile
                    </Link>
                    <div style={styles.dropdownDivider} />
                    <button
                      onClick={() => signOut({ callbackUrl: '/' })}
                      style={{ ...styles.dropdownItem, ...styles.dropdownButton }}
                    >
                      <LogOut size={16} />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div style={styles.authButtons}>
                <Link href="/login" className="btn btn-outline btn-sm">
                  Sign In
                </Link>
                <Link href="/register" className="btn btn-primary btn-sm">
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            style={styles.hamburger}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {mobileOpen && (
        <div style={styles.mobileOverlay} onClick={() => setMobileOpen(false)}>
          <div style={styles.mobileMenu} onClick={(e) => e.stopPropagation()}>
            <div style={styles.mobileHeader}>
              <Link href="/" style={styles.logo}>
                <div style={styles.logoIcon}>
                  <Heart size={18} fill="white" color="white" />
                </div>
                <span style={styles.logoText}>ElderCare</span>
              </Link>
              <button onClick={() => setMobileOpen(false)} style={styles.mobileClose}>
                <X size={24} />
              </button>
            </div>

            <div style={styles.mobileLinks}>
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  style={{
                    ...styles.mobileLink,
                    ...(isActive(link.href) ? styles.mobileLinkActive : {}),
                  }}
                >
                  {link.label}
                </Link>
              ))}

              {session && (
                <Link
                  href={getDashboardPath()}
                  style={{
                    ...styles.mobileLink,
                    ...(isActive('/dashboard') ? styles.mobileLinkActive : {}),
                  }}
                >
                  Dashboard
                </Link>
              )}
            </div>

            <div style={styles.mobileAuthSection}>
              {session ? (
                <>
                  <div style={styles.mobileUser}>
                    <div style={styles.avatar}>
                      {session.user?.name?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                    <div>
                      <p style={styles.mobileUserName}>{session.user?.name}</p>
                      <p style={styles.mobileUserEmail}>{session.user?.email}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => signOut({ callbackUrl: '/' })}
                    className="btn btn-outline"
                    style={{ width: '100%' }}
                  >
                    <LogOut size={16} />
                    Sign Out
                  </button>
                </>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <Link href="/login" className="btn btn-outline" style={{ width: '100%', justifyContent: 'center' }}>
                    Sign In
                  </Link>
                  <Link href="/register" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                    Get Started
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Spacer for fixed nav */}
      <div style={{ height: 72 }} />
    </>
  );
}

const styles = {
  nav: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    background: 'rgba(250, 250, 249, 0.85)',
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
    borderBottom: '1px solid transparent',
    transition: 'all 250ms ease',
    height: 72,
  },
  navScrolled: {
    borderBottom: '1px solid var(--color-border)',
    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
    background: 'rgba(255, 255, 255, 0.92)',
  },
  container: {
    maxWidth: 1200,
    margin: '0 auto',
    padding: '0 1.5rem',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    textDecoration: 'none',
    color: 'var(--color-text)',
  },
  logoIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    fontSize: '1.375rem',
    fontWeight: 700,
    fontFamily: 'var(--font-heading)',
    color: 'var(--color-text)',
  },
  desktopNav: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.25rem',
  },
  navLink: {
    position: 'relative',
    padding: '0.5rem 1rem',
    fontSize: '0.9375rem',
    fontWeight: 500,
    color: 'var(--color-text-secondary)',
    textDecoration: 'none',
    borderRadius: 'var(--radius-sm)',
    transition: 'all 200ms ease',
  },
  navLinkActive: {
    color: 'var(--color-primary)',
    fontWeight: 600,
  },
  activeIndicator: {
    position: 'absolute',
    bottom: 0,
    left: '50%',
    transform: 'translateX(-50%)',
    width: 20,
    height: 3,
    borderRadius: 2,
    background: 'var(--color-primary)',
  },
  desktopAuth: {
    display: 'flex',
    alignItems: 'center',
  },
  authSkeleton: {
    width: 120,
    height: 36,
    borderRadius: 'var(--radius-sm)',
    background: 'var(--color-bg-secondary)',
    animation: 'pulse 1.5s ease infinite',
  },
  authButtons: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
  },
  profileWrap: {
    position: 'relative',
  },
  profileButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.375rem 0.75rem',
    background: 'var(--color-bg-secondary)',
    border: '1px solid var(--color-border)',
    borderRadius: 'var(--radius-full)',
    cursor: 'pointer',
    fontFamily: 'var(--font-body)',
    fontSize: '0.875rem',
    color: 'var(--color-text)',
    transition: 'all 200ms ease',
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: '50%',
    background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-accent) 100%)',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.875rem',
    fontWeight: 600,
    flexShrink: 0,
  },
  profileName: {
    fontWeight: 500,
    maxWidth: 120,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  dropdown: {
    position: 'absolute',
    top: 'calc(100% + 8px)',
    right: 0,
    width: 200,
    background: 'var(--color-white)',
    border: '1px solid var(--color-border)',
    borderRadius: 'var(--radius-md)',
    boxShadow: 'var(--shadow-lg)',
    padding: '0.5rem',
    animation: 'slideDown 200ms ease',
    zIndex: 1001,
  },
  dropdownItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.625rem',
    padding: '0.625rem 0.75rem',
    fontSize: '0.9rem',
    color: 'var(--color-text)',
    textDecoration: 'none',
    borderRadius: 'var(--radius-sm)',
    transition: 'background 150ms ease',
    width: '100%',
  },
  dropdownButton: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontFamily: 'var(--font-body)',
    color: 'var(--color-error)',
  },
  dropdownDivider: {
    height: 1,
    background: 'var(--color-border)',
    margin: '0.375rem 0',
  },
  hamburger: {
    display: 'none',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: 'var(--color-text)',
    padding: '0.5rem',
  },
  // Mobile menu styles
  mobileOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0, 0, 0, 0.4)',
    zIndex: 1100,
    animation: 'fadeIn 200ms ease',
  },
  mobileMenu: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: '85%',
    maxWidth: 360,
    height: '100%',
    background: 'var(--color-white)',
    boxShadow: '-4px 0 20px rgba(0,0,0,0.1)',
    display: 'flex',
    flexDirection: 'column',
    animation: 'slideInRight 250ms ease',
    overflowY: 'auto',
  },
  mobileHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '1rem 1.5rem',
    borderBottom: '1px solid var(--color-border)',
  },
  mobileClose: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: 'var(--color-text)',
    padding: '0.5rem',
  },
  mobileLinks: {
    padding: '1rem 1.5rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.25rem',
    flex: 1,
  },
  mobileLink: {
    display: 'block',
    padding: '0.875rem 1rem',
    fontSize: '1.0625rem',
    fontWeight: 500,
    color: 'var(--color-text)',
    textDecoration: 'none',
    borderRadius: 'var(--radius-sm)',
    transition: 'all 200ms ease',
  },
  mobileLinkActive: {
    color: 'var(--color-primary)',
    background: 'rgba(13, 148, 136, 0.08)',
    fontWeight: 600,
  },
  mobileAuthSection: {
    padding: '1.5rem',
    borderTop: '1px solid var(--color-border)',
  },
  mobileUser: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    marginBottom: '1rem',
  },
  mobileUserName: {
    fontWeight: 600,
    fontSize: '0.9375rem',
    color: 'var(--color-text)',
  },
  mobileUserEmail: {
    fontSize: '0.8125rem',
    color: 'var(--color-text-secondary)',
  },
};

// Inject CSS for responsive hamburger and mobile menu animation
if (typeof document !== 'undefined') {
  const styleId = 'navbar-responsive-styles';
  if (!document.getElementById(styleId)) {
    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = `
      @keyframes slideInRight {
        from { transform: translateX(100%); }
        to { transform: translateX(0); }
      }
      @media (max-width: 768px) {
        nav [data-desktop-nav] { display: none !important; }
        nav [data-desktop-auth] { display: none !important; }
      }
    `;
    document.head.appendChild(style);
  }
}
