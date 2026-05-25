import { Link } from 'react-router-dom';
import { Bell, CalendarDays, PackageSearch, ShieldCheck } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import StatCard from '../components/ui/StatCard';
import SectionHeading from '../components/ui/SectionHeading';
import GlassPanel from '../components/ui/GlassPanel';
import client from '../api/client';
import { useAuth } from '../context/AuthContext';
import ControlCenterScene from '../components/three/ControlCenterScene';

export default function UserDashboardPage() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [vaccines, setVaccines] = useState([]);
  const [ointments, setOintments] = useState([]);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const [apptsRes, vacRes, ointRes, notifRes] = await Promise.all([
          client.get('/appointments'),
          client.get('/vaccines'),
          client.get('/ointments'),
          client.get('/notifications'),
        ]);

        if (!mounted) return;
        setAppointments(apptsRes.data.data || []);
        setVaccines(vacRes.data.data || []);
        setOintments(ointRes.data.data || []);
        setNotifications(notifRes.data.data || []);
      } catch (error) {
        console.error(error);
      }
    };

    load();
    return () => { mounted = false; };
  }, []);

  const upcoming = useMemo(() => appointments.filter((a) => new Date(a.appointment_date) >= new Date()).slice(0, 5), [appointments]);
  const unread = useMemo(() => notifications.filter((n) => !n.read_status).length, [notifications]);
  const lowStock = useMemo(() => [...vaccines, ...ointments].filter((i) => (i.stock || 0) < 40).length, [vaccines, ointments]);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-4">
        <StatCard label="Upcoming appointments" value={upcoming.length} hint="Next scheduled visits" accent="cyan" />
        <StatCard label="Vaccination status" value={user?.vaccination_status || 'Unknown'} hint="Primary series & boosters" accent="teal" />
        <StatCard label="Medicine availability" value={`${(vaccines.length + ointments.length) || 0}`} hint="Total tracked items" accent="blue" />
        <StatCard label="Unread reminders" value={unread} hint="Action required" accent="cyan" />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
        <GlassPanel>
          <SectionHeading title="My upcoming appointments" subtitle="Manage bookings" action={<Link to="/appointments" className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-sm text-cyan-100">Book appointment</Link>} />
          <div className="space-y-3 mt-4">
            {upcoming.map((item) => (
              <div key={item.id} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-white font-semibold">{item.title || `Appointment #${item.id}`}</div>
                    <div className="text-sm text-slate-400">{new Date(item.appointment_date).toLocaleDateString()} · {item.time_slot}</div>
                  </div>
                  <div className="text-sm text-slate-300">{item.status}</div>
                </div>
              </div>
            ))}
            {!upcoming.length && <div className="text-sm text-slate-400">No upcoming appointments.</div>}
          </div>
        </GlassPanel>

        <div className="space-y-6">
          <GlassPanel>
            <SectionHeading title="Health snapshot" subtitle="Quick health metrics" />
            <div className="space-y-3">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="text-sm text-slate-300">Medicine low-stock alerts</div>
                <div className="mt-2 text-2xl font-semibold text-white">{lowStock}</div>
              </div>

              <ControlCenterScene />
            </div>
          </GlassPanel>

          <GlassPanel>
            <SectionHeading title="Quick actions" subtitle="Navigate" />
            <div className="space-y-3">
              <Link to="/appointments" className="block rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200">Book appointment</Link>
              <Link to="/notifications" className="block rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200">View notifications</Link>
              <Link to="/profile" className="block rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200">Update profile</Link>
            </div>
          </GlassPanel>
        </div>
      </div>
    </div>
  );
}
