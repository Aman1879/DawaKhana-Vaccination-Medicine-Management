import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, CalendarCheck2, HeartPulse, Layers3, Quote, ShieldCheck, Sparkles, Truck, Users, Warehouse } from 'lucide-react';
import GlassPanel from '../components/ui/GlassPanel';
import BrandLogo from '../components/branding/BrandLogo';

const features = [
  { icon: ShieldCheck, title: 'Role-safe access', text: 'Separate admin and user experiences with token-based protection.' },
  { icon: CalendarCheck2, title: 'Appointment orchestration', text: 'Calendar booking, approval flow, and reminder handling.' },
  { icon: Layers3, title: 'Inventory visibility', text: 'Track vaccines, ointments, stock, batch, and expiry data.' },
];

const serviceHighlights = [
  { icon: HeartPulse, title: 'Trusted healthcare flow', text: 'Built for clinics, pharmacies, and care teams that need one calm place to manage daily operations.' },
  { icon: Warehouse, title: 'Stock intelligence', text: 'Keep medicines, vaccines, and batches organized with low-stock visibility and expiry tracking.' },
  { icon: Truck, title: 'Fast fulfillment', text: 'Support quick restocking and smoother patient pickups with clear operational tracking.' },
  { icon: Users, title: 'Patient-first access', text: 'Give users a simple dashboard for appointments, reminders, and profile updates.' },
];

const galleryImages = [
  {
    src: 'https://images.pexels.com/photos/3943904/pexels-photo-3943904.jpeg?auto=compress&cs=tinysrgb&w=1200',
    alt: 'Healthcare professional organizing medicine stock',
    label: 'Medicine shelves',
  },
  {
    src: 'https://images.pexels.com/photos/3683055/pexels-photo-3683055.jpeg?auto=compress&cs=tinysrgb&w=1200',
    alt: 'Vaccines and medical supplies on a table',
    label: 'Vaccine care',
  },
  {
    src: 'https://images.unsplash.com/photo-1580281657521-7d7a76b4b9d5?auto=format&fit=crop&w=1200&q=80',
    alt: 'Medicine bottles and healthcare products',
    label: 'Daily essentials',
  },
];

const feedback = [
  {
    name: 'Clinic manager',
    role: 'Operations',
    quote: 'DawaKhana makes inventory and appointments feel connected instead of scattered across different tools.',
  },
  {
    name: 'Pharmacy staff',
    role: 'Front desk',
    quote: 'The dashboard is easy to understand, and the stock alerts help us stay ahead of shortages.',
  },
  {
    name: 'Patient coordinator',
    role: 'Support team',
    quote: 'Booking and follow-up reminders are much cleaner now, which helps people stay on schedule.',
  },
];

const footerLinks = [
  { label: 'Why we are', href: '#why-we-are' },
  { label: 'What we provide', href: '#what-we-provide' },
  { label: 'Feedback', href: '#feedback' },
  { label: 'Contact', href: '#contact' },
];

export default function LandingPage() {
  return (
    <div className="mx-auto w-full max-w-[1800px] px-4 py-10 sm:px-6 lg:px-10 xl:px-14 lg:py-16">
      <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
        <div>
          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm" style={{border: '1px solid rgba(0,109,103,0.18)', backgroundColor: 'rgba(0,109,103,0.06)', color: 'var(--primary)'}}>
            <Sparkles size={16} />
            DawaKhana
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="mt-6">
            <h1 className="max-w-2xl text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl">Vaccine &amp; Medicine Inventory Management</h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-black dark:text-white/90">Keep track of vaccines, doses, batches, expiries, and appointments — all in one place for clinics and pharmacies.</p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link to="/auth" className="inline-flex items-center gap-2 rounded-full px-6 py-3 font-medium" style={{backgroundColor: 'var(--bg)', color: 'var(--primary)'}}>
                Enter dashboard
                <ArrowRight size={18} />
              </Link>
              <a href="#features" className="inline-flex items-center gap-2 rounded-full border px-6 py-3 font-medium text-black dark:text-white" style={{borderColor: 'rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.04)'}}>
                Explore features
              </a>
            </div>
          </motion.div>

          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <GlassPanel key={feature.title} className="p-4">
                  <Icon className="text-[var(--primary)]" size={22} />
                  <div className="mt-3 font-semibold text-white">{feature.title}</div>
                  <p className="mt-2 text-sm leading-6 text-slate-400">{feature.text}</p>
                </GlassPanel>
              );
            })}
          </div>
        </div>

        {/* Static hero image panel (replaces 3D scene) */}
        <div className="relative lg:justify-self-center">
          <div className="mx-auto w-full max-w-[520px] overflow-hidden rounded-2xl lg:max-w-[560px] xl:max-w-[620px]" style={{ backgroundColor: 'var(--primary)' }}>
            <div className="flex items-center justify-center p-6 lg:p-10">
              <div className="relative mx-auto h-[380px] w-[300px] max-w-full overflow-hidden rounded-xl bg-white sm:h-[440px] sm:w-[360px] lg:h-[540px] lg:w-[440px] xl:h-[620px] xl:w-[520px]">
                <img
                  src={galleryImages[0].src}
                  alt={galleryImages[0].alt}
                  className="h-full w-full object-cover object-center"
                  style={{ objectPosition: 'center center' }}
                />
                <div className="absolute bottom-4 right-4 min-w-[90px] rounded-xl bg-white p-3 text-center shadow">
                  <div className="text-2xl font-bold text-slate-900">98%</div>
                  <div className="text-xs text-slate-500">Customer satisfaction</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div id="features" className="mt-12 grid gap-6 md:grid-cols-3">
        <GlassPanel>
          <div className="text-sm uppercase tracking-[0.3em] text-cyan-300/70">Inventory</div>
          <div className="mt-2 text-2xl font-semibold">Real-time stock monitoring</div>
          <p className="mt-3 text-slate-400">Batch numbers, expiry dates, and low stock alerts live inside the admin console.</p>
        </GlassPanel>
        <GlassPanel>
          <div className="text-sm uppercase tracking-[0.3em] text-cyan-300/70">Appointments</div>
          <div className="mt-2 text-2xl font-semibold">Booking and approval flow</div>
          <p className="mt-3 text-slate-400">Users can book vaccination slots while admins approve or reject requests.</p>
        </GlassPanel>
        <GlassPanel>
          <div className="text-sm uppercase tracking-[0.3em] text-cyan-300/70">Analytics</div>
          <div className="mt-2 text-2xl font-semibold">Immersive reporting layer</div>
          <p className="mt-3 text-slate-400">Visualize bookings, inventory movement, and reminders through modern charts.</p>
        </GlassPanel>
      </div>

      <div id="why-we-are" className="mt-16 grid gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
        <GlassPanel className="p-7 sm:p-8">
          <div className="text-sm uppercase tracking-[0.35em] text-cyan-300/70">Why we are</div>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">Built to bring medicines, vaccines, and care coordination into one place.</h2>
          <p className="mt-4 max-w-2xl text-slate-400 leading-7">
            DawaKhana helps clinics and pharmacies keep the entire service flow clear: inventory, appointments, reminders, and patient access.
            It is designed to feel practical, calm, and fast for real day-to-day work.
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {serviceHighlights.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="rounded-3xl border border-white/10 bg-white/5 p-5">
                  <Icon className="text-cyan-300" size={20} />
                  <div className="mt-3 text-lg font-semibold text-white">{item.title}</div>
                  <p className="mt-2 text-sm leading-6 text-slate-400">{item.text}</p>
                </div>
              );
            })}
          </div>
        </GlassPanel>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-3">
          {galleryImages.map((image) => (
            <motion.div key={image.label} whileHover={{ y: -4 }} transition={{ type: 'spring', stiffness: 220, damping: 18 }} className="overflow-hidden rounded-[2rem] border border-white/10 bg-slate-950/40 shadow-glow">
              <img src={image.src} alt={image.alt} className="h-56 w-full object-cover sm:h-52 lg:h-44 xl:h-56" loading="lazy" />
              <div className="p-4">
                <div className="text-xs uppercase tracking-[0.3em] text-cyan-300/70">Gallery</div>
                <div className="mt-2 text-lg font-semibold text-white">{image.label}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <div id="what-we-provide" className="mt-16 grid gap-6 md:grid-cols-3">
        <GlassPanel className="md:col-span-3 p-7 sm:p-8">
          <div className="text-sm uppercase tracking-[0.35em] text-cyan-300/70">What we provide</div>
          <div className="mt-3 max-w-3xl text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            A clean dashboard for inventory, bookings, and patient communication.
          </div>
        </GlassPanel>
        <GlassPanel>
          <div className="text-sm uppercase tracking-[0.3em] text-cyan-300/70">Inventory</div>
          <div className="mt-2 text-2xl font-semibold">Medicine and vaccine tracking</div>
          <p className="mt-3 text-slate-400">Organize stock, batches, expiry dates, and restock needs in one visible system.</p>
        </GlassPanel>
        <GlassPanel>
          <div className="text-sm uppercase tracking-[0.3em] text-cyan-300/70">Operations</div>
          <div className="mt-2 text-2xl font-semibold">Appointments and reminders</div>
          <p className="mt-3 text-slate-400">Support patient booking, admin approval, and gentle reminder flows for follow-ups.</p>
        </GlassPanel>
        <GlassPanel>
          <div className="text-sm uppercase tracking-[0.3em] text-cyan-300/70">Support</div>
          <div className="mt-2 text-2xl font-semibold">Feedback and admin control</div>
          <p className="mt-3 text-slate-400">Keep communication, updates, and role-safe access organized for the whole team.</p>
        </GlassPanel>
      </div>

      <div id="feedback" className="mt-16">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <div className="text-sm uppercase tracking-[0.35em] text-cyan-300/70">Feedback</div>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-white sm:text-4xl">What teams say about DawaKhana</h2>
          </div>
          <Quote className="hidden text-cyan-300 md:block" size={28} />
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {feedback.map((item) => (
            <GlassPanel key={item.name} className="p-6">
              <div className="text-cyan-300">“</div>
              <p className="mt-3 text-sm leading-7 text-slate-300">{item.quote}</p>
              <div className="mt-6 border-t border-white/10 pt-4">
                <div className="font-semibold text-white">{item.name}</div>
                <div className="text-xs uppercase tracking-[0.3em] text-slate-400">{item.role}</div>
              </div>
            </GlassPanel>
          ))}
        </div>
      </div>

      <footer id="contact" className="mt-16 rounded-[2rem] border border-gray-200 bg-white text-black dark:border-white/10 dark:bg-slate-950/60 dark:text-white p-6 shadow-glow sm:p-8">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <BrandLogo compact whiteText />
            <h3 className="mt-4 text-2xl font-semibold text-white sm:text-3xl">A modern healthcare management experience inspired by practical pharmacy workflows.</h3>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-400">
              Take inspiration from polished pharmacy platforms, but keep the product focused on your own medicine and vaccine management flow.
              This footer acts as a simple closing area with helpful links and contact information.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <div className="text-xs uppercase tracking-[0.35em] text-cyan-300/70">Quick links</div>
              <div className="mt-4 space-y-3">
                  {footerLinks.map((link) => (
                    <a key={link.label} href={link.href} className="block text-sm text-slate-700 dark:text-slate-300 transition hover:text-[var(--primary)] dark:hover:text-white">
                      {link.label}
                    </a>
                  ))}
                </div>
            </div>
            <div>
              <div className="text-xs uppercase tracking-[0.35em] text-cyan-300/70">Contact</div>
              <div className="mt-4 space-y-3 text-sm text-slate-700 dark:text-slate-300">
                <div>Email: support@dawakhana.local</div>
                <div>Phone: +91 90000 00000</div>
                <div>For medicine and vaccine workflow support.</div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
