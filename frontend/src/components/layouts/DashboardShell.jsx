import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Bell, CalendarDays, Home, LogOut, Menu, UserCircle2, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import BrandLogo from '../branding/BrandLogo';
import { useState } from 'react';

const navItems = [
  { to: '/user', label: 'Overview', icon: Home },
  { to: '/appointments', label: 'Appointments', icon: CalendarDays },
  { to: '/notifications', label: 'Notifications', icon: Bell },
  { to: '/profile', label: 'Profile', icon: UserCircle2 },
];

const userFooterLinks = [
  { to: '/user', label: 'Overview' },
  { to: '/appointments', label: 'My Appointments' },
  { to: '/notifications', label: 'Notifications' },
  { to: '/profile', label: 'Profile Settings' },
];

export default function DashboardShell() {
  const { user, logout } = useAuth();
  const { mode } = useTheme();
  const isDark = mode === 'dark';
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="app-shell app-shell-bg min-h-screen" style={{ color: isDark ? '#e2e8f0' : '#0f172a' }}>
      <div className="flex min-h-screen w-full flex-col gap-6 p-0">
        <header className="border-b border-white/10 bg-white/90 px-3 py-2 shadow-glow backdrop-blur-xl dark:bg-slate-950/75 sm:px-5 sm:py-3 lg:px-8">
          <div className="flex items-center justify-between gap-3">
            <div className="flex min-w-0 flex-1 items-center gap-2">
              <button
                onClick={() => setMobileOpen((value) => !value)}
                aria-label={mobileOpen ? 'Close user navigation' : 'Open user navigation'}
                className="rounded-full border border-white/10 bg-white/5 p-2 lg:hidden"
                style={{ color: 'var(--primary)' }}
              >
                {mobileOpen ? <X size={16} /> : <Menu size={16} />}
              </button>

              <nav className="hidden min-w-0 flex-1 flex-nowrap items-center gap-2 overflow-x-auto pb-1 lg:flex">
                {navItems.map(({ to, label, icon: Icon }) => (
                  <NavLink
                    key={to}
                    to={to}
                    className={({ isActive }) => [
                      'inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm whitespace-nowrap transition',
                      isActive
                        ? 'border-cyan-400/20 bg-cyan-400/15 text-cyan-300'
                        : 'border-white/10 bg-white/5 text-slate-700 hover:bg-white/10 dark:text-slate-300',
                    ].join(' ')}
                  >
                    <Icon size={15} />
                    {label}
                  </NavLink>
                ))}
                <button
                  type="button"
                  onClick={handleLogout}
                  className="inline-flex items-center gap-2 rounded-full border border-rose-400/20 bg-rose-400/10 px-3 py-1.5 text-sm whitespace-nowrap text-rose-700 dark:text-rose-100 transition hover:bg-rose-400/20"
                >
                  <LogOut size={15} />
                  Sign out
                </button>
              </nav>
            </div>

            <div className="flex items-center gap-2">
              <div className="hidden rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-[11px] text-emerald-800 dark:text-emerald-100 xl:block">{user?.name || 'Command Center'} • {user?.role || 'guest'}</div>
              <BrandLogo compact whiteText={isDark} />
            </div>
          </div>

          {mobileOpen && (
            <nav className="mt-2 grid gap-2 lg:hidden">
              {navItems.map(({ to, label, icon: Icon }) => (
                <NavLink
                  key={to}
                  to={to}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) => [
                    'inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm transition',
                    isActive
                      ? 'border-cyan-400/20 bg-cyan-400/15 text-cyan-300'
                      : 'border-white/10 bg-white/5 text-slate-300 hover:bg-white/10',
                  ].join(' ')}
                >
                  <Icon size={15} />
                  {label}
                </NavLink>
              ))}
              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex items-center gap-2 rounded-xl border border-rose-400/20 bg-rose-400/10 px-3 py-2 text-sm text-rose-700 dark:text-rose-100 transition hover:bg-rose-400/20"
              >
                <LogOut size={15} />
                Sign out
              </button>
            </nav>
          )}
        </header>

        <section className="app-shell-surface min-h-0 flex-1 overflow-hidden rounded-none shadow-glow">
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.45 }} className="p-4 sm:p-6 lg:p-8">
            <Outlet />
          </motion.div>
        </section>

        <footer className="border-t border-white/10 bg-white/85 px-4 py-6 text-sm text-slate-700 dark:bg-slate-950/75 dark:text-slate-300 sm:px-6 lg:px-8">
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-300">DawaKhana</div>
              <div className="mt-2 font-medium text-slate-900 dark:text-white">User Care Dashboard</div>
              <p className="mt-2 text-xs leading-6 text-slate-600 dark:text-slate-400">
                Manage your profile, appointments, reminders, and personal healthcare records in one place.
              </p>
            </div>

            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-300">Quick Links</div>
              <div className="mt-2 space-y-1 text-xs text-slate-600 dark:text-slate-400">
                {userFooterLinks.map((link) => (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    className="block transition hover:text-cyan-300"
                  >
                    {link.label}
                  </NavLink>
                ))}
              </div>
            </div>

            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-300">Support</div>
              <div className="mt-2 space-y-1 text-xs text-slate-600 dark:text-slate-400">
                <div>Email: care@dawakhana.local</div>
                <div>Phone: +91 90000 00000</div>
                <div>Helpdesk: Mon-Sat, 9:00-18:00</div>
              </div>
            </div>

            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-300">Safety</div>
              <div className="mt-2 space-y-1 text-xs text-slate-600 dark:text-slate-400">
                <div>Privacy Protected Records</div>
                <div>Secure Login Sessions</div>
                <div>Trusted Appointment Updates</div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-2 border-t border-white/10 pt-3 text-[11px] text-slate-500 dark:text-slate-400">
            <div>© {new Date().getFullYear()} DawaKhana. All rights reserved.</div>
            <div>Version 1.0.0 • Smart Vaccine & Ointment Management System</div>
          </div>
        </footer>
      </div>
    </div>
  );
}
