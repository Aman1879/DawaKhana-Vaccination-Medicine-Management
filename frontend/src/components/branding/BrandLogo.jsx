export default function BrandLogo({ compact = false, className = '', whiteText = false }) {
  const sizeClass = compact ? 'w-10 h-10' : 'w-12 h-12 sm:w-14 sm:h-14';

  return (
    <div className={`inline-flex items-center gap-3 ${className}`.trim()} aria-label="DawaKhana logo">
      <div className={`${sizeClass} rounded-full overflow-hidden flex items-center justify-center`} style={{ border: '2px solid rgba(0,109,103,0.12)' }}>
        <img src="/assets/logo.png" alt="DawaKhana logo" className="w-full h-full object-cover" />
      </div>

      {!compact && (
        <div className="leading-none">
          <div className={`text-[1.65rem] font-semibold tracking-tight ${whiteText ? 'text-white' : 'text-slate-900 dark:text-white'}`} style={{ fontFamily: 'Georgia, Times New Roman, serif' }}>
            Dawakhana
          </div>
          <div className={`mt-2 text-[0.78rem] uppercase tracking-[0.35em] ${whiteText ? 'text-white' : 'text-slate-600 dark:text-slate-300'}`}>
            Vaccine Inventory
          </div>
        </div>
      )}
    </div>
  );
}