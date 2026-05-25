export default function GlassPanel({ children, className = '' }) {
  return <div className={`glass rounded-3xl border border-white/10 p-5 shadow-glow ${className}`}>{children}</div>;
}
