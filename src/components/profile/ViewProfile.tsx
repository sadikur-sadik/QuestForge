"use client";

import React, { useState, useRef } from "react";
import { toast } from "react-toastify";
import { authClient } from "@/lib/auth-client";
import { uploadImageToImgBB } from "@/lib/imgbb";
import { Avatar } from "@heroui/react";

interface ViewProfileProps {
  user: {
    id: string;
    name: string;
    email: string;
    image?: string | null;
  } | null;
}

export default function ViewProfile({ user }: ViewProfileProps) {
  const [name, setName] = useState(user?.name || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const [isUploading, setIsUploading] = useState(false);
  const [isSavingName, setIsSavingName] = useState(false);
  const [isSavingPassword, setIsSavingPassword] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setIsUploading(true);
    try {
      const url = await uploadImageToImgBB(file);
      const { error } = await authClient.updateUser({
        image: url,
      });
      if (error) {
        toast.error(error.message || "Failed to update profile picture.");
      } else {
        toast.success("Profile picture updated successfully!");
        window.location.reload();
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to upload image.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleUpdateName = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Name cannot be empty.");
      return;
    }
    
    setIsSavingName(true);
    try {
      const { error } = await authClient.updateUser({
        name: name,
      });
      if (error) {
        toast.error(error.message || "Failed to update profile name.");
      } else {
        toast.success("Name updated successfully!");
        window.location.reload();
      }
    } catch (err: any) {
      toast.error(err.message || "An unexpected error occurred.");
    } finally {
      setIsSavingName(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword) {
      toast.error("Current password is required.");
      return;
    }
    if (newPassword.length < 6) {
      toast.error("New password must be at least 6 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match.");
      return;
    }

    setIsSavingPassword(true);
    try {
      await authClient.changePassword({
        currentPassword: currentPassword,
        newPassword: newPassword,
      }, {
        onSuccess: () => {
          toast.success("Password changed successfully!");
          setCurrentPassword("");
          setNewPassword("");
          setConfirmPassword("");
        },
        onError: (ctx) => {
          toast.error(ctx.error?.message || "Failed to change password. Make sure current password is correct.");
        }
      });
    } catch (err: any) {
      toast.error(err.message || "An unexpected error occurred.");
    } finally {
      setIsSavingPassword(false);
    }
  };

  if (!user) {
    return (
      <div className="relative min-h-[calc(100vh-64px)] w-full py-16 px-4 bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
        <div className="text-center p-8 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/40 dark:bg-slate-900/20 backdrop-blur-sm">
          <p className="text-sm text-slate-500 dark:text-slate-400">Please sign in to view and edit your profile.</p>
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

      <div className="relative z-10 max-w-4xl mx-auto flex flex-col gap-10">
        
        {/* Header Title */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2 self-start px-3 py-1 rounded-full border border-violet-200 dark:border-violet-500/30 bg-violet-50 dark:bg-violet-500/10 transition-colors duration-300">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-ping" />
            <span className="text-[9px] font-extrabold tracking-wider text-violet-700 dark:text-slate-350 uppercase">
              User Profile
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight bg-gradient-to-r from-violet-600 to-cyan-500 bg-clip-text text-transparent dark:from-violet-400 dark:to-cyan-400">
            Profile Settings
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xl transition-colors duration-300">
            Manage your account credentials, avatar image, display name, and password settings.
          </p>
        </div>

        {/* Profile Card Panels */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Avatar Panel */}
          <div className="md:col-span-1 flex flex-col items-center justify-center p-8 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm gap-4 text-center">
            <div className="relative group cursor-pointer" onClick={handleAvatarClick}>
              <Avatar
                className="w-24 h-24 text-large ring-4 ring-violet-500/30 dark:ring-violet-500/50"
              >
                <Avatar.Image src={user.image || ""} alt={user.name} />
                <Avatar.Fallback>{user.name?.[0]}</Avatar.Fallback>
              </Avatar>
              <div className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 0110 4h4a2.31 2.31 0 013.173 2.175l.135.539a1.077 1.077 0 00.825.807l.539.135a2.31 2.31 0 011.662 2.226v5.89c0 1.258-1.02 2.28-2.28 2.28H5.89A2.28 2.28 0 013.61 16v-5.89a2.31 2.31 0 011.662-2.226l.539-.135a1.077 1.077 0 00.825-.807l.135-.539z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
            </div>
            
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageChange}
              accept="image/*"
              className="hidden"
            />
            
            <div>
              <h3 className="font-bold text-slate-800 dark:text-slate-100">{user.name}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{user.email}</p>
            </div>

            {isUploading ? (
              <div className="flex items-center gap-2 text-xs text-violet-600 dark:text-violet-400 font-semibold mt-2">
                <div className="w-4 h-4 border-2 border-violet-500/30 border-t-violet-500 rounded-full animate-spin" />
                Uploading image...
              </div>
            ) : (
              <button
                type="button"
                onClick={handleAvatarClick}
                className="text-xs font-bold text-violet-600 dark:text-violet-400 hover:underline cursor-pointer"
              >
                Change Avatar
              </button>
            )}
          </div>

          {/* Details & Security Panel */}
          <div className="md:col-span-2 flex flex-col gap-8">
            
            {/* Display Name Edit Form */}
            <form onSubmit={handleUpdateName} className="p-8 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex flex-col gap-5">
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">Personal Information</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-3.5 py-2.5 text-sm outline-none focus:border-violet-500 transition-all placeholder:text-slate-400 text-[var(--color-text)]"
                    placeholder="John Doe"
                  />
                </div>

                <div className="flex flex-col gap-1.5 opacity-80">
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Email Address (Read-only)
                  </label>
                  <input
                    type="email"
                    disabled
                    value={user.email}
                    className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-950/40 px-3.5 py-2.5 text-sm text-slate-500 cursor-not-allowed outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSavingName}
                className="self-end px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-violet-600 to-cyan-500 hover:opacity-95 transition-all active:scale-[0.98] cursor-pointer disabled:opacity-50"
              >
                {isSavingName ? "Saving..." : "Save Changes"}
              </button>
            </form>

            {/* Change Password Form */}
            <form onSubmit={handleChangePassword} className="p-8 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex flex-col gap-5">
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">Security Credentials</h3>
              
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Current Password
                </label>
                <input
                  type="password"
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-3.5 py-2.5 text-sm outline-none focus:border-violet-500 transition-all placeholder:text-slate-400 text-[var(--color-text)]"
                  placeholder="••••••••"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    New Password
                  </label>
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-3.5 py-2.5 text-sm outline-none focus:border-violet-500 transition-all placeholder:text-slate-400 text-[var(--color-text)]"
                    placeholder="Minimum 6 characters"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-3.5 py-2.5 text-sm outline-none focus:border-violet-500 transition-all placeholder:text-slate-400 text-[var(--color-text)]"
                    placeholder="Confirm new password"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSavingPassword}
                className="self-end px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-violet-600 to-cyan-500 hover:opacity-95 transition-all active:scale-[0.98] cursor-pointer disabled:opacity-50"
              >
                {isSavingPassword ? "Updating..." : "Update Password"}
              </button>
            </form>

          </div>

        </div>

      </div>
    </div>
  );
}
