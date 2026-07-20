"use client";
import { useState, useEffect } from 'react';

function timeToMinutes(timeStr) {
  const [hours, minutes] = timeStr.split(':').map(Number);
  return hours * 60 + minutes;
}

function isCurrentBlock(start, end, currentTime) {
  const currentMinutes = currentTime.getHours() * 60 + currentTime.getMinutes();
  const startMinutes = timeToMinutes(start);
  const endMinutes = timeToMinutes(end);
  return currentMinutes >= startMinutes && currentMinutes < endMinutes;
}

export default function DailyBlueprint() {
  const [currentTime, setCurrentTime] = useState(null);
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [newTask, setNewTask] = useState({ startTime: '', endTime: '', activityTitle: '', focusArea: '' });

  const fetchSchedule = async () => {
    try {
      const res = await fetch('/api/schedule');
      const data = await res.json();
      if (Array.isArray(data)) setSchedule(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchedule();
    setCurrentTime(new Date());
    const interval = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (timeStr) => {
    let [hours, minutes] = timeStr.split(':').map(Number);
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12; 
    return `${hours}:${minutes.toString().padStart(2, '0')} ${ampm}`;
  };

  const handleEditClick = (block) => {
    setEditForm({
      startTime: block.startTime,
      endTime: block.endTime,
      activityTitle: block.activityTitle,
      focusArea: block.focusArea
    });
    setEditingId(block._id);
  };

  const handleSaveEdit = async (id) => {
    const newSchedule = schedule.map(b => b._id === id ? { ...b, ...editForm } : b);
    setSchedule(newSchedule);
    setEditingId(null);
    try {
      await fetch('/api/schedule', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ _id: id, ...editForm })
      });
      fetchSchedule(); // re-sort based on time
    } catch (e) {
      fetchSchedule();
    }
  };

  const handleDelete = async (id) => {
    setSchedule(schedule.filter(b => b._id !== id));
    try {
      await fetch(`/api/schedule?id=${id}`, { method: 'DELETE' });
    } catch (e) {
      fetchSchedule();
    }
  };

  const handleAddBlock = async (e) => {
    e.preventDefault();
    if (!newTask.startTime || !newTask.endTime || !newTask.activityTitle) return;
    try {
      await fetch('/api/schedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTask)
      });
      setNewTask({ startTime: '', endTime: '', activityTitle: '', focusArea: '' });
      fetchSchedule();
    } catch (e) {
      console.error(e);
    }
  };

  if (loading || !currentTime) {
    return <div className="w-full h-full flex flex-col bg-[#111]/80 rounded-3xl border border-zinc-800/60 p-6 shadow-xl animate-pulse"></div>;
  }

  return (
    <div className="w-full h-full flex flex-col bg-[#111]/80 rounded-3xl border border-zinc-800/60 p-6 shadow-xl backdrop-blur-sm">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-extrabold text-white tracking-tight">Daily Blueprint</h2>
          <p className="text-xs text-zinc-400 mt-1">Execute with relentless focus.</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-4 custom-scrollbar pr-1">
        {schedule.length === 0 ? (
          <p className="text-zinc-500 text-sm text-center py-4">No schedule blocks found. Add one below!</p>
        ) : (
          <div className="space-y-4 relative before:absolute before:inset-0 before:ml-3 before:-translate-x-px before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-zinc-800 before:to-transparent">
            {schedule.map((block) => {
              const active = isCurrentBlock(block.startTime, block.endTime, currentTime);
              return (
                <div 
                  key={block._id}
                  className={`group relative z-10 overflow-hidden rounded-2xl p-4 transition-all duration-300 border ${
                    active 
                      ? 'bg-emerald-950/20 border-emerald-500/40 shadow-[0_4px_20px_rgb(16,185,129,0.1)]' 
                      : 'bg-[#0a0a0a] border-zinc-800/50 hover:border-zinc-700'
                  }`}
                >
                  <div className="flex flex-col gap-3">
                    {editingId === block._id ? (
                      <div className="space-y-3 relative z-20">
                        <div className="flex gap-2">
                          <input type="time" value={editForm.startTime} onChange={e => setEditForm({...editForm, startTime: e.target.value})} className="bg-zinc-900 border border-zinc-700 rounded-lg px-2 py-1 text-sm text-white flex-1 [color-scheme:dark]" />
                          <input type="time" value={editForm.endTime} onChange={e => setEditForm({...editForm, endTime: e.target.value})} className="bg-zinc-900 border border-zinc-700 rounded-lg px-2 py-1 text-sm text-white flex-1 [color-scheme:dark]" />
                        </div>
                        <input type="text" value={editForm.activityTitle} onChange={e => setEditForm({...editForm, activityTitle: e.target.value})} className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-2 py-1 text-sm text-white" placeholder="Title" />
                        <textarea value={editForm.focusArea} onChange={e => setEditForm({...editForm, focusArea: e.target.value})} className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-2 py-1 text-sm text-white resize-none" rows="2" placeholder="Focus Area" />
                      </div>
                    ) : (
                      <>
                        <div className="flex justify-between items-start">
                          <div className={`text-xs font-bold tracking-widest uppercase ${active ? 'text-emerald-400' : 'text-zinc-500'}`}>
                            {formatTime(block.startTime)} - {formatTime(block.endTime)}
                          </div>
                          {active && <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>}
                        </div>
                        <div>
                          <h3 className={`text-base font-bold tracking-tight mb-1 ${active ? 'text-emerald-50' : 'text-zinc-200'}`}>
                            {block.activityTitle}
                          </h3>
                          <p className={`text-xs leading-relaxed line-clamp-2 ${active ? 'text-emerald-200/70' : 'text-zinc-400'}`}>
                            {block.focusArea}
                          </p>
                        </div>
                      </>
                    )}

                    <div className={`flex items-center justify-end gap-1 transition-opacity ${editingId === block._id ? 'opacity-100 mt-2' : 'opacity-0 group-hover:opacity-100'}`}>
                      {editingId === block._id ? (
                        <button onClick={() => handleSaveEdit(block._id)} className="p-1.5 text-emerald-400 hover:bg-emerald-500/20 rounded-lg z-20">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                        </button>
                      ) : (
                        <button onClick={() => handleEditClick(block)} className="p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg z-20">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                        </button>
                      )}
                      <button onClick={() => handleDelete(block._id)} className="p-1.5 text-zinc-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg z-20">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                    </div>
                  </div>
                  
                  {active && (
                    <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-emerald-400 to-teal-500 rounded-l-2xl shadow-[0_0_10px_rgba(52,211,153,0.5)]" />
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      <form onSubmit={handleAddBlock} className="mt-4 pt-4 border-t border-zinc-800/60 shrink-0 space-y-2">
        <div className="flex gap-2">
          <input type="time" required value={newTask.startTime} onChange={e => setNewTask({...newTask, startTime: e.target.value})} className="bg-[#050505] border border-zinc-800/80 rounded-xl px-2 py-2 text-xs text-white flex-1 [color-scheme:dark]" />
          <input type="time" required value={newTask.endTime} onChange={e => setNewTask({...newTask, endTime: e.target.value})} className="bg-[#050505] border border-zinc-800/80 rounded-xl px-2 py-2 text-xs text-white flex-1 [color-scheme:dark]" />
        </div>
        <div className="flex gap-2">
          <input type="text" required placeholder="New Block Title..." value={newTask.activityTitle} onChange={e => setNewTask({...newTask, activityTitle: e.target.value})} className="flex-1 bg-[#050505] border border-zinc-800/80 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500/50" />
          <button type="submit" className="px-3 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 rounded-xl transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
          </button>
        </div>
      </form>
    </div>
  );
}
