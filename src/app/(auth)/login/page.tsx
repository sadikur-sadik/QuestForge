"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Rocket } from "@gravity-ui/icons";
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

export interface LoginCredentials {
  email: string;
  password: string;
}

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data, error } = await authClient.signIn.email({
        email: email,
        password: password,
        rememberMe: true,
        callbackURL: "/",
      });

      if (error) {
        console.error("Login error:", error);
        toast.error(error.message || "Failed to log in. Please check your credentials.");
        setIsLoading(false);
        return;
      }

      if (data) {
        toast.success("Login successful!");
        router.push("/");
      }
    } catch (err: any) {
      console.error("Login error:", err);
      toast.error(err.message || "An unexpected error occurred during login.");
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/",
      });
    } catch (err: any) {
      console.error("Google sign in error:", err);
      toast.error(err.message || "Failed to sign in with Google.");
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-64px)] w-full flex items-center justify-center pt-20 pb-16 px-4 overflow-hidden">

      {/* ── Background Cyber Glow Blobs ── */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div
          className="absolute top-1/4 -left-20 w-80 h-80 rounded-full bg-[var(--color-accent-primary)]/10 blur-[100px] animate-pulse"
          style={{ animationDuration: "12s" }}
        />
        <div
          className="absolute bottom-1/4 -right-20 w-96 h-96 rounded-full bg-[var(--color-accent-secondary)]/15 blur-[120px] animate-pulse"
          style={{ animationDuration: "8s" }}
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
            relative bg-white/70 dark:bg-slate-900/60 backdrop-blur-2xl px-8 py-10 rounded-[23px]
            flex flex-col gap-6 w-full border border-white/20 dark:border-slate-800/40
          ">

            {/* Header */}
            <div className="text-center flex flex-col items-center gap-2">
              <div className="
                flex items-center justify-center w-12 h-12 rounded-2xl
                bg-gradient-to-r from-violet-600 to-cyan-500
                shadow-[0_0_20px_rgba(109,40,217,0.3)] mb-2
              ">
                <Rocket width={20} height={20} className="text-white" />
              </div>
              <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                Welcome to <span className="text-violet-600 dark:text-violet-400">Quest</span>Forge
              </h2>
              <p className="text-[var(--color-muted)] text-sm">
                Log in to sync your game library and bucket list
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">

              {/* Email */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-[var(--color-text)] tracking-wider uppercase opacity-80">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@gmail.com"
                  className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-3.5 py-2.5 text-sm text-[var(--color-text)] outline-none focus:border-[var(--color-accent-primary)] focus:shadow-[0_0_0_2px_#6d28d920] transition-all duration-200 placeholder:text-[var(--color-muted)]/60"
                  disabled={isLoading}
                />
              </div>

              {/* Password */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-[var(--color-text)] tracking-wider uppercase opacity-80">
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

              {/* Login Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="
                  relative mt-2 w-full py-3 rounded-xl font-bold text-white text-sm
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
                  "Log In to Marketplace"
                )}
              </button>
            </form>

            {/* Google OAuth alternative */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <div className="h-[1px] bg-[var(--color-border)] flex-1" />
                <span className="text-[10px] font-bold text-[var(--color-muted)] tracking-wider uppercase">
                  Or Forge with Google
                </span>
                <div className="h-[1px] bg-[var(--color-border)] flex-1" />
              </div>

              <button
                type="button"
                onClick={handleGoogleLogin}
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

            {/* Link to Register */}
            <div className="text-center text-xs text-slate-500 dark:text-slate-400 mt-2">
              Don't have an account?{" "}
              <Link href="/register" className="text-violet-600 dark:text-violet-400 hover:underline font-bold">
                Create Account
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
