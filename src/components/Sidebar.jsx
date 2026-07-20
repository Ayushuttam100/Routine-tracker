"use client";
import Link from 'next/link';

export default function Sidebar() {
  return (
    <aside className="w-64 bg-[#0a0a0a] border-r border-zinc-800/50 h-screen flex-col hidden md:flex shrink-0 relative z-20 shadow-2xl">
      <div className="p-6">
        <h2 className="text-xl font-bold tracking-tight text-zinc-100 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center border border-emerald-500/30">
            <div className="w-3 h-3 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.9)] animate-pulse" />
          </div>
          Dashboard
        </h2>
      </div>
      
      <div className="px-4 py-2">
        <div className="text-xs font-semibold text-zinc-500 tracking-wider uppercase mb-3 px-2">Menu</div>
        <nav className="space-y-1">
          <Link href="/" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-zinc-400 font-medium hover:bg-zinc-800/40 hover:text-zinc-200 transition-all group">
            <svg className="w-5 h-5 text-zinc-500 group-hover:text-emerald-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Daily Blueprint
          </Link>
          <Link href="/logger" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-zinc-400 font-medium hover:bg-zinc-800/40 hover:text-zinc-200 transition-all group">
            <svg className="w-5 h-5 text-zinc-500 group-hover:text-emerald-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            LeetCode Logger
          </Link>
        </nav>
      </div>
      
      <div className="mt-auto p-4 border-t border-zinc-800/50">
        <div className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-zinc-800/50 transition-colors cursor-pointer border border-transparent hover:border-zinc-700/50 group">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 p-0.5 shadow-lg">
            <div className="w-full h-full bg-[#111] rounded-full border border-black flex items-center justify-center text-emerald-400 font-bold">
              AU
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-zinc-200 group-hover:text-white transition-colors">Ayush Uttam</span>
            <span className="text-xs text-zinc-500">Premium User</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
