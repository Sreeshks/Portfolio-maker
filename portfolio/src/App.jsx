import { useEffect, useState } from 'react';
import api from './api';
import TemplateMinimal from './templates/TemplateMinimal';
import TemplateBold from './templates/TemplateBold';
import TemplateDark from './templates/TemplateDark';
import TemplateBento from './templates/TemplateBento';
import TemplateCyberpunk from './templates/TemplateCyberpunk';
import TemplateEditorial from './templates/TemplateEditorial';
import TemplateSpatial from './templates/TemplateSpatial';
import TemplateJapandi from './templates/TemplateJapandi';

export default function App() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadData() {
      try {
        const [
          settingsRes,
          profileRes,
          projectsRes,
          skillsRes,
          experienceRes,
          educationRes,
          testimonialsRes,
          blogRes,
          logosRes
        ] = await Promise.all([
          api.get('/settings'),
          api.get('/profile'),
          api.get('/projects'),
          api.get('/skills'),
          api.get('/experience'),
          api.get('/education'),
          api.get('/testimonials'),
          api.get('/blog'),
          api.get('/logos')
        ]);

        const settings = settingsRes.data;

        // Setup SEO
        document.title = settings.seoTitle || 'Portfolio';
        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc) {
          metaDesc.setAttribute('content', settings.seoDescription || '');
        } else {
          const meta = document.createElement('meta');
          meta.name = 'description';
          meta.content = settings.seoDescription || '';
          document.head.appendChild(meta);
        }

        // Apply primary color as CSS variable for global use
        document.documentElement.style.setProperty('--primary-color', settings.primaryColor || '#6366f1');
        document.documentElement.style.setProperty('--accent-color', settings.accentColor || '#f59e0b');

        setData({
          settings,
          profile: profileRes.data,
          projects: projectsRes.data,
          skills: skillsRes.data,
          experience: experienceRes.data,
          education: educationRes.data,
          testimonials: testimonialsRes.data,
          blog: blogRes.data,
          logos: logosRes.data
        });
      } catch (err) {
        console.error(err);
        setError('Failed to load portfolio data. Please ensure the backend is running.');
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a]">
        <div className="w-12 h-12 border-4 border-gray-600 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#0a0a0a] text-white p-6 text-center">
        <div className="text-4xl mb-4">⚠️</div>
        <p className="text-xl text-red-400 mb-2">{error}</p>
        <p className="text-gray-500">Make sure you have started the backend API server on port 5000.</p>
      </div>
    );
  }

  const { settings } = data;
  const fontFamily = settings.fontFamily || 'Inter';

  const containerStyle = {
    fontFamily: `"${fontFamily}", sans-serif`
  };

  return (
    <div style={containerStyle} className="text-base">
      {settings.activeTemplate === 'minimal' && <TemplateMinimal data={data} />}
      {settings.activeTemplate === 'bold' && <TemplateBold data={data} />}
      {settings.activeTemplate === 'dark' && <TemplateDark data={data} />}
      {settings.activeTemplate === 'bento' && <TemplateBento data={data} />}
      {settings.activeTemplate === 'cyberpunk' && <TemplateCyberpunk data={data} />}
      {settings.activeTemplate === 'editorial' && <TemplateEditorial data={data} />}
      {settings.activeTemplate === 'spatial' && <TemplateSpatial data={data} />}
      {settings.activeTemplate === 'japandi' && <TemplateJapandi data={data} />}
      {!['minimal', 'bold', 'dark', 'bento', 'cyberpunk', 'editorial', 'spatial', 'japandi'].includes(settings.activeTemplate) && (
        <TemplateMinimal data={data} />
      )}
    </div>
  );
}
