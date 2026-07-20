"use client";
import { useState, useEffect } from 'react';
import HabitHeatmap from './HabitHeatmap';

export default function DailyChecklist() {
  const [checklist, setChecklist] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const res = await fetch('/api/checklist');
      const data = await res.json();
      setChecklist(data.today);
      setHistory(data.history);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleItemClick = async (itemIndex) => {
    if (!checklist) return;
    
    // Cycle logic: red -> orange -> green -> red
    const currentStatus = checklist.items[itemIndex].status;
    let nextStatus = 'red';
    if (currentStatus === 'red') nextStatus = 'orange';
    else if (currentStatus === 'orange') nextStatus = 'green';
    
    // Optimistic UI update
    const newItems = [...checklist.items];
    newItems[itemIndex].status = nextStatus;
    const newChecklist = { ...checklist, items: newItems };
    setChecklist(newChecklist);
    
    // Also update history optimistically so heatmap updates instantly
    const newHistory = history.map(h => h.date === newChecklist.date ? newChecklist : h);
    setHistory(newHistory);
    
    // Save to DB
    try {
      await fetch('/api/checklist', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date: newChecklist.date,
          items: newItems
        })
      });
    } catch (e) {
      console.error('Failed to save checklist state');
      fetchData(); // revert on failure
    }
  };

  if (loading) {
    return <div className="w-full bg-[#111]/80 rounded-3xl border border-zinc-800/60 p-6 animate-pulse shadow-xl h-[400px]"></div>;
  }

  const getStatusColor = (status) => {
    if (status === 'green') return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/30';
    if (status === 'orange') return 'text-amber-500 bg-amber-500/10 border-amber-500/30';
    return 'text-rose-500 bg-rose-500/10 border-rose-500/30';
  };

  return (
    <div className="w-full bg-[#111]/80 rounded-3xl border border-zinc-800/60 p-6 flex flex-col shadow-xl backdrop-blur-sm gap-8">
      
      {/* Checklist Section */}
      <div>
        <h2 className="text-xl font-extrabold text-white tracking-tight mb-6 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center border border-emerald-500/30">
            <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          Habits & Heatmaps
        </h2>
        
        <div className="flex flex-col gap-3">
          {checklist?.items.map((item, idx) => (
            <button 
              key={idx}
              onClick={() => handleItemClick(idx)}
              className={`flex items-center justify-between p-4 rounded-2xl border transition-all hover:scale-[1.01] active:scale-[0.98] ${getStatusColor(item.status)}`}
            >
              <span className="font-bold text-sm tracking-wide">{item.taskName}</span>
              
              <div className="flex gap-1.5 items-center bg-black/40 px-3 py-1.5 rounded-full border border-white/5">
                <div className={`w-3 h-3 rounded-full transition-colors duration-300 ${item.status === 'red' ? 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.8)] scale-110' : 'bg-zinc-800/50'}`} />
                <div className={`w-3 h-3 rounded-full transition-colors duration-300 ${item.status === 'orange' ? 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.8)] scale-110' : 'bg-zinc-800/50'}`} />
                <div className={`w-3 h-3 rounded-full transition-colors duration-300 ${item.status === 'green' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)] scale-110' : 'bg-zinc-800/50'}`} />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Heatmap Section */}
      <div className="border-t border-zinc-800/50 pt-6">
        <h3 className="text-xs font-black text-zinc-400 tracking-widest uppercase mb-4 pl-1">30-Day Activity Graph</h3>
        <HabitHeatmap history={history} defaultHabits={checklist?.items.map(i => i.taskName) || []} />
      </div>

    </div>
  );
}
