import Banner from "@/components/Banner";
import StatsSection from "@/components/StatsSection";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { getBackendGames } from "@/lib/fetch/get-games";
import { Game } from "@/components/game/GameCard";
import FeaturedGameCard from "@/components/game/FeaturedGameCard";
import CategoryDeck from "@/components/home/CategoryDeck";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function Home() {
  // SSR Auth check
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // Load featured games from database (limit 6, no auth required)
  const rawGames = await getBackendGames({ limit: 6 });
  const featuredGames: Game[] = rawGames.map((game: any) => ({
    id: game._id ? game._id.toString() : game.id,
    title: game.title,
    description: game.description,
    genre: game.genre,
    price: game.price,
    platforms: game.platforms,
    coverUrl: game.coverUrl,
    rating: game.rating,
    releaseDate: game.releaseDate,
    developer: game.developer,
    publisher: game.publisher,
    creator: game.creator,
  }));

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300 overflow-hidden pb-10">
      
      {/* ── Homepage Specific CSS Keyframe Animations ── */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes floatGate {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-12px) rotate(1.5deg);
          }
        }
        .animate-fade-in-up {
          opacity: 0;
          animation: fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .animate-float-gate {
          animation: floatGate 6s ease-in-out infinite;
        }
      ` }} />

      {/* 1. Hero Banner Section */}
      <section className="pt-4 pb-4 animate-fade-in-up" style={{ animationDelay: "100ms" }}>
        <Banner />
      </section>

      {/* 2. Main Feature Content Section (Unleash the Power of Your Library) */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 transition-colors duration-300 animate-fade-in-up" style={{ animationDelay: "250ms" }}>
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-violet-600 to-cyan-600 bg-clip-text text-transparent dark:from-violet-400 dark:to-cyan-400">
            Unleash the Power of Your Library
          </h2>
          <p className="mt-4 text-base text-slate-600 dark:text-slate-400 transition-colors duration-300">
            Discover a state-of-the-art cataloging system built for completionists, reviewers, and collectors.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1 */}
          <div className="group relative p-[1px] rounded-2xl overflow-hidden bg-gradient-to-b from-slate-200 to-transparent dark:from-slate-800 dark:to-transparent hover:from-violet-500 hover:to-cyan-500 transition-all duration-300">
            <div className="h-full bg-white dark:bg-slate-900 px-6 py-8 rounded-[15px] flex flex-col gap-4 border border-slate-200/50 dark:border-slate-800/40 text-slate-900 dark:text-slate-100 transition-colors duration-300">
              <div className="w-12 h-12 rounded-xl bg-violet-500/10 flex items-center justify-center text-violet-600 dark:text-violet-400">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
              </div>
              <h3 className="text-xl font-bold">Forge Your Library</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 transition-colors duration-300">
                Register games in your catalog, track completion statuses, play times, and personalize your backlog.
              </p>
            </div>
          </div>

          {/* Card 2 */}
          <div className="group relative p-[1px] rounded-2xl overflow-hidden bg-gradient-to-b from-slate-200 to-transparent dark:from-slate-800 dark:to-transparent hover:from-violet-500 hover:to-cyan-500 transition-all duration-300">
            <div className="h-full bg-white dark:bg-slate-900 px-6 py-8 rounded-[15px] flex flex-col gap-4 border border-slate-200/50 dark:border-slate-800/40 text-slate-900 dark:text-slate-100 transition-colors duration-300">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/10 flex items-center justify-center text-cyan-600 dark:text-cyan-400">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold">Find New Quests</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 transition-colors duration-300">
                Discover popular releases, retro titles, or hidden gems from other gamers on the platform.
              </p>
            </div>
          </div>

          {/* Card 3 */}
          <div className="group relative p-[1px] rounded-2xl overflow-hidden bg-gradient-to-b from-slate-200 to-transparent dark:from-slate-800 dark:to-transparent hover:from-violet-500 hover:to-cyan-500 transition-all duration-300">
            <div className="h-full bg-white dark:bg-slate-900 px-6 py-8 rounded-[15px] flex flex-col gap-4 border border-slate-200/50 dark:border-slate-800/40 text-slate-900 dark:text-slate-100 transition-colors duration-300">
              <div className="w-12 h-12 rounded-xl bg-rose-500/10 flex items-center justify-center text-rose-600 dark:text-rose-400">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold">Share Your Achievements</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 transition-colors duration-300">
                Connect with the community, rate games, post walkthroughs, and display your trophy cabinet.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* 3. Stats Section with counting animation */}
      <section className="py-6 bg-white/30 dark:bg-slate-950/20 animate-fade-in-up" style={{ animationDelay: "400ms" }}>
        <StatsSection />
      </section>

      {/* 4. Featured Games Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 transition-colors duration-300 animate-fade-in-up" style={{ animationDelay: "550ms" }}>
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-violet-600 to-cyan-600 bg-clip-text text-transparent dark:from-violet-400 dark:to-cyan-400">
            Featured Games
          </h2>
          <p className="mt-4 text-base text-slate-600 dark:text-slate-400 transition-colors duration-300">
            Explore the latest hot releases listed in the marketplace.
          </p>
        </div>

        {featuredGames.length === 0 ? (
          <div className="flex items-center justify-center p-12 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800 text-slate-500 text-sm">
            No featured games found.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-6">
            {featuredGames.map((game) => (
              <FeaturedGameCard key={game.id} game={game} />
            ))}
          </div>
        )}
      </section>

      {/* 5. Categories Realm Deck Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 transition-colors duration-300 animate-fade-in-up" style={{ animationDelay: "700ms" }}>
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-violet-600 to-cyan-600 bg-clip-text text-transparent dark:from-violet-400 dark:to-cyan-400">
            Adventure Realms
          </h2>
          <p className="mt-4 text-base text-slate-600 dark:text-slate-400 transition-colors duration-300">
            Select a realm genre below to begin matching catalog quests.
          </p>
        </div>
        <CategoryDeck />
      </section>

      {/* 6. Quest Creator Guild Hub Section (Interactive SVG - Unboxed) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 transition-colors duration-300 animate-fade-in-up" style={{ animationDelay: "850ms" }}>
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-violet-600 to-cyan-600 bg-clip-text text-transparent dark:from-violet-400 dark:to-cyan-400">
            Forge Your Destiny
          </h2>
          <p className="mt-4 text-base text-slate-600 dark:text-slate-400 transition-colors duration-300">
            Publish your interactive worlds, build your player guild, and start trading licenses securely today.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-20">
          
          {/* Left Side: Call to Action Details */}
          <div className="flex-1 flex flex-col gap-6 text-center lg:text-left">
            <div className="flex items-center gap-2 justify-center lg:justify-start px-3 py-1 w-fit mx-auto lg:mx-0 rounded-full border border-violet-200 dark:border-violet-500/30 bg-violet-50 dark:bg-violet-500/10">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-ping" />
              <span className="text-[9px] font-extrabold tracking-wider text-violet-700 dark:text-slate-355 uppercase">
                Creator Guild
              </span>
            </div>
            
            <h3 className="text-2xl sm:text-3xl font-black leading-tight text-slate-950 dark:text-white">
              Are you a game developer?
            </h3>
            
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-lg font-medium">
              Publish your gaming titles directly onto our decentralized registry. Access global players, distribute safe licensing keys, and build your community profile dashboard instantly.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mt-2 justify-center lg:justify-start items-center lg:items-start w-full">
              <Link href="/add-games" className="w-full sm:w-auto max-w-xs flex items-center justify-center">
                <button className="w-full min-w-[220px] px-6 py-3.5 rounded-xl text-xs font-black text-white bg-gradient-to-r from-violet-600 to-cyan-500 hover:opacity-95 shadow-[0_4px_20px_-4px_rgba(109,40,217,0.4)] active:scale-[0.98] transition-all duration-200 cursor-pointer flex items-center justify-center text-center">
                  Forge New Quest Listing
                </button>
              </Link>
              <Link href="/games" className="w-full sm:w-auto max-w-xs flex items-center justify-center">
                <button className="w-full min-w-[220px] px-6 py-3.5 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/40 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all active:scale-[0.98] cursor-pointer flex items-center justify-center text-center">
                  Explore Marketplace
                </button>
              </Link>
            </div>
          </div>

          {/* Right Side: Animated SVG Gateway */}
          <div className="flex-1 max-w-[320px] sm:max-w-[400px] w-full flex items-center justify-center relative select-none animate-float-gate">
            {/* Outer Glowing Circle behind SVG */}
            <div className="absolute w-60 h-60 rounded-full bg-violet-500/10 dark:bg-cyan-500/5 blur-[40px] pointer-events-none" />

            <svg className="w-full h-full text-violet-600 dark:text-violet-400" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Background Rotating Cyber Grid */}
              <circle cx="200" cy="200" r="180" stroke="currentColor" strokeWidth="1" strokeDasharray="4 8" className="opacity-20 animate-spin" style={{ animationDuration: "40s" }} />
              <circle cx="200" cy="200" r="140" stroke="currentColor" strokeWidth="1.5" strokeDasharray="10 15" className="opacity-30 animate-spin" style={{ animationDuration: "25s", animationDirection: "reverse" }} />
              
              {/* Concentric rings */}
              <circle cx="200" cy="200" r="100" stroke="currentColor" strokeWidth="2" className="opacity-45" />
              <circle cx="200" cy="200" r="60" stroke="url(#paint0_linear_guild_unboxed)" strokeWidth="3" className="opacity-60 animate-pulse" />
              
              {/* Glowing Nodes/Particles on rings */}
              <circle cx="200" cy="100" r="4" fill="#06b6d4" className="animate-ping" />
              <circle cx="300" cy="200" r="4" fill="#8b5cf6" className="animate-ping" style={{ animationDelay: "1s" }} />
              <circle cx="200" cy="300" r="4" fill="#06b6d4" className="animate-ping" style={{ animationDelay: "2s" }} />
              <circle cx="100" cy="200" r="4" fill="#8b5cf6" className="animate-ping" style={{ animationDelay: "3s" }} />

              {/* Cyber Geometric Arms/Lines */}
              <line x1="200" y1="20" x2="200" y2="380" stroke="currentColor" strokeWidth="0.5" className="opacity-15" />
              <line x1="20" x2="380" y1="200" y2="200" stroke="currentColor" strokeWidth="0.5" className="opacity-15" />
              <line x1="72" y1="72" x2="328" y2="328" stroke="currentColor" strokeWidth="0.5" className="opacity-10" />
              <line x1="72" y1="328" x2="328" y2="72" stroke="currentColor" strokeWidth="0.5" className="opacity-10" />

              {/* Central Emblem / Core (Isometric Forge Diamond) */}
              <path d="M200 140L250 200L200 260L150 200Z" fill="url(#paint1_linear_guild_unboxed)" className="drop-shadow-[0_0_15px_rgba(139,92,246,0.5)] transition-transform duration-500 hover:scale-105" />
              
              {/* Core floating spark dots */}
              <circle cx="200" cy="200" r="6" fill="#fff" className="animate-pulse" />

              {/* Glowing Core Orbit Ring */}
              <ellipse cx="200" cy="200" rx="30" ry="8" stroke="#06b6d4" strokeWidth="2" className="animate-spin" style={{ animationDuration: "4s" }} />

              <defs>
                <linearGradient id="paint0_linear_guild_unboxed" x1="100" y1="100" x2="300" y2="300" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#8b5cf6" />
                  <stop offset="1" stopColor="#06b6d4" />
                </linearGradient>
                <linearGradient id="paint1_linear_guild_unboxed" x1="150" y1="140" x2="250" y2="260" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#a78bfa" />
                  <stop offset="1" stopColor="#22d3ee" />
                </linearGradient>
              </defs>
            </svg>
          </div>

        </div>
      </section>

    </div>
  );
}
