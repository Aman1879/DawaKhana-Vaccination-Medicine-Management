export default function SectionHeading({ title, subtitle, action }) {
  return (
    <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <div className="text-xs uppercase tracking-[0.3em]" style={{ color: 'rgba(0,109,103,0.7)' }}>{subtitle}</div>
        <h2 className="mt-1 text-2xl font-semibold text-white">{title}</h2>
      </div>
      {action ? <div>{action}</div> : null}
    </div>
  );
}
