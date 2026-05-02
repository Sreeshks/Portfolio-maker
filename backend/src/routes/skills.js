const router = require('express').Router();
const { authenticate } = require('../middleware/auth');
const { z } = require('zod');

const skillSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  level: z.number().min(1).max(100).optional().default(50),
  category: z.string().optional().default('General'),
  icon: z.string().optional().default(''),
  order: z.number().optional().default(0)
});

// GET /api/skills — public
router.get('/', async (req, res, next) => {
  try {
    const skills = await req.prisma.skill.findMany({
      orderBy: [{ category: 'asc' }, { order: 'asc' }]
    });
    res.json(skills);
  } catch (error) {
    next(error);
  }
});

// POST /api/skills — protected
router.post('/', authenticate, async (req, res, next) => {
  try {
    const data = skillSchema.parse(req.body);
    const skill = await req.prisma.skill.create({ data });
    res.status(201).json(skill);
  } catch (error) {
    next(error);
  }
});

// PUT /api/skills/:id — protected
router.put('/:id', authenticate, async (req, res, next) => {
  try {
    const data = skillSchema.partial().parse(req.body);
    const skill = await req.prisma.skill.update({
      where: { id: req.params.id },
      data
    });
    res.json(skill);
  } catch (error) {
    next(error);
  }
});

// DELETE /api/skills/:id — protected
router.delete('/:id', authenticate, async (req, res, next) => {
  try {
    await req.prisma.skill.delete({ where: { id: req.params.id } });
    res.json({ message: 'Skill deleted' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
