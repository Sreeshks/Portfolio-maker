import { useState, useEffect } from 'react';
import api from '../api';
import toast from 'react-hot-toast';
import { Save, Check, Palette, Smartphone, Monitor, RefreshCcw } from 'lucide-react';

const TEMPLATES = [
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'Clean and elegant with generous whitespace, serif typography, and subtle animations.',
    colors: ['#ffffff', '#f8fafc', '#1e293b'],
    preview: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)'
  },
  {
    id: 'bold',
    name: 'Bold',
    description: 'Dark navy with electric accents, oversized hero, bento-grid projects, and parallax effects.',
    colors: ['#0f172a', '#1e293b', '#6366f1'],
    preview: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #312e81 100%)'
  },
  {
    id: 'dark',
    name: 'Dark Glass',
    description: 'Pure black with glassmorphism cards, neon glows, 3D tilt effects, and particle backgrounds.',
    colors: ['#000000', '#111111', '#00ff88'],
    preview: 'linear-gradient(135deg, #000000 0%, #0a0a0a 50%, #111827 100%)'
  },
  {
    id: 'bento',
    name: 'Aurora Bento',
    description: 'Vibrant mesh gradients with asymmetric bento-style glass cards and floating particles.',
    colors: ['#0f172a', '#ec4899', '#8b5cf6'],
    preview: 'linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)'
  },
  {
    id: 'cyberpunk',
    name: 'Neon Terminal',
    description: 'Retro-futuristic CLI aesthetic with matrix-green neon, scanlines, and glitch effects.',
    colors: ['#000000', '#00ff41', '#ff00ff'],
    preview: 'repeating-linear-gradient(0deg, #000, #000 2px, #00ff41 2px, #00ff41 3px)'
  },
  {
    id: 'editorial',
    name: 'Luxury Editorial',
    description: 'High-fashion magazine layout with cream paper textures, bold serif fonts, and gold accents.',
    colors: ['#f9f7f2', '#1a1a1a', '#c5a059'],
    preview: 'linear-gradient(135deg, #f9f7f2 0%, #e5e5e5 100%)'
  },
  {
    id: 'spatial',
    name: '3D Spatial',
    description: 'Deep space UI with mouse-tracking perspective tilt, glowing orbs, and radial progress rings.',
    colors: ['#050505', '#a855f7', '#06b6d4'],
    preview: 'radial-gradient(circle at center, #1e1b4b 0%, #050505 100%)'
  },
  {
    id: 'japandi',
    name: 'Japandi Zen',
    description: 'Minimalist washi paper textures with terracotta accents and meditative ink-wash animations.',
    colors: ['#faf7f2', '#4a3f35', '#d4a373'],
    preview: 'linear-gradient(135deg, #faf7f2 0%, #f0ede6 100%)'
  }
];

const FONTS = [
  'Inter', 'Poppins', 'Roboto', 'Playfair Display', 'Space Grotesk',
  'DM Sans', 'Outfit', 'Manrope', 'Plus Jakarta Sans', 'Sora'
];

export default function TemplateTheme() {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [previewSize, setPreviewSize] = useState('desktop');
  const [refreshKey, setRefreshKey] = useState(0);

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
        activeTemplate: settings.activeTemplate,
        primaryColor: settings.primaryColor,
        accentColor: settings.accentColor,
        fontFamily: settings.fontFamily
      });
      setSettings(data);
      setRefreshKey(prev => prev + 1);
      toast.success('Theme settings saved! Portfolio updated.');
    } catch (err) {
      toast.error('Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const selectTemplate = (id) => {
    setSettings(prev => ({ ...prev, activeTemplate: id }));
  };

  if (loading || !settings) {
    return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" /></div>;
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="section-title flex items-center gap-3">
            <Palette size={28} className="text-brand-400" />
            Template & Theme
          </h1>
          <p className="section-subtitle">Customize your portfolio's look and feel</p>
        </div>
        <button onClick={handleSave} disabled={saving} className="btn-primary flex items-center gap-2">
          <Save size={16} />
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      {/* Template Selection */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-4">Choose Template</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {TEMPLATES.map((template) => {
            const isActive = settings.activeTemplate === template.id;
            return (
              <button
                key={template.id}
                onClick={() => selectTemplate(template.id)}
                className={`text-left p-1 rounded-2xl transition-all duration-300 ${isActive
                  ? 'ring-2 ring-brand-500 ring-offset-2 ring-offset-[#0f0f23]'
                  : 'hover:ring-1 hover:ring-white/20'
                  }`}
              >
                {/* Preview */}
                <div
                  className="h-44 rounded-xl mb-3 relative overflow-hidden"
                  style={{ background: template.preview }}
                >
                  {/* Mini preview elements */}
                  <div className="absolute inset-4 flex flex-col justify-between">
                    <div className="flex gap-1.5">
                      <div className="w-2 h-2 rounded-full bg-white/20" />
                      <div className="w-2 h-2 rounded-full bg-white/20" />
                      <div className="w-2 h-2 rounded-full bg-white/20" />
                    </div>
                    <div className="space-y-2">
                      <div className="h-2 w-20 bg-white/20 rounded" />
                      <div className="h-4 w-32 bg-white/30 rounded" />
                      <div className="h-2 w-24 bg-white/15 rounded" />
                    </div>
                    <div className="flex gap-2">
                      <div className="h-6 w-16 rounded bg-white/20" />
                      <div className="h-6 w-16 rounded bg-white/10" />
                    </div>
                  </div>

                  {isActive && (
                    <div className="absolute top-3 right-3 w-7 h-7 rounded-full bg-brand-500 flex items-center justify-center">
                      <Check size={14} className="text-white" />
                    </div>
                  )}
                </div>

                <div className="px-2 pb-2">
                  <h3 className="font-semibold text-white text-sm mb-1">{template.name}</h3>
                  <p className="text-xs text-gray-500 leading-relaxed">{template.description}</p>
                  <div className="flex gap-1.5 mt-3">
                    {template.colors.map((color, i) => (
                      <div key={i} className="w-5 h-5 rounded-full border border-white/10" style={{ backgroundColor: color }} />
                    ))}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Color Customization */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-card p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Primary Color</h2>
          <div className="flex items-center gap-4">
            <div className="relative">
              <input
                type="color"
                value={settings.primaryColor}
                onChange={e => setSettings(prev => ({ ...prev, primaryColor: e.target.value }))}
                className="w-16 h-16 rounded-xl cursor-pointer border-0 p-0"
              />
            </div>
            <div className="flex-1">
              <input
                type="text"
                value={settings.primaryColor}
                onChange={e => setSettings(prev => ({ ...prev, primaryColor: e.target.value }))}
                className="input-field font-mono text-sm"
                placeholder="#6366f1"
              />
              <p className="text-xs text-gray-500 mt-1">Main brand color for buttons, links, accents</p>
            </div>
          </div>
          {/* Quick colors */}
          <div className="flex gap-2 mt-4">
            {['#6366f1', '#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#ef4444', '#06b6d4'].map(color => (
              <button
                key={color}
                onClick={() => setSettings(prev => ({ ...prev, primaryColor: color }))}
                className={`w-8 h-8 rounded-lg border-2 transition-transform hover:scale-110 ${settings.primaryColor === color ? 'border-white' : 'border-transparent'}`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>

        <div className="glass-card p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Accent Color</h2>
          <div className="flex items-center gap-4">
            <div className="relative">
              <input
                type="color"
                value={settings.accentColor}
                onChange={e => setSettings(prev => ({ ...prev, accentColor: e.target.value }))}
                className="w-16 h-16 rounded-xl cursor-pointer border-0 p-0"
              />
            </div>
            <div className="flex-1">
              <input
                type="text"
                value={settings.accentColor}
                onChange={e => setSettings(prev => ({ ...prev, accentColor: e.target.value }))}
                className="input-field font-mono text-sm"
                placeholder="#f59e0b"
              />
              <p className="text-xs text-gray-500 mt-1">Secondary color for highlights, badges</p>
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            {['#f59e0b', '#f97316', '#eab308', '#84cc16', '#14b8a6', '#06b6d4', '#a855f7', '#f43f5e'].map(color => (
              <button
                key={color}
                onClick={() => setSettings(prev => ({ ...prev, accentColor: color }))}
                className={`w-8 h-8 rounded-lg border-2 transition-transform hover:scale-110 ${settings.accentColor === color ? 'border-white' : 'border-transparent'}`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Font Selection */}
      <div className="glass-card p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Font Family</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {FONTS.map(font => (
            <button
              key={font}
              onClick={() => setSettings(prev => ({ ...prev, fontFamily: font }))}
              className={`p-4 rounded-xl border text-center transition-all ${settings.fontFamily === font
                ? 'bg-brand-500/10 border-brand-500/30 text-brand-400'
                : 'bg-white/5 border-white/5 text-gray-400 hover:border-white/10 hover:text-white'
                }`}
            >
              <span className="text-lg font-semibold block mb-1" style={{ fontFamily: font }}>Aa</span>
              <span className="text-xs">{font}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Real-time Device Preview */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold text-white">Portfolio Live Preview</h2>
            <p className="text-xs text-gray-500">Actual view of your portfolio (Save changes to update)</p>
          </div>
          <div className="flex items-center gap-2 p-1 bg-white/5 rounded-xl">
            <button
              onClick={() => setPreviewSize('mobile')}
              className={`p-2 rounded-lg transition-all ${previewSize === 'mobile' ? 'bg-brand-600 text-white' : 'text-gray-400 hover:text-white'}`}
              title="Mobile View"
            >
              <Smartphone size={18} />
            </button>
            <button
              onClick={() => setPreviewSize('desktop')}
              className={`p-2 rounded-lg transition-all ${previewSize === 'desktop' ? 'bg-brand-600 text-white' : 'text-gray-400 hover:text-white'}`}
              title="Desktop View"
            >
              <Monitor size={18} />
            </button>
            <div className="w-px h-4 bg-white/10 mx-1" />
            <button
              onClick={() => setRefreshKey(k => k + 1)}
              className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-all"
              title="Refresh Preview"
            >
              <RefreshCcw size={18} />
            </button>
          </div>
        </div>

        <div
          className={`mx-auto transition-all duration-500 ease-in-out border-[12px] border-gray-900 rounded-[2.5rem] bg-[#0a0a0a] shadow-2xl overflow-hidden relative ${previewSize === 'mobile' ? 'w-[360px] h-[640px]' : 'w-full h-[600px]'
            }`}
        >
          {/* Status Bar for mobile */}
          {previewSize === 'mobile' && (
            <div className="absolute top-0 left-0 right-0 h-6 bg-gray-900 flex justify-center items-center z-20">
              <div className="w-16 h-1 bg-white/20 rounded-full" />
            </div>
          )}

          <iframe
            key={refreshKey}
            src="http://localhost:5173"
            className="w-full h-full border-none bg-white"
            title="Portfolio Preview"
          />

          {/* Loading overlay for iframe */}
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center bg-black/20 backdrop-blur-[2px] opacity-0 animate-pulse">
            <RefreshCcw className="text-white animate-spin" />
          </div>
        </div>

        <p className="text-center text-xs text-gray-500 mt-6 italic">
          Tip: Open <a href="http://localhost:5173" target="_blank" rel="noreferrer" className="text-brand-400 hover:underline">localhost:5173</a> in a new tab for full experience.
        </p>
      </div>

    </div>
  );
}
