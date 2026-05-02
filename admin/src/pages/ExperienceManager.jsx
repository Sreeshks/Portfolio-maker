import { useState, useEffect } from 'react';
import api from '../api';
import Modal from '../components/Modal';
import toast from 'react-hot-toast';
import { Plus, Edit2, Trash2, Briefcase, GraduationCap } from 'lucide-react';

export default function ExperienceManager() {
  const [experiences, setExperiences] = useState([]);
  const [education, setEducation] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('experience');
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [expForm, setExpForm] = useState({ company: '', role: '', duration: '', description: '', logo: '', current: false });
  const [eduForm, setEduForm] = useState({ institution: '', degree: '', year: '', description: '' });

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      const [expRes, eduRes] = await Promise.all([api.get('/experience'), api.get('/education')]);
      setExperiences(expRes.data);
      setEducation(eduRes.data);
    } catch (err) {
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const openCreate = () => {
    setEditing(null);
    if (tab === 'experience') {
      setExpForm({ company: '', role: '', duration: '', description: '', logo: '', current: false });
    } else {
      setEduForm({ institution: '', degree: '', year: '', description: '' });
    }
    setShowModal(true);
  };

  const openEditExp = (exp) => {
    setTab('experience');
    setEditing(exp.id);
    setExpForm({ company: exp.company, role: exp.role, duration: exp.duration, description: exp.description, logo: exp.logo, current: exp.current });
    setShowModal(true);
  };

  const openEditEdu = (edu) => {
    setTab('education');
    setEditing(edu.id);
    setEduForm({ institution: edu.institution, degree: edu.degree, year: edu.year, description: edu.description });
    setShowModal(true);
  };

  const handleSave = async () => {
    try {
      if (tab === 'experience') {
        if (editing) {
          await api.put(`/experience/${editing}`, expForm);
        } else {
          await api.post('/experience', expForm);
        }
      } else {
        if (editing) {
          await api.put(`/education/${editing}`, eduForm);
        } else {
          await api.post('/education', eduForm);
        }
      }
      toast.success(editing ? 'Updated!' : 'Created!');
      setShowModal(false);
      loadData();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to save');
    }
  };

  const handleDelete = async (id, type) => {
    if (!confirm('Delete this entry?')) return;
    try {
      await api.delete(`/${type}/${id}`);
      toast.success('Deleted');
      loadData();
    } catch (err) {
      toast.error('Failed to delete');
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="section-title">Experience & Education</h1>
          <p className="section-subtitle">Build your professional timeline</p>
        </div>
        <button onClick={openCreate} className="btn-primary flex items-center gap-2">
          <Plus size={16} />
          Add {tab === 'experience' ? 'Experience' : 'Education'}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 p-1 bg-white/5 rounded-xl w-fit">
        <button
          onClick={() => setTab('experience')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${tab === 'experience' ? 'bg-brand-600 text-white' : 'text-gray-400 hover:text-white'}`}
        >
          <Briefcase size={16} />
          Experience ({experiences.length})
        </button>
        <button
          onClick={() => setTab('education')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${tab === 'education' ? 'bg-brand-600 text-white' : 'text-gray-400 hover:text-white'}`}
        >
          <GraduationCap size={16} />
          Education ({education.length})
        </button>
      </div>

      {/* Experience Timeline */}
      {tab === 'experience' && (
        <div className="space-y-4">
          {experiences.map((exp, i) => (
            <div key={exp.id} className="glass-card p-6 group animate-fadeIn" style={{ animationDelay: `${i * 60}ms` }}>
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center flex-shrink-0">
                    {exp.logo ? <img src={exp.logo} alt="" className="w-8 h-8 rounded" /> : <Briefcase size={20} className="text-brand-400" />}
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">{exp.role}</h3>
                    <p className="text-sm text-brand-400">{exp.company}</p>
                    <p className="text-xs text-gray-500 mt-1 flex items-center gap-2">
                      {exp.duration}
                      {exp.current && <span className="badge bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px]">Current</span>}
                    </p>
                    {exp.description && <p className="text-sm text-gray-400 mt-3 leading-relaxed">{exp.description}</p>}
                  </div>
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => openEditExp(exp)} className="p-2 hover:bg-white/5 rounded-lg text-gray-400"><Edit2 size={14} /></button>
                  <button onClick={() => handleDelete(exp.id, 'experience')} className="p-2 hover:bg-red-500/10 rounded-lg text-red-400"><Trash2 size={14} /></button>
                </div>
              </div>
            </div>
          ))}
          {experiences.length === 0 && (
            <div className="text-center py-16 text-gray-500">
              <p className="mb-4">No experience added yet</p>
              <button onClick={openCreate} className="btn-primary">Add experience</button>
            </div>
          )}
        </div>
      )}

      {/* Education */}
      {tab === 'education' && (
        <div className="space-y-4">
          {education.map((edu, i) => (
            <div key={edu.id} className="glass-card p-6 group animate-fadeIn" style={{ animationDelay: `${i * 60}ms` }}>
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center flex-shrink-0">
                    <GraduationCap size={20} className="text-purple-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">{edu.degree}</h3>
                    <p className="text-sm text-purple-400">{edu.institution}</p>
                    <p className="text-xs text-gray-500 mt-1">{edu.year}</p>
                    {edu.description && <p className="text-sm text-gray-400 mt-3 leading-relaxed">{edu.description}</p>}
                  </div>
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => openEditEdu(edu)} className="p-2 hover:bg-white/5 rounded-lg text-gray-400"><Edit2 size={14} /></button>
                  <button onClick={() => handleDelete(edu.id, 'education')} className="p-2 hover:bg-red-500/10 rounded-lg text-red-400"><Trash2 size={14} /></button>
                </div>
              </div>
            </div>
          ))}
          {education.length === 0 && (
            <div className="text-center py-16 text-gray-500">
              <p className="mb-4">No education added yet</p>
              <button onClick={openCreate} className="btn-primary">Add education</button>
            </div>
          )}
        </div>
      )}

      {/* Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editing ? `Edit ${tab === 'experience' ? 'Experience' : 'Education'}` : `Add ${tab === 'experience' ? 'Experience' : 'Education'}`}>
        <div className="space-y-4">
          {tab === 'experience' ? (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Company *</label>
                  <input value={expForm.company} onChange={e => setExpForm(p => ({ ...p, company: e.target.value }))} className="input-field" placeholder="Company name" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Role *</label>
                  <input value={expForm.role} onChange={e => setExpForm(p => ({ ...p, role: e.target.value }))} className="input-field" placeholder="Your role" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Duration</label>
                <input value={expForm.duration} onChange={e => setExpForm(p => ({ ...p, duration: e.target.value }))} className="input-field" placeholder="2020 – Present" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                <textarea value={expForm.description} onChange={e => setExpForm(p => ({ ...p, description: e.target.value }))} className="input-field min-h-[100px] resize-y" placeholder="Describe your responsibilities..." rows={3} />
              </div>
              <label className="flex items-center gap-3 p-4 rounded-xl bg-white/5 cursor-pointer">
                <input type="checkbox" checked={expForm.current} onChange={e => setExpForm(p => ({ ...p, current: e.target.checked }))} className="w-5 h-5 rounded border-gray-600 bg-white/5 text-brand-500 focus:ring-brand-500" />
                <span className="text-sm text-white">Currently working here</span>
              </label>
            </>
          ) : (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Institution *</label>
                <input value={eduForm.institution} onChange={e => setEduForm(p => ({ ...p, institution: e.target.value }))} className="input-field" placeholder="University name" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Degree *</label>
                <input value={eduForm.degree} onChange={e => setEduForm(p => ({ ...p, degree: e.target.value }))} className="input-field" placeholder="B.S. Computer Science" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Year</label>
                <input value={eduForm.year} onChange={e => setEduForm(p => ({ ...p, year: e.target.value }))} className="input-field" placeholder="2020" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                <textarea value={eduForm.description} onChange={e => setEduForm(p => ({ ...p, description: e.target.value }))} className="input-field min-h-[100px] resize-y" placeholder="Additional details..." rows={3} />
              </div>
            </>
          )}
          <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
            <button onClick={() => setShowModal(false)} className="btn-secondary">Cancel</button>
            <button onClick={handleSave} className="btn-primary">{editing ? 'Update' : 'Create'}</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
