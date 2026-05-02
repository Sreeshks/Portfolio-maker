import { motion, useScroll, useTransform } from 'framer-motion';
import { Github, Linkedin, Twitter, Dribbble, Mail, ExternalLink, ArrowRight, ChevronDown } from 'lucide-react';
import ContactForm from '../components/ContactForm';
import { useState, useEffect } from 'react';

const iconMap = {
  github: Github,
  linkedin: Linkedin,
  twitter: Twitter,
  dribbble: Dribbble
};

export default function TemplateBold({ data }) {
  const { profile, projects, skills, experience, education, settings } = data;
  const primaryColor = settings.primaryColor || '#6366f1';
  const accentColor = settings.accentColor || '#f59e0b';
  
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 1000], [0, 200]);
  const opacity1 = useTransform(scrollY, [0, 300], [1, 0]);

  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: e.clientX,
        y: e.clientY,
      });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-300 selection:bg-indigo-500/30 overflow-hidden relative">
      {/* Spotlight Effect */}
      <div 
        className="pointer-events-none fixed inset-0 z-30 transition-opacity duration-300"
        style={{
          background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, ${primaryColor}15, transparent 40%)`
        }}
      />

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0f172a]/80 backdrop-blur-xl border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <a href="#" className="text-2xl font-black text-white tracking-tighter">
            {profile.name.toUpperCase()}
          </a>
          <a
            href="#contact"
            className="px-6 py-2.5 rounded-full text-sm font-bold text-white transition-transform hover:scale-105 active:scale-95"
            style={{ backgroundColor: primaryColor }}
          >
            LET'S TALK
          </a>
        </div>
      </nav>

      <main className="relative z-10">
        {/* Hero Section */}
        <section className="relative min-h-screen flex items-center justify-center pt-20 px-6">
          <motion.div 
            style={{ y: y1, opacity: opacity1 }}
            className="text-center w-full max-w-5xl"
          >
            <motion.h2 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
              className="text-lg md:text-2xl font-bold tracking-widest uppercase mb-6"
              style={{ color: accentColor }}
            >
              {profile.title}
            </motion.h2>
            <motion.h1 
              initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7, delay: 0.1 }}
              className="text-6xl md:text-8xl lg:text-9xl font-black text-white tracking-tighter leading-[0.9] mb-8"
            >
              {profile.name.split(' ').map((part, i) => (
                <span key={i} className="block hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r transition-all duration-300" style={{ backgroundImage: `linear-gradient(to right, ${primaryColor}, ${accentColor})` }}>
                  {part}
                </span>
              ))}
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.3 }}
              className="text-xl md:text-2xl text-slate-400 max-w-2xl mx-auto leading-relaxed mb-12"
            >
              {profile.bio}
            </motion.p>
            <motion.div 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.5 }}
              className="flex justify-center gap-6"
            >
              {profile.socialLinks.map((link, i) => {
                const Icon = iconMap[link.platform.toLowerCase()] || ExternalLink;
                return (
                  <a key={i} href={link.url} target="_blank" rel="noopener noreferrer" className="w-14 h-14 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-white hover:bg-slate-700 transition-all hover:scale-110">
                    <Icon size={24} />
                  </a>
                );
              })}
            </motion.div>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1, duration: 1 }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce text-slate-500"
          >
            <ChevronDown size={32} />
          </motion.div>
        </section>

        <div className="max-w-7xl mx-auto px-6 py-32 space-y-40">
          
          {/* Projects Bento Grid */}
          <section id="projects">
            <h2 className="text-4xl md:text-6xl font-black text-white tracking-tight mb-12 uppercase">Featured<br/><span style={{ color: primaryColor }}>Work</span></h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[400px]">
              {projects.map((project, i) => {
                const isLarge = i === 0 || i === 3; // Make some items span 2 columns
                return (
                  <motion.div 
                    key={project.id}
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.5, delay: (i % 3) * 0.1 }}
                    className={`relative rounded-3xl overflow-hidden group bg-slate-800 ${isLarge ? 'md:col-span-2' : 'md:col-span-1'}`}
                  >
                    {project.imageUrl && (
                      <img src={project.imageUrl} alt={project.title} className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:opacity-30 transition-opacity duration-500" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-[#0f172a]/60 to-transparent" />
                    <div className="absolute inset-0 p-8 flex flex-col justify-end">
                      <h3 className="text-2xl md:text-3xl font-bold text-white mb-3 group-hover:text-indigo-400 transition-colors">{project.title}</h3>
                      <p className="text-slate-300 line-clamp-2 mb-6 max-w-xl">{project.description}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex gap-2 flex-wrap">
                          {(Array.isArray(project.techStack) ? project.techStack : JSON.parse(project.techStack || '[]')).slice(0, 3).map((tech, j) => (
                            <span key={j} className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm text-xs font-bold text-white border border-white/20">
                              {tech}
                            </span>
                          ))}
                        </div>
                        <a href={project.liveUrl || project.githubUrl || '#'} target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                          <ArrowRight size={20} />
                        </a>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </section>

          {/* Skills Grid */}
          <section id="skills">
            <h2 className="text-4xl md:text-6xl font-black text-white tracking-tight mb-12 uppercase">Core<br/><span style={{ color: accentColor }}>Skills</span></h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-10">
              {skills.slice(0, 10).map((skill, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                >
                  <div className="flex justify-between items-end mb-2">
                    <span className="text-lg font-bold text-white flex items-center gap-2">
                      {skill.icon && <span>{skill.icon}</span>}
                      {skill.name}
                    </span>
                    <span className="text-sm font-mono text-slate-400">{skill.level}%</span>
                  </div>
                  <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      whileInView={{ width: `${skill.level}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: 0.2 + (i * 0.1), type: 'spring' }}
                      className="h-full rounded-full relative"
                      style={{ backgroundColor: primaryColor }}
                    >
                      {/* Glow effect */}
                      <div className="absolute top-0 right-0 bottom-0 w-10 bg-white/30 blur-[4px]" />
                    </motion.div>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Experience Timeline */}
          <section id="experience">
            <h2 className="text-4xl md:text-6xl font-black text-white tracking-tight mb-16 uppercase">Work<br/><span style={{ color: primaryColor }}>History</span></h2>
            <div className="space-y-12">
              {experience.map((exp, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="flex flex-col md:flex-row gap-6 md:gap-12 relative"
                >
                  {/* Timeline Line */}
                  {i !== experience.length - 1 && (
                    <div className="hidden md:block absolute left-[11.5rem] top-16 bottom-[-3rem] w-px bg-slate-800" />
                  )}
                  
                  <div className="md:w-40 flex-shrink-0 pt-2">
                    <span className="px-4 py-2 rounded-full bg-slate-800 text-sm font-bold text-slate-300 inline-block border border-slate-700">
                      {exp.duration}
                    </span>
                  </div>
                  
                  <div className="flex-1 bg-slate-800/50 border border-slate-700 p-8 rounded-3xl hover:bg-slate-800 transition-colors">
                    <h3 className="text-2xl font-bold text-white mb-2">{exp.role}</h3>
                    <h4 className="text-lg font-medium mb-6 flex items-center gap-2" style={{ color: primaryColor }}>
                      {exp.company}
                      {exp.current && <span className="text-xs px-2 py-1 bg-indigo-500/20 text-indigo-300 rounded-full border border-indigo-500/30">CURRENT</span>}
                    </h4>
                    <p className="text-slate-400 leading-relaxed text-lg">
                      {exp.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Contact */}
          <section id="contact" className="py-20">
            <div className="bg-gradient-to-br from-indigo-900/40 to-slate-900 rounded-[3rem] p-8 md:p-20 border border-indigo-500/20">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                <div>
                  <h2 className="text-5xl md:text-7xl font-black text-white tracking-tight mb-6 leading-none">
                    READY TO<br/>
                    <span style={{ color: accentColor }}>START?</span>
                  </h2>
                  <p className="text-xl text-slate-300 mb-12 max-w-md">
                    Got a project in mind or just want to say hi? I'm always open to discussing new opportunities.
                  </p>
                  <div className="space-y-6">
                    {profile.email && (
                      <div className="flex items-center gap-4 text-xl text-white font-medium">
                        <div className="w-12 h-12 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400">
                          <Mail size={24} />
                        </div>
                        {profile.email}
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <ContactForm 
                    inputClass="w-full px-6 py-4 bg-slate-900 border border-slate-700 rounded-2xl text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all text-lg"
                    buttonClass="w-full px-8 py-5 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 transition-all hover:opacity-90 active:scale-[0.98]"
                    successClass="p-8 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-center flex flex-col items-center gap-4"
                    primaryColor={primaryColor}
                  />
                </div>
              </div>
            </div>
          </section>

        </div>
      </main>

      <footer className="py-8 text-center text-slate-600 font-medium">
        <p>© {new Date().getFullYear()} {profile.name}. BUILT WITH BOLDNESS.</p>
      </footer>
    </div>
  );
}
