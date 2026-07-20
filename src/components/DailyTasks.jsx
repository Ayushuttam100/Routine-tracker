"use client";
import { useState, useEffect } from 'react';

export default function DailyTasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [newTaskTitle, setNewTaskTitle] = useState('');

  const fetchTasks = async () => {
    try {
      const res = await fetch('/api/tasks');
      const data = await res.json();
      if (Array.isArray(data)) setTasks(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleToggleComplete = async (task) => {
    setTasks(tasks.map(t => t._id === task._id ? { ...t, isCompleted: !t.isCompleted } : t));
    try {
      await fetch('/api/tasks', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ _id: task._id, isCompleted: !task.isCompleted })
      });
    } catch (e) {
      fetchTasks();
    }
  };

  const handleSaveEdit = async (id) => {
    if (!editValue.trim()) return;
    setTasks(tasks.map(t => t._id === id ? { ...t, title: editValue } : t));
    setEditingId(null);
    try {
      await fetch('/api/tasks', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ _id: id, title: editValue })
      });
    } catch (e) {
      fetchTasks();
    }
  };

  const handleDelete = async (id) => {
    setTasks(tasks.filter(t => t._id !== id));
    try {
      await fetch(`/api/tasks?id=${id}`, { method: 'DELETE' });
    } catch (e) {
      fetchTasks();
    }
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    const tempId = Date.now().toString();
    const newTask = { _id: tempId, title: newTaskTitle, isCompleted: false };
    setTasks([newTask, ...tasks]);
    setNewTaskTitle('');
    try {
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newTaskTitle })
      });
      const data = await res.json();
      setTasks(prev => prev.map(t => t._id === tempId ? data : t));
    } catch (e) {
      fetchTasks();
    }
  };

  if (loading) {
    return <div className="w-full h-full bg-[#111]/80 rounded-3xl border border-zinc-800/60 p-6 animate-pulse shadow-xl"></div>;
  }

  return (
    <div className="w-full h-full bg-[#111]/80 rounded-3xl border border-zinc-800/60 p-6 flex flex-col shadow-xl backdrop-blur-sm">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-extrabold text-white tracking-tight">24-Hour To-Do</h2>
        <span className="text-xs font-bold bg-emerald-500/10 text-emerald-400 px-2 py-1 rounded-md border border-emerald-500/20">
          {tasks.filter(t => t.isCompleted).length}/{tasks.length}
        </span>
      </div>

      <div className="flex-1 overflow-y-auto space-y-3 pr-2 mb-4 custom-scrollbar">
        {tasks.length === 0 ? (
          <p className="text-zinc-500 text-sm text-center py-4">No tasks today. Add one below!</p>
        ) : (
          tasks.map(task => (
            <div key={task._id} className="group flex items-center justify-between p-3 rounded-xl bg-[#0a0a0a] border border-zinc-800/50 hover:border-zinc-700 transition-colors">
              <div className="flex items-center gap-3 flex-1 overflow-hidden">
                <button 
                  onClick={() => handleToggleComplete(task)}
                  className={`shrink-0 w-5 h-5 rounded flex items-center justify-center border transition-all ${
                    task.isCompleted ? 'bg-emerald-500 border-emerald-500 text-emerald-950' : 'bg-transparent border-zinc-600 hover:border-emerald-500 text-transparent'
                  }`}
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                </button>
                
                {editingId === task._id ? (
                  <input
                    type="text"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSaveEdit(task._id)}
                    className="flex-1 bg-transparent text-white text-sm outline-none border-b border-emerald-500 focus:border-emerald-400 px-1 py-0.5"
                    autoFocus
                  />
                ) : (
                  <span className={`text-sm font-medium truncate transition-colors ${task.isCompleted ? 'text-zinc-600 line-through' : 'text-zinc-200'}`}>
                    {task.title}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                {editingId === task._id ? (
                  <button onClick={() => handleSaveEdit(task._id)} className="p-1.5 text-emerald-400 hover:bg-emerald-500/20 rounded-lg">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  </button>
                ) : (
                  <button onClick={() => { setEditingId(task._id); setEditValue(task.title); }} className="p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                  </button>
                )}
                <button onClick={() => handleDelete(task._id)} className="p-1.5 text-zinc-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <form onSubmit={handleAddTask} className="mt-auto relative shrink-0">
        <input
          type="text"
          placeholder="Add a new task..."
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          className="w-full bg-[#050505] border border-zinc-800/80 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-500/50 pr-10 transition-colors"
        />
        <button type="submit" disabled={!newTaskTitle.trim()} className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-emerald-500 hover:text-emerald-400 disabled:opacity-50 transition-colors">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
        </button>
      </form>
    </div>
  );
}
