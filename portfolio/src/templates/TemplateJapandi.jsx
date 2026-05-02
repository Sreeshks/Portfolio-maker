import { motion } from 'framer-motion';
import { Github, Linkedin, Twitter, Mail, ArrowRight, Leaf, Circle } from 'lucide-react';
import ContactForm from '../components/ContactForm';

const iconMap = {
  github: Github,
  linkedin: Linkedin,
  twitter: Twitter
};

export default function TemplateJapandi({ data }) {
  const { profile, projects, skills, experience, settings } = data;
  const accentColor = settings.accentColor || '#d4a373'; // Terracotta

  return (
    <div className="min-h-screen bg-[#faf7f2] text-[#4a3f35] selection:bg-[#d4a373]/20 relative font-sans">
      {/* Washi Paper Texture Overlay */}
      <div className="fixed inset-0 pointer-events-none z-50 opacity-[0.03] mix-blend-multiply"
        style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/natural-paper.png")' }}
      />

      {/* Decorative Ink Wash Blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[10%] right-[-5%] w-[40rem] h-[40rem] bg-sage-200/20 rounded-full blur-[100px] mix-blend-multiply" style={{ backgroundColor: '#e2e8ce33' }} />
        <div className="absolute bottom-[5%] left-[-5%] w-[35rem] h-[35rem] bg-terracotta-100/20 rounded-full blur-[100px] mix-blend-multiply" style={{ backgroundColor: '#f2e1d933' }} />
      </div>

      <nav className="fixed top-0 left-0 right-0 z-40 bg-[#faf7f2]/80 backdrop-blur-sm border-b border-[#4a3f35]/5">
        <div className="max-w-6xl mx-auto px-8 h-20 flex items-center justify-between">
          <a href="#" className="text-xl font-light tracking-[0.2em] uppercase">
            {profile.name.split(' ')[0]}<span className="font-bold">.</span>
          </a>
          <div className="flex gap-12 text-[10px] uppercase tracking-[0.3em] font-medium opacity-60">
            <a href="#projects" className="hover:opacity-100 transition-opacity">Work</a>
            <a href="#about" className="hover:opacity-100 transition-opacity">About</a>
            <a href="#contact" className="hover:opacity-100 transition-opacity">Contact</a>
          </div>
        </div>
      </nav>

      <main className="relative z-10 max-w-6xl mx-auto px-8 pt-48 pb-32 space-y-48">

        {/* Hero Section */}
        <section className="min-h-[60vh] flex flex-col justify-center max-w-4xl">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}>
            <div className="flex items-center gap-4 mb-8">
              <div className="h-px bg-[#4a3f35]/20 w-12" />
              <span className="text-xs uppercase tracking-[0.4em] italic font-serif" style={{ color: accentColor }}>{profile.title}</span>
            </div>
            <h1 className="text-6xl md:text-8xl font-light tracking-tight mb-12 leading-[1.1]" style={{ fontFamily: '"Playfair Display", serif' }}>
              Creating space for <span className="italic font-normal">purposeful</span> digital experiences.
            </h1>
            <p className="text-xl leading-relaxed text-[#6b5e52] mb-12 max-w-2xl font-light">
              {profile.bio}
            </p>
            <div className="flex items-center gap-10">
              <a href="#projects" className="group flex items-center gap-4 text-xs uppercase tracking-[0.4em] font-bold">
                View Works <ArrowRight size={16} className="transition-transform group-hover:translate-x-2" />
              </a>
              <div className="flex gap-6">
                {profile.socialLinks.map((link, i) => {
                  const Icon = iconMap[link.platform.toLowerCase()] || Circle;
                  return (
                    <a key={i} href={link.url} target="_blank" rel="noopener noreferrer" className="opacity-40 hover:opacity-100 transition-opacity">
                      <Icon size={18} />
                    </a>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </section>

        {/* Masonry-inspired Project Grid */}
        <section id="projects">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-24">
            <div className="md:pt-24">
              <h2 className="text-xs uppercase tracking-[0.5em] font-bold mb-12 opacity-30">Selected Projects</h2>
              {projects.filter((_, i) => i % 2 === 0).map((project, i) => (
                <ProjectCard key={project.id} project={project} accentColor={accentColor} />
              ))}
            </div>
            <div>
              {projects.filter((_, i) => i % 2 !== 0).map((project, i) => (
                <ProjectCard key={project.id} project={project} accentColor={accentColor} />
              ))}
              {/* Decorative empty space or leaf icon */}
              <div className="aspect-square flex items-center justify-center opacity-10">
                <Leaf size={120} strokeWidth={1} />
              </div>
            </div>
          </div>
        </section>

        {/* Skills - Ink Stroke Bars */}
        <section className="grid grid-cols-1 md:grid-cols-12 gap-12 border-t border-[#4a3f35]/10 pt-24">
          <div className="md:col-span-4">
            <h2 className="text-3xl font-light italic mb-6" style={{ fontFamily: '"Playfair Display", serif' }}>Expertise</h2>
            <p className="text-sm leading-relaxed opacity-60 max-w-xs font-light">
              A focus on craftsmanship, technical precision, and the quiet beauty of functional design.
            </p>
          </div>
          <div className="md:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-x-16 gap-y-10">
            {skills.map((skill, i) => (
              <div key={i} className="space-y-3">
                <div className="flex justify-between text-xs uppercase tracking-widest font-medium">
                  <span>{skill.name}</span>
                  <span className="opacity-40 italic">{skill.level}%</span>
                </div>
                <div className="h-px bg-[#4a3f35]/10 w-full relative">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${skill.level}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 2, ease: [0.22, 1, 0.36, 1] }}
                    className="h-[2px] absolute top-[-0.5px]"
                    style={{ backgroundColor: accentColor }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Experience - Simple Timeline */}
        <section id="about" className="max-w-4xl">
          <h2 className="text-xs uppercase tracking-[0.5em] font-bold mb-20 opacity-30">Journey</h2>
          <div className="space-y-16">
            {experience.map((exp, i) => (
              <div key={i} className="flex flex-col md:flex-row md:items-baseline gap-4 md:gap-16 border-b border-[#4a3f35]/5 pb-12">
                <div className="w-40 text-xs uppercase tracking-widest font-mono opacity-40">{exp.duration}</div>
                <div className="flex-1">
                  <h3 className="text-2xl font-light mb-2">{exp.role}</h3>
                  <h4 className="text-sm font-bold uppercase tracking-widest mb-6 opacity-60" style={{ color: accentColor }}>{exp.company}</h4>
                  <p className="text-base leading-relaxed opacity-70 font-light">{exp.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Contact - Minimalist Form */}
        <section id="contact" className="bg-[#f0ede6] p-12 md:p-24 rounded-sm border border-[#4a3f35]/5 text-center">
          <h2 className="text-4xl md:text-6xl font-light mb-8" style={{ fontFamily: '"Playfair Display", serif' }}>Let's work together.</h2>
          <p className="text-lg opacity-60 mb-16 max-w-xl mx-auto font-light">
            Currently accepting new project inquiries for {new Date().getFullYear()}. I'd love to hear about what you're building.
          </p>
          <div className="max-w-xl mx-auto text-left">
            <ContactForm
              inputClass="w-full px-0 py-5 bg-transparent border-0 border-b border-[#4a3f35]/20 text-[#4a3f35] focus:outline-none focus:border-[#d4a373] transition-all text-lg placeholder:opacity-30 mb-6 font-light"
              buttonClass="px-12 py-5 bg-[#4a3f35] text-white text-[10px] uppercase tracking-[0.4em] font-bold hover:bg-[#d4a373] transition-all w-full md:w-auto"
              successClass="p-20 text-center italic text-xl border border-[#4a3f35]/10"
              primaryColor="#4a3f35"
            />
          </div>
        </section>

      </main>

      <footer className="py-24 px-8 border-t border-[#4a3f35]/5">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 opacity-40 text-[10px] uppercase tracking-[0.3em] font-bold">
          <p>© {new Date().getFullYear()} {profile.name}</p>
          <div className="flex gap-12">
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
            <a href="#">Journal</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

function ProjectCard({ project, accentColor }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
      transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
      className="mb-24 group"
    >
      <div className="aspect-[4/5] bg-[#e9e4d9] overflow-hidden mb-8 relative">
        {project.imageUrl && (
          <img src={project.imageUrl} alt="" className="w-full h-full object-cover grayscale transition-all duration-1000 group-hover:grayscale-0 group-hover:scale-105" />
        )}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors" />
      </div>
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-bold uppercase tracking-widest opacity-40">01 / Case Study</span>
          <div className="h-px bg-[#4a3f35]/10 flex-1" />
        </div>
        <h3 className="text-3xl font-light italic" style={{ fontFamily: '"Playfair Display", serif' }}>{project.title}</h3>
        <p className="text-sm opacity-60 leading-relaxed font-light line-clamp-2 max-w-sm mb-6">{project.description}</p>
        <a href={project.liveUrl || '#'} className="inline-flex items-center gap-3 text-[10px] uppercase tracking-[0.3em] font-bold border-b border-transparent hover:border-black transition-all pb-1">
          Discover <ArrowRight size={12} />
        </a>
      </div>
    </motion.div>
  );
}
