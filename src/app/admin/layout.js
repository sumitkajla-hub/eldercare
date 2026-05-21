'use client';
import { useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { LayoutDashboard, Users, ShieldCheck, Package, Calendar, BarChart3, LogOut, Menu, X, Settings } from 'lucide-react';
import './admin.css';

const navItems = [
  { href: '/admin', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
  { href: '/admin/caregivers', icon: <ShieldCheck size={20} />, label: 'Caregivers' },
  { href: '/admin/users', icon: <Users size={20} />, label: 'Users' },
  { href: '/admin/services', icon: <Package size={20} />, label: 'Services' },
  { href: '/admin/bookings', icon: <Calendar size={20} />, label: 'Bookings' },
  { href: '/admin/analytics', icon: <BarChart3 size={20} />, label: 'Analytics' },
];

export default function AdminLayout({ children }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (status === 'loading') return <div style={{ padding: '3rem', textAlign: 'center' }}>Loading...</div>;
  if (status === 'unauthenticated' || session?.user?.role !== 'admin') {
    router.push('/login');
    return null;
  }

  return (
    <div className="admin-layout">
      <button className="admin-menu-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
        {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>
      <aside className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="admin-sidebar-header">
          <Settings size={24} />
          <div>
            <h3 className="admin-sidebar-title">Admin Panel</h3>
            <p className="admin-sidebar-subtitle">{session?.user?.name}</p>
          </div>
        </div>
        <nav className="admin-nav">
          {navItems.map(item => (
            <Link key={item.href} href={item.href} className={`admin-nav-link ${pathname === item.href ? 'active' : ''}`} onClick={() => setSidebarOpen(false)}>
              {item.icon} {item.label}
            </Link>
          ))}
        </nav>
        <button className="admin-logout" onClick={() => signOut({ callbackUrl: '/' })}>
          <LogOut size={20} /> Logout
        </button>
      </aside>
      <main className="admin-main">{children}</main>
    </div>
  );
}
