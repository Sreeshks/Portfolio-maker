const router = require('express').Router();
const { authenticate } = require('../middleware/auth');
const { z } = require('zod');

const settingsSchema = z.object({
  activeTemplate: z.enum(['minimal', 'bold', 'dark', 'bento', 'cyberpunk', 'editorial', 'spatial', 'japandi']).optional(),
  primaryColor: z.string().optional(),
  accentColor: z.string().optional(),
  fontFamily: z.string().optional(),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  ogImage: z.string().optional(),
  analyticsId: z.string().optional()
});

// GET /api/settings — public
router.get('/', async (req, res, next) => {
  try {
    let settings = await req.prisma.settings.findUnique({
      where: { id: 'default' }
    });

    if (!settings) {
      settings = await req.prisma.settings.create({
        data: { id: 'default' }
      });
    }

    res.json(settings);
  } catch (error) {
    next(error);
  }
});

// PUT /api/settings — protected
router.put('/', authenticate, async (req, res, next) => {
  try {
    const data = settingsSchema.parse(req.body);

    let settings = await req.prisma.settings.findUnique({
      where: { id: 'default' }
    });

    if (!settings) {
      settings = await req.prisma.settings.create({
        data: { id: 'default', ...data }
      });
    } else {
      settings = await req.prisma.settings.update({
        where: { id: 'default' },
        data
      });
    }

    res.json(settings);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
