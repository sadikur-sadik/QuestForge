"use client";

import React from "react";
import Link from "next/link";
import { Rocket } from "@gravity-ui/icons";

/* ─── Inline Social SVGs ─── */
const TwitterIcon = () => (
  <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

const DiscordIcon = () => (
  <svg width="18" height="18" fill="currentColor" viewBox="0 0 127.14 96.36">
    <path d="M107.7,8.07A105.15,105.15,0,0,0,77.26,0a77.19,77.19,0,0,0-3.3,6.83A96.67,96.67,0,0,0,53.22,6.83,77.19,77.19,0,0,0,49.88,0,105.15,105.15,0,0,0,19.44,8.07C3.66,31.58-1.86,54.65,1,77.53A105.73,105.73,0,0,0,32,96.36a77.7,77.7,0,0,0,6.63-10.85,69.43,69.43,0,0,1-10.5-5c.88-.65,1.72-1.34,2.51-2a75.58,75.58,0,0,0,73,0c.8.71,1.63,1.4,2.51,2a69.43,69.43,0,0,1-10.5,5,77.7,77.7,0,0,0,6.63,10.85,105.73,105.73,0,0,0,31-18.83C129,54.65,122.94,31.58,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53S36.18,40.36,42.45,40.36,53.9,46,53.9,53,48.72,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.24,60,73.24,53S78.41,40.36,84.69,40.36,96.14,46,96.14,53,91,65.69,84.69,65.69Z"/>
  </svg>
);

const SteamIcon = () => (
  <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 0C5.385 0 0 5.385 0 12c0 5.437 3.619 10.026 8.61 11.53l1.244-4.28c-.144-.067-.282-.148-.415-.24L7.026 17.5a3.86 3.86 0 0 1-.955.132 3.87 3.87 0 0 1-3.87-3.87c0-1.896 1.353-3.475 3.14-3.818l1.636-4.63a7.712 7.712 0 0 1 9.948 4.607 7.716 7.716 0 0 1-5.183 9.684l-4.103 1.34c.152.333.228.694.228 1.062a3.87 3.87 0 0 1-3.87 3.87c-.642 0-1.25-.157-1.78-.435l4.316 1.488C18.665 23.364 24 18.307 24 12c0-6.615-5.385-12-12-12zm-3.87 11.23a2.65 2.65 0 1 0 0 5.3 2.65 2.65 0 0 0 0-5.3zm.065.748a1.9 1.9 0 1 1-.002 3.801 1.9 1.9 0 0 1 .002-3.801zm3.83-6.616a6.388 6.388 0 1 0 4.148 11.232c.168.082.33.177.483.284l1.206 1.206a7.653 7.653 0 0 1-.77 2.067c-.209.068-.42.12-.638.156l-1.077-1.078a6.388 6.388 0 0 0-3.352-13.867z"/>
  </svg>
);

const GithubIcon = () => (
  <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
  </svg>
);

export default function Footer() {
  return (
    <footer className="w-full bg-[var(--color-surface)]/80 backdrop-blur-xl border-t border-[var(--color-border)] py-12 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* ── Grid Container ── */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          
          {/* Column 1: Info & Brand */}
          <div className="flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-2.5 group">
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
            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed max-w-xs transition-colors duration-300">
              Forge your ultimate digital game library. Discover, collectionize, and explore verified titles on the premium gaming hub.
            </p>
            {/* Social Icons */}
            <div className="flex items-center gap-4.5 mt-2 text-slate-400 dark:text-slate-500">
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-violet-600 dark:hover:text-violet-400 transition-colors duration-200" title="Twitter / X">
                <TwitterIcon />
              </a>
              <a href="https://discord.com" target="_blank" rel="noopener noreferrer" className="hover:text-violet-600 dark:hover:text-violet-400 transition-colors duration-200" title="Discord">
                <DiscordIcon />
              </a>
              <a href="https://steamcommunity.com" target="_blank" rel="noopener noreferrer" className="hover:text-violet-600 dark:hover:text-violet-400 transition-colors duration-200" title="Steam">
                <SteamIcon />
              </a>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-violet-600 dark:hover:text-violet-400 transition-colors duration-200" title="GitHub">
                <GithubIcon />
              </a>
            </div>
          </div>

          {/* Column 2: Marketplace */}
          <div className="flex flex-col gap-3">
            <h4 className="text-sm font-bold tracking-wider text-[var(--color-text)] uppercase mb-1">
              Storefront
            </h4>
            <Link href="/" className="text-sm text-slate-500 dark:text-slate-400 hover:text-violet-600 dark:hover:text-violet-400 transition-colors duration-200">
              Browse Home
            </Link>
            <Link href="/games" className="text-sm text-slate-500 dark:text-slate-400 hover:text-violet-600 dark:hover:text-violet-400 transition-colors duration-200">
              View Games Catalog
            </Link>
            <Link href="/add-games" className="text-sm text-slate-500 dark:text-slate-400 hover:text-violet-600 dark:hover:text-violet-400 transition-colors duration-200">
              Submit a Title
            </Link>
          </div>

          {/* Column 3: Player Center */}
          <div className="flex flex-col gap-3">
            <h4 className="text-sm font-bold tracking-wider text-[var(--color-text)] uppercase mb-1">
              Player Hub
            </h4>
            <Link href="/my-games" className="text-sm text-slate-500 dark:text-slate-400 hover:text-violet-600 dark:hover:text-violet-400 transition-colors duration-200">
              My Library
            </Link>
            <Link href="/my-bucket" className="text-sm text-slate-500 dark:text-slate-400 hover:text-violet-600 dark:hover:text-violet-400 transition-colors duration-200">
              My Gaming Bucket
            </Link>
            <Link href="/login" className="text-sm text-slate-500 dark:text-slate-400 hover:text-violet-600 dark:hover:text-violet-400 transition-colors duration-200">
              Member Sign In
            </Link>
          </div>

          {/* Column 4: Legals & Support */}
          <div className="flex flex-col gap-3">
            <h4 className="text-sm font-bold tracking-wider text-[var(--color-text)] uppercase mb-1">
              Resources
            </h4>
            <Link href="/register" className="text-sm text-slate-500 dark:text-slate-400 hover:text-violet-600 dark:hover:text-violet-400 transition-colors duration-200">
              Create Account
            </Link>
            <button
              onClick={() => alert("Help Center is currently in sandbox demo mode.")}
              className="text-left text-sm text-slate-500 dark:text-slate-400 hover:text-violet-600 dark:hover:text-violet-400 transition-colors duration-200 cursor-pointer"
            >
              FAQ & Support
            </button>
            <button
              onClick={() => alert("Privacy Policies are managed by QuestForge Client Sandbox.")}
              className="text-left text-sm text-slate-500 dark:text-slate-400 hover:text-violet-600 dark:hover:text-violet-400 transition-colors duration-200 cursor-pointer"
            >
              Security Policy
            </button>
          </div>

        </div>

        {/* ── Divider & Copyright Row ── */}
        <div className="border-t border-[var(--color-border)] pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[var(--color-muted)]">
          <p>
            © {new Date().getFullYear()} QuestForge. All rights reserved.
          </p>
          <p className="flex items-center gap-1.5">
            <span>Powered by Next.js & HeroUI</span>
          </p>
        </div>

      </div>
    </footer>
  );
}
