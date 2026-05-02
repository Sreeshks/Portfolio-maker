import { motion } from 'framer-motion';
import { Github, Linkedin, Twitter, Dribbble, Mail, Terminal as TerminalIcon, Cpu, Activity, Zap, ExternalLink } from 'lucide-react';
import ContactForm from '../components/ContactForm';
import { useState, useEffect } from 'react';

const iconMap = {
  github: Github,
  linkedin: Linkedin,
  twitter: Twitter,
  dribbble: Dribbble
};

export default function TemplateCyberpunk({ data }) {
  const { profile, projects, skills, experience, settings } = data;
  const accentGreen = '#00ff41';
  const accentPink = '#ff00ff';

  const [glitchText, setGlitchText] = useState(profile.name);

  useEffect(() => {
    const chars = "!<>-_\\/[]{}—=+*^?#________";
    let interval;
    if (Math.random() > 0.9) {
      interval = setInterval(() => {
        setGlitchText(profile.name.split('').map(char => 
          Math.random() > 0.8 ? chars[Math.floor(Math.random() * chars.length)] : char
        ).join(''));
        setTimeout(() => setGlitchText(profile.name), 100);
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [profile.name]);

  return (
    <div className="min-h-screen bg-black text-[#00ff41] font-mono selection:bg-[#00ff41] selection:text-black relative overflow-x-hidden">
      {/* CRT Scanline Overlay */}
      <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden opacity-[0.03]">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,118,0.06))] bg-[length:100%_2px,3px_100%]" />
      </div>

      {/* Background Grid */}
      <div className="fixed inset-0 z-0 opacity-10" 
        style={{ backgroundImage: 'linear-gradient(#00ff41 1px, transparent 1px), linear-gradient(90deg, #00ff41 1px, transparent 1px)', backgroundSize: '40px 40px' }} 
      />

      <header className="relative z-10 border-b border-[#00ff41]/30 bg-black/80 backdrop-blur-md sticky top-0">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TerminalIcon size={20} className="animate-pulse" />
            <span className="font-bold tracking-tighter">PORTFOLIO_OS [v1.0.4]</span>
          </div>
          <div className="flex gap-6 text-xs uppercase tracking-widest hidden md:flex">
            <a href="#root" className="hover:text-white transition-colors">/home</a>
            <a href="#work" className="hover:text-white transition-colors">/work</a>
            <a href="#skills" className="hover:text-white transition-colors">/skills</a>
            <a href="#contact" className="hover:text-white transition-colors">/contact</a>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-6xl mx-auto px-6 py-20 space-y-32">
        
        {/* Hero Section */}
        <section className="min-h-[60vh] flex flex-col justify-center">
          <motion.div 
            initial={{ x: -50, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
            className="border-l-4 border-[#00ff41] pl-8 py-4"
          >
            <p className="text-xs mb-2 text-[#ff00ff] uppercase tracking-[0.4em] font-bold">SYSTEM_USER: INITIALIZED</p>
            <h1 className="text-5xl md:text-8xl font-black mb-6 uppercase tracking-tighter">
              {glitchText}
            </h1>
            <h2 className="text-xl md:text-3xl font-bold mb-8 flex items-center gap-3">
              <span className="bg-[#00ff41] text-black px-2">{profile.title}</span>
              <span className="animate-ping w-2 h-2 bg-[#ff00ff] rounded-full" />
            </h2>
            <p className="text-lg text-[#00ff41]/80 max-w-2xl leading-relaxed mb-10 border border-[#00ff41]/20 p-6 bg-[#00ff41]/5">
              {profile.bio}
            </p>
            <div className="flex gap-4">
              {profile.socialLinks.map((link, i) => {
                const Icon = iconMap[link.platform.toLowerCase()] || Cpu;
                return (
                  <a key={i} href={link.url} target="_blank" rel="noopener noreferrer" className="p-3 border border-[#00ff41]/30 hover:bg-[#00ff41] hover:text-black transition-all">
                    <Icon size={20} />
                  </a>
                );
              })}
            </div>
          </motion.div>
        </section>

        {/* Work / Projects */}
        <section id="work">
          <div className="flex items-center gap-4 mb-12">
            <h2 className="text-3xl font-black uppercase italic tracking-tighter flex items-center gap-3">
              <Cpu className="text-[#ff00ff]" /> EXECUTING_PROJECTS
            </h2>
            <div className="h-px bg-[#00ff41]/30 flex-1" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {projects.map((project, i) => (
              <motion.div 
                key={project.id}
                initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
                className="group border border-[#00ff41]/30 bg-[#00ff41]/5 hover:border-[#00ff41] transition-all relative overflow-hidden"
              >
                {/* Terminal Header */}
                <div className="bg-[#00ff41]/20 border-b border-[#00ff41]/30 px-4 py-2 flex items-center justify-between">
                  <div className="flex gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-[#ff00ff]" />
                    <div className="w-2 h-2 rounded-full bg-[#00ff41]" />
                    <div className="w-2 h-2 rounded-full bg-blue-500" />
                  </div>
                  <span className="text-[10px] opacity-50 uppercase">{project.title.replace(/\s/g, '_')}.exe</span>
                </div>
                
                <div className="p-6">
                  {project.imageUrl && (
                    <div className="aspect-video mb-6 grayscale group-hover:grayscale-0 transition-all border border-[#00ff41]/20 relative overflow-hidden">
                      <img src={project.imageUrl} alt="" className="w-full h-full object-cover opacity-50 group-hover:opacity-100" />
                      <div className="absolute inset-0 bg-[#00ff41]/10 mix-blend-color" />
                    </div>
                  )}
                  <h3 className="text-2xl font-bold mb-4 text-white uppercase group-hover:text-[#00ff41] transition-colors">{project.title}</h3>
                  <p className="text-sm opacity-70 mb-6 leading-relaxed">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {(Array.isArray(project.techStack) ? project.techStack : JSON.parse(project.techStack || '[]')).map((tech, j) => (
                      <span key={j} className="text-[10px] px-2 py-1 border border-[#00ff41]/30 uppercase font-bold tracking-widest">{tech}</span>
                    ))}
                  </div>
                  <a href={project.liveUrl || '#'} className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest p-2 bg-[#00ff41] text-black hover:bg-white transition-colors">
                    EXECUTE_LINK <Zap size={14} />
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Skills - Terminal Bars */}
        <section id="skills">
          <div className="flex items-center gap-4 mb-12">
            <h2 className="text-3xl font-black uppercase italic tracking-tighter flex items-center gap-3">
              <Activity className="text-[#ff00ff]" /> CORE_MODULES
            </h2>
            <div className="h-px bg-[#00ff41]/30 flex-1" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-8 p-8 border border-[#00ff41]/20 bg-black/50">
            {skills.map((skill, i) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between text-xs font-bold uppercase">
                  <span>{skill.name}</span>
                  <span>{skill.level}%</span>
                </div>
                <div className="h-4 border border-[#00ff41]/30 p-[2px]">
                  <motion.div 
                    initial={{ width: 0 }}
                    whileInView={{ width: `${skill.level}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="h-full bg-[#00ff41] relative"
                  >
                    <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.4),transparent)] animate-shimmer" style={{ backgroundSize: '200% 100%' }} />
                  </motion.div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Experience - CLI Output style */}
        <section id="history">
          <div className="flex items-center gap-4 mb-12">
            <h2 className="text-3xl font-black uppercase italic tracking-tighter flex items-center gap-3">
              <TerminalIcon className="text-[#ff00ff]" /> LOG_HISTORY
            </h2>
            <div className="h-px bg-[#00ff41]/30 flex-1" />
          </div>

          <div className="space-y-6">
            {experience.map((exp, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }}
                className="p-6 border border-[#00ff41]/10 bg-black hover:border-[#00ff41]/40 transition-colors group"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-white group-hover:text-[#00ff41] transition-colors">{exp.role}</h3>
                    <p className="text-[#ff00ff] text-xs font-bold uppercase">{exp.company}</p>
                  </div>
                  <span className="text-xs opacity-50 font-bold mt-2 md:mt-0">STAMP: {exp.duration}</span>
                </div>
                <p className="text-sm opacity-70 leading-relaxed max-w-3xl">
                  {`> `}{exp.description}
                </p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Contact - Secure Protocol */}
        <section id="contact">
          <div className="border-2 border-[#ff00ff]/30 p-8 md:p-16 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 border-r-2 border-t-2 border-[#ff00ff] -mr-1 -mt-1" />
            <div className="absolute bottom-0 left-0 w-32 h-32 border-l-2 border-b-2 border-[#ff00ff] -ml-1 -mb-1" />
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 relative z-10">
              <div>
                <h2 className="text-5xl font-black uppercase italic tracking-tighter mb-6 leading-none">
                  SECURE<br/><span className="text-[#ff00ff]">COMMUNICATION</span>
                </h2>
                <p className="text-sm opacity-70 mb-12 max-w-md">
                  Establish a secure connection for project inquiries or collaboration requests. Priority processing enabled.
                </p>
                <div className="space-y-4 font-bold text-xs uppercase tracking-widest">
                  <div className="flex items-center gap-4">
                    <span className="text-[#ff00ff]">ADDR:</span> {profile.location}
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-[#ff00ff]">MAIL:</span> {profile.email}
                  </div>
                </div>
              </div>
              <div>
                <ContactForm 
                  inputClass="w-full px-5 py-4 bg-black border border-[#00ff41]/30 text-[#00ff41] focus:outline-none focus:border-[#ff00ff] transition-all text-sm mb-4 placeholder:opacity-30"
                  buttonClass="w-full px-6 py-4 bg-[#00ff41] text-black font-black text-sm uppercase tracking-widest hover:bg-[#ff00ff] hover:text-white transition-all"
                  successClass="p-10 border-2 border-[#00ff41] text-center"
                  primaryColor="#00ff41"
                />
              </div>
            </div>
          </div>
        </section>

      </main>

      <footer className="relative z-10 py-12 text-center border-t border-[#00ff41]/20">
        <p className="text-[10px] uppercase font-bold tracking-[0.5em] opacity-30">TERMINATED_SESSION__{new Date().getFullYear()}</p>
      </footer>
    </div>
  );
}
