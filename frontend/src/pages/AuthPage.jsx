import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, UserRound, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import GlassPanel from '../components/ui/GlassPanel';
import BrandLogo from '../components/branding/BrandLogo';

export default function AuthPage() {
  const [mode, setMode] = useState('login');
  const [loading, setLoading] = useState(false);
  const [redirecting, setRedirecting] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '', password_confirmation: '', role: 'user' });
  const { login, register, user, token, ready, demoLogin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!ready || !token || !user) {
      setRedirecting(false);
      return;
    }

    setRedirecting(true);
    navigate(user.role === 'admin' ? '/admin' : '/user', { replace: true });
  }, [ready, token, user, navigate]);

  const rightPanel = (() => {
    if (mode === 'login') {
      return {
        src: 'https://images.pexels.com/photos/3683055/pexels-photo-3683055.jpeg?auto=compress&cs=tinysrgb&w=1200',
        alt: 'Patient receiving vaccine',
        title: 'Welcome back',
        subtitle: 'Access your schedule, inventory and patient records.'
      };
    }

    return {
      src: 'https://images.pexels.com/photos/3943904/pexels-photo-3943904.jpeg?auto=compress&cs=tinysrgb&w=1200',
      alt: 'Healthcare team collaborating',
      title: 'Create a clinical workspace',
      subtitle: 'Setup your clinic, manage medicines, and invite team members.'
    };
  })();

  const getErrorMessage = (error) => {
    const response = error?.response?.data;
    if (response?.message) {
      return response.message;
    }

    const errors = response?.errors;
    if (errors && typeof errors === 'object') {
      const firstKey = Object.keys(errors)[0];
      const firstMessage = firstKey ? errors[firstKey]?.[0] : null;
      if (firstMessage) {
        return firstMessage;
      }
    }

    return 'Authentication failed';
  };

  const submit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      let authResponse;

      if (mode === 'login') {
        authResponse = await login({ email: form.email, password: form.password });
      } else {
        authResponse = await register({
          name: form.name,
          email: form.email,
          password: form.password,
          password_confirmation: form.password_confirmation,
          role: form.role,
        });
      }

      toast.success(mode === 'login' ? 'Welcome back' : 'Account created');
      const nextRole = authResponse?.data?.user?.role || (mode === 'register' ? form.role : 'user');
      navigate(nextRole === 'admin' ? '/admin' : '/user');
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto grid min-h-[calc(100vh-88px)] max-w-7xl place-items-center px-4 py-10 sm:px-6 lg:px-8">
      {redirecting && (
        <div className="mb-4 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-sm text-cyan-100">
          Redirecting to your dashboard...
        </div>
      )}
      <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="grid w-full gap-6 lg:grid-cols-[1fr_0.9fr]">
        <GlassPanel className="p-8">
          <BrandLogo whiteText />
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-sm text-cyan-100">
            <ShieldCheck size={16} /> Secure access portal
          </div>
          <h1 className="mt-6 text-3xl font-semibold text-white">{mode === 'login' ? 'Sign in to the control room' : 'Create a clinical workspace'}</h1>
          <p className="mt-3 text-slate-400">Use role-aware authentication to enter the admin or user dashboard.</p>

          <form className="mt-8 space-y-4" onSubmit={submit}>
            {mode === 'register' ? (
              <label className="block">
                <span className="mb-2 block text-sm text-slate-300">Full name</span>
                <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                  <UserRound size={18} className="text-cyan-300" />
                  <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full border-0 bg-transparent p-0 text-white placeholder:text-slate-500 focus:ring-0" placeholder="Dr. Avery Stone" />
                </div>
              </label>
            ) : null}
            <label className="block">
              <span className="mb-2 block text-sm text-slate-300">Email</span>
              <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                <Mail size={18} className="text-cyan-300" />
                <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full border-0 bg-transparent p-0 text-white placeholder:text-slate-500 focus:ring-0" placeholder="admin@demo.local" />
              </div>
            </label>
            <label className="block">
              <span className="mb-2 block text-sm text-slate-300">Password</span>
              <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                <Lock size={18} className="text-cyan-300" />
                <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="w-full border-0 bg-transparent p-0 text-white placeholder:text-slate-500 focus:ring-0" placeholder="••••••••" />
              </div>
            </label>
            {mode === 'register' ? (
              <label className="block">
                <span className="mb-2 block text-sm text-slate-300">Confirm password</span>
                <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                  <Lock size={18} className="text-cyan-300" />
                  <input
                    type="password"
                    value={form.password_confirmation}
                    onChange={(e) => setForm({ ...form, password_confirmation: e.target.value })}
                    className="w-full border-0 bg-transparent p-0 text-white placeholder:text-slate-500 focus:ring-0"
                    placeholder="Repeat password"
                  />
                </div>
              </label>
            ) : null}
            {mode === 'register' ? (
              <label className="block">
                <span className="mb-2 block text-sm text-slate-300">Role</span>
                <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white focus:border-cyan-400 focus:ring-cyan-400">
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </label>
            ) : null}
            <button disabled={loading} className="w-full rounded-2xl bg-cyan-400 px-4 py-3 font-medium text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-70" type="submit">
              {loading ? 'Processing...' : mode === 'login' ? 'Login' : 'Register'}
            </button>
          </form>

          <div className="mt-6 flex flex-wrap gap-3">
            <button type="button" onClick={() => setMode(mode === 'login' ? 'register' : 'login')} className="rounded-full border border-white/10 px-4 py-2 text-sm text-slate-200 transition hover:bg-white/5">
              {mode === 'login' ? 'Need an account?' : 'Already registered?'}
            </button>
          </div>
        </GlassPanel>

        <GlassPanel className="hidden lg:flex flex-col justify-between p-0 overflow-hidden">
          <div className="relative h-full w-full">
            <img src={rightPanel.src} alt={rightPanel.alt} className="h-full w-full object-cover" loading="lazy" />
            <div className="absolute inset-0 bg-gradient-to-tr from-black/30 via-transparent to-black/20" />
            <div className="absolute left-6 bottom-6 max-w-xs text-white">
              <div className="text-sm uppercase tracking-[0.35em] text-cyan-300/80">Secure Hub</div>
              <div className="mt-2 text-lg font-semibold">{rightPanel.title}</div>
              <p className="mt-2 text-sm text-slate-200">{rightPanel.subtitle}</p>
            </div>
          </div>
        </GlassPanel>
      </motion.div>
    </div>
  );
}
