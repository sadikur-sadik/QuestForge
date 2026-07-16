"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { toast } from "react-toastify";
import { Game } from "@/components/game/GameCard";
import { authClient } from "@/lib/auth-client";
import { getWishlist, removeFromWishlist } from "@/lib/fetch/wishlist";
import { getLibrary, addToLibrary, updateDownloadStatus } from "@/lib/fetch/library";



export default function MyBucket() {
  const { data: session } = authClient.useSession();
  const [activeTab, setActiveTab] = useState<"library" | "wishlist">("library");
  const [wishlistItems, setWishlistItems] = useState<Game[]>([]);
  const [ownedGames, setOwnedGames] = useState<Game[]>([]);
  
  // Game Details Modal State
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [isPurchasing, setIsPurchasing] = useState(false);

  // States for download animations
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [downloadProgress, setDownloadProgress] = useState<number>(0);
  const [downloadSpeed, setDownloadSpeed] = useState<string>("0 MB/s");
  const [installedIds, setInstalledIds] = useState<string[]>([]);

  // States for launch/play animation
  const [launchingGame, setLaunchingGame] = useState<Game | null>(null);
  const [launchStep, setLaunchStep] = useState<string>("");

  // States for CD Key Viewer
  const [activeKeyGame, setActiveKeyGame] = useState<Game | null>(null);

  // Sync state with backend API
  const loadData = () => {
    if (!session?.user?.id) {
      setWishlistItems([]);
      setOwnedGames([]);
      return;
    }

    // Load wishlist items
    getWishlist(session.user.id)
      .then((items) => {
        const games: Game[] = items.map((item: any) => ({
          id: item.gameId,
          title: item.game.title,
          description: item.game.description,
          genre: item.game.genre,
          price: item.game.price,
          platforms: item.game.platforms,
          coverUrl: item.game.coverUrl,
          rating: item.game.rating,
          releaseDate: item.game.releaseDate,
          developer: item.game.developer,
          publisher: item.game.publisher,
          creator: item.game.creator,
        }));
        setWishlistItems(games);
      })
      .catch((err) => console.error("Failed to fetch backend wishlist:", err));

    // Load owned/purchased games
    getLibrary(session.user.id)
      .then((items) => {
        const games: Game[] = items.map((item: any) => ({
          id: item.gameId,
          title: item.game.title,
          description: item.game.description,
          genre: item.game.genre,
          price: item.game.price,
          platforms: item.game.platforms,
          coverUrl: item.game.coverUrl,
          rating: item.game.rating,
          releaseDate: item.game.releaseDate,
          developer: item.game.developer,
          publisher: item.game.publisher,
          creator: item.game.creator,
        }));
        setOwnedGames(games);
        
        // Sync download/installed states
        const downloadedIds = items
          .filter((item: any) => item.downloadStatus === "downloaded")
          .map((item: any) => item.gameId);
        setInstalledIds(downloadedIds);
      })
      .catch((err) => console.error("Failed to fetch backend library:", err));
  };

  useEffect(() => {
    loadData();

    // Listen for custom wishlist update events
    const handleSync = () => loadData();
    window.addEventListener("questforge_wishlist_updated", handleSync);
    return () => {
      window.removeEventListener("questforge_wishlist_updated", handleSync);
    };
  }, [session?.user?.id]);

  // Generate CD license key deterministically to avoid React state-mutation during render
  const getLicenseKey = (game: Game) => {
    const cleanGenre = game.genre.substring(0, 3).toUpperCase();
    const idStr = game.id || "000000000000000000000000";
    const segment1 = idStr.substring(idStr.length - 4).toUpperCase();
    const segment2 = idStr.substring(0, 4).toUpperCase();
    return `QF-${cleanGenre}-${segment1}-${segment2}-2026`;
  };

  // Copy Key to Clipboard
  const handleCopyKey = (keyText: string) => {
    navigator.clipboard.writeText(keyText);
    toast.success("License key copied to clipboard!");
  };

  // Remove from wishlist database
  const handleRemoveFromWishlist = async (gameId: string) => {
    if (!session?.user?.id) return;
    try {
      await removeFromWishlist(session.user.id, gameId);
      const updated = wishlistItems.filter(item => item.id !== gameId);
      setWishlistItems(updated);
      window.dispatchEvent(new Event("questforge_wishlist_updated"));
      toast.success("Game removed from your wishlist.");
    } catch (err: any) {
      console.error("Failed to delete wishlist item:", err);
      toast.error("Failed to remove game from wishlist.");
    }
  };

  // Direct checkout/purchase from game details
  const handlePurchaseGame = (game: Game) => {
    if (!session?.user) {
      toast.warn("You must be logged in to purchase games.");
      return;
    }

    setIsPurchasing(true);
    
    setTimeout(async () => {
      try {
        // Add to database library
        await addToLibrary(session.user.id, session.user.email, game.id, game);

        // Remove from database wishlist
        await removeFromWishlist(session.user.id, game.id);
        
        // Refresh states
        loadData();
        window.dispatchEvent(new Event("questforge_wishlist_updated"));
        
        setIsPurchasing(false);
        setSelectedGame(null); // Close modal
        setActiveTab("library"); // Switch to library
        toast.success(`Purchase complete! "${game.title}" added to your vault.`);
      } catch (err: any) {
        console.error(err);
        setIsPurchasing(false);
        toast.error(err.message || "Failed to process transaction.");
      }
    }, 2000);
  };

  // Start Download animation and persist status to database
  const handleDownload = (gameId: string) => {
    if (downloadingId) {
      toast.info("Another game is currently downloading. Please wait.");
      return;
    }
    setDownloadingId(gameId);
    setDownloadProgress(0);
    setDownloadSpeed("48.5 MB/s");

    const interval = setInterval(() => {
      setDownloadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setDownloadingId(null);
          setInstalledIds(prevIds => [...prevIds, gameId]);
          
          if (session?.user?.id) {
            updateDownloadStatus(session.user.id, gameId, "downloaded")
              .then(() => {
                loadData();
              })
              .catch((err) => console.error("Failed to persist download status to backend:", err));
          }

          toast.success("Download complete! Game is ready to launch.");
          return 100;
        }
        const speed = (Math.random() * 15 + 40).toFixed(1);
        setDownloadSpeed(`${speed} MB/s`);
        return prev + Math.floor(Math.random() * 8 + 4);
      });
    }, 200);
  };

  // Start Launch/Play Animation
  const handlePlayGame = (game: Game) => {
    setLaunchingGame(game);
    setLaunchStep("Connecting to server...");
    
    setTimeout(() => {
      setLaunchStep("Synchronizing cloud saves...");
      setTimeout(() => {
        setLaunchStep("Injecting engine shaders...");
        setTimeout(() => {
          setLaunchStep("Launching viewport window...");
          setTimeout(() => {
            setLaunchingGame(null);
            setLaunchStep("");
            toast.success(`Enjoy playing ${game.title}!`);
          }, 600);
        }, 800);
      }, 800);
    }, 800);
  };

  // Wishlist math
  const wishlistCount = wishlistItems.length;
  const wishlistTotalValue = wishlistItems.reduce((acc, item) => acc + item.price, 0);
  const avgRating = wishlistCount > 0 
    ? (wishlistItems.reduce((acc, item) => acc + item.rating, 0) / wishlistCount).toFixed(1) 
    : "0.0";

  return (
    <div className="relative min-h-[calc(100vh-64px)] w-full py-16 px-4 bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      
      {/* Glow effects specific to this page layout */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-cyan-500/10 blur-[130px] animate-pulse" />
        <div className="absolute bottom-[20%] left-[-15%] w-[450px] h-[450px] rounded-full bg-violet-600/10 blur-[140px] animate-pulse" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto flex flex-col gap-8">
        
        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-200 dark:border-slate-800 pb-8">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2 self-start px-3 py-1 rounded-full border border-violet-200 dark:border-violet-500/30 bg-violet-50 dark:bg-violet-500/10 transition-colors duration-300">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-ping" />
              <span className="text-[9px] font-extrabold tracking-wider text-violet-700 dark:text-slate-300 uppercase">
                Gaming Inventory
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight bg-gradient-to-r from-violet-600 to-cyan-500 bg-clip-text text-transparent dark:from-violet-400 dark:to-cyan-400">
              My Gaming Vault
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xl transition-colors duration-300">
              Access your digital inventory. Download licenses, get activation keys, or review games you have added to your wishlist.
            </p>
          </div>

          {/* Library and Wishlist Navigation Tabs */}
          <div className="flex bg-slate-100 dark:bg-slate-900 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-800 shrink-0 font-bold">
            <button
              onClick={() => setActiveTab("library")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                activeTab === "library"
                  ? "bg-slate-900 dark:bg-white text-white dark:text-slate-950 shadow-lg"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0v3.75" />
              </svg>
              <span>Library Vault ({ownedGames.length})</span>
            </button>
            
            <button
              onClick={() => setActiveTab("wishlist")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer relative ${
                activeTab === "wishlist"
                  ? "bg-slate-900 dark:bg-white text-white dark:text-slate-950 shadow-lg"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
              </svg>
              <span>My Wishlist ({wishlistItems.length})</span>
              {wishlistItems.length > 0 && (
                <span className="absolute -top-1.5 -right-1 w-5 h-5 rounded-full bg-violet-600 text-white font-extrabold text-[9px] flex items-center justify-center animate-bounce shadow">
                  {wishlistItems.length}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* ==============================================================
            TAB 1: LIBRARY VAULT (Owned Games Library)
            ============================================================== */}
        {activeTab === "library" && (
          <div className="flex flex-col gap-6">
            
            {/* Library Mini Dashboard Info Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-900 text-slate-100 rounded-3xl p-6 border border-slate-800 shadow-xl">
              <div className="flex items-center gap-4 border-r border-slate-800/80 pr-4 last:border-0">
                <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 8.25V6a2.25 2.25 0 00-2.25-2.25H15m-3 12.5v3m0 0l-3-3m3 3l3-3m-9-6h9a2.25 2.25 0 012.25 2.25V15a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 15V8.25A2.25 2.25 0 016.75 6z" />
                  </svg>
                </div>
                <div>
                  <div className="text-[10px] uppercase font-bold tracking-widest text-slate-400">Inventory Status</div>
                  <div className="text-sm font-black text-cyan-400">ALL SERVICES ONLINE</div>
                </div>
              </div>
              
              <div className="flex items-center gap-4 border-r border-slate-800/80 pr-4 last:border-0">
                <div className="w-10 h-10 rounded-2xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" />
                  </svg>
                </div>
                <div>
                  <div className="text-[10px] uppercase font-bold tracking-widest text-slate-400">Vault Gaming Time</div>
                  <div className="text-sm font-black text-white">124.8 HOURS PLAYED</div>
                </div>
              </div>

              <div className="flex items-center gap-4 last:border-0">
                <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <div className="text-[10px] uppercase font-bold tracking-widest text-slate-400">License Authenticity</div>
                  <div className="text-sm font-black text-emerald-400">100% VERIFIED SECURE</div>
                </div>
              </div>
            </div>

            {/* Grid Container */}
            {ownedGames.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {ownedGames.map((game) => {
                  const isDownloading = downloadingId === game.id;
                  const isInstalled = installedIds.includes(game.id) || game.id.startsWith("owned_g");
                  
                  return (
                    <div 
                      key={game.id}
                      className="group relative bg-slate-950 rounded-2xl overflow-hidden border border-slate-900/60 shadow-xl flex flex-col transition-all duration-300 hover:shadow-[0_10px_25px_-5px_rgba(109,40,217,0.3)] hover:-translate-y-1"
                    >
                      <div className="relative aspect-[2/3] w-full overflow-hidden bg-slate-900 shrink-0">
                        <img
                          src={game.coverUrl}
                          alt={game.title}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                          loading="lazy"
                        />
                        
                        <div className="absolute inset-0 bg-black/80 flex flex-col justify-center items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 px-4 text-center">
                          <h4 className="text-white font-extrabold text-sm mb-1 line-clamp-2">
                            {game.title}
                          </h4>
                          
                          {isInstalled && !isDownloading ? (
                            <button
                              onClick={() => handlePlayGame(game)}
                              className="w-full py-2 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white rounded-xl text-xs font-black shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
                            >
                              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20">
                                <path d="M4 4a1 1 0 011-1h1.5a1 1 0 01.8 1.4L5.4 9.2a1 1 0 01-1.6-.8V4zm10.5 0a1 1 0 011-1H17a1 1 0 011 1v4.4a1 1 0 01-1.6.8l-1.9-3.8a1 1 0 01.8-1.4zM5.4 10.8a1 1 0 011.6-.8l1.9 3.8a1 1 0 01-.8 1.4H6.5a1 1 0 01-1-1v-3.4zm9.2-.8a1 1 0 01.8 1.4v3.4a1 1 0 01-1 1H13a1 1 0 01-.8-1.4l1.4-3a1 1 0 01.8-1.4z" />
                                <path d="M9.3 8.3a1 1 0 011.4 0l1 1a1 1 0 010 1.4l-1 1a1 1 0 01-1.4 0l-1-1a1 1 0 010-1.4l1-1z" />
                              </svg>
                              <span>Play Now</span>
                            </button>
                          ) : !isDownloading ? (
                            <button
                              onClick={() => handleDownload(game.id)}
                              className="w-full py-2 bg-violet-600 hover:bg-violet-500 text-white rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
                            >
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                              </svg>
                              <span>Download</span>
                            </button>
                          ) : (
                            <div className="w-full text-left space-y-1 mt-1 bg-slate-900/90 border border-slate-800 p-2 rounded-xl">
                              <div className="flex items-center justify-between text-[8px] font-bold text-slate-400">
                                <span>DOWNLOADING</span>
                                <span className="text-cyan-400 font-extrabold">{downloadProgress}%</span>
                              </div>
                              <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden">
                                <div className="h-full bg-cyan-400 rounded-full transition-all duration-200" style={{ width: `${downloadProgress}%` }} />
                              </div>
                              <div className="text-[8px] text-right font-black text-slate-500 tracking-wider">
                                {downloadSpeed}
                              </div>
                            </div>
                          )}

                          <button
                            onClick={() => setActiveKeyGame(game)}
                            className="w-full py-2 bg-slate-900 border border-slate-800 hover:bg-slate-800 hover:border-slate-700 text-slate-300 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" />
                            </svg>
                            <span>CD License Key</span>
                          </button>
                        </div>
                        
                        {isDownloading && (
                          <div className="absolute top-2 left-2 px-2 py-0.5 rounded font-extrabold text-[8px] uppercase tracking-wider bg-cyan-500 text-slate-950 shadow border border-cyan-300/35">
                            Syncing...
                          </div>
                        )}
                        {!isInstalled && !isDownloading && (
                          <div className="absolute top-2 left-2 px-2 py-0.5 rounded font-extrabold text-[8px] uppercase tracking-wider bg-slate-950/80 text-slate-400 shadow border border-slate-800">
                            Not Installed
                          </div>
                        )}
                      </div>

                      <div className="p-4 flex flex-col gap-1 min-h-0 bg-slate-950 flex-1 border-t border-slate-900">
                        <span className="text-[8px] font-black uppercase text-violet-400 tracking-wider">
                          {game.genre}
                        </span>
                        <h3 className="text-xs font-black text-slate-100 truncate group-hover:text-cyan-400 transition-colors">
                          {game.title}
                        </h3>
                        <p className="text-[9px] text-slate-500 mt-0.5 font-semibold">
                          Purchased: {game.releaseDate}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="w-full flex flex-col items-center justify-center text-center p-16 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800 bg-white/40 dark:bg-slate-900/20 backdrop-blur-sm gap-5">
                <div className="w-16 h-16 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.125a3.75 3.75 0 01-3.75 3.75H8.125a3.75 3.75 0 01-3.75-3.75L3.75 7.5m16.5 0H3.75m16.5 0a4.87 4.87 0 00-1.875-3.953A4.87 4.87 0 0012 2.25a4.87 4.87 0 00-4.625 1.297 4.87 4.87 0 00-1.875 3.953m15.15 0a45.07 45.07 0 00-7.5 0m0 0a45.07 45.07 0 00-7.5 0" />
                  </svg>
                </div>
                <div className="space-y-1.5">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">Your library is empty</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs">
                    Buy games from the View Games directory to populate your library vault!
                  </p>
                </div>
                <Link href="/games" className="px-5 py-3 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-violet-600 to-cyan-500 hover:opacity-95 shadow-md transition-all active:scale-[0.98]">
                  Browse Marketplace
                </Link>
              </div>
            )}
          </div>
        )}

        {/* ==============================================================
            TAB 2: MY WISHLIST
            ============================================================== */}
        {activeTab === "wishlist" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Wishlist Items List */}
            <div className="lg:col-span-2 flex flex-col gap-4">
              {wishlistItems.length > 0 ? (
                wishlistItems.map((item) => (
                  <div 
                    key={item.id}
                    className="flex flex-col sm:flex-row items-center gap-4 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/50 dark:border-slate-800/40 shadow-sm text-slate-900 dark:text-slate-100 transition-colors"
                  >
                    {/* Square Artwork */}
                    <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0 bg-slate-100 dark:bg-slate-950 border border-slate-200/40 dark:border-slate-800/40">
                      <img src={item.coverUrl} alt={item.title} className="w-full h-full object-cover" />
                    </div>

                    {/* Metadata */}
                    <div className="flex-1 min-w-0 text-center sm:text-left">
                      <div className="flex items-center justify-center sm:justify-start gap-2">
                        <h3 className="font-extrabold text-sm text-slate-900 dark:text-white truncate">
                          {item.title}
                        </h3>
                        <span className="px-1.5 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider bg-slate-100 dark:bg-slate-950 text-slate-500 dark:text-slate-400 border border-slate-200/60 dark:border-slate-800/30">
                          {item.genre}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 line-clamp-1 leading-normal">
                        {item.description}
                      </p>
                      <div className="flex items-center justify-center sm:justify-start gap-3 mt-1 text-[9px] text-slate-500 dark:text-slate-400 font-semibold">
                        <span>Released: {item.releaseDate}</span>
                      </div>
                    </div>

                    {/* Actions: View Details and Delete */}
                    <div className="flex sm:flex-col items-center justify-between sm:justify-center gap-4 sm:gap-2.5 self-stretch sm:self-auto sm:border-l border-slate-200 dark:border-slate-800/60 pl-0 sm:pl-4 pt-3 sm:pt-0 shrink-0">
                      <span className="font-black text-sm text-violet-600 dark:text-violet-400">
                        {item.price === 0 ? "Free" : `$${item.price.toFixed(2)}`}
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setSelectedGame(item)}
                          className="px-3.5 py-2 rounded-xl text-[10px] font-extrabold text-white bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-violet-600 dark:hover:bg-violet-600 hover:text-white dark:hover:text-white transition-all cursor-pointer border border-slate-900 dark:border-slate-800 shadow"
                        >
                          View Details
                        </button>
                        <button
                          onClick={() => handleRemoveFromWishlist(item.id)}
                          className="p-2 rounded-xl text-rose-500 hover:bg-rose-500/10 transition-colors cursor-pointer border border-rose-500/20"
                          title="Remove from wishlist"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-1.816A2.25 2.25 0 0122.222 12H19.5" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="w-full flex flex-col items-center justify-center text-center p-16 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800 bg-white/40 dark:bg-slate-900/20 backdrop-blur-sm gap-4">
                  <div className="w-16 h-16 rounded-full bg-violet-500/10 flex items-center justify-center text-violet-600 dark:text-violet-400">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                    </svg>
                  </div>
                  <div className="space-y-1.5">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">Your wishlist is empty</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs">
                      Explore the marketplace and wishlist some games to track them here.
                    </p>
                  </div>
                  <Link href="/games" className="px-5 py-3 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-violet-600 to-cyan-500 hover:opacity-95 shadow-md transition-all active:scale-[0.98]">
                    Explore Marketplace
                  </Link>
                </div>
              )}
            </div>

            {/* Gamer Statistics Sidebar */}
            <div className="flex flex-col gap-4">
              <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/50 dark:border-slate-800/40 p-6 shadow-sm flex flex-col gap-5 text-slate-900 dark:text-slate-100 transition-colors">
                <h3 className="font-extrabold text-base border-b border-slate-100 dark:border-slate-800 pb-3">
                  Wishlist Overview
                </h3>

                <div className="space-y-3.5 text-xs">
                  <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
                    <span>Wishlisted Items</span>
                    <span className="font-bold">{wishlistCount}</span>
                  </div>
                  
                  <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
                    <span>Estimated Cost</span>
                    <span className="font-bold text-violet-600 dark:text-violet-400">${wishlistTotalValue.toFixed(2)}</span>
                  </div>

                  <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
                    <span>Average Rating</span>
                    <span className="font-bold text-amber-500">★ {avgRating}</span>
                  </div>

                  <div className="flex flex-col gap-2 border-t border-slate-100 dark:border-slate-800 pt-4 mt-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Gamer Status</span>
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-xl bg-violet-600 text-white font-extrabold text-[10px] flex items-center justify-center shadow">
                        Lvl 4
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between text-[9px] font-bold">
                          <span>EXP Progress</span>
                          <span>72%</span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-950 rounded-full overflow-hidden">
                          <div className="h-full bg-violet-500" style={{ width: "72%" }} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Secure Info Alert card */}
              <div className="bg-slate-100/50 dark:bg-slate-900/30 border border-slate-200/40 dark:border-slate-800/30 rounded-2xl p-5 text-[10px] text-slate-500 dark:text-slate-400 leading-relaxed flex items-start gap-3">
                <svg className="w-5 h-5 text-violet-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 11.75 1.3l-.041.02a.75.75 0 01-.75-1.3zM12 4.5c4.14 0 7.5 3.36 7.5 7.5S16.14 19.5 12 19.5 4.5 16.14 4.5 12 7.86 4.5 12 4.5zm0-1.5C6.48 3 2 7.48 2 12s4.48 9 9 9 9-4.48 9-9S17.52 3 12 3z" />
                </svg>
                <p>
                  Wishlist contains items saved for direct procurement. Review a game's details view to confirm platform validation and unlock digital keys instantly.
                </p>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* ==============================================================
          GAME DETAILS VIEW MODAL (Supports direct checkout)
          ============================================================== */}
      {selectedGame && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md transition-opacity duration-300">
          <div className="relative w-full max-w-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-900 shadow-2xl rounded-3xl p-6 flex flex-col md:flex-row gap-6 text-slate-900 dark:text-slate-100 overflow-hidden max-h-[90vh] overflow-y-auto">
            
            {/* Ambient background decoration */}
            <div className="absolute top-0 right-0 w-[200px] h-[200px] rounded-full bg-violet-600/10 blur-[50px] pointer-events-none" />

            {/* Left Column: Image Artwork & Actions */}
            <div className="w-full md:w-2/5 shrink-0 flex flex-col gap-4">
              <div className="aspect-[3/4] w-full rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-905 bg-slate-900 border border-slate-200/50 dark:border-slate-800/40 shadow-md">
                <img src={selectedGame.coverUrl} alt={selectedGame.title} className="w-full h-full object-cover" />
              </div>
              <span className="text-center font-black text-2xl text-violet-600 dark:text-violet-400">
                {selectedGame.price === 0 ? "Free" : `$${selectedGame.price.toFixed(2)}`}
              </span>
            </div>

            {/* Right Column: Game Info */}
            <div className="flex-1 flex flex-col justify-between gap-5">
              <div className="space-y-4">
                
                {/* Header title */}
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <span className="px-2 py-0.5 rounded text-[8px] font-extrabold uppercase tracking-widest bg-violet-500/10 text-violet-600 dark:text-violet-400 border border-violet-500/20">
                      {selectedGame.genre}
                    </span>
                    <h2 className="text-xl sm:text-2xl font-black text-slate-950 dark:text-white leading-tight">
                      {selectedGame.title}
                    </h2>
                  </div>
                  
                  {/* Close button */}
                  <button
                    onClick={() => setSelectedGame(null)}
                    className="w-8 h-8 shrink-0 flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors cursor-pointer border border-slate-200/50 dark:border-slate-800/60"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* Rating & Platforms */}
                <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-500 dark:text-slate-400 border-y border-slate-100 dark:border-slate-900 py-3">
                  <div className="flex items-center gap-1">
                    <span className="text-amber-500">★</span>
                    <span className="text-slate-800 dark:text-white font-extrabold">{(selectedGame.rating ?? 5.0).toFixed(1)}</span>
                    <span>Rating</span>
                  </div>
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-200 dark:bg-slate-800" />
                  <div>
                    <span>Released: </span>
                    <span className="text-slate-800 dark:text-white font-extrabold">{selectedGame.releaseDate}</span>
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-1.5">
                  <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Quest Summary</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                    {selectedGame.description}
                  </p>
                </div>

                {/* Platforms supported */}
                <div className="space-y-1.5">
                  <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">System Specifications</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedGame.platforms.map((plat) => (
                      <span
                        key={plat}
                        className="px-2.5 py-1 rounded-md text-[9px] font-bold bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-400 border border-slate-200/50 dark:border-slate-800/40"
                      >
                        {plat}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 border-t border-slate-100 dark:border-slate-900 pt-4 mt-2">
                <button
                  type="button"
                  onClick={() => setSelectedGame(null)}
                  disabled={isPurchasing}
                  className="flex-1 py-3 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => handlePurchaseGame(selectedGame)}
                  disabled={isPurchasing}
                  className="flex-[2] py-3 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-violet-600 to-cyan-500 hover:opacity-95 shadow-md active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isPurchasing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Verifying Payment...</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>Unlock License Keys</span>
                    </>
                  )}
                </button>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* ==============================================================
          LAUNCH ANIMATION SCREEN OVERLAY (Dark glassmorphic vault overlay)
          ============================================================== */}
      {launchingGame && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md transition-opacity duration-300">
          <div className="w-full max-w-sm bg-slate-950/80 border border-cyan-500/30 rounded-3xl p-8 flex flex-col items-center justify-center text-center gap-6 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-pulse" />
            
            <div className="w-16 h-16 rounded-full border-4 border-slate-800 border-t-cyan-400 flex items-center justify-center animate-spin">
              <svg className="w-8 h-8 text-cyan-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM14.243 14.243a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM10 16a1 1 0 100-2v-1a1 1 0 10-2 0v1a1 1 0 102 0zm-4.243-1.757a1 1 0 00-1.414 1.414l.707.707a1 1 0 001.414-1.414l-.707-.707zM3 10a1 1 0 011-1h1a1 1 0 110 2H4a1 1 0 01-1-1zm1.757-4.243a1 1 0 001.414 1.414l.707-.707A1 1 0 005.757 4.243l-.707.707z" />
              </svg>
            </div>

            <div className="space-y-3">
              <h2 className="text-xs font-black tracking-widest text-cyan-400 uppercase">
                LAUNCHING QUEST VIRTUAL PORT
              </h2>
              <h3 className="text-xl font-extrabold text-white">
                {launchingGame.title}
              </h3>
              <p className="text-[10px] text-slate-500 font-mono tracking-wider animate-pulse">
                {launchStep}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ==============================================================
          CD KEY VIEWER DIALOG MODAL (Gamer License Key)
          ============================================================== */}
      {activeKeyGame && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm transition-opacity duration-300">
          <div className="relative w-full max-w-md bg-slate-950 border border-slate-800 shadow-2xl rounded-3xl p-6 flex flex-col gap-6 text-slate-100">
            
            <div className="flex items-center justify-between border-b border-slate-900 pb-4">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-violet-500 animate-pulse" />
                <h2 className="text-base font-black tracking-tight text-white">
                  License Keys & Activation
                </h2>
              </div>
              <button
                onClick={() => setActiveKeyGame(null)}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-900 text-slate-400 hover:text-white transition-colors cursor-pointer border border-slate-900"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-4 bg-slate-900/60 p-3 rounded-2xl border border-slate-900">
                <img src={activeKeyGame.coverUrl} alt={activeKeyGame.title} className="w-12 h-16 object-cover rounded-lg" />
                <div className="min-w-0">
                  <div className="text-[9px] uppercase font-bold text-violet-400">{activeKeyGame.genre}</div>
                  <div className="text-sm font-black text-white truncate">{activeKeyGame.title}</div>
                  <div className="text-[10px] text-slate-400">Secure Digital License</div>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-bold text-slate-400 tracking-wider uppercase">
                  Product Activation Code (CD Key)
                </label>
                <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-xl p-3.5 font-mono text-xs select-all text-cyan-400 tracking-widest justify-center font-bold">
                  <span>{getLicenseKey(activeKeyGame)}</span>
                </div>
                <p className="text-[9px] text-slate-500 leading-normal">
                  Redeem this CD Key inside your client launcher (e.g. Steam, Epic, GoG) to bind this copy to your account permanently.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 border-t border-slate-900 pt-4">
              <button
                type="button"
                onClick={() => setActiveKeyGame(null)}
                className="px-4 py-2.5 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer border border-slate-900"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => handleCopyKey(getLicenseKey(activeKeyGame))}
                className="px-4.5 py-2.5 rounded-xl text-xs font-bold bg-violet-600 hover:bg-violet-500 text-white shadow active:scale-95 transition-all cursor-pointer flex items-center gap-1.5"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H5.4M7.5 2.25h9.75a1.125 1.125 0 011.125 1.125v15.625c0 .621-.504 1.125-1.125 1.125H7.5A1.125 1.125 0 016.375 19V3.375C6.375 2.754 6.879 2.25 7.5 2.25z" />
                </svg>
                <span>Copy Activation Key</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
