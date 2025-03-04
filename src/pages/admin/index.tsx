import React, { useEffect } from 'react';
import { useNavigate, Routes, Route } from 'react-router-dom';
import { toast } from "sonner";
import { useAuth } from '@/contexts/AuthContext';

// Admin page components
import Dashboard from './Dashboard';
import BlogList from './blog/BlogList';
import BlogEditorPage from './blog/BlogEditorPage';
import ProjectsListPage from './projects/ProjectsList';
import ProjectEditorPage from './projects/ProjectEditorPage';
import AboutEditor from './about/AboutEditor';
import ContactEditor from './contact/ContactEditor';
import HomeEditor from './home/HomeEditor';

const Admin = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  
  useEffect(() => {
    // Check if the user is authenticated using the auth context
    if (!isAuthenticated) {
      toast.error('Please login to access the admin dashboard');
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);
  
  // If not authenticated, don't render admin routes
  if (!isAuthenticated) {
    return null;
  }
  
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/blog" element={<BlogList />} />
      <Route path="/blog/new" element={<BlogEditorPage />} />
      <Route path="/blog/edit/:id" element={<BlogEditorPage />} />
      <Route path="/projects" element={<ProjectsListPage />} />
      <Route path="/projects/new" element={<ProjectEditorPage />} />
      <Route path="/projects/edit/:id" element={<ProjectEditorPage />} />
      <Route path="/about" element={<AboutEditor />} />
      <Route path="/contact" element={<ContactEditor />} />
      <Route path="/home" element={<HomeEditor />} />
    </Routes>
  );
};

export default Admin; 