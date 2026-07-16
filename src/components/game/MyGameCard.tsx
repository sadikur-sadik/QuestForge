"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { uploadImageToImgBB } from "@/lib/imgbb";
import { toast } from "react-toastify";
import { Game } from "./GameCard";
import { updateGame, deleteGame } from "@/lib/fetch/my-games";

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

interface MyGameCardProps {
  game: Game;
}

export default function MyGameCard({ game }: MyGameCardProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

  // Edit form states
  const [title, setTitle] = useState(game.title);
  const [description, setDescription] = useState(game.description);
  const [genre, setGenre] = useState(game.genre);
  const [price, setPrice] = useState(game.price.toString());
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(game.platforms);
  const [developer, setDeveloper] = useState(game.developer || "");
  const [publisher, setPublisher] = useState(game.publisher || "");

  // Edit image states
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(game.coverUrl);
  const [imageError, setImageError] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  // Clean up Object URL on component unmount
  useEffect(() => {
    return () => {
      if (coverPreview && coverPreview !== game.coverUrl && coverPreview.startsWith("blob:")) {
        URL.revokeObjectURL(coverPreview);
      }
    };
  }, [coverPreview, game.coverUrl]);

  // Sync state if game prop changes
  useEffect(() => {
    setTitle(game.title);
    setDescription(game.description);
    setGenre(game.genre);
    setPrice(game.price.toString());
    setSelectedPlatforms(game.platforms);
    setDeveloper(game.developer || "");
    setPublisher(game.publisher || "");
    setCoverPreview(game.coverUrl);
  }, [game]);

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

    if (coverPreview && coverPreview !== game.coverUrl && coverPreview.startsWith("blob:")) {
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

  const handleConfirmDelete = async () => {
    setIsDeleteConfirmOpen(false);

    setIsDeleting(true);
    try {
      await deleteGame(game.id);
      toast.success("Game deleted successfully!");
      router.refresh();
    } catch (err: any) {
      console.error("Delete error:", err);
      toast.error(err.message || "An error occurred while deleting.");
      setIsDeleting(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) return toast.error("Please enter a game title.");
    if (!description.trim()) return toast.error("Please enter a description.");
    if (!genre) return toast.error("Please select a genre.");
    if (!price || parseFloat(price) < 0) return toast.error("Please enter a valid price.");
    if (selectedPlatforms.length === 0) {
      return toast.error("Please select at least one platform.");
    }

    setIsUpdating(true);
    let finalCoverUrl = game.coverUrl;

    try {
      // 1. Upload new image if selected
      if (coverFile) {
        finalCoverUrl = await uploadImageToImgBB(coverFile);
      }

      // 2. Submit updates
      await updateGame(game.id, {
        title,
        description,
        genre,
        price: parseFloat(price),
        platforms: selectedPlatforms,
        developer,
        publisher,
        coverUrl: finalCoverUrl,
      });

      toast.success("Game listing updated successfully!");
      setIsEditOpen(false);
      setCoverFile(null);
      router.refresh();
    } catch (err: any) {
      console.error("Update error:", err);
      toast.error(err.message || "An error occurred while updating.");
    } finally {
      setIsUpdating(false);
    }
  };

  const formattedPrice = game.price === 0 ? "Free" : `$${game.price.toFixed(2)}`;

  return (
    <>
      {/* Horizontal Dashboard Row Layout */}
      <div className="group relative p-[1px] rounded-3xl overflow-hidden bg-gradient-to-r from-slate-200/50 to-transparent dark:from-slate-800/40 dark:to-transparent hover:from-violet-500 hover:to-cyan-500 transition-all duration-300 shadow-md hover:shadow-lg">
        <div className="bg-[var(--color-surface)] rounded-[23px] flex flex-col md:flex-row items-center gap-5 p-5 border border-[var(--color-border)] text-[var(--color-text)] transition-colors duration-300">
          
          {/* Left: Square Aspect cover photo */}
          <div className="relative w-full md:w-36 h-36 rounded-2xl overflow-hidden bg-[var(--color-bg)] shrink-0 shadow-inner">
            <img
              src={game.coverUrl}
              alt={game.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-103"
              loading="lazy"
            />
            {/* Small Genre Overlay */}
            <div className="absolute top-2 left-2 px-2 py-0.5 rounded font-extrabold text-[8px] uppercase tracking-wider bg-violet-600/90 text-white shadow-sm">
              {game.genre}
            </div>
          </div>

          {/* Middle: Info block */}
          <div className="flex-1 flex flex-col gap-2 min-w-0 w-full text-left">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
              <h3 className="text-lg font-black text-[var(--color-text)] truncate">
                {game.title}
              </h3>
              <span className="font-extrabold text-base text-[var(--color-accent-primary)] shrink-0">
                {formattedPrice}
              </span>
            </div>

            {/* Truncated description */}
            <p className="text-xs text-[var(--color-muted)] line-clamp-2 leading-relaxed pr-2">
              {game.description}
            </p>

            {/* Platforms list & release date info */}
            <div className="flex flex-wrap items-center justify-between gap-3 mt-1.5">
              <div className="flex flex-wrap gap-1.5">
                {game.platforms.map((plat) => (
                  <span
                    key={plat}
                    className="px-2 py-0.5 rounded-md text-[9px] font-bold bg-[var(--color-bg)] text-[var(--color-muted)] border border-[var(--color-border)]"
                  >
                    {plat}
                  </span>
                ))}
              </div>
              <span className="text-[9px] text-[var(--color-muted)] font-extrabold uppercase tracking-wider">
                Released: {game.releaseDate}
              </span>
            </div>
          </div>

          {/* Right Action buttons stacked vertically */}
          <div className="flex flex-row md:flex-col gap-2 w-full md:w-auto shrink-0 border-t md:border-t-0 md:border-l border-[var(--color-border)] pt-4 md:pt-0 md:pl-5 self-stretch justify-center">
            <button
              onClick={() => setIsEditOpen(true)}
              disabled={isDeleting}
              className="w-full md:w-32 py-2.5 rounded-xl text-xs font-bold bg-violet-600 hover:bg-violet-500 text-white shadow-md active:scale-[0.98] transition-all duration-200 cursor-pointer disabled:opacity-50"
            >
              Edit
            </button>
            <button
              onClick={() => setIsDeleteConfirmOpen(true)}
              disabled={isDeleting}
              className="w-full md:w-32 py-2.5 rounded-xl text-xs font-bold border border-rose-200 dark:border-rose-950 bg-rose-500/10 hover:bg-rose-600 text-rose-600 dark:text-rose-400 hover:text-white active:scale-[0.98] transition-all duration-200 cursor-pointer disabled:opacity-50"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </button>
          </div>

        </div>
      </div>

      {/* Custom Delete Confirmation Modal */}
      {isDeleteConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm transition-opacity duration-300">
          <div className="relative w-full max-w-md bg-[var(--color-surface)] border border-[var(--color-border)] shadow-2xl rounded-3xl p-6 sm:p-8 flex flex-col items-center text-center gap-5 text-[var(--color-text)] transition-all duration-300">
            {/* Warning Circle */}
            <div className="w-14 h-14 rounded-full bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-600 dark:text-rose-400 animate-bounce">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>

            {/* Content text */}
            <div className="space-y-2">
              <h3 className="text-lg font-black text-[var(--color-text)]">
                Delete Listing?
              </h3>
              <p className="text-xs text-[var(--color-muted)] leading-relaxed">
                Are you sure you want to delete <strong className="text-[var(--color-text)]">"{game.title}"</strong> from the marketplace? This operation cannot be undone.
              </p>
            </div>

            {/* Action buttons */}
            <div className="grid grid-cols-2 gap-3 w-full border-t border-[var(--color-border)] pt-5 mt-2">
              <button
                type="button"
                onClick={() => setIsDeleteConfirmOpen(false)}
                className="w-full py-2.5 rounded-xl text-xs font-bold border border-[var(--color-border)] hover:bg-[var(--color-bg)] text-[var(--color-muted)] hover:text-[var(--color-text)] transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="w-full py-2.5 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white shadow-md active:scale-95 transition-all cursor-pointer"
              >
                Delete Game
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal Dialog */}
      {isEditOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm transition-opacity duration-300">
          <div className="relative w-full max-w-lg max-h-[85vh] bg-[var(--color-surface)] border border-[var(--color-border)] shadow-2xl rounded-3xl p-6 sm:p-8 flex flex-col gap-4 text-[var(--color-text)] transition-all duration-300 scale-100 overflow-hidden">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-4 shrink-0">
              <h2 className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-violet-600 to-cyan-500 bg-clip-text text-transparent dark:from-violet-400 dark:to-cyan-400">
                Edit Quest Listing
              </h2>
              <button
                onClick={() => { if (!isUpdating) setIsEditOpen(false); }}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[var(--color-bg)] text-[var(--color-muted)] hover:text-[var(--color-text)] transition-colors cursor-pointer border border-[var(--color-border)]"
                aria-label="Close modal"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleUpdate} className="flex flex-col flex-1 overflow-hidden min-h-0">
              
              {/* Scrollable Form Body */}
              <div className="flex-1 overflow-y-auto pr-1 sm:pr-2 flex flex-col gap-5 py-2 min-h-0">
                {/* Title */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold tracking-wider uppercase text-[var(--color-muted)]">
                    Game Title
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Elden Ring"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text)] px-3.5 py-2.5 text-sm outline-none focus:border-[var(--color-accent-primary)] focus:shadow-[0_0_0_2px_rgba(109,40,217,0.15)] transition-all"
                    disabled={isUpdating}
                  />
                </div>

                {/* Genre & Price Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Genre */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold tracking-wider uppercase text-[var(--color-muted)]">
                      Genre
                    </label>
                    <select
                      required
                      value={genre}
                      onChange={(e) => setGenre(e.target.value)}
                      className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text)] px-3.5 py-2.5 text-sm outline-none focus:border-[var(--color-accent-primary)] focus:shadow-[0_0_0_2px_rgba(109,40,217,0.15)] transition-all"
                      disabled={isUpdating}
                    >
                      {GENRES.map((g) => (
                        <option key={g} value={g} className="bg-[var(--color-surface)] text-[var(--color-text)]">
                          {g}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Price */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold tracking-wider uppercase text-[var(--color-muted)]">
                      Price (USD)
                    </label>
                    <div className="relative flex items-center">
                      <span className="absolute left-3.5 text-[var(--color-muted)] text-sm">$</span>
                      <input
                        type="number"
                        required
                        step="0.01"
                        min="0"
                        placeholder="59.99"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text)] pl-8 pr-3.5 py-2.5 text-sm outline-none focus:border-[var(--color-accent-primary)] focus:shadow-[0_0_0_2px_rgba(109,40,217,0.15)] transition-all"
                        disabled={isUpdating}
                      />
                    </div>
                  </div>
                </div>

                {/* Developer & Publisher Edit Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Developer */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold tracking-wider uppercase text-[var(--color-muted)]">
                      Developer
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. FromSoftware"
                      value={developer}
                      onChange={(e) => setDeveloper(e.target.value)}
                      className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text)] px-3.5 py-2.5 text-sm outline-none focus:border-[var(--color-accent-primary)] focus:shadow-[0_0_0_2px_rgba(109,40,217,0.15)] transition-all"
                      disabled={isUpdating}
                    />
                  </div>

                  {/* Publisher */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold tracking-wider uppercase text-[var(--color-muted)]">
                      Publisher
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Bandai Namco"
                      value={publisher}
                      onChange={(e) => setPublisher(e.target.value)}
                      className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text)] px-3.5 py-2.5 text-sm outline-none focus:border-[var(--color-accent-primary)] focus:shadow-[0_0_0_2px_rgba(109,40,217,0.15)] transition-all"
                      disabled={isUpdating}
                    />
                  </div>
                </div>

                {/* Description */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold tracking-wider uppercase text-[var(--color-muted)]">
                    Description
                  </label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Enter detailed game information..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text)] px-3.5 py-2.5 text-sm outline-none focus:border-[var(--color-accent-primary)] focus:shadow-[0_0_0_2px_rgba(109,40,217,0.15)] transition-all resize-y"
                    disabled={isUpdating}
                  />
                </div>

                {/* Platforms */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold tracking-wider uppercase text-[var(--color-muted)]">
                    Supported Platforms
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {PLATFORMS.map((platform) => {
                      const isSelected = selectedPlatforms.includes(platform);
                      return (
                        <button
                          key={platform}
                          type="button"
                          onClick={() => togglePlatform(platform)}
                          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all border cursor-pointer active:scale-95 ${
                            isSelected
                              ? "bg-[var(--color-accent-primary)]/15 border-[var(--color-accent-primary)] text-[var(--color-accent-primary)] font-extrabold"
                              : "bg-[var(--color-bg)] border-[var(--color-border)] text-[var(--color-muted)] hover:border-[var(--color-accent-primary)]"
                          }`}
                          disabled={isUpdating}
                        >
                          {platform}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Artwork Upload */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold tracking-wider uppercase text-[var(--color-muted)]">
                    Cover Artwork
                  </label>
                  
                  <div className="relative w-full h-36 rounded-xl overflow-hidden border border-[var(--color-border)] bg-[var(--color-bg)]">
                    {coverPreview && (
                      <img src={coverPreview} alt="Cover Preview" className="w-full h-full object-cover" />
                    )}
                    <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center gap-2">
                      <input
                        type="file"
                        id={`modal-upload-${game.id}`}
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                        disabled={isUpdating}
                      />
                      <label
                        htmlFor={`modal-upload-${game.id}`}
                        className="px-3.5 py-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white rounded-xl text-xs font-bold cursor-pointer transition-colors shadow"
                      >
                        Change Artwork Image
                      </label>
                    </div>
                  </div>
                  {imageError && (
                    <span className="text-xs text-rose-500 font-semibold">{imageError}</span>
                  )}
                </div>
              </div>

              {/* Actions Footer */}
              <div className="flex items-center justify-end gap-3 border-t border-[var(--color-border)] pt-4 mt-2 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsEditOpen(false)}
                  disabled={isUpdating}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold border border-[var(--color-border)] hover:bg-[var(--color-bg)] text-[var(--color-muted)] hover:text-[var(--color-text)] transition-all cursor-pointer disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-violet-600 to-indigo-600 hover:opacity-95 text-white shadow-md active:scale-95 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isUpdating ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <span>Save Changes</span>
                  )}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}
    </>
  );
}
