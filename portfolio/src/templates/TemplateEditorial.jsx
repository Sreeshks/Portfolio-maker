import { motion } from 'framer-motion';
import { Github, Linkedin, Twitter, Mail, ArrowRight, Instagram } from 'lucide-react';
import ContactForm from '../components/ContactForm';

const iconMap = {
  github: Github,
  linkedin: Linkedin,
  twitter: Twitter,
  instagram: Instagram
};

export default function TemplateEditorial({ data }) {
  const { profile, projects, skills, experience, settings } = data;
  const primaryColor = settings.primaryColor || '#1a1a1a';
  const accentColor = settings.accentColor || '#c5a059'; // Gold

  return (
    <div className="min-h-screen bg-[#f9f7f2] text-[#1a1a1a] font-serif selection:bg-[#c5a059]/30">
      {/* Editorial Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-8 md:px-12 pointer-events-none">
        <div className="max-w-screen-2xl mx-auto flex items-center justify-between pointer-events-auto">
          <a href="#" className="text-3xl font-bold tracking-tighter" style={{ fontFamily: 'Playfair Display, serif' }}>
            {profile.name.split(' ')[0]}<span className="italic" style={{ color: accentColor }}>{profile.name.split(' ')[1]}</span>
          </a>
          <div className="flex gap-10 text-[10px] uppercase tracking-[0.3em] font-bold hidden lg:flex">
            <a href="#projects" className="hover:opacity-50 transition-opacity">Portfolio</a>
            <a href="#about" className="hover:opacity-50 transition-opacity">Biography</a>
            <a href="#contact" className="hover:opacity-50 transition-opacity">Enquire</a>
          </div>
        </div>
      </nav>

      <main>
        {/* Cover / Hero Section */}
        <section className="min-h-screen flex flex-col justify-center px-6 md:px-12 lg:px-24 pt-20 border-b border-black/5">
          <div className="max-w-screen-2xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:items-end">
            <div className="lg:col-span-8">
              <motion.h2 
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                className="text-xs uppercase tracking-[0.5em] font-bold mb-6"
                style={{ color: accentColor }}
              >
                Vol. {new Date().getFullYear()} — Editorial Issue
              </motion.h2>
              <motion.h1 
                initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                className="text-7xl md:text-9xl lg:text-[12rem] font-bold leading-[0.85] tracking-tighter mb-12"
                style={{ fontFamily: 'Playfair Display, serif' }}
              >
                {profile.name}
              </motion.h1>
            </div>
            <div className="lg:col-span-4 pb-4">
              <motion.p 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5, duration: 1 }}
                className="text-xl md:text-2xl italic leading-relaxed text-slate-700 max-w-sm"
              >
                "{profile.bio}"
              </motion.p>
            </div>
          </div>
        </section>

        {/* Introduction / About Asymmetric Column */}
        <section id="about" className="py-32 px-6 md:px-12 lg:px-24">
          <div className="max-w-screen-2xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-24">
            <div className="md:col-span-5 md:sticky top-32 h-fit">
              <h2 className="text-xs uppercase tracking-[0.5em] font-bold mb-8 opacity-40">Creative Director</h2>
              <div className="aspect-[3/4] bg-slate-200 overflow-hidden relative grayscale hover:grayscale-0 transition-all duration-1000">
                {profile.avatarUrl ? (
                  <img src={profile.avatarUrl} alt="" className="w-full h-full object-cover scale-110 hover:scale-100 transition-transform duration-1000" />
                ) : (
                  <div className="w-full h-full bg-[#1a1a1a]" />
                )}
                <div className="absolute inset-0 border-[24px] border-[#f9f7f2]" />
              </div>
            </div>
            <div className="md:col-span-7 pt-12 md:pt-48">
              <h3 className="text-4xl md:text-6xl font-bold mb-12 leading-tight" style={{ fontFamily: 'Playfair Display, serif' }}>
                Refining the <span className="italic">Intersection</span> of Design & Technology
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-lg leading-relaxed text-slate-700">
                <p>
                  Specializing in {profile.title}, my approach is rooted in minimalist aesthetics and high-performance engineering. I believe that every digital experience should be as considered as a luxury print publication.
                </p>
                <p>
                  Throughout my career, I have focused on creating visual narratives that speak to the quality of the brands I partner with.
                </p>
              </div>
              
              <div className="mt-24">
                <h4 className="text-[10px] uppercase tracking-[0.5em] font-bold mb-10 opacity-40">Disciplines</h4>
                <div className="flex flex-wrap gap-x-12 gap-y-6">
                  {skills.map((skill, i) => (
                    <span key={i} className="text-2xl italic hover:text-[#c5a059] transition-colors cursor-default">
                      {skill.name}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Full-Bleed Portfolio Spreads */}
        <section id="projects" className="py-20 bg-[#1a1a1a] text-[#f9f7f2]">
          <div className="px-6 md:px-12 lg:px-24 pb-24">
            <h2 className="text-[10px] uppercase tracking-[0.5em] font-bold opacity-40">Selected Works</h2>
          </div>
          
          <div className="space-y-0">
            {projects.map((project, i) => (
              <motion.div 
                key={project.id}
                initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true, margin: "-100px" }}
                className="relative min-h-screen flex items-center overflow-hidden border-b border-white/5"
              >
                <div className="absolute inset-0 z-0">
                  {project.imageUrl && (
                    <img src={project.imageUrl} alt="" className="w-full h-full object-cover opacity-30 grayscale hover:opacity-50 transition-all duration-1000" />
                  )}
                </div>
                
                <div className="relative z-10 max-w-screen-2xl mx-auto px-6 md:px-12 lg:px-24 w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                  <div className={`lg:col-span-7 ${i % 2 === 0 ? 'lg:order-1' : 'lg:order-2'}`}>
                     <span className="text-[10px] font-mono opacity-50 mb-4 block">0{i + 1} / FEATURED_STORY</span>
                     <h3 className="text-5xl md:text-8xl font-bold mb-8 leading-tight tracking-tighter" style={{ fontFamily: 'Playfair Display, serif' }}>
                       {project.title}
                     </h3>
                     <p className="text-lg md:text-xl text-slate-300 max-w-md leading-relaxed mb-12">
                       {project.description}
                     </p>
                     <a href={project.liveUrl || '#'} className="inline-flex items-center gap-6 group">
                        <span className="text-xs uppercase tracking-[0.5em] font-bold">View Publication</span>
                        <div className="w-12 h-[1px] bg-[#f9f7f2] group-hover:w-24 transition-all" />
                        <ArrowRight size={16} />
                     </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Experience Timeline Editorial Layout */}
        <section className="py-40 px-6 md:px-12 lg:px-24">
          <div className="max-w-screen-2xl mx-auto">
             <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-black pb-8 mb-20">
                <h2 className="text-5xl md:text-8xl font-bold tracking-tighter" style={{ fontFamily: 'Playfair Display, serif' }}>Career Chronology</h2>
                <span className="text-xs uppercase tracking-[0.5em] font-bold md:mb-4 opacity-40">The Archive</span>
             </div>
             
             <div className="space-y-24">
                {experience.map((exp, i) => (
                  <div key={i} className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-24 group">
                    <div className="md:col-span-3 text-xs uppercase tracking-[0.5em] font-bold opacity-30 group-hover:opacity-100 transition-opacity">
                      {exp.duration}
                    </div>
                    <div className="md:col-span-9">
                      <div className="flex flex-col md:flex-row md:items-baseline justify-between mb-6">
                        <h3 className="text-3xl md:text-5xl font-bold" style={{ fontFamily: 'Playfair Display, serif' }}>{exp.role}</h3>
                        <span className="text-xl italic opacity-50">{exp.company}</span>
                      </div>
                      <p className="text-xl leading-relaxed text-slate-600 max-w-3xl">
                        {exp.description}
                      </p>
                    </div>
                  </div>
                ))}
             </div>
          </div>
        </section>

        {/* Contact / Enquiries */}
        <section id="contact" className="py-40 px-6 md:px-12 lg:px-24 bg-[#1a1a1a] text-[#f9f7f2]">
          <div className="max-w-screen-xl mx-auto">
            <div className="text-center mb-24">
               <h2 className="text-xs uppercase tracking-[0.5em] font-bold mb-8" style={{ color: accentColor }}>Inquiries & Partnerships</h2>
               <h3 className="text-5xl md:text-8xl font-bold tracking-tighter leading-none" style={{ fontFamily: 'Playfair Display, serif' }}>
                 Let’s Curate Something <br/> <span className="italic">Extraordinary</span>
               </h3>
            </div>
            
            <div className="max-w-2xl mx-auto">
              <ContactForm 
                inputClass="w-full px-0 py-6 bg-transparent border-0 border-b border-white/20 text-white focus:outline-none focus:border-[#c5a059] transition-all text-xl italic font-serif placeholder:opacity-20"
                buttonClass="w-full py-8 mt-12 border border-white/20 uppercase tracking-[0.5em] font-bold text-xs hover:bg-white hover:text-black transition-all"
                successClass="p-20 text-center border border-white/10 italic text-2xl"
                primaryColor="#c5a059"
              />
            </div>
            
            <div className="mt-40 grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="space-y-4">
                <h4 className="text-[10px] uppercase tracking-[0.3em] font-bold opacity-40">Contact</h4>
                <p className="text-sm font-bold">{profile.email}</p>
              </div>
              <div className="space-y-4">
                <h4 className="text-[10px] uppercase tracking-[0.3em] font-bold opacity-40">Location</h4>
                <p className="text-sm font-bold">{profile.location}</p>
              </div>
              <div className="md:col-span-2 flex justify-end gap-12 pt-4">
                 {profile.socialLinks.map((link, i) => (
                   <a key={i} href={link.url} className="text-xs uppercase tracking-[0.5em] font-bold hover:opacity-50 transition-opacity">
                     {link.platform}
                   </a>
                 ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-12 border-t border-black/5 text-center bg-white">
        <p className="text-[10px] uppercase tracking-[0.5em] font-bold opacity-40">
          © {new Date().getFullYear()} {profile.name} — Designed as Art
        </p>
      </footer>
    </div>
  );
}
