import { useEffect, useMemo, useState } from 'react';
import { CalendarDays, CheckCircle2, Clock3, Filter, PencilLine, RefreshCcw, XCircle } from 'lucide-react';
import Calendar from '../components/ui/Calendar';
import toast from 'react-hot-toast';
import client from '../api/client';
import { useAuth } from '../context/AuthContext';
import GlassPanel from '../components/ui/GlassPanel';
import SectionHeading from '../components/ui/SectionHeading';

const slotOptions = ['09:00 - 09:30', '10:00 - 10:30', '11:00 - 11:30', '14:00 - 14:30'];

export default function AppointmentsPage() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('');
  const [editing, setEditing] = useState(null);
  const [booking, setBooking] = useState({ appointment_date: '', time_slot: slotOptions[0], notes: '' });

  const loadAppointments = async () => {
    try {
      const { data } = await client.get('/appointments');
      setAppointments(data.data || []);
    } catch (error) {
      console.error(error);
      toast.error('Unable to load appointments');
    }
  };

  useEffect(() => {
    loadAppointments();
  }, []);

  const filteredAppointments = useMemo(() => appointments.filter((item) => {
    if (statusFilter !== 'all' && item.status !== statusFilter) return false;
    if (dateFilter && item.appointment_date.slice(0, 10) !== dateFilter) return false;
    return true;
  }), [appointments, statusFilter, dateFilter]);

  const saveStatus = async (id, payload) => {
    try {
      await client.put(`/appointments/${id}`, payload);
      toast.success('Appointment updated');
      loadAppointments();
      setEditing(null);
    } catch (error) {
      console.error(error);
      toast.error('Unable to update appointment');
    }
  };

  const cancelAppointment = async (id) => {
    if (!confirm('Cancel this appointment?')) return;
    try {
      await saveStatus(id, { status: 'cancelled' });
      toast.success('Appointment cancelled');
    } catch (error) {
      console.error(error);
      toast.error('Unable to cancel appointment');
    }
  };

  const createAppointment = async () => {
    try {
      await client.post('/appointments', booking);
      toast.success('Appointment requested');
      setBooking({ appointment_date: '', time_slot: slotOptions[0], notes: '' });
      loadAppointments();
    } catch (error) {
      console.error(error);
      toast.error('Unable to book appointment');
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <GlassPanel>
          <SectionHeading title="Appointment studio" subtitle="Book or reschedule a visit" />
          <div className="space-y-4">
            <label className="block">
              <span className="mb-2 block text-sm text-slate-300">Date</span>
              <input type="date" value={booking.appointment_date} onChange={(e) => setBooking({ ...booking, appointment_date: e.target.value })} className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white" />
            </label>
            <label className="block">
              <span className="mb-2 block text-sm text-slate-300">Time slot</span>
              <select value={booking.time_slot} onChange={(e) => setBooking({ ...booking, time_slot: e.target.value })} className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white">
                {slotOptions.map((slot) => <option key={slot} value={slot}>{slot}</option>)}
              </select>
            </label>
            <label className="block">
              <span className="mb-2 block text-sm text-slate-300">Notes</span>
              <textarea rows="4" value={booking.notes} onChange={(e) => setBooking({ ...booking, notes: e.target.value })} className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white" placeholder="Vaccination or follow-up notes" />
            </label>
            <button onClick={createAppointment} className="inline-flex items-center gap-2 rounded-full bg-cyan-400 px-5 py-3 font-medium text-slate-950">
              <CalendarDays size={18} /> Request appointment
            </button>
          </div>
        </GlassPanel>

        <GlassPanel>
          <SectionHeading title="Operations queue" subtitle="Approve, reject, and reschedule" />

          <div className="mb-4 grid gap-3 md:flex md:items-center md:gap-3">
            <div className="md:w-56">
              <Calendar appointments={appointments} onSelectDate={(d) => setDateFilter(d)} />
            </div>

            <div className="flex flex-wrap items-center gap-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200">
              <Filter size={16} />
              <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="border-0 bg-transparent p-0 text-sm text-slate-200 focus:ring-0">
                <option value="all">All statuses</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
            <input type="date" value={dateFilter} onChange={(e) => setDateFilter(e.target.value)} className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white" />
            <button onClick={loadAppointments} className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200"><RefreshCcw size={16} /> Refresh</button>
            </div>
          </div>

          <div className="space-y-3">
            {filteredAppointments.map((appointment) => (
              <div key={appointment.id} className="rounded-3xl border border-white/10 bg-white/5 p-4">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                      <div className="text-lg font-semibold text-white">Appointment #{appointment.id}</div>
                      <div className="mt-1 flex items-center gap-2 text-sm text-slate-400"><Clock3 size={16} /> {new Date(appointment.appointment_date).toLocaleDateString()} · {appointment.time_slot}</div>
                      <div className="mt-2 text-sm text-slate-400">Booked by: {appointment.user?.name || `#${appointment.user_id}`}</div>
                    </div>
                  <div className="rounded-full border border-white/10 px-3 py-1 text-xs capitalize text-cyan-100">{appointment.status}</div>
                </div>

                {editing?.id === appointment.id && (
                  <div className="mt-4 grid gap-3 md:grid-cols-3">
                    <input type="date" value={editing.appointment_date} onChange={(e) => setEditing({ ...editing, appointment_date: e.target.value })} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white" />
                    <select value={editing.time_slot} onChange={(e) => setEditing({ ...editing, time_slot: e.target.value })} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white">
                      {slotOptions.map((slot) => <option key={slot} value={slot}>{slot}</option>)}
                    </select>
                    <select value={editing.status} onChange={(e) => setEditing({ ...editing, status: e.target.value })} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white">
                      <option value="pending">Pending</option>
                      <option value="approved">Approved</option>
                      <option value="rejected">Rejected</option>
                    </select>
                    <div className="md:col-span-3 flex gap-2">
                      <button onClick={() => saveStatus(appointment.id, { ...editing })} className="rounded-full bg-teal-400 px-4 py-2 text-sm font-medium text-slate-950">Save changes</button>
                      <button onClick={() => setEditing(null)} className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200">Cancel</button>
                    </div>
                  </div>
                )}

                <div className="mt-4 flex flex-wrap gap-3">
                  {user?.role === 'admin' && editing?.id !== appointment.id && (
                    <>
                      <button onClick={() => saveStatus(appointment.id, { status: 'approved' })} className="inline-flex items-center gap-2 rounded-full border border-teal-400/20 bg-teal-400/10 px-4 py-2 text-sm text-teal-100"><CheckCircle2 size={16} /> Approve</button>
                      <button onClick={() => saveStatus(appointment.id, { status: 'rejected' })} className="inline-flex items-center gap-2 rounded-full border border-rose-400/20 bg-rose-400/10 px-4 py-2 text-sm text-rose-100"><XCircle size={16} /> Reject</button>
                      <button onClick={() => setEditing({ ...appointment, appointment_date: appointment.appointment_date.slice(0, 10) })} className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-sm text-cyan-100"><PencilLine size={16} /> Reschedule</button>
                    </>
                  )}

                  {appointment.user_id === user?.id && editing?.id !== appointment.id && (
                    <>
                      <button onClick={() => setEditing({ ...appointment, appointment_date: appointment.appointment_date.slice(0, 10) })} className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-sm text-cyan-100"><PencilLine size={16} /> Reschedule</button>
                      <button onClick={() => cancelAppointment(appointment.id)} className="inline-flex items-center gap-2 rounded-full border border-rose-400/20 bg-rose-400/10 px-4 py-2 text-sm text-rose-100"><XCircle size={16} /> Cancel</button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </GlassPanel>
      </div>
    </div>
  );
}
