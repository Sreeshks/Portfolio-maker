require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
const { PrismaClient } = require('@prisma/client');

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 5000;

// ─── Security ───────────────────────────────────────────────
app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(cors({
  origin: '*'
}));

// ─── Body Parsing ───────────────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// ─── Static Files (Uploads) ────────────────────────────────
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// ─── Rate Limiters ─────────────────────────────────────────
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { error: 'Too many authentication attempts, please try again later' }
});

const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
  message: { error: 'Too many messages sent, please try again later' }
});

// ─── Inject Prisma ─────────────────────────────────────────
app.use((req, res, next) => {
  req.prisma = prisma;
  next();
});

// ─── API Routes ─────────────────────────────────────────────
app.use('/api/auth', authLimiter, require('./routes/auth'));
app.use('/api/profile', require('./routes/profile'));
app.use('/api/projects', require('./routes/projects'));
app.use('/api/skills', require('./routes/skills'));
app.use('/api/experience', require('./routes/experience'));
app.use('/api/education', require('./routes/education'));
app.use('/api/testimonials', require('./routes/testimonials'));
app.use('/api/settings', require('./routes/settings'));
app.use('/api/upload', require('./routes/upload'));
app.use('/api/contact', contactLimiter, require('./routes/contact'));
app.use('/api/messages', require('./routes/messages'));
app.use('/api/stats', require('./routes/stats'));
app.use('/api/blog', require('./routes/blog'));
app.use('/api/logos', require('./routes/logos'));

// ─── Health Check ───────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ─── Error Handler ──────────────────────────────────────────
app.use(require('./middleware/errorHandler'));

// ─── Graceful Shutdown ─────────────────────────────────────
process.on('SIGTERM', async () => {
  await prisma.$disconnect();
  process.exit(0);
});

// ─── Start Server ───────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n  🚀 Portfolio API running at http://localhost:${PORT}`);
  console.log(`  📚 Health check: http://localhost:${PORT}/api/health\n`);
});
