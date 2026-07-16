"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { toast } from "react-toastify";
import { getUserReviews, updateReview, deleteReview } from "@/lib/fetch/reviews";

interface MyInteractionsProps {
  user: {
    id: string;
    name: string;
    email: string;
    image?: string | null;
  } | null;
}

interface UserReview {
  id: string;
  gameId: string;
  author: string;
  rating: number;
  comment: string;
  date: string;
  game?: {
    title: string;
    coverUrl: string;
    genre: string;
  } | null;
}

export default function MyInteractions({ user }: MyInteractionsProps) {
  const [reviews, setReviews] = useState<UserReview[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Edit mode states
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editRating, setEditRating] = useState<number>(5);
  const [editComment, setEditComment] = useState<string>("");
  const [isUpdating, setIsUpdating] = useState(false);

  // Delete confirmation states
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchUserReviews = () => {
    if (!user?.id) return;
    setLoading(true);
    getUserReviews(user.id)
      .then((items) => {
        const mapped: UserReview[] = items.map((item: any) => ({
          id: item._id ? item._id.toString() : item.id,
          gameId: item.gameId,
          author: item.author,
          rating: item.rating,
          comment: item.comment,
          date: item.date,
          game: item.game,
        }));
        setReviews(mapped);
      })
      .catch((err) => {
        console.error("Failed to load user reviews:", err);
        toast.error("Failed to load your interactions.");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    if (user?.id) {
      fetchUserReviews();
    } else {
      setLoading(false);
    }
  }, [user?.id]);

  const handleStartEdit = (review: UserReview) => {
    setEditingId(review.id);
    setEditRating(review.rating);
    setEditComment(review.comment);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
  };

  const handleSaveEdit = async (reviewId: string) => {
    if (!editComment.trim()) {
      toast.error("Review comment cannot be empty.");
      return;
    }

    setIsUpdating(true);
    try {
      await updateReview(reviewId, editRating, editComment);
      toast.success("Interaction updated successfully!");
      setReviews((prev) =>
        prev.map((r) =>
          r.id === reviewId
            ? { ...r, rating: editRating, comment: editComment }
            : r
        )
      );
      setEditingId(null);
    } catch (err: any) {
      toast.error(err.message || "Failed to update your review.");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteConfirm = async (reviewId: string) => {
    setIsDeleting(true);
    try {
      await deleteReview(reviewId);
      toast.success("Interaction deleted successfully!");
      setReviews((prev) => prev.filter((r) => r.id !== reviewId));
      setDeletingId(null);
    } catch (err: any) {
      toast.error(err.message || "Failed to delete your review.");
    } finally {
      setIsDeleting(false);
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-0.5 text-amber-400">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className={`w-4 h-4 ${star <= rating ? "fill-current" : "text-slate-300 dark:text-slate-700"}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.907c.961 0 1.371 1.24.588 1.81l-3.97 2.88a1 1 0 00-.364 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.971-2.88a1 1 0 00-1.178 0l-3.97 2.88c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.364-1.118l-3.97-2.88c-.783-.57-.372-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
            />
          </svg>
        ))}
      </div>
    );
  };

  if (!user) {
    return (
      <div className="relative min-h-[calc(100vh-64px)] w-full py-16 px-4 bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
        <div className="text-center p-8 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/40 dark:bg-slate-900/20 backdrop-blur-sm">
          <p className="text-sm text-slate-500 dark:text-slate-400">Please sign in to view your interactions.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-[calc(100vh-64px)] w-full py-16 px-4 overflow-hidden bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      
      {/* Background Cyber Glow Blobs */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[350px] h-[350px] rounded-full bg-violet-600/10 blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[450px] h-[450px] rounded-full bg-cyan-500/10 blur-[150px] animate-pulse" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto flex flex-col gap-10">
        
        {/* Header Title */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2 self-start px-3 py-1 rounded-full border border-violet-200 dark:border-violet-500/30 bg-violet-50 dark:bg-violet-500/10 transition-colors duration-300">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-ping" />
            <span className="text-[9px] font-extrabold tracking-wider text-violet-700 dark:text-slate-350 uppercase">
              User Interactions
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight bg-gradient-to-r from-violet-600 to-cyan-500 bg-clip-text text-transparent dark:from-violet-400 dark:to-cyan-400">
            My Interactions
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xl transition-colors duration-300">
            Manage reviews, remarks, and scores you gave to games across the marketplace. You can update comments or ratings, or remove them entirely.
          </p>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="w-full py-20 flex flex-col items-center justify-center gap-3">
            <div className="w-8 h-8 border-4 border-violet-500/30 border-t-violet-500 rounded-full animate-spin" />
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Fetching reviews...</span>
          </div>
        ) : reviews.length > 0 ? (
          <div className="flex flex-col gap-6">
            {reviews.map((review) => {
              const isEditing = editingId === review.id;
              const isConfirmingDelete = deletingId === review.id;
              
              return (
                <div
                  key={review.id}
                  className="relative p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex flex-col md:flex-row gap-6 transition-all duration-300 hover:border-slate-300 dark:hover:border-slate-700"
                >
                  {/* Game Cover / Mini Info */}
                  <div className="flex items-center gap-4 md:w-56 shrink-0 border-b md:border-b-0 md:border-r border-slate-100 dark:border-slate-800 pb-4 md:pb-0 pr-0 md:pr-6">
                    <div className="w-16 h-20 bg-slate-100 dark:bg-slate-800 rounded-xl overflow-hidden shrink-0 border border-slate-200 dark:border-slate-700 relative">
                      {review.game?.coverUrl ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img
                          src={review.game.coverUrl}
                          alt={review.game.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xs text-slate-400 dark:text-slate-500">
                          No Art
                        </div>
                      )}
                    </div>
                    
                    <div className="flex flex-col min-w-0">
                      <Link
                        href={`/games/${review.gameId}`}
                        className="font-bold text-sm text-slate-800 dark:text-slate-200 hover:text-violet-500 dark:hover:text-violet-400 transition-colors truncate"
                      >
                        {review.game?.title || "Unknown Game"}
                      </Link>
                      <span className="text-[10px] text-slate-400 uppercase tracking-wider mt-0.5">
                        {review.game?.genre || "Game review"}
                      </span>
                      <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-2">
                        {review.date}
                      </span>
                    </div>
                  </div>

                  {/* Review Content / Editing Box */}
                  <div className="flex-1 flex flex-col justify-between">
                    
                    {isEditing ? (
                      /* Editing Mode Form */
                      <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-4">
                          <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Rating:</span>
                          <div className="flex items-center gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button
                                key={star}
                                type="button"
                                onClick={() => setEditRating(star)}
                                className="text-amber-400 cursor-pointer focus:outline-none"
                              >
                                <svg
                                  className={`w-6 h-6 ${star <= editRating ? "fill-current" : "text-slate-300 dark:text-slate-700"}`}
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.907c.961 0 1.371 1.24.588 1.81l-3.97 2.88a1 1 0 00-.364 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.971-2.88a1 1 0 00-1.178 0l-3.97 2.88c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.364-1.118l-3.97-2.88c-.783-.57-.372-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                                  />
                                </svg>
                              </button>
                            ))}
                          </div>
                        </div>
                        
                        <div className="flex flex-col gap-1.5">
                          <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Comment:</label>
                          <textarea
                            required
                            rows={3}
                            value={editComment}
                            onChange={(e) => setEditComment(e.target.value)}
                            className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-3.5 py-2.5 text-sm text-[var(--color-text)] outline-none focus:border-violet-500 transition-all placeholder:text-slate-400"
                            placeholder="Write your review comments here..."
                          />
                        </div>

                        <div className="flex items-center gap-3 self-end">
                          <button
                            type="button"
                            onClick={handleCancelEdit}
                            className="px-4 py-2 text-xs font-bold rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer"
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            onClick={() => handleSaveEdit(review.id)}
                            disabled={isUpdating}
                            className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-violet-600 to-cyan-500 hover:opacity-95 transition-all cursor-pointer disabled:opacity-50"
                          >
                            {isUpdating ? "Saving..." : "Save Review"}
                          </button>
                        </div>
                      </div>
                    ) : (
                      /* Display Mode */
                      <div className="flex-1 flex flex-col justify-between gap-4">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            {renderStars(review.rating)}
                            <span className="text-[10px] font-bold text-slate-400 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-850 px-2 py-0.5 rounded">
                              Score: {review.rating}.0
                            </span>
                          </div>
                          
                          <p className="text-sm text-slate-650 dark:text-slate-350 leading-relaxed font-medium line-clamp-4 break-words">
                            "{review.comment}"
                          </p>
                        </div>

                        {/* Action Buttons */}
                        {isConfirmingDelete ? (
                          /* Confirm Delete Mode */
                          <div className="flex items-center justify-end gap-3 p-2 bg-rose-500/10 rounded-2xl border border-rose-500/25">
                            <span className="text-[10px] font-bold text-rose-600 dark:text-rose-400 mr-auto pl-2">
                              Are you sure you want to delete this interaction permanently?
                            </span>
                            <button
                              type="button"
                              onClick={() => setDeletingId(null)}
                              className="px-3 py-1.5 text-[10px] font-extrabold rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer"
                            >
                              Cancel
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteConfirm(review.id)}
                              disabled={isDeleting}
                              className="px-4 py-1.5 text-[10px] font-extrabold text-white bg-rose-600 hover:bg-rose-500 rounded-lg transition-all cursor-pointer disabled:opacity-50"
                            >
                              {isDeleting ? "Deleting..." : "Confirm Delete"}
                            </button>
                          </div>
                        ) : (
                          /* Action options links */
                          <div className="flex items-center justify-end gap-3 self-end border-t border-slate-100 dark:border-slate-850 pt-3 w-full">
                            <button
                              type="button"
                              onClick={() => handleStartEdit(review)}
                              className="px-3.5 py-2 rounded-xl text-[10px] font-bold text-slate-600 dark:text-slate-450 hover:bg-slate-100 dark:hover:bg-slate-850 flex items-center gap-1.5 transition-all cursor-pointer"
                            >
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                              </svg>
                              Edit Comment
                            </button>
                            <button
                              type="button"
                              onClick={() => setDeletingId(review.id)}
                              className="px-3.5 py-2 rounded-xl text-[10px] font-bold text-rose-600 dark:text-rose-450 hover:bg-rose-500/10 flex items-center gap-1.5 transition-all cursor-pointer"
                            >
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                              Delete Review
                            </button>
                          </div>
                        )}

                      </div>
                    )}

                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Empty Interactions Dashboard State */
          <div className="w-full flex flex-col items-center justify-center text-center p-16 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800 bg-white/40 dark:bg-slate-900/20 backdrop-blur-sm gap-5">
            <div className="w-16 h-16 rounded-full bg-violet-500/10 flex items-center justify-center text-violet-600 dark:text-violet-400">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 10.742l3.414-3.414m0 0l3.414 3.414m-3.414-3.414v10.5m-6.42 2.378a8.967 8.967 0 1112.84 0" />
              </svg>
            </div>
            <div className="space-y-1.5">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">No interactions recorded</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs">
                You haven't reviewed or left comments on any games in the marketplace yet.
              </p>
            </div>
            <Link href="/games" className="px-5 py-3 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 shadow-md transition-all active:scale-[0.98]">
              Browse Marketplace Games
            </Link>
          </div>
        )}

      </div>
    </div>
  );
}
