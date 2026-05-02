import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ProfileManager from './pages/ProfileManager';
import ProjectsManager from './pages/ProjectsManager';
import SkillsManager from './pages/SkillsManager';
import ExperienceManager from './pages/ExperienceManager';
import TestimonialsManager from './pages/TestimonialsManager';
import TemplateTheme from './pages/TemplateTheme';
import Settings from './pages/Settings';

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f0f23] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;
  return children;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <Layout>
              <Routes>
                <Route index element={<Dashboard />} />
                <Route path="profile" element={<ProfileManager />} />
                <Route path="projects" element={<ProjectsManager />} />
                <Route path="skills" element={<SkillsManager />} />
                <Route path="experience" element={<ExperienceManager />} />
                <Route path="testimonials" element={<TestimonialsManager />} />
                <Route path="templates" element={<TemplateTheme />} />
                <Route path="settings" element={<Settings />} />
              </Routes>
            </Layout>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
