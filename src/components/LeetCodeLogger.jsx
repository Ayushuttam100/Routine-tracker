"use client";

import { useState, useEffect } from 'react';

export default function LeetCodeLogger() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState(null);
  
  // Sync States
  const [username, setUsername] = useState('');
  const [syncing, setSyncing] = useState(false);
  const [showSyncInput, setShowSyncInput] = useState(false);

  const [formData, setFormData] = useState({
    problemId: '',
    title: '',
    difficulty: 'Easy',
    optimalApproach: ''
  });

  const fetchLogs = async () => {
    try {
      const res = await fetch('/api/leetcode');
      const data = await res.json();
      if (Array.isArray(data)) {
        setLogs(data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
    const savedUsername = localStorage.getItem('leetcode_username');
    if (savedUsername) {
      setUsername(savedUsername);
    }
  }, []);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const handleSync = async (e) => {
    if (e) e.preventDefault();
    if (!username.trim()) {
      setShowSyncInput(true);
      return;
    }
    
    // Save to local storage
    localStorage.setItem('leetcode_username', username.trim());
    setSyncing(true);
    setShowSyncInput(false);

    try {
      const res = await fetch('/api/leetcode/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username.trim() })
      });
      
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error || 'Failed to sync');
      
      if (data.newCount > 0) {
        showToast(`Successfully imported ${data.newCount} new problems!`);
        fetchLogs();
      } else {
        showToast('You are already up to date!', 'success');
      }
      
    } catch (error) {
      showToast(error.message, 'error');
    } finally {
      setSyncing(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch('/api/leetcode', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (!res.ok) throw new Error('Failed to submit');
      
      const newLog = await res.json();
      setLogs([newLog, ...logs].slice(0, 5));
      setFormData({ problemId: '', title: '', difficulty: 'Easy', optimalApproach: '' });
      showToast('Problem logged successfully!');
    } catch (error) {
      showToast('Error logging problem. Please try again.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-12 py-8">
      {/* Toast Notification */}
      {toast && (
        <div className={`fixed bottom-6 right-6 px-6 py-3 rounded-lg shadow-2xl border transition-all animate-in slide-in-from-bottom-5 ${
          toast.type === 'success' 
            ? 'bg-emerald-950/90 border-emerald-500/50 text-emerald-400' 
            : 'bg-red-950/90 border-red-500/50 text-red-400'
        } z-50 flex items-center gap-3 backdrop-blur-md`}>
          {toast.type === 'success' ? (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
          ) : (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          )}
          <span className="font-medium">{toast.message}</span>
        </div>
      )}

      {/* Header and Sync */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-3">
            LeetCode <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-500">Logger</span>
          </h1>
          <p className="text-zinc-400 text-lg max-w-2xl">
            Document your DSA journey. Log problems, track patterns, and store optimal approaches.
          </p>
        </div>
        
        <div className="shrink-0 flex items-center gap-3 relative">
          {showSyncInput && (
            <form onSubmit={handleSync} className="absolute right-0 top-full mt-2 w-64 bg-[#111] border border-zinc-700/80 rounded-xl p-3 shadow-2xl z-20 animate-in fade-in slide-in-from-top-2">
              <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2 block">LeetCode Username</label>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  autoFocus
                  required
                  placeholder="e.g. ayush_uttam" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-[#050505] border border-zinc-700/50 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-emerald-500/50"
                />
                <button type="submit" className="bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 px-3 py-1.5 rounded-lg text-sm font-bold transition-colors">
                  Save
                </button>
              </div>
            </form>
          )}
          <button 
            onClick={() => username ? handleSync() : setShowSyncInput(!showSyncInput)}
            disabled={syncing}
            className="flex items-center gap-2 bg-[#111] hover:bg-zinc-800 text-zinc-300 hover:text-white px-5 py-2.5 rounded-xl border border-zinc-700/60 transition-all shadow-sm font-medium disabled:opacity-50"
          >
            {syncing ? (
              <div className="w-4 h-4 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
            ) : (
              <svg className="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            )}
            {syncing ? 'Syncing...' : 'Sync LeetCode'}
          </button>
        </div>
      </div>

      {/* Form */}
      <div className="bg-[#111]/80 border border-zinc-800/60 rounded-2xl p-6 md:p-8 backdrop-blur-sm shadow-xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-zinc-300">Problem ID</label>
              <input 
                type="text" 
                required
                placeholder="e.g. 1"
                className="w-full bg-[#0a0a0a] border border-zinc-700/50 rounded-xl px-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all"
                value={formData.problemId}
                onChange={(e) => setFormData({...formData, problemId: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-zinc-300">Title</label>
              <input 
                type="text" 
                required
                placeholder="e.g. Two Sum"
                className="w-full bg-[#0a0a0a] border border-zinc-700/50 rounded-xl px-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-semibold text-zinc-300">Difficulty</label>
            <div className="relative">
              <select 
                className="w-full bg-[#0a0a0a] border border-zinc-700/50 rounded-xl px-4 py-3 text-white appearance-none focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all"
                value={formData.difficulty}
                onChange={(e) => setFormData({...formData, difficulty: e.target.value})}
              >
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
              <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-zinc-400">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-zinc-300">Optimal Approach / Notes</label>
            <textarea 
              required
              rows={4}
              placeholder="Explain the time/space complexity and intuition..."
              className="w-full bg-[#0a0a0a] border border-zinc-700/50 rounded-xl px-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all resize-none"
              value={formData.optimalApproach}
              onChange={(e) => setFormData({...formData, optimalApproach: e.target.value})}
            />
          </div>

          <button 
            type="submit" 
            disabled={submitting}
            className="w-full bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-bold text-lg py-3 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_25px_rgba(16,185,129,0.5)] flex items-center justify-center gap-2"
          >
            {submitting ? (
              <>
                <div className="w-5 h-5 border-2 border-emerald-950 border-t-transparent rounded-full animate-spin" />
                Saving...
              </>
            ) : (
              'Log Problem'
            )}
          </button>
        </form>
      </div>

      {/* Recent Submissions Table */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold tracking-tight text-zinc-100 flex items-center gap-3">
          <svg className="w-6 h-6 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          Recent Submissions
        </h2>
        
        {loading ? (
          <div className="animate-pulse space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-16 bg-zinc-800/50 rounded-xl w-full" />
            ))}
          </div>
        ) : logs.length === 0 ? (
          <div className="bg-[#111]/50 border border-zinc-800/50 rounded-xl p-8 text-center text-zinc-500 border-dashed">
            No problems logged yet. Start logging above!
          </div>
        ) : (
          <div className="bg-[#111]/80 border border-zinc-800/60 rounded-2xl overflow-hidden backdrop-blur-sm shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-zinc-900/50 border-b border-zinc-800/60 text-zinc-400 text-sm tracking-wider uppercase">
                    <th className="px-6 py-4 font-semibold">Problem</th>
                    <th className="px-6 py-4 font-semibold">Difficulty</th>
                    <th className="px-6 py-4 font-semibold hidden md:table-cell">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/50">
                  {logs.map((log) => (
                    <tr key={log._id} className="hover:bg-zinc-800/30 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <span className="text-emerald-500/50 font-mono text-sm group-hover:text-emerald-400 transition-colors">#{log.problemId}</span>
                          <span className="font-medium text-zinc-200 group-hover:text-white transition-colors">{log.title}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${
                          log.difficulty === 'Easy' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                          log.difficulty === 'Medium' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                          'bg-red-500/10 text-red-400 border-red-500/20'
                        }`}>
                          {log.difficulty}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-zinc-500 text-sm hidden md:table-cell">
                        {new Date(log.dateSolved).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
