"use client";

import React, { useState } from "react";
import Link from "next/link";

interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export default function HomeFaqSection() {
  const [openId, setOpenId] = useState<string | null>("faq-1");

  const faqs: FaqItem[] = [
    {
      id: "faq-1",
      question: "What is QuestForge and how does it differ from traditional stores?",
      answer:
        "QuestForge is a decentralized digital gaming registry and catalog management ecosystem. Unlike conventional stores that require bulky background desktop launchers, QuestForge gives you pure web-native access to discover games, claim authentic keys, organize cross-platform backlogs, and download packages directly without bloatware.",
      category: "Platform",
    },
    {
      id: "faq-2",
      question: "How do digital keys and game downloads work?",
      answer:
        "When you acquire a quest on QuestForge, your license key is cryptographically assigned and stored permanently in your personal Vault. You can access your keys anytime, download installer zip archives, and monitor your installation and completion status directly from your dashboard.",
      category: "Ownership",
    },
    {
      id: "faq-3",
      question: "Can anyone become a creator or publish a game on QuestForge?",
      answer:
        "Yes! Any registered user can submit a role change request from their profile settings to become a verified Seller/Creator. Once approved by our administrator guild, you can upload games, set custom prices, distribute license keys, and track real-time revenue analytics.",
      category: "Creators",
    },
    {
      id: "faq-4",
      question: "Why are QuestForge community reviews considered more trustworthy?",
      answer:
        "Our review system enforces strict verified-owner verification. Only gamers who genuinely own the specific game title in their personal QuestForge library can submit a star rating and written review, completely eliminating bots and review-bombing brigades.",
      category: "Community",
    },
    {
      id: "faq-5",
      question: "Which platforms and hardware are supported?",
      answer:
        "QuestForge supports digital titles across PC (Windows, macOS, Linux), PlayStation 5, Xbox Series X/S, and Nintendo Switch. You can filter the marketplace catalog by your preferred platform at any time.",
      category: "Compatibility",
    },
  ];

  const toggleFaq = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section className="qf-container py-10 sm:py-16 transition-colors duration-300">
      
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-violet-500/30 bg-violet-500/10 mb-3">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
          <span className="text-[10px] font-extrabold tracking-wider text-violet-700 dark:text-violet-300 uppercase">
            Platform Knowledge
          </span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-violet-600 to-cyan-500 bg-clip-text text-transparent dark:from-violet-400 dark:to-cyan-400">
          Frequently Asked Questions
        </h2>
        <p className="mt-2 text-xs sm:text-base text-slate-600 dark:text-slate-400 max-w-xl mx-auto leading-relaxed">
          Everything you need to know about key delivery, digital library ownership, and the creator guild.
        </p>
      </div>

      {/* Accordion List matching Picture 1 */}
      <div className="max-w-3xl mx-auto space-y-3">
        {faqs.map((faq) => {
          const isOpen = openId === faq.id;

          return (
            <div
              key={faq.id}
              className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                isOpen
                  ? "bg-white dark:bg-slate-900/60 border-violet-500/50 shadow-md shadow-violet-500/5"
                  : "bg-white dark:bg-slate-900/40 border-slate-200/60 dark:border-slate-800/50 hover:border-slate-300 dark:hover:border-slate-700"
              }`}
            >
              <button
                onClick={() => toggleFaq(faq.id)}
                className="w-full px-5 sm:px-6 py-4 flex items-center justify-between gap-4 text-left cursor-pointer"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="px-2 py-0.5 rounded text-[9px] font-extrabold uppercase tracking-wider bg-violet-500/10 text-violet-600 dark:text-violet-400 shrink-0">
                    {faq.category}
                  </span>
                  <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                    {faq.question}
                  </span>
                </div>

                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-transform duration-300 ${
                    isOpen
                      ? "bg-violet-600 text-white rotate-180"
                      : "bg-violet-500/10 text-violet-600 dark:text-violet-400"
                  }`}
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </button>

              {isOpen && (
                <div className="px-5 sm:px-6 pb-5 pt-1 text-xs text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-800/40">
                  {faq.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer Link to Dedicated FAQ Page */}
      <div className="mt-8 text-center">
        <Link
          href="/faq"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-violet-600 dark:text-violet-400 hover:underline"
        >
          <span>Have more questions? Visit our full Help & FAQ Center</span>
          <span>→</span>
        </Link>
      </div>

    </section>
  );
}
