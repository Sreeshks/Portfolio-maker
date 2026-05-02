import { useState, useEffect } from 'react';
import api from '../api';
import toast from 'react-hot-toast';
import { Check, X, Trash2, Clock, CheckCircle2 } from 'lucide-react';

export default function TestimonialsManager() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => { loadTestimonials(); }, []);

  const loadTestimonials = async () => {
    try {
      const { data } = await api.get('/testimonials');
      setTestimonials(data);
    } catch (err) {
      toast.error('Failed to load testimonials');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      await api.put(`/testimonials/${id}`, { approved: true });
      toast.success('Testimonial approved!');
      loadTestimonials();
    } catch (err) {
      toast.error('Failed to approve');
    }
  };

  const handleReject = async (id) => {
    try {
      await api.put(`/testimonials/${id}`, { approved: false });
      toast.success('Testimonial rejected');
      loadTestimonials();
    } catch (err) {
      toast.error('Failed to reject');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this testimonial?')) return;
    try {
      await api.delete(`/testimonials/${id}`);
      toast.success('Deleted');
      loadTestimonials();
    } catch (err) {
      toast.error('Failed to delete');
    }
  };

  const filtered = filter === 'all' ? testimonials
    : filter === 'approved' ? testimonials.filter(t => t.approved)
    : testimonials.filter(t => !t.approved);

  if (loading) {
    return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" /></div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="section-title">Testimonials</h1>
        <p className="section-subtitle">{testimonials.length} total, {testimonials.filter(t => !t.approved).length} pending</p>
      </div>

      {/* Filters */}
      <div className="flex gap-2 p-1 bg-white/5 rounded-xl w-fit">
        {[
          { key: 'all', label: `All (${testimonials.length})` },
          { key: 'pending', label: `Pending (${testimonials.filter(t => !t.approved).length})` },
          { key: 'approved', label: `Approved (${testimonials.filter(t => t.approved).length})` }
        ].map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${filter === key ? 'bg-brand-600 text-white' : 'text-gray-400 hover:text-white'}`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Testimonials Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filtered.map((t, i) => (
          <div key={t.id} className="glass-card p-6 animate-fadeIn" style={{ animationDelay: `${i * 50}ms` }}>
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center text-white font-bold">
                  {t.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-semibold text-white text-sm">{t.name}</h3>
                  <p className="text-xs text-gray-400">{t.role}{t.company ? ` at ${t.company}` : ''}</p>
                </div>
              </div>
              <span className={`badge border ${t.approved
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
              }`}>
                {t.approved ? <><CheckCircle2 size={12} className="mr-1" /> Approved</> : <><Clock size={12} className="mr-1" /> Pending</>}
              </span>
            </div>

            <p className="text-sm text-gray-300 leading-relaxed mb-4 italic">"{t.message}"</p>

            <div className="flex items-center gap-2 pt-4 border-t border-white/5">
              {!t.approved && (
                <button onClick={() => handleApprove(t.id)} className="btn-success flex items-center gap-1.5 text-xs">
                  <Check size={14} />
                  Approve
                </button>
              )}
              {t.approved && (
                <button onClick={() => handleReject(t.id)} className="btn-secondary flex items-center gap-1.5 text-xs !px-3 !py-1.5">
                  <X size={14} />
                  Reject
                </button>
              )}
              <button onClick={() => handleDelete(t.id)} className="btn-danger flex items-center gap-1.5 text-xs !px-3 !py-1.5 ml-auto">
                <Trash2 size={14} />
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 text-gray-500">
          No {filter !== 'all' ? filter : ''} testimonials found.
        </div>
      )}

      {/* Public Submission Info */}
      <div className="glass-card p-6">
        <h2 className="text-lg font-semibold text-white mb-2">Public Testimonial Submission</h2>
        <p className="text-sm text-gray-400 mb-4">
          Share this endpoint with clients to collect testimonials. Submitted testimonials require your approval before appearing on the portfolio.
        </p>
        <code className="block p-4 bg-white/5 rounded-xl text-sm text-brand-400 font-mono break-all">
          POST http://localhost:5000/api/testimonials
        </code>
        <p className="text-xs text-gray-500 mt-2">
          Body: {'{ "name": "...", "role": "...", "company": "...", "message": "..." }'}
        </p>
      </div>
    </div>
  );
}
