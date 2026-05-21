'use client';

import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  LayoutDashboard,
  Bell,
  CalendarDays,
  ClipboardList,
  DollarSign,
  UserCircle,
  LogOut,
  Menu,
  X,
  ShieldCheck,
  AlertTriangle,
} from 'lucide-react';
import './caregiver.css';

/* ----------------------------------------------------------------
   Navigation items for the caregiver sidebar
   ---------------------------------------------------------------- */
const NAV_ITEMS = [
  { href: '/caregiver', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/caregiver/requests', label: 'Service Requests', icon: Bell },
  { href: '/caregiver/schedule', label: 'My Schedule', icon: CalendarDays },
  { href: '/caregiver/bookings', label: 'My Bookings', icon: ClipboardList },
  { href: '/caregiver/earnings', label: 'Earnings', icon: DollarSign },
  { href: '/caregiver/profile', label: 'Profile', icon: UserCircle },
];

/* ================================================================
   CaregiverLayout – wraps every /caregiver/* page
   ================================================================ */
export default function CaregiverLayout({ children }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [caregiverData, setCaregiverData] = useState(null);

  /* ---------- Auth guard ---------- */
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (status === 'authenticated' && session?.user?.role !== 'caregiver') {
      router.push('/login');
    }
  }, [status, session, router]);

  /* ---------- Fetch caregiver profile data ---------- */
  useEffect(() => {
    if (session?.user?.caregiverId) {
      fetch(`/api/caregivers/${session.user.caregiverId}`)
        .then((r) => r.json())
        .then((data) => {
          if (data && !data.error) setCaregiverData(data);
        })
        .catch(() => {});
    }
  }, [session]);

  /* ---------- Close sidebar on route change (mobile) ---------- */
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  /* ---------- Loading / unauthenticated ---------- */
  if (status === 'loading') {
    return (
      <div className="cg-loading" style={{ minHeight: '100vh' }}>
        <div className="cg-spinner" />
        <p className="cg-loading-text">Loading your dashboard…</p>
      </div>
    );
  }

  if (status === 'unauthenticated' || session?.user?.role !== 'caregiver') {
    return null;
  }

  /* ---------- Helpers ---------- */
  const userName = session.user.name || 'Caregiver';
  const initials = userName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
  const isVerified = caregiverData?.isVerified === true;

  const isActive = (href) => {
    if (href === '/caregiver') return pathname === '/caregiver';
    return pathname.startsWith(href);
  };

  /* ---------- Render ---------- */
  return (
    <div className="cg-layout">
      {/* Mobile header */}
      <div className="cg-mobile-header">
        <button
          className="cg-hamburger"
          onClick={() => setSidebarOpen(true)}
          aria-label="Open menu"
        >
          <Menu size={24} />
        </button>
        <span className="cg-mobile-title">ElderCare</span>
        <div style={{ width: 44 }} />
      </div>

      {/* Overlay for mobile */}
      <div
        className={`cg-sidebar-overlay ${sidebarOpen ? 'visible' : ''}`}
        onClick={() => setSidebarOpen(false)}
      />

      {/* Sidebar */}
      <aside className={`cg-sidebar ${sidebarOpen ? 'open' : ''}`}>
        {/* Close button (mobile) */}
        <div
          style={{
            display: 'none',
            justifyContent: 'flex-end',
            padding: '12px 12px 0',
          }}
          className="cg-sidebar-close-wrapper"
        >
          <button
            className="cg-hamburger"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close menu"
            style={{ background: 'rgba(255,255,255,0.1)', color: '#fff' }}
          >
            <X size={22} />
          </button>
        </div>

        {/* Profile */}
        <div className="cg-sidebar-profile">
          <div className="cg-sidebar-avatar">{initials}</div>
          <div className="cg-sidebar-name">{userName}</div>
          <div className="cg-sidebar-role">Caregiver</div>
          {caregiverData && (
            isVerified ? (
              <div className="cg-verified-badge">
                <ShieldCheck size={14} /> Verified
              </div>
            ) : (
              <div className="cg-unverified-badge">
                <AlertTriangle size={14} /> Pending Verification
              </div>
            )
          )}
        </div>

        {/* Nav links */}
        <nav className="cg-sidebar-nav">
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={`cg-nav-link ${isActive(href) ? 'active' : ''}`}
            >
              <Icon size={20} />
              {label}
            </Link>
          ))}

          <div className="cg-nav-spacer" />

          <button
            className="cg-nav-link logout"
            onClick={() => signOut({ callbackUrl: '/login' })}
          >
            <LogOut size={20} />
            Logout
          </button>
        </nav>
      </aside>

      {/* Main content */}
      <main className="cg-main">{children}</main>

      {/* Inline style to show close button on mobile */}
      <style>{`
        @media (max-width: 768px) {
          .cg-sidebar-close-wrapper {
            display: flex !important;
          }
        }
      `}</style>
    </div>
  );
}
