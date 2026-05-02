import { motion } from 'framer-motion';
import { Github, Linkedin, Twitter, Dribbble, Mail, ExternalLink, ArrowUpRight, Sparkles } from 'lucide-react';
import ContactForm from '../components/ContactForm';

const iconMap = {
  github: Github,
  linkedin: Linkedin,
  twitter: Twitter,
  dribbble: Dribbble
};

export default function TemplateBento({ data }) {
  const { profile, projects, skills, experience, settings } = data;
  const primaryColor = settings.primaryColor || '#ec4899';

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 relative overflow-hidden font-sans selection:bg-pink-500/30">
      {/* Aurora Mesh Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-pink-500/20 blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-violet-600/20 blur-[120px] animate-pulse delay-700" />
        <div className="absolute top-[20%] right-[10%] w-[40%] h-[40%] rounded-full bg-cyan-500/10 blur-[100px] animate-pulse delay-1000" />
      </div>

      {/* Floating Particles */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white/20 rounded-full"
            initial={{ x: Math.random() * 100 + '%', y: Math.random() * 100 + '%' }}
            animate={{ 
              y: [null, '-20px', '20px', null],
              opacity: [0.2, 0.5, 0.2]
            }}
            transition={{ 
              duration: Math.random() * 5 + 5, 
              repeat: Infinity, 
              ease: "linear" 
            }}
          />
        ))}
      </div>

      <main className="relative z-10 max-w-7xl mx-auto px-6 py-12 lg:py-24">
        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-6">
          
          {/* Hero Section - Large Glass Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="md:col-span-4 lg:col-span-4 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-8 lg:p-12 relative overflow-hidden flex flex-col justify-between min-h-[400px]"
          >
            <div className="relative z-10">
              <motion.div 
                initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.2 }}
                className="w-20 h-20 rounded-2xl bg-gradient-to-br from-pink-500 to-violet-600 mb-8 flex items-center justify-center text-white shadow-lg shadow-pink-500/20"
              >
                {profile.avatarUrl ? (
                  <img src={profile.avatarUrl} alt="" className="w-full h-full object-cover rounded-2xl" />
                ) : (
                  <Sparkles size={32} />
                )}
              </motion.div>
              <h1 className="text-4xl lg:text-6xl font-bold tracking-tight text-white mb-4 leading-tight">
                Hey, I'm <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-violet-400">{profile.name}</span>
              </h1>
              <p className="text-lg lg:text-xl text-slate-400 max-w-xl leading-relaxed">
                {profile.bio}
              </p>
            </div>
            
            <div className="mt-12 flex flex-wrap gap-4 relative z-10">
              {profile.socialLinks.map((link, i) => {
                const Icon = iconMap[link.platform.toLowerCase()] || ExternalLink;
                return (
                  <a key={i} href={link.url} target="_blank" rel="noopener noreferrer" className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all hover:scale-110 text-white">
                    <Icon size={20} />
                  </a>
                );
              })}
            </div>
            
            {/* Decorative background element */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-pink-500/10 blur-[60px] rounded-full translate-x-1/2 -translate-y-1/2" />
          </motion.div>

          {/* Title/Role Card */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}
            className="md:col-span-2 lg:col-span-2 bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-8 flex flex-col justify-center items-center text-center"
          >
            <h2 className="text-sm uppercase tracking-[0.2em] text-slate-500 mb-2 font-bold">Currently</h2>
            <p className="text-2xl font-bold text-white">{profile.title}</p>
            <div className="mt-6 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Available for projects
            </div>
          </motion.div>

          {/* Skills Card - Bento Style */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="md:col-span-2 lg:col-span-2 bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-8"
          >
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2"><Sparkles size={18} className="text-pink-400" /> Expertise</h2>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill, i) => (
                <span key={i} className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sm font-medium text-slate-300 hover:bg-white/10 transition-colors">
                  {skill.name}
                </span>
              ))}
            </div>
          </motion.div>

          {/* Projects masonry style inside bento */}
          {projects.map((project, i) => (
            <motion.div 
              key={project.id}
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ delay: 0.1 * (i % 4) }}
              className={`group relative overflow-hidden bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-6 flex flex-col min-h-[300px] ${
                i === 0 ? 'md:col-span-2 lg:col-span-4' : 'md:col-span-2 lg:col-span-2'
              }`}
            >
              <div className="absolute inset-0 z-0 opacity-20 group-hover:opacity-40 transition-opacity duration-500">
                {project.imageUrl && <img src={project.imageUrl} alt="" className="w-full h-full object-cover" />}
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-[#0f172a]/60 to-transparent z-1" />
              
              <div className="relative z-10 mt-auto">
                <h3 className="text-2xl font-bold text-white mb-2">{project.title}</h3>
                <p className="text-slate-400 text-sm mb-6 line-clamp-2">{project.description}</p>
                <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                    {(Array.isArray(project.techStack) ? project.techStack : JSON.parse(project.techStack || '[]')).slice(0, 2).map((tech, j) => (
                      <span key={j} className="text-[10px] uppercase font-bold tracking-widest text-pink-400">{tech}</span>
                    ))}
                  </div>
                  <a href={project.liveUrl || '#'} className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center hover:scale-110 transition-transform">
                    <ArrowUpRight size={18} />
                  </a>
                </div>
              </div>
            </motion.div>
          ))}

          {/* Experience Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="md:col-span-4 lg:col-span-3 bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-8 lg:p-10"
          >
            <h2 className="text-2xl font-bold text-white mb-8">Career Path</h2>
            <div className="space-y-8">
              {experience.map((exp, i) => (
                <div key={i} className="flex gap-6 relative group">
                  <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white group-hover:border-pink-500/50 transition-colors">
                    {i + 1}
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-white">{exp.role}</h4>
                    <p className="text-pink-400 text-sm mb-2">{exp.company} • {exp.duration}</p>
                    <p className="text-slate-400 text-sm leading-relaxed">{exp.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Contact Card */}
          <motion.div 
            id="contact"
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="md:col-span-4 lg:col-span-3 bg-gradient-to-br from-pink-500/20 to-violet-600/20 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-8 lg:p-10"
          >
            <h2 className="text-2xl font-bold text-white mb-2">Let's build together</h2>
            <p className="text-slate-400 mb-8 text-sm">Have an idea? Let's make it real.</p>
            <ContactForm 
              inputClass="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl text-white focus:outline-none focus:border-pink-500/50 transition-all text-sm mb-4"
              buttonClass="w-full px-6 py-4 rounded-2xl bg-white text-black font-bold text-sm hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              successClass="p-8 rounded-[2rem] bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-center"
              primaryColor={primaryColor}
            />
          </motion.div>

        </div>
      </main>

      <footer className="relative z-10 py-12 text-center border-t border-white/5 mt-12">
        <p className="text-slate-500 text-sm font-medium">© {new Date().getFullYear()} • Handcrafted by {profile.name}</p>
      </footer>
    </div>
  );
}
