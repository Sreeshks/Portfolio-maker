const router = require('express').Router();
const { authenticate } = require('../middleware/auth');
const { z } = require('zod');

const blogSchema = z.object({
  title: z.string().min(1),
  slug: z.string().min(1),
  content: z.string().min(1),
  excerpt: z.string().optional(),
  coverImage: z.string().optional(),
  tags: z.string().optional(),
  published: z.boolean().optional()
});

// GET /api/blog — public (published only)
router.get('/', async (req, res, next) => {
  try {
    const posts = await req.prisma.blogPost.findMany({
      where: { published: true },
      orderBy: { createdAt: 'desc' }
    });
    res.json(posts);
  } catch (error) {
    next(error);
  }
});

// GET /api/blog/admin — protected (all posts)
router.get('/admin', authenticate, async (req, res, next) => {
  try {
    const posts = await req.prisma.blogPost.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(posts);
  } catch (error) {
    next(error);
  }
});

// GET /api/blog/:slug — public
router.get('/:slug', async (req, res, next) => {
  try {
    const post = await req.prisma.blogPost.findUnique({
      where: { slug: req.params.slug }
    });
    if (!post) return res.status(404).json({ error: 'Post not found' });
    res.json(post);
  } catch (error) {
    next(error);
  }
});

// POST /api/blog — protected
router.post('/', authenticate, async (req, res, next) => {
  try {
    const data = blogSchema.parse(req.body);
    const post = await req.prisma.blogPost.create({ data });
    res.status(201).json(post);
  } catch (error) {
    next(error);
  }
});

// PUT /api/blog/:id — protected
router.put('/:id', authenticate, async (req, res, next) => {
  try {
    const data = blogSchema.parse(req.body);
    const post = await req.prisma.blogPost.update({
      where: { id: req.params.id },
      data
    });
    res.json(post);
  } catch (error) {
    next(error);
  }
});

// DELETE /api/blog/:id — protected
router.delete('/:id', authenticate, async (req, res, next) => {
  try {
    await req.prisma.blogPost.delete({ where: { id: req.params.id } });
    res.json({ message: 'Post deleted' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
