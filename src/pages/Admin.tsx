
import React, { useEffect } from 'react';
import { useNavigate, Routes, Route } from 'react-router-dom';
import { toast } from "sonner";
import NeumorphicButton from '@/components/ui/NeumorphicButton';
import { FileEdit, Settings, BookOpen, FileText, User, LogOut } from 'lucide-react';
import BlogPostsList from '@/components/admin/BlogPostsList';
import BlogEditor from '@/components/admin/BlogEditor';
import ProjectsList from '@/components/admin/ProjectsList';
import ProjectEditor from '@/components/admin/ProjectEditor';

const AdminCard = ({ title, description, icon: Icon, onClick }: { 
  title: string; 
  description: string;
  icon: React.ElementType;
  onClick: () => void;
}) => (
  <div 
    className="neu-flat p-6 cursor-pointer hover:shadow-neu-convex transition-medium"
    onClick={onClick}
  >
    <div className="flex items-center mb-3">
      <div className="mr-3 p-2 neu-pressed rounded-lg">
        <Icon className="text-neu-accent" size={24} />
      </div>
      <h3 className="text-xl font-semibold">{title}</h3>
    </div>
    <p className="text-neu-text-secondary">{description}</p>
  </div>
);

const AdminDashboard = () => {
  const navigate = useNavigate();
  
  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    toast.success('Logged out successfully');
    navigate('/');
  };
  
  const handleCardClick = (section: string) => {
    if (section === 'Blog Posts') {
      navigate('/admin/blog');
    } else if (section === 'Projects') {
      navigate('/admin/projects');
    } else {
      toast.info(`${section} editor would open here`);
    }
  };

  return (
    <div className="container py-12 mx-auto page-transition">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-bold text-neu-accent">Admin Dashboard</h1>
        <NeumorphicButton
          variant="secondary"
          className="flex items-center gap-2"
          onClick={handleLogout}
        >
          <LogOut size={18} />
          Logout
        </NeumorphicButton>
      </div>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AdminCard 
          title="Blog Posts" 
          description="Create, edit, and manage your blog posts"
          icon={BookOpen}
          onClick={() => handleCardClick('Blog Posts')}
        />
        
        <AdminCard 
          title="Projects" 
          description="Update your project portfolio and showcase"
          icon={FileText}
          onClick={() => handleCardClick('Projects')}
        />
        
        <AdminCard 
          title="About Me" 
          description="Edit your personal information and skills"
          icon={User}
          onClick={() => handleCardClick('About Me')}
        />
        
        <AdminCard 
          title="Home Page" 
          description="Customize your website's landing page"
          icon={FileEdit}
          onClick={() => handleCardClick('Home Page')}
        />
        
        <AdminCard 
          title="Site Settings" 
          description="Manage global website settings and appearance"
          icon={Settings}
          onClick={() => handleCardClick('Site Settings')}
        />
      </div>
    </div>
  );
};

const Admin = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Check if the user is authenticated
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    if (!isAuthenticated) {
      toast.error('Please login to access the admin dashboard');
      navigate('/login');
    }
  }, [navigate]);
  
  return (
    <Routes>
      <Route path="/" element={<AdminDashboard />} />
      <Route path="/blog" element={<BlogPostsList />} />
      <Route path="/blog/new" element={<BlogEditor />} />
      <Route path="/blog/edit/:id" element={<BlogEditor />} />
      <Route path="/projects" element={<ProjectsList />} />
      <Route path="/projects/new" element={<ProjectEditor />} />
      <Route path="/projects/edit/:id" element={<ProjectEditor />} />
    </Routes>
  );
};

export default Admin;
