"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Rocket } from "@gravity-ui/icons";
import { uploadImageToImgBB } from "@/lib/imgbb";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

const EyeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" /></svg>
);

const EyeOffIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" /><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" /><path d="M6.61 6.61A13.52 13.52 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" /><line x1="2" y1="2" x2="22" y2="22" /></svg>
);

const GoogleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335" />
  </svg>
);

export default function RegisterPage() {
  const router = useRouter();
  // Form Fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Avatar Upload States
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarError, setAvatarError] = useState<string | null>(null);

  // Password Visibility Toggle States
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  // Clean up Object URL on component unmount to prevent memory leaks
  useEffect(() => {
    return () => {
      if (avatarPreview) {
        URL.revokeObjectURL(avatarPreview);
      }
    };
  }, [avatarPreview]);

  // Password Validation Criteria
  const passwordCriteria = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[^A-Za-z0-9]/.test(password),
  };

  const checkedCriteriaCount = Object.values(passwordCriteria).filter(Boolean).length;

  let strengthLabel = "";
  let strengthProgressWidth = "0%";

  if (password.length > 0) {
    if (password.length < 8) { // Changed threshold to 8 to match registration rules
      strengthLabel = "Very Weak (min 8 chars)";
      strengthProgressWidth = "20%";
    } else {
      switch (checkedCriteriaCount) {
        case 1:
        case 2:
          strengthLabel = "Weak";
          strengthProgressWidth = "40%";
          break;
        case 3:
        case 4:
          strengthLabel = "Medium";
          strengthProgressWidth = "70%";
          break;
        case 5:
          strengthLabel = "Strong";
          strengthProgressWidth = "100%";
          break;
        default:
          strengthLabel = "Weak";
          strengthProgressWidth = "40%";
      }
    }
  }

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setAvatarError("Please select a valid image file (PNG, JPG, etc.)");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setAvatarError("Image size must be less than 5MB");
      return;
    }

    setAvatarFile(file);
    setAvatarError(null);

    if (avatarPreview) {
      URL.revokeObjectURL(avatarPreview);
    }
    setAvatarPreview(URL.createObjectURL(file));
  };

  const handleRemoveAvatar = (e: React.MouseEvent) => {
    e.preventDefault();
    setAvatarFile(null);
    if (avatarPreview) {
      URL.revokeObjectURL(avatarPreview);
      setAvatarPreview(null);
    }
    setAvatarError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    if (password.length < 8) {
      toast.error("Password must be at least 8 characters long!");
      return;
    }

    if (checkedCriteriaCount < 3) {
      toast.error("Please choose a stronger password. It should meet at least 3 strength conditions (e.g. contains numbers, uppercase, symbols).");
      return;
    }

    setIsLoading(true);
    let imageUrl: string | null = null;

    try {
      if (avatarFile) {
        imageUrl = await uploadImageToImgBB(avatarFile);
      }



      // Un-commented the signup logic so users can register successfully
      const { data, error } = await authClient.signUp.email({
        name: name,
        email: email,
        password: password,
        image: imageUrl || undefined,
        callbackURL: "/"
      });
      if (error) {
        console.error("Registration error:", error);
        toast.error(error.message || "Registration failed. Please try again.");
        return;
      }

      if (data) {
        toast.success("Registration successful!");
        router.push("/");
      }

    } catch (error: any) {
      console.error("Registration error:", error);
      toast.error(error.message || "Registration failed. An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };


  const handleGoogleRegister = async () => {
    // Optionally connected Google Sign-In helper to Better Auth
    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/"
      });
    } catch (error: any) {
      console.error("Google sign-up failed:", error);
      toast.error("Google sign-up failed. Please try again.");
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-64px)] w-full flex items-center justify-center pt-24 pb-16 px-4 overflow-hidden">

      {/* ── Background Cyber Glow Blobs ── */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div
          className="absolute top-1/4 -right-20 w-80 h-80 rounded-full bg-[var(--color-accent-primary)]/10 blur-[100px] animate-pulse"
          style={{ animationDuration: "10s" }}
        />
        <div
          className="absolute bottom-1/4 -left-20 w-96 h-96 rounded-full bg-[var(--color-accent-secondary)]/15 blur-[120px] animate-pulse"
          style={{ animationDuration: "14s" }}
        />
      </div>

      {/* ── Main Form Card ── */}
      <div className="relative z-10 w-full max-w-md">
        <div className="
          relative p-[1px] rounded-3xl overflow-hidden
          bg-gradient-to-b from-slate-200/50 via-slate-200/10 to-transparent
          dark:from-slate-700/50 dark:via-slate-800/10 dark:to-transparent
          shadow-2xl
        ">

          <div className="
            relative bg-white/70 dark:bg-slate-900/60 backdrop-blur-2xl px-8 py-9 rounded-[23px]
            flex flex-col gap-5 w-full border border-white/20 dark:border-slate-800/40
          ">

            {/* Header */}
            <div className="text-center flex flex-col items-center gap-1.5">
              <div className="
                flex items-center justify-center w-11 h-11 rounded-2xl
                bg-gradient-to-r from-violet-600 to-cyan-500
                shadow-[0_0_18px_rgba(109,40,217,0.3)] mb-1.5
              ">
                <Rocket width={18} height={18} className="text-white" />
              </div>
              <h2 className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                Create Account
              </h2>
              <p className="text-[var(--color-muted)] text-xs">
                Join QuestForge and build your game catalog
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">

              {/* Avatar Upload */}
              <div className="flex flex-col items-center gap-2 mb-2">
                <label className="text-[10px] font-bold text-[var(--color-text)] tracking-wider uppercase opacity-80">
                  Profile Picture (Optional)
                </label>
                <div className="relative">
                  <input
                    type="file"
                    id="avatar-upload"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                    disabled={isLoading}
                  />
                  <label htmlFor="avatar-upload" className="block focus:outline-none">
                    {avatarPreview ? (
                      <div className="relative group w-24 h-24 rounded-full overflow-hidden border border-dashed border-[var(--color-border)] bg-[var(--color-surface)] flex items-center justify-center cursor-pointer shadow-md transition-all duration-300 hover:border-[var(--color-accent-primary)]">
                        <img
                          src={avatarPreview}
                          alt="Avatar Preview"
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white text-[10px] font-bold transition-opacity duration-300">
                          <svg className="w-5 h-5 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path>
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path>
                          </svg>
                          Change Photo
                        </div>
                      </div>
                    ) : (
                      <div className="relative group w-24 h-24 rounded-full overflow-hidden border border-dashed border-[var(--color-border)] bg-[var(--color-surface)] flex flex-col items-center justify-center cursor-pointer shadow-md transition-all duration-300 hover:border-[var(--color-accent-primary)]">
                        <div className="flex flex-col items-center justify-center text-[var(--color-muted)] group-hover:text-[var(--color-accent-primary)]">
                          <svg className="w-7 h-7 mb-1 opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                          </svg>
                          <span className="text-[10px] font-semibold text-center leading-tight opacity-75">Upload Photo</span>
                        </div>
                      </div>
                    )}
                  </label>
                  {avatarPreview && (
                    <button
                      type="button"
                      onClick={handleRemoveAvatar}
                      className="absolute -bottom-1 -right-1 bg-rose-500 hover:bg-rose-600 text-white rounded-full p-1 shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer border border-white dark:border-slate-900"
                      title="Remove Photo"
                      disabled={isLoading}
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12"></path>
                      </svg>
                    </button>
                  )}
                </div>
                {avatarError && (
                  <span className="text-xs text-rose-500 font-semibold">{avatarError}</span>
                )}
              </div>


              {/* Full Name */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-[var(--color-text)] tracking-wider uppercase opacity-80">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Master Chief"
                  className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-3.5 py-2.5 text-sm text-[var(--color-text)] outline-none focus:border-[var(--color-accent-primary)] focus:shadow-[0_0_0_2px_#6d28d920] transition-all duration-200 placeholder:text-[var(--color-muted)]/60"
                  disabled={isLoading}
                />
              </div>

              {/* Email address */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-[var(--color-text)] tracking-wider uppercase opacity-80">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="spartan117@gmail.com"
                  className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-3.5 py-2.5 text-sm text-[var(--color-text)] outline-none focus:border-[var(--color-accent-primary)] focus:shadow-[0_0_0_2px_#6d28d920] transition-all duration-200 placeholder:text-[var(--color-muted)]/60"
                  disabled={isLoading}
                />
              </div>

              {/* Password */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-[var(--color-text)] tracking-wider uppercase opacity-80">
                  Password
                </label>
                <div className="relative flex items-center rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] focus-within:border-[var(--color-accent-primary)] focus-within:shadow-[0_0_0_2px_#6d28d920] transition-all duration-200 px-3.5">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full py-2.5 bg-transparent text-sm text-[var(--color-text)] outline-none placeholder:text-[var(--color-muted)]/60"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-[var(--color-muted)] hover:text-[var(--color-text)] transition-colors shrink-0 ml-2 cursor-pointer"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                  </button>
                </div>
              </div>

              {/* Password Strength Indicator */}
              {password.length > 0 && (
                <div className="flex flex-col gap-2 mt-1 px-1">
                  {/* Progress Bar & Label */}
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-semibold text-[var(--color-muted)]">Password Strength:</span>
                    <span className={`text-[10px] font-extrabold transition-colors duration-300 ${checkedCriteriaCount === 5 && password.length >= 8
                      ? "text-emerald-500 dark:text-emerald-400"
                      : checkedCriteriaCount >= 3
                        ? "text-blue-500 dark:text-blue-400"
                        : "text-rose-500 dark:text-rose-400"
                      }`}>
                      {strengthLabel}
                    </span>
                  </div>

                  {/* Visual segment bar */}
                  <div className="h-1.5 w-full bg-[var(--color-surface)] border border-[var(--color-border)] rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${password.length < 8
                        ? "bg-rose-500"
                        : checkedCriteriaCount === 5 && password.length >= 8
                          ? "bg-emerald-500"
                          : checkedCriteriaCount >= 3
                            ? "bg-blue-500"
                            : "bg-rose-500"
                        }`}
                      style={{ width: strengthProgressWidth }}
                    />
                  </div>

                  {/* Checklist of conditions */}
                  <div className="grid grid-cols-2 gap-x-2 gap-y-1.5 mt-1 text-[10px] text-[var(--color-muted)]">
                    <div className="flex items-center gap-1.5">
                      <span className={`flex items-center justify-center w-3 h-3 rounded-full text-[9px] ${passwordCriteria.length ? "text-emerald-500 font-bold" : "text-slate-400 opacity-60"
                        }`}>
                        {passwordCriteria.length ? "✓" : "•"}
                      </span>
                      <span className={passwordCriteria.length ? "text-[var(--color-text)] font-semibold" : ""}>Min 8 characters</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className={`flex items-center justify-center w-3 h-3 rounded-full text-[9px] ${passwordCriteria.uppercase ? "text-emerald-500 font-bold" : "text-slate-400 opacity-60"
                        }`}>
                        {passwordCriteria.uppercase ? "✓" : "•"}
                      </span>
                      <span className={passwordCriteria.uppercase ? "text-[var(--color-text)] font-semibold" : ""}>Uppercase letter</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className={`flex items-center justify-center w-3 h-3 rounded-full text-[9px] ${passwordCriteria.lowercase ? "text-emerald-500 font-bold" : "text-slate-400 opacity-60"
                        }`}>
                        {passwordCriteria.lowercase ? "✓" : "•"}
                      </span>
                      <span className={passwordCriteria.lowercase ? "text-[var(--color-text)] font-semibold" : ""}>Lowercase letter</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className={`flex items-center justify-center w-3 h-3 rounded-full text-[9px] ${passwordCriteria.number ? "text-emerald-500 font-bold" : "text-slate-400 opacity-60"
                        }`}>
                        {passwordCriteria.number ? "✓" : "•"}
                      </span>
                      <span className={passwordCriteria.number ? "text-[var(--color-text)] font-semibold" : ""}>Number (0-9)</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className={`flex items-center justify-center w-3 h-3 rounded-full text-[9px] ${passwordCriteria.special ? "text-emerald-500 font-bold" : "text-slate-400 opacity-60"
                        }`}>
                        {passwordCriteria.special ? "✓" : "•"}
                      </span>
                      <span className={passwordCriteria.special ? "text-[var(--color-text)] font-semibold" : ""}>Special char (!@#...)</span>
                    </div>
                  </div>
                </div>
              )}


              {/* Confirm Password */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-[var(--color-text)] tracking-wider uppercase opacity-80">
                  Confirm Password
                </label>
                <div className="relative flex items-center rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] focus-within:border-[var(--color-accent-primary)] focus-within:shadow-[0_0_0_2px_#6d28d920] transition-all duration-200 px-3.5">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full py-2.5 bg-transparent text-sm text-[var(--color-text)] outline-none placeholder:text-[var(--color-muted)]/60"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="text-[var(--color-muted)] hover:text-[var(--color-text)] transition-colors shrink-0 ml-2 cursor-pointer"
                    aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                  >
                    {showConfirmPassword ? <EyeOffIcon /> : <EyeIcon />}
                  </button>
                </div>
              </div>

              {/* Register Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="
                  relative mt-1.5 w-full py-3 rounded-xl font-bold text-white text-sm
                  bg-gradient-to-r from-violet-600 to-cyan-500
                  hover:opacity-95 shadow-[0_4px_20px_-4px_rgba(109,40,217,0.4)]
                  hover:shadow-[0_4px_25px_-2px_rgba(109,40,217,0.6)] active:scale-[0.99]
                  transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer
                  disabled:opacity-55 disabled:pointer-events-none
                "
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  "Create Account"
                )}
              </button>
            </form>

            {/* Google Register alternative */}
            <div className="flex flex-col gap-3.5">
              <div className="flex items-center gap-2.5">
                <div className="h-[1px] bg-[var(--color-border)] flex-1" />
                <span className="text-[9px] font-bold text-[var(--color-muted)] tracking-wider uppercase">
                  Or Join With Google
                </span>
                <div className="h-[1px] bg-[var(--color-border)] flex-1" />
              </div>

              <button
                type="button"
                onClick={handleGoogleRegister}
                disabled={isLoading}
                className="
                  w-full flex items-center justify-center gap-2.5 py-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] 
                  hover:border-[var(--color-accent-primary)] hover:bg-[var(--color-accent-primary)]/5
                  transition-all duration-200 cursor-pointer text-sm font-semibold text-[var(--color-text)]
                  disabled:opacity-55 disabled:pointer-events-none
                "
              >
                <GoogleIcon />
                <span>Continue with Google</span>
              </button>
            </div>

            {/* Link to Login */}
            <div className="text-center text-xs text-slate-500 dark:text-slate-400 mt-2">
              Already have an account?{" "}
              <Link href="/login" className="text-violet-600 dark:text-violet-400 hover:underline font-bold">
                Log In
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}