import { useState } from 'react';
import toast from 'react-hot-toast';
import { MoonStar, ShieldCheck, Sparkles, UserCog } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import client from '../api/client';
import GlassPanel from '../components/ui/GlassPanel';
import SectionHeading from '../components/ui/SectionHeading';

export default function SettingsPage() {
  const { user, updateProfile } = useAuth();
  const [profile, setProfile] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    age: user?.age || '',
    medical_history: Array.isArray(user?.medical_history) ? JSON.stringify(user.medical_history) : (user?.medical_history || ''),
  });
  const [password, setPassword] = useState({ current_password: '', password: '', password_confirmation: '' });
  const [theme, setTheme] = useState('neon');
  const { mode, setMode, toggle } = useTheme();
  const [notifications, setNotifications] = useState(true);
  const [security, setSecurity] = useState(true);

  const saveProfile = async (event) => {
    event.preventDefault();
    try {
      await updateProfile(profile);
      toast.success('Profile updated');
    } catch (error) {
      console.error(error);
      toast.error('Unable to update profile');
    }
  };

  const savePassword = async (event) => {
    event.preventDefault();
    try {
      await client.put('/profile/password', password);
      setPassword({ current_password: '', password: '', password_confirmation: '' });
      toast.success('Password updated');
    } catch (error) {
      console.error(error);
      toast.error('Unable to change password');
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-6 xl:grid-cols-[1fr_0.9fr]">
        <GlassPanel>
          <SectionHeading title="Operator profile" subtitle="Update your command identity" action={<div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-slate-200"><UserCog size={14} /> Account</div>} />
          <form className="mt-4 grid gap-4 md:grid-cols-2" onSubmit={saveProfile}>
            <input value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} placeholder="Name" className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white" />
            <input value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} placeholder="Phone" className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white" />
            <input value={profile.age} onChange={(e) => setProfile({ ...profile, age: e.target.value })} placeholder="Age" className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white" />
            <textarea value={profile.medical_history} onChange={(e) => setProfile({ ...profile, medical_history: e.target.value })} placeholder="Medical history" rows="4" className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white md:col-span-2" />
            <button className="rounded-full bg-cyan-400 px-5 py-3 font-medium text-slate-950 md:col-span-2">Save profile</button>
          </form>
        </GlassPanel>

        <div className="space-y-6">
          <GlassPanel>
            <SectionHeading title="Password change" subtitle="Security credentials" action={<div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-slate-200"><ShieldCheck size={14} /> Secure</div>} />
            <form className="mt-4 space-y-3" onSubmit={savePassword}>
              <input value={password.current_password} onChange={(e) => setPassword({ ...password, current_password: e.target.value })} type="password" placeholder="Current password" className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white" />
              <input value={password.password} onChange={(e) => setPassword({ ...password, password: e.target.value })} type="password" placeholder="New password" className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white" />
              <input value={password.password_confirmation} onChange={(e) => setPassword({ ...password, password_confirmation: e.target.value })} type="password" placeholder="Confirm new password" className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white" />
              <button className="rounded-full bg-teal-400 px-5 py-3 font-medium text-slate-950">Change password</button>
            </form>
          </GlassPanel>

          <GlassPanel>
            <SectionHeading title="System settings" subtitle="Theme, notifications, and security" action={<div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-slate-200"><Sparkles size={14} /> Preferences</div>} />
            <div className="mt-4 space-y-3">
              <label className="flex items-center justify-between rounded-3xl border border-white/10 bg-white/5 px-4 py-4 text-sm text-slate-300">
                <span className="inline-flex items-center gap-2"><MoonStar size={16} className="text-cyan-300" /> Theme preset</span>
                <div className="flex items-center gap-3">
                  <select value={theme} onChange={(e) => setTheme(e.target.value)} className="rounded-full border border-white/10 bg-slate-950/70 px-3 py-2 text-sm text-white">
                    <option value="neon">Neon Glass</option>
                    <option value="aurora">Aurora Blue</option>
                    <option value="obsidian">Obsidian Teal</option>
                  </select>
                  <button onClick={() => toggle()} type="button" className="ml-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-white">
                    {mode === 'dark' ? 'Dark' : 'Light'}
                  </button>
                </div>
              </label>
              <label className="flex items-center justify-between rounded-3xl border border-white/10 bg-white/5 px-4 py-4 text-sm text-slate-300">
                <span>Notification center</span>
                <input type="checkbox" checked={notifications} onChange={(e) => setNotifications(e.target.checked)} />
              </label>
              <label className="flex items-center justify-between rounded-3xl border border-white/10 bg-white/5 px-4 py-4 text-sm text-slate-300">
                <span>Security guardrails</span>
                <input type="checkbox" checked={security} onChange={(e) => setSecurity(e.target.checked)} />
              </label>
            </div>
          </GlassPanel>
        </div>
      </div>
    </div>
  );
}
