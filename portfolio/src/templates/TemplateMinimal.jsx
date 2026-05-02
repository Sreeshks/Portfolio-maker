import { motion } from 'framer-motion';
import { Github, Linkedin, Twitter, Dribbble, Mail, ExternalLink, ArrowRight } from 'lucide-react';
import ContactForm from '../components/ContactForm';

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }
};

const stagger = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const iconMap = {
  github: Github,
  linkedin: Linkedin,
  twitter: Twitter,
  dribbble: Dribbble
};

export default function TemplateMinimal({ data }) {
  const { profile, projects, skills, experience, education, testimonials, settings } = data;
  const primaryColor = settings.primaryColor || '#1e293b';

  return (
    <div className="min-h-screen bg-[#fafafa] text-[#333333] selection:bg-black selection:text-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200/50">
        <div className="max-w-5xl mx-auto px-6 h-20 flex items-center justify-between">
          <a href="#" className="text-xl font-bold tracking-tight" style={{ color: primaryColor }}>
            {profile.name.split(' ')[0]}<span className="opacity-40">.</span>
          </a>
          <div className="hidden md:flex gap-8 text-sm font-medium text-gray-500">
            {['About', 'Projects', 'Experience', 'Contact'].map(item => (
              <a key={item} href={`#${item.toLowerCase()}`} className="hover:text-black transition-colors">
                {item}
              </a>
            ))}
          </div>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-6 pt-32 pb-20 space-y-32">
        {/* Hero Section */}
        <motion.section
          initial="hidden" animate="visible" variants={stagger}
          className="min-h-[70vh] flex flex-col justify-center"
        >
          <motion.div variants={fadeIn} className="max-w-3xl">
            <h1 className="text-5xl md:text-7xl font-semibold tracking-tight text-gray-900 leading-tight mb-6" style={{ fontFamily: 'Playfair Display, serif' }}>
              Hi, I'm {profile.name}.<br />
              <span className="text-gray-400">{profile.title}</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-500 leading-relaxed max-w-2xl mb-10">
              {profile.bio}
            </p>
            <div className="flex items-center gap-6">
              <a href="#projects" className="group flex items-center gap-2 text-sm font-bold uppercase tracking-widest pb-1 border-b-2 border-black transition-all hover:pr-4">
                View Work <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
              </a>
              <div className="flex items-center gap-4 text-gray-400">
                {profile.socialLinks.map((link, i) => {
                  const Icon = iconMap[link.platform.toLowerCase()] || ExternalLink;
                  return (
                    <a key={i} href={link.url} target="_blank" rel="noopener noreferrer" className="hover:text-black transition-colors">
                      <Icon size={20} />
                    </a>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </motion.section>

        {/* Divider */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />

        {/* Skills Section */}
        <motion.section
          initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={stagger}
          className="grid grid-cols-1 md:grid-cols-12 gap-12"
        >
          <motion.div variants={fadeIn} className="md:col-span-4">
            <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Expertise</h2>
            <h3 className="text-3xl font-medium text-gray-900" style={{ fontFamily: 'Playfair Display, serif' }}>Skills & Tools</h3>
          </motion.div>
          <motion.div variants={fadeIn} className="md:col-span-8 flex flex-wrap gap-x-8 gap-y-4">
            {skills.map((skill, i) => (
              <span key={i} className="text-base text-gray-600 border-b border-gray-200 pb-1 inline-block">
                {skill.name}
              </span>
            ))}
          </motion.div>
        </motion.section>

        {/* Projects Section */}
        <motion.section
          id="projects"
          initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={stagger}
        >
          <motion.div variants={fadeIn} className="mb-16">
            <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Selected Work</h2>
            <h3 className="text-3xl font-medium text-gray-900" style={{ fontFamily: 'Playfair Display, serif' }}>Recent Projects</h3>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            {projects.map((project, i) => (
              <motion.div key={project.id} variants={fadeIn} className="group cursor-pointer">
                <div className="aspect-[4/3] mb-6 overflow-hidden bg-gray-100 relative">
                  {project.imageUrl ? (
                    <img src={project.imageUrl} alt={project.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300">No Image</div>
                  )}
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500 flex items-center justify-center">
                    <a
                      href={project.liveUrl || project.githubUrl || '#'}
                      target="_blank" rel="noopener noreferrer"
                      className="opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 bg-white text-black px-6 py-3 rounded-full text-sm font-medium flex items-center gap-2"
                    >
                      View Project <ArrowRight size={16} />
                    </a>
                  </div>
                </div>
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-xl font-medium text-gray-900 mb-2">{project.title}</h4>
                    <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed max-w-sm">{project.description}</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-3 mt-4">
                  {(Array.isArray(project.techStack) ? project.techStack : JSON.parse(project.techStack || '[]')).slice(0, 3).map((tech, j) => (
                    <span key={j} className="text-xs text-gray-400 uppercase tracking-wider">{tech}</span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Experience & Education */}
        <motion.section
          id="experience"
          initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={stagger}
          className="grid grid-cols-1 md:grid-cols-12 gap-16"
        >
          <motion.div variants={fadeIn} className="md:col-span-6 space-y-12">
            <div>
              <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Career</h2>
              <h3 className="text-3xl font-medium text-gray-900 mb-8" style={{ fontFamily: 'Playfair Display, serif' }}>Experience</h3>
              <div className="space-y-12 border-l border-gray-200 pl-6 ml-2">
                {experience.map((exp, i) => (
                  <div key={i} className="relative">
                    <div className="absolute -left-[31px] top-1.5 w-3 h-3 bg-white border-2 border-gray-300 rounded-full" />
                    <span className="text-sm text-gray-400 font-mono mb-1 block">{exp.duration}</span>
                    <h4 className="text-lg font-medium text-gray-900">{exp.role}</h4>
                    <h5 className="text-sm text-gray-500 mb-3">{exp.company}</h5>
                    <p className="text-sm text-gray-500 leading-relaxed">{exp.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          <motion.div variants={fadeIn} className="md:col-span-6 space-y-12">
            <div>
              <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Academic</h2>
              <h3 className="text-3xl font-medium text-gray-900 mb-8" style={{ fontFamily: 'Playfair Display, serif' }}>Education</h3>
              <div className="space-y-8">
                {education.map((edu, i) => (
                  <div key={i} className="border-b border-gray-100 pb-8">
                    <span className="text-sm text-gray-400 font-mono mb-1 block">{edu.year}</span>
                    <h4 className="text-lg font-medium text-gray-900">{edu.degree}</h4>
                    <h5 className="text-sm text-gray-500 mb-2">{edu.institution}</h5>
                    <p className="text-sm text-gray-500 leading-relaxed">{edu.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.section>

        {/* Contact Section */}
        <motion.section
          id="contact"
          initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={stagger}
          className="bg-white p-10 md:p-16 border border-gray-100 shadow-sm rounded-2xl grid grid-cols-1 md:grid-cols-2 gap-12"
        >
          <motion.div variants={fadeIn}>
            <h2 className="text-4xl font-medium text-gray-900 mb-6" style={{ fontFamily: 'Playfair Display, serif' }}>Let's work together.</h2>
            <p className="text-gray-500 mb-8 max-w-sm leading-relaxed">
              I'm currently available for freelance work and new opportunities. Send me a message and I'll get back to you as soon as possible.
            </p>
            <div className="space-y-4 text-sm text-gray-500">
              {profile.email && <p className="flex items-center gap-3"><Mail size={16} /> {profile.email}</p>}
              {profile.location && <p className="flex items-center gap-3">📍 {profile.location}</p>}
            </div>
          </motion.div>
          <motion.div variants={fadeIn}>
            <ContactForm
              inputClass="w-full px-0 py-3 bg-transparent border-0 border-b border-gray-300 focus:border-black focus:ring-0 text-gray-900 transition-colors"
              buttonClass="px-8 py-3 bg-black text-white text-sm tracking-wider uppercase font-semibold flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors mt-6 w-full md:w-auto"
              successClass="p-8 text-center text-green-700 bg-green-50 rounded-xl"
              primaryColor="#000000"
            />
          </motion.div>
        </motion.section>
      </main>

      {/* Footer */}
      <footer className="py-8 text-center border-t border-gray-200">
        <p className="text-xs text-gray-400">© {new Date().getFullYear()} {profile.name}. All rights reserved.</p>
      </footer>
    </div>
  );
}
