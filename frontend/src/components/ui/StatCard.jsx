import { motion } from 'framer-motion';

export default function StatCard({ label, value, hint, accent = 'cyan' }) {
  const accentClasses = {
    cyan: 'from-[rgba(0,109,103,0.25)] to-[rgba(0,109,103,0.05)] text-[var(--primary)]',
    teal: 'from-teal-400/25 to-teal-400/5 text-teal-100',
    blue: 'from-sky-400/25 to-sky-400/5 text-sky-100',
  };

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ type: 'spring', stiffness: 240, damping: 18 }}
      className={`glass rounded-3xl bg-gradient-to-br p-5 shadow-glow ${accentClasses[accent]}`}
    >
      <div className="text-sm text-slate-400">{label}</div>
      <div className="mt-3 text-3xl font-semibold tracking-tight">{value}</div>
      <div className="mt-2 text-sm text-slate-400">{hint}</div>
    </motion.div>
  );
}
