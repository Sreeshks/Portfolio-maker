import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import {
  FolderKanban, Zap, Briefcase, MessageSquareQuote,
  TrendingUp, ExternalLink, ArrowRight, Mail, Newspaper, Building2,
  CheckCircle, AlertCircle, Clock
} from 'lucide-react';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const { data } = await api.get('/stats');
      setStats(data);
    } catch (err) {
      console.error('Failed to load stats:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const statCards = [
    { label: 'Projects', value: stats?.projects || 0, icon: FolderKanban, color: 'text-blue-400', bg: 'bg-blue-500/10' },
    { label: 'Unread Messages', value: stats?.unreadMessages || 0, icon: Mail, color: 'text-red-400', bg: 'bg-red-500/10' },
    { label: 'Pending Reviews', value: stats?.pendingTestimonials || 0, icon: MessageSquareQuote, color: 'text-amber-400', bg: 'bg-amber-500/10' },
    { label: 'Total Clients', value: stats?.totalLogos || 0, icon: Building2, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Welcome Back! 👋</h1>
          <p className="text-gray-400">Here's what's happening with your portfolio today.</p>
        </div>
        <div className="flex gap-3">
          <a
            href="http://localhost:5173"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white font-medium hover:bg-white/10 transition-all flex items-center gap-2"
          >
            <ExternalLink size={18} />
            Live Site
          </a>
          <Link
            to="/templates"
            className="btn-primary flex items-center gap-2"
          >
            <Zap size={18} />
            Switch Template
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, i) => (
          <div key={i} className="glass-card p-6 border border-white/5 relative overflow-hidden group">
            <div className={`absolute top-0 right-0 w-24 h-24 ${card.bg} rounded-full -mr-12 -mt-12 blur-3xl opacity-50 group-hover:opacity-100 transition-opacity`} />
            <div className="relative z-10">
              <div className={`w-12 h-12 rounded-xl ${card.bg} flex items-center justify-center mb-4`}>
                <card.icon size={24} className={card.color} />
              </div>
              <p className="text-3xl font-black text-white mb-1">{card.value}</p>
              <p className="text-sm font-medium text-gray-500 uppercase tracking-widest">{card.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="lg:col-span-1 space-y-6">
          <div className="glass-card p-6 border border-white/5">
            <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
              <TrendingUp size={20} className="text-brand-400" />
              Quick Actions
            </h2>
            <div className="grid grid-cols-1 gap-3">
              {[
                { to: '/blog', label: 'Write Blog Post', icon: Newspaper, color: 'text-purple-400' },
                { to: '/projects', label: 'Add Project', icon: FolderKanban, color: 'text-blue-400' },
                { to: '/messages', label: 'View Inbox', icon: Mail, color: 'text-red-400' },
                { to: '/logos', label: 'Manage Clients', icon: Building2, color: 'text-emerald-400' },
              ].map((action, i) => (
                <Link 
                  key={i} 
                  to={action.to}
                  className="flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <action.icon size={18} className={action.color} />
                    <span className="text-sm font-medium text-gray-300 group-hover:text-white">{action.label}</span>
                  </div>
                  <ArrowRight size={16} className="text-gray-600 group-hover:translate-x-1 transition-transform" />
                </Link>
              ))}
            </div>
          </div>

          <div className="glass-card p-6 border border-white/5 bg-gradient-to-br from-brand-600/20 to-transparent">
             <h3 className="text-white font-bold mb-2 flex items-center gap-2">
               <Zap size={18} className="text-brand-400 animate-pulse" />
               Pro Tip
             </h3>
             <p className="text-sm text-gray-400 leading-relaxed">
               Use the <b>Bento Grid</b> template for a modern tech look, or <b>Luxury Editorial</b> if you're a designer!
             </p>
          </div>
        </div>

        {/* System Health & Status */}
        <div className="lg:col-span-2 glass-card p-8 border border-white/5">
           <h2 className="text-lg font-bold text-white mb-8">System Overview</h2>
           
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                    <span className="text-sm font-medium text-gray-300">API Gateway</span>
                  </div>
                  <span className="text-xs font-bold text-emerald-500 uppercase tracking-widest">Operational</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                    <span className="text-sm font-medium text-gray-300">Database Sync</span>
                  </div>
                  <span className="text-xs font-bold text-emerald-500 uppercase tracking-widest">Active</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
                    <span className="text-sm font-medium text-gray-300">Media Storage</span>
                  </div>
                  <span className="text-xs font-bold text-blue-500 uppercase tracking-widest">Local Node</span>
                </div>
             </div>

             <div className="bg-white/5 rounded-2xl p-6 border border-white/5">
                <h4 className="text-xs font-black text-gray-500 uppercase tracking-widest mb-6">Recent Activity</h4>
                <div className="space-y-4">
                   <div className="flex gap-3">
                      <Clock size={14} className="text-brand-400 mt-0.5" />
                      <div>
                        <p className="text-xs text-white font-medium">New features deployed</p>
                        <p className="text-[10px] text-gray-500">Just now</p>
                      </div>
                   </div>
                   <div className="flex gap-3">
                      <CheckCircle size={14} className="text-emerald-400 mt-0.5" />
                      <div>
                        <p className="text-xs text-white font-medium">Database schema updated</p>
                        <p className="text-[10px] text-gray-500">5 minutes ago</p>
                      </div>
                   </div>
                   <div className="flex gap-3">
                      <AlertCircle size={14} className="text-amber-400 mt-0.5" />
                      <div>
                        <p className="text-xs text-white font-medium">5 unread messages</p>
                        <p className="text-[10px] text-gray-500">Checking required</p>
                      </div>
                   </div>
                </div>
             </div>
           </div>

           <div className="mt-10 p-6 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center justify-between">
              <div>
                <p className="text-emerald-400 font-bold">Your portfolio is performing great!</p>
                <p className="text-xs text-emerald-500/70">All systems green. Deployment active.</p>
              </div>
              <button className="px-4 py-2 bg-emerald-500 text-black text-xs font-bold rounded-lg hover:bg-emerald-400 transition-colors">
                Run Audit
              </button>
           </div>
        </div>
      </div>
    </div>
  );
}
