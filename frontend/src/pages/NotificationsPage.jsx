import { useEffect, useState } from 'react';
import { BellRing, Send, Users } from 'lucide-react';
import toast from 'react-hot-toast';
import client from '../api/client';
import { useAuth } from '../context/AuthContext';
import GlassPanel from '../components/ui/GlassPanel';
import SectionHeading from '../components/ui/SectionHeading';

export default function NotificationsPage() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ title: '', message: '', user_id: '', broadcast: true });

  const loadNotifications = async () => {
    try {
      const { data } = await client.get('/notifications');
      setNotifications(data.data || []);
    } catch (error) {
      console.error(error);
      toast.error('Unable to load notifications');
    }
  };

  const loadUsers = async () => {
    if (user?.role !== 'admin') return;
    try {
      const { data } = await client.get('/users');
      setUsers(data.data || []);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    loadNotifications();
    loadUsers();
  }, []);

  const markRead = async (item) => {
    try {
      const { data } = await client.patch(`/notifications/${item.id}/read`);
      setNotifications((state) => state.map((entry) => (entry.id === item.id ? data.data : entry)));
    } catch (error) {
      console.error(error);
      toast.error('Unable to mark as read');
    }
  };

  const sendNotification = async () => {
    try {
      await client.post('/notifications', {
        ...form,
        user_id: form.broadcast ? undefined : form.user_id,
      });
      toast.success('Notification sent');
      setForm({ title: '', message: '', user_id: '', broadcast: true });
      loadNotifications();
    } catch (error) {
      console.error(error);
      toast.error('Unable to send notification');
    }
  };

  const unreadCount = notifications.filter((item) => !item.read_status).length;

  return (
    <div className="space-y-6">
      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <GlassPanel>
          <SectionHeading title="Notification hub" subtitle="Broadcast reminders and monitor alerts" />
          <div className="space-y-4">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
              <div className="text-sm text-slate-400">Unread alerts</div>
              <div className="mt-2 text-4xl font-semibold text-white">{unreadCount}</div>
            </div>

            {user?.role === 'admin' && (
              <div className="space-y-3 rounded-3xl border border-white/10 bg-white/5 p-4">
                <div className="text-sm font-semibold text-white">Send notification</div>
                <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Title" className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white" />
                <textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="Message" className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white" rows="4" />
                <label className="flex items-center gap-2 text-sm text-slate-300">
                  <input type="checkbox" checked={form.broadcast} onChange={(e) => setForm({ ...form, broadcast: e.target.checked })} /> Broadcast to all users
                </label>
                {!form.broadcast && (
                  <select value={form.user_id} onChange={(e) => setForm({ ...form, user_id: e.target.value })} className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white">
                    <option value="">Select user</option>
                    {users.map((item) => <option key={item.id} value={item.id}>{item.name} ({item.email})</option>)}
                  </select>
                )}
                <button onClick={sendNotification} className="inline-flex items-center gap-2 rounded-full bg-cyan-400 px-5 py-3 font-medium text-slate-950">
                  <Send size={16} /> Send alert
                </button>
              </div>
            )}
          </div>
        </GlassPanel>

        <GlassPanel>
          <SectionHeading title="Alert logs" subtitle="Read and unread updates" action={<div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-slate-200"><BellRing size={14} /> Live feed</div>} />
          <div className="space-y-3">
            {notifications.map((item) => (
              <div key={item.id} className="rounded-3xl border border-white/10 bg-white/5 p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-lg font-semibold text-white">{item.title}</div>
                    <div className="mt-1 text-sm text-slate-400">{item.message}</div>
                  </div>
                  <button onClick={() => markRead(item)} className={`rounded-full px-3 py-1 text-xs ${item.read_status ? 'bg-teal-400/10 text-teal-100' : 'bg-cyan-400/10 text-cyan-100'}`}>
                    {item.read_status ? 'Read' : 'Mark read'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </GlassPanel>
      </div>

      {user?.role === 'admin' && (
        <GlassPanel>
          <SectionHeading title="Reminder recipients" subtitle="User list connected to broadcast targeting" action={<div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-slate-200"><Users size={14} /> {users.length} users</div>} />
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {users.slice(0, 6).map((item) => (
              <div key={item.id} className="rounded-3xl border border-white/10 bg-white/5 p-4">
                <div className="font-semibold text-white">{item.name}</div>
                <div className="text-sm text-slate-400">{item.email}</div>
                <div className="mt-2 text-xs uppercase tracking-[0.3em] text-cyan-300/80">{item.role}</div>
              </div>
            ))}
          </div>
        </GlassPanel>
      )}
    </div>
  );
}
