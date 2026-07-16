"use client";

import React from "react";
import Link from "next/link";

export default function Banner() {
  return (
    <div className="w-full max-w-[96%] mx-auto px-0 py-2">
      {/* Banner Container: Theme-responsive Background and Border */}
      <div className="relative w-full overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800/40 shadow-xl dark:shadow-2xl bg-gradient-to-br from-slate-50 via-zinc-100 to-white dark:from-slate-900 dark:via-slate-950 dark:to-zinc-950 p-8 sm:p-12 lg:p-16 select-none transition-colors duration-300">
        
        {/* Style block for animations and theme-responsive SVG overrides */}
        <style>{`
          /* Slide and Fade Animations for Text and Buttons */
          .anim-slide-up {
            opacity: 0;
            transform: translateY(20px);
            animation: slideUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          }
          
          .anim-delay-1 { animation-delay: 0.15s; }
          .anim-delay-2 { animation-delay: 0.3s; }
          .anim-delay-3 { animation-delay: 0.45s; }
          .anim-delay-4 { animation-delay: 0.6s; }

          @keyframes slideUp {
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          /* Floating Animations for SVG Graphics */
          @keyframes float-slow {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-12px) rotate(1.5deg); }
          }

          @keyframes float-medium {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-8px) rotate(-1deg); }
          }

          @keyframes pulse-glow {
            0%, 100% { opacity: 0.4; }
            50% { opacity: 0.8; }
          }

          @keyframes spark-rise {
            0% { transform: translateY(0) scale(1); opacity: 0; }
            10% { opacity: 0.9; }
            90% { opacity: 0.3; }
            100% { transform: translateY(-150px) scale(0.3); opacity: 0; }
          }

          @keyframes star-twinkle {
            0%, 100% { opacity: 0.3; transform: scale(0.8); }
            50% { opacity: 1; transform: scale(1.2); }
          }

          /* SVG Classes & Animations */
          .anim-float-sword {
            animation: float-slow 6s ease-in-out infinite;
            transform-origin: 320px 220px;
          }

          .anim-float-controller {
            animation: float-medium 5s ease-in-out infinite;
            transform-origin: 180px 280px;
          }

          .anim-pulse {
            animation: pulse-glow 4s ease-in-out infinite;
          }

          .spark {
            animation: spark-rise 3.5s ease-in infinite;
            transform-origin: center bottom;
          }

          .star {
            animation: star-twinkle 3s ease-in-out infinite;
          }

          /* ─── THEME RESPONSIVE SVG OVERRIDES ─── */
          
          /* Stars */
          .star { fill: #475569; }
          .dark .star { fill: #ffffff; }

          /* Portal Ring Disc Background */
          .portal-base { fill: #ffffff; stroke: #c084fc; stroke-width: 1px; }
          .dark .portal-base { fill: #020205; stroke: #a855f7; stroke-width: 1px; }

          /* Controller Body */
          .controller-body { fill: #f8fafc; fill-opacity: 0.95; }
          .dark .controller-body { fill: #110c24; fill-opacity: 0.95; }

          /* Controller Joysticks */
          .joystick-base { fill: #e2e8f0; stroke: #cbd5e1; }
          .dark .joystick-base { fill: #090514; stroke: #475569; }

          /* Sword Grip & Pommel */
          .sword-pommel { fill: url(#gold-grad); stroke: #cbd5e1; }
          .dark .sword-pommel { fill: url(#gold-grad); stroke: #110c24; }
          .sword-grip { fill: #e2e8f0; stroke: url(#gold-grad); }
          .dark .sword-grip { fill: #110c24; stroke: url(#gold-grad); }
        `}</style>

        {/* Ambient Glow Blobs in Banner Background - Softer in Light Mode */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
          <div className="absolute top-[-20%] left-[-10%] w-[350px] h-[350px] rounded-full bg-violet-600/10 dark:bg-violet-600/15 blur-[100px]" />
          <div className="absolute bottom-[-20%] right-[-10%] w-[450px] h-[450px] rounded-full bg-cyan-500/10 dark:bg-cyan-500/12 blur-[120px]" />
        </div>

        {/* Hero Content Grid */}
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* LEFT COLUMN: TEXT CONTENT & ACTIONS */}
          <div className="lg:col-span-7 flex flex-col gap-6 text-left">
            
            {/* System Badge - Theme Responsive */}
            <div className="anim-slide-up anim-delay-1 flex items-center gap-2 self-start px-3 py-1 rounded-full border border-violet-200 dark:border-violet-500/30 bg-violet-50 dark:bg-violet-500/10 backdrop-blur-md transition-colors duration-300">
              <span className="w-2 h-2 rounded-full bg-cyan-500 dark:bg-cyan-400 animate-pulse" />
              <span className="text-[10px] font-extrabold tracking-wider text-violet-700 dark:text-slate-300 uppercase transition-colors duration-300">
                SYSTEM ACTIVE V1.0
              </span>
            </div>

            {/* Main Animated Title - Theme Responsive */}
            <div className="anim-slide-up anim-delay-2 flex flex-col gap-2">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 dark:text-white font-sans transition-colors duration-300">
                QUEST
                <span className="bg-gradient-to-r from-violet-600 via-fuchsia-500 to-cyan-500 dark:from-violet-400 dark:via-fuchsia-400 dark:to-cyan-400 bg-clip-text text-transparent filter drop-shadow-[0_0_15px_rgba(109,40,217,0.2)] dark:drop-shadow-[0_0_15px_rgba(109,40,217,0.3)]">
                  FORGE
                </span>
              </h1>
              <div className="w-24 h-[4px] bg-gradient-to-r from-violet-500 to-cyan-400 rounded-full mt-1" />
            </div>

            {/* Subtitle / Description - Theme Responsive */}
            <div className="anim-slide-up anim-delay-3 flex flex-col gap-3">
              <h2 className="text-lg sm:text-xl font-bold text-slate-800 dark:text-slate-100 transition-colors duration-300">
                Forge Your Ultimate Game Catalog
              </h2>
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-xl leading-relaxed transition-colors duration-300">
                Track your quests, review your favorites, and build your digital game archive. Organise your backlog and share achievements in a premium environment designed for gamers.
              </p>
            </div>

            {/* Two Call-to-Action Buttons - Theme Responsive */}
            <div className="anim-slide-up anim-delay-4 flex flex-col sm:flex-row gap-4 mt-2 justify-center lg:justify-start items-center lg:items-start w-full">
              <Link
                href="/register"
                className="w-full sm:w-auto max-w-xs px-6 py-3.5 rounded-xl font-extrabold text-white text-xs bg-gradient-to-r from-violet-600 to-cyan-500 hover:opacity-95 shadow-[0_4px_20px_-4px_rgba(109,40,217,0.4)] active:scale-[0.98] transition-all duration-200 flex items-center justify-center cursor-pointer min-w-[200px] text-center"
              >
                Get Started
              </Link>
              <Link
                href="/games"
                className="w-full sm:w-auto max-w-xs px-6 py-3.5 rounded-xl font-extrabold text-slate-700 dark:text-slate-300 text-xs border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all active:scale-[0.98] cursor-pointer shadow-sm flex items-center justify-center min-w-[200px] text-center"
              >
                Explore Games
              </Link>
            </div>

          </div>

          {/* RIGHT COLUMN: PREMIUM ANIMATED SVG GRAPHIC - Theme Responsive elements */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <div className="relative w-full max-w-[380px] aspect-square">
              
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 500 500"
                width="100%"
                height="100%"
                className="w-full h-full block overflow-visible"
              >
                <defs>
                  {/* Gradients */}
                  <linearGradient id="primary-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#a855f7" />
                    <stop offset="100%" stopColor="#6d28d9" />
                  </linearGradient>

                  <linearGradient id="secondary-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#06b6d4" />
                    <stop offset="100%" stopColor="#3b82f6" />
                  </linearGradient>

                  <linearGradient id="gold-grad" x1="0%" y1="100%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#f59e0b" />
                    <stop offset="100%" stopColor="#fbbf24" />
                  </linearGradient>

                  <linearGradient id="sword-blade" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#e2e8f0" />
                    <stop offset="50%" stopColor="#ffffff" />
                    <stop offset="100%" stopColor="#cbd5e1" />
                  </linearGradient>

                  {/* Glow Filters */}
                  <filter id="glow-heavy" x="-30%" y="-30%" width="160%" height="160%">
                    <feGaussianBlur stdDeviation="15" result="blur1" />
                    <feGaussianBlur stdDeviation="30" result="blur2" />
                    <feMerge>
                      <feMergeNode in="blur2" />
                      <feMergeNode in="blur1" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>

                  <filter id="glow-light" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="6" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>

                  <filter id="glow-cyan" x="-30%" y="-30%" width="160%" height="160%">
                    <feGaussianBlur stdDeviation="8" result="blur" />
                    <feColorMatrix type="matrix" values="
                      0 0 0 0 0.02
                      0 0 0 0 0.71
                      0 0 0 0 0.83
                      0 0 0 0 0.8 0" />
                    <feMerge>
                      <feMergeNode />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>

                {/* Floating twinkling stars surrounding artwork */}
                <g opacity={0.7}>
                  <circle cx="80" cy="90" r="1.5" className="star" style={{ animationDelay: "0.2s" }} />
                  <circle cx="430" cy="110" r="2" className="star" style={{ animationDelay: "1.5s" }} />
                  <circle cx="70" cy="380" r="2.5" className="star" style={{ animationDelay: "2.1s" }} />
                  <circle cx="410" cy="360" r="1.5" className="star" style={{ animationDelay: "0.5s" }} />
                  <circle cx="250" cy="40" r="2" className="star" style={{ animationDelay: "1.8s" }} />
                  <circle cx="460" cy="230" r="1" className="star" style={{ animationDelay: "2.7s" }} />
                </g>

                {/* Ambient graphic glow backdrops */}
                <circle cx="250" cy="250" r="120" fill="#6d28d9" opacity={0.25} filter="url(#glow-heavy)" />
                <circle cx="250" cy="250" r="90" fill="#06b6d4" opacity={0.15} filter="url(#glow-heavy)" />

                {/* Cyber Portal Rings */}
                <g transform="translate(250, 250)">
                  {/* Outer Pulsing Ring */}
                  <circle cx="0" cy="0" r="130" fill="none" stroke="url(#primary-grad)" strokeWidth="2" strokeDasharray="10 30" opacity={0.5} className="anim-pulse">
                    <animateTransform attributeName="transform" type="rotate" from="0" to="360" dur="25s" repeatCount="indefinite" />
                  </circle>
                  {/* Middle Ring */}
                  <circle cx="0" cy="0" r="110" fill="none" stroke="url(#secondary-grad)" strokeWidth="1.5" strokeDasharray="80 20 40 20" opacity={0.6} filter="url(#glow-light)">
                    <animateTransform attributeName="transform" type="rotate" from="360" to="0" dur="18s" repeatCount="indefinite" />
                  </circle>
                  {/* Inner Portal Base - Theme Responsive */}
                  <circle cx="0" cy="0" r="85" className="portal-base" />
                </g>

                {/* Rising Sparks inside the Portal */}
                <g transform="translate(250, 320)" opacity={0.9}>
                  <circle cx="-30" cy="0" r="3" fill="#f59e0b" filter="url(#glow-light)" className="spark" style={{ animationDelay: "0.1s" }} />
                  <circle cx="-10" cy="-10" r="2" fill="#06b6d4" filter="url(#glow-light)" className="spark" style={{ animationDelay: "1.2s" }} />
                  <circle cx="10" cy="-5" r="3.5" fill="#ef4444" filter="url(#glow-light)" className="spark" style={{ animationDelay: "0.5s" }} />
                  <circle cx="25" cy="-15" r="2.5" fill="#f59e0b" filter="url(#glow-light)" className="spark" style={{ animationDelay: "2.2s" }} />
                  <circle cx="-15" cy="-20" r="2" fill="#94a3b8" className="spark" style={{ animationDelay: "0.9s" }} />
                  <circle cx="5" cy="-25" r="3" fill="#a855f7" filter="url(#glow-light)" className="spark" style={{ animationDelay: "1.7s" }} />
                </g>

                {/* Floating Game Controller - Theme Responsive */}
                <g className="anim-float-controller" transform="translate(90, 160)">
                  {/* Glow */}
                  <rect x="0" y="0" width="130" height="90" rx="35" fill="#06b6d4" opacity={0.15} filter="url(#glow-heavy)" />
                  
                  {/* Gamepad body - Theme Responsive class */}
                  <path d="M 25,10 
                           C 10,10 0,25 0,45 
                           C 0,70 20,90 35,90 
                           C 42,90 50,82 60,75 
                           C 70,75 80,75 90,75 
                           C 100,82 108,90 115,90 
                           C 130,90 150,70 150,45 
                           C 150,25 140,10 125,10 
                           Z" 
                        className="controller-body" stroke="url(#secondary-grad)" strokeWidth="3" filter="url(#glow-light)" />
                  
                  {/* D-Pad */}
                  <path d="M 30,45 L 38,45 M 34,41 L 34,49" stroke="#cbd5e1" strokeWidth="3" strokeLinecap="round" />
                  
                  {/* Action Buttons */}
                  <circle cx="105" cy="48" r="4.5" fill="#ec4899" />
                  <circle cx="117" cy="40" r="4.5" fill="#3b82f6" />
                  <circle cx="117" cy="56" r="4.5" fill="#10b981" />
                  <circle cx="129" cy="48" r="4.5" fill="#f59e0b" />
                  
                  {/* Joysticks - Theme Responsive */}
                  <circle cx="53" cy="58" r="9" className="joystick-base" strokeWidth="2" />
                  <circle cx="53" cy="58" r="4" fill="#06b6d4" />
                  <circle cx="97" cy="58" r="9" className="joystick-base" strokeWidth="2" />
                  <circle cx="97" cy="58" r="4" fill="#06b6d4" />
                  
                  {/* Menu buttons */}
                  <line x1="70" y1="42" x2="76" y2="42" stroke="#64748b" strokeWidth="2" strokeLinecap="round" />
                  <line x1="82" y1="42" x2="88" y2="42" stroke="#64748b" strokeWidth="2" strokeLinecap="round" />
                </g>

                {/* Floating Sword / Quest Blade - Theme Responsive */}
                <g className="anim-float-sword" transform="translate(180, 60)">
                  {/* Background Blade Glow */}
                  <line x1="45" y1="240" x2="155" y2="50" stroke="#a855f7" strokeWidth="12" strokeLinecap="round" opacity={0.2} filter="url(#glow-heavy)" />
                  
                  {/* Sword Shadow/Glow */}
                  <path d="M 40,240 L 55,235 L 155,60 L 160,55 L 150,65 L 45,245 Z" fill="#6d28d9" opacity={0.3} filter="url(#glow-light)" />

                  {/* Sword Pommel & Grip - Theme Responsive classes */}
                  <circle cx="30" cy="265" r="9" className="sword-pommel" strokeWidth="1.5" />
                  <rect x="32" y="242" width="10" height="20" rx="3" transform="rotate(-30 32 242)" className="sword-grip" strokeWidth="1.5" />
                  
                  {/* Guard */}
                  <path d="M 25,235 L 60,215" stroke="url(#gold-grad)" strokeWidth="8" strokeLinecap="round" filter="url(#glow-light)" />
                  <circle cx="25" cy="235" r="3" fill="#fff" />
                  <circle cx="60" cy="215" r="3" fill="#fff" />

                  {/* Blade Core */}
                  <path d="M 49,225 L 150,50 L 152,52 L 51,227 Z" fill="#06b6d4" opacity={0.9} filter="url(#glow-cyan)" />
                  {/* Metal Blade edges */}
                  <path d="M 50,224 L 148,54 L 151,49 L 153,51 L 53,229 Z" fill="url(#sword-blade)" />
                  
                  {/* Blade runes */}
                  <line x1="65" y1="198" x2="120" y2="102" stroke="#fff" strokeWidth="1.5" strokeDasharray="5 3 2 3" opacity={0.95} filter="url(#glow-light)" />
                </g>

                {/* Floating Geometric Runes */}
                <polygon points="380,180 390,195 380,210 370,195" fill="none" stroke="#06b6d4" strokeWidth="2" opacity={0.6} filter="url(#glow-light)" className="anim-pulse" />
                
                {/* Gold Star */}
                <path d="M 120,100 L 123,106 L 130,107 L 125,112 L 126,119 L 120,115 L 114,119 L 115,112 L 110,107 L 117,106 Z" fill="url(#gold-grad)" opacity={0.7} filter="url(#glow-light)">
                  <animateTransform attributeName="transform" type="scale" values="1; 1.15; 1" keyTimes="0; 0.5; 1" dur="4s" repeatCount="indefinite" />
                </path>
              </svg>

            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
