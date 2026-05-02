const router = require('express').Router();
const { authenticate } = require('../middleware/auth');

// GET /api/stats — protected
router.get('/', authenticate, async (req, res, next) => {
  try {
    const [
      projects,
      skills,
      experience,
      testimonials,
      unreadMessages,
      totalMessages,
      totalLogos
    ] = await Promise.all([
      req.prisma.project.count(),
      req.prisma.skill.count(),
      req.prisma.experience.count(),
      req.prisma.testimonial.count({ where: { approved: false } }), // Pending approval
      req.prisma.contactMessage.count({ where: { read: false } }),
      req.prisma.contactMessage.count(),
      req.prisma.clientLogo.count()
    ]);

    res.json({
      projects,
      skills,
      experience,
      pendingTestimonials: testimonials,
      unreadMessages,
      totalMessages,
      totalLogos
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
