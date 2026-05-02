import { useState, useEffect } from 'react';
import api from '../api';
import Modal from '../components/Modal';
import toast from 'react-hot-toast';
import { Plus, Edit2, Trash2 } from 'lucide-react';

const CATEGORIES = ['Frontend', 'Backend', 'DevOps', 'Design', 'Mobile', 'Database', 'General'];

export default function SkillsManager() {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '', level: 50, category: 'General', icon: '' });

  useEffect(() => { loadSkills(); }, []);

  const loadSkills = async () => {
    try {
      const { data } = await api.get('/skills');
      setSkills(data);
    } catch (err) {
      toast.error('Failed to load skills');
    } finally {
      setLoading(false);
    }
  };

  const openCreate = () => {
    setEditing(null);
    setForm({ name: '', level: 50, category: 'General', icon: '' });
    setShowModal(true);
  };

  const openEdit = (skill) => {
    setEditing(skill.id);
    setForm({ name: skill.name, level: skill.level, category: skill.category, icon: skill.icon });
    setShowModal(true);
  };

  const handleSave = async () => {
    try {
      if (editing) {
        await api.put(`/skills/${editing}`, form);
        toast.success('Skill updated!');
      } else {
        await api.post('/skills', form);
        toast.success('Skill created!');
      }
      setShowModal(false);
      loadSkills();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to save');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this skill?')) return;
    try {
      await api.delete(`/skills/${id}`);
      toast.success('Skill deleted');
      loadSkills();
    } catch (err) {
      toast.error('Failed to delete');
    }
  };

  // Group skills by category
  const groupedSkills = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) acc[skill.category] = [];
    acc[skill.category].push(skill);
    return acc;
  }, {});

  const categoryColors = {
    Frontend: { bar: 'from-blue-500 to-cyan-400', badge: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
    Backend: { bar: 'from-emerald-500 to-teal-400', badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
    DevOps: { bar: 'from-orange-500 to-amber-400', badge: 'bg-orange-500/10 text-orange-400 border-orange-500/20' },
    Design: { bar: 'from-pink-500 to-rose-400', badge: 'bg-pink-500/10 text-pink-400 border-pink-500/20' },
    Mobile: { bar: 'from-violet-500 to-purple-400', badge: 'bg-violet-500/10 text-violet-400 border-violet-500/20' },
    Database: { bar: 'from-cyan-500 to-sky-400', badge: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20' },
    General: { bar: 'from-gray-500 to-slate-400', badge: 'bg-gray-500/10 text-gray-400 border-gray-500/20' },
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="section-title">Skills</h1>
          <p className="section-subtitle">{skills.length} skills across {Object.keys(groupedSkills).length} categories</p>
        </div>
        <button onClick={openCreate} className="btn-primary flex items-center gap-2">
          <Plus size={16} />
          Add Skill
        </button>
      </div>

      {/* Skills by Category */}
      {Object.entries(groupedSkills).map(([category, categorySkills]) => {
        const colors = categoryColors[category] || categoryColors.General;
        return (
          <div key={category} className="glass-card p-6">
            <div className="flex items-center gap-3 mb-5">
              <span className={`badge border ${colors.badge}`}>{category}</span>
              <span className="text-xs text-gray-500">{categorySkills.length} skills</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {categorySkills.map(skill => (
                <div key={skill.id} className="group p-4 rounded-xl bg-white/5 hover:bg-white/[0.07] transition-colors">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      {skill.icon && <span className="text-lg">{skill.icon}</span>}
                      <span className="font-medium text-white text-sm">{skill.name}</span>
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => openEdit(skill)} className="p-1.5 hover:bg-white/10 rounded-lg text-gray-400">
                        <Edit2 size={14} />
                      </button>
                      <button onClick={() => handleDelete(skill.id)} className="p-1.5 hover:bg-red-500/10 rounded-lg text-red-400">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full bg-gradient-to-r ${colors.bar} transition-all duration-700`}
                        style={{ width: `${skill.level}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-400 font-mono w-8">{skill.level}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}

      {skills.length === 0 && (
        <div className="text-center py-16">
          <p className="text-gray-500 mb-4">No skills yet</p>
          <button onClick={openCreate} className="btn-primary">Add your first skill</button>
        </div>
      )}

      {/* Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editing ? 'Edit Skill' : 'Add Skill'}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Skill Name *</label>
            <input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} className="input-field" placeholder="e.g. React" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
            <select
              value={form.category}
              onChange={e => setForm(p => ({ ...p, category: e.target.value }))}
              className="input-field"
            >
              {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Proficiency Level: <span className="text-brand-400 font-mono">{form.level}%</span>
            </label>
            <input
              type="range"
              min="1"
              max="100"
              value={form.level}
              onChange={e => setForm(p => ({ ...p, level: parseInt(e.target.value) }))}
              className="w-full accent-brand-500"
            />
            <div className="flex justify-between text-xs text-gray-600 mt-1">
              <span>Beginner</span>
              <span>Intermediate</span>
              <span>Expert</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Icon (emoji)</label>
            <input value={form.icon} onChange={e => setForm(p => ({ ...p, icon: e.target.value }))} className="input-field" placeholder="⚛️" />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
            <button onClick={() => setShowModal(false)} className="btn-secondary">Cancel</button>
            <button onClick={handleSave} className="btn-primary">{editing ? 'Update' : 'Create'}</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
