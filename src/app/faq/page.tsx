"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { Magnifier, CircleQuestion, ShieldCheck, Key, CreditCard, ChevronDown, Rocket, Envelope, Comment } from "@gravity-ui/icons";

interface FAQItem {
  id: string;
  category: "all" | "buying" | "publishing" | "vault" | "security";
  question: string;
  answer: string;
  highlight?: string;
}

const FAQ_DATA: FAQItem[] = [
  {
    id: "q1",
    category: "buying",
    question: "How are digital license keys delivered after checkout?",
    answer: "Every digital license key is delivered instantly to your account's Digital Vault upon order fulfillment. For direct vault titles, the key is provisioned in under 60 seconds. You also receive an encrypted email confirmation containing full activation instructions.",
    highlight: "Instant automated escrow delivery",
  },
  {
    id: "q2",
    category: "buying",
    question: "What happens if a delivered game activation key is invalid?",
    answer: "QuestForge operates with an escrow-backed guarantee. If an activation key fails or has already been redeemed, our automated verification system cross-references the publisher ledger. You can request an automated replacement or immediate refund within 48 hours directly from your Purchase History tab.",
    highlight: "48-Hour buyer protection policy",
  },
  {
    id: "q3",
    category: "publishing",
    question: "How do game developers and studios publish games on QuestForge?",
    answer: "Registered users with a Seller account can list titles directly via the Seller Command Center. Publishers define system requirements, pricing, cover media, platform tags, and license key inventories. All submissions undergo security verification before appearing on the public storefront.",
    highlight: "0% introductory platform fees",
  },
  {
    id: "q4",
    category: "publishing",
    question: "How and when do publishers receive payouts for sales?",
    answer: "Sales revenue is automatically tracked on your live Recharts Analytics board. Once a buyer receives and confirms their order, earnings are credited to your seller payout balance. Disbursements are processed on a weekly schedule with transparent ledger receipts.",
    highlight: "Real-time analytics & weekly payouts",
  },
  {
    id: "q5",
    category: "vault",
    question: "What is the QuestForge Perpetual Vault?",
    answer: "The Vault is your immutable digital game library. Unlike platforms that revoke access or bury license keys, QuestForge keeps your purchased activation credentials, download instructions, and seller notes accessible indefinitely across all devices.",
    highlight: "Perpetual lifetime cloud storage",
  },
  {
    id: "q6",
    category: "vault",
    question: "Can I gift game licenses or transfer keys to another player?",
    answer: "Yes! Every game delivered with an activation key can be copied and gifted to a friend before activation on the respective gaming platform (Steam, Epic Games, GOG, or standalone launcher).",
    highlight: "Universal platform compatibility",
  },
  {
    id: "q7",
    category: "security",
    question: "How does QuestForge prevent fraudulent keys and scams?",
    answer: "We mandate strict seller KYC verification, automated inventory ledger tracking, and escrow holding. Sellers do not receive payout funds until the buyer license key is successfully authenticated, eliminating gray-market duplicate key fraud.",
    highlight: "Escrow-held anti-fraud pipeline",
  },
  {
    id: "q8",
    category: "security",
    question: "Are my payment details and personal credentials safe?",
    answer: "QuestForge uses industry-standard 256-bit encryption and tokenized authentication via BetterAuth. We never store raw credit card credentials on our database servers.",
    highlight: "256-bit end-to-end tokenization",
  },
];

const CATEGORIES = [
  { id: "all", label: "All Topics" },
  { id: "buying", label: "Buying & Keys" },
  { id: "publishing", label: "Publishing & Payouts" },
  { id: "vault", label: "Perpetual Vault" },
  { id: "security", label: "Safety & Refunds" },
];

export default function FAQPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [openAccordion, setOpenAccordion] = useState<string | null>("q1");

  const toggleAccordion = (id: string) => {
    setOpenAccordion(prev => (prev === id ? null : id));
  };

  const filteredFAQs = useMemo(() => {
    return FAQ_DATA.filter((item) => {
      const matchesCategory = selectedCategory === "all" || item.category === selectedCategory;
      const matchesSearch =
        item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.highlight && item.highlight.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, selectedCategory]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300 pb-20 overflow-x-hidden">
      
      {/* ── Background Cyber Glow Blobs ── */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[2560px] h-[500px] pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-80px] right-1/4 w-[500px] 3xl:w-[700px] h-[500px] 3xl:h-[700px] rounded-full bg-cyan-500/15 dark:bg-cyan-500/20 blur-[130px] 3xl:blur-[180px]" />
        <div className="absolute top-[40px] left-1/4 w-[450px] 3xl:w-[650px] h-[450px] 3xl:h-[650px] rounded-full bg-violet-600/15 dark:bg-violet-600/20 blur-[130px] 3xl:blur-[180px]" />
      </div>

      <div className="relative z-10 qf-container pt-8 sm:pt-12 lg:pt-16 3xl:pt-24 flex flex-col gap-10 sm:gap-14 lg:gap-16 3xl:gap-24">

        {/* ── SECTION 1: HERO & LIVE SEARCH ── */}
        <section className="flex flex-col items-center text-center max-w-3xl 3xl:max-w-5xl mx-auto space-y-4 sm:space-y-6 w-full">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 dark:bg-cyan-500/20 border border-cyan-500/30 text-cyan-600 dark:text-cyan-400 text-xs sm:text-sm 3xl:text-base font-extrabold tracking-wide uppercase shadow-sm">
            <CircleQuestion className="w-4 h-4 animate-pulse" />
            <span>Help Center & Knowledge Base</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl 3xl:text-7xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.15]">
            Frequently Asked <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-cyan-500 via-violet-500 to-fuchsia-500 bg-clip-text text-transparent">
              Questions & Answers
            </span>
          </h1>

          <p className="text-sm sm:text-base 3xl:text-lg text-slate-600 dark:text-slate-400 font-medium max-w-xl 3xl:max-w-3xl">
            Everything you need to know about key delivery, developer publishing, escrow security, and vault ownership.
          </p>

          {/* Interactive Search Input */}
          <div className="relative w-full max-w-xl 3xl:max-w-2xl pt-2">
            <div className="relative flex items-center">
              <Magnifier className="absolute left-4 w-5 h-5 text-slate-400 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search questions (e.g. key delivery, refund, seller payout)..."
                className="w-full pl-12 pr-4 py-3.5 3xl:py-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md focus:border-cyan-500 dark:focus:border-cyan-400 focus:ring-4 focus:ring-cyan-500/10 text-slate-900 dark:text-white text-sm 3xl:text-base outline-none transition"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-4 text-xs font-bold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </section>

        {/* ── SECTION 2: CATEGORY FILTER PILLS ── */}
        <section className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl font-extrabold text-xs sm:text-sm 3xl:text-base transition cursor-pointer ${
                selectedCategory === cat.id
                  ? "bg-cyan-600 text-white shadow-md shadow-cyan-600/30 scale-105"
                  : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:text-slate-900 dark:hover:text-white hover:border-slate-300 dark:hover:border-slate-700"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </section>

        {/* ── SECTION 3: ACCORDION LIST ── */}
        <section className="max-w-4xl 3xl:max-w-6xl mx-auto w-full space-y-3.5">
          {filteredFAQs.length === 0 ? (
            <div className="p-12 text-center rounded-3xl bg-white dark:bg-slate-900 border border-dashed border-slate-200 dark:border-slate-800 space-y-3">
              <CircleQuestion className="w-10 h-10 text-slate-400 mx-auto" />
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                No matching questions found
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
                Try searching with different keywords, or reach out directly to our community support channel.
              </p>
              <button
                onClick={() => { setSearchQuery(""); setSelectedCategory("all"); }}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 font-bold text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
              >
                Reset Search Filters
              </button>
            </div>
          ) : (
            filteredFAQs.map((item) => {
              const isOpen = openAccordion === item.id;
              return (
                <div
                  key={item.id}
                  className={`rounded-2xl transition-all duration-200 border overflow-hidden ${
                    isOpen
                      ? "bg-white dark:bg-slate-900 border-cyan-500/40 dark:border-cyan-500/40 shadow-lg shadow-cyan-500/5"
                      : "bg-white/80 dark:bg-slate-900/80 border-slate-200/80 dark:border-slate-800/80 hover:border-slate-300 dark:hover:border-slate-700 shadow-sm"
                  }`}
                >
                  <button
                    onClick={() => toggleAccordion(item.id)}
                    className="w-full p-5 sm:p-6 3xl:p-7 flex items-center justify-between gap-4 text-left cursor-pointer"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`w-2 h-2 rounded-full shrink-0 ${isOpen ? "bg-cyan-500 animate-ping" : "bg-slate-300 dark:bg-slate-700"}`} />
                      <h3 className="text-sm sm:text-base 3xl:text-xl font-bold text-slate-900 dark:text-white">
                        {item.question}
                      </h3>
                    </div>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-transform duration-200 ${isOpen ? "rotate-180 bg-cyan-500/10 text-cyan-600 dark:text-cyan-400" : "bg-slate-100 dark:bg-slate-800 text-slate-400"}`}>
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </button>

                  {isOpen && (
                    <div className="px-5 sm:px-6 3xl:px-7 pb-6 pt-1 space-y-3 border-t border-slate-100 dark:border-slate-800/60 text-slate-600 dark:text-slate-300 text-xs sm:text-sm 3xl:text-base leading-relaxed">
                      <p>{item.answer}</p>
                      {item.highlight && (
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 font-bold text-[11px] 3xl:text-xs">
                          <ShieldCheck className="w-3.5 h-3.5" />
                          <span>{item.highlight}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </section>

        {/* ── SECTION 4: QUICK HELP CARDS ── */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 3xl:gap-8 max-w-5xl 3xl:max-w-7xl mx-auto w-full">
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-violet-500/10 text-violet-600 dark:text-violet-400 flex items-center justify-center">
                <Key className="w-5 h-5" />
              </div>
              <h4 className="text-base 3xl:text-lg font-bold text-slate-900 dark:text-white">
                Player Vault Guide
              </h4>
              <p className="text-xs 3xl:text-sm text-slate-500 leading-relaxed">
                Learn how to locate, copy, and activate keys on Steam, Epic Games, and GOG.
              </p>
            </div>
            <Link href="/my-bucket" className="text-xs font-black text-violet-600 dark:text-violet-400 hover:underline">
              Visit My Gaming Bucket →
            </Link>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center">
                <Rocket className="w-5 h-5" />
              </div>
              <h4 className="text-base 3xl:text-lg font-bold text-slate-900 dark:text-white">
                Seller Command Center
              </h4>
              <p className="text-xs 3xl:text-sm text-slate-500 leading-relaxed">
                Step-by-step instructions on listing your first game title and viewing dynamic revenue metrics.
              </p>
            </div>
            <Link href="/dashboard" className="text-xs font-black text-cyan-600 dark:text-cyan-400 hover:underline">
              Access Seller Dashboard →
            </Link>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h4 className="text-base 3xl:text-lg font-bold text-slate-900 dark:text-white">
                Purchase Guarantee
              </h4>
              <p className="text-xs 3xl:text-sm text-slate-500 leading-relaxed">
                Read about our 48-hour key replacement policy and escrow protection protocol.
              </p>
            </div>
            <Link href="/about" className="text-xs font-black text-emerald-600 dark:text-emerald-400 hover:underline">
              Learn About Security →
            </Link>
          </div>
        </section>

        {/* ── SECTION 5: CONTACT SUPPORT BANNER ── */}
        <section className="p-8 sm:p-10 3xl:p-14 rounded-3xl bg-slate-900 text-white border border-slate-800 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6 max-w-4xl 3xl:max-w-6xl mx-auto w-full">
          <div className="space-y-2 text-center sm:text-left">
            <h3 className="text-xl sm:text-2xl 3xl:text-3xl font-black">
              Still have questions or need assistance?
            </h3>
            <p className="text-xs sm:text-sm 3xl:text-base text-slate-400 font-medium">
              Our community team is available 24/7 to resolve order discrepancies or assist publisher onboarding.
            </p>
          </div>
          <a
            href="mailto:support@questforge.io"
            className="px-6 py-3 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs sm:text-sm 3xl:text-base shadow-lg shadow-cyan-500/20 shrink-0 transition"
          >
            Email Support Team
          </a>
        </section>

      </div>
    </div>
  );
}
