const router = require('express').Router();
const { authenticate } = require('../middleware/auth');

// GET /api/messages — protected
router.get('/', authenticate, async (req, res, next) => {
  try {
    const messages = await req.prisma.contactMessage.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(messages);
  } catch (error) {
    next(error);
  }
});

// PUT /api/messages/:id/read — protected
router.put('/:id/read', authenticate, async (req, res, next) => {
  try {
    const message = await req.prisma.contactMessage.update({
      where: { id: req.params.id },
      data: { read: true }
    });
    res.json(message);
  } catch (error) {
    next(error);
  }
});

// DELETE /api/messages/:id — protected
router.delete('/:id', authenticate, async (req, res, next) => {
  try {
    await req.prisma.contactMessage.delete({ where: { id: req.params.id } });
    res.json({ message: 'Message deleted' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
