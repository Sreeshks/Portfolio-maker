# Guide: Creating New Portfolio Templates

This document explains how to create new templates for your portfolio system using AI (like Claude or ChatGPT) or by hand.

## 1. The Data Structure
Your template will receive a single prop called `data`. Here is exactly what is inside it:

```json
{
  "profile": {
    "name": "Full Name",
    "title": "Job Title",
    "bio": "Short biography",
    "location": "City, Country",
    "email": "email@example.com",
    "avatarUrl": "URL to image",
    "socialLinks": [{ "platform": "Github", "url": "..." }]
  },
  "projects": [
    {
      "title": "Project Name",
      "description": "Short description",
      "imageUrl": "...",
      "liveUrl": "...",
      "githubUrl": "...",
      "techStack": ["React", "Node.js"] 
    }
  ],
  "skills": [
    { "name": "JavaScript", "category": "Frontend", "level": 90 }
  ],
  "experience": [
    { "company": "Google", "role": "Engineer", "duration": "2020-2024", "description": "...", "current": true }
  ],
  "education": [
    { "institution": "MIT", "degree": "CS", "year": "2020", "description": "..." }
  ],
  "testimonials": [
    { "name": "Client Name", "role": "CEO", "company": "Startup", "message": "..." }
  ],
  "settings": {
    "primaryColor": "#6366f1",
    "accentColor": "#f59e0b",
    "fontFamily": "Inter"
  }
}
```

## 2. Copy-Paste AI Prompt
Use this exact prompt when asking an AI to build a new template for you. Just replace the **[STYLE DESCRIPTION]** part with your idea.

---
### **THE PROMPT**
> "Act as a Senior React Developer and UI Designer. I need you to build a new portfolio template component.
>
> **Technical Requirements:**
> - Component Name: `TemplateCustom`
> - Tech Stack: React (Functional Component), Tailwind CSS, Framer Motion (for animations), and Lucide React (for icons).
> - Props: It receives a single `data` prop containing: `profile`, `projects`, `skills`, `experience`, `education`, `testimonials`, and `settings`.
> - Style Guidelines: Use `data.settings.primaryColor` and `data.settings.accentColor` for themes.
>
> **Design Theme:** 
> [INSERT STYLE DESCRIPTION HERE - e.g., 'A futuristic cyber-punk theme with neon borders and glitch effects' or 'A brutalist design with huge typography and high contrast']
>
> **Specific Instructions:**
> 1. Import `ContactForm` from `../components/ContactForm`.
> 2. Map through `data.projects` and `data.skills`.
> 3. Use `framer-motion` for reveal-on-scroll animations.
> 4. Ensure it is fully responsive (Mobile/Desktop).
> 5. Output ONLY the code for the file `TemplateCustom.jsx`."
---

## 3. How to Install the New Template

Once you have the code for `TemplateCustom.jsx`:

1.  **Save the file**: Place it in `portfolio/src/templates/TemplateCustom.jsx`.
2.  **Import in App.jsx**: 
    Open `portfolio/src/App.jsx` and add:
    ```javascript
    import TemplateCustom from './templates/TemplateCustom';
    ```
3.  **Update the Render Logic**:
    In `portfolio/src/App.jsx`, add the new template to the switch:
    ```javascript
    {settings.activeTemplate === 'custom' && <TemplateCustom data={data} />}
    ```
4.  **Register in Admin Dashboard**:
    Open `admin/src/pages/TemplateTheme.jsx` and add it to the `TEMPLATES` array:
    ```javascript
    {
      id: 'custom',
      name: 'Custom Theme',
      description: 'The theme I just built.',
      colors: ['#your_color', '#accent'],
      preview: 'linear-gradient(...)'
    }
    ```

Now you can select it from your dashboard and see it live!
