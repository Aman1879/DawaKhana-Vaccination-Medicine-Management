import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import SectionHeading from '../components/ui/SectionHeading';
import GlassPanel from '../components/ui/GlassPanel';

function medicalHistoryToText(value) {
  if (Array.isArray(value)) {
    return value.join('\n');
  }
  return value || '';
}

function medicalHistoryToArray(value) {
  return String(value || '')
    .split(/\r?\n|,/) 
    .map((item) => item.trim())
    .filter(Boolean);
}

export default function ProfilePage() {
  const { user, updateProfile } = useAuth();
  const [form, setForm] = useState({
    name: '',
    phone: '',
    age: '',
    medical_history: '',
  });

  useEffect(() => {
    setForm({
      name: user?.name || '',
      phone: user?.phone || '',
      age: user?.age ?? '',
      medical_history: medicalHistoryToText(user?.medical_history),
    });
  }, [user]);

  const save = async (event) => {
    event.preventDefault();
    try {
      await updateProfile({
        name: form.name,
        phone: form.phone || null,
        age: form.age === '' ? null : Number(form.age),
        medical_history: medicalHistoryToArray(form.medical_history),
      });
      toast.success('Profile updated');
    } catch {
      toast.error('Unable to update profile');
    }
  };

  return (
    <GlassPanel>
      <SectionHeading title="Profile settings" subtitle="Account and medical details" />
      <form className="grid gap-4 md:grid-cols-2" onSubmit={save}>
        <label className="block">
          <span className="mb-2 block text-sm text-slate-300">Name</span>
          <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white focus:border-cyan-400 focus:ring-cyan-400" />
        </label>
        <label className="block">
          <span className="mb-2 block text-sm text-slate-300">Phone</span>
          <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white focus:border-cyan-400 focus:ring-cyan-400" />
        </label>
        <label className="block">
          <span className="mb-2 block text-sm text-slate-300">Age</span>
          <input type="number" min="0" value={form.age} onChange={(e) => setForm({ ...form, age: e.target.value })} className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white focus:border-cyan-400 focus:ring-cyan-400" />
        </label>
        <label className="block md:col-span-2">
          <span className="mb-2 block text-sm text-slate-300">Medical history (one item per line)</span>
          <textarea rows="5" value={form.medical_history} onChange={(e) => setForm({ ...form, medical_history: e.target.value })} className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white focus:border-cyan-400 focus:ring-cyan-400" />
        </label>
        <div className="md:col-span-2">
          <button className="rounded-full bg-cyan-400 px-5 py-3 font-medium text-slate-950 hover:bg-cyan-300">Save profile</button>
        </div>
      </form>
    </GlassPanel>
  );
}
