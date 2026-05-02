const router = require('express').Router();
const { authenticate } = require('../middleware/auth');
const { z } = require('zod');

const educationSchema = z.object({
  institution: z.string().min(1, 'Institution is required'),
  degree: z.string().min(1, 'Degree is required'),
  year: z.string().optional().default(''),
  description: z.string().optional().default(''),
  order: z.number().optional().default(0)
});

// GET /api/education — public
router.get('/', async (req, res, next) => {
  try {
    const education = await req.prisma.education.findMany({
      orderBy: { order: 'asc' }
    });
    res.json(education);
  } catch (error) {
    next(error);
  }
});

// POST /api/education — protected
router.post('/', authenticate, async (req, res, next) => {
  try {
    const data = educationSchema.parse(req.body);
    const education = await req.prisma.education.create({ data });
    res.status(201).json(education);
  } catch (error) {
    next(error);
  }
});

// PUT /api/education/:id — protected
router.put('/:id', authenticate, async (req, res, next) => {
  try {
    const data = educationSchema.partial().parse(req.body);
    const education = await req.prisma.education.update({
      where: { id: req.params.id },
      data
    });
    res.json(education);
  } catch (error) {
    next(error);
  }
});

// DELETE /api/education/:id — protected
router.delete('/:id', authenticate, async (req, res, next) => {
  try {
    await req.prisma.education.delete({ where: { id: req.params.id } });
    res.json({ message: 'Education deleted' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
