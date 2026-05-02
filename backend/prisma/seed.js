const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...\n');

  // ─── Admin User ───────────────────────────────────────────
  const passwordHash = await bcrypt.hash('admin123', 12);
  const user = await prisma.user.upsert({
    where: { email: 'admin@portfolio.com' },
    update: {},
    create: {
      email: 'admin@portfolio.com',
      passwordHash,
      role: 'admin'
    }
  });
  console.log('✅ Admin user created:', user.email);

  // ─── Profile ──────────────────────────────────────────────
  const existingProfile = await prisma.profile.findFirst();
  const profile = existingProfile || await prisma.profile.create({
    data: {
      name: 'Alex Rivera',
      title: 'Full-Stack Developer & Designer',
      bio: 'I\'m a passionate full-stack developer with 5+ years of experience building beautiful, performant web applications. I specialize in React, Node.js, and modern design systems. I love turning complex problems into simple, elegant solutions.',
      email: 'alex@example.com',
      phone: '+1 (555) 123-4567',
      location: 'San Francisco, CA',
      socialLinks: {
        create: [
          { platform: 'github', url: 'https://github.com/alexrivera' },
          { platform: 'linkedin', url: 'https://linkedin.com/in/alexrivera' },
          { platform: 'twitter', url: 'https://twitter.com/alexrivera' },
          { platform: 'dribbble', url: 'https://dribbble.com/alexrivera' }
        ]
      }
    }
  });
  console.log('✅ Profile created:', profile.name || 'Default');

  // ─── Skills ───────────────────────────────────────────────
  const skills = [
    { name: 'React', level: 95, category: 'Frontend', icon: '⚛️', order: 0 },
    { name: 'TypeScript', level: 90, category: 'Frontend', icon: '📘', order: 1 },
    { name: 'Next.js', level: 88, category: 'Frontend', icon: '▲', order: 2 },
    { name: 'Vue.js', level: 75, category: 'Frontend', icon: '💚', order: 3 },
    { name: 'CSS/SCSS', level: 92, category: 'Frontend', icon: '🎨', order: 4 },
    { name: 'Tailwind CSS', level: 90, category: 'Frontend', icon: '🌊', order: 5 },
    { name: 'Node.js', level: 92, category: 'Backend', icon: '🟢', order: 0 },
    { name: 'Python', level: 80, category: 'Backend', icon: '🐍', order: 1 },
    { name: 'PostgreSQL', level: 85, category: 'Backend', icon: '🐘', order: 2 },
    { name: 'MongoDB', level: 78, category: 'Backend', icon: '🍃', order: 3 },
    { name: 'GraphQL', level: 82, category: 'Backend', icon: '◈', order: 4 },
    { name: 'Docker', level: 80, category: 'DevOps', icon: '🐳', order: 0 },
    { name: 'AWS', level: 75, category: 'DevOps', icon: '☁️', order: 1 },
    { name: 'Git', level: 95, category: 'DevOps', icon: '📦', order: 2 },
    { name: 'Figma', level: 85, category: 'Design', icon: '🎯', order: 0 },
    { name: 'Adobe XD', level: 70, category: 'Design', icon: '💜', order: 1 },
  ];

  for (const skill of skills) {
    await prisma.skill.create({ data: skill });
  }
  console.log(`✅ ${skills.length} skills created`);

  // ─── Projects ─────────────────────────────────────────────
  const projects = [
    {
      title: 'E-Commerce Platform',
      description: 'A full-featured e-commerce platform with real-time inventory management, payment processing via Stripe, and an admin dashboard. Built with a microservices architecture for scalability.',
      techStack: JSON.stringify(['React', 'Node.js', 'PostgreSQL', 'Stripe', 'Redis', 'Docker']),
      liveUrl: 'https://example.com/ecommerce',
      githubUrl: 'https://github.com/alexrivera/ecommerce',
      featured: true,
      order: 0
    },
    {
      title: 'AI Chat Application',
      description: 'Real-time chat application powered by AI with natural language processing, smart suggestions, and multi-language support. Features end-to-end encryption and WebSocket communication.',
      techStack: JSON.stringify(['Next.js', 'OpenAI', 'Socket.io', 'MongoDB', 'TailwindCSS']),
      liveUrl: 'https://example.com/aichat',
      githubUrl: 'https://github.com/alexrivera/aichat',
      featured: true,
      order: 1
    },
    {
      title: 'Task Management System',
      description: 'A collaborative task management tool with Kanban boards, real-time updates, team workspaces, and detailed analytics. Integrates with Slack and GitHub.',
      techStack: JSON.stringify(['Vue.js', 'Express', 'PostgreSQL', 'GraphQL', 'AWS']),
      liveUrl: 'https://example.com/taskflow',
      githubUrl: 'https://github.com/alexrivera/taskflow',
      featured: true,
      order: 2
    },
    {
      title: 'Weather Dashboard',
      description: 'Beautiful weather dashboard with 7-day forecasts, interactive maps, air quality monitoring, and location-based alerts. Uses multiple weather APIs for accuracy.',
      techStack: JSON.stringify(['React', 'D3.js', 'Node.js', 'Weather API']),
      liveUrl: 'https://example.com/weather',
      githubUrl: 'https://github.com/alexrivera/weather',
      featured: false,
      order: 3
    },
    {
      title: 'Social Media Analytics',
      description: 'Cross-platform social media analytics dashboard that aggregates data from multiple platforms and provides actionable insights with beautiful data visualizations.',
      techStack: JSON.stringify(['React', 'Python', 'FastAPI', 'Chart.js', 'Redis']),
      liveUrl: 'https://example.com/analytics',
      githubUrl: 'https://github.com/alexrivera/analytics',
      featured: false,
      order: 4
    },
    {
      title: 'Fitness Tracking App',
      description: 'Mobile-first fitness tracking application with workout planning, progress charts, nutrition logging, and social features for accountability.',
      techStack: JSON.stringify(['React Native', 'Node.js', 'MongoDB', 'Firebase']),
      liveUrl: 'https://example.com/fittrack',
      githubUrl: 'https://github.com/alexrivera/fittrack',
      featured: false,
      order: 5
    }
  ];

  for (const project of projects) {
    await prisma.project.create({ data: project });
  }
  console.log(`✅ ${projects.length} projects created`);

  // ─── Experience ───────────────────────────────────────────
  const experiences = [
    {
      company: 'TechCorp Inc.',
      role: 'Senior Full-Stack Developer',
      duration: '2022 – Present',
      description: 'Lead developer for the core platform team. Architected and built the company\'s next-generation SaaS product, reducing page load times by 60% and increasing user engagement by 40%.',
      current: true,
      order: 0
    },
    {
      company: 'StartupXYZ',
      role: 'Full-Stack Developer',
      duration: '2020 – 2022',
      description: 'Built and maintained multiple client-facing web applications. Introduced testing practices that reduced bug rates by 50%. Mentored junior developers and led code reviews.',
      current: false,
      order: 1
    },
    {
      company: 'Digital Agency Co.',
      role: 'Frontend Developer',
      duration: '2018 – 2020',
      description: 'Developed responsive web applications for Fortune 500 clients. Specialized in complex UI animations and data visualization. Won "Developer of the Year" award in 2019.',
      current: false,
      order: 2
    }
  ];

  for (const exp of experiences) {
    await prisma.experience.create({ data: exp });
  }
  console.log(`✅ ${experiences.length} experiences created`);

  // ─── Education ────────────────────────────────────────────
  const education = [
    {
      institution: 'Stanford University',
      degree: 'M.S. Computer Science',
      year: '2018',
      description: 'Specialized in Human-Computer Interaction and Machine Learning. Published 2 research papers on UI accessibility.',
      order: 0
    },
    {
      institution: 'UC Berkeley',
      degree: 'B.S. Computer Science',
      year: '2016',
      description: 'Graduated with honors. Active in ACM club and hackathon team. Built award-winning projects in data visualization.',
      order: 1
    }
  ];

  for (const edu of education) {
    await prisma.education.create({ data: edu });
  }
  console.log(`✅ ${education.length} education entries created`);

  // ─── Testimonials ─────────────────────────────────────────
  const testimonials = [
    {
      name: 'Sarah Chen',
      role: 'Product Manager',
      company: 'TechCorp Inc.',
      message: 'Alex is one of the most talented developers I\'ve ever worked with. Their ability to translate complex requirements into elegant solutions is remarkable. They consistently deliver above expectations.',
      approved: true
    },
    {
      name: 'Marcus Johnson',
      role: 'CTO',
      company: 'StartupXYZ',
      message: 'Working with Alex was a game-changer for our startup. They built our entire platform from scratch and it\'s been rock-solid. Their code quality and attention to detail are outstanding.',
      approved: true
    },
    {
      name: 'Emily Rodriguez',
      role: 'Design Lead',
      company: 'Digital Agency Co.',
      message: 'Alex has an incredible eye for design and a deep understanding of user experience. They bridge the gap between design and development better than anyone I know.',
      approved: true
    },
    {
      name: 'James Park',
      role: 'Engineering Director',
      company: 'Google',
      message: 'I had the pleasure of reviewing Alex\'s work during a project collaboration. Their technical skills are top-notch, and they bring a level of creativity that\'s rare among developers.',
      approved: false
    }
  ];

  for (const testimonial of testimonials) {
    await prisma.testimonial.create({ data: testimonial });
  }
  console.log(`✅ ${testimonials.length} testimonials created`);

  // ─── Settings ─────────────────────────────────────────────
  await prisma.settings.upsert({
    where: { id: 'default' },
    update: {},
    create: {
      id: 'default',
      activeTemplate: 'minimal',
      primaryColor: '#6366f1',
      accentColor: '#f59e0b',
      fontFamily: 'Inter',
      seoTitle: 'Alex Rivera — Full-Stack Developer',
      seoDescription: 'Portfolio of Alex Rivera, a passionate full-stack developer specializing in React, Node.js, and modern web technologies.'
    }
  });
  console.log('✅ Settings initialized');

  console.log('\n🎉 Database seeded successfully!');
  console.log('\n📧 Admin login credentials:');
  console.log('   Email: admin@portfolio.com');
  console.log('   Password: admin123\n');
}

main()
  .catch(e => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
