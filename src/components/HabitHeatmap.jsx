"use client";
import React from 'react';

export default function HabitHeatmap({ history, defaultHabits }) {
  // Generate last 30 days in YYYY-MM-DD
  const days = [];
  for (let i = 29; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    // adjust for local timezone to match our API generator
    const offset = d.getTimezoneOffset();
    d.setMinutes(d.getMinutes() - offset);
    days.push(d.toISOString().split('T')[0]);
  }

  // Helper to find status of a task on a given date
  const getStatus = (date, taskName) => {
    const record = history.find(h => h.date === date);
    if (!record) return null;
    const item = record.items.find(i => i.taskName === taskName);
    return item ? item.status : null;
  };

  const getBlockColor = (status) => {
    if (status === 'green') return 'bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.3)]';
    if (status === 'orange') return 'bg-amber-500 shadow-[0_0_6px_rgba(245,158,11,0.3)]';
    if (status === 'red') return 'bg-rose-500 shadow-[0_0_6px_rgba(244,63,94,0.3)]';
    return 'bg-zinc-800/40'; // No record / empty
  };

  return (
    <div className="space-y-5">
      {defaultHabits.map(taskName => (
        <div key={taskName} className="flex flex-col gap-2">
          <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">{taskName}</div>
          <div className="flex gap-1.5 overflow-x-auto pb-1">
            {days.map(date => {
              const status = getStatus(date, taskName);
              return (
                <div 
                  key={date}
                  title={`${date}: ${status || 'No data'}`}
                  className={`w-3.5 h-3.5 rounded-[3px] shrink-0 transition-colors ${getBlockColor(status)}`}
                />
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
