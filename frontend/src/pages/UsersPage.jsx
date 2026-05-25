import { useEffect, useMemo, useState } from 'react';
import { BadgeCheck, PencilLine, RefreshCcw, Search, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import client from '../api/client';
import GlassPanel from '../components/ui/GlassPanel';
import SectionHeading from '../components/ui/SectionHeading';

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [query, setQuery] = useState('');
  const [editing, setEditing] = useState(null);

  const loadData = async () => {
    try {
      const [usersRes, apptsRes] = await Promise.all([client.get('/users'), client.get('/appointments')]);
      setUsers(usersRes.data.data || []);
      setAppointments(apptsRes.data.data || []);
    } catch (error) {
      console.error(error);
      toast.error('Unable to load users');
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const historyByUser = useMemo(() => {
    const map = new Map();
    appointments.forEach((appointment) => {
      const entry = map.get(appointment.user_id) || { total: 0, lastDate: null };
      entry.total += 1;
      const date = appointment.appointment_date;
      if (!entry.lastDate || new Date(date) > new Date(entry.lastDate)) entry.lastDate = date;
      map.set(appointment.user_id, entry);
    });
    return map;
  }, [appointments]);

  const filteredUsers = useMemo(() => users.filter((item) => JSON.stringify(item).toLowerCase().includes(query.toLowerCase())), [users, query]);

  const saveUser = async () => {
    try {
      const { data } = await client.put(`/users/${editing.id}`, editing);
      setUsers((state) => state.map((item) => (item.id === editing.id ? data.data : item)));
      setEditing(null);
      toast.success('User updated');
    } catch (error) {
      console.error(error);
      toast.error('Unable to update user');
    }
  };

  const toggleBlock = async (item) => {
    try {
      const { data } = await client.patch(`/users/${item.id}/block`, { is_blocked: !item.is_blocked });
      setUsers((state) => state.map((entry) => (entry.id === item.id ? data.data : entry)));
      toast.success(item.is_blocked ? 'User unblocked' : 'User blocked');
    } catch (error) {
      console.error(error);
      toast.error('Unable to update user block state');
    }
  };

  const deleteUser = async (item) => {
    if (!confirm('Delete this user?')) return;
    try {
      await client.delete(`/users/${item.id}`);
      setUsers((state) => state.filter((entry) => entry.id !== item.id));
      toast.success('User deleted');
    } catch (error) {
      console.error(error);
      toast.error('Unable to delete user');
    }
  };

  return (
    <div className="space-y-6">
      <GlassPanel>
        <SectionHeading title="User registry" subtitle="Manage roles, blocks, and patient history" />
        <div className="mt-4 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
          <Search size={18} className="text-cyan-300" />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search users" className="w-full border-0 bg-transparent p-0 text-white placeholder:text-slate-500 focus:ring-0" />
          <button onClick={loadData} className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200"><RefreshCcw size={16} /> Refresh</button>
        </div>
      </GlassPanel>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <GlassPanel>
          <div className="space-y-3">
            {filteredUsers.map((item) => {
              const history = historyByUser.get(item.id) || { total: 0, lastDate: null };
              return (
                <div key={item.id} className="rounded-3xl border border-white/10 bg-white/5 p-4">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <div className="text-lg font-semibold text-white">{item.name}</div>
                      <div className="text-sm text-slate-400">{item.email}</div>
                      <div className="mt-2 text-xs uppercase tracking-[0.3em] text-cyan-300/80">{item.role}</div>
                    </div>
                    <div className={`rounded-full px-3 py-1 text-xs ${item.is_blocked ? 'bg-rose-400/15 text-rose-100' : 'bg-teal-400/15 text-teal-100'}`}>
                      {item.is_blocked ? 'Blocked' : 'Active'}
                    </div>
                  </div>

                  <div className="mt-4 grid gap-3 sm:grid-cols-3 text-sm text-slate-300">
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-3">Appointments: {history.total}</div>
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-3">Last visit: {history.lastDate ? new Date(history.lastDate).toLocaleDateString() : 'N/A'}</div>
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-3">Phone: {item.phone || 'N/A'}</div>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <button onClick={() => setEditing(item)} className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-sm text-cyan-100"><PencilLine size={15} /> Edit</button>
                    <button onClick={() => toggleBlock(item)} className="inline-flex items-center gap-2 rounded-full border border-amber-400/20 bg-amber-400/10 px-4 py-2 text-sm text-amber-100"><BadgeCheck size={15} /> {item.is_blocked ? 'Unblock' : 'Block'}</button>
                    <button onClick={() => deleteUser(item)} className="inline-flex items-center gap-2 rounded-full border border-rose-400/20 bg-rose-400/10 px-4 py-2 text-sm text-rose-100"><Trash2 size={15} /> Delete</button>
                  </div>
                </div>
              );
            })}
          </div>
        </GlassPanel>

        <GlassPanel>
          <SectionHeading title={editing ? 'Edit user' : 'Vaccination history'} subtitle={editing ? 'Update role or contact data' : 'Select a user to edit'} />
          {editing ? (
            <div className="space-y-3">
              <input value={editing.name || ''} onChange={(e) => setEditing({ ...editing, name: e.target.value })} className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white" />
              <input value={editing.email || ''} onChange={(e) => setEditing({ ...editing, email: e.target.value })} className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white" />
              <input value={editing.phone || ''} onChange={(e) => setEditing({ ...editing, phone: e.target.value })} className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white" />
              <select value={editing.role || 'user'} onChange={(e) => setEditing({ ...editing, role: e.target.value })} className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white">
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
              <label className="flex items-center gap-2 text-sm text-slate-300">
                <input type="checkbox" checked={!!editing.is_blocked} onChange={(e) => setEditing({ ...editing, is_blocked: e.target.checked })} /> Blocked
              </label>
              <div className="flex gap-2">
                <button onClick={saveUser} className="rounded-full bg-cyan-400 px-5 py-3 font-medium text-slate-950">Save user</button>
                <button onClick={() => setEditing(null)} className="rounded-full border border-white/10 bg-white/5 px-5 py-3 text-slate-200">Cancel</button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredUsers.slice(0, 6).map((item) => {
                const history = historyByUser.get(item.id) || { total: 0, lastDate: null };
                return (
                  <div key={item.id} className="rounded-3xl border border-white/10 bg-white/5 p-4 text-sm text-slate-300">
                    <div className="font-semibold text-white">{item.name}</div>
                    <div className="mt-1">Appointments: {history.total}</div>
                    <div>Latest: {history.lastDate ? new Date(history.lastDate).toLocaleDateString() : 'N/A'}</div>
                  </div>
                );
              })}
            </div>
          )}
        </GlassPanel>
      </div>
    </div>
  );
}
