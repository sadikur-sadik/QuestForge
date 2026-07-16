"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import {
  Button,
  Avatar,
  Separator,
} from "@heroui/react";
import { Sun, Moon, ArrowRightToSquare, ArrowRightFromSquare, Rocket, Bars, Xmark, Person } from "@gravity-ui/icons";
import { authClient } from "@/lib/auth-client";

interface MockUser {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: string;
}

function useAuthSession() {
  const { data: session, isPending } = authClient.useSession();
  const isLoggedIn = !!session;
  const user: MockUser | null = session?.user
    ? {
      id: session.user.id,
      name: session.user.name,
      email: session.user.email,
      avatar: session.user.image || "",
      role: "player",
    }
    : null;

  const logout = async () => {
    await authClient.signOut();
  };

  return { isLoggedIn, user, logout, isPending };
}

/* ─── Route definitions ─────────────────────────────────── */
const PUBLIC_ROUTES = [
  { label: "Home", href: "/" },
  { label: "View Games", href: "/games" },
  { label: "Add Games", href: "/add-games" },
  { label: "My Games", href: "/my-games" },
  { label: "My Gaming Bucket", href: "/my-bucket" },
];

const AUTH_ROUTES: { label: string; href: string }[] = [];

/* ─── Theme Toggle ──────────────────────────────────────── */
function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <div className="w-9 h-9 rounded-lg bg-[var(--color-border)] animate-pulse" />
    );
  }

  const isDark = theme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label="Toggle theme"
      className="
        relative flex items-center justify-center
        w-9 h-9 rounded-lg
        bg-[var(--color-surface)] border border-[var(--color-border)]
        text-[var(--color-muted)]
        hover:text-[var(--color-accent-primary)]
        hover:border-[var(--color-accent-primary)]
        hover:shadow-[0_0_0_2px_#6d28d920]
        transition-all duration-200
        cursor-pointer
      "
    >
      {isDark ? (
        <Sun width={16} height={16} />
      ) : (
        <Moon width={16} height={16} />
      )}
    </button>
  );
}

/* ─── Nav Link ──────────────────────────────────────────── */
function NavLink({
  href,
  label,
  active,
  onClick,
}: {
  href: string;
  label: string;
  active: boolean;
  onClick?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`
        relative text-sm font-medium px-1 py-0.5
        transition-colors duration-200
        after:absolute after:bottom-0 after:left-0 after:h-[2px]
        after:rounded-full after:transition-all after:duration-300
        ${active
          ? "text-violet-600 dark:text-violet-400 after:w-full after:bg-gradient-to-r after:from-violet-600 after:to-cyan-500"
          : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white after:w-0 hover:after:w-full after:bg-gradient-to-r after:from-violet-600 after:to-cyan-500"
        }
      `}
    >
      {label}
    </Link>
  );
}

/* ─── Profile Drawer ────────────────────────────────────── */
function ProfileDrawer({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const { user, logout } = useAuthSession();

  function handleLogout() {
    logout();
    onClose();
  }

  // Prevent scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <>
      {/* Backdrop Overlay */}
      <div
        onClick={onClose}
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-opacity duration-300 ease-in-out ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Drawer Container Panel - sliding in from the right */}
      <div
        className={`fixed top-0 right-0 bottom-0 z-50 w-full max-w-sm bg-[var(--color-surface)] border-l border-[var(--color-border)] shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          type="button"
          className="absolute top-4 right-4 p-1.5 rounded-lg text-[var(--color-muted)] hover:bg-[var(--color-border)] hover:text-[var(--color-text)] transition cursor-pointer"
          aria-label="Close menu"
        >
          ✕
        </button>

        {/* Drawer Header */}
        <div className="border-b border-[var(--color-border)] flex flex-col gap-0.5 px-6 py-5">
          <h2 className="text-[var(--color-text)] text-lg font-black tracking-tight">
            My Profile
          </h2>
          <span className="text-[var(--color-muted)] text-xs font-normal">
            {user?.role === "admin" ? "Administrator" : "Player Account"}
          </span>
        </div>

        {/* Drawer Body */}
        <div className="py-6 px-6 flex-1 overflow-y-auto flex flex-col gap-5">
          <div className="flex items-center gap-4">
            <Avatar size="lg" className="ring-2 ring-[var(--color-accent-primary)] ring-offset-2 ring-offset-[var(--color-surface)]">
              <Avatar.Image src={user?.avatar} alt={user?.name} />
              <Avatar.Fallback>{user?.name?.[0]}</Avatar.Fallback>
            </Avatar>
            <div className="flex flex-col gap-0.5">
              <p className="text-[var(--color-text)] font-semibold text-sm">
                {user?.name}
              </p>
              <p className="text-[var(--color-muted)] text-xs">{user?.email}</p>
              <span
                className={`
                  mt-1.5 inline-flex w-fit items-center rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider
                  ${user?.role === "admin"
                    ? "bg-[#6d28d920] text-[var(--color-accent-primary)]"
                    : "bg-[#06b6d420] text-[var(--color-accent-secondary)]"
                  }
                `}
              >
                {user?.role}
              </span>
            </div>
          </div>

          <Separator className="bg-[var(--color-border)] my-2" />

          <div className="flex flex-col gap-2">
            <Link
              href="/my-games"
              onClick={onClose}
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-[var(--color-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-border)] transition-all duration-200"
            >
              <Rocket width={16} height={16} />
              My Games
            </Link>
            <Link
              href="/add-games"
              onClick={onClose}
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-[var(--color-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-border)] transition-all duration-205"
            >
              <Person width={16} height={16} />
              Add a Game
            </Link>
            <Link
              href="/my-interactions"
              onClick={onClose}
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-[var(--color-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-border)] transition-all duration-200"
            >
              <svg className="w-4 h-4 text-[var(--color-muted)] shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              My Interactions
            </Link>
            <Link
              href="/view-profile"
              onClick={onClose}
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-[var(--color-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-border)] transition-all duration-200"
            >
              <Person width={16} height={16} />
              Profile Settings
            </Link>
          </div>
        </div>

        {/* Drawer Footer */}
        <div className="border-t border-[var(--color-border)] px-6 py-5">
          <Button
            onPress={handleLogout}
            className="
              w-full bg-[var(--color-accent-danger)] text-white font-bold py-3 rounded-xl
              hover:opacity-90 transition-opacity flex items-center justify-center gap-2 cursor-pointer
            "
          >
            <ArrowRightFromSquare width={14} height={14} />
            Log Out
          </Button>
        </div>
      </div>
    </>
  );
}

/* ─── Mobile Drawer ─────────────────────────────────────── */
function MobileDrawer({
  isOpen,
  onClose,
  pathname,
}: {
  isOpen: boolean;
  onClose: () => void;
  pathname: string;
}) {
  const { isLoggedIn, user, logout } = useAuthSession();
  const [profileOpen, setProfileOpen] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    if (!isOpen) return;
    function handleOutside(e: MouseEvent) {
      if (drawerRef.current && !drawerRef.current.contains(e.target as Node)) {
        onClose();
      }
    }
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, [isOpen, onClose]);

  // Lock body scroll when open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  const allRoutes = isLoggedIn
    ? [...PUBLIC_ROUTES, ...AUTH_ROUTES]
    : PUBLIC_ROUTES;

  return (
    <>
      {/* Backdrop */}
      <div
        className={`
          fixed inset-0 z-40 bg-black/60 backdrop-blur-sm
          transition-opacity duration-300
          ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}
        `}
        aria-hidden="true"
      />

      {/* Drawer panel */}
      <div
        ref={drawerRef}
        className={`
          fixed top-0 right-0 z-50 h-full w-72 max-w-[85vw]
          bg-[var(--color-surface)] border-l border-[var(--color-border)]
          shadow-2xl flex flex-col
          transition-transform duration-300 ease-out
          ${isOpen ? "translate-x-0" : "translate-x-full"}
        `}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
      >
        {/* Drawer header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--color-border)]">
          <span className="text-[var(--color-text)] font-bold text-lg">
            <span className="text-[var(--color-accent-primary)]">Quest</span>Forge
          </span>
          <button
            onClick={onClose}
            aria-label="Close menu"
            className="
              flex items-center justify-center w-8 h-8 rounded-lg
              text-[var(--color-muted)] hover:text-[var(--color-text)]
              hover:bg-[var(--color-border)] transition-colors cursor-pointer
            "
          >
            <Xmark width={16} height={16} />
          </button>
        </div>

        {/* User info strip (logged in) */}
        {isLoggedIn && user && (
          <div className="flex items-center gap-3 px-5 py-4 border-b border-[var(--color-border)] bg-[var(--color-accent-primary)]/5">
            <Avatar
              size="sm"
              className="ring-2 ring-[var(--color-accent-primary)] ring-offset-1 ring-offset-[var(--color-surface)] shrink-0"
            >
              <Avatar.Image src={user.avatar} alt={user.name} />
              <Avatar.Fallback>{user.name?.[0]}</Avatar.Fallback>
            </Avatar>
            <div className="flex flex-col min-w-0">
              <p className="text-[var(--color-text)] text-sm font-semibold truncate">
                {user.name}
              </p>
              <p className="text-[var(--color-muted)] text-xs truncate">
                {user.email}
              </p>
            </div>
          </div>
        )}

        {/* Nav links */}
        <nav className="flex-1 flex flex-col gap-1 px-3 py-4 overflow-y-auto">
          {allRoutes.map((route) => {
            const isActive =
              route.href === "/"
                ? pathname === "/"
                : pathname.startsWith(route.href);
            return (
              <Link
                key={route.href}
                href={route.href}
                onClick={onClose}
                className={`
                  flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium
                  transition-all duration-200
                  ${isActive
                    ? "bg-[var(--color-accent-primary)]/15 text-[var(--color-accent-primary)]"
                    : "text-[var(--color-muted)] hover:bg-[var(--color-border)] hover:text-[var(--color-text)]"
                  }
                `}
              >
                {route.label}
                {isActive && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[var(--color-accent-primary)]" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer actions */}
        <div className="px-3 pb-6 pt-2 border-t border-[var(--color-border)] flex flex-col gap-2">
          <div className="flex items-center justify-between px-2 py-2">
            <span className="text-[var(--color-muted)] text-xs">Theme</span>
            <ThemeToggle />
          </div>

          {isLoggedIn ? (
            <>
              <Button
                onPress={() => { setProfileOpen(true); onClose(); }}
                variant="outline"
                className="w-full justify-start bg-transparent border border-[var(--color-border)] text-[var(--color-text)] flex items-center gap-2"
              >
                <Person width={14} height={14} />
                View Profile
              </Button>
              <Button
                onPress={() => { logout(); onClose(); }}
                className="w-full bg-[var(--color-accent-danger)] text-white font-semibold flex items-center justify-center gap-2"
              >
                <ArrowRightFromSquare width={14} height={14} />
                Log Out
              </Button>
            </>
          ) : (
            <Link href="/login" onClick={onClose} className="w-full">
              <Button
                className="w-full bg-[var(--color-accent-primary)] text-white font-semibold flex items-center justify-center gap-2"
              >
                <ArrowRightToSquare width={14} height={14} />
                Log In
              </Button>
            </Link>
          )}
        </div>
      </div>

      {profileOpen && (
        <ProfileDrawer
          isOpen={profileOpen}
          onClose={() => setProfileOpen(false)}
        />
      )}
    </>
  );
}

/* ─── Main Navbar ───────────────────────────────────────── */
export default function Navbar() {
  const pathname = usePathname();
  const { isLoggedIn, user } = useAuthSession();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const onOpen = () => setIsOpen(true);
  const onClose = () => setIsOpen(false);

  // Close drawer on route change
  useEffect(() => {
    setDrawerOpen(false);
  }, [pathname]);

  const visibleRoutes = isLoggedIn
    ? [...PUBLIC_ROUTES, ...AUTH_ROUTES]
    : PUBLIC_ROUTES;

  return (
    <>
      <header
        className="
          fixed top-0 left-0 right-0 z-30
          bg-[var(--color-surface)]/80 backdrop-blur-xl
          border-b border-[var(--color-border)]
          transition-colors duration-300
        "
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">

            {/* ── Logo ── */}
            <Link
              href="/"
              className="flex items-center gap-2.5 group shrink-0"
            >
              <div className="
                flex items-center justify-center w-8 h-8 rounded-lg
                bg-gradient-to-r from-violet-600 to-cyan-500
                shadow-[0_0_12px_rgba(109,40,217,0.3)]
                group-hover:shadow-[0_0_20px_rgba(109,40,217,0.5)]
                transition-shadow duration-300
              ">
                <Rocket width={16} height={16} className="text-white" />
              </div>
              <span className="font-extrabold text-lg tracking-tight text-slate-900 dark:text-white transition-colors group-hover:text-violet-600 dark:group-hover:text-violet-400">
                <span className="text-violet-600 dark:text-violet-400">Quest</span>Forge
              </span>
            </Link>

            {/* ── Desktop Nav Links ── */}
            <nav className="hidden md:flex items-center gap-6" aria-label="Main navigation">
              {visibleRoutes.map((route) => {
                const isActive =
                  route.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(route.href);
                return (
                  <NavLink
                    key={route.href}
                    href={route.href}
                    label={route.label}
                    active={isActive}
                  />
                );
              })}
            </nav>

            {/* ── Right Controls ── */}
            <div className="flex items-center gap-2">
              {/* Theme toggle — always visible */}
              <div className="hidden sm:flex">
                <ThemeToggle />
              </div>

              {/* Auth controls — desktop only */}
              {isLoggedIn ? (
                <div className="hidden md:flex items-center gap-2">
                  <button
                    onClick={onOpen}
                    aria-label="Open profile"
                    className="
                      flex items-center gap-2 rounded-lg pl-2 pr-3 py-1.5
                      border border-[var(--color-border)]
                      hover:border-[var(--color-accent-primary)]
                      hover:shadow-[0_0_0_2px_#6d28d920]
                      transition-all duration-200 cursor-pointer
                      bg-[var(--color-surface)]
                    "
                  >
                    <Avatar
                      size="sm"
                      className="w-6 h-6 ring-1 ring-[var(--color-accent-primary)]"
                    >
                      <Avatar.Image src={user?.avatar} alt={user?.name} />
                      <Avatar.Fallback>{user?.name?.[0]}</Avatar.Fallback>
                    </Avatar>
                    <span className="text-xs font-medium text-[var(--color-text)] max-w-[80px] truncate">
                      {user?.name?.split(" ")[0]}
                    </span>
                  </button>
                </div>
              ) : (
                <Link href="/login" className="hidden md:flex">
                  <Button
                    size="sm"
                    className="
                      bg-gradient-to-r from-violet-600 to-cyan-500 text-white font-extrabold text-xs
                      shadow-[0_4px_12px_-3px_rgba(109,40,217,0.4)]
                      hover:opacity-95 active:scale-95
                      transition-all duration-200
                      flex items-center justify-center gap-1.5 cursor-pointer
                    "
                  >
                    <ArrowRightToSquare width={13} height={13} />
                    Log In
                  </Button>
                </Link>
              )}

              {/* Hamburger — mobile only */}
              <button
                onClick={() => setDrawerOpen(true)}
                aria-label="Open navigation menu"
                aria-expanded={drawerOpen}
                className="
                  md:hidden flex items-center justify-center
                  w-9 h-9 rounded-lg
                  border border-[var(--color-border)]
                  text-[var(--color-muted)]
                  hover:text-[var(--color-text)]
                  hover:border-[var(--color-accent-primary)]
                  transition-all duration-200 cursor-pointer
                  bg-[var(--color-surface)]
                "
              >
                <Bars width={16} height={16} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Spacer so content doesn't hide behind fixed navbar */}
      <div className="h-16" aria-hidden="true" />

      {/* Profile Drawer */}
      <ProfileDrawer isOpen={isOpen} onClose={onClose} />

      {/* Mobile Drawer */}
      <MobileDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        pathname={pathname}
      />
    </>
  );
}
