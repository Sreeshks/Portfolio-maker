import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Github, Linkedin, Twitter, Dribbble, Mail, Code, Terminal, Database, Sparkles } from 'lucide-react';
import ContactForm from '../components/ContactForm';
import { useState, useEffect, useRef } from 'react';

const iconMap = {
  github: Github,
  linkedin: Linkedin,
  twitter: Twitter,
  dribbble: Dribbble
};

// 3D Tilt Card Component
function TiltCard({ children, className }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 20 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

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
      style={{
        rotateY,
        rotateX,
        transformStyle: "preserve-3d",
      }}
      className={`relative rounded-2xl glass transition-all duration-300 hover:border-white/40 hover:shadow-[0_0_30px_rgba(255,255,255,0.1)] ${className}`}
    >
      <div style={{ transform: "translateZ(30px)" }} className="h-full">
        {children}
      </div>
    </motion.div>
  );
}

// Particle Background Component
function ParticleBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let particles = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', resize);
    resize();

    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 1.5 + 0.5;
        this.speedX = Math.random() * 0.5 - 0.25;
        this.speedY = Math.random() * 0.5 - 0.25;
        this.opacity = Math.random() * 0.5 + 0.2;
      }
      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
        if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
      }
      draw() {
        ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    const init = () => {
      particles = [];
      for (let i = 0; i < 100; i++) {
        particles.push(new Particle());
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.update();
        p.draw();
      });
      animationFrameId = requestAnimationFrame(animate);
    };

    init();
    animate();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 z-0 pointer-events-none opacity-40" />;
}

// Typewriter Component
function TypewriterText({ text }) {
  const [displayText, setDisplayText] = useState('');

  useEffect(() => {
    let i = 0;
    const timer = setInterval(() => {
      if (i < text.length) {
        setDisplayText((prev) => prev + text.charAt(i));
        i++;
      } else {
        clearInterval(timer);
      }
    }, 50);
    return () => clearInterval(timer);
  }, [text]);

  return <span>{displayText}<span className="animate-pulse">|</span></span>;
}

export default function TemplateDark({ data }) {
  const { profile, projects, skills, experience, testimonials, settings } = data;
  const accentColor = settings.accentColor || '#00ff88';

  const [cursorPos, setCursorPos] = useState({ x: -100, y: -100 });

  useEffect(() => {
    const moveCursor = (e) => {
      setCursorPos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', moveCursor);
    return () => window.removeEventListener('mousemove', moveCursor);
  }, []);

  return (
    <div className="min-h-screen bg-black text-gray-300 selection:bg-white/20 overflow-hidden relative">
      <ParticleBackground />

      {/* Custom Magnetic Cursor Glow */}
      <div 
        className="fixed w-64 h-64 rounded-full pointer-events-none z-50 mix-blend-screen blur-[80px] opacity-60 transition-transform duration-75 ease-out"
        style={{
          background: accentColor,
          transform: `translate(${cursorPos.x - 128}px, ${cursorPos.y - 128}px)`
        }}
      />

      <nav className="fixed top-0 left-0 right-0 z-40 bg-black/50 backdrop-blur-md border-b border-white/5">
        <div className="max-w-6xl mx-auto px-6 h-24 flex items-center justify-between">
          <a href="#" className="text-2xl font-bold tracking-widest text-white">
            {profile.name}
          </a>
          <div className="hidden md:flex gap-8 text-sm uppercase tracking-widest font-semibold text-gray-400">
            {['Work', 'Skills', 'Experience', 'Contact'].map(item => (
              <a key={item} href={`#${item.toLowerCase()}`} className="hover:text-white transition-colors relative group">
                {item}
                <span className="absolute -bottom-2 left-0 w-0 h-[2px] bg-white transition-all group-hover:w-full" />
              </a>
            ))}
          </div>
        </div>
      </nav>

      <main className="relative z-10 max-w-6xl mx-auto px-6 pt-40 pb-32 space-y-40">
        
        {/* Hero */}
        <section className="min-h-[70vh] flex flex-col justify-center">
          <div className="max-w-4xl">
            <h2 className="text-sm md:text-base uppercase tracking-[0.3em] mb-6" style={{ color: accentColor }}>
              <TypewriterText text={profile.title} />
            </h2>
            <h1 className="text-6xl md:text-8xl font-bold text-white mb-8 tracking-tighter leading-tight">
              Crafting Digital <br/>
              <span className="italic font-light text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500">Experiences.</span>
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl leading-relaxed mb-12">
              {profile.bio}
            </p>
            <div className="flex gap-6">
              {profile.socialLinks.map((link, i) => {
                const Icon = iconMap[link.platform.toLowerCase()] || ExternalLink;
                return (
                  <a key={i} href={link.url} target="_blank" rel="noopener noreferrer" className="p-3 rounded-xl glass hover:bg-white/10 hover:text-white transition-all">
                    <Icon size={20} />
                  </a>
                );
              })}
            </div>
          </div>
        </section>

        {/* Projects */}
        <section id="work">
          <div className="flex items-center gap-4 mb-16">
            <div className="h-px bg-white/20 flex-1" />
            <h2 className="text-3xl font-light tracking-widest uppercase text-white">Selected Work</h2>
            <div className="h-px bg-white/20 w-12" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {projects.map((project, i) => (
              <TiltCard key={project.id} className="group p-6">
                <div className="aspect-video mb-6 overflow-hidden rounded-xl bg-white/5 border border-white/5 relative">
                  {project.imageUrl && (
                    <img src={project.imageUrl} alt={project.title} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity duration-500" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                    <div className="flex gap-2">
                      {(Array.isArray(project.techStack) ? project.techStack : JSON.parse(project.techStack || '[]')).slice(0, 3).map((tech, j) => (
                        <span key={j} className="px-2 py-1 rounded bg-black/50 backdrop-blur-md text-[10px] uppercase tracking-wider border border-white/10 text-gray-300">
                          {tech}
                        </span>
                      ))}
                    </div>
                    {project.liveUrl && (
                      <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-white text-black hover:scale-110 transition-transform">
                        <ExternalLink size={14} />
                      </a>
                    )}
                  </div>
                </div>
                <h3 className="text-2xl font-semibold text-white mb-2">{project.title}</h3>
                <p className="text-gray-400 text-sm line-clamp-3 leading-relaxed">{project.description}</p>
              </TiltCard>
            ))}
          </div>
        </section>

        {/* Skills */}
        <section id="skills">
          <div className="flex items-center gap-4 mb-16">
            <h2 className="text-3xl font-light tracking-widest uppercase text-white">Capabilities</h2>
            <div className="h-px bg-white/20 flex-1" />
          </div>

          <div className="flex flex-wrap gap-4">
            {skills.map((skill, i) => (
              <div 
                key={i} 
                className="px-6 py-4 rounded-xl glass hover:bg-white/10 hover:border-white/30 hover:shadow-[0_0_20px_rgba(255,255,255,0.05)] transition-all flex items-center gap-3 group cursor-default"
              >
                {skill.icon ? <span className="text-xl group-hover:scale-110 transition-transform">{skill.icon}</span> : <Sparkles size={16} className="text-gray-500" />}
                <span className="font-medium text-gray-200 group-hover:text-white transition-colors">{skill.name}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Experience */}
        <section id="experience">
           <div className="flex items-center gap-4 mb-16">
            <div className="h-px bg-white/20 w-12" />
            <h2 className="text-3xl font-light tracking-widest uppercase text-white">Experience</h2>
            <div className="h-px bg-white/20 flex-1" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {experience.map((exp, i) => (
              <div key={i} className="p-8 rounded-2xl glass hover:bg-white/[0.08] transition-colors flex flex-col h-full border-t border-t-white/20">
                <div className="mb-auto">
                  <span className="text-xs font-mono text-gray-500 mb-4 block">{exp.duration}</span>
                  <h3 className="text-xl font-bold text-white mb-1">{exp.role}</h3>
                  <h4 className="text-sm tracking-widest uppercase mb-6" style={{ color: accentColor }}>{exp.company}</h4>
                </div>
                <p className="text-gray-400 text-sm leading-relaxed">{exp.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Contact */}
        <section id="contact" className="relative">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white/5 rounded-3xl border border-white/10 pointer-events-none" />
          <div className="p-10 md:p-20 flex flex-col items-center text-center">
            <h2 className="text-5xl md:text-7xl font-bold text-white tracking-tighter mb-6">Let's Connect.</h2>
            <p className="text-xl text-gray-400 mb-12 max-w-lg">
              Have a project in mind? Let's build something extraordinary together.
            </p>
            <div className="w-full max-w-md text-left">
              <ContactForm 
                inputClass="w-full px-5 py-4 bg-black/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-white/40 focus:bg-white/5 transition-all text-sm backdrop-blur-md"
                buttonClass="w-full px-6 py-4 rounded-xl font-bold text-sm tracking-widest uppercase flex items-center justify-center gap-2 transition-all hover:shadow-[0_0_20px_rgba(255,255,255,0.2)]"
                successClass="p-8 rounded-xl bg-white/5 border border-white/10 text-white text-center flex flex-col items-center gap-4 backdrop-blur-md"
                primaryColor="#ffffff"
              />
            </div>
          </div>
        </section>

      </main>

      <footer className="relative z-10 border-t border-white/10 bg-black/80 backdrop-blur-md py-8">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500 font-mono">© {new Date().getFullYear()} {profile.name}.</p>
          <div className="flex items-center gap-2 text-sm text-gray-500 font-mono">
            <span>Designed in the</span>
            <span style={{ color: accentColor }}>Dark</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
