import Banner from "@/components/Banner";
import StatsSection from "@/components/StatsSection";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { getBackendGames } from "@/lib/fetch/get-games";
import { getRecentReviews } from "@/lib/fetch/reviews";
import { Game } from "@/components/game/GameCard";
import FeaturedGameCard from "@/components/game/FeaturedGameCard";
import CategoryDeck from "@/components/home/CategoryDeck";
import TopRatedSection from "@/components/home/TopRatedSection";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import WhyChooseUsSection from "@/components/home/WhyChooseUsSection";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function Home() {
  // SSR Auth check
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // 1. Load featured games dynamically from database (limit 6)
  const rawGames = await getBackendGames({ limit: 6 });
  const featuredGames: Game[] = (rawGames || []).map((game: any) => ({
    id: game._id ? game._id.toString() : game.id,
    title: game.title,
    description: game.description,
    genre: game.genre,
    price: game.price,
    platforms: game.platforms,
    coverUrl: game.coverUrl,
    rating: game.rating,
    reviewsCount: game.reviewsCount || 0,
    releaseDate: game.releaseDate,
    developer: game.developer,
    publisher: game.publisher,
    creator: game.creator,
  }));

  // 2. Load top-rated games dynamically from database (limit 4, sorted by rating)
  const rawTopRated = await getBackendGames({ sort: "rating", limit: 4 });
  const topRatedGames: Game[] = (rawTopRated || []).map((game: any) => ({
    id: game._id ? game._id.toString() : game.id,
    title: game.title,
    description: game.description,
    genre: game.genre,
    price: game.price,
    platforms: game.platforms,
    coverUrl: game.coverUrl,
    rating: game.rating,
    reviewsCount: game.reviewsCount || 0,
    releaseDate: game.releaseDate,
    developer: game.developer,
    publisher: game.publisher,
    creator: game.creator,
  }));

  // 3. Load live verified reviews dynamically from database (minimum 3 required to display)
  const recentReviews = await getRecentReviews(10);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300 overflow-hidden pb-12">
      
      {/* ── Keyframe Animations ── */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(24px);
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
            transform: translateY(-10px) rotate(1.5deg);
          }
        }
        .animate-fade-in-up {
          opacity: 0;
          animation: fadeInUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .animate-float-gate {
          animation: floatGate 6s ease-in-out infinite;
        }
      ` }} />

      {/* 1. Hero Banner Section */}
      <section className="pt-4 pb-2 animate-fade-in-up" style={{ animationDelay: "100ms" }}>
        <Banner />
      </section>

      {/* 2. Platform Stats Section (Placed immediately after Banner) */}
      <section className="py-4 sm:py-6 animate-fade-in-up" style={{ animationDelay: "200ms" }}>
        <StatsSection />
      </section>

      {/* 3. The QuestForge Advantage (Static Website Showcase) */}
      <section className="animate-fade-in-up" style={{ animationDelay: "250ms" }}>
        <WhyChooseUsSection />
      </section>

      {/* 4. Hot Marketplace Drops (Dynamic Catalog from Database) */}
      <section className="qf-container py-10 sm:py-16 transition-colors duration-300 animate-fade-in-up" style={{ animationDelay: "300ms" }}>
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-violet-500/30 bg-violet-500/10 mb-2.5">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-[10px] font-extrabold tracking-wider text-violet-700 dark:text-violet-300 uppercase">
              Featured Releases · Live Catalog
            </span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-violet-600 to-cyan-500 bg-clip-text text-transparent dark:from-violet-400 dark:to-cyan-400">
            Hot Marketplace Drops
          </h2>
          <p className="mt-2 text-xs sm:text-base text-slate-600 dark:text-slate-400 transition-colors duration-300">
            Explore the latest hot releases listed by creators across the universe.
          </p>
        </div>

        {featuredGames.length === 0 ? (
          <div className="flex items-center justify-center p-8 sm:p-12 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 text-slate-500 text-xs sm:text-sm">
            No featured games found.
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 3xl:grid-cols-6 gap-4 sm:gap-6">
              {featuredGames.map((game) => (
                <FeaturedGameCard key={game.id} game={game} />
              ))}
            </div>

            <div className="mt-8 sm:mt-10 text-center">
              <Link
                href="/games"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-white hover:bg-violet-600 dark:hover:bg-violet-600 border border-slate-200 dark:border-slate-800 transition-all shadow-sm"
              >
                <span>Explore All Games</span>
                <span>→</span>
              </Link>
            </div>
          </>
        )}
      </section>

      {/* 4. Adventure Realms / Category Deck */}
      <section className="qf-container py-10 sm:py-16 transition-colors duration-300 animate-fade-in-up" style={{ animationDelay: "400ms" }}>
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-violet-500/30 bg-violet-500/10 mb-2.5">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-[10px] font-extrabold tracking-wider text-violet-700 dark:text-violet-300 uppercase">
              Genre Classification
            </span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-violet-600 to-cyan-500 bg-clip-text text-transparent dark:from-violet-400 dark:to-cyan-400">
            Adventure Realms
          </h2>
          <p className="mt-2 text-xs sm:text-base text-slate-600 dark:text-slate-400 transition-colors duration-300">
            Select a realm genre below to begin matching catalog quests tailored to your playstyle.
          </p>
        </div>
        <CategoryDeck />
      </section>

      {/* 5. Top-Rated Community Quests / Hall of Fame (Dynamic from Database) */}
      <section className="animate-fade-in-up" style={{ animationDelay: "500ms" }}>
        <TopRatedSection games={topRatedGames} />
      </section>

      {/* 6. Verified Community Reviews (Dynamic from Database) */}
      {recentReviews && recentReviews.length > 0 && (
        <section className="animate-fade-in-up" style={{ animationDelay: "600ms" }}>
          <TestimonialsSection reviews={recentReviews.slice(0, 3)} />
        </section>
      )}

      {/* 7. Quest Creator Guild Hub (Developer & Seller Callout) */}
      <section className="qf-container py-10 sm:py-16 transition-colors duration-300 animate-fade-in-up" style={{ animationDelay: "700ms" }}>
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-violet-500/30 bg-violet-500/10 mb-2.5">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-[10px] font-extrabold tracking-wider text-violet-700 dark:text-violet-300 uppercase">
              Creator Guild
            </span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-violet-600 to-cyan-500 bg-clip-text text-transparent dark:from-violet-400 dark:to-cyan-400">
            Forge Your Destiny
          </h2>
          <p className="mt-2 text-xs sm:text-base text-slate-600 dark:text-slate-400 transition-colors duration-300">
            Publish your interactive worlds, build your player guild, and start trading licenses securely today.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-16 xl:gap-20">
          
          {/* Left Side: Call to Action Details */}
          <div className="flex-1 flex flex-col gap-4 sm:gap-6 text-center lg:text-left">
            
            <h3 className="text-xl sm:text-3xl font-extrabold leading-tight text-slate-950 dark:text-white">
              Are you a game developer?
            </h3>
            
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-lg font-medium">
              Publish your gaming titles directly onto our decentralized registry. Access global players, distribute safe licensing keys, and build your community profile dashboard instantly.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-2 justify-center lg:justify-start items-center lg:items-start w-full">
              <Link href="/add-games" className="w-full sm:w-auto flex items-center justify-center">
                <button className="w-full sm:w-auto px-5 sm:px-6 py-3 sm:py-3.5 rounded-xl text-xs font-black text-white bg-gradient-to-r from-violet-600 to-cyan-500 hover:opacity-95 shadow-[0_4px_20px_-4px_rgba(109,40,217,0.4)] active:scale-[0.98] transition-all duration-200 cursor-pointer text-center">
                  Forge New Listing
                </button>
              </Link>
              <Link href="/games" className="w-full sm:w-auto flex items-center justify-center">
                <button className="w-full sm:w-auto px-5 sm:px-6 py-3 sm:py-3.5 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/40 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all active:scale-[0.98] cursor-pointer text-center">
                  Explore Catalog
                </button>
              </Link>
            </div>
          </div>

          {/* Right Side: Animated SVG Gateway */}
          <div className="flex-1 max-w-[280px] xs:max-w-[320px] sm:max-w-[400px] 3xl:max-w-[500px] w-full flex items-center justify-center relative select-none animate-float-gate">
            <div className="absolute w-60 h-60 rounded-full bg-violet-500/10 dark:bg-cyan-500/5 blur-[40px] pointer-events-none" />

            <svg className="w-full h-full text-violet-600 dark:text-violet-400" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="200" cy="200" r="180" stroke="currentColor" strokeWidth="1" strokeDasharray="4 8" className="opacity-20 animate-spin" style={{ animationDuration: "40s" }} />
              <circle cx="200" cy="200" r="140" stroke="currentColor" strokeWidth="1.5" strokeDasharray="10 15" className="opacity-30 animate-spin" style={{ animationDuration: "25s", animationDirection: "reverse" }} />
              <circle cx="200" cy="200" r="100" stroke="currentColor" strokeWidth="2" className="opacity-45" />
              <circle cx="200" cy="200" r="60" stroke="url(#paint0_linear_guild_unboxed)" strokeWidth="3" className="opacity-60 animate-pulse" />
              
              <circle cx="200" cy="100" r="4" fill="#06b6d4" className="animate-ping" />
              <circle cx="300" cy="200" r="4" fill="#8b5cf6" className="animate-ping" style={{ animationDelay: "1s" }} />
              <circle cx="200" cy="300" r="4" fill="#06b6d4" className="animate-ping" style={{ animationDelay: "2s" }} />
              <circle cx="100" cy="200" r="4" fill="#8b5cf6" className="animate-ping" style={{ animationDelay: "3s" }} />

              <line x1="200" y1="20" x2="200" y2="380" stroke="currentColor" strokeWidth="0.5" className="opacity-15" />
              <line x1="20" x2="380" y1="200" y2="200" stroke="currentColor" strokeWidth="0.5" className="opacity-15" />
              <line x1="72" y1="72" x2="328" y2="328" stroke="currentColor" strokeWidth="0.5" className="opacity-10" />
              <line x1="72" y1="328" x2="328" y2="72" stroke="currentColor" strokeWidth="0.5" className="opacity-10" />

              <path d="M200 140L250 200L200 260L150 200Z" fill="url(#paint1_linear_guild_unboxed)" className="drop-shadow-[0_0_15px_rgba(139,92,246,0.5)] transition-transform duration-500 hover:scale-105" />
              <circle cx="200" cy="200" r="6" fill="#fff" className="animate-pulse" />
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
