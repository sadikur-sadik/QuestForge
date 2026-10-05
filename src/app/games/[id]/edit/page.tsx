"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { toast } from "react-toastify";
import { authClient } from "@/lib/auth-client";
import { uploadImageToImgBB } from "@/lib/imgbb";
import { mutate } from "@/lib/mutation/api";

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

export default function EditGamePage() {
  const router = useRouter();
  const params = useParams();
  const gameId = params?.id as string;
  const { data: session, isPending: isSessionPending } = authClient.useSession();

  const [isLoadingGame, setIsLoadingGame] = useState(true);

  // Form states
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [genre, setGenre] = useState("");
  const [price, setPrice] = useState("");
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [developer, setDeveloper] = useState("");
  const [publisher, setPublisher] = useState("");
  const [coverUrl, setCoverUrl] = useState("");

  // Cover image upload states
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);

  // Loading / saving state
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Clean up Object URL
  useEffect(() => {
    return () => {
      if (coverPreview) {
        URL.revokeObjectURL(coverPreview);
      }
    };
  }, [coverPreview]);

  // Load existing game data
  useEffect(() => {
    if (!gameId) return;

    async function fetchGameDetails() {
      try {
        const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
        const res = await fetch(`${apiBase}/games/${gameId}`);
        if (res.ok) {
          const game = await res.json();
          setTitle(game.title || "");
          setDescription(game.description || "");
          setGenre(game.genre || "");
          setPrice(game.price !== undefined ? String(game.price) : "");
          setSelectedPlatforms(Array.isArray(game.platforms) ? game.platforms : []);
          setDeveloper(game.developer || "");
          setPublisher(game.publisher || "");
          setCoverUrl(game.coverUrl || "");
        } else {
          toast.error("Failed to load game details for editing.");
        }
      } catch (err) {
        console.error("Error fetching game:", err);
        toast.error("Error fetching game details.");
      } finally {
        setIsLoadingGame(false);
      }
    }

    fetchGameDetails();
  }, [gameId]);

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

  const togglePlatform = (platform: string) => {
    setSelectedPlatforms((prev) =>
      prev.includes(platform)
        ? prev.filter((p) => p !== platform)
        : [...prev, platform]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) return toast.error("Please enter a game title.");
    if (!description.trim()) return toast.error("Please enter a description.");
    if (!genre) return toast.error("Please select a genre.");
    if (price === "" || parseFloat(price) < 0) return toast.error("Please enter a valid price.");
    if (selectedPlatforms.length === 0) {
      return toast.error("Please select at least one platform.");
    }

    setIsSubmitting(true);

    try {
      let finalCoverUrl = coverUrl;

      // 1. Upload new cover image to ImgBB if selected
      if (coverFile) {
        finalCoverUrl = await uploadImageToImgBB(coverFile);
      }

      if (!finalCoverUrl) {
        toast.error("Please provide or upload a cover image.");
        setIsSubmitting(false);
        return;
      }

      // 2. Submit update via backend PUT request using mutate helper
      await mutate(
        `/games/${gameId}`,
        {
          title: title.trim(),
          description: description.trim(),
          genre,
          price: parseFloat(price),
          platforms: selectedPlatforms,
          coverUrl: finalCoverUrl,
          developer: developer.trim() || undefined,
          publisher: publisher.trim() || undefined,
        },
        "PUT"
      );

      toast.success(`"${title}" has been updated successfully!`);

      // Redirect back to Admin dashboard or Game Details
      router.push("/dashboard/admin");
    } catch (err: any) {
      console.error("Game update error:", err);
      toast.error(err.message || "Failed to update game details.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSessionPending || isLoadingGame) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-slate-50 dark:bg-slate-950 px-4">
        <div className="w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-3xl animate-pulse space-y-6">
          <div className="h-8 bg-slate-200 dark:bg-slate-800 w-1/3 rounded-lg" />
          <div className="h-4 bg-slate-200 dark:bg-slate-800 w-2/3 rounded-lg" />
          <div className="space-y-4">
            <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded-xl" />
            <div className="h-32 bg-slate-200 dark:bg-slate-800 rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-[calc(100vh-64px)] w-full flex justify-center py-12 px-4 overflow-hidden bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      {/* Background radial highlights */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/12 right-0 w-80 h-80 rounded-full bg-violet-600/10 blur-[100px] animate-pulse" />
        <div className="absolute bottom-1/12 left-0 w-96 h-96 rounded-full bg-cyan-500/10 blur-[120px] animate-pulse" />
      </div>

      <div className="relative z-10 w-full max-w-2xl">
        <div className="mb-4">
          <Link
            href="/dashboard/admin"
            className="inline-flex items-center gap-2 text-xs font-extrabold text-slate-500 hover:text-violet-600 dark:hover:text-violet-400 transition"
          >
            ← Back to Admin Console
          </Link>
        </div>

        <div className="relative p-[1px] rounded-3xl overflow-hidden bg-gradient-to-b from-slate-200/50 to-transparent dark:from-slate-700/50 dark:to-transparent shadow-2xl">
          <div className="relative bg-white/70 dark:bg-slate-900/60 backdrop-blur-2xl px-6 sm:px-10 py-10 rounded-[23px] flex flex-col gap-8 border border-white/20 dark:border-slate-800/40">
            
            {/* Header */}
            <div className="flex flex-col gap-3 border-b border-slate-200/60 dark:border-slate-800/40 pb-5">
              <div className="flex items-center gap-2 self-start px-3 py-1 rounded-full border border-violet-200 dark:border-violet-500/30 bg-violet-50 dark:bg-violet-500/10">
                <span className="text-[10px] font-black tracking-wider text-violet-700 dark:text-violet-300 uppercase">
                  ✏️ Admin Listing Editor
                </span>
              </div>
              <h1 className="text-3xl font-black tracking-tight bg-gradient-to-r from-violet-600 to-cyan-500 bg-clip-text text-transparent dark:from-violet-400 dark:to-cyan-400">
                Edit Game Listing Details
              </h1>
              <p className="text-slate-500 dark:text-slate-400 text-sm">
                Update game catalog information, pricing, developer metadata, and media assets.
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
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/40 px-4 py-3 text-sm text-slate-900 dark:text-white outline-none focus:border-violet-500 transition-all duration-200"
                  disabled={isSubmitting}
                />
              </div>

              {/* Developer & Publisher Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 tracking-wider uppercase opacity-85">
                    Developer
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. FromSoftware"
                    value={developer}
                    onChange={(e) => setDeveloper(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/40 px-4 py-3 text-sm text-slate-900 dark:text-white outline-none focus:border-violet-500 transition-all duration-200"
                    disabled={isSubmitting}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 tracking-wider uppercase opacity-85">
                    Publisher
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Bandai Namco"
                    value={publisher}
                    onChange={(e) => setPublisher(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/40 px-4 py-3 text-sm text-slate-900 dark:text-white outline-none focus:border-violet-500 transition-all duration-200"
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              {/* Genre & Price Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 tracking-wider uppercase opacity-85">
                    Genre
                  </label>
                  <select
                    required
                    value={genre}
                    onChange={(e) => setGenre(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/40 px-4 py-3 text-sm text-slate-900 dark:text-white outline-none focus:border-violet-500 transition-all duration-200 font-medium"
                    disabled={isSubmitting}
                  >
                    <option value="" disabled>Select genre...</option>
                    {GENRES.map((g) => (
                      <option key={g} value={g} className="bg-white dark:bg-slate-900">
                        {g}
                      </option>
                    ))}
                  </select>
                </div>

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
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/40 pl-8 pr-4 py-3 text-sm text-slate-900 dark:text-white outline-none focus:border-violet-500 transition-all duration-200"
                      disabled={isSubmitting}
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
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/40 px-4 py-3 text-sm text-slate-900 dark:text-white outline-none focus:border-violet-500 transition-all duration-200 resize-y"
                  disabled={isSubmitting}
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
                        className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                          isSelected
                            ? "bg-violet-600/15 border-violet-500 text-violet-600 dark:text-violet-400"
                            : "bg-white/40 dark:bg-slate-950/30 border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700"
                        }`}
                        disabled={isSubmitting}
                      >
                        {platform}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Cover Image Upload & Direct URL */}
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 tracking-wider uppercase opacity-85">
                    Cover Image Artwork
                  </label>
                  <span className="text-[11px] font-semibold text-violet-600 dark:text-violet-400">
                    Card Frame (16:9 Ratio)
                  </span>
                </div>
                
                {/* Cover Preview */}
                <div className="w-full max-w-sm mx-auto">
                  {(coverPreview || coverUrl) ? (
                    <div className="group relative p-[1px] rounded-3xl overflow-hidden bg-gradient-to-b from-slate-200/80 to-slate-300/40 dark:from-slate-700/60 dark:to-slate-900/40 hover:from-violet-500 hover:to-cyan-500 transition-all duration-300 shadow-md">
                      <div className="relative w-full aspect-video rounded-[23px] overflow-hidden bg-slate-950 border border-slate-200/30 dark:border-slate-800/20">
                        <img
                          src={coverPreview || coverUrl}
                          alt="Game Artwork"
                          className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-103"
                        />
                        <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg font-extrabold text-[10px] uppercase tracking-wider bg-violet-600/90 text-white shadow-md border border-violet-400/30 backdrop-blur-md">
                          {genre || "CARD PREVIEW"}
                        </div>
                        <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity backdrop-blur-[2px]">
                          <label htmlFor="cover-edit-upload" className="px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white font-extrabold rounded-xl text-xs cursor-pointer shadow-lg hover:scale-105 transition-all">
                            📸 Change Artwork File
                          </label>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="w-full aspect-video rounded-3xl border-2 border-dashed border-slate-300 dark:border-slate-800 bg-slate-100/50 dark:bg-slate-950/40 flex flex-col items-center justify-center p-5 text-center">
                      <svg className="w-8 h-8 mb-2 text-violet-500 opacity-80" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Upload Image File or Paste URL Below</span>
                      <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">Compact Card Frame (16:9 ratio)</span>
                    </div>
                  )}
                </div>

                <input
                  type="file"
                  id="cover-edit-upload"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  disabled={isSubmitting}
                />

                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <label htmlFor="cover-edit-upload" className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition cursor-pointer text-center shrink-0">
                    📁 Choose File to Upload
                  </label>
                  <span className="text-xs text-slate-400 font-bold hidden sm:inline">or</span>
                  <input
                    type="url"
                    placeholder="Or paste cover Image URL..."
                    value={coverUrl}
                    onChange={(e) => setCoverUrl(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/40 px-4 py-2.5 text-xs text-slate-900 dark:text-white outline-none focus:border-violet-500"
                    disabled={isSubmitting}
                  />
                </div>

                {imageError && (
                  <span className="text-xs text-rose-500 font-semibold">{imageError}</span>
                )}
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 mt-4 pt-4 border-t border-slate-200 dark:border-slate-800">
                <Link href="/dashboard/admin">
                  <button
                    type="button"
                    className="px-5 py-3 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                  >
                    Cancel
                  </button>
                </Link>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-3 rounded-xl font-extrabold text-white text-xs bg-gradient-to-r from-violet-600 to-cyan-500 hover:opacity-95 shadow-md transition disabled:opacity-50 flex items-center gap-2"
                >
                  {isSubmitting ? "Saving Changes..." : "✓ Save Changes"}
                </button>
              </div>

            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
