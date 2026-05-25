import { useMemo, useState } from 'react';

function getMonthMatrix(year, month) {
  const first = new Date(year, month, 1);
  const startDay = first.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const matrix = [];
  let week = new Array(7).fill(null);
  let day = 1;

  // fill first week
  for (let i = startDay; i < 7; i++) {
    week[i] = day++;
  }
  matrix.push(week);

  while (day <= daysInMonth) {
    week = new Array(7).fill(null);
    for (let i = 0; i < 7 && day <= daysInMonth; i++) {
      week[i] = day++;
    }
    matrix.push(week);
  }

  return matrix;
}

export default function Calendar({ appointments = [], onSelectDate }) {
  const today = new Date();
  const [date, setDate] = useState({ year: today.getFullYear(), month: today.getMonth() });

  const matrix = useMemo(() => getMonthMatrix(date.year, date.month), [date]);

  const counts = useMemo(() => {
    const map = {};
    appointments.forEach((a) => {
      const d = a.appointment_date?.slice(0, 10);
      if (!d) return;
      map[d] = (map[d] || 0) + 1;
    });
    return map;
  }, [appointments]);

  const prev = () => setDate((d) => ({ year: d.month === 0 ? d.year - 1 : d.year, month: d.month === 0 ? 11 : d.month - 1 }));
  const next = () => setDate((d) => ({ year: d.month === 11 ? d.year + 1 : d.year, month: d.month === 11 ? 0 : d.month + 1 }));

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
      <div className="mb-2 flex items-center justify-between">
        <button onClick={prev} className="text-sm text-slate-300">‹</button>
        <div className="text-sm font-semibold text-white">{new Date(date.year, date.month).toLocaleString(undefined, { month: 'long', year: 'numeric' })}</div>
        <button onClick={next} className="text-sm text-slate-300">›</button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-xs text-slate-400">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
          <div key={d} className="text-center">{d}</div>
        ))}
      </div>

      <div className="mt-2 grid grid-cols-7 gap-1">
        {matrix.map((week, wi) => (
          week.map((day, di) => {
            const key = day ? `${date.year}-${String(date.month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}` : null;
            const count = key ? counts[key] || 0 : 0;
            return (
              <button
                key={`${wi}-${di}`}
                onClick={() => day && onSelectDate && onSelectDate(key)}
                className={`h-10 rounded-lg p-1 text-center ${day ? 'bg-white/3 text-white' : 'text-slate-500'} relative`}
                disabled={!day}
              >
                <div className="text-sm">{day || ''}</div>
                {count > 0 && <div className="absolute right-1 top-1 rounded-full px-2 text-[10px] font-medium text-slate-900" style={{ backgroundColor: 'var(--primary)' }}>{count}</div>}
              </button>
            );
          })
        ))}
      </div>
    </div>
  );
}
