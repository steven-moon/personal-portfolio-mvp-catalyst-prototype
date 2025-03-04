import React from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from "sonner";
import NeumorphicButton from '@/components/ui/NeumorphicButton';
import { FileEdit, Settings, BookOpen, FileText, User, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

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

const Dashboard = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  
  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/');
  };
  
  const handleCardClick = (section: string) => {
    if (section === 'Blog Posts') {
      navigate('/admin/blog');
    } else if (section === 'Projects') {
      navigate('/admin/projects');
    } else if (section === 'About Me') {
      navigate('/admin/about');
    } else if (section === 'Contact Page') {
      navigate('/admin/contact');
    } else if (section === 'Home Page') {
      navigate('/admin/home');
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
          title="Home Page" 
          description="Customize your website's landing page"
          icon={FileEdit}
          onClick={() => handleCardClick('Home Page')}
        />
        
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
          title="Contact Page" 
          description="Manage contact information and form settings"
          icon={FileEdit}
          onClick={() => handleCardClick('Contact Page')}
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

export default Dashboard; 