import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Activity, AlertTriangle, Bell, CalendarCheck2, FlaskConical, Gauge, Package2, Users } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import client from '../api/client';
import GlassPanel from '../components/ui/GlassPanel';
import SectionHeading from '../components/ui/SectionHeading';
import StatCard from '../components/ui/StatCard';
import ControlCenterScene from '../components/three/ControlCenterScene';
import { AppointmentChart } from './charts';

const pieColors = ['#22d3ee', '#2dd4bf', '#38bdf8'];

function MetricPill({ icon: Icon, label, value, tone = 'cyan' }) {
  const tones = {
    cyan: 'from-[rgba(0,109,103,0.2)] to-[rgba(0,109,103,0.05)] text-[var(--primary)]',
    teal: 'from-teal-400/20 to-teal-400/5 text-teal-100',
    blue: 'from-sky-400/20 to-sky-400/5 text-sky-100',
    rose: 'from-rose-400/20 to-rose-400/5 text-rose-100',
  };

  return (
      <motion.div whileHover={{ y: -4 }} className={`rounded-3xl border border-white/10 bg-gradient-to-br p-4 ${tones[tone]}`}>
      <div className="flex items-center justify-between gap-4">
        <div>
          <div className="text-[11px] uppercase tracking-[0.35em] text-slate-400">{label}</div>
          <div className="mt-2 text-2xl font-semibold text-white">{value}</div>
        </div>
        <Icon size={18} className="text-[var(--primary)]" />
      </div>
    </motion.div>
  );
}

export default function AdminDashboardPage() {
  const [dashboard, setDashboard] = useState(null);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const { data } = await client.get('/dashboard/analytics');
        if (mounted) setDashboard(data.data);
      } catch (error) {
        console.error(error);
      }
    };
    load();

    const id = setInterval(load, 15000);
    return () => { mounted = false; clearInterval(id); };
  }, []);

  const summary = dashboard?.summary || {};
  const weeklyTrend = dashboard?.weekly_trend || [];
  const inventory = dashboard?.inventory || [];
  const recentAppointments = dashboard?.recent_appointments || [];
  const appointmentBreakdown = dashboard?.appointment_breakdown || {};

  const chartData = useMemo(() => weeklyTrend.map((item) => ({
    name: item.name,
    vaccines: item.approved,
    ointments: item.pending,
    appointments: item.appointments,
  })), [weeklyTrend]);

  const inventoryPie = useMemo(() => [
    { name: 'Vaccines', value: summary.vaccines || 0 },
    { name: 'Ointments', value: summary.ointments || 0 },
    { name: 'Medicines', value: summary.medicines || 0 },
  ], [summary]);

  return (
    <div className="space-y-6">
      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="space-y-6">
          <GlassPanel className="overflow-hidden p-0">
            <div className="grid gap-0 lg:grid-cols-[1fr_0.95fr]">
              <div className="p-6 sm:p-7">
                <div className="inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs uppercase tracking-[0.35em]" style={{ borderColor: 'rgba(0,109,103,0.2)', backgroundColor: 'rgba(0,109,103,0.08)', color: 'var(--primary)' }}>
                  <Gauge size={14} /> Live operating room
                </div>
                <h2 className="mt-5 max-w-2xl text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                  Healthcare control center for inventory, appointments, and alerts.
                </h2>
                <p className="mt-4 max-w-xl text-sm leading-7 text-slate-300 sm:text-base">
                  Monitor vaccines, ointments, patient appointments, and broadcast alerts from a single immersive dashboard with live API data.
                </p>

                <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                  <MetricPill icon={FlaskConical} label="Vaccines" value={summary.vaccines ?? 0} tone="cyan" />
                  <MetricPill icon={Package2} label="Ointments" value={summary.ointments ?? 0} tone="teal" />
                  <MetricPill icon={Users} label="Users" value={summary.users ?? 0} tone="blue" />
                  <MetricPill icon={CalendarCheck2} label="Today" value={summary.today_appointments ?? 0} tone="rose" />
                </div>
              </div>
              <ControlCenterScene />
            </div>
          </GlassPanel>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <StatCard label="Low stock alerts" value={summary.low_stock ?? 0} hint="Items below threshold" accent="cyan" />
            <StatCard label="Expired medicines" value={summary.expired_medicines ?? 0} hint="Expired or overdue items" accent="teal" />
            <StatCard label="Pending appointments" value={summary.pending_appointments ?? 0} hint="Awaiting review" accent="blue" />
            <StatCard label="Unread notifications" value={summary.unread_notifications ?? 0} hint="Requires attention" accent="cyan" />
          </div>

          <GlassPanel>
            <SectionHeading title="Weekly appointment activity" subtitle="Live trend from backend" />
            <AppointmentChart data={chartData} />
          </GlassPanel>
        </div>

        <div className="space-y-6">
          <GlassPanel>
            <SectionHeading title="Inventory mix" subtitle="3D-ready category visualization" />
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={inventoryPie} dataKey="value" nameKey="name" innerRadius={68} outerRadius={110} paddingAngle={4}>
                    {inventoryPie.map((entry, index) => <Cell key={entry.name} fill={pieColors[index % pieColors.length]} />)}
                  </Pie>
                  <Tooltip contentStyle={{ background: '#020617', border: '1px solid rgba(148,163,184,0.2)', borderRadius: 16 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </GlassPanel>

          <GlassPanel>
            <SectionHeading title="Attention queue" subtitle="Low stock and expiry warnings" />
            <div className="space-y-3">
              {(dashboard?.low_stock || []).slice(0, 5).map((item) => (
                <div key={`${item.name}-${item.id}`} className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                  <div>
                    <div className="font-semibold text-white">{item.name}</div>
                    <div className="text-xs text-slate-400">Stock {item.stock}</div>
                  </div>
                  <AlertTriangle size={18} className="text-amber-300" />
                </div>
              ))}
              {!dashboard?.low_stock?.length && <div className="text-sm text-slate-400">No low stock warnings right now.</div>}
            </div>
          </GlassPanel>

          <GlassPanel>
            <SectionHeading title="Appointment snapshot" subtitle="Recent requests" />
            <div className="space-y-3">
              {recentAppointments.map((appointment) => (
                <div key={appointment.id} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <div className="text-white">#{appointment.id} · {appointment.time_slot}</div>
                      <div className="text-sm text-slate-400">{new Date(appointment.appointment_date).toLocaleDateString()}</div>
                    </div>
                    <div className="rounded-full border border-white/10 px-3 py-1 text-xs capitalize" style={{ color: 'var(--primary)' }}>{appointment.status}</div>
                  </div>
                </div>
              ))}
            </div>
          </GlassPanel>

          <GlassPanel>
            <SectionHeading title="Breakdown" subtitle="Approvals at a glance" />
            <div className="grid gap-3 sm:grid-cols-3">
              <MetricPill icon={Activity} label="Approved" value={appointmentBreakdown.approved ?? 0} tone="cyan" />
              <MetricPill icon={CalendarCheck2} label="Pending" value={appointmentBreakdown.pending ?? 0} tone="teal" />
              <MetricPill icon={Bell} label="Rejected" value={appointmentBreakdown.rejected ?? 0} tone="rose" />
            </div>
          </GlassPanel>
        </div>
      </div>

      <GlassPanel>
        <SectionHeading title="Inventory telemetry" subtitle="All tracked stock items" />
        <div className="grid gap-3 lg:grid-cols-2 xl:grid-cols-3">
          {inventory.slice(0, 6).map((item) => (
            <div key={`${item.name}-${item.id}`} className="rounded-3xl border border-white/10 bg-white/5 p-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <div className="font-semibold text-white">{item.name}</div>
                  <div className="text-sm text-slate-400">Expiry: {item.expiry_date || 'N/A'}</div>
                </div>
                <div className="rounded-full px-3 py-1 text-xs" style={{ backgroundColor: 'rgba(0,109,103,0.08)', color: 'var(--primary)' }}>{item.stock} units</div>
              </div>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
                <div className="h-full rounded-full" style={{ width: `${Math.min(100, (item.stock / 150) * 100)}%`, backgroundImage: 'linear-gradient(90deg, rgba(0,109,103,0.9), rgba(45,212,191,0.9))' }} />
              </div>
            </div>
          ))}
        </div>
      </GlassPanel>
    </div>
  );
}
