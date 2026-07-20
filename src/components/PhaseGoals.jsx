"use client";
import { useState, useEffect } from 'react';

export default function PhaseGoals() {
  const [deadlines, setDeadlines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});

  const fetchDeadlines = async () => {
    try {
      const res = await fetch('/api/deadlines');
      const data = await res.json();
      if (Array.isArray(data)) setDeadlines(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeadlines();
  }, []);

  const handleEditClick = (phase) => {
    setEditForm({
      phaseName: phase.phaseName,
      targetDate: new Date(phase.targetDate).toISOString().split('T')[0],
      totalMilestones: phase.totalMilestones
    });
    setEditingId(phase._id);
  };

  const handleSaveEdit = async (id) => {
    const newDeadlines = deadlines.map(p => 
      p._id === id ? { ...p, phaseName: editForm.phaseName, targetDate: editForm.targetDate, totalMilestones: editForm.totalMilestones } : p
    );
    
    setDeadlines(newDeadlines);
    setEditingId(null);
    
    try {
      await fetch('/api/deadlines', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newDeadlines)
      });
    } catch (e) {
      fetchDeadlines();
    }
  };

  if (loading) {
    return <div className="w-full h-full bg-[#111]/80 rounded-3xl border border-zinc-800/60 p-6 animate-pulse shadow-xl"></div>;
  }

  const today = new Date();

  return (
    <div className="w-full h-full bg-[#111]/80 rounded-3xl border border-zinc-800/60 p-6 flex flex-col shadow-xl backdrop-blur-sm">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-extrabold text-white tracking-tight">Phase Goals</h2>
      </div>

      <div className="space-y-4 flex-1 overflow-y-auto custom-scrollbar pr-1">
        {deadlines.map((phase) => {
          const targetDate = new Date(phase.targetDate);
          const diffTime = targetDate.getTime() - today.getTime();
          const daysRemaining = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
          const isUrgent = daysRemaining > 0 && daysRemaining < 14;
          const isPast = diffTime < 0;

          return (
            <div key={phase._id} className={`group relative p-4 rounded-2xl border transition-all ${
              isUrgent ? 'bg-red-950/10 border-red-500/20' : 'bg-[#0a0a0a] border-zinc-800/50 hover:border-zinc-700'
            }`}>
              
              <div className="flex justify-between items-start gap-3">
                {editingId === phase._id ? (
                  <div className="flex-1 space-y-3">
                    <input 
                      type="text" 
                      value={editForm.phaseName}
                      onChange={(e) => setEditForm({...editForm, phaseName: e.target.value})}
                      className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-1.5 text-sm text-white outline-none focus:border-emerald-500"
                      placeholder="Phase Name"
                    />
                    <div className="flex gap-2">
                      <input 
                        type="date" 
                        value={editForm.targetDate}
                        onChange={(e) => setEditForm({...editForm, targetDate: e.target.value})}
                        className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-1.5 text-sm text-white outline-none focus:border-emerald-500 [color-scheme:dark]"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="flex-1 overflow-hidden">
                    <h3 className="font-bold text-zinc-200 text-sm truncate">{phase.phaseName}</h3>
                    <div className="text-xs text-zinc-500 mt-1">
                      Target: {targetDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </div>
                  </div>
                )}

                <div className="flex flex-col items-end gap-2 shrink-0 h-full justify-between">
                  {editingId !== phase._id && (
                    <div className={`text-2xl font-black tabular-nums leading-none ${isUrgent ? 'text-red-400' : isPast ? 'text-zinc-600' : 'text-emerald-400'}`}>
                      {daysRemaining}
                      <span className="text-[10px] uppercase font-bold ml-1 opacity-50 tracking-wider">Days</span>
                    </div>
                  )}

                  <div className={`flex items-center gap-1 transition-opacity ${editingId === phase._id ? 'opacity-100 mt-2' : 'opacity-0 group-hover:opacity-100'}`}>
                    {editingId === phase._id ? (
                      <button onClick={() => handleSaveEdit(phase._id)} className="p-1.5 text-emerald-400 hover:bg-emerald-500/20 rounded-lg">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                      </button>
                    ) : (
                      <button onClick={() => handleEditClick(phase)} className="p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
