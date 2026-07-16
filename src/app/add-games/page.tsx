"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { uploadImageToImgBB } from "@/lib/imgbb";
import { toast } from "react-toastify";
import { Rocket } from "@gravity-ui/icons";
import { addGames } from "@/lib/fetch/add-games";

const GENRES = [
  "Action",
  "RPG",
  "Indie",
  "Strategy",
  "Adventure",
  "Simulation",
  "Shooter",
  "Racing",
  "Sports",
];

const PLATFORMS = ["PC", "PS5", "Xbox Series X/S", "Nintendo Switch"];

export default function AddGamesPage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  // Form states
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [genre, setGenre] = useState("");
  const [price, setPrice] = useState("");
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [developer, setDeveloper] = useState("");
  const [publisher, setPublisher] = useState("");

  // Cover image states
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);

  // Loading state
  const [isLoading, setIsLoading] = useState(false);

  // Clean up Object URL on component unmount to prevent leaks
  useEffect(() => {
    return () => {
      if (coverPreview) {
        URL.revokeObjectURL(coverPreview);
      }
    };
  }, [coverPreview]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setImageError("Please select a valid image file (PNG, JPG, WebP, etc.)");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setImageError("Image size must be less than 5MB");
      return;
    }

    setCoverFile(file);
    setImageError(null);

    if (coverPreview) {
      URL.revokeObjectURL(coverPreview);
    }
    setCoverPreview(URL.createObjectURL(file));
  };

  const handleRemoveCover = (e: React.MouseEvent) => {
    e.preventDefault();
    setCoverFile(null);
    if (coverPreview) {
      URL.revokeObjectURL(coverPreview);
      setCoverPreview(null);
    }
    setImageError(null);
  };

  const togglePlatform = (platform: string) => {
    setSelectedPlatforms((prev) =>
      prev.includes(platform)
        ? prev.filter((p) => p !== platform)
        : [...prev, platform]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // if (!session?.user) {
    //   toast.error("You must be logged in to list a game.");
    //   return;
    // }

    if (!title.trim()) return toast.error("Please enter a game title.");
    if (!description.trim()) return toast.error("Please enter a description.");
    if (!genre) return toast.error("Please select a genre.");
    if (!price || parseFloat(price) < 0) return toast.error("Please enter a valid price.");
    if (selectedPlatforms.length === 0) {
      return toast.error("Please select at least one platform.");
    }
    if (!coverFile) return toast.error("Please upload a cover image.");

    setIsLoading(true);
    let coverUrl = "";

    try {
      // 1. Upload cover to ImgBB
      coverUrl = await uploadImageToImgBB(coverFile);

      // 2. Submit directly to Express backend using our custom fetch mutation function
      const data = await addGames({
        title,
        description,
        genre,
        price: parseFloat(price),
        platforms: selectedPlatforms,
        coverUrl,
        developer: developer.trim() || undefined,
        publisher: publisher.trim() || undefined,
        creator: {
          id: session?.user?.id || "mock_tester_id",
          name: session?.user?.name || "Mock Tester",
          email: session?.user?.email || "mocktester@questforge.com",
          image: session?.user?.image || null,
        },
      });

      // Display dynamic feedback from MongoDB backend response
      toast.success(
        `Game listed successfully! Acknowledged: ${data.acknowledged}, ID: ${data.insertedId}`
      );
      
      // Reset form variables
      setTitle("");
      setDescription("");
      setGenre("");
      setPrice("");
      setSelectedPlatforms([]);
      setDeveloper("");
      setPublisher("");
      setCoverFile(null);
      if (coverPreview) {
        URL.revokeObjectURL(coverPreview);
        setCoverPreview(null);
      }

      // Redirect to catalog page to view games
      router.push("/games");
    } catch (err: any) {
      const isNetworkOffline = err.message === "Failed to fetch" || err instanceof TypeError;
      const displayMessage = isNetworkOffline
        ? `Unable to connect to the backend server. Please verify your API URL endpoint is correct (${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}).`
        : (err.message || "An unexpected error occurred.");

      console.warn("Listing warning:", err);
      toast.error(displayMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Loading skeleton view while resolving user session
  if (isPending) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-slate-50 dark:bg-slate-950 px-4">
        <div className="w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-3xl animate-pulse space-y-6">
          <div className="h-8 bg-slate-200 dark:bg-slate-800 w-1/3 rounded-lg" />
          <div className="h-4 bg-slate-200 dark:bg-slate-800 w-2/3 rounded-lg" />
          <div className="space-y-4">
            <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded-xl" />
            <div className="h-32 bg-slate-200 dark:bg-slate-800 rounded-xl" />
            <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  // Auth Guard: Lock Screen UI (Bypassed for testing)
  if (false && !session?.user) {
    return (
      <div className="relative min-h-[calc(100vh-64px)] w-full flex items-center justify-center pt-20 pb-16 px-4 overflow-hidden bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
        {/* Ambient background glow blobs */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/4 -left-20 w-80 h-80 rounded-full bg-violet-600/10 blur-[100px] animate-pulse" />
          <div className="absolute bottom-1/4 -right-20 w-96 h-96 rounded-full bg-cyan-500/10 blur-[120px] animate-pulse" />
        </div>

        <div className="relative z-10 w-full max-w-md">
          <div className="relative p-[1px] rounded-3xl overflow-hidden bg-gradient-to-b from-slate-200/50 to-transparent dark:from-slate-700/50 dark:to-transparent shadow-2xl">
            <div className="relative bg-white/70 dark:bg-slate-900/60 backdrop-blur-2xl px-8 py-10 rounded-[23px] flex flex-col items-center text-center gap-6 border border-white/20 dark:border-slate-800/40">
              <div className="w-16 h-16 rounded-full bg-rose-500/10 flex items-center justify-center text-rose-600 dark:text-rose-400 animate-bounce">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>

              <div className="space-y-2">
                <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                  Access Denied
                </h2>
                <p className="text-slate-500 dark:text-slate-400 text-sm max-w-xs leading-relaxed">
                  Listing games on QuestForge requires a player account. Log in or sign up to publish your listing.
                </p>
              </div>

              <div className="flex flex-col gap-3 w-full mt-2">
                <Link href="/login" className="w-full">
                  <button className="w-full py-3 rounded-xl font-bold text-white bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 shadow-md transition-all duration-200 cursor-pointer active:scale-98">
                    Log In to Account
                  </button>
                </Link>
                <Link href="/register" className="w-full">
                  <button className="w-full py-3 rounded-xl font-bold text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/30 hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-all duration-200 cursor-pointer active:scale-98">
                    Register New Account
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Active form view
  return (
    <div className="relative min-h-[calc(100vh-64px)] w-full flex justify-center py-16 px-4 overflow-hidden bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      {/* Background radial highlights */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/12 right-0 w-80 h-80 rounded-full bg-violet-600/10 blur-[100px] animate-pulse" />
        <div className="absolute bottom-1/12 left-0 w-96 h-96 rounded-full bg-cyan-500/10 blur-[120px] animate-pulse" />
      </div>

      <div className="relative z-10 w-full max-w-2xl">
        <div className="relative p-[1px] rounded-3xl overflow-hidden bg-gradient-to-b from-slate-200/50 to-transparent dark:from-slate-700/50 dark:to-transparent shadow-2xl">
          <div className="relative bg-white/70 dark:bg-slate-900/60 backdrop-blur-2xl px-6 sm:px-10 py-10 rounded-[23px] flex flex-col gap-8 border border-white/20 dark:border-slate-800/40">
            
            {/* Header */}
            <div className="flex flex-col gap-3 border-b border-slate-200/60 dark:border-slate-800/40 pb-5">
              <div className="flex items-center gap-2 self-start px-3 py-1 rounded-full border border-violet-200 dark:border-violet-500/30 bg-violet-50 dark:bg-violet-500/10 transition-colors duration-300">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-ping" />
                <span className="text-[9px] font-extrabold tracking-wider text-violet-700 dark:text-slate-350 uppercase">
                  Add Quests
                </span>
              </div>
              <h1 className="text-3xl font-black tracking-tight bg-gradient-to-r from-violet-600 to-cyan-500 bg-clip-text text-transparent dark:from-violet-400 dark:to-cyan-400">
                Forge New Listing
              </h1>
              <p className="text-slate-500 dark:text-slate-400 text-sm">
                Fill in the details to publish your game onto the QuestForge marketplace.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              
              {/* Game Title */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 tracking-wider uppercase opacity-85">
                  Game Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Elden Ring"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/40 px-4 py-3 text-sm text-slate-900 dark:text-white outline-none focus:border-violet-500 focus:shadow-[0_0_0_2px_rgba(109,40,217,0.15)] transition-all duration-200 placeholder:text-slate-400/70"
                  disabled={isLoading}
                />
              </div>

              {/* Developer & Publisher Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Developer */}
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 tracking-wider uppercase opacity-85">
                    Developer
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. FromSoftware"
                    value={developer}
                    onChange={(e) => setDeveloper(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/40 px-4 py-3 text-sm text-slate-900 dark:text-white outline-none focus:border-violet-500 focus:shadow-[0_0_0_2px_rgba(109,40,217,0.15)] transition-all duration-200 placeholder:text-slate-400/70"
                    disabled={isLoading}
                  />
                </div>

                {/* Publisher */}
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 tracking-wider uppercase opacity-85">
                    Publisher
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Bandai Namco"
                    value={publisher}
                    onChange={(e) => setPublisher(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/40 px-4 py-3 text-sm text-slate-900 dark:text-white outline-none focus:border-violet-500 focus:shadow-[0_0_0_2px_rgba(109,40,217,0.15)] transition-all duration-200 placeholder:text-slate-400/70"
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Genre & Price Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Genre */}
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 tracking-wider uppercase opacity-85">
                    Genre
                  </label>
                  <select
                    required
                    value={genre}
                    onChange={(e) => setGenre(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/40 px-4 py-3 text-sm text-slate-900 dark:text-white outline-none focus:border-violet-500 focus:shadow-[0_0_0_2px_rgba(109,40,217,0.15)] transition-all duration-200"
                    disabled={isLoading}
                  >
                    <option value="" disabled className="bg-white dark:bg-slate-900 text-slate-400">Select genre...</option>
                    {GENRES.map((g) => (
                      <option key={g} value={g} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
                        {g}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Price */}
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 tracking-wider uppercase opacity-85">
                    Price (USD)
                  </label>
                  <div className="relative flex items-center">
                    <span className="absolute left-4 text-slate-400 text-sm">$</span>
                    <input
                      type="number"
                      required
                      step="0.01"
                      min="0"
                      placeholder="59.99"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/40 pl-8 pr-4 py-3 text-sm text-slate-900 dark:text-white outline-none focus:border-violet-500 focus:shadow-[0_0_0_2px_rgba(109,40,217,0.15)] transition-all duration-200 placeholder:text-slate-400/70"
                      disabled={isLoading}
                    />
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 tracking-wider uppercase opacity-85">
                  Description
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Enter detailed game information, features, and specs..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/40 px-4 py-3 text-sm text-slate-900 dark:text-white outline-none focus:border-violet-500 focus:shadow-[0_0_0_2px_rgba(109,40,217,0.15)] transition-all duration-200 placeholder:text-slate-400/70 resize-y"
                  disabled={isLoading}
                />
              </div>

              {/* Platforms */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 tracking-wider uppercase opacity-85">
                  Supported Platforms
                </label>
                <div className="flex flex-wrap gap-3">
                  {PLATFORMS.map((platform) => {
                    const isSelected = selectedPlatforms.includes(platform);
                    return (
                      <button
                        key={platform}
                        type="button"
                        onClick={() => togglePlatform(platform)}
                        className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 border cursor-pointer active:scale-95 ${
                          isSelected
                            ? "bg-violet-600/15 border-violet-500 text-violet-600 dark:text-violet-400"
                            : "bg-white/40 dark:bg-slate-950/30 border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700"
                        }`}
                        disabled={isLoading}
                      >
                        {platform}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Cover Image Upload */}
              <div className="flex flex-col gap-2 mb-2">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 tracking-wider uppercase opacity-85">
                  Game Cover Image
                </label>
                
                <div className="w-full">
                  <input
                    type="file"
                    id="cover-upload"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    disabled={isLoading}
                  />

                  {coverPreview ? (
                    <div className="relative group w-full h-48 sm:h-56 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/40">
                      <img
                        src={coverPreview}
                        alt="Game Cover Preview"
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-102"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white text-xs font-bold transition-opacity duration-300 gap-2">
                        <label htmlFor="cover-upload" className="px-3.5 py-2 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-xl cursor-pointer transition-colors">
                          Change Artwork
                        </label>
                      </div>
                      <button
                        type="button"
                        onClick={handleRemoveCover}
                        className="absolute top-3 right-3 bg-rose-500 hover:bg-rose-600 text-white rounded-full p-1.5 shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer border border-white dark:border-slate-900"
                        title="Remove Artwork"
                        disabled={isLoading}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ) : (
                    <label
                      htmlFor="cover-upload"
                      className="group flex flex-col items-center justify-center w-full h-48 sm:h-56 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 hover:border-violet-500 dark:hover:border-violet-500 bg-white/30 dark:bg-slate-950/20 hover:bg-white/50 dark:hover:bg-slate-950/30 transition-all duration-300 cursor-pointer text-center px-6"
                    >
                      <div className="flex flex-col items-center justify-center text-slate-400 group-hover:text-violet-500">
                        <svg className="w-10 h-10 mb-2.5 opacity-65 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className="text-sm font-bold opacity-80 leading-normal">Upload Cover Image</span>
                        <span className="text-xs opacity-60 mt-1">PNG, JPG, WebP up to 5MB</span>
                      </div>
                    </label>
                  )}
                </div>

                {imageError && (
                  <span className="text-xs text-rose-500 font-semibold mt-1 px-1">{imageError}</span>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="
                  relative mt-4 w-full py-4 rounded-xl font-extrabold text-white text-sm
                  bg-gradient-to-r from-violet-600 to-cyan-500
                  hover:opacity-95 shadow-[0_4px_20px_-4px_rgba(109,40,217,0.4)]
                  hover:shadow-[0_4px_25px_-2px_rgba(109,40,217,0.7)] active:scale-[0.99]
                  transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer
                  disabled:opacity-55 disabled:pointer-events-none
                "
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Publishing to Marketplace...</span>
                  </div>
                ) : (
                  <span>Publish Game Listing</span>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
