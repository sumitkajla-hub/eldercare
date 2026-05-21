"use client";

/* ===== Dashboard Layout Component =====
   Provides sidebar navigation on desktop, collapsible sidebar on mobile.
   Handles authentication state with next-auth useSession.
   Redirects unauthenticated users to /login.
*/

import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  CalendarPlus,
  ClipboardList,
  UserCircle,
  LogOut,
  Menu,
  X,
  Heart,
} from "lucide-react";
import "./dashboard.css";

/* Navigation items for the sidebar */
const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/patients", label: "My Patients", icon: Users },
  { href: "/dashboard/book", label: "Book Service", icon: CalendarPlus },
  { href: "/dashboard/bookings", label: "My Bookings", icon: ClipboardList },
  { href: "/dashboard/profile", label: "Profile", icon: UserCircle },
];

export default function DashboardLayout({ children }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  /* Redirect to login if not authenticated */
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  /* Close sidebar when route changes on mobile */
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  /* Get user initials for avatar */
  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  /* Check if nav link is active */
  const isActive = (href) => {
    if (href === "/dashboard") {
      return pathname === "/dashboard";
    }
    return pathname.startsWith(href);
  };

  /* Handle logout */
  const handleLogout = async () => {
    await signOut({ callbackUrl: "/login" });
  };

  /* Show loading state while checking auth */
  if (status === "loading") {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          background: "var(--color-bg)",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              width: 56,
              height: 56,
              border: "4px solid var(--color-border)",
              borderTopColor: "var(--color-primary)",
              borderRadius: "50%",
              animation: "spin 0.8s linear infinite",
              margin: "0 auto 16px",
            }}
          />
          <p
            style={{
              fontSize: 17,
              color: "var(--color-text-secondary)",
              fontFamily: "var(--font-body)",
            }}
          >
            Loading your dashboard...
          </p>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      </div>
    );
  }

  /* Don't render if unauthenticated (redirecting) */
  if (status === "unauthenticated") {
    return null;
  }

  const userName = session?.user?.name || "User";
  const userRole = session?.user?.role || "user";

  return (
    <div className="dashboard-wrapper">
      {/* Mobile Header */}
      <div className="mobile-header">
        <button
          className="mobile-menu-btn"
          onClick={() => setSidebarOpen(true)}
          aria-label="Open menu"
        >
          <Menu size={24} />
        </button>
        <span className="mobile-brand">ElderCare</span>
        <div style={{ width: 44 }} />
      </div>

      {/* Sidebar Overlay (mobile) */}
      <div
        className={`sidebar-overlay ${sidebarOpen ? "show" : ""}`}
        onClick={() => setSidebarOpen(false)}
      />

      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="sidebar-header">
          {/* Brand */}
          <div className="sidebar-brand">
            <div className="sidebar-brand-icon">
              <Heart size={24} />
            </div>
            <span className="sidebar-brand-text">ElderCare</span>
            {/* Mobile close button */}
            <button
              className="mobile-menu-btn"
              onClick={() => setSidebarOpen(false)}
              aria-label="Close menu"
              style={{
                marginLeft: "auto",
                display: sidebarOpen ? "flex" : "none",
                background: "rgba(255,255,255,0.1)",
                color: "#fff",
              }}
            >
              <X size={20} />
            </button>
          </div>

          {/* User info */}
          <div className="sidebar-user">
            <div className="sidebar-avatar">{getInitials(userName)}</div>
            <div className="sidebar-user-info">
              <div className="sidebar-user-name">{userName}</div>
              <div className="sidebar-user-role">{userRole}</div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav">
          <div className="sidebar-nav-label">Menu</div>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <a
                key={item.href}
                href={item.href}
                className={`sidebar-nav-link ${isActive(item.href) ? "active" : ""}`}
                onClick={(e) => {
                  e.preventDefault();
                  router.push(item.href);
                }}
              >
                <Icon size={22} />
                {item.label}
              </a>
            );
          })}
        </nav>

        {/* Footer / Logout */}
        <div className="sidebar-footer">
          <button className="sidebar-logout-btn" onClick={handleLogout}>
            <LogOut size={22} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">{children}</main>
    </div>
  );
}
