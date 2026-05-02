import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import {
  FolderKanban, Zap, Briefcase, MessageSquareQuote,
  TrendingUp, ExternalLink, ArrowRight
} from 'lucide-react';

const statCards = [
  { key: 'projects', label: 'Projects', icon: FolderKanban, color: 'from-blue-500 to-cyan-500', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
  { key: 'skills', label: 'Skills', icon: Zap, color: 'from-amber-500 to-orange-500', bg: 'bg-amber-500/10', border: 'border-amber-500/20' },
  { key: 'experience', label: 'Experience', icon: Briefcase, color: 'from-emerald-500 to-teal-500', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
  { key: 'testimonials', label: 'Testimonials', icon: MessageSquareQuote, color: 'from-purple-500 to-pink-500', bg: 'bg-purple-500/10', border: 'border-purple-500/20' },
];

export default function Dashboard() {
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const [projects, skills, experience, testimonials, messages] = await Promise.all([
        api.get('/projects'),
        api.get('/skills'),
        api.get('/experience'),
        api.get('/testimonials'),
        api.get('/messages')
      ]);

      setStats({
        projects: projects.data.length,
        skills: skills.data.length,
        experience: experience.data.length,
        testimonials: testimonials.data.length,
        messages: messages.data.filter(m => !m.read).length,
        featuredProjects: projects.data.filter(p => p.featured).length,
        pendingTestimonials: testimonials.data.filter(t => !t.approved).length
      });
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

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="section-title">Dashboard</h1>
          <p className="section-subtitle">Overview of your portfolio content</p>
        </div>
        <a
          href="http://localhost:5173"
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary inline-flex items-center gap-2 self-start"
        >
          <ExternalLink size={16} />
          View Live Portfolio
        </a>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map(({ key, label, icon: Icon, color, bg, border }, i) => (
          <div
            key={key}
            className={`glass-card p-6 ${border} border animate-fadeIn`}
            style={{ animationDelay: `${i * 80}ms` }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl ${bg}`}>
                <Icon size={20} className={`bg-gradient-to-r ${color} bg-clip-text`} style={{ color: color.includes('blue') ? '#3b82f6' : color.includes('amber') ? '#f59e0b' : color.includes('emerald') ? '#10b981' : '#a855f7' }} />
              </div>
              <TrendingUp size={16} className="text-emerald-400" />
            </div>
            <p className="text-3xl font-bold text-white mb-1">{stats[key] || 0}</p>
            <p className="text-sm text-gray-400">{label}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions & Info */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <div className="glass-card p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Quick Actions</h2>
          <div className="space-y-3">
            {[
              { to: '/projects', label: 'Add New Project', desc: `${stats.projects || 0} projects total` },
              { to: '/skills', label: 'Manage Skills', desc: `${stats.skills || 0} skills listed` },
              { to: '/templates', label: 'Change Template', desc: 'Customize your portfolio look' },
              { to: '/profile', label: 'Update Profile', desc: 'Edit your personal info' },
            ].map(({ to, label, desc }) => (
              <Link
                key={to}
                to={to}
                className="flex items-center justify-between p-4 rounded-xl hover:bg-white/5 transition-colors group"
              >
                <div>
                  <p className="text-sm font-medium text-white">{label}</p>
                  <p className="text-xs text-gray-500">{desc}</p>
                </div>
                <ArrowRight size={16} className="text-gray-600 group-hover:text-brand-400 transition-colors" />
              </Link>
            ))}
          </div>
        </div>

        {/* Status */}
        <div className="glass-card p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Status</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-xl bg-white/5">
              <div>
                <p className="text-sm font-medium text-white">Featured Projects</p>
                <p className="text-xs text-gray-500">Highlighted on portfolio</p>
              </div>
              <span className="badge bg-blue-500/10 text-blue-400 border border-blue-500/20">
                {stats.featuredProjects || 0}
              </span>
            </div>

            <div className="flex items-center justify-between p-4 rounded-xl bg-white/5">
              <div>
                <p className="text-sm font-medium text-white">Pending Testimonials</p>
                <p className="text-xs text-gray-500">Awaiting approval</p>
              </div>
              <span className={`badge ${(stats.pendingTestimonials || 0) > 0 ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'}`}>
                {stats.pendingTestimonials || 0}
              </span>
            </div>

            <div className="flex items-center justify-between p-4 rounded-xl bg-white/5">
              <div>
                <p className="text-sm font-medium text-white">Unread Messages</p>
                <p className="text-xs text-gray-500">From contact form</p>
              </div>
              <span className={`badge ${(stats.messages || 0) > 0 ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'}`}>
                {stats.messages || 0}
              </span>
            </div>

            <div className="flex items-center justify-between p-4 rounded-xl bg-white/5">
              <div>
                <p className="text-sm font-medium text-white">API Status</p>
                <p className="text-xs text-gray-500">Backend server</p>
              </div>
              <span className="badge bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                ● Online
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
