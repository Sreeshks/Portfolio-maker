const router = require('express').Router();
const { authenticate } = require('../middleware/auth');
const { z } = require('zod');

const logoSchema = z.object({
  name: z.string().min(1),
  image: z.string().min(1),
  url: z.string().optional(),
  order: z.number().int().optional()
});

// GET /api/logos — public
router.get('/', async (req, res, next) => {
  try {
    const logos = await req.prisma.clientLogo.findMany({
      orderBy: { order: 'asc' }
    });
    res.json(logos);
  } catch (error) {
    next(error);
  }
});

// POST /api/logos — protected
router.post('/', authenticate, async (req, res, next) => {
  try {
    const data = logoSchema.parse(req.body);
    const logo = await req.prisma.clientLogo.create({ data });
    res.status(201).json(logo);
  } catch (error) {
    next(error);
  }
});

// PUT /api/logos/:id — protected
router.put('/:id', authenticate, async (req, res, next) => {
  try {
    const data = logoSchema.parse(req.body);
    const logo = await req.prisma.clientLogo.update({
      where: { id: req.params.id },
      data
    });
    res.json(logo);
  } catch (error) {
    next(error);
  }
});

// DELETE /api/logos/:id — protected
router.delete('/:id', authenticate, async (req, res, next) => {
  try {
    await req.prisma.clientLogo.delete({ where: { id: req.params.id } });
    res.json({ message: 'Logo deleted' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
