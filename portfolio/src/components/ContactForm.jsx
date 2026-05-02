import { useState } from 'react';
import api from '../api';
import { Send, CheckCircle } from 'lucide-react';

export default function ContactForm({
  inputClass = "w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:border-transparent transition-all",
  buttonClass = "px-6 py-3 rounded-xl font-medium flex items-center justify-center gap-2 transition-all disabled:opacity-50",
  successClass = "p-6 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-center flex flex-col items-center gap-3",
  primaryColor = "var(--primary-color)"
}) {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await api.post('/contact', form);
      setSuccess(true);
      setForm({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className={successClass}>
        <CheckCircle size={32} />
        <div>
          <h3 className="text-lg font-semibold mb-1">Message Sent!</h3>
          <p className="text-sm opacity-80">Thanks for reaching out. I'll get back to you soon.</p>
        </div>
        <button
          onClick={() => setSuccess(false)}
          className="mt-2 text-sm underline opacity-70 hover:opacity-100"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-sm">
          {error}
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <input
            type="text"
            required
            placeholder="Your Name"
            value={form.name}
            onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
            className={inputClass}
            style={{ '--tw-ring-color': primaryColor }}
          />
        </div>
        <div>
          <input
            type="email"
            required
            placeholder="Your Email"
            value={form.email}
            onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
            className={inputClass}
            style={{ '--tw-ring-color': primaryColor }}
          />
        </div>
      </div>
      <div>
        <input
          type="text"
          placeholder="Subject (Optional)"
          value={form.subject}
          onChange={e => setForm(p => ({ ...p, subject: e.target.value }))}
          className={inputClass}
          style={{ '--tw-ring-color': primaryColor }}
        />
      </div>
      <div>
        <textarea
          required
          placeholder="Your Message..."
          rows={5}
          value={form.message}
          onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
          className={`${inputClass} resize-y min-h-[120px]`}
          style={{ '--tw-ring-color': primaryColor }}
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className={buttonClass}
        style={{
          backgroundColor: primaryColor,
          color: '#ffffff'
        }}
      >
        {loading ? (
          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        ) : (
          <>
            Send Message <Send size={18} />
          </>
        )}
      </button>
    </form>
  );
}
