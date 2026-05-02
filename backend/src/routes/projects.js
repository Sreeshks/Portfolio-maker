const router = require('express').Router();
const { authenticate } = require('../middleware/auth');
const { z } = require('zod');

const projectSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional().default(''),
  techStack: z.union([z.string(), z.array(z.string())]).optional().default('[]'),
  liveUrl: z.string().optional().default(''),
  githubUrl: z.string().optional().default(''),
  imageUrl: z.string().optional().default(''),
  featured: z.boolean().optional().default(false),
  order: z.number().optional().default(0)
});

// GET /api/projects — public
router.get('/', async (req, res, next) => {
  try {
    const projects = await req.prisma.project.findMany({
      orderBy: [{ featured: 'desc' }, { order: 'asc' }]
    });

    // Parse techStack from JSON string
    const parsed = projects.map(p => ({
      ...p,
      techStack: typeof p.techStack === 'string' ? JSON.parse(p.techStack) : p.techStack
    }));

    res.json(parsed);
  } catch (error) {
    next(error);
  }
});

// POST /api/projects — protected
router.post('/', authenticate, async (req, res, next) => {
  try {
    const data = projectSchema.parse(req.body);
    const techStack = Array.isArray(data.techStack)
      ? JSON.stringify(data.techStack)
      : data.techStack;

    const project = await req.prisma.project.create({
      data: { ...data, techStack }
    });

    res.status(201).json({
      ...project,
      techStack: JSON.parse(project.techStack)
    });
  } catch (error) {
    next(error);
  }
});

// PUT /api/projects/:id — protected
router.put('/:id', authenticate, async (req, res, next) => {
  try {
    const data = projectSchema.partial().parse(req.body);
    if (data.techStack !== undefined) {
      data.techStack = Array.isArray(data.techStack)
        ? JSON.stringify(data.techStack)
        : data.techStack;
    }

    const project = await req.prisma.project.update({
      where: { id: req.params.id },
      data
    });

    res.json({
      ...project,
      techStack: JSON.parse(project.techStack)
    });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/projects/:id — protected
router.delete('/:id', authenticate, async (req, res, next) => {
  try {
    await req.prisma.project.delete({ where: { id: req.params.id } });
    res.json({ message: 'Project deleted' });
  } catch (error) {
    next(error);
  }
});

// PUT /api/projects/reorder — protected (batch reorder)
router.put('/batch/reorder', authenticate, async (req, res, next) => {
  try {
    const { items } = req.body; // [{ id, order }]
    if (!Array.isArray(items)) {
      return res.status(400).json({ error: 'Items array required' });
    }

    await Promise.all(
      items.map(item =>
        req.prisma.project.update({
          where: { id: item.id },
          data: { order: item.order }
        })
      )
    );

    res.json({ message: 'Reordered successfully' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
