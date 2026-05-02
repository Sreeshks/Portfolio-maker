import { useState, useEffect } from 'react';
import api from '../api';
import toast from 'react-hot-toast';
import { Newspaper, Plus, Edit2, Trash2, Save, X, Eye, EyeOff, Tag, Image as ImageIcon, Link as LinkIcon } from 'lucide-react';
import { format } from 'date-fns';

export default function BlogManager() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingPost, setEditingPost] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const initialForm = {
    title: '',
    slug: '',
    content: '',
    excerpt: '',
    coverImage: '',
    tags: '[]',
    published: false
  };

  const [formData, setFormData] = useState(initialForm);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      const { data } = await api.get('/blog/admin');
      setPosts(data);
    } catch (err) {
      toast.error('Failed to load blog posts');
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
  };

  const handleTitleChange = (e) => {
    const title = e.target.value;
    setFormData({
      ...formData,
      title,
      slug: editingPost ? formData.slug : generateSlug(title)
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingPost) {
        await api.put(`/blog/${editingPost.id}`, formData);
        toast.success('Post updated');
      } else {
        await api.post('/blog', formData);
        toast.success('Post created');
      }
      setShowForm(false);
      setEditingPost(null);
      setFormData(initialForm);
      loadPosts();
    } catch (err) {
      toast.error('Failed to save post');
    }
  };

  const handleEdit = (post) => {
    setEditingPost(post);
    setFormData({
      title: post.title,
      slug: post.slug,
      content: post.content,
      excerpt: post.excerpt || '',
      coverImage: post.coverImage || '',
      tags: post.tags || '[]',
      published: post.published
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this post permanently?')) return;
    try {
      await api.delete(`/blog/${id}`);
      toast.success('Post deleted');
      loadPosts();
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
            <Newspaper size={28} className="text-brand-400" />
            Blog Manager
          </h1>
          <p className="section-subtitle">Write articles and share your thoughts</p>
        </div>
        {!showForm && (
          <button
            onClick={() => { setFormData(initialForm); setShowForm(true); }}
            className="btn-primary flex items-center gap-2"
          >
            <Plus size={18} /> New Post
          </button>
        )}
      </div>

      {showForm ? (
        <div className="glass-card p-6 md:p-8 animate-fadeIn">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold text-white">{editingPost ? 'Edit Post' : 'Create New Post'}</h2>
            <button onClick={() => setShowForm(false)} className="p-2 hover:bg-white/5 rounded-lg text-gray-500">
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-gray-500 tracking-widest">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={handleTitleChange}
                  className="input-field"
                  placeholder="Enter post title"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-gray-500 tracking-widest">URL Slug</label>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-600">/blog/</span>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    className="input-field"
                    placeholder="post-url-slug"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-gray-500 tracking-widest">Excerpt (Brief summary)</label>
              <textarea
                value={formData.excerpt}
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                className="input-field h-20"
                placeholder="A short summary for the blog listing page..."
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-gray-500 tracking-widest">Content (Markdown supported)</label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                className="input-field h-96 font-mono text-sm leading-relaxed"
                placeholder="Write your content here... You can use # for headers, ** for bold, etc."
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-gray-500 tracking-widest flex items-center gap-2">
                  <ImageIcon size={14} /> Cover Image URL
                </label>
                <input
                  type="text"
                  value={formData.coverImage}
                  onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
                  className="input-field"
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-gray-500 tracking-widest flex items-center gap-2">
                  <Tag size={14} /> Tags (JSON array)
                </label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  className="input-field"
                  placeholder='["React", "Tutorial"]'
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-6 border-t border-white/5">
              <label className="flex items-center gap-3 cursor-pointer group">
                <div
                  onClick={() => setFormData({ ...formData, published: !formData.published })}
                  className={`w-12 h-6 rounded-full transition-all relative ${formData.published ? 'bg-emerald-500' : 'bg-gray-700'}`}
                >
                  <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${formData.published ? 'left-7' : 'left-1'}`} />
                </div>
                <span className="text-sm font-medium text-gray-300 group-hover:text-white transition-colors">
                  {formData.published ? 'Published' : 'Draft'}
                </span>
              </label>

              <div className="flex gap-3">
                <button type="button" onClick={() => setShowForm(false)} className="px-6 py-2 rounded-xl text-gray-400 hover:text-white transition-colors">
                  Cancel
                </button>
                <button type="submit" className="btn-primary flex items-center gap-2">
                  <Save size={18} /> Save Post
                </button>
              </div>
            </div>
          </form>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {posts.length === 0 ? (
            <div className="glass-card p-20 text-center flex flex-col items-center">
              <Newspaper size={48} className="text-gray-700 mb-4" />
              <p className="text-gray-500">No blog posts yet. Click "New Post" to start writing.</p>
            </div>
          ) : (
            posts.map((post) => (
              <div key={post.id} className="glass-card p-6 flex items-center gap-6 group">
                <div className="w-24 h-24 rounded-xl bg-white/5 overflow-hidden flex-shrink-0 flex items-center justify-center text-gray-700">
                  {post.coverImage ? (
                    <img src={post.coverImage} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <ImageIcon size={32} />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="text-lg font-bold text-white truncate">{post.title}</h3>
                    {post.published ? (
                      <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-400 flex items-center gap-1">
                        <Eye size={10} /> Published
                      </span>
                    ) : (
                      <span className="text-[10px] uppercase font-bold tracking-widest text-amber-500 flex items-center gap-1">
                        <EyeOff size={10} /> Draft
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 mb-2 truncate">{post.excerpt || 'No excerpt provided.'}</p>
                  <div className="flex items-center gap-4 text-xs text-gray-600">
                    <span className="flex items-center gap-1"><LinkIcon size={12} /> /{post.slug}</span>
                    <span>{format(new Date(post.createdAt), 'MMM d, yyyy')}</span>
                  </div>
                </div>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => handleEdit(post)} className="p-2 hover:bg-brand-500/10 text-brand-400 rounded-lg transition-colors">
                    <Edit2 size={18} />
                  </button>
                  <button onClick={() => handleDelete(post)} className="p-2 hover:bg-red-500/10 text-red-400 rounded-lg transition-colors">
                    <Trash2 size={18} />
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
