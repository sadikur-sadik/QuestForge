import React from "react";
import Link from "next/link";
import { Rocket, ShieldCheck, Persons, ArrowRight, Star, ChartMixed, Dice5, Cup } from "@gravity-ui/icons";

export const metadata = {
  title: "About QuestForge — Digital Game Marketplace & Publisher Ecosystem",
  description: "Discover how QuestForge is transforming digital game distribution with verified license escrow, perpetual game vaults, and creator-first economics.",
};

export default function AboutPage() {
  const stats = [
    { label: "Verified Game Titles", value: "100+", subtext: "Curated & Indie Gems" },
    { label: "Average Delivery Time", value: "< 60s", subtext: "Automated License Escrow" },
    { label: "Community Satisfaction", value: "99.8%", subtext: "Direct Player Ratings" },
    { label: "Creator Earnings Direct", value: "90%+", subtext: "Fair Publisher Share" },
  ];

  const pillars = [
    {
      icon: <ShieldCheck className="w-6 h-6 text-emerald-500" />,
      title: "Automated License Escrow",
      desc: "Every purchase is cryptographically logged and escrowed. Players receive authenticated publisher license keys instantly upon order delivery.",
      badge: "Zero Middlemen",
      accent: "from-emerald-500/10 via-emerald-500/5 to-transparent",
      border: "border-emerald-500/20",
    },
    {
      icon: <Dice5 className="w-6 h-6 text-violet-500" />,
      title: "Perpetual Gaming Vault",
      desc: "Your library is your fortress. Access your games, activation credentials, order receipts, and installation guides across any device at any time.",
      badge: "Lifetime Access",
      accent: "from-violet-500/10 via-violet-500/5 to-transparent",
      border: "border-violet-500/20",
    },
    {
      icon: <ChartMixed className="w-6 h-6 text-amber-500" />,
      title: "Creator-First Publishing",
      desc: "We dismantle legacy 30% store fees. Indie developers and established studios retain maximum profit with real-time analytics and transparent payouts.",
      badge: "Empowering Devs",
      accent: "from-amber-500/10 via-amber-500/5 to-transparent",
      border: "border-amber-500/20",
    },
    {
      icon: <Persons className="w-6 h-6 text-cyan-500" />,
      title: "Collector & Gamer Community",
      desc: "Connect with enthusiasts, leave verified buyer reviews, discover trending genre hits, and participate in community platform challenges.",
      badge: "Gamer Centric",
      accent: "from-cyan-500/10 via-cyan-500/5 to-transparent",
      border: "border-cyan-500/20",
    },
  ];

  const milestones = [
    {
      phase: "Phase 01",
      title: "Core Marketplace & Licensing",
      desc: "Engineered high-performance MongoDB catalogue with instant key allocation, multi-genre taxonomy, and responsive storefront.",
      status: "Operational",
      statusColor: "bg-emerald-500 text-white",
    },
    {
      phase: "Phase 02",
      title: "Dynamic Publisher Analytics",
      desc: "Rolled out real-time Recharts dashboards for revenue tracking, fulfillment status, and customer demographic insights across 7D to 1Y ranges.",
      status: "Live in Production",
      statusColor: "bg-violet-500 text-white",
    },
    {
      phase: "Phase 03",
      title: "Community Vault & Wishlists",
      desc: "Empowering buyers with interactive gaming buckets, wishlist price-tracking alerts, and one-click license redemption.",
      status: "Active",
      statusColor: "bg-cyan-500 text-white",
    },
    {
      phase: "Phase 04",
      title: "Indie Studio Accelerator",
      desc: "Direct developer grants, featured editorial spotlighting, and zero-fee promotional launching for debut indie releases.",
      status: "Upcoming Roadmap",
      statusColor: "bg-amber-500 text-white",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300 pb-20 overflow-x-hidden">
      
      {/* ── Background Cyber Glow Blobs ── */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[2560px] h-[600px] pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-100px] left-1/4 w-[500px] 3xl:w-[750px] h-[500px] 3xl:h-[750px] rounded-full bg-violet-600/15 dark:bg-violet-600/20 blur-[130px] 3xl:blur-[180px]" />
        <div className="absolute top-[50px] right-1/4 w-[450px] 3xl:w-[650px] h-[450px] 3xl:h-[650px] rounded-full bg-cyan-500/15 dark:bg-cyan-500/20 blur-[130px] 3xl:blur-[180px]" />
      </div>

      <div className="relative z-10 qf-container pt-8 sm:pt-12 lg:pt-16 3xl:pt-24 flex flex-col gap-12 sm:gap-16 lg:gap-20 3xl:gap-28">

        {/* ── SECTION 1: HERO HEADER ── */}
        <section className="flex flex-col items-center text-center max-w-4xl 3xl:max-w-6xl mx-auto space-y-5 sm:space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-violet-500/10 dark:bg-violet-500/20 border border-violet-500/30 text-violet-600 dark:text-violet-400 text-xs sm:text-sm 3xl:text-base font-extrabold tracking-wide uppercase shadow-sm">
            <Rocket className="w-4 h-4 animate-bounce" />
            <span>The Next-Generation Digital Game Hub</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl 3xl:text-7xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.15]">
            Empowering Players. <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-violet-600 via-fuchsia-500 to-cyan-500 bg-clip-text text-transparent">
              Championing Independent Creators.
            </span>
          </h1>

          <p className="text-sm sm:text-lg 3xl:text-xl text-slate-600 dark:text-slate-400 font-medium leading-relaxed max-w-2xl 3xl:max-w-4xl">
            QuestForge was engineered to rethink digital gaming commerce. We strip away obsolete distribution barriers, 
            connecting game enthusiasts directly to developers with transparent licensing, perpetual vault ownership, 
            and unmatched platform speed.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 pt-2">
            <Link
              href="/games"
              className="px-6 sm:px-8 py-3 sm:py-3.5 rounded-2xl bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500 text-white font-extrabold text-sm sm:text-base 3xl:text-lg shadow-lg shadow-violet-600/30 hover:shadow-violet-600/50 hover:scale-105 transition-all flex items-center gap-2 group"
            >
              <span>Explore Games Catalog</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/dashboard"
              className="px-6 sm:px-8 py-3 sm:py-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-violet-500 text-slate-700 dark:text-slate-200 hover:text-violet-600 dark:hover:text-violet-400 font-extrabold text-sm sm:text-base 3xl:text-lg shadow-sm hover:shadow-md transition-all flex items-center gap-2"
            >
              <Cup className="w-4 h-4 text-amber-500" />
              <span>Publisher Command Center</span>
            </Link>
          </div>
        </section>

        {/* ── SECTION 2: LIVE METRICS & KPI STRIP ── */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-5 3xl:gap-8">
          {stats.map((stat, i) => (
            <div
              key={i}
              className="p-5 sm:p-6 3xl:p-8 rounded-3xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200/80 dark:border-slate-800/80 shadow-md flex flex-col justify-between hover:border-violet-500/40 hover:-translate-y-1 transition-all duration-300"
            >
              <span className="text-[11px] sm:text-xs 3xl:text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block truncate">
                {stat.label}
              </span>
              <div className="text-2xl sm:text-4xl 3xl:text-5xl font-black text-slate-900 dark:text-white my-1 sm:my-2 bg-gradient-to-r from-violet-600 to-cyan-500 bg-clip-text text-transparent">
                {stat.value}
              </div>
              <span className="text-[11px] sm:text-xs 3xl:text-sm font-semibold text-slate-400 dark:text-slate-500 block truncate">
                {stat.subtext}
              </span>
            </div>
          ))}
        </section>

        {/* ── SECTION 3: THE FOUR PILLARS ── */}
        <section className="space-y-6 sm:space-y-8">
          <div className="text-center max-w-2xl 3xl:max-w-4xl mx-auto space-y-2">
            <span className="px-3 py-1 rounded-full text-xs 3xl:text-sm font-black uppercase tracking-wider bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20">
              Why QuestForge
            </span>
            <h2 className="text-2xl sm:text-4xl 3xl:text-5xl font-black text-slate-900 dark:text-white">
              The Architecture of Fair Gaming
            </h2>
            <p className="text-xs sm:text-sm 3xl:text-base text-slate-500 dark:text-slate-400">
              Built by passionate gamers and developers weary of bloated storefront cuts, hidden lock-ins, and anti-consumer practices.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 3xl:gap-8">
            {pillars.map((pillar, i) => (
              <div
                key={i}
                className={`relative p-6 sm:p-7 3xl:p-9 rounded-3xl bg-white dark:bg-slate-900 border ${pillar.border} shadow-lg flex flex-col justify-between overflow-hidden group hover:shadow-xl transition-all duration-300`}
              >
                <div className={`absolute inset-0 bg-gradient-to-b ${pillar.accent} opacity-50 group-hover:opacity-100 transition-opacity pointer-events-none`} />
                <div className="relative z-10 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 3xl:w-16 3xl:h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center shadow-inner">
                      {pillar.icon}
                    </div>
                    <span className="text-[10px] 3xl:text-xs font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                      {pillar.badge}
                    </span>
                  </div>
                  <h3 className="text-lg 3xl:text-2xl font-black text-slate-900 dark:text-white">
                    {pillar.title}
                  </h3>
                  <p className="text-xs sm:text-sm 3xl:text-base text-slate-500 dark:text-slate-400 leading-relaxed font-normal">
                    {pillar.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── SECTION 4: PLATFORM ROADMAP ── */}
        <section className="p-6 sm:p-10 3xl:p-14 rounded-3xl bg-slate-900 text-white border border-slate-800 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 space-y-8 sm:space-y-12">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-800 pb-6">
              <div>
                <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-violet-500/20 text-violet-400 border border-violet-500/30">
                  Continuous Evolution
                </span>
                <h2 className="text-2xl sm:text-4xl 3xl:text-5xl font-black mt-2">
                  Marketplace Milestones
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-slate-400 max-w-md font-medium">
                Our ongoing roadmap tracking transparency, system scalability, and publisher tools rollout.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {milestones.map((ms, idx) => (
                <div key={idx} className="flex flex-col justify-between p-5 rounded-2xl bg-slate-950/70 border border-slate-800/80 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs 3xl:text-sm font-black text-slate-400 font-mono tracking-widest">
                      {ms.phase}
                    </span>
                    <span className={`text-[10px] 3xl:text-xs font-black uppercase px-2 py-0.5 rounded-full ${ms.statusColor}`}>
                      {ms.status}
                    </span>
                  </div>
                  <h4 className="text-base 3xl:text-lg font-bold text-white">
                    {ms.title}
                  </h4>
                  <p className="text-xs 3xl:text-sm text-slate-400 leading-relaxed">
                    {ms.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── SECTION 5: TRUST & SECURITY PLEDGE ── */}
        <section id="security" className="p-8 sm:p-12 3xl:p-16 rounded-3xl bg-gradient-to-r from-violet-900/20 via-slate-900/40 to-cyan-900/20 border border-violet-500/20 flex flex-col md:flex-row items-center justify-between gap-8 backdrop-blur-xl">
          <div className="space-y-3 max-w-2xl 3xl:max-w-4xl">
            <div className="flex items-center gap-2 text-emerald-500 font-black text-xs uppercase tracking-wider">
              <Star className="w-4 h-4 fill-emerald-500" />
              <span>Verified Publisher Escrow Security</span>
            </div>
            <h3 className="text-2xl sm:text-3xl 3xl:text-4xl font-black text-slate-900 dark:text-white">
              Every key is legitimate. Every transaction is guaranteed.
            </h3>
            <p className="text-xs sm:text-sm 3xl:text-base text-slate-600 dark:text-slate-400 leading-relaxed font-normal">
              We vet every publisher onboarding to QuestForge. With escrow-backed fulfillment, your purchase is 
              guaranteed to deliver a valid, authentic license key directly to your library vault.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 w-full sm:w-auto">
            <Link
              href="/games"
              className="w-full sm:w-auto text-center px-6 py-3.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-extrabold text-sm 3xl:text-base shadow-md transition"
            >
              Browse Games Now
            </Link>
            <Link
              href="/faq"
              className="w-full sm:w-auto text-center px-6 py-3.5 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-extrabold text-sm 3xl:text-base transition"
            >
              Read Customer FAQ
            </Link>
          </div>
        </section>

      </div>
    </div>
  );
}
