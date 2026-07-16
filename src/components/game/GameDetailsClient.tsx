"use client";

import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { getWishlist, addToWishlist, removeFromWishlist } from "@/lib/fetch/wishlist";
import { getLibrary, addToLibrary } from "@/lib/fetch/library";
import { getReviews, addReview } from "@/lib/fetch/reviews";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

export interface Game {
  id: string;
  title: string;
  description: string;
  genre: string;
  price: number;
  platforms: string[];
  coverUrl: string;
  rating: number;
  releaseDate: string;
  createdAt?: string;
  developer?: string;
  publisher?: string;
  creator?: {
    id: string;
    name: string;
    email: string;
    image: string | null;
  };
}

interface GameDetailsClientProps {
  game: Game;
}

interface Review {
  id: string;
  author: string;
  rating: number;
  comment: string;
  date: string;
}

export default function GameDetailsClient({ game }: GameDetailsClientProps) {
  const { data: session } = authClient.useSession();
  const [wishlisted, setWishlisted] = useState(false);
  const [owned, setOwned] = useState(false);
  
  // Interactive reviews state (empty by default, loaded from backend)
  const [reviews, setReviews] = useState<Review[]>([]);

  // Form states
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewComment, setNewReviewComment] = useState("");

  // Fetch initial reviews, wishlist, and library status from the backend
  useEffect(() => {
    // Load reviews
    getReviews(game.id)
      .then((items) => {
        const mapped: Review[] = items.map((item: any) => ({
          id: item._id ? item._id.toString() : item.id,
          author: item.author,
          rating: item.rating,
          comment: item.comment,
          date: item.date,
        }));
        setReviews(mapped);
      })
      .catch((err) => console.error("Failed to load reviews:", err));

    if (!session?.user?.id) return;
    
    getWishlist(session.user.id)
      .then((wishlist) => {
        setWishlisted(wishlist.some((item: any) => item.gameId === game.id));
      })
      .catch((err) => console.error("Failed to load wishlist:", err));

    getLibrary(session.user.id)
      .then((library) => {
        setOwned(library.some((item: any) => item.gameId === game.id));
      })
      .catch((err) => console.error("Failed to load library owned games:", err));
  }, [game.id, session?.user?.id]);

  // Handle Add to Wishlist via Backend API
  const handleWishlistToggle = async () => {
    if (!session?.user) {
      toast.warn("You must be logged in to manage your wishlist.");
      return;
    }

    try {
      if (wishlisted) {
        // Remove from database wishlist
        await removeFromWishlist(session.user.id, game.id);
        setWishlisted(false);
        toast.success(`Removed "${game.title}" from your wishlist.`);
      } else {
        // Add to database wishlist
        await addToWishlist(session.user.id, session.user.email, game.id, game);
        setWishlisted(true);
        toast.success(`Added "${game.title}" to your wishlist!`);
      }

      window.dispatchEvent(new Event("questforge_wishlist_updated"));
    } catch (err: any) {
      console.error("Wishlist toggle error:", err);
      toast.error(err.message || "Failed to update wishlist.");
    }
  };

  // Handle Buy Now (Unlock Key)
  const handleBuyNow = async () => {
    if (owned) {
      toast.info(`You already own "${game.title}"!`);
      return;
    }

    if (!session?.user) {
      toast.warn("You must be logged in to buy games.");
      return;
    }

    try {
      // Add to database library
      await addToLibrary(session.user.id, session.user.email, game.id, game);
      setOwned(true);

      // Remove from wishlist database if exists
      try {
        await removeFromWishlist(session.user.id, game.id);
        setWishlisted(false);
      } catch (err) {
        console.warn("Failed to delete wishlisted game on purchase:", err);
      }

      window.dispatchEvent(new Event("questforge_wishlist_updated"));
      toast.success(`Congratulations! "${game.title}" has been added to your Library Vault.`);
    } catch (err: any) {
      console.error("Purchase failed:", err);
      toast.error(err.message || "Failed to process payment.");
    }
  };

  // Handle submit review via Backend API
  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!session?.user) {
      toast.warn("You must be logged in to post reviews.");
      return;
    }

    if (!owned) {
      toast.error("Only players who own this game can post reviews.");
      return;
    }

    if (!newReviewComment.trim()) {
      toast.warn("Please write a comment.");
      return;
    }

    try {
      const authorName = session.user.name || "Anonymous Player";
      await addReview(game.id, session.user.id, authorName, newReviewRating, newReviewComment.trim());

      setNewReviewComment("");
      setNewReviewRating(5);
      toast.success("Review posted successfully!");

      // Refresh reviews list
      getReviews(game.id)
        .then((items) => {
          const mapped: Review[] = items.map((item: any) => ({
            id: item._id ? item._id.toString() : item.id,
            author: item.author,
            rating: item.rating,
            comment: item.comment,
            date: item.date,
          }));
          setReviews(mapped);
        })
        .catch((err) => console.error("Failed to load reviews:", err));
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to post review.");
    }
  };

  // Star Rating Calculation
  const totalStars = 5;
  const ratingCounts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  reviews.forEach((r) => {
    const star = Math.min(5, Math.max(1, Math.round(r.rating))) as 5 | 4 | 3 | 2 | 1;
    ratingCounts[star]++;
  });

  const chartData = [
    { name: "5 ★", count: ratingCounts[5] },
    { name: "4 ★", count: ratingCounts[4] },
    { name: "3 ★", count: ratingCounts[3] },
    { name: "2 ★", count: ratingCounts[2] },
    { name: "1 ★", count: ratingCounts[1] },
  ].reverse(); // reverse so 5 star is at the top of the vertical bar list

  // Format creation timestamp
  const dateFormatted = game.createdAt 
    ? new Date(game.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Recently Listed";

  const formattedPrice = game.price === 0 ? "Free" : `$${game.price.toFixed(2)}`;

  return (
    <div className="relative min-h-[calc(100vh-64px)] w-full py-16 px-4 overflow-hidden bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      {/* Glow blobs */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-[-10%] w-[350px] h-[350px] rounded-full bg-violet-600/10 blur-[120px]" />
        <div className="absolute bottom-1/4 right-[-10%] w-[450px] h-[450px] rounded-full bg-cyan-500/10 blur-[150px]" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto flex flex-col gap-10">
        
        {/* Navigation Breadcrumb */}
        <Link 
          href="/games" 
          className="w-fit flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-violet-600 dark:hover:text-violet-400 transition-colors duration-200"
        >
          <span>← Back to Catalog</span>
        </Link>

        {/* Hero Section Container */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          
          {/* Left Block: Image & Meta */}
          <div className="md:col-span-5 flex flex-col gap-6">
            <div className="relative aspect-video md:aspect-[4/5] rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-xl bg-slate-900">
              <img 
                src={game.coverUrl} 
                alt={game.title} 
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-slate-950/80 backdrop-blur-md border border-slate-800 text-white font-extrabold text-xs">
                {game.genre}
              </div>
            </div>
            
            {/* Listing Attribution */}
            <div className="p-5 rounded-3xl border border-slate-200/60 dark:border-slate-800 bg-white/70 dark:bg-slate-900/50 backdrop-blur-md">
              <span className="text-[10px] uppercase tracking-wider font-extrabold text-slate-400 dark:text-slate-500 block mb-3">
                Quest Listing Metadata
              </span>
              <div className="flex flex-col gap-4">
                {game.creator && (
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-violet-100 dark:bg-violet-950/40 border border-violet-500/20 flex items-center justify-center shrink-0">
                      {game.creator.image ? (
                        <img src={game.creator.image} alt={game.creator.name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="font-black text-violet-500 dark:text-violet-400 text-sm">
                          {game.creator.name[0].toUpperCase()}
                        </span>
                      )}
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-xs text-slate-400 font-medium">Created By</span>
                      <span className="text-sm font-bold text-slate-800 dark:text-slate-200 truncate">
                        {game.creator.name}
                      </span>
                    </div>
                  </div>
                )}
                
                <div className="flex flex-col">
                  <span className="text-xs text-slate-400 font-medium">Creation Date</span>
                  <span className="text-sm font-bold text-slate-800 dark:text-slate-200">
                    {dateFormatted}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Block: Content, Chart, Actions */}
          <div className="md:col-span-7 flex flex-col gap-6">
            
            {/* Game Info Details Card */}
            <div className="p-6 sm:p-8 rounded-3xl border border-slate-200/60 dark:border-slate-800 bg-white/70 dark:bg-slate-900/50 backdrop-blur-md flex flex-col gap-5">
              <div className="flex flex-col gap-2">
                <h1 className="text-2xl sm:text-4xl font-black text-slate-950 dark:text-white leading-tight">
                  {game.title}
                </h1>
                <div className="flex flex-wrap items-center gap-3 mt-1">
                  <div className="flex items-center gap-1 text-amber-500 text-sm font-extrabold">
                    <span>★</span>
                    <span className="text-slate-800 dark:text-white">
                      {(game.rating ?? 5.0).toFixed(1)}
                    </span>
                  </div>
                  <span className="text-slate-300 dark:text-slate-800">|</span>
                  <div className="flex gap-1">
                    {game.platforms.map((plat) => (
                      <span 
                        key={plat} 
                        className="px-2 py-0.5 rounded-md text-[9px] font-extrabold bg-slate-100 dark:bg-slate-950 text-slate-500 dark:text-slate-400 border border-slate-200/50 dark:border-slate-800/30"
                      >
                        {plat}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="text-3xl font-black text-slate-900 dark:text-white">
                {formattedPrice}
              </div>

              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800/50 pt-5">
                {game.description}
              </p>

              {/* Developer & Publisher Specification */}
              {(game.developer || game.publisher) && (
                <div className="grid grid-cols-2 gap-4 border-t border-slate-100 dark:border-slate-800/50 pt-4 text-xs">
                  {game.developer && (
                    <div className="flex flex-col gap-0.5">
                      <span className="text-slate-400 font-semibold">Developer</span>
                      <span className="font-extrabold text-slate-800 dark:text-slate-200">{game.developer}</span>
                    </div>
                  )}
                  {game.publisher && (
                    <div className="flex flex-col gap-0.5">
                      <span className="text-slate-400 font-semibold">Publisher</span>
                      <span className="font-extrabold text-slate-800 dark:text-slate-200">{game.publisher}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Purchase/Wishlist Action Buttons */}
              {!session?.user && (
                <div className="flex items-center gap-3 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-650 dark:text-amber-400 text-xs font-bold transition-all duration-200">
                  <span className="text-sm">⚠️</span>
                  <span>Please sign in to buy this game or add it to your wishlist.</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 border-t border-slate-100 dark:border-slate-800/50 pt-5">
                <button
                  onClick={handleWishlistToggle}
                  disabled={owned}
                  className={`w-full py-3.5 rounded-2xl font-black text-sm border transition-all duration-250 cursor-pointer active:scale-[0.98] ${
                    owned
                      ? "bg-slate-200 border-slate-200 text-slate-400 dark:bg-slate-800 dark:border-slate-800 dark:text-slate-600 cursor-not-allowed"
                      : wishlisted
                      ? "bg-amber-500/10 border-amber-500/30 text-amber-600 dark:text-amber-400 hover:bg-amber-500/20"
                      : "bg-slate-100 dark:bg-slate-950 hover:bg-violet-600 hover:text-white border-slate-200 dark:border-slate-800 hover:border-violet-600 dark:hover:border-violet-600 text-slate-700 dark:text-slate-300"
                  }`}
                >
                  {owned ? "In Library" : wishlisted ? "★ Wishlisted" : "☆ Add to Wishlist"}
                </button>

                <button
                  onClick={handleBuyNow}
                  className={`w-full py-3.5 rounded-2xl font-black text-sm text-white transition-all duration-250 cursor-pointer active:scale-[0.98] ${
                    owned
                      ? "bg-gradient-to-r from-emerald-500 to-teal-500 opacity-90"
                      : "bg-gradient-to-r from-violet-600 to-cyan-500 hover:shadow-lg hover:shadow-violet-500/20"
                  }`}
                >
                  {owned ? "✓ Owned (Unlocked)" : "Unlock License Key (Buy)"}
                </button>
              </div>
            </div>

            {/* Recharts Review Star distribution bar chart */}
            <div className="p-6 rounded-3xl border border-slate-200/60 dark:border-slate-800 bg-white/70 dark:bg-slate-900/50 backdrop-blur-md flex flex-col gap-4">
              <div>
                <h3 className="text-sm font-black text-slate-900 dark:text-white">
                  Rating Distribution
                </h3>
                <p className="text-xs text-slate-400">
                  Spread of reviews submitted by developers and players.
                </p>
              </div>

              <div className="w-full h-44 mt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart 
                    data={chartData} 
                    layout="vertical" 
                    margin={{ top: 5, right: 20, left: -20, bottom: 5 }}
                  >
                    <XAxis type="number" hide />
                    <YAxis 
                      dataKey="name" 
                      type="category" 
                      tick={{ fill: "#64748b", fontSize: 11, fontWeight: "bold" }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip 
                      cursor={{ fill: "transparent" }}
                      contentStyle={{ 
                        background: "#0f172a", 
                        border: "1px solid #334155", 
                        borderRadius: "8px",
                        fontSize: "11px",
                        color: "#fff"
                      }}
                    />
                    <Bar dataKey="count" radius={[0, 4, 4, 0]} barSize={12}>
                      {chartData.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={index === 0 ? "#8b5cf6" : index === 1 ? "#06b6d4" : "#94a3b8"} 
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            
          </div>
        </div>

        {/* Review Submission & Comments Section */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mt-4">
          
          {/* Write a Review Form */}
          <div className="md:col-span-5">
            {owned ? (
              <div className="p-6 rounded-3xl border border-slate-200/60 dark:border-slate-800 bg-white/70 dark:bg-slate-900/50 backdrop-blur-md flex flex-col gap-4">
                <h3 className="text-base font-black text-slate-950 dark:text-white">
                  Submit Review
                </h3>
                
                <form onSubmit={handleSubmitReview} className="flex flex-col gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-500 dark:text-slate-400">
                      Rating (Stars)
                    </label>
                    <select
                      value={newReviewRating}
                      onChange={(e) => setNewReviewRating(Number(e.target.value))}
                      className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-950 dark:text-white text-xs outline-none focus:border-violet-500 transition-colors"
                    >
                      <option value={5}>5 Stars ★★★★★</option>
                      <option value={4}>4 Stars ★★★★</option>
                      <option value={3}>3 Stars ★★★</option>
                      <option value={2}>2 Stars ★★</option>
                      <option value={1}>1 Star ★</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-500 dark:text-slate-400">
                      Your Review Comment
                    </label>
                    <textarea
                      rows={4}
                      value={newReviewComment}
                      onChange={(e) => setNewReviewComment(e.target.value)}
                      placeholder="Tell us what you think of this game..."
                      className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-950 dark:text-white text-xs outline-none focus:border-violet-500 transition-colors resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl font-bold text-xs text-white bg-violet-600 hover:bg-violet-700 transition-all duration-200 cursor-pointer active:scale-[0.98]"
                  >
                    Post Review
                  </button>
                </form>
              </div>
            ) : (
              <div className="p-6 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800 bg-white/40 dark:bg-slate-900/20 backdrop-blur-md flex flex-col items-center justify-center text-center p-8 gap-4 min-h-[300px]">
                <div className="w-12 h-12 rounded-full bg-violet-500/10 flex items-center justify-center text-violet-600 dark:text-violet-400">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                  </svg>
                </div>
                <div className="space-y-1.5">
                  <h4 className="text-sm font-bold text-slate-950 dark:text-white">Form Locked</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 max-w-[200px] leading-relaxed mx-auto">
                    Only players who own this game can post reviews.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Player Feedbacks & Comments list */}
          <div className="md:col-span-7 flex flex-col gap-4">
            <h3 className="text-base font-black text-slate-950 dark:text-white">
              Player Reviews ({reviews.length})
            </h3>
            
            <div className="flex flex-col gap-4 max-h-[500px] overflow-y-auto pr-2">
              {reviews.map((rev) => (
                <div 
                  key={rev.id}
                  className="p-5 rounded-3xl border border-slate-200/50 dark:border-slate-800/80 bg-white/50 dark:bg-slate-900/30 backdrop-blur-md flex flex-col gap-2.5"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-slate-200 dark:bg-slate-800 font-extrabold text-[10px] text-slate-600 dark:text-slate-400 flex items-center justify-center border border-slate-300/40 dark:border-slate-700/40">
                        {rev.author[0].toUpperCase()}
                      </div>
                      <span className="text-xs font-bold text-slate-950 dark:text-white">
                        {rev.author}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400">
                      {rev.date}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 text-amber-500 text-[10px]">
                    {Array.from({ length: rev.rating }).map((_, i) => (
                      <span key={i}>★</span>
                    ))}
                    {Array.from({ length: totalStars - rev.rating }).map((_, i) => (
                      <span key={i} className="text-slate-300 dark:text-slate-700">★</span>
                    ))}
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {rev.comment}
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
