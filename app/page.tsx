import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Rinova AI — AI-Powered Real Estate Photo Enhancement',
  description:
    'Uplift your real estate listing photos instantly with AI. Professional virtual staging, batch processing, and video flythroughs — in seconds.',
  alternates: {
    canonical: 'https://rinova.capmapai.com',
  },
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0D1117] text-white font-sans">
      {/* Nav */}
      <header className="border-b border-white/5 backdrop-blur-sm sticky top-0 z-50 bg-[#0D1117]/80">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="grid grid-cols-2 gap-0.5">
              <div className="w-2.5 h-2.5 rounded-sm bg-blue-500" />
              <div className="w-2.5 h-2.5 rounded-sm bg-indigo-500 opacity-70" />
              <div className="w-2.5 h-2.5 rounded-sm bg-indigo-500 opacity-50" />
              <div className="w-2.5 h-2.5 rounded-sm bg-blue-500 opacity-40" />
            </div>
            <span className="font-bold text-lg tracking-tight">Rinova AI</span>
          </div>
          <nav className="hidden md:flex items-center gap-8 text-sm text-white/60">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-white transition-colors">How it works</a>
            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
          </nav>
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-sm text-white/70 hover:text-white transition-colors px-4 py-2"
            >
              Sign in
            </Link>
            <Link
              href="/register"
              className="text-sm font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white px-5 py-2 rounded-full transition-all shadow-lg shadow-blue-900/30"
            >
              Get started free
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 pt-20 pb-16 text-center">
        <div className="inline-flex items-center gap-2 text-xs font-semibold bg-blue-900/30 border border-blue-500/20 text-blue-400 px-4 py-1.5 rounded-full mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
          AI-Powered Virtual Staging
        </div>
        <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-6 leading-[1.05]">
          Real estate photos
          <br />
          <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-violet-400 bg-clip-text text-transparent">
            transformed by AI
          </span>
        </h1>
        <p className="text-xl text-white/60 max-w-2xl mx-auto mb-10 leading-relaxed">
          Upload a property photo and get professional-quality virtual staging in seconds.
          6 styles, any room type, instant download.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/register"
            className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold px-8 py-4 rounded-full text-lg transition-all shadow-2xl shadow-blue-900/40 hover:scale-105"
          >
            Try for free
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
          </Link>
          <Link
            href="/login"
            className="inline-flex items-center justify-center gap-2 border border-white/10 hover:border-white/20 text-white/80 hover:text-white font-semibold px-8 py-4 rounded-full text-lg transition-all"
          >
            Sign in
          </Link>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="max-w-6xl mx-auto px-6 py-20">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">Everything you need</h2>
        <p className="text-white/50 text-center mb-14 text-lg">Professional real estate photography tools, powered by AI.</p>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              icon: '🪄',
              title: 'AI Virtual Staging',
              desc: 'Transform empty or dated rooms into beautifully staged spaces. Choose from Modern, Scandinavian, Industrial, Bohemian, Minimalist, or Contemporary styles.',
            },
            {
              icon: '⚡',
              title: 'Instant Results',
              desc: 'Get 2–4 professional-quality enhanced photos in seconds. No editing skills required — just upload and download.',
            },
            {
              icon: '📦',
              title: 'Batch Processing',
              desc: 'Upload multiple angles of a property and enhance them all at once with consistent style for a complete multi-room project.',
            },
            {
              icon: '🏠',
              title: 'Smart Room Detection',
              desc: 'Rinova AI automatically detects the room type in your photo so you always get the most accurate staging results.',
            },
            {
              icon: '🎬',
              title: 'Video Flythrough',
              desc: 'Generate an AI-powered video walkthrough from your staged images — perfect for listings and social media.',
            },
            {
              icon: '📱',
              title: 'iPhone Photo Support',
              desc: 'Upload directly from your iPhone — HEIC format supported and automatically converted for processing.',
            },
          ].map((f) => (
            <div
              key={f.title}
              className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-6 hover:bg-white/[0.05] hover:border-white/10 transition-all"
            >
              <div className="text-3xl mb-4">{f.icon}</div>
              <h3 className="font-bold text-lg mb-2">{f.title}</h3>
              <p className="text-white/50 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="bg-white/[0.02] border-y border-white/5 py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">How it works</h2>
          <p className="text-white/50 mb-14 text-lg">Three steps to a professionally staged listing.</p>
          <div className="grid md:grid-cols-3 gap-10">
            {[
              { step: '01', title: 'Upload your photo', desc: 'Drag & drop any room photo — JPG, PNG, or HEIC from your iPhone.' },
              { step: '02', title: 'Choose a style', desc: 'Pick one of 6 designer styles and confirm the room type.' },
              { step: '03', title: 'Download & publish', desc: 'Get 2–4 AI-enhanced images instantly. Download and use on any listing.' },
            ].map((s) => (
              <div key={s.step} className="flex flex-col items-center text-center">
                <div className="text-5xl font-black bg-gradient-to-r from-blue-500 to-indigo-500 bg-clip-text text-transparent mb-4">{s.step}</div>
                <h3 className="font-bold text-lg mb-2">{s.title}</h3>
                <p className="text-white/50 text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="max-w-6xl mx-auto px-6 py-20">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">Simple, transparent pricing</h2>
        <p className="text-white/50 text-center mb-14 text-lg">No hidden fees. Cancel any time.</p>
        <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">

          {/* Weekly */}
          <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-8 flex flex-col gap-6 hover:border-white/[0.15] transition-all">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-400"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>
                <span className="font-bold text-lg">Weekly</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-5xl font-black">€15</span>
                <span className="text-white/40 text-sm">/ week</span>
              </div>
            </div>
            <ul className="space-y-3 flex-1">
              {['Unlimited AI enhancements', 'Batch processing', 'All 6 staging styles', 'Video flythrough', 'Priority support'].map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm text-white/60">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-400 flex-shrink-0"><polyline points="20 6 9 17 4 12" /></svg>
                  {f}
                </li>
              ))}
            </ul>
            <Link
              href="/register"
              className="block text-center border border-white/20 hover:border-white/40 text-white font-semibold px-6 py-3 rounded-full transition-all hover:bg-white/5"
            >
              Get started
            </Link>
          </div>

          {/* Monthly */}
          <div className="relative bg-gradient-to-b from-blue-600/20 to-indigo-600/10 border border-blue-500/30 rounded-2xl p-8 flex flex-col gap-6 shadow-xl shadow-blue-900/20">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-bold px-4 py-1 rounded-full shadow-lg">
                Best value
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-400"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" /><path d="M19 3v4" /><path d="M21 5h-4" /></svg>
                <span className="font-bold text-lg">Monthly</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-5xl font-black">€50</span>
                <span className="text-white/40 text-sm">/ month</span>
              </div>
              <p className="text-blue-300/70 text-xs mt-1">Save ~17% vs weekly</p>
            </div>
            <ul className="space-y-3 flex-1">
              {['Unlimited AI enhancements', 'Batch processing', 'All 6 staging styles', 'Video flythrough', 'Priority support'].map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm text-white/70">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-400 flex-shrink-0"><polyline points="20 6 9 17 4 12" /></svg>
                  {f}
                </li>
              ))}
            </ul>
            <Link
              href="/register"
              className="block text-center bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold px-6 py-3 rounded-full transition-all shadow-lg shadow-blue-900/30"
            >
              Get started free
            </Link>
          </div>

        </div>
        <p className="text-center text-white/30 text-sm mt-8">No credit card required to sign up · Cancel any time</p>
      </section>

      {/* CTA */}
      <section className="max-w-4xl mx-auto px-6 py-24 text-center">
        <h2 className="text-4xl md:text-5xl font-black mb-6">
          Ready to enhance your <br />
          <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">listings?</span>
        </h2>
        <p className="text-white/50 text-lg mb-10">Join real estate professionals using Rinova AI to sell properties faster.</p>
        <Link
          href="/register"
          className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold px-10 py-5 rounded-full text-lg transition-all shadow-2xl shadow-blue-900/40 hover:scale-105"
        >
          Get started free
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
        </Link>
        <p className="text-white/30 text-sm mt-4">No credit card required</p>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-10">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-white/30">
          <div className="flex items-center gap-2 font-semibold text-white/50">
            <div className="grid grid-cols-2 gap-0.5">
              <div className="w-2 h-2 rounded-sm bg-blue-500/60" />
              <div className="w-2 h-2 rounded-sm bg-indigo-500/40" />
              <div className="w-2 h-2 rounded-sm bg-indigo-500/30" />
              <div className="w-2 h-2 rounded-sm bg-blue-500/25" />
            </div>
            Rinova AI
          </div>
          <div className="flex gap-6">
            <Link href="/login" className="hover:text-white/60 transition-colors">Sign in</Link>
            <Link href="/register" className="hover:text-white/60 transition-colors">Register</Link>
            <a href="#pricing" className="hover:text-white/60 transition-colors">Pricing</a>
          </div>
          <p>© {new Date().getFullYear()} Rinova AI · rinova.capmapai.com</p>
        </div>
      </footer>
    </div>
  );
}
