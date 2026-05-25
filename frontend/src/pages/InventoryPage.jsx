import { useEffect, useMemo, useState } from 'react';
import { Search, Plus, RotateCcw, Trash2, PencilLine, Pill, Syringe, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';
import { ResponsiveContainer, BarChart, Bar, CartesianGrid, Tooltip, XAxis, YAxis } from 'recharts';
import client from '../api/client';
import { useAuth } from '../context/AuthContext';
import GlassPanel from '../components/ui/GlassPanel';
import SectionHeading from '../components/ui/SectionHeading';

const inventoryKinds = [
  { key: 'vaccines', label: 'Vaccines', icon: Syringe },
  { key: 'ointments', label: 'Ointments', icon: Pill },
  { key: 'medicines', label: 'Medicines', icon: Sparkles },
];

const defaultDrafts = {
  vaccines: { vaccine_name: '', category: '', stock: 0, expiry_date: '', batch_number: '', manufacturer: '' },
  ointments: { ointment_name: '', type: '', stock: 0, expiry_date: '', manufacturer: '' },
  medicines: { name: '', type: '', description: '', stock: 0, price: 0, available: true },
};

export default function InventoryPage() {
  const { user } = useAuth();
  const [query, setQuery] = useState('');
  const [activeKind, setActiveKind] = useState('vaccines');
  const [inventory, setInventory] = useState({ vaccines: [], ointments: [], medicines: [] });
  const [draft, setDraft] = useState(defaultDrafts.vaccines);
  const [editingId, setEditingId] = useState(null);

  const isAdmin = user?.role === 'admin';

  const loadInventory = async () => {
    try {
      const [vaccines, ointments, medicines] = await Promise.all([
        client.get('/vaccines'),
        client.get('/ointments'),
        client.get('/medicines'),
      ]);
      setInventory({
        vaccines: vaccines.data.data || [],
        ointments: ointments.data.data || [],
        medicines: medicines.data.data || [],
      });
    } catch (error) {
      console.error(error);
      toast.error('Unable to load inventory');
    }
  };

  useEffect(() => {
    loadInventory();
  }, []);

  useEffect(() => {
    setDraft(defaultDrafts[activeKind]);
    setEditingId(null);
  }, [activeKind]);

  const currentList = inventory[activeKind] || [];

  const filteredList = useMemo(() => {
    const term = query.toLowerCase();
    return currentList.filter((item) => JSON.stringify(item).toLowerCase().includes(term));
  }, [currentList, query]);

  const chartData = useMemo(() => currentList.map((item) => ({
    name: item.vaccine_name || item.ointment_name || item.name,
    stock: item.stock || 0,
  })), [currentList]);

  const startCreate = () => {
    setEditingId(null);
    setDraft(defaultDrafts[activeKind]);
  };

  const startEdit = (item) => {
    setEditingId(item.id);
    if (activeKind === 'vaccines') setDraft({ ...item });
    if (activeKind === 'ointments') setDraft({ ...item });
    if (activeKind === 'medicines') setDraft({ ...item });
  };

  const saveItem = async () => {
    try {
      const endpoint = activeKind === 'vaccines' ? '/vaccines' : activeKind === 'ointments' ? '/ointments' : '/medicines';
      const payload = { ...draft };
      const response = editingId
        ? await client.put(`${endpoint}/${editingId}`, payload)
        : await client.post(endpoint, payload);

      const item = response.data.data;
      setInventory((state) => ({
        ...state,
        [activeKind]: editingId
          ? state[activeKind].map((entry) => (entry.id === editingId ? item : entry))
          : [item, ...state[activeKind]],
      }));
      toast.success(editingId ? 'Item updated' : 'Item created');
      startCreate();
    } catch (error) {
      console.error(error);
      toast.error('Unable to save item');
    }
  };

  const deleteItem = async (id) => {
    if (!confirm('Delete this item?')) return;
    try {
      const endpoint = activeKind === 'vaccines' ? '/vaccines' : activeKind === 'ointments' ? '/ointments' : '/medicines';
      await client.delete(`${endpoint}/${id}`);
      setInventory((state) => ({
        ...state,
        [activeKind]: state[activeKind].filter((entry) => entry.id !== id),
      }));
      toast.success('Item deleted');
    } catch (error) {
      console.error(error);
      toast.error('Unable to delete item');
    }
  };

  const renderForm = () => {
    if (activeKind === 'vaccines') {
      return (
        <div className="grid gap-3 md:grid-cols-2">
          <input className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white" value={draft.vaccine_name || ''} onChange={(e) => setDraft({ ...draft, vaccine_name: e.target.value })} placeholder="Vaccine name" />
          <input className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white" value={draft.category || ''} onChange={(e) => setDraft({ ...draft, category: e.target.value })} placeholder="Category" />
          <input type="number" className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white" value={draft.stock || 0} onChange={(e) => setDraft({ ...draft, stock: Number(e.target.value) })} placeholder="Stock" />
          <input type="date" className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white" value={draft.expiry_date || ''} onChange={(e) => setDraft({ ...draft, expiry_date: e.target.value })} />
          <input className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white" value={draft.batch_number || ''} onChange={(e) => setDraft({ ...draft, batch_number: e.target.value })} placeholder="Batch number" />
          <input className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white" value={draft.manufacturer || ''} onChange={(e) => setDraft({ ...draft, manufacturer: e.target.value })} placeholder="Manufacturer" />
        </div>
      );
    }

    if (activeKind === 'ointments') {
      return (
        <div className="grid gap-3 md:grid-cols-2">
          <input className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white" value={draft.ointment_name || ''} onChange={(e) => setDraft({ ...draft, ointment_name: e.target.value })} placeholder="Ointment name" />
          <input className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white" value={draft.type || ''} onChange={(e) => setDraft({ ...draft, type: e.target.value })} placeholder="Type" />
          <input type="number" className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white" value={draft.stock || 0} onChange={(e) => setDraft({ ...draft, stock: Number(e.target.value) })} placeholder="Stock" />
          <input type="date" className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white" value={draft.expiry_date || ''} onChange={(e) => setDraft({ ...draft, expiry_date: e.target.value })} />
          <input className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white md:col-span-2" value={draft.manufacturer || ''} onChange={(e) => setDraft({ ...draft, manufacturer: e.target.value })} placeholder="Manufacturer" />
        </div>
      );
    }

    return (
      <div className="grid gap-3 md:grid-cols-2">
        <input className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white" value={draft.name || ''} onChange={(e) => setDraft({ ...draft, name: e.target.value })} placeholder="Medicine name" />
        <input className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white" value={draft.type || ''} onChange={(e) => setDraft({ ...draft, type: e.target.value })} placeholder="Type" />
        <input type="number" className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white" value={draft.stock || 0} onChange={(e) => setDraft({ ...draft, stock: Number(e.target.value) })} placeholder="Stock" />
        <input type="number" step="0.01" className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white" value={draft.price || 0} onChange={(e) => setDraft({ ...draft, price: Number(e.target.value) })} placeholder="Price" />
        <textarea className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white md:col-span-2" rows="3" value={draft.description || ''} onChange={(e) => setDraft({ ...draft, description: e.target.value })} placeholder="Description" />
        <label className="inline-flex items-center gap-2 text-sm text-slate-300 md:col-span-2">
          <input type="checkbox" checked={!!draft.available} onChange={(e) => setDraft({ ...draft, available: e.target.checked })} /> Available
        </label>
      </div>
    );
  };

  const renderCard = (item) => {
    const expiry = item.expiry_date ? new Date(item.expiry_date) : null;
    const daysLeft = expiry ? Math.ceil((expiry.getTime() - Date.now()) / (1000 * 60 * 60 * 24)) : null;
    const lowStock = (item.stock || 0) < 40;
    const key = item.vaccine_name || item.ointment_name || item.name;

    return (
      <div key={item.id} className="rounded-3xl border border-white/10 bg-white/5 p-4 shadow-glow">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-lg font-semibold text-white">{key}</div>
            <div className="mt-1 text-sm text-slate-400">{item.category || item.type || 'Inventory item'}</div>
          </div>
          <div className={`rounded-full px-3 py-1 text-xs ${lowStock ? 'bg-amber-400/15 text-amber-100' : 'bg-cyan-400/15 text-cyan-100'}`}>
            {item.stock} units
          </div>
        </div>

        <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">
          <div className={`h-full rounded-full ${lowStock ? 'bg-gradient-to-r from-amber-300 to-rose-300' : 'bg-gradient-to-r from-cyan-300 to-teal-300'}`} style={{ width: `${Math.min(100, (item.stock / 150) * 100)}%` }} />
        </div>

        <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-300">
          {expiry && <span className={`rounded-full px-3 py-1 ${daysLeft <= 30 ? 'bg-rose-400/15 text-rose-100' : 'bg-white/5'}`}>Expires in {daysLeft}d</span>}
          {item.batch_number && <span className="rounded-full bg-white/5 px-3 py-1">Batch {item.batch_number}</span>}
          {item.manufacturer && <span className="rounded-full bg-white/5 px-3 py-1">{item.manufacturer}</span>}
        </div>

        {isAdmin && (
          <div className="mt-4 flex gap-2">
            <button onClick={() => startEdit(item)} className="inline-flex items-center gap-2 rounded-full border border-cyan-400/15 bg-cyan-400/10 px-4 py-2 text-sm text-cyan-100"><PencilLine size={15} /> Edit</button>
            <button onClick={() => deleteItem(item.id)} className="inline-flex items-center gap-2 rounded-full border border-rose-400/15 bg-rose-400/10 px-4 py-2 text-sm text-rose-100"><Trash2 size={15} /> Delete</button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <GlassPanel>
        <SectionHeading title="Inventory control matrix" subtitle="Vaccines, ointments, and medicines" />
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <label className="flex flex-1 items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
            <Search size={18} className="text-cyan-300" />
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search inventory" className="w-full border-0 bg-transparent p-0 text-white placeholder:text-slate-500 focus:ring-0" />
          </label>
          <button onClick={loadInventory} className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200"><RotateCcw size={16} /> Refresh</button>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {inventoryKinds.map(({ key, label, icon: Icon }) => (
            <button key={key} onClick={() => setActiveKind(key)} className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm transition ${activeKind === key ? 'bg-cyan-400 text-slate-950' : 'border border-white/10 bg-white/5 text-slate-200'}`}>
              <Icon size={15} /> {label}
            </button>
          ))}
        </div>
      </GlassPanel>

      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <GlassPanel>
          <SectionHeading title={`${activeKind.charAt(0).toUpperCase() + activeKind.slice(1)} table`} subtitle="Stock, expiry, and batch intelligence" action={isAdmin ? <button onClick={startCreate} className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-sm text-cyan-100"><Plus size={16} /> Add {activeKind.slice(0, -1)}</button> : null} />
          <div className="mt-4 space-y-3">{filteredList.map(renderCard)}</div>
        </GlassPanel>

        <div className="space-y-6">
          <GlassPanel>
            <SectionHeading title={editingId ? 'Edit inventory item' : 'Create inventory item'} subtitle={isAdmin ? 'Admin form' : 'Read-only mode'} />
            {isAdmin ? (
              <div className="space-y-4">
                {renderForm()}
                <div className="flex gap-3">
                  <button onClick={saveItem} className="rounded-full bg-cyan-400 px-5 py-3 font-medium text-slate-950">{editingId ? 'Save changes' : 'Create item'}</button>
                  <button onClick={startCreate} className="rounded-full border border-white/10 bg-white/5 px-5 py-3 text-slate-200">Reset</button>
                </div>
              </div>
            ) : (
              <div className="rounded-3xl border border-white/10 bg-white/5 p-4 text-sm text-slate-300">Inventory editing is available to admin users only.</div>
            )}
          </GlassPanel>

          <GlassPanel>
            <SectionHeading title="Live stock telemetry" subtitle="Realtime status" />
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid stroke="rgba(148,163,184,0.15)" />
                  <XAxis dataKey="name" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip contentStyle={{ background: '#020617', border: '1px solid rgba(148,163,184,0.2)', borderRadius: 16 }} />
                  <Bar dataKey="stock" fill="#22d3ee" radius={[12, 12, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </GlassPanel>
        </div>
      </div>
    </div>
  );
}
