const router = require('express').Router();
const { authenticate } = require('../middleware/auth');
const { z } = require('zod');

const experienceSchema = z.object({
  company: z.string().min(1, 'Company is required'),
  role: z.string().min(1, 'Role is required'),
  duration: z.string().optional().default(''),
  description: z.string().optional().default(''),
  logo: z.string().optional().default(''),
  current: z.boolean().optional().default(false),
  order: z.number().optional().default(0)
});

// GET /api/experience — public
router.get('/', async (req, res, next) => {
  try {
    const experiences = await req.prisma.experience.findMany({
      orderBy: [{ current: 'desc' }, { order: 'asc' }]
    });
    res.json(experiences);
  } catch (error) {
    next(error);
  }
});

// POST /api/experience — protected
router.post('/', authenticate, async (req, res, next) => {
  try {
    const data = experienceSchema.parse(req.body);
    const experience = await req.prisma.experience.create({ data });
    res.status(201).json(experience);
  } catch (error) {
    next(error);
  }
});

// PUT /api/experience/:id — protected
router.put('/:id', authenticate, async (req, res, next) => {
  try {
    const data = experienceSchema.partial().parse(req.body);
    const experience = await req.prisma.experience.update({
      where: { id: req.params.id },
      data
    });
    res.json(experience);
  } catch (error) {
    next(error);
  }
});

// DELETE /api/experience/:id — protected
router.delete('/:id', authenticate, async (req, res, next) => {
  try {
    await req.prisma.experience.delete({ where: { id: req.params.id } });
    res.json({ message: 'Experience deleted' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
