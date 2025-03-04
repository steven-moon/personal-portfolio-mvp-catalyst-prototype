import React from 'react';
import { toast } from "sonner";

const HomeEditor = () => {
  return (
    <div className="container py-12 mx-auto page-transition">
      <h1 className="text-3xl font-bold mb-8 text-neu-accent">Home Page Editor</h1>
      <p className="mb-6">This is a placeholder for the Home page editor. In a complete implementation, this would allow editing of the home page content.</p>
      
      <div className="neu-flat p-6">
        <h2 className="text-xl font-semibold mb-4">Coming Soon</h2>
        <p>The full implementation of this editor would include:</p>
        <ul className="list-disc ml-6 mt-2 space-y-1">
          <li>Hero section management</li>
          <li>Featured projects section</li>
          <li>Call-to-action elements</li>
          <li>Testimonials section</li>
          <li>Page layout customization</li>
        </ul>
        
        <button 
          className="mt-6 neu-flat px-4 py-2 hover:shadow-neu-convex transition-medium"
          onClick={() => toast.info('This functionality is not yet implemented')}
        >
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default HomeEditor; 