"use client";
import { useState, useEffect } from 'react';

export default function YouTubeAnalytics() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLogs() {
      try {
        const res = await fetch('/api/youtube');
        const data = await res.json();
        if (Array.isArray(data)) setLogs(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    fetchLogs();
  }, []);

  if (loading) {
    return <div className="w-full h-[500px] bg-[#111]/80 rounded-3xl border border-zinc-800/60 p-6 animate-pulse shadow-xl"></div>;
  }

  // Group by category
  const grouped = logs.reduce((acc, log) => {
    if (!acc[log.category]) acc[log.category] = [];
    acc[log.category].push(log);
    return acc;
  }, {});

  const todayStr = new Date().toLocaleDateString('en-CA'); // YYYY-MM-DD local

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out py-6 flex flex-col gap-6">
      
      <div className="flex items-center gap-4 mb-2">
        <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center border border-red-500/30 shadow-[0_0_15px_rgba(239,68,68,0.2)]">
          <svg className="w-6 h-6 text-red-500" fill="currentColor" viewBox="0 0 24 24">
            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
          </svg>
        </div>
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight">YouTube Analytics</h1>
          <p className="text-sm text-zinc-400 font-medium tracking-wide">Automated learning tracker and categorizer</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-20 lg:pb-0">
        {Object.entries(grouped).map(([category, categoryLogs]) => {
          
          // Calculate today's time
          const todayTime = categoryLogs.filter(log => {
            const date = new Date(log.watchedAt);
            const offset = date.getTimezoneOffset();
            date.setMinutes(date.getMinutes() - offset);
            return date.toISOString().split('T')[0] === todayStr;
          }).reduce((sum, log) => sum + log.durationWatched, 0);

          const totalTime = categoryLogs.reduce((sum, log) => sum + log.durationWatched, 0);

          return (
            <div key={category} className="bg-[#111]/80 rounded-3xl border border-zinc-800/60 p-6 flex flex-col shadow-xl backdrop-blur-sm h-[450px]">
              <div className="flex justify-between items-start mb-6 pb-4 border-b border-zinc-800/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-zinc-800 flex items-center justify-center border border-zinc-700">
                    <svg className="w-5 h-5 text-zinc-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-white tracking-wide">{category}</h2>
                    <div className="text-xs text-zinc-400 font-medium">
                      <span className="text-emerald-400 font-bold">{todayTime} mins</span> today
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-zinc-500 uppercase tracking-widest font-bold">Total Time</div>
                  <div className="text-xl font-black tabular-nums text-zinc-200">{totalTime} <span className="text-xs text-zinc-500">m</span></div>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-3">
                {categoryLogs.map(log => (
                  <div key={log._id} className="p-3 bg-[#0a0a0a] rounded-xl border border-zinc-800/50 hover:border-zinc-700 transition-colors group">
                    <a href={log.url} target="_blank" rel="noopener noreferrer" className="block text-sm font-semibold text-zinc-200 leading-snug line-clamp-2 group-hover:text-emerald-400 transition-colors mb-2">
                      {log.videoTitle}
                    </a>
                    <div className="flex justify-between items-center text-[10px] uppercase font-bold tracking-wider text-zinc-500">
                      <span>{new Date(log.watchedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute:'2-digit' })}</span>
                      <span className="text-zinc-400">{log.durationWatched} mins</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
        {Object.keys(grouped).length === 0 && (
          <div className="col-span-full py-20 text-center text-zinc-500 font-medium border border-dashed border-zinc-700 rounded-3xl">
            No YouTube data logged yet.
          </div>
        )}
      </div>
    </div>
  );
}
