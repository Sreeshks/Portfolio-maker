import { useState, useEffect } from 'react';
import api from '../api';
import toast from 'react-hot-toast';
import { Building2, Plus, Edit2, Trash2, Save, X, GripVertical, Image as ImageIcon, Link as LinkIcon } from 'lucide-react';

export default function LogoManager() {
  const [logos, setLogos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingLogo, setEditingLogo] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const initialForm = {
    name: '',
    image: '',
    url: '',
    order: 0
  };

  const [formData, setFormData] = useState(initialForm);

  useEffect(() => {
    loadLogos();
  }, []);

  const loadLogos = async () => {
    try {
      const { data } = await api.get('/logos');
      setLogos(data);
    } catch (err) {
      toast.error('Failed to load logos');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingLogo) {
        await api.put(`/logos/${editingLogo.id}`, formData);
        toast.success('Logo updated');
      } else {
        await api.post('/logos', formData);
        toast.success('Logo added');
      }
      setShowForm(false);
      setEditingLogo(null);
      setFormData(initialForm);
      loadLogos();
    } catch (err) {
      toast.error('Failed to save logo');
    }
  };

  const handleEdit = (logo) => {
    setEditingLogo(logo);
    setFormData({
      name: logo.name,
      image: logo.image,
      url: logo.url || '',
      order: logo.order || 0
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this logo?')) return;
    try {
      await api.delete(`/logos/${id}`);
      toast.success('Logo deleted');
      loadLogos();
    } catch (err) {
      toast.error('Failed to delete');
    }
  };

  if (loading) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="section-title flex items-center gap-3">
            <Building2 size={28} className="text-brand-400" />
            Client & Partner Logos
          </h1>
          <p className="section-subtitle">Manage companies and brands you've worked with</p>
        </div>
        {!showForm && (
          <button 
            onClick={() => { setFormData(initialForm); setShowForm(true); }}
            className="btn-primary flex items-center gap-2"
          >
            <Plus size={18} /> Add Logo
          </button>
        )}
      </div>

      {showForm ? (
        <div className="glass-card p-6 animate-fadeIn max-w-2xl">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold text-white">{editingLogo ? 'Edit Logo' : 'Add New Logo'}</h2>
            <button onClick={() => setShowForm(false)} className="p-2 hover:bg-white/5 rounded-lg text-gray-500">
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-gray-500 tracking-widest">Company Name</label>
              <input 
                type="text" 
                value={formData.name} 
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="input-field" 
                placeholder="e.g. Google, Apple, Stripe" 
                required 
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-gray-500 tracking-widest flex items-center gap-2">
                <ImageIcon size={14} /> Logo Image URL
              </label>
              <input 
                type="text" 
                value={formData.image} 
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                className="input-field" 
                placeholder="https://example.com/logo.png" 
                required 
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-gray-500 tracking-widest flex items-center gap-2">
                  <LinkIcon size={14} /> Company Website (Optional)
                </label>
                <input 
                  type="text" 
                  value={formData.url} 
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  className="input-field" 
                  placeholder="https://company.com" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-gray-500 tracking-widest">Display Order</label>
                <input 
                  type="number" 
                  value={formData.order} 
                  onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                  className="input-field" 
                />
              </div>
            </div>

            {formData.image && (
              <div className="p-8 bg-white rounded-xl flex items-center justify-center">
                <img src={formData.image} alt="Preview" className="max-h-12 object-contain" />
              </div>
            )}

            <div className="flex gap-3 pt-6 border-t border-white/5">
              <button type="button" onClick={() => setShowForm(false)} className="px-6 py-2 rounded-xl text-gray-400 hover:text-white transition-colors">
                Cancel
              </button>
              <button type="submit" className="btn-primary flex items-center gap-2">
                <Save size={18} /> {editingLogo ? 'Update Logo' : 'Add Logo'}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {logos.length === 0 ? (
            <div className="col-span-full glass-card p-12 text-center text-gray-500">
              No logos added yet.
            </div>
          ) : (
            logos.map((logo) => (
              <div key={logo.id} className="glass-card p-4 group relative">
                <div className="aspect-square bg-white rounded-lg flex items-center justify-center p-4 mb-2">
                  <img src={logo.image} alt={logo.name} className="max-w-full max-h-full object-contain grayscale group-hover:grayscale-0 transition-all" />
                </div>
                <p className="text-xs font-bold text-center text-gray-400 truncate">{logo.name}</p>
                
                <div className="absolute inset-0 bg-brand-900/90 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 rounded-2xl">
                  <button onClick={() => handleEdit(logo)} className="p-2 bg-white/10 hover:bg-white/20 rounded-lg text-white">
                    <Edit2 size={16} />
                  </button>
                  <button onClick={() => handleDelete(logo)} className="p-2 bg-red-500/20 hover:bg-red-500/40 rounded-lg text-red-400">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
