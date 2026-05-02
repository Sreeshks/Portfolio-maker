import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Github, Linkedin, Twitter, Dribbble, Mail, ExternalLink, Globe, Layers, Navigation, Box } from 'lucide-react';
import ContactForm from '../components/ContactForm';
import { useState, useEffect, useRef } from 'react';

const iconMap = {
  github: Github,
  linkedin: Linkedin,
  twitter: Twitter,
  dribbble: Dribbble
};

// 3D Perspective Card
function SpatialCard({ children, className }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 20 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["15deg", "-15deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-15deg", "15deg"]);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateY, rotateX, transformStyle: "preserve-3d" }}
      className={`relative rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 p-8 transition-all hover:border-white/20 hover:shadow-[0_0_50px_rgba(255,255,255,0.1)] ${className}`}
    >
      <div style={{ transform: "translateZ(50px)" }}>{children}</div>
    </motion.div>
  );
}

export default function TemplateSpatial({ data }) {
  const { profile, projects, skills, experience, settings } = data;
  const primaryColor = settings.primaryColor || '#a855f7'; // Purple

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-purple-500/30 overflow-x-hidden relative font-sans">
      
      {/* Background Depth Orbs */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[10%] left-[10%] w-[40rem] h-[40rem] bg-purple-600/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[20%] right-[10%] w-[35rem] h-[35rem] bg-blue-600/10 rounded-full blur-[120px] animate-pulse delay-700" />
        <div className="absolute top-[40%] right-[30%] w-[30rem] h-[30rem] bg-teal-600/5 rounded-full blur-[120px] animate-pulse delay-1000" />
      </div>

      {/* Constellation Background */}
      <div className="fixed inset-0 z-0 opacity-20" 
        style={{ backgroundImage: 'radial-gradient(circle, #ffffff22 1px, transparent 1px)', backgroundSize: '60px 60px' }} 
      />

      <nav className="fixed top-0 left-0 right-0 z-50 px-8 py-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
           <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center shadow-lg shadow-purple-500/20">
               <Globe size={20} />
             </div>
             <span className="font-bold tracking-tighter text-xl uppercase italic">Spatial_UI</span>
           </div>
           <div className="hidden md:flex gap-10 text-[10px] uppercase font-black tracking-[0.2em] text-white/50">
             <a href="#work" className="hover:text-white transition-colors">Orbit</a>
             <a href="#skills" className="hover:text-white transition-colors">Core</a>
             <a href="#contact" className="hover:text-white transition-colors">Signal</a>
           </div>
        </div>
      </nav>

      <main className="relative z-10 pt-40 pb-20 space-y-40">
        
        {/* Hero */}
        <section className="px-8 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <motion.div initial={{ x: -50, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
              <div className="inline-block px-4 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-bold uppercase tracking-widest text-purple-400 mb-8">
                Welcome to the Space
              </div>
              <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-none mb-8">
                {profile.name.split(' ')[0]}<br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-blue-400 to-teal-400">{profile.name.split(' ')[1]}</span>
              </h1>
              <p className="text-xl text-white/60 leading-relaxed max-w-xl mb-12">
                {profile.bio}
              </p>
              <div className="flex gap-4">
                {profile.socialLinks.map((link, i) => {
                  const Icon = iconMap[link.platform.toLowerCase()] || Navigation;
                  return (
                    <a key={i} href={link.url} target="_blank" rel="noopener noreferrer" className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all hover:-translate-y-2">
                      <Icon size={24} />
                    </a>
                  );
                })}
              </div>
            </motion.div>
            
            <div className="relative">
               <SpatialCard className="aspect-square flex items-center justify-center overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-blue-600/20" />
                  {profile.avatarUrl ? (
                    <img src={profile.avatarUrl} alt="" className="w-4/5 h-4/5 object-cover rounded-2xl shadow-2xl" />
                  ) : (
                    <Box size={120} className="text-white/20 animate-spin-slow" />
                  )}
               </SpatialCard>
               {/* Floating elements */}
               <motion.div animate={{ y: [0, -20, 0] }} transition={{ repeat: Infinity, duration: 4 }} className="absolute -top-10 -right-10 w-24 h-24 bg-teal-500/20 rounded-3xl backdrop-blur-xl border border-white/10 flex items-center justify-center">
                 <Layers size={32} className="text-teal-400" />
               </motion.div>
            </div>
          </div>
        </section>

        {/* Diagonal Section Splitter */}
        <section id="work" className="relative py-40">
          <div className="absolute inset-0 bg-white/5 -skew-y-3 z-0" />
          <div className="relative z-10 px-8 max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-20">
              <h2 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter">Project_Orbit</h2>
              <span className="text-xs uppercase tracking-[0.4em] font-bold text-white/40 mb-4">Deep Space Exploration</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projects.map((project, i) => (
                <SpatialCard key={project.id} className="min-h-[450px] flex flex-col">
                  {project.imageUrl && (
                    <div className="aspect-[4/3] rounded-2xl overflow-hidden mb-8 border border-white/10 group relative">
                      <img src={project.imageUrl} alt="" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                      <div className="absolute inset-0 bg-purple-500/20 mix-blend-overlay group-hover:opacity-0 transition-opacity" />
                    </div>
                  )}
                  <h3 className="text-2xl font-bold mb-4">{project.title}</h3>
                  <p className="text-white/50 text-sm leading-relaxed mb-8 line-clamp-3">{project.description}</p>
                  <div className="mt-auto pt-6 border-t border-white/10 flex items-center justify-between">
                    <div className="flex gap-2">
                       {(Array.isArray(project.techStack) ? project.techStack : JSON.parse(project.techStack || '[]')).slice(0, 3).map((tech, j) => (
                         <span key={j} className="text-[10px] font-bold uppercase tracking-widest text-teal-400">{tech}</span>
                       ))}
                    </div>
                    <a href={project.liveUrl || '#'} className="p-2 rounded-full bg-white text-black hover:scale-110 transition-transform">
                      <ExternalLink size={16} />
                    </a>
                  </div>
                </SpatialCard>
              ))}
            </div>
          </div>
        </section>

        {/* Skills - Radial Rings */}
        <section id="skills" className="px-8 max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter mb-20 text-center">Core_Engines</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
            {skills.map((skill, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
                className="flex flex-col items-center group"
              >
                <div className="relative w-32 h-32 flex items-center justify-center mb-6">
                  {/* Outer Ring */}
                  <svg className="absolute inset-0 w-full h-full -rotate-90">
                    <circle cx="64" cy="64" r="60" stroke="rgba(255,255,255,0.05)" strokeWidth="8" fill="none" />
                    <motion.circle 
                      cx="64" cy="64" r="60" stroke={primaryColor} strokeWidth="8" fill="none"
                      initial={{ strokeDasharray: "0 1000" }}
                      whileInView={{ strokeDasharray: `${(skill.level / 100) * 377} 1000` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="text-xl font-black tracking-tighter group-hover:scale-110 transition-transform">
                    {skill.level}<span className="text-[10px] opacity-50">%</span>
                  </div>
                </div>
                <h4 className="text-sm uppercase font-black tracking-[0.2em]">{skill.name}</h4>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Contact Signal */}
        <section id="contact" className="px-8 max-w-5xl mx-auto">
          <SpatialCard className="p-12 md:p-20 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-[50%] h-full bg-gradient-to-l from-purple-500/10 to-transparent pointer-events-none" />
            
            <div className="relative z-10 text-center max-w-2xl mx-auto">
              <h2 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter mb-8">Establish_Link</h2>
              <p className="text-white/50 text-xl mb-12">
                Scanning for new collaborations. Transmit your project data below.
              </p>
              <ContactForm 
                inputClass="w-full px-8 py-5 bg-white/5 border border-white/10 rounded-3xl text-white focus:outline-none focus:border-purple-500/50 transition-all text-sm mb-6"
                buttonClass="w-full px-8 py-5 rounded-3xl bg-gradient-to-r from-purple-500 to-blue-600 text-white font-black text-sm uppercase tracking-widest hover:shadow-[0_0_30px_rgba(168,85,247,0.4)] transition-all"
                successClass="p-20 text-center text-teal-400 font-black italic text-3xl"
                primaryColor={primaryColor}
              />
            </div>
          </SpatialCard>
        </section>

      </main>

      <footer className="py-20 text-center border-t border-white/5">
        <p className="text-[10px] uppercase font-black tracking-[1em] text-white/20">Deep_Space_Node__{new Date().getFullYear()}</p>
      </footer>
    </div>
  );
}
