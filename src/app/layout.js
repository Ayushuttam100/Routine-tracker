import {ClerkProvider} from "@clerk/nextjs";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import Link from 'next/link';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Daily Blueprint",
  description: "Ayush's daily routine dashboard",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${geistSans.variable} ${geistMono.variable} antialiased dark`}>
      <body className="flex h-screen bg-[#050505] text-zinc-100 overflow-hidden font-sans selection:bg-emerald-500/30 selection:text-emerald-200">
        <ClerkProvider>
          <Sidebar />
          <main className="flex-1 overflow-y-auto bg-gradient-to-br from-[#0a0a0a] to-[#050505] relative shadow-inner pb-20 md:pb-0">
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] pointer-events-none mix-blend-overlay"></div>
          <div className="p-4 md:p-8 lg:p-12 max-w-6xl mx-auto min-h-full relative z-10">
          {children}
          </div>
          </main>

          {/* Mobile Navigation Bottom Bar */}
          <div className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-[#0a0a0a]/90 backdrop-blur-md border-t border-zinc-800/60 z-50 flex items-center justify-around px-4 pb-safe">
          <Link href="/" className="flex flex-col items-center gap-1 p-2 text-zinc-400 hover:text-emerald-400 transition-colors">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          <span className="text-[10px] font-bold uppercase tracking-wider">Blueprint</span>
          </Link>
          <Link href="/logger" className="flex flex-col items-center gap-1 p-2 text-zinc-400 hover:text-emerald-400 transition-colors">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <span className="text-[10px] font-bold uppercase tracking-wider">Logger</span>
          </Link>
          <Link href="/youtube" className="flex flex-col items-center gap-1 p-2 text-zinc-400 hover:text-emerald-400 transition-colors">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          <span className="text-[10px] font-bold uppercase tracking-wider">YT Stats</span>
          </Link>
          </div>
        </ClerkProvider>
      </body>
    </html>
  );
}