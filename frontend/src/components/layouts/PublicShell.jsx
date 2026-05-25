import { Link, Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, Moon, Sun } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import BrandLogo from '../branding/BrandLogo';

export default function PublicShell() {
  const { mode, toggle } = useTheme();

  return (
    <div className="min-h-screen text-slate-100">
      <header className="border-b border-white/10 bg-white/90 backdrop-blur-xl dark:bg-slate-950/75">
        <div className="flex w-full items-center justify-between px-3 py-2 sm:px-5 sm:py-3 lg:px-8">
          <div className="flex min-w-0 flex-1 items-center gap-3">
            <button onClick={toggle} aria-label="Toggle theme" className="rounded-full border border-white/10 bg-white/5 p-2 text-sm text-slate-700 dark:text-white">
              {mode === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
            </button>

            <Link to="/auth" className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/15 px-4 py-2 text-sm text-cyan-300 transition">
              <Sparkles size={16} />
              Launch Console
            </Link>
          </div>

          <Link to="/" className="flex items-center gap-3 font-semibold tracking-wide">
            <BrandLogo compact whiteText={mode === 'dark'} />
          </Link>
        </div>
      </header>
      <motion.main initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
        <Outlet />
      </motion.main>
    </div>
  );
}
