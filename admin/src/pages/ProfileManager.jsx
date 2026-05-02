import { useState, useEffect } from 'react';
import api from '../api';
import toast from 'react-hot-toast';
import { Save, Plus, Trash2, Upload, Globe, Github, Twitter, Linkedin, Dribbble, Youtube, Instagram } from 'lucide-react';

const PLATFORMS = [
  { value: 'github', label: 'GitHub', icon: Github },
  { value: 'linkedin', label: 'LinkedIn', icon: Linkedin },
  { value: 'twitter', label: 'Twitter', icon: Twitter },
  { value: 'dribbble', label: 'Dribbble', icon: Dribbble },
  { value: 'youtube', label: 'YouTube', icon: Youtube },
  { value: 'instagram', label: 'Instagram', icon: Instagram },
  { value: 'website', label: 'Website', icon: Globe },
];

export default function ProfileManager() {
  const [profile, setProfile] = useState({
    name: '', title: '', bio: '', avatar: '', email: '', phone: '', location: '', resumeUrl: '',
    socialLinks: []
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => { loadProfile(); }, []);

  const loadProfile = async () => {
    try {
      const { data } = await api.get('/profile');
      setProfile(data);
    } catch (err) {
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const { data } = await api.put('/profile', profile);
      setProfile(data);
      toast.success('Profile saved!');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const handleFileUpload = async (e, field) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const { data } = await api.post('/upload/image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setProfile(prev => ({ ...prev, [field]: data.url }));
      toast.success('File uploaded!');
    } catch (err) {
      toast.error('Upload failed');
    }
  };

  const addSocialLink = () => {
    setProfile(prev => ({
      ...prev,
      socialLinks: [...prev.socialLinks, { platform: 'github', url: '' }]
    }));
  };

  const removeSocialLink = (index) => {
    setProfile(prev => ({
      ...prev,
      socialLinks: prev.socialLinks.filter((_, i) => i !== index)
    }));
  };

  const updateSocialLink = (index, field, value) => {
    setProfile(prev => ({
      ...prev,
      socialLinks: prev.socialLinks.map((link, i) =>
        i === index ? { ...link, [field]: value } : link
      )
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="section-title">Profile</h1>
          <p className="section-subtitle">Manage your personal information</p>
        </div>
        <button onClick={handleSave} disabled={saving} className="btn-primary flex items-center gap-2">
          <Save size={16} />
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      {/* Avatar Section */}
      <div className="glass-card p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Avatar</h2>
        <div className="flex items-center gap-6">
          <div className="w-24 h-24 rounded-2xl bg-white/5 border border-white/10 overflow-hidden flex items-center justify-center">
            {profile.avatar ? (
              <img src={profile.avatar} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <span className="text-3xl text-gray-600">👤</span>
            )}
          </div>
          <div>
            <label className="btn-secondary inline-flex items-center gap-2 cursor-pointer">
              <Upload size={16} />
              Upload Avatar
              <input type="file" accept="image/*" onChange={e => handleFileUpload(e, 'avatar')} className="hidden" />
            </label>
            <p className="text-xs text-gray-500 mt-2">Recommended: 400x400px, JPG or PNG</p>
          </div>
        </div>
      </div>

      {/* Basic Info */}
      <div className="glass-card p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Basic Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
            <input
              type="text"
              value={profile.name}
              onChange={e => setProfile(prev => ({ ...prev, name: e.target.value }))}
              className="input-field"
              placeholder="John Doe"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Title / Role</label>
            <input
              type="text"
              value={profile.title}
              onChange={e => setProfile(prev => ({ ...prev, title: e.target.value }))}
              className="input-field"
              placeholder="Full-Stack Developer"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
            <input
              type="email"
              value={profile.email}
              onChange={e => setProfile(prev => ({ ...prev, email: e.target.value }))}
              className="input-field"
              placeholder="john@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Phone</label>
            <input
              type="tel"
              value={profile.phone}
              onChange={e => setProfile(prev => ({ ...prev, phone: e.target.value }))}
              className="input-field"
              placeholder="+1 (555) 123-4567"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-300 mb-2">Location</label>
            <input
              type="text"
              value={profile.location}
              onChange={e => setProfile(prev => ({ ...prev, location: e.target.value }))}
              className="input-field"
              placeholder="San Francisco, CA"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-300 mb-2">Bio</label>
            <textarea
              value={profile.bio}
              onChange={e => setProfile(prev => ({ ...prev, bio: e.target.value }))}
              className="input-field min-h-[120px] resize-y"
              placeholder="Tell the world about yourself..."
              rows={4}
            />
          </div>
        </div>
      </div>

      {/* Resume */}
      <div className="glass-card p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Resume</h2>
        <div className="flex items-center gap-4">
          <label className="btn-secondary inline-flex items-center gap-2 cursor-pointer">
            <Upload size={16} />
            Upload Resume PDF
            <input type="file" accept=".pdf" onChange={e => handleFileUpload(e, 'resumeUrl')} className="hidden" />
          </label>
          {profile.resumeUrl && (
            <a href={profile.resumeUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-brand-400 hover:underline">
              View current resume ↗
            </a>
          )}
        </div>
      </div>

      {/* Social Links */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white">Social Links</h2>
          <button onClick={addSocialLink} className="btn-secondary flex items-center gap-2 text-sm !px-4 !py-2">
            <Plus size={14} />
            Add Link
          </button>
        </div>
        <div className="space-y-3">
          {profile.socialLinks.map((link, index) => (
            <div key={index} className="flex items-center gap-3 p-3 rounded-xl bg-white/5">
              <select
                value={link.platform}
                onChange={e => updateSocialLink(index, 'platform', e.target.value)}
                className="px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/50"
              >
                {PLATFORMS.map(p => (
                  <option key={p.value} value={p.value}>{p.label}</option>
                ))}
              </select>
              <input
                type="url"
                value={link.url}
                onChange={e => updateSocialLink(index, 'url', e.target.value)}
                className="input-field flex-1 !py-2"
                placeholder="https://..."
              />
              <button
                onClick={() => removeSocialLink(index)}
                className="p-2 hover:bg-red-500/10 text-red-400 rounded-xl transition-colors"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
          {profile.socialLinks.length === 0 && (
            <p className="text-center text-gray-500 py-8">No social links yet. Click "Add Link" to get started.</p>
          )}
        </div>
      </div>
    </div>
  );
}
