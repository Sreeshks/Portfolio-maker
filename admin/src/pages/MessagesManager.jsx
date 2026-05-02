import { useState, useEffect } from 'react';
import api from '../api';
import toast from 'react-hot-toast';
import { Mail, Trash2, CheckCircle2, Circle, Calendar, User, AtSign, Search } from 'lucide-react';
import { format } from 'date-fns';

export default function MessagesManager() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, unread, read
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadMessages();
  }, []);

  const loadMessages = async () => {
    try {
      const { data } = await api.get('/messages');
      setMessages(data);
    } catch (err) {
      toast.error('Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      await api.put(`/messages/${id}/read`);
      setMessages(messages.map(m => m.id === id ? { ...m, read: true } : m));
      toast.success('Marked as read');
    } catch (err) {
      toast.error('Failed to update message');
    }
  };

  const deleteMessage = async (id) => {
    if (!window.confirm('Are you sure you want to delete this message?')) return;
    try {
      await api.delete(`/messages/${id}`);
      setMessages(messages.filter(m => m.id !== id));
      toast.success('Message deleted');
    } catch (err) {
      toast.error('Failed to delete');
    }
  };

  const filteredMessages = messages
    .filter(m => {
      if (filter === 'unread') return !m.read;
      if (filter === 'read') return m.read;
      return true;
    })
    .filter(m => 
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      m.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.message.toLowerCase().includes(searchTerm.toLowerCase())
    );

  if (loading) {
    return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="section-title flex items-center gap-3">
            <Mail size={28} className="text-brand-400" />
            Contact Inbox
          </h1>
          <p className="section-subtitle">Manage inquiries from your portfolio visitors</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
            <input 
              type="text" 
              placeholder="Search messages..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10 text-sm py-2 w-full md:w-64"
            />
          </div>
          <select 
            value={filter} 
            onChange={(e) => setFilter(e.target.value)}
            className="input-field text-sm py-2 w-auto"
          >
            <option value="all">All Messages</option>
            <option value="unread">Unread</option>
            <option value="read">Read</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filteredMessages.length === 0 ? (
          <div className="glass-card p-20 text-center flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
              <Mail size={32} className="text-gray-500" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-1">No messages found</h3>
            <p className="text-gray-500">When people contact you via your portfolio, their messages will appear here.</p>
          </div>
        ) : (
          filteredMessages.map((msg) => (
            <div 
              key={msg.id} 
              className={`glass-card p-6 transition-all border-l-4 ${msg.read ? 'border-l-transparent' : 'border-l-brand-500'}`}
            >
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1 space-y-4">
                  <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                    <div className="flex items-center gap-2 text-white font-semibold">
                      <User size={14} className="text-gray-500" />
                      {msg.name}
                    </div>
                    <div className="flex items-center gap-2 text-gray-400 text-sm">
                      <AtSign size={14} className="text-gray-500" />
                      {msg.email}
                    </div>
                    <div className="flex items-center gap-2 text-gray-500 text-xs">
                      <Calendar size={14} />
                      {format(new Date(msg.createdAt), 'MMM d, yyyy HH:mm')}
                    </div>
                  </div>
                  
                  <div className="bg-white/5 p-4 rounded-xl text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">
                    {msg.message}
                  </div>
                </div>

                <div className="flex md:flex-col gap-2 justify-end">
                  {!msg.read && (
                    <button 
                      onClick={() => markAsRead(msg.id)}
                      className="p-2.5 rounded-xl bg-brand-500/10 text-brand-400 hover:bg-brand-500 hover:text-white transition-all flex items-center justify-center"
                      title="Mark as Read"
                    >
                      <CheckCircle2 size={18} />
                    </button>
                  )}
                  {msg.read && (
                    <div className="p-2.5 text-emerald-500 flex items-center justify-center" title="Read">
                      <CheckCircle2 size={18} />
                    </div>
                  )}
                  <button 
                    onClick={() => deleteMessage(msg.id)}
                    className="p-2.5 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-all flex items-center justify-center"
                    title="Delete Message"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
