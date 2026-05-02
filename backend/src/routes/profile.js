const router = require('express').Router();
const { authenticate } = require('../middleware/auth');
const { z } = require('zod');

const profileSchema = z.object({
  name: z.string().optional(),
  title: z.string().optional(),
  bio: z.string().optional(),
  avatar: z.string().optional(),
  email: z.string().email().optional().or(z.literal('')),
  phone: z.string().optional(),
  location: z.string().optional(),
  resumeUrl: z.string().optional(),
  socialLinks: z.array(z.object({
    id: z.string().optional(),
    platform: z.string(),
    url: z.string().url()
  })).optional()
});

// GET /api/profile — public
router.get('/', async (req, res, next) => {
  try {
    let profile = await req.prisma.profile.findFirst({
      include: { socialLinks: true }
    });

    if (!profile) {
      profile = await req.prisma.profile.create({
        data: {},
        include: { socialLinks: true }
      });
    }

    res.json(profile);
  } catch (error) {
    next(error);
  }
});

// PUT /api/profile — protected
router.put('/', authenticate, async (req, res, next) => {
  try {
    const data = profileSchema.parse(req.body);
    const { socialLinks, ...profileData } = data;

    let profile = await req.prisma.profile.findFirst();
    if (!profile) {
      profile = await req.prisma.profile.create({ data: {} });
    }

    // Update profile fields
    profile = await req.prisma.profile.update({
      where: { id: profile.id },
      data: profileData
    });

    // Update social links if provided
    if (socialLinks !== undefined) {
      // Delete existing links
      await req.prisma.socialLink.deleteMany({
        where: { profileId: profile.id }
      });

      // Create new links
      if (socialLinks.length > 0) {
        await req.prisma.socialLink.createMany({
          data: socialLinks.map(link => ({
            platform: link.platform,
            url: link.url,
            profileId: profile.id
          }))
        });
      }
    }

    const updated = await req.prisma.profile.findUnique({
      where: { id: profile.id },
      include: { socialLinks: true }
    });

    res.json(updated);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
