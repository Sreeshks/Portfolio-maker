const router = require('express').Router();
const { z } = require('zod');

const contactSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Valid email is required'),
  subject: z.string().optional().default(''),
  message: z.string().min(1, 'Message is required')
});

// POST /api/contact — public
router.post('/', async (req, res, next) => {
  try {
    const data = contactSchema.parse(req.body);

    const contact = await req.prisma.contactMessage.create({ data });

    res.status(201).json({
      message: 'Message sent successfully! I\'ll get back to you soon.',
      id: contact.id
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
