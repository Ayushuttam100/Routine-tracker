"use client";
import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export default function ConsistencyChart() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch('/api/analytics');
        const analytics = await res.json();
        if (Array.isArray(analytics)) {
          setData(analytics);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="w-full h-full min-h-[220px] p-6 bg-[#111]/80 rounded-3xl border border-zinc-800/60 animate-pulse shadow-xl flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#18181b] border border-[#3f3f46] rounded-xl p-3 shadow-2xl">
          <p className="text-zinc-400 text-xs font-semibold mb-1">{label}</p>
          <p className="text-emerald-400 font-bold text-sm">
            {payload[0].value} {payload[0].value === 1 ? 'problem' : 'problems'}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-full min-h-[220px] p-6 md:p-8 bg-[#111]/80 rounded-3xl border border-zinc-800/60 shadow-xl backdrop-blur-sm flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl md:text-2xl font-extrabold text-white tracking-tight">DSA Consistency</h2>
          <p className="text-xs text-zinc-400 font-medium mt-1 uppercase tracking-widest">Last 7 Days</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-[#0a0a0a] rounded-full border border-zinc-800">
          <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]"></div>
          <span className="text-xs font-bold text-zinc-300">
            {data.reduce((sum, item) => sum + item.count, 0)} Total
          </span>
        </div>
      </div>
      
      <div className="flex-1 w-full relative">
        <ResponsiveContainer width="100%" height="100%" minHeight={140}>
          <BarChart data={data} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
            <XAxis 
              dataKey="date" 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#71717a', fontSize: 11, fontWeight: 600 }}
              dy={10}
            />
            <YAxis 
              allowDecimals={false}
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#71717a', fontSize: 11 }}
            />
            <Tooltip 
              cursor={{ fill: '#ffffff05' }}
              content={<CustomTooltip />}
            />
            <Bar dataKey="count" radius={[4, 4, 0, 0]} maxBarSize={40} minPointSize={4}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.count > 0 ? '#10b981' : '#27272a'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
