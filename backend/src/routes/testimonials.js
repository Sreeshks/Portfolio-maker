const router = require('express').Router();
const { authenticate } = require('../middleware/auth');
const { z } = require('zod');

const testimonialSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  role: z.string().optional().default(''),
  company: z.string().optional().default(''),
  message: z.string().min(1, 'Message is required'),
  avatar: z.string().optional().default(''),
  approved: z.boolean().optional().default(false)
});

// GET /api/testimonials — public (only approved) or all (if admin)
router.get('/', async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    let isAdmin = false;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      try {
        const jwt = require('jsonwebtoken');
        jwt.verify(authHeader.split(' ')[1], process.env.JWT_SECRET);
        isAdmin = true;
      } catch (e) { /* not admin */ }
    }

    const testimonials = await req.prisma.testimonial.findMany({
      where: isAdmin ? {} : { approved: true },
      orderBy: { name: 'asc' }
    });

    res.json(testimonials);
  } catch (error) {
    next(error);
  }
});

// POST /api/testimonials — public (submit) or admin (create approved)
router.post('/', async (req, res, next) => {
  try {
    const data = testimonialSchema.parse(req.body);

    // Only admin can set approved=true
    const authHeader = req.headers.authorization;
    let isAdmin = false;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      try {
        const jwt = require('jsonwebtoken');
        jwt.verify(authHeader.split(' ')[1], process.env.JWT_SECRET);
        isAdmin = true;
      } catch (e) { /* not admin */ }
    }

    if (!isAdmin) {
      data.approved = false;
    }

    const testimonial = await req.prisma.testimonial.create({ data });
    res.status(201).json(testimonial);
  } catch (error) {
    next(error);
  }
});

// PUT /api/testimonials/:id — protected (approve/reject/edit)
router.put('/:id', authenticate, async (req, res, next) => {
  try {
    const data = testimonialSchema.partial().parse(req.body);
    const testimonial = await req.prisma.testimonial.update({
      where: { id: req.params.id },
      data
    });
    res.json(testimonial);
  } catch (error) {
    next(error);
  }
});

// DELETE /api/testimonials/:id — protected
router.delete('/:id', authenticate, async (req, res, next) => {
  try {
    await req.prisma.testimonial.delete({ where: { id: req.params.id } });
    res.json({ message: 'Testimonial deleted' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
