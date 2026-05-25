import { useEffect, useMemo, useState } from 'react';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, RadialBarChart, RadialBar, Legend } from 'recharts';
import { Activity, BarChart3, Clock3, TrendingUp } from 'lucide-react';
import client from '../api/client';
import GlassPanel from '../components/ui/GlassPanel';
import SectionHeading from '../components/ui/SectionHeading';

export default function AnalyticsPage() {
  const [dashboard, setDashboard] = useState(null);

  useEffect(() => {
    let mounted = true;
    client.get('/dashboard/analytics').then(({ data }) => {
      if (mounted) setDashboard(data.data);
    }).catch((error) => console.error(error));
    return () => { mounted = false; };
  }, []);

  const weekly = dashboard?.weekly_trend || [];
  const breakdown = dashboard?.appointment_breakdown || {};
  const summary = dashboard?.summary || {};
  const recent = dashboard?.recent_appointments || [];

  const trendData = useMemo(() => weekly.map((item) => ({
    name: item.name,
    vaccineUsage: item.approved,
    inventoryMovement: item.pending,
    appointments: item.appointments,
  })), [weekly]);

  const radialData = [
    { name: 'Approved', value: breakdown.approved || 0, fill: '#22d3ee' },
    { name: 'Pending', value: breakdown.pending || 0, fill: '#2dd4bf' },
    { name: 'Rejected', value: breakdown.rejected || 0, fill: '#38bdf8' },
  ];

  const totalAppointments = (breakdown.approved || 0) + (breakdown.pending || 0) + (breakdown.rejected || 0) || 1;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-4">
        <GlassPanel><div className="flex items-center justify-between"><div><div className="text-sm text-slate-400">Monthly activity</div><div className="mt-2 text-3xl font-semibold text-white">{summary.appointments ?? 0}</div></div><TrendingUp className="text-cyan-300" /></div></GlassPanel>
        <GlassPanel><div className="flex items-center justify-between"><div><div className="text-sm text-slate-400">Low stock</div><div className="mt-2 text-3xl font-semibold text-white">{summary.low_stock ?? 0}</div></div><BarChart3 className="text-teal-300" /></div></GlassPanel>
        <GlassPanel><div className="flex items-center justify-between"><div><div className="text-sm text-slate-400">Expired</div><div className="mt-2 text-3xl font-semibold text-white">{summary.expired_medicines ?? 0}</div></div><Clock3 className="text-sky-300" /></div></GlassPanel>
        <GlassPanel><div className="flex items-center justify-between"><div><div className="text-sm text-slate-400">Unread alerts</div><div className="mt-2 text-3xl font-semibold text-white">{summary.unread_notifications ?? 0}</div></div><Activity className="text-cyan-300" /></div></GlassPanel>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <GlassPanel>
          <SectionHeading title="Monthly vaccine usage" subtitle="Appointment-driven utilization trends" />
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData}>
                <CartesianGrid stroke="rgba(148,163,184,0.15)" />
                <XAxis dataKey="name" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip contentStyle={{ background: '#020617', border: '1px solid rgba(148,163,184,0.2)', borderRadius: 16 }} />
                <Line type="monotone" dataKey="vaccineUsage" stroke="#22d3ee" strokeWidth={3} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="inventoryMovement" stroke="#2dd4bf" strokeWidth={3} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="appointments" stroke="#38bdf8" strokeWidth={3} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </GlassPanel>

        <GlassPanel>
          <SectionHeading title="Appointment statistics" subtitle="Approval ratios and live mix" />
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
              <ResponsiveContainer width="100%" height={220}>
                <RadialBarChart innerRadius="28%" outerRadius="90%" data={radialData} startAngle={180} endAngle={0}>
                  <RadialBar minAngle={15} background clockWise dataKey="value" />
                  <Legend />
                </RadialBarChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-3">
              {radialData.map((item) => (
                <div key={item.name} className="rounded-3xl border border-white/10 bg-white/5 p-4">
                  <div className="flex items-center justify-between text-sm text-slate-300"><span>{item.name}</span><span>{item.value}</span></div>
                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10"><div className="h-full rounded-full" style={{ width: `${(item.value / totalAppointments) * 100}%`, background: item.fill }} /></div>
                </div>
              ))}
            </div>
          </div>
        </GlassPanel>
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <GlassPanel>
          <SectionHeading title="Expiry tracking" subtitle="Attention list for stock rotation" />
          <div className="space-y-3 text-sm text-slate-300">
            {(dashboard?.low_stock || []).slice(0, 5).map((item) => (
              <div key={`${item.id}-${item.name}`} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="font-semibold text-white">{item.name}</div>
                <div className="text-slate-400">Stock {item.stock} · Expiry {item.expiry_date || 'N/A'}</div>
              </div>
            ))}
          </div>
        </GlassPanel>

        <GlassPanel>
          <SectionHeading title="Appointment timeline" subtitle="Most recent visits and approvals" />
          <div className="space-y-3">
            {recent.map((item) => (
              <div key={item.id} className="rounded-3xl border border-white/10 bg-white/5 p-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <div className="text-white">#{item.id} · {item.time_slot}</div>
                    <div className="text-sm text-slate-400">{new Date(item.appointment_date).toLocaleDateString()}</div>
                  </div>
                  <div className="rounded-full border border-white/10 px-3 py-1 text-xs capitalize text-cyan-100">{item.status}</div>
                </div>
              </div>
            ))}
          </div>
        </GlassPanel>
      </div>
    </div>
  );
}
