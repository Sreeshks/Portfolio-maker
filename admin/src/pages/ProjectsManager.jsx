import { useState, useEffect } from 'react';
import api from '../api';
import Modal from '../components/Modal';
import toast from 'react-hot-toast';
import { Plus, Edit2, Trash2, Star, GripVertical, ExternalLink, Github, Upload, X } from 'lucide-react';

export default function ProjectsManager() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    title: '', description: '', techStack: [], liveUrl: '', githubUrl: '', imageUrl: '', featured: false, order: 0
  });
  const [techInput, setTechInput] = useState('');

  useEffect(() => { loadProjects(); }, []);

  const loadProjects = async () => {
    try {
      const { data } = await api.get('/projects');
      setProjects(data);
    } catch (err) {
      toast.error('Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  const openCreate = () => {
    setEditing(null);
    setForm({ title: '', description: '', techStack: [], liveUrl: '', githubUrl: '', imageUrl: '', featured: false, order: projects.length });
    setTechInput('');
    setShowModal(true);
  };

  const openEdit = (project) => {
    setEditing(project.id);
    setForm({
      title: project.title,
      description: project.description,
      techStack: Array.isArray(project.techStack) ? project.techStack : JSON.parse(project.techStack || '[]'),
      liveUrl: project.liveUrl,
      githubUrl: project.githubUrl,
      imageUrl: project.imageUrl,
      featured: project.featured,
      order: project.order
    });
    setTechInput('');
    setShowModal(true);
  };

  const handleSave = async () => {
    try {
      if (editing) {
        await api.put(`/projects/${editing}`, form);
        toast.success('Project updated!');
      } else {
        await api.post('/projects', form);
        toast.success('Project created!');
      }
      setShowModal(false);
      loadProjects();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to save project');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this project?')) return;
    try {
      await api.delete(`/projects/${id}`);
      toast.success('Project deleted');
      loadProjects();
    } catch (err) {
      toast.error('Failed to delete');
    }
  };

  const addTech = () => {
    if (techInput.trim() && !form.techStack.includes(techInput.trim())) {
      setForm(prev => ({ ...prev, techStack: [...prev.techStack, techInput.trim()] }));
      setTechInput('');
    }
  };

  const removeTech = (tech) => {
    setForm(prev => ({ ...prev, techStack: prev.techStack.filter(t => t !== tech) }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    try {
      const { data } = await api.post('/upload/image', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      setForm(prev => ({ ...prev, imageUrl: data.url }));
      toast.success('Image uploaded!');
    } catch (err) {
      toast.error('Upload failed');
    }
  };

  const toggleFeatured = async (project) => {
    try {
      await api.put(`/projects/${project.id}`, { featured: !project.featured });
      loadProjects();
    } catch (err) {
      toast.error('Failed to update');
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="section-title">Projects</h1>
          <p className="section-subtitle">{projects.length} projects total</p>
        </div>
        <button onClick={openCreate} className="btn-primary flex items-center gap-2">
          <Plus size={16} />
          Add Project
        </button>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {projects.map((project, i) => (
          <div key={project.id} className="glass-card overflow-hidden group animate-fadeIn" style={{ animationDelay: `${i * 50}ms` }}>
            {/* Image */}
            <div className="h-40 bg-gradient-to-br from-brand-900/50 to-purple-900/50 relative overflow-hidden">
              {project.imageUrl ? (
                <img src={project.imageUrl} alt={project.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-4xl opacity-20">📁</div>
              )}
              {project.featured && (
                <div className="absolute top-3 left-3 badge bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  <Star size={12} className="mr-1 fill-current" /> Featured
                </div>
              )}
            </div>

            {/* Content */}
            <div className="p-5">
              <h3 className="font-semibold text-white mb-2 truncate">{project.title}</h3>
              <p className="text-sm text-gray-400 line-clamp-2 mb-3">{project.description}</p>

              {/* Tech Stack */}
              <div className="flex flex-wrap gap-1.5 mb-4">
                {(Array.isArray(project.techStack) ? project.techStack : []).slice(0, 4).map(tech => (
                  <span key={tech} className="px-2 py-0.5 bg-white/5 border border-white/10 rounded-md text-xs text-gray-400">
                    {tech}
                  </span>
                ))}
                {(Array.isArray(project.techStack) ? project.techStack : []).length > 4 && (
                  <span className="px-2 py-0.5 text-xs text-gray-500">+{project.techStack.length - 4}</span>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                <button onClick={() => toggleFeatured(project)} className={`p-2 rounded-lg transition-colors ${project.featured ? 'bg-amber-500/10 text-amber-400' : 'hover:bg-white/5 text-gray-500'}`}>
                  <Star size={16} className={project.featured ? 'fill-current' : ''} />
                </button>
                <button onClick={() => openEdit(project)} className="p-2 hover:bg-white/5 text-gray-400 rounded-lg transition-colors">
                  <Edit2 size={16} />
                </button>
                <button onClick={() => handleDelete(project.id)} className="p-2 hover:bg-red-500/10 text-red-400 rounded-lg transition-colors">
                  <Trash2 size={16} />
                </button>
                {project.liveUrl && (
                  <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="p-2 hover:bg-white/5 text-gray-400 rounded-lg transition-colors ml-auto">
                    <ExternalLink size={16} />
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {projects.length === 0 && (
        <div className="text-center py-16">
          <p className="text-gray-500 mb-4">No projects yet</p>
          <button onClick={openCreate} className="btn-primary">Add your first project</button>
        </div>
      )}

      {/* Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editing ? 'Edit Project' : 'Add Project'} size="lg">
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-300 mb-2">Title *</label>
              <input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} className="input-field" placeholder="Project title" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
              <textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} className="input-field min-h-[100px] resize-y" placeholder="Describe your project..." rows={3} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Live URL</label>
              <input value={form.liveUrl} onChange={e => setForm(p => ({ ...p, liveUrl: e.target.value }))} className="input-field" placeholder="https://..." />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">GitHub URL</label>
              <input value={form.githubUrl} onChange={e => setForm(p => ({ ...p, githubUrl: e.target.value }))} className="input-field" placeholder="https://github.com/..." />
            </div>
          </div>

          {/* Tech Stack */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Tech Stack</label>
            <div className="flex gap-2 mb-2">
              <input
                value={techInput}
                onChange={e => setTechInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTech())}
                className="input-field flex-1"
                placeholder="e.g. React"
              />
              <button onClick={addTech} className="btn-secondary !px-4">Add</button>
            </div>
            <div className="flex flex-wrap gap-2">
              {form.techStack.map(tech => (
                <span key={tech} className="inline-flex items-center gap-1 px-3 py-1.5 bg-brand-500/10 text-brand-400 border border-brand-500/20 rounded-lg text-sm">
                  {tech}
                  <button onClick={() => removeTech(tech)} className="hover:text-white"><X size={14} /></button>
                </span>
              ))}
            </div>
          </div>

          {/* Image */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Project Image</label>
            <div className="flex items-center gap-4">
              <label className="btn-secondary inline-flex items-center gap-2 cursor-pointer text-sm !px-4 !py-2">
                <Upload size={14} />
                Upload Image
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              </label>
              {form.imageUrl && <span className="text-xs text-gray-500 truncate max-w-[200px]">{form.imageUrl}</span>}
            </div>
          </div>

          {/* Featured Toggle */}
          <label className="flex items-center gap-3 p-4 rounded-xl bg-white/5 cursor-pointer">
            <input
              type="checkbox"
              checked={form.featured}
              onChange={e => setForm(p => ({ ...p, featured: e.target.checked }))}
              className="w-5 h-5 rounded border-gray-600 bg-white/5 text-brand-500 focus:ring-brand-500"
            />
            <div>
              <p className="text-sm font-medium text-white">Featured Project</p>
              <p className="text-xs text-gray-500">Highlighted at the top of your portfolio</p>
            </div>
          </label>

          {/* Save */}
          <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
            <button onClick={() => setShowModal(false)} className="btn-secondary">Cancel</button>
            <button onClick={handleSave} className="btn-primary">
              {editing ? 'Update Project' : 'Create Project'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
