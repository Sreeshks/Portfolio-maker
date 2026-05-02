import { useState, useEffect } from 'react';
import api from '../api';
import toast from 'react-hot-toast';
import { Save, Upload, Search } from 'lucide-react';

export default function Settings() {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => { loadSettings(); }, []);

  const loadSettings = async () => {
    try {
      const { data } = await api.get('/settings');
      setSettings(data);
    } catch (err) {
      toast.error('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const { data } = await api.put('/settings', {
        seoTitle: settings.seoTitle,
        seoDescription: settings.seoDescription,
        ogImage: settings.ogImage,
        analyticsId: settings.analyticsId
      });
      setSettings(data);
      toast.success('Settings saved!');
    } catch (err) {
      toast.error('Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const handleOgUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    try {
      const { data } = await api.post('/upload/image', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      setSettings(prev => ({ ...prev, ogImage: data.url }));
      toast.success('OG image uploaded!');
    } catch (err) {
      toast.error('Upload failed');
    }
  };

  if (loading || !settings) {
    return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" /></div>;
  }

  return (
    <div className="space-y-8 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="section-title flex items-center gap-3">
            <Search size={28} className="text-brand-400" />
            SEO & Settings
          </h1>
          <p className="section-subtitle">Optimize your portfolio for search engines</p>
        </div>
        <button onClick={handleSave} disabled={saving} className="btn-primary flex items-center gap-2">
          <Save size={16} />
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      {/* SEO Settings */}
      <div className="glass-card p-6">
        <h2 className="text-lg font-semibold text-white mb-4">SEO Meta Tags</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Page Title</label>
            <input
              type="text"
              value={settings.seoTitle}
              onChange={e => setSettings(prev => ({ ...prev, seoTitle: e.target.value }))}
              className="input-field"
              placeholder="Alex Rivera — Full-Stack Developer"
            />
            <p className="text-xs text-gray-500 mt-1">{settings.seoTitle?.length || 0}/60 characters recommended</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Meta Description</label>
            <textarea
              value={settings.seoDescription}
              onChange={e => setSettings(prev => ({ ...prev, seoDescription: e.target.value }))}
              className="input-field min-h-[80px] resize-y"
              placeholder="Portfolio of Alex Rivera..."
              rows={3}
            />
            <p className="text-xs text-gray-500 mt-1">{settings.seoDescription?.length || 0}/160 characters recommended</p>
          </div>
        </div>
      </div>

      {/* OG Image */}
      <div className="glass-card p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Social Share Image (OG Image)</h2>
        <div className="flex items-start gap-6">
          <div className="w-64 h-36 rounded-xl bg-white/5 border border-white/10 overflow-hidden flex items-center justify-center flex-shrink-0">
            {settings.ogImage ? (
              <img src={settings.ogImage} alt="OG" className="w-full h-full object-cover" />
            ) : (
              <span className="text-gray-600 text-sm">No image set</span>
            )}
          </div>
          <div>
            <label className="btn-secondary inline-flex items-center gap-2 cursor-pointer">
              <Upload size={16} />
              Upload Image
              <input type="file" accept="image/*" onChange={handleOgUpload} className="hidden" />
            </label>
            <p className="text-xs text-gray-500 mt-2">Recommended: 1200x630px, used when sharing on social media</p>
          </div>
        </div>
      </div>

      {/* Analytics */}
      <div className="glass-card p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Google Analytics</h2>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Measurement ID</label>
          <input
            type="text"
            value={settings.analyticsId}
            onChange={e => setSettings(prev => ({ ...prev, analyticsId: e.target.value }))}
            className="input-field"
            placeholder="G-XXXXXXXXXX"
          />
          <p className="text-xs text-gray-500 mt-1">Your Google Analytics 4 measurement ID</p>
        </div>
      </div>

      {/* Preview */}
      <div className="glass-card p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Search Result Preview</h2>
        <div className="p-6 bg-white rounded-xl">
          <p className="text-sm text-green-700 mb-1">portfolio.example.com</p>
          <h3 className="text-xl text-blue-800 hover:underline cursor-pointer mb-1">
            {settings.seoTitle || 'Your Portfolio Title'}
          </h3>
          <p className="text-sm text-gray-600">
            {settings.seoDescription || 'Your portfolio description will appear here...'}
          </p>
        </div>
      </div>
    </div>
  );
}
