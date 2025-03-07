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
import SiteSettingsEditor from './settings/SiteSettingsEditor';
import MessagesList from './contact/MessagesList';
import MessageDetail from './contact/MessageDetail';

const Admin = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useAuth();
  
  useEffect(() => {
    // Only redirect if not loading and not authenticated
    if (!isLoading && !isAuthenticated) {
      toast.error('Please login to access the admin dashboard');
      navigate('/login');
    }
  }, [isAuthenticated, navigate, isLoading]);
  
  // Show nothing while authentication is being checked
  if (isLoading) {
    return <div className="flex justify-center items-center h-full">Loading...</div>;
  }
  
  // If not authenticated and not loading, don't render admin routes
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
      <Route path="/settings" element={<SiteSettingsEditor />} />
      <Route path="/messages" element={<MessagesList />} />
      <Route path="/messages/:id" element={<MessageDetail />} />
    </Routes>
  );
};

export default Admin; 
